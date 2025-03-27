// assets/js/auth.js
// Authentication functionality

import { 
    auth, 
    db, 
    doc, 
    getDoc, 
    setDoc, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    updateProfile
  } from './firebase.js';
  
  // Check auth state and update UI accordingly
  export function initAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        updateUIForSignedInUser(user);
      } else {
        // User is signed out
        console.log('User is signed out');
        updateUIForSignedOutUser();
      }
    });
  }
  
  // Sign in existing user
  export async function signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Create new user account
  export async function signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: displayName,
        email: email,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light'
        },
        patreonLinked: false
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Sign out current user
  export async function logOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get current user's profile data
  export async function getUserProfile() {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No user profile found!");
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
  
  // Update UI based on auth state
  function updateUIForSignedInUser(user) {
    // Hide login button/form
    const loginElements = document.querySelectorAll('.login-required');
    loginElements.forEach(el => el.style.display = 'none');
    
    // Show user-specific elements
    const userElements = document.querySelectorAll('.user-only');
    userElements.forEach(el => el.style.display = 'block');
    
    // Update user display name if element exists
    const userNameElements = document.querySelectorAll('.user-display-name');
    userNameElements.forEach(el => {
      el.textContent = user.displayName || 'User';
    });
  }
  
  function updateUIForSignedOutUser() {
    // Show login button/form
    const loginElements = document.querySelectorAll('.login-required');
    loginElements.forEach(el => el.style.display = 'block');
    
    // Hide user-specific elements
    const userElements = document.querySelectorAll('.user-only');
    userElements.forEach(el => el.style.display = 'none');
  }
  
  // Initialize auth on page load
  document.addEventListener('DOMContentLoaded', initAuth);