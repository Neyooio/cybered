// Faculty Space Management
// Determine API base URL based on environment
function getApiBase() {
  // Use global config if available
  if (window.API_BASE_URL) return window.API_BASE_URL;
  
  const hostname = window.location.hostname;
  
  // Production environments
  if (hostname.includes('netlify.app') || hostname.includes('github.io') || hostname.includes('onrender.com')) {
    return 'https://cybered-backend.onrender.com';
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Network access (LAN)
  return `${window.location.protocol}//${hostname}:4000`;
}

const API_BASE_URL = getApiBase();
const API_URL = `${API_BASE_URL}/api`;

let currentSpace = null;
let currentTab = 'modules';
let userRole = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  const spaceId = getSpaceIdFromURL();
  
  if (!spaceId) {
    console.error('No space ID in URL');
    window.location.href = 'modules.html';
    return;
  }

  // Get user role
  userRole = localStorage.getItem('authRole');
  
  await loadSpaceData(spaceId);
  initializeTabs();
  initializeActionButtons();
  applyRoleBasedUI();
});

// Get space ID from URL parameters
function getSpaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Load space data from API
async function loadSpaceData(spaceId) {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found');
      window.location.href = 'register-form.html';
      return;
    }

    const apiUrl = `${API_URL}/faculty-modules/${spaceId}`;
    console.log('[Faculty Space] Loading space from:', apiUrl);
    console.log('[Faculty Space] API_URL:', API_URL);
    console.log('[Faculty Space] API_BASE_URL:', API_BASE_URL);
    console.log('[Faculty Space] Space ID:', spaceId);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('[Faculty Space] Response status:', response.status);
    console.log('[Faculty Space] Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Faculty Space] Error response:', errorText);
      throw new Error(`Failed to load space: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('[Faculty Space] Response data:', data);
    
    currentSpace = data.space || data;
    
    console.log('[Faculty Space] Loaded space:', currentSpace);
    console.log('[Faculty Space] Space _id:', currentSpace._id);
    console.log('[Faculty Space] Space id:', currentSpace.id);
    console.log('[Faculty Space] Enrolled students:', currentSpace.enrolledStudents);
    
    // Ensure _id exists
    if (!currentSpace._id && !currentSpace.id) {
      console.error('[Faculty Space] ERROR: Space has no _id or id field!');
      console.error('[Faculty Space] Full space object:', JSON.stringify(currentSpace, null, 2));
      throw new Error('Space data is missing ID field');
    }
    
    renderSpaceHeader();
    renderModules();
    renderAnnouncements();
    renderStudents();
  } catch (error) {
    console.error('[Faculty Space] Error loading space:', error);
    console.error('[Faculty Space] Error message:', error.message);
    console.error('[Faculty Space] Error stack:', error.stack);
    alert('Failed to load space. Redirecting to modules page.');
    window.location.href = 'modules.html';
  }
}

// Render space header
function renderSpaceHeader() {
  if (!currentSpace) return;

  document.getElementById('spaceTitle').textContent = currentSpace.name;
  document.getElementById('spaceDescription').textContent = currentSpace.description || 'No description provided';
  document.getElementById('spaceCode').textContent = currentSpace.spaceCode;
  document.getElementById('studentCount').textContent = `${currentSpace.enrolledStudents?.length || 0}`;
  
  // Apply theme color
  applyThemeColor(currentSpace.theme?.primaryColor || '#1d4ed8');
}

// Apply theme color to the page
function applyThemeColor(primaryColor) {
  // Convert hex to RGB for lighter/darker variants
  const rgb = hexToRgb(primaryColor);
  if (!rgb) return;
  
  // Create darker variant (multiply by 0.85)
  const darkerRgb = {
    r: Math.floor(rgb.r * 0.85),
    g: Math.floor(rgb.g * 0.85),
    b: Math.floor(rgb.b * 0.85)
  };
  
  // Apply CSS variables
  document.documentElement.style.setProperty('--space-primary', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`);
  document.documentElement.style.setProperty('--space-primary-dark', `rgba(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b}, 0.9)`);
  document.documentElement.style.setProperty('--space-primary-solid', primaryColor);
}

// Convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Initialize tab switching
function initializeTabs() {
  const tabs = document.querySelectorAll('.space-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
}

// Switch between tabs
function switchTab(tabName) {
  currentTab = tabName;

  // Update tab active states
  document.querySelectorAll('.space-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update panel active states - convert kebab-case to camelCase for IDs
  const panelId = tabName + 'Panel'; // e.g., 'modules' becomes 'modulesPanel'
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === panelId);
  });
  
  // Load settings when settings tab is clicked
  if (tabName === 'settings') {
    loadSettingsContent();
  }
}

