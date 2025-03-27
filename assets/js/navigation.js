// assets/js/navigation.js
// Navigation functionality

/**
 * Initialize dropdown menus
 * Makes dropdowns interactive with proper show/hide functionality
 */
export function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
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
    
    // Handle dropdown item clicks properly
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function(e) {
        // Only prevent default if it's a button with no href or "#" href
        const href = this.getAttribute('href');
        if (this.tagName === 'BUTTON' || href === '#' || href === '') {
          e.preventDefault();
        }
        
        // Special handling for logout button and other special actions
        if (this.id === 'logout-btn') {
          // Logout is handled separately in banner.js
          return;
        }
        
        // For regular links, let the browser handle navigation
        // The click will bubble up and close the dropdown automatically
        console.log('Dropdown item clicked:', this.textContent, 'href:', href);
        
        // Close the dropdown
        const dropdown = this.closest('.dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        menu.classList.remove('show');
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
  
  /**
   * Set active navigation item based on current page
   */
  export function initActiveNav() {
    const currentPath = window.location.pathname;
    
    // Find matching nav item and add active class
    document.querySelectorAll('nav a').forEach(link => {
      const linkPath = link.getAttribute('href');
      
      // Check if the current path matches the link or if it's a sub-path
      if (linkPath && (currentPath === linkPath || 
          (linkPath !== '/' && currentPath.startsWith(linkPath)))) {
        link.classList.add('active');
        
        // If in dropdown, also mark parent
        const dropdownItem = link.closest('.dropdown-item');
        if (dropdownItem) {
          const dropdown = dropdownItem.closest('.dropdown');
          if (dropdown) {
            dropdown.classList.add('active');
          }
        }
      }
    });
  }
  
  // Initialize navigation when called directly
  export function initNavigation() {
    initDropdowns();
    initActiveNav();
  }
  
  // Export for use in other modules
  export default {
    initDropdowns,
    initActiveNav,
    initNavigation
  };