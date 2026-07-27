import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAJkyQfK3nSNgBqouTdwHRGabeHg4aEcNY",
  authDomain: "login-system-e88bf.firebaseapp.com",
  projectId: "login-system-e88bf",
  storageBucket: "login-system-e88bf.firebasestorage.app",
  messagingSenderId: "879717739308",
  appId: "1:879717739308:web:a5de3451b457f92b795a89",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);