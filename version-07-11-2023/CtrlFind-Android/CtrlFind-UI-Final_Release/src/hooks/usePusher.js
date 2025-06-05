import React, {useContext, useEffect} from 'react';
import Pusher from 'pusher-js/react-native';
import AuthContext from '../context/AuthContext';
import {useDispatch} from 'react-redux';
import {updateMessages} from '../store/reducers/chat';
import {translate} from "../multiLang/translation";

export default usePusher = () => {
  const dispatch = useDispatch();
  const {user} = useContext(AuthContext);
  useEffect(() => {
    const pusher = new Pusher('7a99b5d1036faaf1618c', {
      cluster: 'eu',
    });

    pusher.connection.bind('error', function (err) {
      if (err.error.data.code === 4004) {
        alert(translate("Overlimit"));
      }
    });

    pusher.connection.bind('connected', function (data) {
      console.log('connected');
    });

    pusher.connection.bind('disconnected', function (data) {
      console.log('disconnect');
    });

    const channel = pusher.subscribe('chat');

    channel.bind('message/' + user.id, function (data) {
      if (data.data.eventType === 'message') {
        const message = data.data?.data;
        dispatch(updateMessages(message));
      }
    });

    return () => {
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);
};
