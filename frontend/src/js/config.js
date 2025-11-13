/**
 * Configuration for CyberEd Frontend
 * Change API_BASE_URL to your computer's IP when accessing from other devices
 */

// For local development
const API_BASE_URL = 'http://localhost:4000';

// For network access (replace with your actual IP)
// const API_BASE_URL = 'http://192.168.1.6:4000';

// Export for ES6 modules (when loaded with type="module")
export { API_BASE_URL };

// Also make it available globally for regular scripts
if (typeof window !== 'undefined') {
  window.API_BASE_URL = API_BASE_URL;
}
