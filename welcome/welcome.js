// welcome/welcome.js
// This script handles loading the banner component and its associated scripts

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Welcome page loaded, initializing components...');
  
  // Load banner component
  const bannerPlaceholder = document.getElementById('banner-placeholder');
  
  if (!bannerPlaceholder) {
    console.error('Banner placeholder element not found!');
    return;
  }
  
  try {
    console.log('Fetching banner component HTML...');
    const response = await fetch('/components/banner/banner.html');
    
    if (response.ok) {
      const html = await response.text();
      
      // Insert the banner HTML
      bannerPlaceholder.innerHTML = html;
      console.log('Banner HTML inserted successfully');
      
      // Execute banner script after inserting HTML
      const bannerScript = document.createElement('script');
      bannerScript.type = 'module';
      bannerScript.src = '/components/banner/banner.js';
      
      // Add an event listener to know when the script is loaded
      bannerScript.onload = () => {
        console.log('Banner script loaded successfully');
        
        // EMERGENCY FIX: Direct attachment of click handlers to dropdowns
        setTimeout(attachDirectClickHandlers, 300);
      };
      
      bannerScript.onerror = (error) => {
        console.error('Error loading banner script:', error);
      };
      
      document.body.appendChild(bannerScript);
      
    } else {
      console.error('Failed to load banner component, status:', response.status);
    }
  } catch (error) {
    console.error('Error loading banner component:', error);
  }
});

// Direct attachment of click handlers as an emergency fix
function attachDirectClickHandlers() {
  console.log('Emergency fix: Adding direct dropdown handlers');
  
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log(`Found ${dropdownToggles.length} dropdown toggles for direct handlers`);
  
  // Add direct click handlers to each toggle
  dropdownToggles.forEach(toggle => {
    // First remove any existing handlers by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Add our direct handler
    newToggle.addEventListener('click', function(e) {
      console.log('Dropdown toggle clicked directly:', this.textContent.trim());
      e.preventDefault();
      e.stopPropagation();
      
      // Find the dropdown menu
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
      console.log('Toggling dropdown menu visibility');
      menu.classList.toggle('show');
      
      // Force CSS display property to ensure visibility
      if (menu.classList.contains('show')) {
        menu.style.display = 'block';
      } else {
        menu.style.display = '';
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      console.log('Clicked outside, closing all dropdowns');
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.style.display = '';
      });
    }
  });
  
  // Add direct CSS to ensure dropdowns show properly
  addEmergencyCSS();
}

// Add emergency CSS directly to ensure dropdowns display properly
function addEmergencyCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* Emergency fix for dropdown display */
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
  console.log('Emergency CSS added to fix dropdown display');
}