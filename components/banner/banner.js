// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';
import { initNavigation } from '/assets/js/navigation.js';

document.addEventListener('DOMContentLoaded', initBanner);

// Initialize banner functionality
function initBanner() {
  console.log('Initializing banner...');
  
  // Set up logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log('Found logout button, attaching event listener');
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Initialize navigation (dropdowns and active nav)
  // This is the key part - we're using the consolidated navigation functions
  initNavigation();
}

// Handle logout button click
async function handleLogout(e) {
  if (e) e.preventDefault();
  console.log('Logout button clicked');
  
  try {
    const result = await logOut();
    if (result.success) {
      console.log('Logout successful, redirecting to welcome page');
      window.location.href = '/welcome';
    } else {
      console.error('Logout error:', result.error);
      alert('Error logging out: ' + result.error);
    }
  } catch (error) {
    console.error('Exception during logout:', error);
    alert('Error during logout: ' + error.message);
  }
}