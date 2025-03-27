// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';
import { initDropdowns, initActiveNav } from '/assets/js/navigation.js';

// Initialize banner functionality
function initBanner() {
  console.log('Initializing banner and navigation...');
  
  // Initialize dropdowns
  initDropdowns();
  
  // Initialize active navigation
  initActiveNav();
  
  // Debug: log all dropdown items to verify they're in the DOM
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  console.log(`Found ${dropdownItems.length} dropdown items:`, 
    Array.from(dropdownItems).map(item => ({ 
      text: item.textContent.trim(), 
      href: item.getAttribute('href'),
      id: item.id
    }))
  );
  
  // Add logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log('Found logout button, attaching event listener');
    logoutBtn.addEventListener('click', async (e) => {
      console.log('Logout button clicked');
      e.preventDefault();
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
    });
  } else {
    console.log('Logout button not found in the DOM');
  }
  
  // Add additional click logging for all dropdown items
  document.querySelectorAll('.dropdown-item').forEach(item => {
    // Add a click event that logs but doesn't interfere with normal navigation
    item.addEventListener('click', function(event) {
      console.log('Dropdown item clicked:', this.textContent.trim(), 'href:', this.getAttribute('href'));
    });
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBanner);
} else {
  // If DOMContentLoaded has already fired, run immediately
  initBanner();
}

// Also ensure we run initialization whenever this script is loaded dynamically
// This helps when the banner is loaded via fetch/AJAX
setTimeout(initBanner, 100);