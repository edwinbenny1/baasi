// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4qCotpjb7AqlLK4V1BnlTJ1m3oFvSwTs",
  authDomain: "homystay-auth.firebaseapp.com",
  projectId: "homystay-auth",
  storageBucket: "homystay-auth.firebasestorage.app",
  messagingSenderId: "434427752670",
  appId: "1:434427752670:web:044dbcdbaa96dc6f2b124f"
};


// ✅ Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
