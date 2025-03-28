// assets/js/navigation.js
// Navigation functionality (modified to avoid dropdown conflicts)

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
  // Note: Dropdown functionality is now handled by banner.js
  // This prevents conflicts between multiple initialization attempts
  console.log('Navigation initialized (active navigation only)');
  initActiveNav();
}

export default {
  initActiveNav,
  initNavigation
};