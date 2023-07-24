import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBUYFo4nGtwQpcm8bmPRcH8HIWHDz57EQA",
   authDomain: "react-personal-finance-tracker.firebaseapp.com",
   projectId: "react-personal-finance-tracker",
   storageBucket: "react-personal-finance-tracker.appspot.com",
   messagingSenderId: "563401666043",
   appId: "1:563401666043:web:5f56092fc165339473ef5e",
   measurementId: "G-993BRJZ9GH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
