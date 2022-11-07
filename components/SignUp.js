import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function SignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleModeChange = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        firestore().collection('users').doc(email).set({});
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const handleLogin = () => {
    auth().signInWithEmailAndPassword(email, password);
  };

  return (
    <View>
      {isSignUp ? <Text>Sign up</Text> : <Text>Login</Text>}
      <TextInput style={styles.input} onChangeText={setEmail} value={email} />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />
      <Button onPress={handleModeChange} title="change" />
      {isSignUp ? (
        <Button onPress={handleSignUp} title="sign up" />
      ) : (
        <Button onPress={handleLogin} title="login" />
      )}
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

export default SignUp;
