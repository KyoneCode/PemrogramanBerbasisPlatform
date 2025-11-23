import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvULwI5TT-RuKv_eH2yDeZjFQUCXyerFE",
  authDomain: "chatapp-6adb1.firebaseapp.com",
  projectId: "chatapp-6adb1",
  storageBucket: "chatapp-6adb1.firebasestorage.app",
  messagingSenderId: "500577341422",
  appId: "1:500577341422:android:9c6d52a22209c685e548ff",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const messagesCollection = collection(
  db,
  "messages"
) as CollectionReference<DocumentData>;

export {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  signInAnonymously,
  onAuthStateChanged,
};