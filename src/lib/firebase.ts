import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAo96avAlCIfyYrti_pieUGMCeHZfBNhTs",
  authDomain: "teacherhub-cloud.firebaseapp.com",
  projectId: "teacherhub-cloud",
  storageBucket: "teacherhub-cloud.firebasestorage.app",
  messagingSenderId: "487700983191",
  appId: "1:487700983191:web:038ea3d4c2969b49fa68d2",
  measurementId: "G-2RYN2W3BYD"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
};

export type { User };
