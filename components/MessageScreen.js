import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

const MessageScreen = ({route, navigation}) => {
  const {friend} = route.params;

  return (
    <View>
      <Text>messages</Text>
    </View>
  );
};

export default MessageScreen;
