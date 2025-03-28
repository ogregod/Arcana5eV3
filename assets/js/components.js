// assets/js/components.js

/**
 * Component loader utility
 * This file provides functions for loading components consistently across the site
 */

/**
 * Load a component and its associated JavaScript
 * @param {string} placeholder - The ID of the element to replace with the component
 * @param {string} componentPath - The path to the component HTML file
 * @param {string} scriptPath - The path to the component script file
 * @returns {Promise} - A promise that resolves when the component is loaded
 */
export async function loadComponent(placeholder, componentPath, scriptPath) {
    const placeholderElement = document.getElementById(placeholder);
    if (!placeholderElement) {
      console.error(`Placeholder element with ID "${placeholder}" not found`);
      return;
    }
    
    try {
      // Fetch the component HTML
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component from ${componentPath}: ${response.status}`);
      }
      
      // Insert the HTML into the placeholder
      const html = await response.text();
      placeholderElement.innerHTML = html;
      
      // Create and load the script
      return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        if (document.querySelector(`script[src="${scriptPath}"]`)) {
          console.log(`Script ${scriptPath} already loaded`);
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptPath;
        script.onload = () => {
          console.log(`Component script loaded: ${scriptPath}`);
          resolve();
        };
        script.onerror = (err) => {
          console.error(`Error loading component script ${scriptPath}:`, err);
          reject(err);
        };
        document.body.appendChild(script);
      });
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      placeholderElement.innerHTML = `<div class="error-message">Failed to load component</div>`;
      throw error;
    }
  }
  
  /**
   * Load the banner component (convenience function)
   * @returns {Promise} - A promise that resolves when the banner is loaded
   */
  export async function loadBanner() {
    return loadComponent(
      'banner-placeholder', 
      '/components/banner/banner.html', 
      '/components/banner/banner.js'
    );
  }