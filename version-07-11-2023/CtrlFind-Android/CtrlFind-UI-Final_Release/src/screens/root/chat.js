import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {ifIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';
import {useDispatch, useSelector} from 'react-redux';
import AuthContext from '../../context/AuthContext';
import {AppHeader, AppInput, BaseView, ChatBox} from '../../components';
import images from '../../constants/images';
import {COLORS} from '../../constants/theme';
import {
  createMessage,
  getChatMessages,
  updateMessages,
} from '../../store/reducers/chat';
import helpers from '../../constants/helpers';
import usePusher from '../../hooks/usePusher';

export const ChatScreen = ({navigation, route}) => {
  const {user, trigger} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {loadding, messages} = useSelector(state => state.chat);
  const {chat_id, friend} = route.params;

  usePusher();

  useEffect(() => {
    const fetch = dispatch(getChatMessages(chat_id));
    trigger.setRoute('chat');
    return () => {
      fetch;
    };
  }, []);

  const onSend = useCallback((userMessages = []) => {
    const msg = userMessages[0];
    if (msg) {
      const values = {
        createdAt: msg.createdAt,
        text: msg.text,
        friend_id: friend?.id,
        user_id: user?.id,
        avatar: user?.avatar,
        name: user?.name,
      };
      dispatch(createMessage(values));
      dispatch(updateMessages(msg));
    }
  }, []);

  // <ChatBox direction="left" />

  return (
    <>
      <AppHeader
        image={helpers.get_image(friend?.avatar)}
        title={friend?.name}
        onPressBack={() => navigation.navigate('chat_list')}
      />
      <BaseView styles={styles.container} loading={loadding}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: user?.id,
            name: user?.name,
            avatar: helpers.get_image(user?.avatar),
          }}
        />
        <View style={{paddingBottom: getBottomSpace()}} />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
