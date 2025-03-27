// assets/js/utils.js
// Utility functions

// Format currency (Gold, Silver, Copper)
export function formatDndCurrency(priceInCopper) {
    const gold = Math.floor(priceInCopper / 100);
    const silver = Math.floor((priceInCopper % 100) / 10);
    const copper = priceInCopper % 10;
    
    let result = '';
    if (gold > 0) result += `${gold}g `;
    if (silver > 0) result += `${silver}s `;
    if (copper > 0 || (gold === 0 && silver === 0)) result += `${copper}c`;
    
    return result.trim();
  }
  
  // Sanitize input to prevent XSS
  export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  // Debounce function for search inputs
  export function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  // Local storage helpers
  export const storage = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
      }
    },
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
      }
    }
  };