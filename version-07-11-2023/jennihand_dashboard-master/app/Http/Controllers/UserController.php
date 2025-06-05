<?php

namespace App\Http\Controllers;

use Mail;
use Image;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Order;
use App\Models\Province;
use App\Mail\VerifyEmail;
use App\Models\UserLogin;
use App\Models\UserReview;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\UserAddresses;
use App\Models\UserSubscriptions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Notifications\PushNotification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;



class UserController extends Controller
{

    //signup valudations
    function check_signup_validation()
    {
        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'phone' => 'required|unique:users,phone',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed|min:8|regex:/^.*(?=.{1,})(?=.*[@$!%*#?&]).*$/',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
    }

    // signup
    function signup()
    {
        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'phone' => 'required|unique:users,phone',
            'email' => 'required|email|unique:users,email',
            "password" => "required|confirmed|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]+$/",
//            'password' => 'required|confirmed|min:8|regex:/^.*(?=.{1,})(?=.*[@$!%*#?&]).*$/',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $user = new User();
        $user->name = \Request::input('name');
        $user->phone = \Request::input('phone');
        $user->email = \Request::input('email');
        $user->role_id = 2;
        $user->phone_number_confirmed = 1;
        $user->password = Hash::make(\Request::input('password'));

        if ($user->save()) {
            return response()->json([
                'type' => 'success',
                'user' => $this->me($user->id),
                'token' => $user->createToken('token')->plainTextToken
            ], 200);
        }
        return response()->json(['type' => 'error']);
    }

    public function testApi(Request $request)
    {
        $users = DB::table('user_subscriptions')->get();
        return $users;
    }


    // phone verification
    function updatePhoneVerification()
    {

        $email = \Request::input('email');

        $user = User::where('email', trim($email))->first();

        if ($user) {
            $user->phone_number_confirmed = 1;

            if ($user->save()) {
                return response()->json([
                    'type' => 'success',
                    'message' => 'Phone number verified'
                ], 200);
            }
        }

        return response()->json([
            'type' => 'error',
            'message' => 'Error verifing phone number.'
        ], 402);
    }

    // validate phone number
    function validatePhone(Request $request)
    {
        $lang = $request->lang;
        $user = User::where('phone', $request->phone)->first();
        if (!$user) {
            if($lang == 'fr')
                $message = "Ces identifiants ne correspondent pas à nos enregistrements.";
            elseif($lang == 'en')
                $message = "These credentials do not match our records.";
            else
                $message = "These credentials do not match our records.";
            return response()->json([
                'type' => 'error',
                'message' => $message
            ], 402);
        }
        return response()->json([
            'type' => 'success',
            'message' => 'Phone number is valid'
        ], 200);
    }

    function updateDeviceToken()
    {
        request()->validate([
          'push_token' => 'required',
        ]);
        $user = auth()->user();
        $user->push_token = request()->push_token;
        $user->save();
        return response()->json(['message' => "success"]);
    }

    public function deleteAccount(Request $request)
    {
        if (array_key_exists('email', $request->post())){
            $user = User::where('email', $request->email)->first();
            $user->delete();
            $message = "Your account deleted.";
            return response()->json([
                'type' => 'success',
                'message' => $message
            ], 200);
        }
        if (array_key_exists('phone', $request->post())){
            $user = User::where('phone', $request->phone)->first();
            $user->delete();
            $message = "Your account deleted.";
                return response()->json([
                    'type' => 'success',
                    'message' => $message
                ], 200);
        }
    }

    // login
    function login(Request $request)
    {
        $lang = $request->lang;
        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            $message = "These credentials do not match our records.";
            
            if(!empty($lang) && $lang === "fr")
                $message = "Ces identifiants ne correspondent pas à nos enregistrements.";
            return response()->json([
                'type' => 'error',
                'message' => $message
            ], 402);
        }

        if ($user->phone_number_confirmed != 1) {
            $message = "User phone number not verified.";
            if(!empty($lang))
                $message = "Le numéro de téléphone de l'utilisateur n'a pas été vérifié.";
            return response()->json([
                'type' => 'error',
                'message' => $message
            ], 402);
        }

        $token = $user->createToken('token')->plainTextToken;
        $user->role_id = 2;
        $user->save();

        $response = [
            'type' => 'success',
            'user' => $this->me($user->id),
            'token' => $token
        ];

        return response()->json($response, 200);
    }

    function authUser() {
        $user_id = \Auth::user()->id;
        $user =  $this->me($user_id);
        return response()->json($user, 200);
    }

    // getting user
    function getUser($user_id)
    {
        try {
            $user =  $this->me($user_id);
            $total_orders = Order::where($user->role_id === 3 ? 'provider_id' : 'user_id' , $user->id)->count();
            $user_address = UserAddresses::where("user_id",$user_id)->get(['id', 'address_1' , 'label' , 'place_id']);
            $total_balance = 0;
            $avg = UserReview::where('user_id' , $user_id)->get()->avg('rating');
            $total = UserReview::where('user_id' , $user_id)->count();
            $buyer_province = 'Buyer province is not set.';
            if ($user->buyer_province_id != null)
                $buyer_province = Province::find($user->buyer_province_id);
            $user['buyer_province'] = $buyer_province;
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            return response()->json(['user' => $user ,
            'total_orders' => $total_orders ,'total_balance' => $total_balance,
            'rating' => $rating , 'addresses' => $user_address], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => "can't get user from this id"] ,401);
        }

    }

