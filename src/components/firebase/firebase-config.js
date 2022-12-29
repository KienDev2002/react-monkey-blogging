import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDH0afQH-pVF-c5drxiA_XzxXElQn0YShc",
    authDomain: "monkey-bloging-17bb9.firebaseapp.com",
    projectId: "monkey-bloging-17bb9",
    storageBucket: "monkey-bloging-17bb9.appspot.com",
    messagingSenderId: "571072133585",
    appId: "1:571072133585:web:f98bbbdcfc1535d6dbc8f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
