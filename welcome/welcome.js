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
        
        // The banner.js script will call initNavigation() from navigation.js
        // which will initialize the dropdowns correctly
      };
      
      bannerScript.onerror = (error) => {
        console.error('Error loading banner script:', error);
      };
      
      document.body.appendChild(bannerScript);
      
      // Verify that the navigation container exists and has the right structure
      setTimeout(() => {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
          console.log('Nav container found with children:', navContainer.children.length);
          console.log('Dropdown toggles found:', document.querySelectorAll('.dropdown-toggle').length);
        } else {
          console.error('Nav container not found after banner loaded!');
        }
      }, 500); // Small delay to ensure DOM is updated
      
    } else {
      console.error('Failed to load banner component, status:', response.status);
    }
  } catch (error) {
    console.error('Error loading banner component:', error);
  }
  
  // Welcome page specific functionality can go here
  // For example:
  
  // Add event listeners to hero buttons if needed
  const priceCheckerBtn = document.querySelector('.hero-buttons .btn');
  if (priceCheckerBtn) {
    priceCheckerBtn.addEventListener('click', () => {
      console.log('Price checker button clicked');
      // Any additional functionality if needed
    });
  }
});