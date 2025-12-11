// Website Management System
// This script manages the enable/disable state of modules and challenges

// API Configuration
import { API_BASE_URL } from './config.js';
const API_URL = `${API_BASE_URL}/api`;

// Default configuration (fallback only)
const DEFAULT_CONFIG = {
  modules: [
    {
      id: 'web-security',
      name: 'Web Security',
      description: 'Learn about protecting websites and web applications from attacks',
      enabled: true
    },
    {
      id: 'network-defense',
      name: 'Network Defense',
      description: 'Master network security fundamentals and defense strategies',
      enabled: true
    },
    {
      id: 'cryptography',
      name: 'Cryptography',
      description: 'Understand encryption and secure communication techniques',
      enabled: true
    },
    {
      id: 'malware-defense',
      name: 'Malware Defense',
      description: 'Detect, analyze, and defend against malicious software',
      enabled: true
    }
  ],
  challenges: [
    {
      id: 'cyber-runner',
      name: 'Cyber Runner',
      description: 'Jump over cyber threats in this endless runner game',
      difficulty: 'Easy',
      enabled: true
    },
    {
      id: 'crypto-crack',
      name: 'Crypto Crack',
      description: 'Decode encrypted messages using Caesar cipher',
      difficulty: 'Medium',
      enabled: true
    },
    {
      id: 'intrusion-intercept',
      name: 'Intrusion Intercept',
      description: 'Navigate real-world security breaches through branching scenarios',
      difficulty: 'Hard',
      enabled: true
    },
    {
      id: 'header-check',
      name: 'Header Check',
      description: 'Multiplayer card elimination game for email security',
      difficulty: 'Easy',
      enabled: true
    }
  ]
};

// State management
let currentConfig = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  attachEventListeners();
});

// Load configuration from backend API
async function loadConfig() {
  try {
    showLoading();
    const response = await fetch(`${API_URL}/website/config`);
    const data = await response.json();
    
    if (data.success) {
      currentConfig = {
        modules: data.config.modules,
        challenges: data.config.challenges
      };
    } else {
      throw new Error('Failed to load configuration');
    }
  } catch (error) {
    console.error('Error loading config:', error);
    showToast('Error loading configuration. Using defaults.', 'error');
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  } finally {
    hideLoading();
    renderUI();
  }
}

// Merge stored config with defaults
function mergeWithDefaults(stored) {
  const merged = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  
  // Update modules
  merged.modules = merged.modules.map(defaultModule => {
    const storedModule = stored.modules?.find(m => m.id === defaultModule.id);
    return storedModule ? { ...defaultModule, enabled: storedModule.enabled } : defaultModule;
  });
  
  // Update challenges
  merged.challenges = merged.challenges.map(defaultChallenge => {
    const storedChallenge = stored.challenges?.find(c => c.id === defaultChallenge.id);
    return storedChallenge ? { ...defaultChallenge, enabled: storedChallenge.enabled } : defaultChallenge;
  });
  
  return merged;
}

