/**
 * Configuration for CyberEd Frontend
 * Automatically detects environment and sets appropriate API URL
 */

// Auto-detect API URL based on current host
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
let API_BASE_URL;

// Production environment (Netlify or other hosting)
if (hostname.includes('netlify.app') || hostname.includes('yourdomain.com')) {
  // Your actual Render backend URL
  API_BASE_URL = 'https://cybered-backend.onrender.com';
  
// Network access (IP address)
} else if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '') {
  API_BASE_URL = `http://${hostname}:4000`;
  
// Local development
} else {
  API_BASE_URL = 'http://localhost:4000';
}

// Make it available globally for regular scripts
if (typeof window !== 'undefined') {
  window.API_BASE_URL = API_BASE_URL;
  window.API_BASE = API_BASE_URL;
  console.log('[Config] API_BASE_URL set to:', API_BASE_URL);
  console.log('[Config] Current hostname:', hostname);
}

// Export for ES6 modules
export { API_BASE_URL };
