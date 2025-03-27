// assets/js/navigation.js
// Navigation functionality

// Initialize dropdowns
export function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.parentElement;
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
  }
  
  // Initialize active navigation based on current page
  export function initActiveNav() {
    const currentPath = window.location.pathname;
    
    // Find matching nav item and add active class
    document.querySelectorAll('nav a').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
        
        // If in dropdown, also mark parent
        const dropdownItem = link.closest('.dropdown-item');
        if (dropdownItem) {
          const dropdown = dropdownItem.closest('.dropdown');
          dropdown.classList.add('active');
        }
      }
    });
  }
  
  // Initialize navigation on page load
  document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initActiveNav();
  });
  