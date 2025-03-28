// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Initialize when this script loads
console.log('Banner script loaded - initializing dropdown functionality');
initBanner();

// Initialize banner and dropdown functionality
// Add this right after your initBanner() function
function initBanner() {
  // Initialize dropdown toggles
  initDropdownToggles();
  
  // Set up logout functionality
  initLogout();
  
  // Set up global click and key handlers
  initGlobalHandlers();
  
  // Add this line to call our new function
  fixToolsLinks();
}

// Special fix for tools links
function fixToolsLinks() {
  // Get all dropdown items in the Tools dropdown
  const toolsDropdown = document.querySelector('.dropdown-toggle:contains("Tools")').closest('.dropdown');
  const toolLinks = toolsDropdown.querySelectorAll('.dropdown-item');
  
  console.log(`Found ${toolLinks.length} tool links to fix`);
  
  toolLinks.forEach(link => {
    // First, make sure the item is properly styled and z-indexed
    link.style.pointerEvents = 'auto';
    link.style.cursor = 'pointer';
    link.style.position = 'relative';
    link.style.zIndex = '9999';
    
    // Remove any existing event listeners by cloning and replacing
    const clone = link.cloneNode(true);
    link.parentNode.replaceChild(clone, link);
    
    // Add direct click handler with forced navigation
    clone.addEventListener('click', function(e) {
      console.log(`Tool link clicked: ${this.textContent.trim()} - navigating to ${this.href}`);
      e.stopPropagation(); // Stop event bubbling
      window.location.href = this.href; // Force navigation
    });
  });
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