    // edit profile
    function editProfile()
    {
        $user_id = \Auth::user()->id;
        $lang = request()->lang;

        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user_id,
            'password' => 'nullable|min:6'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $user_id = \Auth::user()->id;
        $user = User::where('id', $user_id)->first();

        if (\Request::input('avatar') !== $user->avatar) {
            request()->validate(['avatar' => 'required|image64:jpeg,jpg,png']);
            $image = request()->get('avatar');
            $imagename = $this->makeImage($image);
            $user->avatar = $imagename;
        }

        $user->name = \Request::input('name');
        $user->email = \Request::input('email');

        if(\Request::input('home_address')) {
            $user->address_home = \Request::input('home_address');
        }
        if(\Request::input('office_address')) {
            $user->address_office = \Request::input('office_address');
        }

        if(\Request::input('website')) {
            $user->website = \Request::input('website');
        }

        $user->is_paying_taxes = \Request::input('isPayingTax');

        $user->is_agree = \Request::input('is_agree');

        if(\Request::input('pst')) {
            $user->pst = \Request::input('pst');
        }

        if(\Request::input('gst')) {
            $user->gst = \Request::input('gst');
        }

        if(\Request::input('company_registration_name')) {
            $user->company_registration_name = \Request::input('company_registration_name');
        }

        if(\Request::input('apartment_number')) {
            $user->apartment_number = \Request::input('apartment_number');
        }

        if(\Request::input('suit_number')) {
            $user->suit_number = \Request::input('suit_number');
        }

        if(\Request::input('province_id')) {
            $user->province_id = \Request::input('province_id');
        }

        // if(\Request::input('state')) {
        //     $buyer_province = Province::where('name', \Request::input('state'))->first();
        //     // $user->buyer_province_id = $buyer_province->id;
        // }

        if (\Request::input('state')) {
            $buyer_province = Province::where('name', \Request::input('state'))->first();
            if ($buyer_province) {
                $user->buyer_province_id = $buyer_province->id;
            } else {
                $stateErr = trans('validation.address_outside_canada', [], $lang);
                return response()->json([$stateErr], 402);
            }
        }

        if(\Request::input('home_lat')) {
            $user->home_lat = \Request::input('home_lat');
            $user->home_lng = \Request::input('home_lng');
        }

        if(\Request::input('office_lat')) {
            $user->provider_lat = \Request::input('office_lat');
            $user->provider_lng = \Request::input('office_lng');
            $user->office_lat = \Request::input('office_lat');
            $user->office_lng = \Request::input('office_lng');
        }

        if(\Request::input('lat')) {
            if(!$user->provider_lat) {
                $user->provider_lat = \Request::input('lat');
                $user->provider_lng = \Request::input('lng');
            }
        }

        if(\Request::input('state')) {
            $user->state = \Request::input('state');
        }

        if(\Request::input('place_id')) {
            $user->place_id = \Request::input('place_id');
        }

        if(\Request::input('place_id_office')) {
            $user->place_id_office = \Request::input('place_id_office');
        }

        if(request()->about) {
            $user->about = request()->about;
        }

        if (\Request::input('phone')) {
            $validator = Validator::make(\Request::all(), [
                'phone' => 'required|unique:users,phone,' . $user_id,
            ]);
            if ($validator->fails()) {
                $errors = $validator->errors()->all();
                return response()->json($errors, 402);
            }
            $user->phone = \Request::input('phone');
        }

        if (!empty(\Request::input('password'))) {
            $user->password = Hash::make(\Request::input('password'));
        }

        $total_orders = Order::where($user->role_id === 3 ? 'provider_id' : 'user_id' , $user->id)->count();

        $total_balance = 0;
            $avg = UserReview::where('user_id' , $user_id)->get()->avg('rating');
            $total = UserReview::where('user_id' , $user_id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];

        if ($user->save()) {
            $user_address = UserAddresses::where("user_id",$user->id)->get(['id', 'address_1' , 'label' , 'place_id']);


            return response()->json(['type' => 'success' ,
            'user' => $this->me($user->id) , 'total_orders' => $total_orders,
            'total_balance' => $total_balance, 'rating' => $rating ,
            'addresses' => $user_address, 'buyer_province' => $buyer_province]);
        }

        return response()->json(['type' => 'error']);
    }


