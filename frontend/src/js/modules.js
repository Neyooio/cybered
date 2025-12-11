import { API_BASE_URL } from './config.js';

const modulesIndex = [
  {
    id: 'web-security',
    title: 'Web Security',
    icon: '../../assets/images/Web Security.png',
    description: 'Web security is the practice of protecting websites, web applications, and web services from malicious attacks. The primary goal is to ensure the confidentiality, integrity, and availability of data and systems.'
  },
  {
    id: 'network-defense',
    title: 'Network Defense',
    icon: '../../assets/images/Network Defense.png',
    description: 'This lesson will introduce the core concepts that form the basis of all network communication and defense. Understanding these fundamentals is crucial before learning how to secure a network.'
  },
  {
    id: 'cryptography',
    title: 'Cryptography',
    icon: '../../assets/images/Cryptography.png',
    description: 'Cryptography, at its core, is the practice and study of techniques for secure communication in the presence of adversarial behavior. It\'s about constructing and analyzing protocols that prevent third parties or the public from reading private messages.'
  },
  {
    id: 'malware-defense',
    title: 'Malware Defense',
    icon: '../../assets/images/Malware Defense.png',
    description: 'Malware types, infection methods, detection techniques, and preventive measures.'
  }
];

const API_URL = `${API_BASE_URL}/api`;
let userSpaces = [];
let currentView = 'modules';

function getModuleProgress(moduleId) {
  try {
    const raw = localStorage.getItem('moduleProgress:' + moduleId);
    if (!raw) return 0;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return 0;
    const completed = arr.filter(Boolean).length;
    const total = 4; // Each module has 4 lessons
    return Math.round((completed / total) * 100);
  } catch {
    return 0;
  }
}

// Check if module is enabled via website management API
async function isModuleEnabled(moduleId) {
  try {
    const response = await fetch(`${API_URL}/website/config`);
    const data = await response.json();
    
    if (data.success) {
      const module = data.config.modules?.find(m => m.id === moduleId);
      return module ? module.enabled : true;
    }
    return true;
  } catch {
    return true; // Default to enabled on error
  }
}

async function renderModules(grid) {
  const markup = await Promise.all(modulesIndex.map(async (module) => {
    const progressPercent = getModuleProgress(module.id);
    const enabled = await isModuleEnabled(module.id);
    const disabledClass = !enabled ? 'module-disabled' : '';
    const maintenanceBadge = !enabled ? '<span style="display: inline-block; background: rgba(239,68,68,.2); border: 1px solid #ef4444; border-radius: 0.375rem; padding: 0.25rem 0.625rem; font-size: 0.75rem; color: #ef4444; margin-top: 0.5rem;">⚠️ Under Maintenance</span>' : '';
    
    return `
    <article class="module-card ${disabledClass}" data-module="${module.id}" ${!enabled ? 'style="opacity: 0.6; pointer-events: none;"' : ''}>
      <div class="module-card-header">
        <div class="module-icon">
          <img src="${module.icon}" alt="${module.title}">
        </div>
        <h2 class="module-title">${module.title}</h2>
      </div>
      <p class="module-description">${module.description}</p>
      ${maintenanceBadge}
      <div class="module-progress-bar">
        <div class="module-progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="module-actions">
        <button type="button" class="module-start" data-module="${module.id}" ${!enabled ? 'disabled' : ''}>
          ${enabled ? 'Start Module' : 'Under Maintenance'}
        </button>
      </div>
    </article>
  `;
  }));

  grid.innerHTML = markup.join('');
}

function getModuleById(id){
  return modulesIndex.find(m => m.id === id);
}

async function startModule(id) {
  // Check if module is enabled
  const enabled = await isModuleEnabled(id);
  if (!enabled) {
    alert('This module is currently under maintenance. Please check back later.');
    return;
  }
  
  const pages = {
    'web-security': 'module-web-security.html',
    'network-defense': 'module-network-defense.html',
    'cryptography': 'module-cryptography.html',
    'malware-defense': 'module-malware-defense.html'
  };

  const page = pages[id];
  if (!page) {
    console.warn('Unknown module:', id);
    return;
  }

  const mod = getModuleById(id);
  if (mod){
    try {
      localStorage.setItem('currentModule', JSON.stringify({
        id: mod.id,
        title: mod.title,
        icon: mod.icon,
        description: mod.description
      }));
    } catch (err){
      console.debug('Unable to cache module selection', err);
    }
  }

  window.location.href = page;
}

