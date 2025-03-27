// assets/js/firebase.js
// Firebase configuration and initialization

// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js';

// Your Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyDmP2HyEk-x1tY4SPtY99oRjv8WD0LfPFM",
    authDomain: "arcana5e.firebaseapp.com",
    projectId: "arcana5e",
    storageBucket: "arcana5e.appspot.com",
    messagingSenderId: "976900077338",
    appId: "1:976900077338:web:b112ad8df490672a8b1ea3",
    measurementId: "G-5WLGQB7ZES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export initialized services
export { app, db, auth, storage };

// Export Firestore methods
export { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot
};

// Export Auth methods
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
};

// Export Storage methods
export {
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
};