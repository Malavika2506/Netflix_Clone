// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA21JADp9Rcq_aM45dwuMxsjRTPaztNmSk",
  authDomain: "netflix-clone-309c8.firebaseapp.com",
  projectId: "netflix-clone-309c8",
  storageBucket: "netflix-clone-309c8.appspot.com", 
  messagingSenderId: "793017495527",
  appId: "1:793017495527:web:0360431426e91c9a1b9742"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber };
