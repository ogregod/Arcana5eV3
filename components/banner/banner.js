// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Initialize banner and dropdown functionality
function initBanner() {
  console.log('Initializing banner with integrated dropdown functionality...');
  
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
      
      // Log the dropdown menu element for debugging
      console.log('Dropdown menu element:', menu);
      
      // Close all other open dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
        if (openMenu !== menu) {
          openMenu.classList.remove('show');
        }
      });
      
      // Toggle this dropdown menu
      menu.classList.toggle('show');
      
      // Ensure display style is set correctly
      if (menu.classList.contains('show')) {
        menu.style.display = 'block';
      } else {
        menu.style.display = '';
      }
    });
  });
  
  // Add click handlers to dropdown items
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      console.log('Dropdown item clicked:', this.textContent.trim(), 'href:', this.getAttribute('href'));
      
      // For items with no href or "#", prevent default
      const href = this.getAttribute('href');
      if (this.tagName !== 'A' || href === '#' || href === '') {
        e.preventDefault();
      }
      
      // Handle special cases
      if (this.id === 'logout-btn') {
        handleLogout(e);
        return;
      }
    });
  });
  
  // Set up logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log('Found logout button, attaching event listener');
    logoutBtn.addEventListener('click', handleLogout);
  } else {
    console.log('Logout button not found in the DOM');
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
  
  // Initialize active navigation item
  initActiveNav();
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

// Initialize active navigation based on current page
function initActiveNav() {
  const currentPath = window.location.pathname;
  
  // Find matching nav item and add active class
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if current path matches this link
    if (currentPath === href || 
        (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
      
      // If in dropdown, also mark parent dropdown
      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        dropdown.classList.add('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
    }
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBanner);
} else {
  // If DOMContentLoaded has already fired, run immediately
  initBanner();
}

// Additional safety - run initialization after a small delay
// This helps when the banner is loaded via fetch/AJAX
setTimeout(initBanner, 100);