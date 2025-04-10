// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Initialize when this script loads
console.log('Banner script loaded - initializing dropdown functionality');
initBanner();

// Initialize banner and dropdown functionality
function initBanner() {
  // Initialize dropdown toggles
  initDropdownToggles();
  
  // Set up logout functionality
  initLogout();
  
  // Set up global click and key handlers
  initGlobalHandlers();
  
  // Special fix for Price Checker link
  fixPriceCheckerLink();
}

function initDropdownToggles() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles in banner`);
  
  // Add click handlers to dropdown toggles
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', handleDropdownToggle);
  });
}

// Centralized event handler for dropdown toggles
function handleDropdownToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Dropdown toggle clicked:', this.textContent.trim());
  
  const toggle = e.currentTarget;
  const dropdown = toggle.closest('.dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  
  if (!menu) {
    console.error('No dropdown menu found for toggle:', toggle.textContent.trim());
    return;
  }
  
  // Close all other open dropdowns
  document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
    if (openMenu !== menu) {
      closeDropdown(openMenu);
    }
  });
  
  // Toggle this dropdown menu
  toggleDropdown(menu);
  
  // Update ARIA attributes for accessibility
  toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
  
  // Ensure all dropdown items are clickable with proper styles
  if (menu.classList.contains('show')) {
    fixDropdownItems(menu);
  }
}

// Fix all dropdown items to ensure they're clickable
function fixDropdownItems(menu) {
  const items = menu.querySelectorAll('.dropdown-item');
  console.log(`Fixing ${items.length} dropdown items in menu`);
  
  items.forEach(item => {
    // Ensure proper styling
    item.style.pointerEvents = 'auto';
    item.style.cursor = 'pointer';
    item.style.position = 'relative';
    item.style.zIndex = '10000';
    item.style.display = 'block';
    
    // Specially log if this is the Price Checker link
    if (item.getAttribute('href') === '/tools/price-checker') {
      console.log('Applied fixes to Price Checker link specifically');
    }
  });
}

// Clean functions to open, close, and toggle dropdowns
function openDropdown(menu) {
  menu.classList.add('show');
  menu.style.display = 'block';
}

function closeDropdown(menu) {
  menu.classList.remove('show');
  menu.style.display = 'none';
}

function toggleDropdown(menu) {
  if (menu.classList.contains('show')) {
    closeDropdown(menu);
  } else {
    openDropdown(menu);
  }
}

function initLogout() {
  // Set up logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
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

function initGlobalHandlers() {
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(closeDropdown);
    }
  });
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(closeDropdown);
    }
  });
}

// Special direct fix for the Price Checker link only
function fixPriceCheckerLink() {
  // Wait a short moment to ensure DOM is fully processed
  setTimeout(() => {
    // Find by exact href - UPDATED to include trailing slash
    const priceCheckerLinks = [
      document.querySelector('a[href="/tools/price-checker"]'),
      document.querySelector('a[href="/tools/price-checker/"]')
    ].filter(link => link);
    
    if (priceCheckerLinks.length > 0) {
      const priceCheckerLink = priceCheckerLinks[0];
      console.log('Found Price Checker link, applying special fix');
      
      // Remove any existing event listeners by cloning
      const clone = priceCheckerLink.cloneNode(true);
      
      // IMPORTANT: Update the href to include trailing slash
      clone.href = "/tools/price-checker/";
      
      // Apply all necessary styles
      clone.style.pointerEvents = 'auto';
      clone.style.cursor = 'pointer';
      clone.style.position = 'relative';
      clone.style.zIndex = '10000';
      clone.style.display = 'block';
      
      // Add direct click handler with forced navigation - UPDATED URL
      clone.addEventListener('click', function(e) {
        console.log('Price Checker link clicked');
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/tools/price-checker/';
      });
      
      // Replace the original link
      if (priceCheckerLink.parentNode) {
        priceCheckerLink.parentNode.replaceChild(clone, priceCheckerLink);
        console.log('Price Checker link replaced with enhanced version');
      }
    } else {
      console.error('Price Checker link not found by selector');
      
      // Try an alternative approach - find the Tools dropdown by text
      const toolsToggles = Array.from(document.querySelectorAll('.dropdown-toggle')).filter(
        toggle => toggle.textContent.trim() === 'Tools'
      );
      
      if (toolsToggles.length > 0) {
        const toolsDropdown = toolsToggles[0].closest('.dropdown');
        const dropdownMenu = toolsDropdown.querySelector('.dropdown-menu');
        
        if (dropdownMenu) {
          // Create a new Price Checker link with correct URL
          const newLink = document.createElement('a');
          newLink.href = '/tools/price-checker/'; // Note the trailing slash!
          newLink.className = 'dropdown-item';
          newLink.textContent = 'Price Checker';
          newLink.style.display = 'block';
          newLink.style.pointerEvents = 'auto';
          newLink.style.cursor = 'pointer';
          newLink.style.position = 'relative';
          newLink.style.zIndex = '10000';
          
          newLink.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Price Checker clicked (new link)');
            window.location.href = '/tools/price-checker/';
            return false;
          };
          
          // Add the new link to the Tools dropdown
          dropdownMenu.appendChild(newLink);
        }
      }
    }
  }, 300);
}