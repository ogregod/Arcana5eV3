// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Initialize banner and dropdown functionality
function initBanner() {
  console.log('Initializing banner with integrated dropdown functionality...');
  
  // Check if banner has already been initialized to prevent duplicate initialization
  if (document.querySelector('.site-banner')?.dataset.initialized === 'true') {
    console.log('Banner already initialized, skipping...');
    return;
  }
  
  // Mark banner as initialized
  const bannerElement = document.querySelector('.site-banner');
  if (!bannerElement) {
    console.error('Banner element not found in the DOM');
    return;
  }
  
  bannerElement.dataset.initialized = 'true';
  
  // Initialize dropdown toggles - explicitly limit scope to banner dropdowns only
  const dropdownToggles = bannerElement.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles in banner`);
  
  // Remove any existing event listeners to prevent duplication
  dropdownToggles.forEach(toggle => {
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
  });
  
  // Get the new toggle elements
  const newToggles = bannerElement.querySelectorAll('.dropdown-toggle');
  
  // Add click handlers to dropdown toggles
  newToggles.forEach(toggle => {
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
      bannerElement.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
        if (openMenu !== menu) {
          openMenu.classList.remove('show');
          openMenu.style.display = '';
        }
      });
      
      // Toggle this dropdown menu
      menu.classList.toggle('show');
      
      // Ensure display style is set correctly
      if (menu.classList.contains('show')) {
        menu.style.display = 'block';
        
        // Position adjustment for edge cases
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // If the dropdown would go off the right edge of the screen
        if (rect.right > viewportWidth) {
          menu.style.left = 'auto';
          menu.style.right = '0';
          menu.style.transform = 'none';
        }
        
        // If the dropdown would go off the left edge of the screen
        if (rect.left < 0) {
          menu.style.left = '0';
          menu.style.right = 'auto';
          menu.style.transform = 'none';
        }
      } else {
        menu.style.display = '';
      }
    });
  });
  
  // Add click handlers to dropdown items - explicitly limit scope to banner dropdown items only
  const dropdownItems = bannerElement.querySelectorAll('.dropdown-item');
  
  // Remove any existing event listeners to prevent duplication
  dropdownItems.forEach(item => {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
  });
  
  // Get the new dropdown items
  const newItems = bannerElement.querySelectorAll('.dropdown-item');
  
  newItems.forEach(item => {
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
      
      // Close the dropdown after click
      const menu = this.closest('.dropdown-menu');
      if (menu) {
        menu.classList.remove('show');
        menu.style.display = '';
      }
    });
  });
  
  // Set up logout functionality
  const logoutBtn = bannerElement.querySelector('#logout-btn');
  if (logoutBtn) {
    console.log('Found logout button, attaching event listener');
    logoutBtn.addEventListener('click', handleLogout);
  } else {
    console.log('Logout button not found in the DOM');
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.banner-dropdown')) {
      bannerElement.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
      });
    }
  });
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      bannerElement.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
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
  const bannerElement = document.querySelector('.site-banner');
  
  // Find matching nav item and add active class
  bannerElement.querySelectorAll('nav a').forEach(link => {
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