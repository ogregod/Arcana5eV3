// components/banner/banner.js
import { logOut } from '/assets/js/auth.js';

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  console.log('Banner component loaded, initializing dropdowns...');
  initBanner();
});

// Initialize banner and dropdown functionality
function initBanner() {
  // Initialize dropdown toggles
  initDropdownToggles();
  
  // Set up logout functionality
  initLogout();
  
  // Set up global click and key handlers
  initGlobalHandlers();
}

function initDropdownToggles() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles in banner`);
  
  // Add click handlers to dropdown toggles (without cloning)
  dropdownToggles.forEach(toggle => {
    // Clean approach: remove old listeners with a new one
    toggle.addEventListener('click', handleDropdownToggle);
  });
}

// Centralized event handler for dropdown toggles
function handleDropdownToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
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