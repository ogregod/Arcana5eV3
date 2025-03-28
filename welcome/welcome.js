// welcome/welcome.js
import { loadBanner } from '/assets/js/components.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // First, load the banner component
    await loadBanner();
    
    // Now initialize page-specific functionality
    initWelcomePage();
  } catch (error) {
    console.error('Error initializing welcome page:', error);
  }
});

function initWelcomePage() {
  // Your existing welcome page functionality here
  console.log('Welcome page initialized');
  
  // If you need to add any welcome page specific event listeners or logic
}