import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function HomeScreen({navigation}) {
  const [friends, setFriends] = useState([]);

  const onResult = querySnapshot => {
    let friendsArray = [];
    querySnapshot.forEach(documentSnapshot => {
      friendsArray.push(documentSnapshot.id);
      console.log(friendsArray);
    });
    setFriends(friendsArray);
  };

  const onError = error => {
    console.error(error);
  };

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.email)
      .collection('friends')
      .onSnapshot(onResult, onError);
  }, [auth().currentUser.email]);

  const Item = ({idFriend}) => (
    <TouchableOpacity
      style={{backgroundColor: '#b3feff', borderWidth: 2, borderColor: 'white'}}
      onPress={() =>
        navigation.navigate('MessageScreen', {
          friend: idFriend,
        })
      }>
      <Text style={{margin: 20}}>{idFriend}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => <Item idFriend={item} />;

  return (
    <SafeAreaView>
      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
      <Button
        title="Add a friend"
        onPress={() => navigation.navigate('AddFriend')}
      />
      <Button title="disconnect" onPress={() => auth().signOut()} />
    </SafeAreaView>
  );
}

export default HomeScreen;
