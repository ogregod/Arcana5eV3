// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';
import { initDropdowns } from '/assets/js/navigation.js';

// Initialize banner functionality
function initBanner() {
  console.log('Initializing banner...');
  
  // Initialize dropdowns
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
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBanner);
} else {
  // If DOMContentLoaded has already fired, run immediately
  initBanner();
}