import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getDatabase } from "firebase/database";
// Uncomment the line below if you need to use Firebase Analytics
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8jDrzArZo7RvwfH8J4IrQ_dczqr4C1HQ",
  authDomain: "check-team-mate.firebaseapp.com",
  projectId: "check-team-mate",
  storageBucket: "check-team-mate.appspot.com",
  messagingSenderId: "109817373720",
  appId: "1:109817373720:web:c48df6727160605a32cf6d",
  measurementId: "G-NZEQ80LT49",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
//const database = getDatabase(app);
// Uncomment the line below if you need to use Firebase Analytics
// const analytics = getAnalytics(app);

