/**
 * Dropdown Component JavaScript
 * 
 * This script provides functionality for dropdown menus throughout the application.
 * It handles opening/closing dropdowns, keyboard navigation, and accessibility.
 * 
 * @file components/dropdowns/dropdown.js
 */

/**
 * Initialize dropdown functionality
 * @param {string} selector - CSS selector for dropdown toggle buttons (default: '.dropdown-toggle')
 */
export function initDropdown(selector = '.dropdown-toggle') {
    console.log('Initializing dropdowns...');
    
    // Get all dropdown toggles matching the selector
    const dropdownToggles = document.querySelectorAll(selector);
    console.log(`Found ${dropdownToggles.length} dropdown toggles`);
    
    if (dropdownToggles.length === 0) {
      console.warn('No dropdown toggles found with selector:', selector);
      return;
    }
    
    // Add click event to each dropdown toggle
    dropdownToggles.forEach(toggle => {
      // Remove any existing click listeners to prevent duplication
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      // Add click event to the new toggle
      newToggle.addEventListener('click', function(e) {
        console.log('Dropdown toggle clicked:', this.textContent.trim());
        e.preventDefault();
        e.stopPropagation();
        
        // Find associated dropdown menu
        const dropdown = this.closest('.dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!menu) {
          console.error('No dropdown menu found for toggle:', this.textContent.trim());
          return;
        }
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
          if (openMenu !== menu) {
            closeDropdown(openMenu);
          }
        });
        
        // Toggle current dropdown
        if (menu.classList.contains('show')) {
          closeDropdown(menu);
        } else {
          openDropdown(menu);
        }
        
        // Update ARIA attributes for accessibility
        this.setAttribute('aria-expanded', menu.classList.contains('show'));
      });
    });
    
    // Handle dropdown item clicks
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    console.log(`Found ${dropdownItems.length} dropdown items`);
    
    dropdownItems.forEach(item => {
      // Remove any existing click listeners to prevent duplication
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      // Add click event to the new item
      newItem.addEventListener('click', function(e) {
        console.log('Dropdown item clicked:', this.textContent.trim());
        
        // Only prevent default for items with no href or "#" href
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:')) {
          e.preventDefault();
        }
        
        // Special handling for logout button and other special actions
        if (this.id === 'logout-btn') {
          // Logout is handled separately in the auth.js
          console.log('Logout button clicked - action handled elsewhere');
          return;
        }
        
        // Close the dropdown after click (for better UX)
        const menu = this.closest('.dropdown-menu');
        if (menu) {
          closeDropdown(menu);
        }
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          closeDropdown(menu);
        });
      }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
      // Close dropdowns on Escape key
      if (e.key === 'Escape') {
        const openMenus = document.querySelectorAll('.dropdown-menu.show');
        if (openMenus.length > 0) {
          openMenus.forEach(menu => closeDropdown(menu));
          
          // Focus the toggle button after closing
          const toggle = openMenus[0].closest('.dropdown').querySelector('.dropdown-toggle');
          if (toggle) toggle.focus();
          
          e.preventDefault();
        }
      }
      
      // Handle arrow key navigation within open dropdowns
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const activeDropdown = document.querySelector('.dropdown-menu.show');
        if (activeDropdown) {
          const items = Array.from(activeDropdown.querySelectorAll('.dropdown-item:not(.disabled)'));
          if (items.length === 0) return;
          
          // Find the currently focused item
          const currentIndex = items.findIndex(item => item === document.activeElement);
          let newIndex;
          
          if (e.key === 'ArrowDown') {
            // Move to next item or first if at end
            newIndex = currentIndex < 0 || currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
          } else { // ArrowUp
            // Move to previous item or last if at beginning
            newIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          }
          
          items[newIndex].focus();
          e.preventDefault();
        }
      }
    });
  }
  
  /**
   * Open a dropdown menu
   * @param {HTMLElement} menu - The dropdown menu element to open
   */
  function openDropdown(menu) {
    console.log('Opening dropdown menu');
    menu.classList.add('show');
    menu.style.display = 'block';  // Ensure it's visible
    
    // Update ARIA attributes
    const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }
    
    // Notify for debugging
    console.log('Dropdown opened:', menu);
  }
  
  /**
   * Close a dropdown menu
   * @param {HTMLElement} menu - The dropdown menu element to close
   */
  function closeDropdown(menu) {
    console.log('Closing dropdown menu');
    menu.classList.remove('show');
    menu.style.display = '';  // Reset to default (CSS will handle)
    
    // Update ARIA attributes
    const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    
    // Notify for debugging
    console.log('Dropdown closed:', menu);
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
   * Initialize navigation based on current page
   * Adds 'active' class to navigation items that match the current URL
   */
  export function initActiveNav() {
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    
    // Find matching nav items and add active class
    document.querySelectorAll('nav a').forEach(link => {
      const linkPath = link.getAttribute('href');
      if (!linkPath) return;
      
      // Skip non-path links (like '#' or 'javascript:')
      if (linkPath.startsWith('#') || linkPath.startsWith('javascript:')) return;
      
      // Check if the current path matches the link or if it's a sub-path
      if (currentPath === linkPath || 
          (linkPath !== '/' && currentPath.startsWith(linkPath))) {
        link.classList.add('active');
        
        // If in dropdown, also mark parent
        const dropdownItem = link.closest('.dropdown-item');
        if (dropdownItem) {
          // Set this item as active
          setActiveDropdownItem(dropdownItem);
          
          // Also highlight the parent dropdown toggle
          const dropdown = dropdownItem.closest('.dropdown');
          if (dropdown) {
            dropdown.classList.add('active');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
              toggle.classList.add('active');
            }
          }
        }
      }
    });
  }
  
  // Initialize all navigation when the module is imported directly
  // This provides an auto-init capability for simpler usage
  document.addEventListener('DOMContentLoaded', () => {
    initDropdown();
    initActiveNav();
    console.log('Dropdown navigation initialized');
  });
  
  // Export for use in other modules
  export default {
    initDropdown,
    initActiveNav,
    setActiveDropdownItem
  };