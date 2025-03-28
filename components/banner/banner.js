// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Call initBanner immediately 
initBanner();

// Initialize banner and dropdown functionality
function initBanner() {
  console.log('Initializing banner with dropdown functionality...');
  
  // Fix pointer-events issue IMMEDIATELY
  fixDropdownItemsPointerEvents();
  
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
        
        // Re-apply pointer-events fix to ensure items are clickable
        fixDropdownItemsPointerEvents();
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
  
  // Also install a MutationObserver to catch dynamically added/changed dropdown items
  const observer = new MutationObserver(fixDropdownItemsPointerEvents);
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}

// Function to fix pointer-events on dropdown items
function fixDropdownItemsPointerEvents() {
  document.querySelectorAll('.dropdown-item').forEach(item => {
    // Force pointer-events to auto
    item.style.pointerEvents = 'auto';
    
    // Add direct event listener if not already added
    if (!item.hasAttribute('data-click-fixed')) {
      item.setAttribute('data-click-fixed', 'true');
      
      item.addEventListener('click', function(e) {
        console.log('Dropdown item clicked:', this.textContent.trim());
        
        // Handle logout button specially
        if (this.id === 'logout-btn') {
          e.preventDefault();
          handleLogout(e);
          return;
        }
        
        // For links, let the browser handle navigation
        const href = this.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          console.log('Navigating to:', href);
          // Let the default behavior happen
        } else {
          // Prevent default for non-links
          e.preventDefault();
        }
        
        // Close dropdown
        const menu = this.closest('.dropdown-menu');
        if (menu) {
          menu.classList.remove('show');
          menu.style.display = '';
        }
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