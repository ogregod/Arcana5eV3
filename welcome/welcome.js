// Example improved page loading script (for each page)
document.addEventListener('DOMContentLoaded', async () => {
  // Load banner component
  const bannerPlaceholder = document.getElementById('banner-placeholder');
  
  try {
    // Load banner HTML
    const response = await fetch('/components/banner/banner.html');
    if (response.ok) {
      const html = await response.text();
      bannerPlaceholder.innerHTML = html;
      
      // Execute banner script after inserting HTML with explicit onload handler
      const bannerScript = document.createElement('script');
      bannerScript.type = 'module';
      bannerScript.src = '/components/banner/banner.js';
      bannerScript.onload = () => {
        console.log('Banner script loaded and executed successfully');
      };
      bannerScript.onerror = (error) => {
        console.error('Error loading banner script:', error);
      };
      document.body.appendChild(bannerScript);
    } else {
      console.error('Failed to load banner component:', response.status);
    }
  } catch (error) {
    console.error('Error loading banner component:', error);
  }
  
  // Continue with page-specific code...
});