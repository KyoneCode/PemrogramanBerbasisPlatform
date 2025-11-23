import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

// Variabel ini akan diisi saat aplikasi berjalan
let authInstance: Auth;
let dbInstance: Firestore;

export const setFirebaseInstances = (auth: Auth, db: Firestore) => {
  authInstance = auth;
  dbInstance = db;
};

// Ekspor fungsi untuk mendapatkan instance, bukan instance itu sendiri
export const getAuth = () => {
  if (!authInstance) {
    throw new Error("Firebase Auth not initialized!");
  }
  return authInstance;
};

export const getDb = () => {
  if (!dbInstance) {
    throw new Error("Firestore not initialized!");
  }
  return dbInstance;
};