// Save configuration to backend API
async function saveConfig() {
  try {
    showLoading();
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      showToast('You must be logged in as admin', 'error');
      return false;
    }
    
    const response = await fetch(`${API_URL}/website/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(currentConfig)
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Configuration saved successfully! All users will see the changes.', 'success');
      return true;
    } else {
      throw new Error(data.error || 'Failed to save configuration');
    }
  } catch (error) {
    console.error('Error saving config:', error);
    showToast('Error saving configuration: ' + error.message, 'error');
    return false;
  } finally {
    hideLoading();
  }
}

// Render UI
function renderUI() {
  renderModules();
  renderChallenges();
  updateStats();
  updateSystemStatus();
}

// Render modules
function renderModules() {
  const grid = document.getElementById('modulesGrid');
  if (!grid) return;
  
  const html = currentConfig.modules.map(module => `
    <div class="feature-card ${!module.enabled ? 'disabled' : ''}" data-type="module" data-id="${module.id}">
      <div class="feature-header">
        <div class="feature-info">
          <h3 class="feature-name">${module.name}</h3>
          <div class="feature-id">${module.id}</div>
        </div>
      </div>
      <p class="feature-description">${module.description}</p>
      <div class="toggle-container">
        <div class="toggle-switch ${module.enabled ? 'active' : ''}" data-type="module" data-id="${module.id}">
          <div class="toggle-slider"></div>
        </div>
        <span class="toggle-label ${module.enabled ? 'enabled' : 'disabled'}">
          ${module.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      ${!module.enabled ? '<div class="maintenance-badge">⚠️ Under Maintenance</div>' : ''}
    </div>
  `).join('');
  
  grid.innerHTML = html;
}

// Render challenges
function renderChallenges() {
  const grid = document.getElementById('challengesGrid');
  if (!grid) return;
  
  const html = currentConfig.challenges.map(challenge => `
    <div class="feature-card ${!challenge.enabled ? 'disabled' : ''}" data-type="challenge" data-id="${challenge.id}">
      <div class="feature-header">
        <div class="feature-info">
          <h3 class="feature-name">${challenge.name}</h3>
          <div class="feature-id">${challenge.id}</div>
        </div>
      </div>
      <p class="feature-description">${challenge.description}</p>
      <div class="toggle-container">
        <div class="toggle-switch ${challenge.enabled ? 'active' : ''}" data-type="challenge" data-id="${challenge.id}">
          <div class="toggle-slider"></div>
        </div>
        <span class="toggle-label ${challenge.enabled ? 'enabled' : 'disabled'}">
          ${challenge.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      ${!challenge.enabled ? '<div class="maintenance-badge">⚠️ Under Maintenance</div>' : ''}
    </div>
  `).join('');
  
  grid.innerHTML = html;
}

// Update statistics
function updateStats() {
  const totalModules = currentConfig.modules.length;
  const activeModules = currentConfig.modules.filter(m => m.enabled).length;
  const totalChallenges = currentConfig.challenges.length;
  const activeChallenges = currentConfig.challenges.filter(c => c.enabled).length;
  
  document.getElementById('totalModules').textContent = totalModules;
  document.getElementById('activeModules').textContent = activeModules;
  document.getElementById('totalChallenges').textContent = totalChallenges;
  document.getElementById('activeChallenges').textContent = activeChallenges;
}

// Update system status
function updateSystemStatus() {
  const statusBadge = document.getElementById('systemStatus');
  if (!statusBadge) return;
  
  const allEnabled = [...currentConfig.modules, ...currentConfig.challenges].every(item => item.enabled);
  
  if (allEnabled) {
    statusBadge.className = 'status-badge operational';
    statusBadge.innerHTML = `
      <span class="status-indicator"></span>
      <span>All Systems Operational</span>
    `;
  } else {
    statusBadge.className = 'status-badge maintenance';
    statusBadge.innerHTML = `
      <span class="status-indicator"></span>
      <span>Maintenance Mode Active</span>
    `;
  }
}

// Attach event listeners
function attachEventListeners() {
  // Toggle switches
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.toggle-switch');
    if (toggle) {
      const type = toggle.dataset.type;
      const id = toggle.dataset.id;
      toggleFeature(type, id);
    }
  });
  
  // Save button
  const saveBtn = document.getElementById('saveChangesBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (saveConfig()) {
        showLoading();
        setTimeout(() => {
          hideLoading();
          renderUI(); // Refresh UI after save
        }, 500);
      }
    });
  }
  
  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      showLoading();
      setTimeout(() => {
        loadConfig();
        renderUI();
        hideLoading();
        showToast('Status refreshed', 'success');
      }, 500);
    });
  }
  
  // Reset button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset all settings to defaults? This will enable all features for ALL users.')) {
        try {
          showLoading();
          const token = localStorage.getItem('authToken');
          
          const response = await fetch(`${API_URL}/website/config/reset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            currentConfig = {
              modules: data.config.modules,
              challenges: data.config.challenges
            };
            renderUI();
            showToast('Reset to default configuration. All features enabled.', 'success');
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          console.error('Reset error:', error);
          showToast('Error resetting configuration', 'error');
        } finally {
          hideLoading();
        }
      }
    });
  }
}

// Toggle feature
function toggleFeature(type, id) {
  const collection = type === 'module' ? currentConfig.modules : currentConfig.challenges;
  const item = collection.find(i => i.id === id);
  
  if (item) {
    item.enabled = !item.enabled;
    renderUI();
    showToast(
      `${item.name} ${item.enabled ? 'enabled' : 'disabled'}`,
      item.enabled ? 'success' : 'error'
    );
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = toast.querySelector('.toast-icon');
  const messageEl = toast.querySelector('.toast-message');
  
  toast.className = `toast ${type}`;
  icon.textContent = type === 'success' ? '✅' : '❌';
  messageEl.textContent = message;
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Show loading overlay
function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('active');
}

// Export functions for use in other pages
window.WebsiteManagement = {
  isModuleEnabled: async (moduleId) => {
    const config = await getConfig();
    const module = config.modules?.find(m => m.id === moduleId);
    return module ? module.enabled : true; // Default to enabled if not found
  },
  
  isChallengeEnabled: async (challengeId) => {
    const config = await getConfig();
    const challenge = config.challenges?.find(c => c.id === challengeId);
    return challenge ? challenge.enabled : true; // Default to enabled if not found
  },
  
  getConfig: () => getConfig()
};

// Get current config from backend (helper function)
async function getConfig() {
  try {
    const response = await fetch(`${API_URL}/website/config`);
    const data = await response.json();
    
    if (data.success) {
      return {
        modules: data.config.modules,
        challenges: data.config.challenges
      };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error fetching config:', error);
    return DEFAULT_CONFIG;
  }
}
