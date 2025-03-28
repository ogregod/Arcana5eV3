/**
 * Dropdown Component JavaScript
 * 
 * This script provides supplementary functionality for dropdown menus.
 * The core dropdown functionality is now in banner.js.
 * 
 * @file components/dropdowns/dropdown.js
 */

/**
 * Initialize dropdown functionality
 * @param {string} selector - CSS selector for dropdown toggle buttons (default: '.dropdown-toggle')
 */
export function initDropdown(selector = '.dropdown-toggle') {
  console.log('Dropdown initialization now handled by banner.js');
  
  // This function is kept for backward compatibility
  // The actual initialization happens in banner.js
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
 * Set active navigation item based on current page
 */
export function initActiveNav() {
  const currentPath = window.location.pathname;
  
  // Find matching nav items and add active class
  document.querySelectorAll('nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Skip non-path links
    if (!linkPath || linkPath === '#' || linkPath.startsWith('javascript:')) return;
    
    // Check if current path matches the link or is a sub-path
    if (currentPath === linkPath || 
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
      
      // If in dropdown, also mark parent
      const dropdownItem = link.closest('.dropdown-item');
      if (dropdownItem) {
        setActiveDropdownItem(dropdownItem);
        
        // Also highlight the parent dropdown toggle
        const dropdown = dropdownItem.closest('.dropdown');
        if (dropdown) {
          dropdown.classList.add('active');
          const toggle = dropdown.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    }
  });
}

/**
 * Manually show a dropdown menu
 * @param {HTMLElement} menu - The dropdown menu to show
 */
export function showDropdown(menu) {
  if (!menu) return;
  
  menu.classList.add('show');
  menu.style.display = 'block';
  
  // Update ARIA attributes
  const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
}

/**
 * Manually hide a dropdown menu
 * @param {HTMLElement} menu - The dropdown menu to hide
 */
export function hideDropdown(menu) {
  if (!menu) return;
  
  menu.classList.remove('show');
  menu.style.display = '';
  
  // Update ARIA attributes
  const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

/**
 * Close all open dropdowns
 */
export function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    hideDropdown(menu);
  });
}

// Export for use in other modules
export default {
  initDropdown,
  initActiveNav,
  setActiveDropdownItem,
  showDropdown,
  hideDropdown,
  closeAllDropdowns
};