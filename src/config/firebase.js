import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project config
// Get this from Firebase Console → Project Settings → Your apps → Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA5xBgmPOA6yPzmIORcQ38XTvRAgo4QfBI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gympulse-app-4f3c5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gympulse-app-4f3c5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gympulse-app-4f3c5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "145032331644",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:145032331644:web:b5d2f49bfd088c8422a4f9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
