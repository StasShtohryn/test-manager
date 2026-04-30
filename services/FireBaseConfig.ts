import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

const firebaseConfig = {
  apiKey: "AIzaSyBowyrQV2RnYTfmM4eLwEhA3AztPMz871Q",
  authDomain: "quiz-app-c07cd.firebaseapp.com",
  projectId: "quiz-app-c07cd",
  storageBucket: "quiz-app-c07cd.firebasestorage.app",
  messagingSenderId: "463218743695",
  appId: "1:463218743695:web:cfe2880df169311fe553fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})