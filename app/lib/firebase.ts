// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCQgvxuj2INUr3GOEP3331jEhxXZvyJTuA",
  authDomain: "hifdh-tracker-d4d86.firebaseapp.com",
  projectId: "hifdh-tracker-d4d86",
  storageBucket: "hifdh-tracker-d4d86.firebasestorage.app",
  messagingSenderId: "1077806417406",
  appId: "1:1077806417406:web:d59537907cf1665954ecaf"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
