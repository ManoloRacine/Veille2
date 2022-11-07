import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function AddFriend({navigation}) {
  const [email, setEmail] = useState('');

  const handleAddFriend = () => {
    firestore()
      .collection('messages')
      .add({user1: auth().currentUser.email, user2: email})
      .then(documentSnapshot => {
        firestore()
          .collection('users')
          .doc(auth().currentUser.email)
          .collection('friends')
          .doc(email)
          .set({messagesId: documentSnapshot.id});
        firestore()
          .collection('users')
          .doc(email)
          .set({})
          .then(() => {
            firestore()
              .collection('users')
              .doc(email)
              .collection('friends')
              .doc(auth().currentUser.email)
              .set({messagesId: documentSnapshot.id});
          });
      });
  };
  return (
    <View>
      <Text>add friend Screen</Text>
      <TextInput style={styles.input} onChangeText={setEmail} value={email} />
      <Button onPress={handleAddFriend} title="Add Friend" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AddFriend;
