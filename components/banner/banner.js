// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';
import { initDropdowns } from '/assets/js/navigation.js';

// Initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  
  // Add logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const result = await logOut();
      if (result.success) {
        window.location.href = '/welcome';
      } else {
        alert('Error logging out: ' + result.error);
      }
    });
  }
});