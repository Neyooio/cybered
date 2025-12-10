// Faculty Space Management
// Determine API base URL based on environment
function getApiBase() {
  if (window.API_BASE_URL) return window.API_BASE_URL;
  
  const hostname = window.location.hostname;
  if (hostname.includes('netlify.app') || hostname.includes('github.io')) {
    return 'https://cybered-backend.onrender.com';
  }
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
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

// Make kickStudent global
window.kickStudent = kickStudent;

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
      <div class="module-actions">
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
      <div class="module-card" data-module-id="${module._id || module.id}">
        <div class="module-info">
          <div class="module-title">${module.name}</div>
          <div class="module-description">${module.description || 'No description'}</div>
          <div class="module-stats">
            <span>${module.lessons?.length || 0} Lessons</span>
            <span>${module.quizzes?.length || 0} Quizzes</span>
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
    
    // Get avatar
    const avatarHtml = getStudentAvatarForTab(student);
    
    return `
      <div class="student-card">
        <div class="student-info">
          ${avatarHtml}
          <div class="student-details">
            <h3>${displayName}</h3>
            <p>${displayEmail}</p>
          </div>
        </div>
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
  // TODO: Create and show module creation modal
  alert('Module creation modal coming soon!');
}

// Open add announcement modal
function openAddAnnouncementModal() {
  // TODO: Create and show announcement creation modal
  alert('Announcement creation modal coming soon!');
}

// Edit module
function editModule(moduleId) {
  console.log('Edit module:', moduleId);
  // TODO: Implement module editing
  alert('Module editing coming soon!');
}

// Delete module
async function deleteModule(moduleId) {
  if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
    return;
  }

  try {
    // Check if currentSpace is loaded
    if (!currentSpace || !currentSpace._id) {
      console.error('Current space not loaded:', currentSpace);
      alert('Space data not loaded. Please refresh the page.');
      return;
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/faculty-modules/${currentSpace._id}/modules/${moduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete module');
    }

    // Reload space data
    await loadSpaceData(currentSpace._id);
    alert('Module deleted successfully!');
  } catch (error) {
    console.error('Error deleting module:', error);
    alert('Failed to delete module. Please try again.');
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