// Load settings content into the tab
function loadSettingsContent() {
  const settingsContent = document.getElementById('settingsModalContent');
  
  if (!settingsContent) return;
  
  // Populate current settings
  const currentColor = currentSpace.theme?.primaryColor || '#1d4ed8';
  
  settingsContent.innerHTML = `
    <!-- Space Info Section -->
    <div class="settings-section">
      <h4 class="settings-section-title">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
        Space Information
      </h4>
      <div class="settings-form-group">
        <label class="settings-label">Space Name</label>
        <input type="text" id="settingsSpaceName" class="settings-input" value="${currentSpace.name || ''}" maxlength="60" />
      </div>
      <div class="settings-form-group">
        <label class="settings-label">Description</label>
        <textarea id="settingsSpaceDescription" class="settings-textarea" maxlength="300">${currentSpace.description || ''}</textarea>
      </div>
    </div>

    <!-- Theme Section -->
    <div class="settings-section">
      <h4 class="settings-section-title">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd"/>
        </svg>
        Theme Color
      </h4>
      <div class="theme-color-grid">
        <div class="theme-color-option ${currentColor === '#1d4ed8' ? 'selected' : ''}" data-color="#1d4ed8" data-name="Blue">
          <div class="theme-color-swatch" style="background: #1d4ed8;"></div>
          <div class="theme-color-name">Blue</div>
        </div>
        <div class="theme-color-option ${currentColor === '#7c3aed' ? 'selected' : ''}" data-color="#7c3aed" data-name="Purple">
          <div class="theme-color-swatch" style="background: #7c3aed;"></div>
          <div class="theme-color-name">Purple</div>
        </div>
        <div class="theme-color-option ${currentColor === '#059669' ? 'selected' : ''}" data-color="#059669" data-name="Green">
          <div class="theme-color-swatch" style="background: #059669;"></div>
          <div class="theme-color-name">Green</div>
        </div>
        <div class="theme-color-option ${currentColor === '#dc2626' ? 'selected' : ''}" data-color="#dc2626" data-name="Red">
          <div class="theme-color-swatch" style="background: #dc2626;"></div>
          <div class="theme-color-name">Red</div>
        </div>
        <div class="theme-color-option ${currentColor === '#f59e0b' ? 'selected' : ''}" data-color="#f59e0b" data-name="Yellow">
          <div class="theme-color-swatch" style="background: #f59e0b;"></div>
          <div class="theme-color-name">Yellow</div>
        </div>
        <div class="theme-color-option ${currentColor === '#ec4899' ? 'selected' : ''}" data-color="#ec4899" data-name="Pink">
          <div class="theme-color-swatch" style="background: #ec4899;"></div>
          <div class="theme-color-name">Pink</div>
        </div>
        <div class="theme-color-option ${currentColor === '#06b6d4' ? 'selected' : ''}" data-color="#06b6d4" data-name="Cyan">
          <div class="theme-color-swatch" style="background: #06b6d4;"></div>
          <div class="theme-color-name">Cyan</div>
        </div>
        <div class="theme-color-option ${currentColor === '#64748b' ? 'selected' : ''}" data-color="#64748b" data-name="Gray">
          <div class="theme-color-swatch" style="background: #64748b;"></div>
          <div class="theme-color-name">Gray</div>
        </div>
      </div>
    </div>

    <!-- Enrolled Students Section -->
    <div class="settings-section">
      <h4 class="settings-section-title">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
        Manage Students
      </h4>
      <div class="enrolled-students-list" id="settingsStudentsList">
        <!-- Students will be loaded here -->
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="settings-section settings-danger-zone">
      <h4 class="settings-section-title">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        Danger Zone
      </h4>
      <button class="settings-delete-btn" id="deleteSpaceBtn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Delete Space
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="settings-actions">
      <button class="settings-cancel-btn" id="cancelSettingsBtn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Cancel
      </button>
      <button class="settings-save-btn" id="saveSettingsBtn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Save Changes
      </button>
    </div>
  `;
  
  // Load enrolled students
  renderSettingsStudentsList();
  
  // Re-initialize settings event listeners
  initializeSettingsModal();
}

// Apply role-based UI visibility
function applyRoleBasedUI() {
  const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
  
  // Hide/show Settings tab
  const settingsTab = document.querySelector('.space-tab[data-tab="settings"]');
  if (settingsTab) {
    settingsTab.style.display = isFacultyOrAdmin ? 'flex' : 'none';
  }
  
  // Hide/show Add Module button
  const addModuleBtn = document.getElementById('addModuleBtn');
  if (addModuleBtn) {
    addModuleBtn.style.display = isFacultyOrAdmin ? 'flex' : 'none';
  }
  
  // Hide/show Add Announcement button
  const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
  if (addAnnouncementBtn) {
    addAnnouncementBtn.style.display = isFacultyOrAdmin ? 'flex' : 'none';
  }
}

// Initialize action buttons
function initializeActionButtons() {
  // Copy code button
  document.getElementById('copyCodeBtn').addEventListener('click', copySpaceCode);

  // Add module button
  const addModuleBtn = document.getElementById('addModuleBtn');
  if (addModuleBtn) {
    addModuleBtn.addEventListener('click', openAddModuleModal);
  }

  // Add announcement button
  const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
  if (addAnnouncementBtn) {
    addAnnouncementBtn.addEventListener('click', openAddAnnouncementModal);
  }
  
  // Settings tab is now handled by tab switching (no separate button needed)
}

// Open settings modal
function openSettingsModal() {
  // Check if currentSpace is loaded
  if (!currentSpace || !currentSpace._id) {
    console.error('Cannot open settings: space not loaded', currentSpace);
    alert('Please wait for the space to load before opening settings.');
    return;
  }
  
  const overlay = document.getElementById('settingsModalOverlay');
  overlay.classList.add('active');
  
  console.log('[Settings Modal] Opening with space:', currentSpace._id);
  
  // Populate current settings
  document.getElementById('settingsSpaceName').value = currentSpace.name || '';
  document.getElementById('settingsSpaceDescription').value = currentSpace.description || '';
  
  // Set current theme color
  const currentColor = currentSpace.theme?.primaryColor || '#1d4ed8';
  document.querySelectorAll('.theme-color-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.color === currentColor);
  });
  
  // Load enrolled students
  renderSettingsStudentsList();
  
  // Initialize modal event listeners
  initializeSettingsModal();
}

// Close settings modal
function closeSettingsModal() {
  const overlay = document.getElementById('settingsModalOverlay');
  overlay.classList.remove('active');
  
  // Clear password field
  document.getElementById('deletePasswordInput').value = '';
}