    function getProvincesList()
    {
       $provinces = Province::all();
       return response()->json($provinces);
    }

    // add user address
    function addUserAddress()
    {

        $user = \Auth::user();

        $subscribe = $this->CheckIfUerSubscribed($user);

        $count = UserAddresses::where("user_id",$user->id)->count() + 2;
        if($subscribe){
        if($subscribe['package']->allowed_addresses > $count){
            $validator = Validator::make(\Request::all(), [
                'address' => 'required',
            ]);
        if ($validator->fails()) {
                $errors = $validator->errors()->all();
                return response()->json($errors, 402);
        }

        $profile = new UserAddresses();
        $profile->name = $user->name;
        $profile->city = "";
        $profile->region = "";
        $profile->post_code = "";
        $profile->label = request()->label;
        $profile->address_1 = request()->address;
        $profile->place_id = request()->place_id;
        $profile->user_id = $user->id;
        $profile->save();
        $total_orders = Order::where($user->role_id === 3 ? 'provider_id' : 'user_id' , $user->id)->count();
        $total_balance = 0;
        $avg = UserReview::where('user_id' , $user->id)->get()->avg('rating');
        $total = UserReview::where('user_id' , $user->id)->count();
        $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
        if ($profile->save()) {
            $user_address = UserAddresses::where("user_id",$user->id)->get(['id', 'address_1' , 'label' , 'place_id']);
            return response()->json(['type' => 'success' ,
            'user' => $this->me($user->id) , 'total_orders' => $total_orders,
            'total_balance' => $total_balance, 'rating' => $rating , 'addresses' => $user_address]);
        }
        }else
        {
            return response()->json(['message' => "allowed addresses limit exceed."],400);
        }
        }else
        {
            return response()->json(['message' => "allowed addresses limit exceed."],400);
        }
    }

