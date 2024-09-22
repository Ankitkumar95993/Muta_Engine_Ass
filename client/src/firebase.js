// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCWKglXJtX6WxfD0nOQqqkz7ZBfag7kAY",
  authDomain: "muta-engine.firebaseapp.com",
  projectId: "muta-engine",
  storageBucket: "muta-engine.appspot.com",
  messagingSenderId: "1078322695725",
  appId: "1:1078322695725:web:bbb827ad7703e8b7abb2a4",
  measurementId: "G-1ZNP38QE7M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);