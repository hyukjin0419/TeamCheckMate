import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore, //get db
  collection, //Collection
  doc, //문서
  addDoc, //C
  getDocs, //R
  getDoc,
  updateDoc, //U
  deleteDoc, //D
  setDoc,
  orderBy,
  query,
  arrayUnion,
  deleteField,
} from "firebase/firestore";
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
const db = getFirestore(app);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
//const database = getDatabase(app);
// Uncomment the line below if you need to use Firebase Analytics
// const analytics = getAnalytics(app);
export {
  app,
  db,
  auth,
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onAuthStateChanged,
  arrayUnion,
  deleteField,
};
