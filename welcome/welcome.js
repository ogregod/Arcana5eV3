// welcome/welcome.js
document.addEventListener('DOMContentLoaded', async () => {
  // Load banner component
  const bannerPlaceholder = document.getElementById('banner-placeholder');
  
  try {
    const response = await fetch('/components/banner/banner.html');
    if (response.ok) {
      const html = await response.text();
      bannerPlaceholder.innerHTML = html;
      
      // Execute banner script after inserting HTML
      const bannerScript = document.createElement('script');
      bannerScript.type = 'module';
      bannerScript.src = '/components/banner/banner.js';
      document.body.appendChild(bannerScript);
    } else {
      console.error('Failed to load banner component');
    }
  } catch (error) {
    console.error('Error loading banner component:', error);
  }
});