import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/firestore';
import {useHeaderHeight} from '@react-navigation/elements';
import {Button} from '@react-native-material/core';

const MessageScreen = ({route, navigation}) => {
  const height = useHeaderHeight();

  const [flatListRef, setFlatListRef] = useState(null);

  const {friend} = route.params;

  const [messages, setMessages] = useState([]);

  const [messagesId, setMessagesId] = useState('');

  const [newMessage, setNewMessage] = useState('');

  const createDeleteAlert = message => {
    Alert.alert(
      'Delete this message ?',
      'This is a permanent operation, this message cannot be recovered',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Canceled'),
        },
        {
          text: 'Delete',
          onPress: () => {
            firestore()
              .collection('messages')
              .doc(messagesId)
              .collection('textMessages')
              .doc(message)
              .delete()
              .then(() => {
                console.log('Message deleted');
              });
          },
          style: 'destructive',
        },
      ],
    );
  };

  const onResult = querySnapshot => {
    let messagesArray = [];
    querySnapshot.forEach(documentSnapshot => {
      //console.log(documentSnapshot);
      const data = documentSnapshot.data();
      if (data) {
        if (!data.timeStamp && documentSnapshot.metadata.hasPendingWrites) {
          messagesArray.push({
            data: {
              ...documentSnapshot.data(),
              timeStamp: firebase.firestore.Timestamp.now(),
            },
            id: documentSnapshot.id,
          });
        } else {
          messagesArray.push({
            data: documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        }
      }
    });
    console.log(messagesArray);
    setMessages(messagesArray);
  };

  const onError = error => {
    console.error(error);
  };

  const getMessagesId = async () => {
    return firestore()
      .collection('users')
      .doc(auth().currentUser.email)
      .collection('friends')
      .doc(friend)
      .get();
  };

  const addNewMessage = async () => {
    await firestore()
      .collection('messages')
      .doc(messagesId)
      .collection('textMessages')
      .doc()
      .set({
        sender: auth().currentUser.email,
        text: newMessage,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setNewMessage('');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Button
            onPress={() =>
              navigation.navigate('CallScreen', {
                roomId: messagesId,
              })
            }
          />
          <Button
            onPress={() =>
              navigation.navigate('AnswerScreen', {
                roomId: messagesId,
              })
            }
          />
        </View>
      ),
    });

    getMessagesId().then(response => {
      setMessagesId(response.data().messagesId);
      firestore()
        .collection('messages')
        .doc(response.data().messagesId)
        .collection('textMessages')
        .orderBy('timeStamp', 'asc')
        .onSnapshot(onResult, onError);
    });
  }, []);

  const renderItem = ({item, index}) =>
    item.data.sender === auth().currentUser.email ? (
      <Pressable onLongPress={() => createDeleteAlert(item.id)}>
        <View
          style={{
            backgroundColor: '#0078fe',
            padding: 10,
            marginLeft: '45%',
            borderRadius: 5,
            //marginBottom: 15,
            marginTop: 5,
            marginRight: '5%',
            maxWidth: '50%',
            alignSelf: 'flex-end',
            //maxWidth: 500,

            borderRadius: 20,
          }}
          key={index}>
          <Text style={{fontSize: 16, color: '#fff'}} key={index}>
            {item.data.text}
          </Text>

          <View style={styles.rightArrow}></View>

          <View style={styles.rightArrowOverlap}></View>

          <View>
            <Text>{item.data.timeStamp.toDate().toLocaleString()}</Text>
          </View>
        </View>
      </Pressable>
    ) : (
      <View
        style={{
          backgroundColor: '#dedede',
          padding: 10,
          borderRadius: 5,
          marginTop: 5,
          marginLeft: '5%',
          maxWidth: '50%',
          alignSelf: 'flex-start',
          //maxWidth: 500,
          //padding: 14,

          //alignItems:"center",
          borderRadius: 20,
        }}
        key={index}>
        <Text
          style={{fontSize: 16, color: '#000', justifyContent: 'center'}}
          key={index}>
          {' '}
          {item.data.text}
        </Text>
        <View style={styles.leftArrow}></View>
        <View style={styles.leftArrowOverlap}></View>

        <View>
          <Text>{item.data.timeStamp.toDate().toLocaleString()}</Text>
        </View>
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={height + 64}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ref={setFlatListRef}
          />
          <TextInput
            style={styles.input}
            onChangeText={e => {
              setNewMessage(e);
              flatListRef.scrollToEnd({animated: true});
            }}
            value={newMessage}
            onSubmitEditing={async () => await addNewMessage()}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  rightArrow: {
    position: 'absolute',
    backgroundColor: '#0078fe',
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#eeeeee',
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#dedede',
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#eeeeee',
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  container: {
    flex: 1,
  },

  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
});

export default MessageScreen;
