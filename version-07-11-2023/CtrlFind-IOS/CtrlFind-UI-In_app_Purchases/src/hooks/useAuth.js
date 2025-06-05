import {useContext, useEffect} from 'react';
import {useImmer} from 'use-immer';
import * as Yup from 'yup';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AuthContext from '../context/AuthContext';
import auth from '../server/auth';
import {useNavigation} from '@react-navigation/native';
import localStorage from '../server/localStorage';
import {useDispatch, useSelector} from 'react-redux';
import {
  savePhoneNumber,
  saveRegisterData,
  sendOtp,
} from '../store/reducers/forgetPassword';
import jwt_decode from 'jwt-decode';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import toast from '../server/toast/auth';
import useCountrtCode from './useCountrtCode';
import helpers from '../constants/helpers';
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default useAuth = () => {
  const navigation = useNavigation();
  const {dialCode} = useCountrtCode();

  const dispatch = useDispatch();
  const {confirm, register_data} = useSelector(state => state.forgetPassword);

  const [state, setState] = useImmer({
    isValidNumber: false,
    isEditProfile: false,
    isEditAddress: false,
    loading: false,
    RegisterInitialValues: {
      email: '',
      name: '',
      password: '',
      avatar: null,
      password_confirmation: '',
      phone: '',
      about: '',
      home_address: '',
      office_address: '',
      place_id: '',
      place_id_office: '',
      apartment_number: '',
      home_lat: '',
      home_lng: '',
      office_lat: '',
      office_lng: '',
      isPayingTax: false,
      gst: '',
      pst: '',
      company_registration_name: '',
      province_id: '',
      state: '',
      suit_number: '',
    },
    address: {
      label: '',
      address: '',
    },
    userExtra: {
      total_orders: 0,
      total_balance: 0,
      rating: {
        avg: 0,
        total: 0,
      },
      addresses: [],
    },
  });

  useEffect(() => {
    GoogleSignin.configure({});
  }, []);
  useEffect(() => {
    if (!state.RegisterInitialValues.phone) {
      setState(draft => {
        draft.RegisterInitialValues = {
          phone: dialCode,
        };
      });
    }
  }, [dialCode]);

  const {trigger, user} = useContext(AuthContext);

  // Schema for Login form
  // phone: state.isValidNumber?Yup.string().required().label('Phone'): Yup.string(),
  //     password: state.isValidNumber ? Yup.string().required("requiired").label('Password') : Yup.string(),
  const LoginValidationSchema = Yup.object().shape({
    phone: Yup.string(),
    password: Yup.string(),
  });

  // Schema for register from
  const RegisterValidationSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    email: Yup.string().required().email().label('Email'),
    phone: !state.isEditProfile
      ? Yup.string().required().label('Phone')
      : Yup.string().nullable(),
    password: !state.isEditProfile
      ? Yup.string()
          .required()
          .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1}).*$/,
            'Must Contain one special Character',
          )
          .label('Password')
      : Yup.string(),
    password_confirmation: !state.isEditProfile
      ? Yup.string()
          .required('Please confirm your password')
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
      : Yup.string(),
    about: Yup.string().nullable(),
    home_address: Yup.string().nullable(),
    office_address: Yup.string().nullable(),
    isPayingTax: Yup.boolean(),
    pst: Yup.string().when('isPayingTax', {
      is: true,
      then: Yup.string().required().label('PST number'),
    }),
    gst: Yup.string().when('isPayingTax', {
      is: true,
      then: Yup.string().required().label('GST number'),
    }),
    company_registration_name: Yup.string().when('isPayingTax', {
      is: true,
      then: Yup.string().required().label('Registered company name'),
    }),
    province_id: Yup.string().when('isPayingTax', {
      is: true,
      then: Yup.string().required().label('Province'),
    }),
  });

  // Schema for addresses
  const AddressessValidationSchema = Yup.object().shape({
    label: Yup.string().required().label('Label'),
    address: Yup.string().required().label('Address'),
  });
  // Set home place_id
  const setPlaceId = (val, place, crds, state) => {
    setState(draft => {
      draft.RegisterInitialValues.place_id = val;
      draft.RegisterInitialValues.home_address = place;
      if (crds?.lat) {
        draft.RegisterInitialValues.home_lat = crds?.lat;
        draft.RegisterInitialValues.home_lng = crds?.lng;
      }
      if (state) {
        draft.RegisterInitialValues.state = state;
      }
    });
  };
  // Set office place_id
  const setOfficePlaceId = (val, place, crds, state) => {
    setState(draft => {
      draft.RegisterInitialValues.place_id_office = val;
      draft.RegisterInitialValues.office_address = place;
      if (crds?.lat) {
        draft.RegisterInitialValues.office_lat = crds?.lat;
        draft.RegisterInitialValues.office_lng = crds?.lng;
      }
      // if (state) {
      //   draft.RegisterInitialValues.state = state;
      // }
    });
  };

  // Login
  const loginHandler = values => {
    state.isValidNumber ? login(values) : validate_phone(values);
  };

  const login = values => {
    setState(draft => {
      draft.loading = true;
    });

    auth.login(values).then(response => {
      setState(draft => {
        draft.loading = false;
      });
      if (!response.ok) {
        toast.login_failed(response.data?.message);
      } else {
        localStorage.saveToken(response?.data?.token).then(() => {
          setTimeout(() => {
            trigger.updateUser(response.data.user);
          }, 300);
        });
      }
    });
  };

  // Login with facebook
  const loginWithFacebook = () => {
    // if (Platform.OS === "android") {
    //   LoginManager.setLoginBehavior("web_only")
    //
    //
    // }
    LoginManager.logInWithPermissions([
      'email',
      'public_profile',
      // 'user_friends',
    ]).then(
      function (result) {
        if (result.isCancelled) {
        }
        if (
          result.declinedPermissions &&
          result.declinedPermissions.includes('email')
        )
          toast.register_failed('No permission for email , Email is required.');
        else {
          const infoRequest = new GraphRequest(
            '/me?fields=email,name,picture.type(large)',
            null,
            (error, user) => {
              if (error) toast.login_with_provider_failed('facebook');
              else {
                const {
                  name,
                  email,
                  id,
                  picture: {
                    data: {url},
                  },
                } = user;
                loginWithSocialAccount('facebook', {
                  id,
                  name,
                  email,
                  photo: url,
                });
              }
            },
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log(error);
        toast.login_with_provider_failed('facebook');
      },
    );
  };

  // Login with google
  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {
        user: {id, name, email, photo},
      } = userInfo;
      await loginWithSocialAccount('google', {id, name, email, photo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      } else {
        toast.login_with_provider_failed('google');
      }
    }
  };

  //Login with Apple

  async function loginWithApple() {
    // performs login request

    console.log('call apple login');

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // alert("user data=>"+JSON.stringify(appleAuthRequestResponse))

      if (appleAuthRequestResponse.email != null) {
        // alert("user data no email ="+JSON.stringify(appleAuthRequestResponse))
        let user = {
          id: appleAuthRequestResponse.user,
          name:
            appleAuthRequestResponse?.fullName?.givenName +
            appleAuthRequestResponse?.fullName?.familyName,
          email: appleAuthRequestResponse.email,
          picture: '',
        };

        await AsyncStorage.setItem('AppleData', JSON.stringify(user));
        await loginWithSocialAccount('apple', user);
      } else {
        // alert("user data  email ="+JSON.stringify(appleAuthRequestResponse))

        const {email} = jwt_decode(appleAuthRequestResponse.identityToken);
        let user = {
          id: appleAuthRequestResponse.user,
          name:
            appleAuthRequestResponse?.fullName?.givenName +
            appleAuthRequestResponse?.fullName?.familyName,
          email: email,
          picture: '',
        };
        AsyncStorage.setItem('AppleData', JSON.stringify(user));
        // alert("before login "+JSON.stringify(user))
        await loginWithSocialAccount('apple', user);
      }
    }
  }

  // save social account info on server and getting user
  const loginWithSocialAccount = (provider, values) => {
    // alert("loginWithSocialAccount==>"+JSON.stringify(values))
    setState(draft => {
      draft.loading = true;
    });
    return auth.loginUserFromSocialAccount(provider, values).then(response => {
      setState(draft => {
        draft.loading = false;
      });
      if (!response.ok) {
        toast.login_failed(response.data?.message);
      } else {
        // toast.login_with_provider_success(provider);
        localStorage.saveToken(response.data?.token).then(() =>
          setTimeout(() => {
            trigger.updateUser(response.data.user);
          }, 300),
        );
      }
    });
  };

  // validate phone
  const validate_phone = values => {
    setState(draft => {
      draft.loading = true;
    });
    auth.phoneVerification(values).then(response => {
      setState(draft => {
        draft.loading = false;
      });
      if (!response.ok) toast.validate_phone_failed(response.data?.message);
      else {
        setState(draft => {
          draft.isValidNumber = true;
        });
      }
    });
  };

  // Register handler
  const register = values => {
    console.log("sign up values==",JSON.stringify(values?.password))
    setState(draft => {
      draft.loading = true;
    });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(values?.password)) {
      // Password meets all the requirements
      auth.register_validation(values).then(response => {
        setState(draft => {
          draft.loading = false;
        });
        if (!response.ok) toast.register_failed(response.data[0]);
        else {
          dispatch(savePhoneNumber({phoneNumber: values.phone}));
          dispatch(saveRegisterData(values));
          dispatch(sendOtp({previousScreen: 'register'}));
        }
      });
    } else {
      // Password does not meet the requirements
      Alert.alert(
          'Error',
          'Password must contain at least one capital letter, one lowercase letter, one special character, and one digit. It should be at least 8 characters long.'
      );
      setState(draft => {
        draft.loading = false;
      });
    }

  };

  const userRegister = () => {
    console.log("sign up data,,==",JSON.stringify(register_data))
    setState(draft => {
      draft.loading = true;
    });
    auth.register(register_data).then(response => {
      console.log("register response===",JSON.stringify(response))
      setState(draft => {
        draft.loading = false;
      });
      if (!response.ok) toast.register_failed(response?.data[0]);
      else {
        toast.register_success();
        setTimeout(() => {
          navigation.navigate('login');
        }, 300);
      }
    });
  };

  const userRegisterOTP = () => {
    setState(draft => {
      draft.loading = true;
    });
    auth.register(register_data).then(response => {
      setState(draft => {
        draft.loading = false;
      });
      toast.register_success();
      setTimeout(() => {
        navigation.navigate('login');
      }, 300);
    });
  };

  // CONFIRM OTP
  const confirmRegisterOtp = code => {
    if (code.length !== 6) return;
    setState(draft => {
      draft.loading = true;
    });
    confirm
      .confirm(code)
      .then(response => {
        if (response) {
          userRegister();
        } else {
          setState(draft => {
            draft.loading = false;
          });
        }
      })
      .catch(() => {
        toast.otp_failed();
        setState(draft => {
          draft.loading = false;
        });
      });
  };

  // Edit Profile Handler
  function updateValues(values) {
    setState(draft => {
      draft.RegisterInitialValues = values;
      draft.isEditProfile = true;
    });
  }

  // Edit Address Handler
  function updateAddressValues(values) {
    setState(draft => {
      draft.address = values;
      draft.isEditAddress = true;
    });
  }

  // Edit Address state
  function editAddressState(value) {
    setState(draft => {
      draft.address = {
        label: '',
        address: '',
      };
      draft.isEditAddress = value;
    });
  }

  // getting profile
  const get_profile = () => {
    // console.log("idididi ==>"+user.id)

    setState(draft => {
      draft.loading = true;
    });
    auth.getProfile(user.id).then(response => {
      setState(draft => {
        draft.loading = false;
      });
      if (!response.ok) toast.get_profile_failed();
      else {
        if (response?.data) {
          console.log("profile data on api call ==>"+JSON.stringify(response.data))
          onSuccessResponse(response);
        }
      }
    });
  };

  // edit profile
  const edit_profile = values => {
    console.log('values of profile data' + JSON.stringify(values));
    setState(draft => {
      draft.loading = true;
    });
    auth.editProfile(values).then(response => {
      setState(draft => {
        draft.loading = false;
      });
      console.log(response);
      if (!response.ok) toast.edit_profile_failed(response?.data[0]);
      else {
        if (response.data) onSuccessResponse(response);
      }
    });
  };

  //Adding address
  const AddAddress = async values => {
    setState(draft => {
      draft.loading = true;
    });
    const resp = await auth.addUserAddress(values);
    setState(draft => {
      draft.loading = false;
    });
    if (!resp.ok) {
      toast.add_address_failed(resp.data?.message);
    } else {
      if (resp.data) onSuccessResponse(resp);
    }
  };

  const deleteAddress = async id => {
    setState(draft => {
      draft.loading = true;
    });
    const resp = await auth.deleteAddress(id);
    setState(draft => {
      draft.loading = false;
    });
    if (!resp.ok) {
      toast.delete_address_failed('');
    } else {
      filteredItem = state.userExtra.addresses.filter(a => a.id !== id);
      setState(draft => {
        draft.userExtra.addresses = filteredItem;
      });
    }
  };

  // Update Address
  const UpdateAddress = async (id, values) => {
    setState(draft => {
      draft.loading = true;
    });
    const resp = await auth.editUserAddress(id, values);
    setState(draft => {
      draft.loading = false;
    });
    if (!resp.ok) {
      toast.add_address_failed(resp.data?.message);
    } else {
      if (resp.data) onSuccessResponse(resp);
    }
  };

  // set avatar
  const setAvatar = avatar => {
    setState(draft => {
      draft.RegisterInitialValues.avatar = avatar;
    });
  };

  const onPressGuest = () => {
    trigger.updateUser(helpers.guest);
  };

  function onSuccessResponse(response) {
    const {user, addresses, total_orders, total_balance, rating} =
      response.data;
    trigger.updateUser(user);
    setState(draft => {
      draft.userExtra = {
        total_orders,
        total_balance,
        rating,
        addresses,
      };
    });
    setTimeout(() => {
      navigation.navigate(
        helpers.getRole(user?.role_id) === 'Service Provider'
          ? 'my_profile'
          : 'buyer_profile',
      );
    }, 300);
  }

  return {
    LoginValidationSchema,
    RegisterValidationSchema,
    AddressessValidationSchema,
    loginHandler,
    login,
    register,
    confirmRegisterOtp,
    validate_phone,
    updateValues,
    editAddressState,
    updateAddressValues,
    get_profile,
    edit_profile,
    loginWithFacebook,
    loginWithGoogle,
    loginWithApple,
    setAvatar,
    setPlaceId,
    setOfficePlaceId,
    onPressGuest,
    userRegister,
    userRegisterOTP,
    AddAddress,
    UpdateAddress,
    deleteAddress,
    state,
  };
};
