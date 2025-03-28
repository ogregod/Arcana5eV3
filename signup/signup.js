// signup/signup.js
import { auth, signInWithPopup, GoogleAuthProvider, db, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { signUp } from '/assets/js/auth.js';

// signup/signup.js
import { auth, signInWithPopup, GoogleAuthProvider, db, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { signUp } from '/assets/js/auth.js';
import { loadBanner } from '/assets/js/components.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // First, load the banner component
    await loadBanner();
    
    // Now initialize page-specific functionality
    initSignupPage();
  } catch (error) {
    console.error('Error initializing signup page:', error);
  }
});

function initSignupPage() {
  // Check if user is already logged in
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, redirect to welcome page
      window.location.href = '/welcome/';
    }
  });
  
  // Rest of your existing signup page initialization code...
}

function initSignupPage() {
  // Check if user is already logged in
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, redirect to welcome page
      window.location.href = '/welcome/';
    }
  });
  
  // Setup form submission
  const signupForm = document.getElementById('signup-form');
  const displayNameInput = document.getElementById('display-name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const errorMessage = document.getElementById('signup-error');
  const successMessage = document.getElementById('signup-success');
  
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    const displayName = displayNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    // Simple validation
    if (!displayName || !email || !password || !confirmPassword) {
      showError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      // Show loading state
      const submitButton = signupForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Creating Account...';
      
      // Attempt to sign up
      const result = await signUp(email, password, displayName);
      
      if (result.success) {
        // Show success message
        showSuccess('Account created successfully! Redirecting to welcome page...');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/welcome/';
        }, 2000);
      } else {
        showError(result.error || 'Failed to create account. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Create Account';
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError('An error occurred during sign up. Please try again.');
      
      const submitButton = signupForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Create Account';
    }
  });
  
  // Setup Google signup
  const googleSignupButton = document.getElementById('google-signup');
  googleSignupButton.addEventListener('click', async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Create user profile in Firestore if it doesn't exist
      const user = result.user;
      
      try {
        await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'light'
          },
          patreonLinked: false
        }, { merge: true });
      } catch (error) {
        console.error('Error creating user profile:', error);
      }
      
      // Redirect handled by onAuthStateChanged
    } catch (error) {
      console.error('Google signup error:', error);
      showError('Error signing up with Google. Please try again.');
    }
  });
}

function showError(message) {
  const errorMessage = document.getElementById('signup-error');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  
  // Hide success message if showing
  document.getElementById('signup-success').style.display = 'none';
}

function showSuccess(message) {
  const successMessage = document.getElementById('signup-success');
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  
  // Hide error message if showing
  document.getElementById('signup-error').style.display = 'none';
}