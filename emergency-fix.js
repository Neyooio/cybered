/**
 * Emergency Fix Script for CyberEd Login Issues
 * 
 * INSTRUCTIONS:
 * 1. Open your browser's Developer Console (Press F12)
 * 2. Copy and paste this entire script into the Console
 * 3. Press Enter to run it
 * 4. The page will automatically reload with the correct settings
 */

(function() {
  console.log('🔧 CyberEd Emergency Fix Starting...');
  
  // Step 1: Clear all cached API URLs
  console.log('📝 Clearing cached API URLs...');
  localStorage.removeItem('apiBase');
  localStorage.removeItem('API_BASE_URL');
  
  // Step 2: Clear authentication tokens (they might be tied to the wrong URL)
  console.log('🔑 Clearing old authentication tokens...');
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  sessionStorage.clear();
  
  // Step 3: Set the correct API URL
  const hostname = window.location.hostname;
  let correctApiUrl;
  
  if (hostname.includes('netlify.app') || hostname.includes('github.io')) {
    correctApiUrl = 'https://cybered-backend.onrender.com';
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    correctApiUrl = 'http://localhost:4000';
  } else {
    correctApiUrl = 'http://localhost:4000';
  }
  
  console.log('✅ Setting correct API URL:', correctApiUrl);
  window.API_BASE_URL = correctApiUrl;
  window.API_BASE = correctApiUrl;
  
  // Step 4: Show status
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('✨ FIX COMPLETE! ✨');
  console.log('═══════════════════════════════════════');
  console.log('Current hostname:', hostname);
  console.log('API URL set to:', correctApiUrl);
  console.log('');
  console.log('🔄 Reloading page in 2 seconds...');
  console.log('');
  
  // Step 5: Reload the page
  setTimeout(() => {
    window.location.reload();
  }, 2000);
})();
