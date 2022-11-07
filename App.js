import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import SignUp from './components/SignUp';
import {AppBar} from '@react-native-material/core';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import AddFriend from './components/AddFriend';
import MessageScreen from './components/MessageScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const handleLogout = () => {
    auth().signOut();
  };

  if (initializing) return null;

  if (!user) {
    return <SignUp></SignUp>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddFriend" component={AddFriend} />
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={({route}) => ({title: route.params.friend})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
