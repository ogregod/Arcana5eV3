// welcome/welcome.js
import { loadBanner } from '/assets/js/components.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Starting to load banner...');
    
    // Load the banner component
    await loadBanner();
    
    console.log('Banner loaded successfully');
    
    // Now initialize page-specific functionality
    initWelcomePage();
  } catch (error) {
    console.error('Error loading banner:', error);
  }
});

function initWelcomePage() {
  // Page-specific initialization code here
  console.log('Welcome page initialized');
  
  // Example: Add event listeners to hero buttons if needed
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');
  if (heroButtons.length) {
    console.log(`Found ${heroButtons.length} hero buttons`);
  }
}