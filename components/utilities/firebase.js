import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const app = firebase.app();
export const db = firestore();
