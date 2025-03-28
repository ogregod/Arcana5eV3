// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Call initBanner immediately - not waiting for DOMContentLoaded
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
          openMenu.style.display = '';
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
  
  // IMPORTANT: Add click handlers to dropdown items explicitly
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  console.log(`Found ${dropdownItems.length} dropdown items`);
  
  dropdownItems.forEach(item => {
    // Remove any existing listeners to avoid duplication
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
    
    // Add a direct event handler for monitoring
    newItem.addEventListener('click', function(e) {
      // Only prevent default for buttons or anchors with no href
      if (this.tagName === 'BUTTON' || !this.hasAttribute('href') || this.getAttribute('href') === '#') {
        e.preventDefault();
      }
      
      console.log('Dropdown item clicked:', this.textContent.trim(), 'href:', this.getAttribute('href'));
      
      // Special case for logout button
      if (this.id === 'logout-btn') {
        handleLogout(e);
        return;
      }
      
      // For items with href, handle navigation manually for greater reliability
      const href = this.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        window.location.href = href;
      }
      
      // Close dropdown after click
      const menu = this.closest('.dropdown-menu');
      if (menu) {
        menu.classList.remove('show');
        menu.style.display = '';
      }
    });
  });
  
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