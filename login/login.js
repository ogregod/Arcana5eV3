// login/login.js
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { signIn } from '/assets/js/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Load banner component
  const bannerPlaceholder = document.getElementById('banner-placeholder');
  
  try {
    // Load banner HTML
    const response = await fetch('/components/banner/banner.html');
    if (response.ok) {
      const html = await response.text();
      bannerPlaceholder.innerHTML = html;
      
      // Execute banner script after inserting HTML with explicit onload handler
      const bannerScript = document.createElement('script');
      bannerScript.type = 'module';
      bannerScript.src = '/components/banner/banner.js';
      bannerScript.onload = () => {
        console.log('Banner script loaded and executed successfully');
      };
      bannerScript.onerror = (error) => {
        console.error('Error loading banner script:', error);
      };
      document.body.appendChild(bannerScript);
    } else {
      console.error('Failed to load banner component:', response.status);
    }
  } catch (error) {
    console.error('Error loading banner component:', error);
  }
  
  // Initialize login functionality
  initLoginPage();
});

function initLoginPage() {
  // Check if user is already logged in
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, redirect to welcome page
      window.location.href = '/welcome/';
    }
  });
  
  // Setup form submission
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('login-error');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Simple validation
    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }
    
    try {
      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Logging in...';
      
      // Attempt to sign in
      const result = await signIn(email, password);
      
      if (result.success) {
        // Redirect to welcome page on success
        window.location.href = '/welcome/';
      } else {
        showError('Invalid email or password. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Log In';
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('An error occurred during login. Please try again.');
      
      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Log In';
    }
  });
  
  // Setup Google login
  const googleLoginButton = document.getElementById('google-login');
  googleLoginButton.addEventListener('click', async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect handled by onAuthStateChanged
    } catch (error) {
      console.error('Google login error:', error);
      showError('Error logging in with Google. Please try again.');
    }
  });
  
  // Setup forgot password
  const forgotPasswordLink = document.getElementById('forgot-password');
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
      showError('Please enter your email address first.');
      emailInput.focus();
      return;
    }
    
    // Implement password reset functionality
    alert('Password reset functionality will be implemented here');
  });
}

function showError(message) {
  const errorMessage = document.getElementById('login-error');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}