    function editAddress(UserAddresses $address) {
        $user = User::find($address->user_id);
        $validator = Validator::make(\Request::all(), [
            'address' => 'required',
        ]);
        if ($validator->fails()) {
                $errors = $validator->errors()->all();
                return response()->json($errors, 402);
        }
        $address->label = request()->label;
        $address->address_1 = request()->address;
        $address->place_id = request()->place_id;
        $address->save();
        $total_orders = Order::where($user->role_id === 3 ? 'provider_id' : 'user_id' , $user->id)->count();
        $total_balance = 0;
        $avg = UserReview::where('user_id' , $user->id)->get()->avg('rating');
        $total = UserReview::where('user_id' , $user->id)->count();
        $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
        if ($address->save()) {
            $user_address = UserAddresses::where("user_id",$user->id)->get(['id', 'address_1' , 'label' , 'place_id']);
            return response()->json(['type' => 'success' ,
            'user' => $this->me($user->id) , 'total_orders' => $total_orders,
            'total_balance' => $total_balance, 'rating' => $rating , 'addresses' => $user_address]);
        }
    }

    function deleteAddress(UserAddresses $address) {
        $address->delete();
        return response()->noContent();
    }

    // forgot password
    function forgotPassword(Request $request)
    {

        $email = \Request::input('email');
        $phone = \Request::input('phone');
        $lang = $request->lang;

        $message = "Please provide email or phone to reset password.";
        if (!empty($email)) {
            $user = User::where('email', trim($email))->first();
        } elseif (!empty($phone)) {
            $user = User::where('phone', trim($phone))->first();
        } else {
            if(!empty($lang) && $lang === "fr")
                $message = "Veuillez fournir votre adresse e-mail ou votre numéro de téléphone pour réinitialiser votre mot de passe.";
            return response()->json([
                'type' => 'error',
                'message' => $message,
            ]);
        }

        if ($user) {
            $token = Password::getRepository()->create($user);
            return response()->json([
                'type' => 'success',
                'user' => $user,
                'token' => $token
            ]);
        }
        $retMessage = "These credentials do not match our records.";
        if(!empty($lang) && $lang === "fr")
        $retMessage = "Ces identifiants ne correspondent pas à nos enregistrements.";
        return response()->json([
            'type' => 'error',
            'message' => $retMessage,
        ], 402);
    }

    // reset password
    function resetPassword(Request $request)
    {

        $lang = $request->lang;
$tokenErr = 'The token is required.';
if (!isset($request->token)) {
    if ($lang === 'fr')
        $tokenErr = 'Le jeton est requis.';
    return response()->json([
        'type' => 'error',
        'message' => $tokenErr,
    ], 402);
}

$validator_messages = [
    'email.required' => ($lang === 'fr') ? 'L\'adresse e-mail est requise.' : 'The email is required.',
    'email.email' => ($lang === 'fr') ? 'L\'adresse e-mail doit être valide.' : 'The email must be valid.',
    'email.exists' => ($lang === 'fr') ? 'L\'adresse e-mail est introuvable dans nos enregistrements.' : 'The email not found in our records.',
    'password.required' => ($lang === 'fr') ? 'Le mot de passe est requis.' : 'The password is required.',
    'password.min' => ($lang === 'fr') ? 'Le mot de passe doit comporter au moins 8 caractères.' : 'The password must be at least 8 characters.',
    'password.confirmed' => ($lang === 'fr') ? 'La confirmation du mot de passe ne correspond pas.' : 'The password confirmation does not match.',
    'password.regex' => ($lang === 'fr') ? 'Le mot de passe doit comporter au moins 8 caractères et inclure au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.' : 'The password must be at least 8 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
];

$validator = Validator::make($request->all(), [
    'email' => 'required|email|exists:users,email',
    'password' => ['required', 'confirmed', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/'],
], $validator_messages);

if ($validator->fails()) {
    $errors = $validator->errors()->all();
    $retMessage = $errors[0];
    if ($lang === 'fr' && !empty($errors[1])) {
        $retMessage = $errors[1];
    }
    return response()->json([
        'type' => 'error',
        'message' => $retMessage,
    ], 402);
}
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['type' => 'success', 'message' => __($status)])
            : response()->json(['type' => 'error','message' => __($status)]);
    }

