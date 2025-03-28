/**
 * Dropdown Component JavaScript
 * 
 * This script provides functionality for dropdown menus throughout the application.
 * It handles opening/closing dropdowns, keyboard navigation, and accessibility.
 * 
 * @file components/dropdowns/dropdown.js
 */

// Import from the consolidated navigation.js file
import { initDropdowns, initActiveNav } from '/assets/js/navigation.js';

/**
 * Add active class to dropdown item
 * @param {HTMLElement} item - The dropdown item to set as active
 */
export function setActiveDropdownItem(item) {
  if (!item) return;
  
  // Remove active class from all items in the same dropdown
  const menu = item.closest('.dropdown-menu');
  if (menu) {
    menu.querySelectorAll('.dropdown-item').forEach(i => {
      i.classList.remove('active');
    });
  }
  
  // Add active class to the selected item
  item.classList.add('active');
}

// COMMENTED OUT - This was causing conflicts by auto-initializing
// Initialize all navigation when the module is imported directly
// document.addEventListener('DOMContentLoaded', () => {
//   initDropdown();
//   initActiveNav();
//   console.log('Dropdown navigation initialized');
// });

// Provide a manual initialization method that delegates to navigation.js
export function init() {
  console.log('Dropdown component initialization delegated to navigation.js');
  initDropdowns();
  initActiveNav();
}

// Export for use in other modules
export default {
  init,
  setActiveDropdownItem
};