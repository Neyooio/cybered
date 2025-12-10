(function(){
  function deriveApiBase(){
    // Use global config if available
    if (window.API_BASE_URL) return window.API_BASE_URL + '/api';
    
    try{
      const hostname = window.location.hostname;
      
      // Production environments
      if (hostname.includes('netlify.app') || hostname.includes('github.io') || hostname.includes('onrender.com')) {
        return 'https://cybered-backend.onrender.com/api';
      }
      
      // Local development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:4000/api';
      }
      
      // Network access (LAN)
      return `${window.location.protocol}//${hostname}:4000/api`;
    }catch(e){}
    return 'http://localhost:4000/api';
  }
  const API_BASE = deriveApiBase();

  function token(){ return localStorage.getItem('authToken') || ''; }
  function role(){ return localStorage.getItem('authRole') || ''; }

  async function fetchJSON(url, opts={}){
    const res = await fetch(url, { ...opts, headers: { 'Content-Type':'application/json', ...(opts.headers||{}), 'Authorization': 'Bearer ' + token() } });
    if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || res.statusText);
    return res.json();
  }

  let allUsers = [];
  let expandedCardId = null;
  let roleRequests = [];

  async function loadUsers(){
    const grid = document.getElementById('usersGrid');
    const empty = document.getElementById('emptyState');
    grid.innerHTML='';
    try {
      // Load users and role requests in parallel
      const [usersResponse, requestsResponse] = await Promise.all([
        fetchJSON(API_BASE + '/users'),
        fetchJSON(API_BASE + '/role-requests?status=pending').catch(() => ({ requests: [] }))
      ]);
      
      // Filter out admin users
      allUsers = (usersResponse.users || []).filter(u => u.role !== 'admin');
      roleRequests = requestsResponse.requests || [];
      
      if (!allUsers || allUsers.length === 0){ 
        empty.style.display='block'; 
        return; 
      }
      empty.style.display='none';
      renderUsers(allUsers);
      
      // Check if we need to filter/highlight a specific user
      const filterUserId = sessionStorage.getItem('filterUserId');
      if (filterUserId) {
        setTimeout(() => {
          highlightUser(filterUserId);
          sessionStorage.removeItem('filterUserId');
        }, 300);
      }
    } catch(e){
      grid.innerHTML = `<div class="muted">Failed to load users: ${e.message}</div>`;
    }
  }

  function renderUsers(users) {
    const grid = document.getElementById('usersGrid');
    grid.innerHTML = '';
    
    if (users.length === 0) {
      document.getElementById('emptyState').style.display = 'block';
      return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    
    users.forEach(u => {
      const card = createUserCard(u);
      grid.appendChild(card);
    });
  }

  function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.dataset.userId = user.id;
    
    const avatar = getUserAvatar(user);
    const dateCreated = formatDate(user.createdAt);
    const roleClass = user.role === 'admin' ? 'admin' : '';
    
    // Check if user has a pending role request
    const pendingRequest = roleRequests.find(req => 
      req.userId && (req.userId._id === user.id || req.userId.id === user.id || req.userId === user.id)
    );
    const hasPendingRequest = !!pendingRequest;
    const pendingRequestBadge = hasPendingRequest 
      ? '<span class="pending-request-badge">Pending Request</span>' 
      : '';
    
    // Add 'has-pending' class to card if there's a pending request
    if (hasPendingRequest) {
      card.classList.add('has-pending');
      card.dataset.requestId = pendingRequest._id;
    }
    
    card.innerHTML = `
      <div class="user-card-header">
        ${avatar}
        <div class="user-info">
          <div class="user-name">${user.username || 'No username'}</div>
          <div class="user-email">${user.email}</div>
        </div>
      </div>
      <div class="user-meta">
        <div class="user-role-wrapper">
          <span class="user-role-badge ${roleClass}">${user.role}</span>
          ${pendingRequestBadge}
        </div>
        <div class="user-date">${dateCreated}</div>
      </div>
      <div class="user-actions">
        <button class="action-btn visit" data-action="visit" data-id="${user.id}">
          <span>Visit</span>
        </button>
        <button class="action-btn edit" data-action="edit" data-id="${user.id}">
          <span>Edit</span>
        </button>
        <button class="action-btn delete" data-action="delete" data-id="${user.id}">
          <span>Delete</span>
        </button>
      </div>
    `;
    
    // Toggle expanded state on click
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking on action buttons or their children
      if (e.target.closest('.action-btn') || e.target.classList.contains('action-btn')) {
        return;
      }
      
      const wasExpanded = card.classList.contains('expanded');
      const pendingBadge = card.querySelector('.pending-request-badge');
      
      // Collapse all cards
      document.querySelectorAll('.user-card').forEach(c => {
        c.classList.remove('expanded');
        // Fade in all pending badges when collapsing
        const badge = c.querySelector('.pending-request-badge');
        if (badge) {
          badge.style.opacity = '1';
        }
      });
      
      // Toggle this card
      if (!wasExpanded) {
        card.classList.add('expanded');
        expandedCardId = user.id;
        
        // Fade out pending badge when expanding
        if (pendingBadge) {
          pendingBadge.style.opacity = '0';
        }
      } else {
        expandedCardId = null;
        // Fade in pending badge when collapsing
        if (pendingBadge) {
          pendingBadge.style.opacity = '1';
        }
      }
    });
    
    return card;
  }

  function getUserAvatar(user) {
    // Check if user has avatar data
    const avatarSrc = user.avatarSrc || user.avatar || '';
    const avatarName = user.avatarName || '';
    
    // Determine the avatar URL - use name to build correct path for admin folder
    let avatarUrl = '';
    if (avatarName) {
      // Build path relative to admin folder (need to go up to assets)
      avatarUrl = `../../../assets/images/${avatarName}.png`;
    } else if (avatarSrc && avatarSrc.includes('assets/images/')) {
      // Extract filename from existing path and rebuild for admin folder
      const match = avatarSrc.match(/([^\/]+)\.png$/);
      if (match && match[1]) {
        avatarUrl = `../../../assets/images/${match[1]}.png`;
      }
    }
    
    // If no avatar, use default
    if (!avatarUrl) {
      avatarUrl = '../../../assets/images/Sen.png'; // Default to Sen avatar
    }
    
    return `<img src="${avatarUrl}" alt="${user.username}" class="user-avatar" onerror="this.src='../../../assets/images/Sen.png'" />`;
  }

  function getInitials(name) {
    if (!name) return '?';
    const parts = name.split('@')[0].split(/[\s._-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch(e) {
      return 'Unknown';
    }
  }

  async function onDelete(id){
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    // Show delete modal
    const modal = document.getElementById('deleteUserModal');
    const userInfo = document.getElementById('deleteUserInfo');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const closeBtn = document.getElementById('closeDeleteModal');
    
    if (userInfo) {
      userInfo.textContent = `${user.username || user.email}`;
    }
    
    modal.style.display = 'flex';
    
    // Handle confirm
    const handleConfirm = async () => {
      try {
        await fetchJSON(API_BASE + '/users/' + id, { method:'DELETE' });
        showToast('User deleted successfully', 'success');
        await loadUsers();
        modal.style.display = 'none';
      } catch(e){ 
        showToast('Failed to delete user: ' + e.message, 'error');
      }
      cleanup();
    };
    
    // Handle cancel
    const handleCancel = () => {
      modal.style.display = 'none';
      cleanup();
    };
    
    const cleanup = () => {
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      closeBtn.removeEventListener('click', handleCancel);
      modal.removeEventListener('click', handleOutsideClick);
    };
    
    const handleOutsideClick = (e) => {
      if (e.target === modal) handleCancel();
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    closeBtn.addEventListener('click', handleCancel);
    modal.addEventListener('click', handleOutsideClick);
  }

  async function onApprove(userId, requestId) {
    try {
      // Approve the role request
      await fetchJSON(API_BASE + '/role-requests/' + requestId, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'approved',
          respondedBy: localStorage.getItem('authUserId') || 'admin'
        })
      });
      
      showToast('Role request approved successfully', 'success');
      await loadUsers();
      
      // Update notification badge if function exists
      if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
      }
    } catch(e) {
      showToast('Failed to approve request: ' + e.message, 'error');
    }
  }

  async function onReject(userId, requestId) {
    try {
      // Reject the role request
      await fetchJSON(API_BASE + '/role-requests/' + requestId, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'rejected',
          respondedBy: localStorage.getItem('authUserId') || 'admin'
        })
      });
      
      showToast('Role request rejected', 'success');
      await loadUsers();
      
      // Update notification badge if function exists
      if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
      }
    } catch(e) {
      showToast('Failed to reject request: ' + e.message, 'error');
    }
  }

  function onEdit(id) {
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    console.log('Editing user:', user);
    console.log('All role requests:', roleRequests);
    
    // Find pending request for this user
    const pendingRequest = roleRequests.find(req => {
      console.log('Checking request:', req, 'userId:', req.userId, 'looking for:', id);
      return req.userId && (req.userId._id === id || req.userId.id === id || req.userId === id);
    });
    
    console.log('Found pending request:', pendingRequest);
    
    // Show edit modal
    const modal = document.getElementById('editUserModal');
    const closeBtn = document.getElementById('closeEditModal');
    
    // Tab elements
    const tabs = modal.querySelectorAll('.modal-tab');
    const detailsTab = document.getElementById('detailsTab');
    const requestsTab = document.getElementById('requestsTab');
    
    // User details elements
    const displayUsername = document.getElementById('displayUsername');
    const displayEmail = document.getElementById('displayEmail');
    const displayPhone = document.getElementById('displayPhone');
    const displayRole = document.getElementById('displayRole');
    const displayAvatar = document.getElementById('displayAvatar');
    const displayCreatedAt = document.getElementById('displayCreatedAt');
    const roleSelect = document.getElementById('roleSelect');
    const updateRoleBtn = document.getElementById('updateRoleBtn');
    const revertToUserBtn = document.getElementById('revertToUserBtn');
    const roleManagementSection = document.querySelector('.role-management-section');
    
    // Request elements
    const pendingAlert = document.getElementById('pendingRequestAlert');
    const pendingReason = document.getElementById('pendingRequestReason');
    const requestActions = document.getElementById('requestActions');
    const noRequestMessage = document.getElementById('noRequestMessage');
    const approveBtn = document.getElementById('approveRequestBtn');
    const rejectBtn = document.getElementById('rejectRequestBtn');
    
    // Populate user details
    if (displayUsername) displayUsername.textContent = user.username || 'N/A';
    if (displayEmail) displayEmail.textContent = user.email || 'N/A';
    if (displayPhone) displayPhone.textContent = user.phone || 'N/A';
    if (displayRole) displayRole.textContent = user.role || 'user';
    if (displayAvatar) displayAvatar.textContent = user.avatarName || user.avatarSrc || 'N/A';
    if (displayCreatedAt) {
      const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
      displayCreatedAt.textContent = date;
    }
    
    // Show/hide role management UI based on user role
    if (user.role === 'user') {
      // Hide entire role management section for regular users
      if (roleManagementSection) roleManagementSection.style.display = 'none';
    } else if (user.role === 'faculty') {
      // Show only revert button for faculty
      if (roleManagementSection) roleManagementSection.style.display = 'block';
      if (roleSelect) roleSelect.style.display = 'none';
      if (updateRoleBtn) updateRoleBtn.style.display = 'none';
      if (revertToUserBtn) revertToUserBtn.style.display = 'inline-block';
    } else {
      // Show select and update button for admin role
      if (roleManagementSection) roleManagementSection.style.display = 'block';
      if (roleSelect) {
        roleSelect.style.display = 'block';
        roleSelect.value = user.role || 'user';
      }
      if (updateRoleBtn) updateRoleBtn.style.display = 'inline-block';
      if (revertToUserBtn) revertToUserBtn.style.display = 'none';
    }
    
    // Show/hide pending request alert and actions in requests tab
    if (pendingRequest) {
      pendingAlert.style.display = 'flex';
      pendingReason.textContent = `"${pendingRequest.reason}"`;
      requestActions.style.display = 'block';
      noRequestMessage.style.display = 'none';
    } else {
      pendingAlert.style.display = 'none';
      requestActions.style.display = 'none';
      noRequestMessage.style.display = 'block';
    }
    
    // Reset to first tab
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[0].classList.add('active');
    detailsTab.classList.add('active');
    requestsTab.classList.remove('active');
    
    modal.style.display = 'flex';
    
    // Handle Approve
    const handleApprove = async () => {
      console.log('handleApprove called');
      console.log('pendingRequest in handleApprove:', pendingRequest);
      console.log('pendingRequest keys:', pendingRequest ? Object.keys(pendingRequest) : 'no keys');
      console.log('pendingRequest._id:', pendingRequest ? pendingRequest._id : 'undefined');
      console.log('pendingRequest.id:', pendingRequest ? pendingRequest.id : 'undefined');
      
      // Try both _id and id
      const requestId = pendingRequest?._id || pendingRequest?.id;
      
      if (!pendingRequest || !requestId) {
        console.error('No pending request found or missing ID');
        showToast('No pending request to approve', 'error');
        return;
      }
      
      try {
        // Approve the role request
        await fetchJSON(API_BASE + '/role-requests/' + requestId, {
          method: 'PUT',
          body: JSON.stringify({ 
            status: 'approved',
            respondedBy: localStorage.getItem('authUserId') || 'admin',
            adminResponse: 'Role Request Approved'
          })
        });
        
        // Upgrade user role to faculty
        await fetchJSON(API_BASE + '/users/' + user.id, {
          method: 'PUT',
          body: JSON.stringify({ 
            role: 'faculty'
          })
        });
        
        showToast('Role request approved! User upgraded to Faculty', 'success');
        modal.style.display = 'none';
        cleanup();
        await loadUsers();
        
        if (typeof updateNotificationBadge === 'function') {
          updateNotificationBadge();
        }
      } catch(e) {
        showToast('Failed to approve request: ' + e.message, 'error');
      }
    };
    
    // Handle Reject
    const handleReject = async () => {
      console.log('handleReject called');
      console.log('pendingRequest in handleReject:', pendingRequest);
      console.log('pendingRequest keys:', pendingRequest ? Object.keys(pendingRequest) : 'no keys');
      console.log('pendingRequest._id:', pendingRequest ? pendingRequest._id : 'undefined');
      console.log('pendingRequest.id:', pendingRequest ? pendingRequest.id : 'undefined');
      
      // Try both _id and id
      const requestId = pendingRequest?._id || pendingRequest?.id;
      
      if (!pendingRequest || !requestId) {
        console.error('No pending request found or missing ID');
        showToast('No pending request to reject', 'error');
        return;
      }
      
      try {
        await fetchJSON(API_BASE + '/role-requests/' + requestId, {
          method: 'PUT',
          body: JSON.stringify({ 
            status: 'rejected',
            respondedBy: localStorage.getItem('authUserId') || 'admin',
            adminResponse: 'Role Request Rejected'
          })
        });
        
        showToast('Role request rejected', 'success');
        modal.style.display = 'none';
        cleanup();
        await loadUsers();
        
        if (typeof updateNotificationBadge === 'function') {
          updateNotificationBadge();
        }
      } catch(e) {
        showToast('Failed to reject request: ' + e.message, 'error');
      }
    };
    
    // Handle close
    const handleClose = () => {
      modal.style.display = 'none';
      cleanup();
    };
    
    // Handle Update Role
    const handleUpdateRole = async () => {
      const newRole = roleSelect.value;
      
      if (!['admin', 'user', 'faculty'].includes(newRole)) {
        showToast('Invalid role selected', 'error');
        return;
      }
      
      try {
        await fetchJSON(API_BASE + '/users/' + user.id, {
          method: 'PUT',
          body: JSON.stringify({ role: newRole })
        });
        
        showToast(`User role updated to ${newRole} successfully`, 'success');
        modal.style.display = 'none';
        cleanup();
        await loadUsers();
        
        if (typeof updateNotificationBadge === 'function') {
          updateNotificationBadge();
        }
      } catch(e) {
        showToast('Failed to update role: ' + e.message, 'error');
      }
    };
    
    // Handle Revert to User
    const handleRevertToUser = async () => {
      try {
        await fetchJSON(API_BASE + '/users/' + user.id, {
          method: 'PUT',
          body: JSON.stringify({ role: 'user' })
        });
        
        showToast('User role reverted to User successfully', 'success');
        modal.style.display = 'none';
        cleanup();
        await loadUsers();
        
        if (typeof updateNotificationBadge === 'function') {
          updateNotificationBadge();
        }
      } catch(e) {
        showToast('Failed to revert role: ' + e.message, 'error');
      }
    };
    
    // Handle tab switching
    const handleTabClick = (e) => {
      const clickedTab = e.target.closest('.modal-tab');
      if (!clickedTab) return;
      
      const tabName = clickedTab.dataset.tab;
      
      // Update tab buttons
      tabs.forEach(tab => tab.classList.remove('active'));
      clickedTab.classList.add('active');
      
      // Update tab content
      if (tabName === 'details') {
        detailsTab.classList.add('active');
        requestsTab.classList.remove('active');
      } else if (tabName === 'requests') {
        detailsTab.classList.remove('active');
        requestsTab.classList.add('active');
      }
    };
    
    const cleanup = () => {
      closeBtn.removeEventListener('click', handleClose);
      updateRoleBtn.removeEventListener('click', handleUpdateRole);
      if (revertToUserBtn) revertToUserBtn.removeEventListener('click', handleRevertToUser);
      approveBtn.removeEventListener('click', handleApprove);
      rejectBtn.removeEventListener('click', handleReject);
      tabs.forEach(tab => tab.removeEventListener('click', handleTabClick));
      modal.removeEventListener('click', handleOutsideClick);
    };
    
    const handleOutsideClick = (e) => {
      if (e.target === modal) handleClose();
    };
    
    closeBtn.addEventListener('click', handleClose);
    updateRoleBtn.addEventListener('click', handleUpdateRole);
    if (revertToUserBtn) revertToUserBtn.addEventListener('click', handleRevertToUser);
    approveBtn.addEventListener('click', handleApprove);
    rejectBtn.addEventListener('click', handleReject);
    tabs.forEach(tab => tab.addEventListener('click', handleTabClick));
    modal.addEventListener('click', handleOutsideClick);
  }

  async function onApprove(userId, requestId) {
    try {
      // Approve the role request
      await fetchJSON(API_BASE + '/role-requests/' + requestId, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'approved',
          respondedBy: localStorage.getItem('authUserId') || 'admin'
        })
      });
      
      showToast('Role request approved successfully', 'success');
      await loadUsers();
      
      // Update notification badge if function exists
      if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
      }
    } catch(e) {
      showToast('Failed to approve request: ' + e.message, 'error');
    }
  }

  async function onReject(userId, requestId) {
    try {
      // Reject the role request
      await fetchJSON(API_BASE + '/role-requests/' + requestId, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'rejected',
          respondedBy: localStorage.getItem('authUserId') || 'admin'
        })
      });
      
      showToast('Role request rejected', 'success');
      await loadUsers();
      
      // Update notification badge if function exists
      if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
      }
    } catch(e) {
      showToast('Failed to reject request: ' + e.message, 'error');
    }
  }

  function onVisit(id) {
    // Find the user
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    // Store the user data temporarily so the profile page can load it
    try {
      sessionStorage.setItem('viewingUserId', user.id);
      sessionStorage.setItem('viewingUserData', JSON.stringify(user));
      sessionStorage.setItem('isAdminViewing', 'true');
      
      // Navigate to profile page
      window.location.href = '../profile.html?userId=' + user.id;
    } catch(e) {
      showToast('Error opening profile: ' + e.message, 'error');
    }
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast-notification show ' + type;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (!query) {
        renderUsers(allUsers);
        return;
      }
      
      const filtered = allUsers.filter(u => {
        const username = (u.username || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const role = (u.role || '').toLowerCase();
        
        return username.includes(query) || 
               email.includes(query) || 
               role.includes(query);
      });
      
      renderUsers(filtered);
    });
  }

  function ensureAdmin(){
    if (role() !== 'admin') {
      window.location.href = '../cybered.html';
    }
  }

  // Auto-refresh user list every 30 seconds to catch avatar updates
  function startAutoRefresh() {
    setInterval(() => {
      loadUsers();
    }, 30000); // 30 seconds
  }

  // Refresh when page becomes visible again (user returns from viewing profile)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      loadUsers();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    ensureAdmin();
    loadUsers();
    setupSearch();
    startAutoRefresh();
    
    // Handle refresh button
    const refreshBtn = document.getElementById('refreshUsersBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.value = '';
        }
        
        loadUsers();
        showToast('User list refreshed', 'success');
        
        // Remove spinning class after animation completes
        setTimeout(() => {
          refreshBtn.classList.remove('spinning');
        }, 600);
      });
    }
    
    // Handle action button clicks
    document.getElementById('usersGrid').addEventListener('click', (e) => {
      // Find the button element (even if clicking on span inside)
      const btn = e.target.closest('.action-btn');
      if (!btn) return;
      
      // Stop event from bubbling
      e.stopPropagation();
      e.preventDefault();
      
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      
      console.log('Button clicked:', action, 'for user:', id);
      
      if (action === 'delete') {
        onDelete(id);
      } else if (action === 'edit') {
        onEdit(id);
      } else if (action === 'visit') {
        onVisit(id);
      }
    });
    
    // Close expanded cards when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-card')) {
        document.querySelectorAll('.user-card').forEach(c => c.classList.remove('expanded'));
        expandedCardId = null;
      }
    });
  });
  
  // Highlight and scroll to specific user
  function highlightUser(userId) {
    const card = document.querySelector(`.user-card[data-user-id="${userId}"]`);
    if (!card) return;
    
    // Collapse all cards first (keep them collapsed)
    document.querySelectorAll('.user-card').forEach(c => {
      c.classList.remove('expanded');
      c.style.animation = '';
    });
    
    // Reset expandedCardId since we're collapsing all
    expandedCardId = null;
    
    // Scroll to the card
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Small delay for scroll, then animate WITHOUT expanding
    setTimeout(() => {
      card.style.animation = 'zoomHighlight 1.5s ease-out';
    }, 300);
    
    // Remove animation after it completes
    setTimeout(() => {
      card.style.animation = '';
    }, 1800);
  }
})();