    // Retrieve user details with token and secret
    public function getUserWithSocialAccount($provider)
    {
        $validator = Validator::make(\Request::all(), [
            'id' => 'required',
            'name' => 'required',
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $email = request()->email;

        $user = User::firstOrCreate([
            'email' => $email,
        ], [
            'name'          => request()->name,
            'email'         => request()->email,
            'avatar'        => request()->photo,
            'password'   => Hash::make(Str::random(10)),
            'role_id ' => 2,
        ]);
               
        $token = $user->createToken('token')->plainTextToken;
        $user->role_id = 2;
        $user->save();
        $response = [
            'type' => 'success',
            'user' => $this->me($user->id),
            'token' => $token
        ];
        $userLogin = new UserLogin();
        $userLogin->provider_key   = request()->id;
        $userLogin->login_provider = $provider;
        $userLogin->provider_display_name = $provider;
        $userLogin->user_id = $user->id;
        $userLogin->save();

        return response()->json($response, 200);
    }



    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function Callback($provider)
    {
        $userSocial =   Socialite::driver($provider)->stateless()->user();

        $user = User::firstOrCreate([
            'email'         => $userSocial->getEmail(),
        ], [
            'name'          => $userSocial->getName(),
            'email'         => $userSocial->getEmail(),
            'avatar'         => $userSocial->getAvatar(),
            'role_id ' => 2,
        ]);

        $token = $user->createToken('token')->plainTextToken;
        $response = [
            'type' => 'success',
            'user' => $user->refresh,
            'token' => $token
        ];
        $userLogin = new UserLogin();
        $userLogin->provider_key   = $userSocial->getId();
        $userLogin->login_provider = $provider;
        $userLogin->provider_display_name = $provider;
        $userLogin->user_id = $user->id;
        $userLogin->save();

        return response()->json($response, 200);
    }

    public function verifyCode()
    {
        $validator =  Validator::make(\Request::all(), [
            'otp' => 'required',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $otp = request()->otp;
        $user = User::where('otp', $otp)->first();
        if ($user) {
            $now  = Carbon::now();
            $diff = $now->diffInSeconds($user->updated_at);
            if ($diff > 60) {
                $user->otp = null;
                $user->save();
                return response()->json(['message' => 'time is up.'], 400);
            } else {
                $user->otp = null;
                $user->save();
                return response()->json(['message' => 'success']);
            }
        } else {
            return response()->json(['message' => 'invalid code.'], 400);
        }
    }



    public function sendEmailVerificationCode()
    {
        $validator =  Validator::make(\Request::all(), [
            'email' => 'required'
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $email = request()->email;
        $user = User::where(['email' => trim($email)])->first();
        if ($user) {
            $code = random_int(100000, 999999);
            $user->otp = $code;
            $user->save();
            Mail::to($user->email)->send(new VerifyEmail($user, $code));
            return response()->json(['message' => 'We sent a 6-digit code to your email address.']);
        } else {
            return response()->json(['could not find your email.'], 400);
        }
    }

    public function switchUser()
    {
        $user = \Auth::user();
        $user->update(['role_id' => $user->role_id == 2 ? 3 : 2]);
        return response()->json($this->me($user->id), 200);
    }

    public function makeImage($base64_image)
    {
        @list($type, $file_data) = explode(';', $base64_image);
        @list(, $file_data) = explode(',', $file_data);
        $imageName = Str::random(14) . '.' . explode('/', explode(':', substr($base64_image, 0, strpos($base64_image, ';')))[1])[1];
        $save_path = "users/${imageName}";
        Storage::disk('public')->put($save_path, base64_decode($file_data));
        return $save_path;
    }

    // auth guard
    public function guard()
    {
        return Auth::guard();
    }

    public function updatePushNotificationSetting(Request $request)
    {
        $user = Auth::user();
        $user->is_push_notification_enabled = $request->get('push_notification');
        $user->save();
        return response()->json(['message' => "success"]);
    }
}
