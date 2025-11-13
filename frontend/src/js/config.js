/**
 * Configuration for CyberEd Frontend
 * Automatically detects if accessing from network or localhost
 */

// Auto-detect API URL based on current host
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
let API_BASE_URL;

// If accessing via IP address (not localhost), use that IP for API
if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '') {
  API_BASE_URL = `http://${hostname}:4000`;
} else {
  // Local development
  API_BASE_URL = 'http://localhost:4000';
}

// Make it available globally for regular scripts
if (typeof window !== 'undefined') {
  window.API_BASE_URL = API_BASE_URL;
  console.log('[Config] API_BASE_URL set to:', API_BASE_URL);
  console.log('[Config] Current hostname:', hostname);
}

// Export for ES6 modules
export { API_BASE_URL };
