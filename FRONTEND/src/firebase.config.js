// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC5lg1XEKUgoW0MUZnfRVRmR3y_4dhnoeU",
  authDomain: "otp-loginn-b8fc1.firebaseapp.com",
  projectId: "otp-loginn-b8fc1",
  storageBucket: "otp-loginn-b8fc1.appspot.com",
  messagingSenderId: "107039851967",
  appId: "1:107039851967:web:14635ef14079cb3c7b0d0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);