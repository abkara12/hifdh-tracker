// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNMCUIGs7xLZ4-J1hfLMwATFy43QF6MZc",
  authDomain: "al-qadr-hifz-class.firebaseapp.com",
  projectId: "al-qadr-hifz-class",
  storageBucket: "al-qadr-hifz-class.firebasestorage.app",
  messagingSenderId: "1027789437089",
  appId: "1:1027789437089:web:e2a4b3ac0d12c6de1858e0",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
