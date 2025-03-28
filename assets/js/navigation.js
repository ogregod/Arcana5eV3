// assets/js/navigation.js
// Consolidated navigation functionality - FIXED VERSION

/**
 * Initialize dropdown functionality for the entire site
 */
export function initDropdowns() {
  console.log('Initializing dropdown functionality - fixed version');
  
  // Select all dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles`);
  
  // DO NOT CLONE - this breaks event listeners
  // Add click event to each dropdown toggle directly
  dropdownToggles.forEach(toggle => {
    console.log('Attaching click handler to dropdown:', toggle.textContent.trim());
    
    // Explicitly remove any existing handlers first by replacing with a clone
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Add the click event listener directly
    newToggle.addEventListener('click', function(e) {
      console.log('Dropdown clicked:', this.textContent.trim());
      e.preventDefault();
      e.stopPropagation();
      
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
          openMenu.style.display = ''; // Reset display style
        }
      });
      
      // Toggle current dropdown
      console.log('Before toggle, menu has show class:', menu.classList.contains('show'));
      menu.classList.toggle('show');
      console.log('After toggle, menu has show class:', menu.classList.contains('show'));
      
      // Force style to ensure visibility
      if (menu.classList.contains('show')) {
        menu.style.display = 'block';
      } else {
        menu.style.display = '';
      }
      
      // Update ARIA attributes for accessibility
      this.setAttribute('aria-expanded', menu.classList.contains('show'));
    });
  });
  
  // Handle dropdown item clicks properly
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      console.log('Dropdown item clicked:', this.textContent.trim());
      
      // Special handling for logout button
      if (this.id === 'logout-btn') {
        // Logout is handled separately in banner.js
        return;
      }
      
      // Close the dropdown after clicking an item
      const menu = this.closest('.dropdown-menu');
      if (menu) {
        menu.classList.remove('show');
        menu.style.display = '';
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
      });
    }
  });
  
  // Close dropdowns when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
      });
    }
  });
  
  // Add direct CSS to ensure proper display
  addEssentialCSS();
}

/**
 * Add essential CSS directly to ensure dropdowns display properly
 */
function addEssentialCSS() {
  // Only add if not already present
  if (document.getElementById('essential-dropdown-css')) return;
  
  const style = document.createElement('style');
  style.id = 'essential-dropdown-css';
  style.textContent = `
    /* Essential dropdown display fix */
    .dropdown-menu.show {
      display: block !important;
      z-index: 9999 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Ensure nav container is horizontal */
    .nav-container {
      display: flex !important;
      flex-direction: row !important;
      justify-content: flex-end !important;
      gap: 1.5rem !important;
    }
    
    /* Dropdown position fix */
    .dropdown {
      position: relative !important;
    }
    
    /* Dropdown menu position */
    .dropdown-menu {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      min-width: 10rem !important;
      padding: 0.5rem 0 !important;
      margin-top: 0.125rem !important;
      background-color: white !important;
      border: 1px solid rgba(0, 0, 0, 0.15) !important;
      border-radius: 0.25rem !important;
    }
  `;
  document.head.appendChild(style);
  console.log('Essential CSS added to fix dropdown display');
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