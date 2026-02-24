// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAjSqSaO78jmCp_Oh6Ri8njIxmf56VK34U",
  authDomain: "hifdh-tracker-bce2b.firebaseapp.com",
  projectId: "hifdh-tracker-bce2b",
  storageBucket: "hifdh-tracker-bce2b.firebasestorage.app",
  messagingSenderId: "829840507509",
  appId: "1:829840507509:web:c6d14ae53945de9c73ae3c"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
