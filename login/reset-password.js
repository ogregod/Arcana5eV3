// login/reset-password.js
import { auth } from '/assets/js/firebase.js';
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

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
  
  // Initialize password reset functionality
  initPasswordReset();
});

function initPasswordReset() {
  // Check if the page was accessed with a reset code in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get('oobCode');
  const mode = urlParams.get('mode');
  
  if (mode === 'resetPassword' && oobCode) {
    // This is a password reset confirmation page
    showResetConfirmation(oobCode);
  } else {
    // This is the initial password reset request page
    initResetRequestForm();
  }
}

function initResetRequestForm() {
  const resetRequestForm = document.getElementById('reset-request-form');
  const emailInput = document.getElementById('email');
  const errorMessage = document.getElementById('reset-error');
  const successView = document.getElementById('reset-success');
  
  resetRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
      showError(errorMessage, 'Please enter your email address.');
      return;
    }
    
    try {
      // Show loading state
      const submitButton = resetRequestForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Show success message
      resetRequestForm.style.display = 'none';
      successView.style.display = 'block';
    } catch (error) {
      console.error('Error sending password reset email:', error);
      let errorMsg = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      }
      
      showError(errorMessage, errorMsg);
      
      // Reset button state
      const submitButton = resetRequestForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Send Reset Link';
    }
  });
}

async function showResetConfirmation(oobCode) {
  const resetRequestForm = document.getElementById('reset-request-form');
  const resetConfirmForm = document.getElementById('reset-confirm-form');
  const confirmError = document.getElementById('confirm-error');
  
  resetRequestForm.style.display = 'none';
  resetConfirmForm.style.display = 'block';
  
  try {
    // Verify that the reset code is valid
    await verifyPasswordResetCode(auth, oobCode);
    
    // Setup form submission
    resetConfirmForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Validate passwords
      if (newPassword.length < 6) {
        showError(confirmError, 'Password must be at least 6 characters.');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showError(confirmError, 'Passwords do not match.');
        return;
      }
      
      try {
        // Show loading state
        const submitButton = resetConfirmForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Resetting...';
        
        // Confirm password reset
        await confirmPasswordReset(auth, oobCode, newPassword);
        
        // Show success message
        document.getElementById('confirm-success').textContent = 'Password reset successfully!';
        document.getElementById('confirm-success').style.display = 'block';
        confirmError.style.display = 'none';
        
        // Disable form inputs
        document.getElementById('new-password').disabled = true;
        document.getElementById('confirm-password').disabled = true;
        
        // Change button text and action
        submitButton.textContent = 'Go to Login';
        submitButton.disabled = false;
        submitButton.addEventListener('click', () => {
          window.location.href = '/login';
        });
      } catch (error) {
        console.error('Error confirming password reset:', error);
        showError(confirmError, 'Failed to reset password. The link may have expired. Please try again.');
        
        // Reset button state
        const submitButton = resetConfirmForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Reset Password';
      }
    });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    showError(confirmError, 'Invalid or expired password reset link. Please request a new one.');
    
    // Show button to go back to reset request form
    const submitButton = resetConfirmForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Request New Link';
    submitButton.addEventListener('click', () => {
      resetRequestForm.style.display = 'block';
      resetConfirmForm.style.display = 'none';
    });
  }
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}