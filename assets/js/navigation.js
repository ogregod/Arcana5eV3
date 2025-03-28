// assets/js/navigation.js
// Consolidated navigation functionality

/**
 * Initialize dropdown functionality for the entire site
 */
export function initDropdowns() {
  console.log('Initializing unified dropdown functionality');
  
  // Select all dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles`);
  
  // Add click event to each dropdown toggle (without cloning elements)
  dropdownToggles.forEach(toggle => {
    // Clean up any existing listeners
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Add new listener
    newToggle.addEventListener('click', handleToggleClick);
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
      console.log('Dropdown item clicked:', this.textContent, 'href:', href);
      
      // Close the dropdown
      const dropdown = this.closest('.dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');
      menu.classList.remove('show');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', handleOutsideClick);
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', handleEscKey);
  
  // Debug CSS to help troubleshoot layout issues
  const navContainer = document.querySelector('.nav-container');
  if (navContainer) {
    console.log('Nav container styles:', window.getComputedStyle(navContainer));
    console.log('Nav container children:', navContainer.children);
  }
}

/**
 * Handle dropdown toggle click
 * @param {Event} e - Click event
 */
function handleToggleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Dropdown toggle clicked:', this.textContent.trim());
  
  // Find dropdown and menu
  const dropdown = this.closest('.dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  
  if (!menu) {
    console.error('No dropdown menu found for toggle:', this.textContent.trim());
    return;
  }
  
  // Close all other dropdowns
  document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
    if (openMenu !== menu) {
      openMenu.classList.remove('show');
    }
  });
  
  // Toggle current dropdown
  menu.classList.toggle('show');
  
  // Update ARIA attributes for accessibility
  this.setAttribute('aria-expanded', menu.classList.contains('show'));
}

/**
 * Handle clicks outside of dropdowns
 * @param {Event} e - Click event
 */
function handleOutsideClick(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
      
      // Update ARIA attributes on associated toggle
      const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }
}

/**
 * Handle Escape key to close dropdowns
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscKey(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
      
      // Update ARIA attributes on associated toggle
      const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }
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
        dropdownItem.classList.add('active');
        
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

// Export a function to initialize everything
export function initNavigation() {
  initDropdowns();
  initActiveNav();
}

export default {
  initDropdowns,
  initActiveNav,
  initNavigation
};