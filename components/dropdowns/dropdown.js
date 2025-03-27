// components/dropdowns/dropdown.js

/**
 * Initialize dropdown functionality for dropdown elements
 * @param {string} selector - CSS selector for dropdown toggle elements
 */
export function initDropdown(selector = '.dropdown-toggle') {
    const dropdownToggles = document.querySelectorAll(selector);
    
    // Add click event to each dropdown toggle
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.closest('.dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
          if (openMenu !== menu) {
            openMenu.classList.remove('show');
          }
        });
        
        // Toggle current dropdown
        menu.classList.toggle('show');
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
        });
      }
    });
    
    // Close dropdowns when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
        });
      }
    });
  }
  
  // Initialize dropdowns on page load
  document.addEventListener('DOMContentLoaded', () => {
    initDropdown();
  });
  
  // Export for use in other modules
  export default {
    initDropdown
  };