// Load user's faculty spaces (created or enrolled)
async function loadUserSpaces() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return;
    }

    const userRole = localStorage.getItem('authRole');
    const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
    
    console.log('Loading spaces for role:', userRole);
    
    // Faculty/Admin: load created spaces, Students: load enrolled spaces
    const endpoint = isFacultyOrAdmin 
      ? `${API_URL}/faculty-modules/my-spaces`
      : `${API_URL}/faculty-modules/enrolled`;

    console.log('Fetching from endpoint:', endpoint);

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Failed to load spaces. Status:', response.status);
      return;
    }

    const data = await response.json();
    console.log('Spaces loaded:', data);
    
    userSpaces = data.spaces || [];
    console.log('Number of spaces:', userSpaces.length);
    
    if (userSpaces.length > 0) {
      renderSpaceTabs();
    } else {
      console.log('No spaces to display');
    }
  } catch (error) {
    console.error('Error loading spaces:', error);
  }
}

// Render space tabs
function renderSpaceTabs() {
  const dropdownMenu = document.getElementById('spaceDropdownMenu');
  const topbarDropdownMenu = document.getElementById('topbarSpaceDropdownMenu');
  const drawerSpaceMenu = document.getElementById('drawerSpaceMenu');
  
  if (!dropdownMenu) {
    console.log('Space dropdown menu not found');
    return;
  }
  
  console.log('📍 Rendering space dropdown. Number of spaces:', userSpaces.length);
  console.log('📍 User spaces:', userSpaces);
  
  // Add space items to dropdown
  const spaceItems = userSpaces.map(space => {
    console.log('📍 Creating item for space:', space.name);
    return `
    <button class="space-dropdown-item" data-view="space" data-space-id="${space._id}">
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/>
      </svg>
      <span>${space.name}</span>
    </button>
  `}).join('');
  
  const dropdownHTML = `
    <button class="space-dropdown-item active" data-view="modules">
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
      </svg>
      <span>All Modules</span>
    </button>
    ${spaceItems}
  `;
  
  // Update page dropdown
  dropdownMenu.innerHTML = dropdownHTML;
  
  // Update topbar dropdown (desktop)
  if (topbarDropdownMenu) {
    topbarDropdownMenu.innerHTML = dropdownHTML;
    setupDropdownHandlers(topbarDropdownMenu, 'topbarSpaceDropdownBtn', 'topbarSpaceDropdownMenu');
  }
  
  // Update drawer dropdown (mobile)
  if (drawerSpaceMenu) {
    const drawerSpaceItems = userSpaces.map(space => `
      <li><a href="faculty-space.html?id=${space._id}" class="drawer-link">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/>
        </svg>
        <span>${space.name}</span>
      </a></li>
    `).join('');
    
    drawerSpaceMenu.innerHTML = `
      <li><button class="drawer-link" onclick="window.location.href='modules.html'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
        </svg>
        <span>All Modules</span>
      </button></li>
      ${drawerSpaceItems}
    `;
  }
  
  console.log('📍 Dropdown HTML updated. Total items:', 1 + userSpaces.length);
  
  // Add click handlers for page dropdown
  setupDropdownHandlers(dropdownMenu, 'spaceDropdownBtn', 'spaceDropdownMenu');
  
  console.log('Space dropdown rendered successfully');
}

