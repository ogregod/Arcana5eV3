/**
 * Dropdown Component JavaScript (revised to work with banner.js)
 * 
 * This script provides supplementary functionality for dropdown menus.
 * The core dropdown functionality is handled by banner.js.
 * 
 * @file components/dropdowns/dropdown.js
 */

/**
 * Initialize dropdown functionality
 * @param {string} selector - CSS selector for dropdown toggle buttons (default: '.dropdown-toggle')
 */
export function initDropdown(selector = '.dropdown-toggle') {
  console.log('Dropdown initialization is now handled by banner.js');
  // This function is kept for backward compatibility
}

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

/**
 * This function is now a wrapper around the functionality in banner.js
 */
export function initActiveNav() {
  console.log('Active navigation is now handled by navigation.js');
  // Import and use from navigation.js instead
  import('/assets/js/navigation.js').then(module => {
    module.initActiveNav();
  }).catch(err => {
    console.error('Error importing navigation.js:', err);
  });
}

// Export for use in other modules
export default {
  initDropdown,
  initActiveNav,
  setActiveDropdownItem
};