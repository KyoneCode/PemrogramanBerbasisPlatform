import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { setFirebaseInstances } from './firebase';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Fungsi ini hanya akan dipanggil sekali dari _layout.tsx
export const initializeFirebase = () => {
  console.log("Initializing Firebase with AsyncStorage...");

  const firebaseConfig = {
    apiKey: "AIzaSyCnPMRgPRD71ypc2C3Jqre0YQKkZeHh9Is",
    authDomain: "tugas2pbp.firebaseapp.com",
    projectId: "tugas2pbp",
    storageBucket: "tugas2pbp.firebasestorage.app",
    messagingSenderId: "323337314428",
    appId: "1:323337314428:web:3e7a70c1215a7cb098e9f9"
  };

  const app = initializeApp(firebaseConfig);

  // Inisialisasi auth dengan persistence default (AsyncStorage)
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  const db = getFirestore(app);

  // Simpan instance yang sudah dibuat ke dalam variabel global
  setFirebaseInstances(auth, db);
  console.log("Firebase Initialized with AsyncStorage.");
};