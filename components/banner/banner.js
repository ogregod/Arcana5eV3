// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// IMPORTANT CHANGE: Remove DOMContentLoaded event listener and call initBanner immediately
// The script is already being loaded after the DOM is ready, so we can run right away
initBanner();

// Initialize banner and dropdown functionality
function initBanner() {
  console.log('Initializing banner with dropdown functionality...');
  
  // Initialize dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles in banner`);
  
  // Add click handlers to dropdown toggles
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      console.log('Dropdown toggle clicked:', this.textContent.trim());
      e.preventDefault();
      e.stopPropagation();
      
      // Find the dropdown menu
      const dropdown = this.closest('.dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Close all other open dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
        if (openMenu !== menu) {
          openMenu.classList.remove('show');
          openMenu.style.display = ''; // Reset display style
        }
      });
      
      // Toggle this dropdown menu
      menu.classList.toggle('show');
      
      // Force display style to ensure visibility
      if (menu.classList.contains('show')) {
        menu.style.display = 'block';
      } else {
        menu.style.display = '';
      }
    });
  });
  
  // Set up logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log('Found logout button, attaching event listener');
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
      });
    }
  });
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
      });
    }
  });
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