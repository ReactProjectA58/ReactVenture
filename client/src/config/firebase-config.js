// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2gWWF06GSrkPtD4tK4EKGftRdLuH-Fk0",
  authDomain: "reactventure-9cf76.firebaseapp.com",
  projectId: "reactventure-9cf76",
  storageBucket: "reactventure-9cf76.appspot.com",
  messagingSenderId: "650631874031",
  appId: "1:650631874031:web:d4187efa2bb1439bce621a",
  databaseURL: "https://reactventure-9cf76-default-rtdb.europe-west1.firebasedatabase.app/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);