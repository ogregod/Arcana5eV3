// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Call initBanner immediately
initBanner();

// Initialize banner and dropdown functionality
function initBanner() {
  console.log('Initializing banner with super robust dropdown functionality...');
  
  // Fix dropdown items IMMEDIATELY and repeatedly
  fixAllDropdownItems();
  
  // Set interval to repeatedly fix dropdown items (helps with dynamic content)
  setInterval(fixAllDropdownItems, 500);
  
  // Initialize dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles in banner`);
  
  // Add click handlers to dropdown toggles
  dropdownToggles.forEach(toggle => {
    // Clear any existing listeners
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    newToggle.addEventListener('click', function(e) {
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
          openMenu.style.display = 'none';
        }
      });
      
      // Toggle this dropdown menu
      menu.classList.toggle('show');
      
      // Force display style to ensure visibility
      if (menu.classList.contains('show')) {
        menu.style.display = 'block';
        
        // Apply fixes IMMEDIATELY when dropdown opens
        setTimeout(() => {
          fixDropdownItems(menu);
        }, 0);
      } else {
        menu.style.display = 'none';
      }
    });
  });
  
  // Set up logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = 'none';
      });
    }
  });
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = 'none';
      });
    }
  });
}

// Fix all dropdown items in the document
function fixAllDropdownItems() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    fixDropdownItems(menu);
  });
}

// Apply fixes to all items in a specific dropdown menu
function fixDropdownItems(menu) {
  const items = menu.querySelectorAll('.dropdown-item');
  console.log(`Fixing ${items.length} dropdown items in menu`);
  
  items.forEach(item => {
    // Force pointer-events and other critical styles
    item.style.pointerEvents = 'auto';
    item.style.cursor = 'pointer';
    item.style.position = 'relative';
    item.style.zIndex = '10000';
    item.style.display = 'block';
    
    // Add super-aggressive click handling
    // First remove any existing listeners to avoid duplicates
    const newItem = item.cloneNode(true);
    if (item.parentNode) {
      item.parentNode.replaceChild(newItem, item);
    }
    
    // Now add our robust click handler
    newItem.addEventListener('click', function(event) {
      // Stop event from propagating to other elements
      event.stopPropagation();
      
      const href = this.getAttribute('href');
      console.log('Dropdown item clicked:', this.textContent.trim(), 'href:', href);
      
      // Special handling for logout button
      if (this.id === 'logout-btn') {
        event.preventDefault();
        handleLogout();
        return;
      }
      
      // Direct navigation for links
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        event.preventDefault(); // Prevent default to ensure our navigation works
        console.log('Navigating directly to:', href);
        window.location.href = href;
      }
      
      // Close all dropdown menus
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = 'none';
      });
    });
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