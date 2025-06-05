import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppNoDataFound, BaseView, ChatCard} from '../../components';
import {COLORS} from '../../constants/theme';
import {getUserFriendsList} from '../../store/reducers/chat';
import {translate} from '../../multiLang/translation';
export const ChatListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, chatUsers} = useSelector(state => state.chat);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getUserFriendsList());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const users = dispatch(getUserFriendsList());
    return () => {
      users;
    };
  }, []);

  return (
    <>
      <AppHeader title={translate('chatTitle')} isMenu />
      <BaseView styles={styles.container} loading={loading}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chatUsers}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ChatCard
              onPress={() =>
                navigation.navigate('user_chat', {
                  chat_id: item?.id,
                  friend: {
                    id: item?.friend?.id,
                    name: item?.friend?.name,
                    avatar: item?.friend?.avatar,
                  },
                })
              }
              item={item}
            />
          )}
          ListEmptyComponent={() => (
            <AppNoDataFound title={translate('noChat')} />
          )}
        />
        <View style={{height: 40}} />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
});
