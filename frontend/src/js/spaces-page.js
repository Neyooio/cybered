// Spaces Page JavaScript
console.log('[spaces-page.js] Loading...');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[spaces-page.js] DOM Content Loaded');
  
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('authRole');
  
  if (!token) {
    window.location.href = 'register-form.html';
    return;
  }
  
  // Get API base
  const stored = localStorage.getItem('apiBase');
  let apiBase = stored ? stored.replace(/\/$/, '') : null;
  if (!apiBase) {
    const { protocol, hostname } = window.location || {};
    if (hostname) {
      // Production environment (Netlify)
      if (hostname.includes('netlify.app')) {
        apiBase = 'https://cybered-backend.onrender.com/api';
      }
      // Local development
      else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        apiBase = 'http://localhost:4000/api';
      }
      // Network access
      else {
        const proto = protocol || 'http:';
        apiBase = `${proto}//${hostname}:4000/api`;
      }
    } else {
      apiBase = 'http://localhost:4000/api';
    }
  }
  
  const spacesGrid = document.getElementById('spacesGrid');
  const emptyState = document.getElementById('emptyState');
  const emptyStateTitle = document.getElementById('emptyStateTitle');
  const emptyStateMessage = document.getElementById('emptyStateMessage');
  const facultyToggle = document.getElementById('faculty-add-toggle');
  
  // Show floating button for all users (desktop and mobile)
  const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
  
  // Floating button (show for all users on all devices)
  if (facultyToggle && userRole) {
    facultyToggle.style.display = 'flex';
    
    facultyToggle.addEventListener('click', () => {
      if (isFacultyOrAdmin) {
        // Faculty/Admin: Open create space modal
        if (window.facultyModuleCreator) {
          window.facultyModuleCreator.openModal();
        }
      } else {
        // Students: Open join space modal
        if (window.studentSpaceJoiner) {
          window.studentSpaceJoiner.openModal();
        }
      }
    });
  }
  
  // Load spaces
  try {
    const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
    const endpoint = isFacultyOrAdmin 
      ? `${apiBase}/faculty-modules/my-spaces`
      : `${apiBase}/faculty-modules/enrolled`;
    
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load spaces');
    }
    
    const data = await response.json();
    const spaces = data.spaces || [];
    
    if (spaces.length === 0) {
      // Show empty state
      spacesGrid.style.display = 'none';
      emptyState.style.display = 'flex';
      
      if (isFacultyOrAdmin) {
        emptyStateTitle.textContent = 'No Spaces Created';
        emptyStateMessage.textContent = 'Create your first space to start teaching';
      } else {
        emptyStateTitle.textContent = 'No Spaces Joined';
        emptyStateMessage.textContent = 'Join a space to start learning';
      }
    } else {
      // Display spaces
      spacesGrid.style.display = 'grid';
      emptyState.style.display = 'none';
      
      spacesGrid.innerHTML = spaces.map(space => {
        const createdDate = new Date(space.createdAt).toLocaleDateString();
        const modulesCount = space.modules ? space.modules.length : 0;
        const themeColor = space.theme?.primaryColor || '#1e40af'; // Get color from theme.primaryColor
        
        return `
          <div class="module-card" onclick="window.location.href='faculty-space.html?id=${space._id}'" style="background: ${themeColor};">
            <div class="module-header">
              <h2 class="module-title">${space.name || 'Unnamed Space'}</h2>
            </div>
            <div class="module-body">
              <p class="module-description">${space.description || 'No description available'}</p>
              <div class="module-stats">
                <div class="stat">
                  <span class="stat-label">Modules</span>
                  <span class="stat-value">${modulesCount}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Created</span>
                  <span class="stat-value">${createdDate}</span>
                </div>
              </div>
            </div>
            <div class="module-footer">
              <button class="pixel-button" onclick="event.stopPropagation(); window.location.href='faculty-space.html?id=${space._id}'">
                View Space
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error loading spaces:', error);
    spacesGrid.style.display = 'none';
    emptyState.style.display = 'flex';
    emptyStateTitle.textContent = 'Error Loading Spaces';
    emptyStateMessage.textContent = 'Please try again later';
  }
});