// Initialize settings modal event listeners
function initializeSettingsModal() {
  const cancelBtn = document.getElementById('cancelSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const deleteBtn = document.getElementById('deleteSpaceBtn');
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      // Switch back to modules tab
      switchTab('modules');
    });
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveSpaceSettings);
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteSpace);
  }
  
  // Theme color selection
  document.querySelectorAll('.theme-color-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.theme-color-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

// Render students list in settings
function renderSettingsStudentsList() {
  const container = document.getElementById('settingsStudentsList');
  const countSpan = document.getElementById('settingsStudentCount');
  
  if (!currentSpace?.enrolledStudents || currentSpace.enrolledStudents.length === 0) {
    container.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No students enrolled</p>';
    countSpan.textContent = '0';
    return;
  }
  
  countSpan.textContent = currentSpace.enrolledStudents.length;
  
  container.innerHTML = currentSpace.enrolledStudents.map(student => {
    // Handle different possible field names
    const displayName = student.username || student.name || 'Student';
    const displayEmail = student.email || 'No email';
    
    // Get avatar
    const avatarHtml = getStudentAvatar(student);
    
    return `
      <div class="enrolled-student-item">
        <div class="enrolled-student-info">
          ${avatarHtml}
          <div class="enrolled-student-details">
            <h4>${displayName}</h4>
            <p>${displayEmail}</p>
          </div>
        </div>
        <button class="kick-student-btn" onclick="kickStudent('${student._id || student.id}')">
          Kick
        </button>
      </div>
    `;
  }).join('');
}

// Helper: Get student avatar
function getStudentAvatar(student) {
  console.log('Full student object:', student);
  
  const avatarSrc = student.avatarSrc || student.avatar || '';
  const avatarName = student.avatarName || '';
  const displayName = student.username || student.name || 'Student';
  
  // Try to build avatar URL from any available field
  let avatarUrl = '';
  
  // Priority 1: avatarName (just the name without extension)
  if (avatarName) {
    avatarUrl = `../../assets/images/battle_avatar/${avatarName}.png`;
    console.log('Using avatarName, URL:', avatarUrl);
  } 
  // Priority 2: avatarSrc (full or partial path)
  else if (avatarSrc) {
    if (avatarSrc.includes('assets/images/')) {
      // Extract filename from path
      const match = avatarSrc.match(/([^\/]+)\.png$/);
      if (match && match[1]) {
        avatarUrl = `../../assets/images/battle_avatar/${match[1]}.png`;
        console.log('Using avatarSrc extracted, URL:', avatarUrl);
      }
    } else if (avatarSrc.includes('.png')) {
      // It's just a filename
      const filename = avatarSrc.replace('.png', '');
      avatarUrl = `../../assets/images/battle_avatar/${filename}.png`;
      console.log('Using avatarSrc filename, URL:', avatarUrl);
    }
  }
  
  // If no avatar, show initials in styled div
  if (!avatarUrl) {
    console.log('No avatar found, using initials');
    const initials = getInitials(displayName);
    return `<div class="enrolled-student-avatar">${initials}</div>`;
  }
  
  // Return img tag with fallback to initials
  const initials = getInitials(displayName);
  return `<img src="${avatarUrl}" alt="${displayName}" class="enrolled-student-avatar-img" onerror="console.error('Avatar failed to load:', '${avatarUrl}'); this.outerHTML='<div class=\\'enrolled-student-avatar\\'>${initials}</div>'" />`;
}

// Save space settings
async function saveSpaceSettings() {
  try {
    // Check if currentSpace is loaded
    if (!currentSpace || !currentSpace._id) {
      console.error('Current space not loaded:', currentSpace);
      alert('Space data not loaded. Please refresh the page.');
      return;
    }
    
    const name = document.getElementById('settingsSpaceName').value.trim();
    const description = document.getElementById('settingsSpaceDescription').value.trim();
    const selectedColorOption = document.querySelector('.theme-color-option.selected');
    const primaryColor = selectedColorOption ? selectedColorOption.dataset.color : '#1d4ed8';
    
    if (!name) {
      alert('Space name is required');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    console.log('[Save Settings] Space ID:', currentSpace._id);
    console.log('[Save Settings] API URL:', `${API_URL}/faculty-modules/${currentSpace._id}`);
    
    const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description,
        theme: {
          primaryColor,
          accentColor: '#f97316',
          backgroundImage: ''
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update space');
    }
    
    const data = await response.json();
    currentSpace = data.space || data;
    
    // Re-render header
    renderSpaceHeader();
    
    closeSettingsModal();
    alert('Space settings updated successfully!');
  } catch (error) {
    console.error('Error updating space:', error);
    alert('Failed to update space settings. Please try again.');
  }
}

// Kick student from space
async function kickStudent(studentId) {
  if (!confirm('Are you sure you want to remove this student from the space?')) {
    return;
  }
  
  try {
    // Check if currentSpace is loaded
    if (!currentSpace || !currentSpace._id) {
      console.error('Current space not loaded:', currentSpace);
      alert('Space data not loaded. Please refresh the page.');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    
    // Remove student from enrolled list
    const updatedStudents = currentSpace.enrolledStudents.filter(s => {
      const id = s._id || s.id || s;
      return id.toString() !== studentId.toString();
    });
    
    const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        enrolledStudents: updatedStudents.map(s => s._id || s.id || s)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to kick student');
    }
    
    const data = await response.json();
    currentSpace = data.space || data;
    
    // Re-render students lists
    renderStudents();
    renderSettingsStudentsList();
    renderSpaceHeader();
    
    alert('Student removed successfully!');
  } catch (error) {
    console.error('Error kicking student:', error);
    alert('Failed to remove student. Please try again.');
  }
}

// Delete space
async function deleteSpace() {
  // Show password input notification
  showPasswordPrompt();
}

// Show styled notification for space actions
function showDeleteNotification(message, type = 'success') {
  // Remove any existing notification
  const existing = document.querySelector('.delete-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'delete-notification';
  
  const icon = type === 'success' ? '✓' : '⚠';
  const title = type === 'success' ? 'Success!' : 'Warning';
  
  notification.innerHTML = `
    <div class="delete-notification-header">
      <div class="delete-notification-icon ${type}">${icon}</div>
      <h3 class="delete-notification-title">${title}</h3>
    </div>
    <p class="delete-notification-message">${message}</p>
    <button class="delete-notification-button">OK</button>
  `;
  
  document.body.appendChild(notification);
  
  // Close on button click
  const closeBtn = notification.querySelector('.delete-notification-button');
  closeBtn.addEventListener('click', () => {
    notification.classList.add('slide-out');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto-close after 5 seconds (except for success with redirect)
  if (type !== 'success' || !message.includes('Redirecting')) {
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.add('slide-out');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
}

// Make functions globally accessible for inline event handlers
window.kickStudent = kickStudent;
window.editModule = editModule;
window.deleteModule = deleteModule;
window.removeStudent = removeStudent;
window.openModuleView = openModuleView;

// Copy space code to clipboard
function copySpaceCode() {
  const spaceCode = document.getElementById('spaceCode').textContent;
  
  navigator.clipboard.writeText(spaceCode).then(() => {
    // Visual feedback
    const btn = document.getElementById('copyCodeBtn');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = `
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
      </svg>
    `;
    
    setTimeout(() => {
      btn.innerHTML = originalHTML;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy code:', err);
  });
}

// Render modules list
function renderModules() {
  const container = document.getElementById('modulesList');
  const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
  
  if (!currentSpace?.modules || currentSpace.modules.length === 0) {
    const emptyMessage = isFacultyOrAdmin 
      ? 'No modules yet'
      : 'Your teacher has not uploaded a module yet';
    const emptyHint = isFacultyOrAdmin
      ? 'Click "Add Module" to create your first module'
      : 'Check back later for new modules';
    
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
        </svg>
        <p>${emptyMessage}</p>
        <p class="empty-state-hint">${emptyHint}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = currentSpace.modules.map(module => {
    const actionsHTML = isFacultyOrAdmin ? `
      <div class="module-actions" onclick="event.stopPropagation()">
        <button class="module-action" onclick="editModule('${module._id || module.id}')" title="Edit">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"/>
          </svg>
        </button>
        <button class="module-action" onclick="deleteModule('${module._id || module.id}')" title="Delete">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    ` : '';
    
    return `
      <div class="module-card" data-module-id="${module._id || module.id}" onclick="openModuleView('${module._id || module.id}')">
        <div class="module-info">
          <div class="module-title">${module.name || module.title}</div>
          <div class="module-description">${module.description || 'No description'}</div>
          <div class="module-stats">
            ${module.materials?.length ? `<span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>${module.materials.length} Materials</span>` : ''}
            <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>${module.lessons?.length || 0} Lessons</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>${module.quizzes?.length || 0} Quizzes</span>
          </div>
        </div>
        ${actionsHTML}
      </div>
    `;
  }).join('');
}

// Render announcements list
function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
  
  if (!currentSpace?.announcements || currentSpace.announcements.length === 0) {
    const emptyMessage = isFacultyOrAdmin 
      ? 'No announcements yet'
      : 'Your teacher has not made an announcement';
    const emptyHint = isFacultyOrAdmin
      ? 'Click "New Announcement" to post your first announcement'
      : 'Check back later for updates';
    
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
        </svg>
        <p>${emptyMessage}</p>
        <p class="empty-state-hint">${emptyHint}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = currentSpace.announcements.map(announcement => `
    <div class="announcement-card">
      <div class="announcement-header">
        <div class="announcement-title">${announcement.title}</div>
        <div class="announcement-date">${formatDate(announcement.createdAt)}</div>
      </div>
      <div class="announcement-content">${announcement.content}</div>
    </div>
  `).join('');
}

// Render students list
function renderStudents() {
  const container = document.getElementById('studentsList');
  const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
  
  if (!currentSpace?.enrolledStudents || currentSpace.enrolledStudents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
        <p>No students enrolled</p>
        <p class="empty-state-hint">Share your space code with students to let them join</p>
      </div>
    `;
    return;
  }

  container.innerHTML = currentSpace.enrolledStudents.map(student => {
    // Handle different possible field names
    const displayName = student.username || student.name || 'Student';
    const displayEmail = student.email || 'No email';
    const studentId = student._id || student.id;
    
    // Get avatar
    const avatarHtml = getStudentAvatarForTab(student);
    
    // Remove button for faculty/admin
    const removeButtonHtml = isFacultyOrAdmin ? `
      <button class="student-remove-btn" onclick="removeStudent('${studentId}', '${displayName}')" title="Remove student">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    ` : '';
    
    return `
      <div class="student-card">
        <div class="student-info">
          ${avatarHtml}
          <div class="student-details">
            <h3>${displayName}</h3>
            <p>${displayEmail}</p>
          </div>
        </div>
        ${removeButtonHtml}
      </div>
    `;
  }).join('');
}

// Helper: Get student avatar for Students tab
function getStudentAvatarForTab(student) {
  const avatarSrc = student.avatarSrc || student.avatar || '';
  const avatarName = student.avatarName || '';
  const displayName = student.username || student.name || 'Student';
  
  // Determine the avatar URL
  let avatarUrl = '';
  if (avatarName) {
    avatarUrl = `../../assets/images/${avatarName}.png`;
  } else if (avatarSrc && avatarSrc.includes('assets/images/')) {
    const match = avatarSrc.match(/([^\/]+)\.png$/);
    if (match && match[1]) {
      avatarUrl = `../../assets/images/${match[1]}.png`;
    }
  }
  
  // If no avatar, show initials in styled div
  if (!avatarUrl) {
    const initials = getInitials(displayName);
    return `<div class="student-avatar">${initials}</div>`;
  }
  
  // Return img tag with fallback to initials
  const initials = getInitials(displayName);
  return `<img src="${avatarUrl}" alt="${displayName}" class="student-avatar-img" onerror="this.outerHTML='<div class=\\'student-avatar\\'>${initials}</div>'" />`;
}

// Helper: Get initials from name
function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Helper: Format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Open add module modal
function openAddModuleModal() {
  const modal = createModal({
    title: 'Add Module',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>`,
    content: `
      <div class="modal-form-group">
        <label class="modal-label required">Module Name</label>
        <input type="text" id="moduleName" class="modal-input" placeholder="Enter module name" maxlength="100" required />
        <div class="modal-input-hint">Max 100 characters</div>
      </div>
      
      <div class="modal-form-group">
        <label class="modal-label">Description</label>
        <textarea id="moduleDescription" class="modal-textarea" placeholder="Enter module description" maxlength="500"></textarea>
        <div class="modal-input-hint">Max 500 characters</div>
      </div>
      
      <div class="modal-form-group">
        <label class="modal-label">Add Materials</label>
        <div class="material-type-tabs">
          <button type="button" class="material-tab active" data-type="pdf" onclick="switchMaterialTab('pdf', event)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
          <button type="button" class="material-tab" data-type="youtube" onclick="switchMaterialTab('youtube', event)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            YouTube
          </button>
          <button type="button" class="material-tab" data-type="link" onclick="switchMaterialTab('link', event)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Link
          </button>
        </div>
        
        <div class="material-input-container">
          <!-- PDF Upload -->
          <div class="material-input active" id="pdfInput">
            <input type="file" id="pdfFile" class="file-input" accept=".pdf" />
            <label for="pdfFile" class="file-input-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span id="pdfFileName">Choose PDF file or drag here</span>
            </label>
            <div class="modal-input-hint">Max 10MB - PDF files only</div>
          </div>
          
          <!-- YouTube URL -->
          <div class="material-input" id="youtubeInput">
            <input type="url" id="youtubeUrl" class="modal-input" placeholder="https://youtube.com/watch?v=..." />
            <div class="modal-input-hint">Paste YouTube video URL</div>
          </div>
          
          <!-- External Link -->
          <div class="material-input" id="linkInput">
            <input type="url" id="externalUrl" class="modal-input" placeholder="https://example.com" />
            <input type="text" id="linkTitle" class="modal-input" placeholder="Link title (optional)" maxlength="100" style="margin-top: 0.75rem;" />
            <div class="modal-input-hint">Add any website or resource link</div>
          </div>
        </div>
        
        <div id="materialsList" class="materials-preview"></div>
      </div>
    `,
    primaryButton: {
      text: 'Add Module',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>`,
      onClick: async () => {
        const name = document.getElementById('moduleName').value.trim();
        const description = document.getElementById('moduleDescription').value.trim();
        
        if (!name) {
          alert('Please enter a module name');
          return;
        }
        
        await addModule(name, description);
        closeModal(modal);
      }
    }
  });
  
  document.body.appendChild(modal);
  
  // Initialize file upload handlers
  initializeMaterialHandlers();
  
  // Focus on first input
  setTimeout(() => {
    document.getElementById('moduleName').focus();
  }, 100);
}

// Switch between material type tabs
function switchMaterialTab(type, event) {
  if (event) event.preventDefault();
  
  // Update tab active states
  document.querySelectorAll('.material-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  
  // Update input visibility
  document.querySelectorAll('.material-input').forEach(input => {
    input.classList.remove('active');
  });
  
  if (type === 'pdf') {
    document.getElementById('pdfInput').classList.add('active');
  } else if (type === 'youtube') {
    document.getElementById('youtubeInput').classList.add('active');
  } else if (type === 'link') {
    document.getElementById('linkInput').classList.add('active');
  }
}

// Global materials array
let moduleMaterials = [];

// Initialize material upload handlers
function initializeMaterialHandlers() {
  moduleMaterials = [];
  
  const pdfInput = document.getElementById('pdfFile');
  const pdfLabel = document.getElementById('pdfFileName');
  
  // PDF file upload
  pdfInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size exceeds 10MB limit');
        e.target.value = '';
        return;
      }
      
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        e.target.value = '';
        return;
      }
      
      pdfLabel.textContent = file.name;
      
      // Convert to base64 for storage (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        moduleMaterials.push({
          type: 'pdf',
          title: file.name,
          url: e.target.result, // Base64 data URL
          fileSize: formatFileSize(file.size),
          description: ''
        });
        updateMaterialsPreview();
        pdfInput.value = '';
        pdfLabel.textContent = 'Choose PDF file or drag here';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Drag and drop for PDF
  const pdfDropZone = document.querySelector('#pdfInput .file-input-label');
  
  pdfDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    pdfDropZone.classList.add('drag-over');
  });
  
  pdfDropZone.addEventListener('dragleave', () => {
    pdfDropZone.classList.remove('drag-over');
  });
  
  pdfDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    pdfDropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file) {
      pdfInput.files = e.dataTransfer.files;
      pdfInput.dispatchEvent(new Event('change'));
    }
  });
  
  // YouTube URL handler
  const youtubeUrl = document.getElementById('youtubeUrl');
  youtubeUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addYouTubeMaterial();
    }
  });
  
  // Add button for YouTube
  const youtubeContainer = document.getElementById('youtubeInput');
  const addYoutubeBtn = document.createElement('button');
  addYoutubeBtn.type = 'button';
  addYoutubeBtn.className = 'add-material-btn';
  addYoutubeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    Add Video
  `;
  addYoutubeBtn.onclick = (e) => {
    e.preventDefault();
    addYouTubeMaterial();
  };
  youtubeContainer.appendChild(addYoutubeBtn);
  
  // External link handler
  const linkUrl = document.getElementById('externalUrl');
  linkUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLinkMaterial();
    }
  });
  
  // Add button for links
  const linkContainer = document.getElementById('linkInput');
  const addLinkBtn = document.createElement('button');
  addLinkBtn.type = 'button';
  addLinkBtn.className = 'add-material-btn';
  addLinkBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    Add Link
  `;
  addLinkBtn.onclick = (e) => {
    e.preventDefault();
    addLinkMaterial();
  };
  linkContainer.appendChild(addLinkBtn);
}

// Add YouTube material
function addYouTubeMaterial() {
  const url = document.getElementById('youtubeUrl').value.trim();
  
  if (!url) {
    alert('Please enter a YouTube URL');
    return;
  }
  
  if (!isValidYouTubeUrl(url)) {
    alert('Please enter a valid YouTube URL');
    return;
  }
  
  const videoId = extractYouTubeId(url);
  const title = `YouTube Video ${moduleMaterials.filter(m => m.type === 'video').length + 1}`;
  
  moduleMaterials.push({
    type: 'video',
    title: title,
    url: url,
    description: ''
  });
  
  updateMaterialsPreview();
  document.getElementById('youtubeUrl').value = '';
}

// Add external link material
function addLinkMaterial() {
  const url = document.getElementById('externalUrl').value.trim();
  const title = document.getElementById('linkTitle').value.trim();
  
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  
  if (!isValidUrl(url)) {
    alert('Please enter a valid URL');
    return;
  }
  
  moduleMaterials.push({
    type: 'link',
    title: title || url,
    url: url,
    description: ''
  });
  
  updateMaterialsPreview();
  document.getElementById('externalUrl').value = '';
  document.getElementById('linkTitle').value = '';
}

// Validate YouTube URL
function isValidYouTubeUrl(url) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return pattern.test(url);
}

// Extract YouTube video ID
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Update materials preview
function updateMaterialsPreview() {
  const container = document.getElementById('materialsList');
  
  if (moduleMaterials.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="materials-preview-header">
      <span>Attached Materials (${moduleMaterials.length})</span>
    </div>
    <div class="materials-preview-list">
      ${moduleMaterials.map((material, index) => `
        <div class="material-preview-item">
          <div class="material-preview-icon ${material.type}">
            ${getMaterialIcon(material.type)}
          </div>
          <div class="material-preview-info">
            <div class="material-preview-title">${material.title}</div>
            ${material.fileSize ? `<div class="material-preview-meta">${material.fileSize}</div>` : ''}
          </div>
          <button type="button" class="material-preview-remove" onclick="removeMaterial(${index})" title="Remove">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// Remove material from list
function removeMaterial(index) {
  moduleMaterials.splice(index, 1);
  updateMaterialsPreview();
}

// Get material icon
function getMaterialIcon(type) {
  const icons = {
    pdf: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
    video: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>'
  };
  return icons[type] || icons.link;
}

// Make functions globally accessible
window.switchMaterialTab = switchMaterialTab;
window.removeMaterial = removeMaterial;
window.openMaterial = openMaterial;

// Open module view modal
function openModuleView(moduleId) {
  console.log('[Module View] Opening module:', moduleId);
  console.log('[Module View] Current space:', currentSpace);
  
  if (!currentSpace || !currentSpace.modules) {
    console.error('[Module View] Current space or modules not loaded');
    alert('Space data not loaded. Please refresh the page.');
    return;
  }
  
  const module = currentSpace.modules.find(m => (m._id || m.id) === moduleId);
  
  if (!module) {
    console.error('[Module View] Module not found:', moduleId);
    console.log('[Module View] Available modules:', currentSpace.modules);
    alert('Module not found');
    return;
  }
  
  console.log('[Module View] Found module:', module);
  
  const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
  const moduleName = module.name || module.title;
  const moduleDesc = module.description || '';
  const materials = module.materials || [];
  const lessons = module.lessons || [];
  const quizzes = module.quizzes || [];
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay module-view-overlay';
  
  overlay.innerHTML = `
    <div class="module-view-container">
      <div class="module-view-header">
        <div class="module-view-title-section">
          <h2 class="module-view-title">${moduleName}</h2>
          <p class="module-view-description">${moduleDesc}</p>
        </div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="module-view-body">
        ${materials.length > 0 ? `
          <div class="module-section">
            <h3 class="module-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Materials (${materials.length})
            </h3>
            <div class="module-items-grid">
              ${materials.map(material => renderMaterialCard(material)).join('')}
            </div>
          </div>
        ` : ''}
        
        ${lessons.length > 0 ? `
          <div class="module-section">
            <h3 class="module-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Lessons (${lessons.length})
            </h3>
            <div class="module-items-grid">
              ${lessons.map((lesson, index) => renderLessonCard(lesson, index + 1)).join('')}
            </div>
          </div>
        ` : ''}
        
        ${quizzes.length > 0 ? `
          <div class="module-section">
            <h3 class="module-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Quizzes (${quizzes.length})
            </h3>
            <div class="module-items-grid">
              ${quizzes.map((quiz, index) => renderQuizCard(quiz, index + 1)).join('')}
            </div>
          </div>
        ` : ''}
        
        ${materials.length === 0 && lessons.length === 0 && quizzes.length === 0 ? `
          <div class="module-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No content yet</p>
            <p class="module-empty-hint">${isFacultyOrAdmin ? 'Start adding materials, lessons, or quizzes' : 'Your teacher will add content soon'}</p>
          </div>
        ` : ''}
      </div>
      
      ${isFacultyOrAdmin ? `
        <div class="module-view-footer">
          <button class="module-view-btn module-view-btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            Close
          </button>
          <button class="module-view-btn module-view-btn-primary" onclick="editModule('${moduleId}'); this.closest('.modal-overlay').remove();">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Module
          </button>
        </div>
      ` : ''}
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });
  
  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(overlay);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Render material card
function renderMaterialCard(material) {
  const iconClass = material.type === 'pdf' ? 'pdf' : material.type === 'video' ? 'video' : 'link';
  const icon = getMaterialIcon(material.type);
  const materialUrl = material.url || material.link || '';
  
  return `
    <div class="module-item-card material-card ${iconClass}" onclick="openMaterial(\`${materialUrl}\`, '${material.type}')">
      <div class="module-item-icon ${iconClass}">
        ${icon}
      </div>
      <div class="module-item-content">
        <h4 class="module-item-title">${material.title}</h4>
        ${material.fileSize ? `<p class="module-item-meta">${material.fileSize}</p>` : ''}
        <div class="module-item-type">${material.type.toUpperCase()}</div>
      </div>
      <div class="module-item-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  `;
}

// Render lesson card
function renderLessonCard(lesson, number) {
  return `
    <div class="module-item-card lesson-card">
      <div class="module-item-icon lesson">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div class="module-item-content">
        <h4 class="module-item-title">Lesson ${number}: ${lesson.title}</h4>
        ${lesson.videoUrl ? '<p class="module-item-meta">Includes video</p>' : ''}
        <div class="module-item-type">LESSON</div>
      </div>
      <div class="module-item-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  `;
}

// Render quiz card
function renderQuizCard(quiz, number) {
  const questionCount = quiz.questions?.length || 0;
  return `
    <div class="module-item-card quiz-card">
      <div class="module-item-icon quiz">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <div class="module-item-content">
        <h4 class="module-item-title">Quiz ${number}: ${quiz.title}</h4>
        <p class="module-item-meta">${questionCount} questions · Passing score: ${quiz.passingScore || 70}%</p>
        <div class="module-item-type">QUIZ</div>
      </div>
      <div class="module-item-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  `;
}

// Open material (PDF, video, or link)
function openMaterial(url, type) {
  console.log('[Open Material] URL:', url);
  console.log('[Open Material] Type:', type);
  
  // Clean up the URL - remove any whitespace
  url = (url || '').trim();
  
  if (!url || url === '' || url === 'undefined' || url === 'null') {
    showNotification('No valid URL provided for this material. Please edit the module and add a proper URL.', 'error');
    console.error('[Open Material] Invalid URL:', url);
    return;
  }
  
  // Check if URL is valid
  let finalUrl = url;
  
  // If URL doesn't start with http:// or https://, assume it's a relative path
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Try to construct a full URL
    if (url.startsWith('/')) {
      finalUrl = window.location.origin + url;
    } else {
      finalUrl = window.location.origin + '/' + url;
    }
    console.log('[Open Material] Converted to full URL:', finalUrl);
  }
  
  console.log('[Open Material] Opening:', finalUrl);
  
  if (type === 'pdf') {
    // For PDFs, open in new tab with PDF viewer
    const newWindow = window.open(finalUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      showNotification('Popup blocked. Please allow popups for this site.', 'error');
    }
  } else if (type === 'video') {
    // For YouTube videos, open in new tab
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  } else if (type === 'link') {
    // For external links, open in new tab
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  } else {
    // Default: just open the URL
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  }
}

// Make functions globally accessible
window.switchMaterialTab_OLD = switchMaterialTab;
window.removeMaterial_OLD = removeMaterial;

// Add module to space
async function addModule(name, description) {
  try {
    if (!currentSpace || !currentSpace._id) {
      console.error('Current space not loaded:', currentSpace);
      alert('Space data not loaded. Please refresh the page.');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}/modules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        title: name,
        description: description,
        materials: moduleMaterials
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Unknown error' };
      }
      throw new Error(errorData.error || `Failed to add module (Status: ${response.status})`);
    }
    
    const data = await response.json();
    console.log('Module added:', data);
    
    // Clear materials array
    moduleMaterials = [];
    
    // Reload space data to show the new module
    await loadSpaceData(currentSpace._id);
    
    // Show success message
    showNotification('Module added successfully!', 'success');
  } catch (error) {
    console.error('Error adding module:', error);
    showNotification(`Failed to add module: ${error.message}`, 'error');
  }
}

// Open add announcement modal
function openAddAnnouncementModal() {
  const modal = createModal({
    title: 'New Announcement',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>`,
    content: `
      <div class="modal-form-group">
        <label class="modal-label required">Title</label>
        <input type="text" id="announcementTitle" class="modal-input" placeholder="Enter announcement title" maxlength="100" required />
        <div class="modal-input-hint">Max 100 characters</div>
      </div>
      
      <div class="modal-form-group">
        <label class="modal-label required">Content</label>
        <textarea id="announcementContent" class="modal-textarea" placeholder="Enter announcement content" maxlength="1000" required></textarea>
        <div class="modal-input-hint">Max 1000 characters</div>
      </div>
    `,
    primaryButton: {
      text: 'Post Announcement',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`,
      onClick: async () => {
        const title = document.getElementById('announcementTitle').value.trim();
        const content = document.getElementById('announcementContent').value.trim();
        
        if (!title || !content) {
          alert('Please fill in all required fields');
          return;
        }
        
        await addAnnouncement(title, content);
        closeModal(modal);
      }
    }
  });
  
  document.body.appendChild(modal);
  
  // Focus on first input
  setTimeout(() => {
    document.getElementById('announcementTitle').focus();
  }, 100);
}

// Add announcement to space
async function addAnnouncement(title, content) {
  try {
    if (!currentSpace || !currentSpace._id) {
      console.error('Current space not loaded:', currentSpace);
      alert('Space data not loaded. Please refresh the page.');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}/announcements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to add announcement');
    }
    
    const data = await response.json();
    console.log('Announcement added:', data);
    
    // Reload space data to show the new announcement
    await loadSpaceData(currentSpace._id);
    
    // Show success message
    showNotification('Announcement posted successfully!', 'success');
  } catch (error) {
    console.error('Error adding announcement:', error);
    alert('Failed to post announcement. Please try again.');
  }
}

// Create a reusable modal
function createModal({ title, icon, content, primaryButton, secondaryButton }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  overlay.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          ${icon || ''}
          ${title}
        </h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${secondaryButton ? `
          <button class="modal-btn modal-btn-secondary">
            ${secondaryButton.icon || ''}
            ${secondaryButton.text || 'Cancel'}
          </button>
        ` : `
          <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        `}
        <button class="modal-btn modal-btn-primary" id="modalPrimaryBtn">
          ${primaryButton.icon || ''}
          ${primaryButton.text || 'Submit'}
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const primaryBtn = overlay.querySelector('#modalPrimaryBtn');
  if (primaryButton && primaryButton.onClick) {
    primaryBtn.addEventListener('click', primaryButton.onClick);
  }
  
  if (secondaryButton && secondaryButton.onClick) {
    const secondaryBtn = overlay.querySelector('.modal-btn-secondary');
    secondaryBtn.addEventListener('click', secondaryButton.onClick);
  }
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });
  
  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(overlay);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  return overlay;
}

// Close modal with animation
function closeModal(modal) {
  modal.classList.add('closing');
  setTimeout(() => {
    modal.remove();
  }, 300);
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
    border: 2px solid #000;
    border-radius: 10px;
    color: #ffffff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.95rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    animation: slideInRight 0.3s ease forwards;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Open add module modal
function openAddModuleModal_OLD() {
  // TODO: Create and show module creation modal
  alert('Module creation modal coming soon!');
}

// Open add announcement modal
function openAddAnnouncementModal_OLD() {
  // TODO: Create and show announcement creation modal
  alert('Announcement creation modal coming soon!');
}

// Edit module
function editModule(moduleId) {
  console.log('Edit module:', moduleId);
  // TODO: Implement module editing
  alert('Module editing coming soon!');
}

// Remove student from space
async function removeStudent(studentId, studentName) {
  const modal = createConfirmDialog({
    title: 'Remove Student',
    message: `Are you sure you want to remove <strong>${studentName}</strong> from this space?<br><br>They will lose access to all modules and content.`,
    confirmText: 'Remove Student',
    onConfirm: async () => {
      try {
        if (!currentSpace || !currentSpace._id) {
          console.error('Current space not loaded:', currentSpace);
          alert('Space data not loaded. Please refresh the page.');
          return;
        }
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || 'Failed to remove student');
        }
        
        // Reload space data
        await loadSpaceData(currentSpace._id);
        showNotification('Student removed successfully!', 'success');
      } catch (error) {
        console.error('Error removing student:', error);
        alert('Failed to remove student. Please try again.');
      }
    }
  });
  
  document.body.appendChild(modal);
}

// Create confirmation dialog
function createConfirmDialog({ title, message, confirmText, cancelText, onConfirm, onCancel }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  overlay.innerHTML = `
    <div class="confirm-dialog">
      <div class="confirm-header">
        <div class="confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="confirm-title">${title}</h3>
      </div>
      <div class="confirm-body">
        <p class="confirm-message">${message}</p>
      </div>
      <div class="confirm-footer">
        <button class="modal-btn confirm-btn-cancel">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          ${cancelText || 'Cancel'}
        </button>
        <button class="modal-btn confirm-btn-danger">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          ${confirmText || 'Confirm'}
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const cancelBtn = overlay.querySelector('.confirm-btn-cancel');
  cancelBtn.addEventListener('click', () => {
    if (onCancel) onCancel();
    closeModal(overlay);
  });
  
  const confirmBtn = overlay.querySelector('.confirm-btn-danger');
  confirmBtn.addEventListener('click', async () => {
    if (onConfirm) await onConfirm();
    closeModal(overlay);
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (onCancel) onCancel();
      closeModal(overlay);
    }
  });
  
  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      if (onCancel) onCancel();
      closeModal(overlay);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  return overlay;
}

// Edit module
function editModule_OLD(moduleId) {
  console.log('Edit module:', moduleId);
  // TODO: Implement module editing
  alert('Module editing coming soon!');
}

// Delete module
async function deleteModule(moduleId) {
  try {
    // Check if currentSpace is loaded
    if (!currentSpace || !currentSpace._id) {
      console.error('Current space not loaded:', currentSpace);
      showNotification('Space data not loaded. Please refresh the page.', 'error');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found');
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }
    
    console.log('[Delete Module] Deleting module:', moduleId);
    console.log('[Delete Module] Space ID:', currentSpace._id);
    
    const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}/modules/${moduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Delete Module] Error response:', errorText);
      throw new Error(`Failed to delete module: ${response.status}`);
    }

    // Reload space data
    await loadSpaceData(currentSpace._id);
    showNotification('Module deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting module:', error);
    showNotification(`Failed to delete module: ${error.message}`, 'error');
  }
}

// Show password prompt notification
function showPasswordPrompt() {
  // Remove any existing notification
  const existing = document.querySelector('.delete-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'delete-notification';
  
  notification.innerHTML = `
    <div class="delete-notification-header">
      <div class="delete-notification-icon error">⚠</div>
      <h3 class="delete-notification-title" style="color: #ef4444;">Warning</h3>
    </div>
    <p class="delete-notification-message" style="color: #ef4444;">Password is required. Please enter your password.</p>
    <div class="delete-notification-input-group">
      <input type="password" class="delete-notification-input" id="deletePasswordPromptInput" placeholder="Enter your password">
    </div>
    <div class="delete-notification-actions">
      <button class="delete-notification-button cancel">Cancel</button>
      <button class="delete-notification-button confirm">OK</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Focus on input
  const input = notification.querySelector('#deletePasswordPromptInput');
  setTimeout(() => input.focus(), 100);
  
  // Handle Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      proceedWithDeletion(input.value, notification);
    }
  });
  
  // Handle Cancel button
  const cancelBtn = notification.querySelector('.cancel');
  cancelBtn.addEventListener('click', () => {
    notification.classList.add('slide-out');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Handle OK button
  const confirmBtn = notification.querySelector('.confirm');
  confirmBtn.addEventListener('click', () => {
    const password = input.value;
    proceedWithDeletion(password, notification);
  });
}

// Proceed with space deletion after password confirmation
async function proceedWithDeletion(password, notification) {
  if (!password) {
    // Show error but keep the notification open
    const message = notification.querySelector('.delete-notification-message');
    message.textContent = 'Password is required. Please enter your password.';
    message.style.color = '#ef4444';
    return;
  }
  
  // Close the password prompt and show final confirmation
  notification.classList.add('slide-out');
  setTimeout(() => {
    notification.remove();
    showFinalConfirmation(password);
  }, 300);
}

// Show final confirmation before deletion
function showFinalConfirmation(password) {
  // Remove any existing notification
  const existing = document.querySelector('.delete-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'delete-notification';
  
  notification.innerHTML = `
    <div class="delete-notification-header">
      <div class="delete-notification-icon error">⚠</div>
      <h3 class="delete-notification-title" style="color: #ef4444;">ARE YOU ABSOLUTELY SURE?</h3>
    </div>
    <p class="delete-notification-message" style="color: #ef4444; line-height: 1.8;">
      This will permanently delete this space and <strong>ALL</strong> its content including modules, lessons, quizzes, and enrolled students.<br><br>
      <span style="color: #fbbf24; font-weight: 600;">This action CANNOT be undone!</span>
    </p>
    <div class="delete-notification-actions">
      <button class="delete-notification-button cancel">Cancel</button>
      <button class="delete-notification-button confirm">OK</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Handle Cancel button
  const cancelBtn = notification.querySelector('.cancel');
  cancelBtn.addEventListener('click', () => {
    notification.classList.add('slide-out');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Handle OK button
  const confirmBtn = notification.querySelector('.confirm');
  confirmBtn.addEventListener('click', () => {
    notification.classList.add('slide-out');
    setTimeout(() => {
      notification.remove();
      performDeletion(password);
    }, 300);
  });
}

// Perform the actual deletion
async function performDeletion(password) {
  
  try {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('authEmail') || '';
    const role = localStorage.getItem('authRole') || '';
    
    // Verify password based on role
    let passwordValid = false;
    
    if (role === 'admin') {
      // For admin, check against hardcoded password
      if (password === 'admin123') {
        passwordValid = true;
      } else {
        showDeleteNotification('Incorrect admin password. Space deletion cancelled.', 'error');
        return;
      }
    } else {
      // For regular users (faculty/student), verify password through API
      const authResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!authResponse.ok) {
        showDeleteNotification('Incorrect password. Space deletion cancelled.', 'error');
        return;
      }
      passwordValid = true;
    }
    
    // If password validation passed, proceed with deletion
    if (passwordValid) {
      // Check if currentSpace is loaded
      if (!currentSpace || !currentSpace._id) {
        console.error('Current space not loaded:', currentSpace);
        showDeleteNotification('Space data not loaded. Please refresh the page.', 'error');
        return;
      }
      
      // Delete space
      console.log('[Delete Space] Space ID:', currentSpace._id);
      console.log('[Delete Space] API URL:', `${API_URL}/faculty-modules/${currentSpace._id}`);
      
      const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('[Delete Space] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Delete Space] Error response:', errorData);
        throw new Error(errorData.error || 'Failed to delete space');
      }
      
      showDeleteNotification('Space deleted successfully. Redirecting to spaces page...', 'success');
      setTimeout(() => {
        window.location.href = 'spaces.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Error deleting space:', error);
    showDeleteNotification('Failed to delete space. Please try again.', 'error');
  }
}