// Setup dropdown click handlers
function setupDropdownHandlers(menuElement, btnId, menuId) {
  menuElement.addEventListener('click', (e) => {
    const item = e.target.closest('.space-dropdown-item');
    if (!item) return;
    
    const view = item.dataset.view;
    const spaceId = item.dataset.spaceId;
    
    // Update active state
    menuElement.querySelectorAll('.space-dropdown-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    // Close dropdown
    const dropdownBtn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    dropdownBtn?.classList.remove('active');
    menu?.classList.remove('show');
    
    if (view === 'modules') {
      currentView = 'modules';
      if (modulesGrid) {
        (async () => {
          await renderModules(modulesGrid);
        })();
      }
    } else if (view === 'space' && spaceId) {
      window.location.href = `faculty-space.html?id=${spaceId}`;
    }
  });
}

const modulesGrid = document.getElementById('modulesGrid');
if (modulesGrid){
  (async () => {
    await renderModules(modulesGrid);
  })();
  
  // Load user spaces and populate dropdown
  loadUserSpaces();
  
  // Initialize dropdown with "All Modules" even before spaces load
  renderSpaceTabs();

  modulesGrid.addEventListener('click', event => {
    const button = event.target.closest('.module-start');
    if (!button) return;

    const moduleId = button.dataset.module;
    if (moduleId) startModule(moduleId);
  });
}

// Space dropdown toggle
const spaceDropdownBtn = document.getElementById('spaceDropdownBtn');
const spaceDropdownMenu = document.getElementById('spaceDropdownMenu');

if (spaceDropdownBtn && spaceDropdownMenu) {
  spaceDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    spaceDropdownBtn.classList.toggle('active');
    spaceDropdownMenu.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!spaceDropdownBtn.contains(e.target) && !spaceDropdownMenu.contains(e.target)) {
      spaceDropdownBtn.classList.remove('active');
      spaceDropdownMenu.classList.remove('active');
    }
  });
}

// Topbar space dropdown toggle (desktop)
const topbarSpaceDropdownBtn = document.getElementById('topbarSpaceDropdownBtn');
const topbarSpaceDropdownMenu = document.getElementById('topbarSpaceDropdownMenu');

if (topbarSpaceDropdownBtn && topbarSpaceDropdownMenu) {
  topbarSpaceDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    topbarSpaceDropdownBtn.classList.toggle('active');
    topbarSpaceDropdownMenu.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!topbarSpaceDropdownBtn.contains(e.target) && !topbarSpaceDropdownMenu.contains(e.target)) {
      topbarSpaceDropdownBtn.classList.remove('active');
      topbarSpaceDropdownMenu.classList.remove('show');
    }
  });
}

// Drawer space dropdown toggle (mobile)
const drawerSpaceBtn = document.getElementById('drawerSpaceBtn');
const drawerSpaceMenu = document.getElementById('drawerSpaceMenu');

if (drawerSpaceBtn && drawerSpaceMenu) {
  drawerSpaceBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    drawerSpaceMenu.classList.toggle('expanded');
    
    // Update button text
    const isExpanded = drawerSpaceMenu.classList.contains('expanded');
    const btnText = drawerSpaceBtn.querySelector('span');
    if (btnText) {
      btnText.textContent = isExpanded ? 'Spaces ▼' : 'Spaces ▶';
    }
  });
}

// Search functionality
const searchInput = document.getElementById('moduleSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
      // Show all modules if search is empty
      (async () => {
        await renderModules(modulesGrid);
      })();
      return;
    }
    
    // Filter modules based on search term
    const filteredModules = modulesIndex.filter(module => {
      return module.title.toLowerCase().includes(searchTerm) ||
             module.description.toLowerCase().includes(searchTerm);
    });
    
    // Render filtered results
    if (filteredModules.length === 0) {
      modulesGrid.innerHTML = `
        <div class="no-results-message">
          <p>No modules found matching "${searchTerm}"</p>
          <p>Try a different search term</p>
        </div>
      `;
    } else {
      const markup = filteredModules.map(module => {
        const progressPercent = getModuleProgress(module.id);
        return `
        <article class="module-card" data-module="${module.id}">
          <div class="module-card-header">
            <div class="module-icon">
              <img src="${module.icon}" alt="${module.title}">
            </div>
            <h2 class="module-title">${module.title}</h2>
          </div>
          <p class="module-description">${module.description}</p>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="module-actions">
            <button type="button" class="module-start" data-module="${module.id}">Start Module</button>
          </div>
        </article>
      `;
      }).join('');
      
      modulesGrid.innerHTML = markup;
    }
  });
}