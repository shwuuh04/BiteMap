// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDiU7w13jhpM7H3b3U8oW7So3O7cCTKXk",
  authDomain: "bitemap-eefec.firebaseapp.com",
  projectId: "bitemap-eefec",
  storageBucket: "bitemap-eefec.firebasestorage.app",
  messagingSenderId: "1090168142346",
  appId: "1:1090168142346:web:48c1f07b06e1839ce27df3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 