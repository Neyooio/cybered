document.addEventListener('DOMContentLoaded', async () => {
  const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
  const isAdmin = p.includes('/src/html/admin/');
  
  const includes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(includes).map(async host => {
    const url = host.getAttribute('data-include');
    try {
      const res = await fetch(url);
      let html = await res.text();
      
      // If we're in admin folder, fix asset paths in the HTML before inserting
      if (isAdmin && html.includes('../../assets/')) {
        html = html.replace(/\.\.\/\.\.\/assets\//g, '../../../assets/');
      }
      
      host.outerHTML = html;
    } catch (e) { console.error('Include failed:', url, e); }
  }));

  resetModuleProgressOnReload();
  setActiveNav();
  restoreProfileBasics && restoreProfileBasics();
  fixAssetPaths && fixAssetPaths();
  forceUpdateAvatar && forceUpdateAvatar();
  
  // Wait a bit for DOM to settle, then check admin role and setup dropdown
  setTimeout(() => {
    checkAdminRole && checkAdminRole();
    setupAdminDropdown();
    updateNotificationBadge();
    setupNotificationDropdown();
    // Ensure avatar is set again after all includes are loaded
    restoreProfileBasics && restoreProfileBasics();
    forceUpdateAvatar && forceUpdateAvatar();
  }, 100);
  
  // Force update again after a longer delay to catch any late-loading elements
  setTimeout(() => {
    forceUpdateAvatar && forceUpdateAvatar();
  }, 500);

  // Ensure logout confirmation modal exists and is wired up
  setupLogoutConfirmation();
  // Setup mobile hamburger drawer
  setupMobileDrawer();
});

function setActiveNav() {
  const file = (location.pathname.split('/').pop() || '').toLowerCase();
  const links = Array.from(document.querySelectorAll('.side-panel .nav-item'));
  links.forEach(a => a.classList.remove('active-item'));
  let match = links.find(a => (a.getAttribute('href') || '').toLowerCase().endsWith(file));
  // When on a specific module page (module-*.html), force Modules nav active
  if (!match && /^module-.*\.html$/.test(file)) {
    match = links.find(a => (a.getAttribute('href') || '').toLowerCase().includes('modules.html'));
  }
  if (match) match.classList.add('active-item');
}

function restoreProfileBasics() {
  try {
    // Check if we're on the profile page
    const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
    const isProfilePage = p.includes('/profile.html');
    const isAdmin = p.includes('/src/html/admin/');
    const isLesson = p.includes('/src/html/lessons/');
    
    // Check if admin is viewing another user's profile (only relevant on profile page)
    const isAdminViewing = isProfilePage && sessionStorage.getItem('isAdminViewing') === 'true';
    
    // If not on profile page, clear the admin viewing state
    if (!isProfilePage) {
      sessionStorage.removeItem('isAdminViewing');
      sessionStorage.removeItem('viewingUserId');
      sessionStorage.removeItem('viewingUserData');
    }
    
    let savedName = localStorage.getItem('cyberedUserName');
    if (!savedName) {
      const email = localStorage.getItem('cyberedUserEmail') || '';
      if (email && email.includes('@')) savedName = email.split('@')[0];
    }
    if (savedName) {
      // Skip updating profileName and profileAvatar if viewing another user
      const nameEls = ['userName','homeUser','topProfileName']
        .map(id => document.getElementById(id)).filter(Boolean);
      
      // Only add profileName if NOT viewing another user on profile page
      if (!isAdminViewing) {
        const profileNameEl = document.getElementById('profileName');
        if (profileNameEl) nameEls.push(profileNameEl);
      }
      
      nameEls.forEach(el => el.textContent = savedName);
    }
    
    // Build avatar path based on current location
    const savedSrc = localStorage.getItem('cyberedAvatarSrc') || '';
    const savedNameKey = localStorage.getItem('cyberedAvatarName') || localStorage.getItem('cyberedAvatar') || '';
    
    // Build correct path based on location
    let url = '';
    if (savedNameKey) {
      if (isLesson) {
        url = `../../../../assets/images/${savedNameKey}.png`;
      } else if (isAdmin) {
        url = `../../../assets/images/${savedNameKey}.png`;
      } else {
        url = `../../assets/images/${savedNameKey}.png`;
      }
    } else if (savedSrc && savedSrc.includes('assets/images/')) {
      // Fix existing relative path
      const match = savedSrc.match(/([^\/]+)\.png$/);
      if (match && match[1]) {
        if (isLesson) {
          url = `../../../../assets/images/${match[1]}.png`;
        } else if (isAdmin) {
          url = `../../../assets/images/${match[1]}.png`;
        } else {
          url = `../../assets/images/${match[1]}.png`;
        }
      }
    }
    
    if (url) {
      // Skip updating profileAvatar if viewing another user on profile page
      const imgs = ['userAvatar','topProfileAvatar','drawerProfileAvatar']
        .map(id => document.getElementById(id)).filter(Boolean);
      
      // Only add profileAvatar if NOT viewing another user on profile page
      if (!isAdminViewing) {
        const profileAvatarImg = document.getElementById('profileAvatar');
        if (profileAvatarImg) imgs.push(profileAvatarImg);
      }
      
      imgs.forEach(img => {
        if (img) img.src = url;
      });
    }
  } catch (e) {
    console.error('restoreProfileBasics error:', e);
  }
}

// Force update avatar - utility function
function forceUpdateAvatar() {
  try {
    const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
    const isAdmin = p.includes('/src/html/admin/');
    const isLesson = p.includes('/src/html/lessons/');
    
    let savedSrc = localStorage.getItem('cyberedAvatarSrc') || '';
    const savedNameKey = localStorage.getItem('cyberedAvatarName') || localStorage.getItem('cyberedAvatar') || '';
    
    // Build correct path based on location
    let url = savedSrc;
    if (savedNameKey) {
      if (isLesson) {
        url = `../../../../assets/images/${savedNameKey}.png`;
      } else if (isAdmin) {
        url = `../../../assets/images/${savedNameKey}.png`;
      } else {
        url = `../../assets/images/${savedNameKey}.png`;
      }
    } else if (savedSrc && savedSrc.includes('assets/images/')) {
      // Fix existing relative path
      const match = savedSrc.match(/([^\/]+)\.png$/);
      if (match && match[1]) {
        if (isLesson) {
          url = `../../../../assets/images/${match[1]}.png`;
        } else if (isAdmin) {
          url = `../../../assets/images/${match[1]}.png`;
        } else {
          url = `../../assets/images/${match[1]}.png`;
        }
      }
    }
    
    if (url) {
      const topAvatar = document.getElementById('topProfileAvatar');
      const drawerAvatar = document.getElementById('drawerProfileAvatar');
      
      if (topAvatar) {
        topAvatar.src = url;
        topAvatar.style.display = 'block';
      }
      if (drawerAvatar) {
        drawerAvatar.src = url;
        drawerAvatar.style.display = 'block';
      }
    }
  } catch(e) {
    console.error('forceUpdateAvatar error:', e);
  }
}

function checkAdminRole() {
  try {
    const role = localStorage.getItem('authRole');
    if (role === 'admin') {
      const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
      const isAdmin = p.includes('/src/html/admin/');
      
      // Show admin options button in topbar
      const adminBtn = document.getElementById('adminOptionsBtn');
      if (adminBtn) {
        adminBtn.style.display = '';
      }
      
      // Show admin options button in mobile drawer
      const drawerAdminOptionsBtn = document.getElementById('drawerAdminOptionsBtn');
      const drawerAdminMenu = document.getElementById('drawerAdminMenu');
      if (drawerAdminOptionsBtn && drawerAdminMenu) {
        drawerAdminOptionsBtn.style.display = '';
        drawerAdminMenu.style.display = 'block';
      }
      
      // Fix links if on admin page
      if (isAdmin) {
        const adminDropdown = document.getElementById('adminDropdown');
        if (adminDropdown) {
          adminDropdown.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('admin/')) {
              link.setAttribute('href', href.replace('admin/', ''));
            }
          });
        }
        
        if (drawerAdminMenu) {
          drawerAdminMenu.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('admin/')) {
              link.setAttribute('href', href.replace('admin/', ''));
            }
          });
        }
        
        const drawerAdminOptions = document.getElementById('drawerAdminOptions');
        if (drawerAdminOptions) {
          const link = drawerAdminOptions.querySelector('a');
          if (link) link.setAttribute('href', 'user-management.html');
        }
      }
    }
  } catch (e) {
    console.error('checkAdminRole error:', e);
  }
}

function setupAdminDropdown() {
  try {
    const role = localStorage.getItem('authRole');
    if (role !== 'admin') return;
    
    // Desktop dropdown
    const adminBtn = document.getElementById('adminOptionsBtn');
    const adminDropdown = document.getElementById('adminDropdown');
    
    if (adminBtn && adminDropdown) {
      console.log('Setting up admin dropdown - button and dropdown found');
      
      // Make sure button is clickable
      adminBtn.style.cursor = 'pointer';
      adminBtn.style.pointerEvents = 'auto';
      
      // Remove any existing listeners by cloning
      const newBtn = adminBtn.cloneNode(true);
      adminBtn.parentNode.replaceChild(newBtn, adminBtn);
      
      newBtn.addEventListener('click', (e) => {
        console.log('Options button clicked!');
        e.preventDefault();
        e.stopPropagation();
        const isShowing = adminDropdown.classList.contains('show');
        console.log('Dropdown is currently:', isShowing ? 'showing' : 'hidden');
        adminDropdown.classList.toggle('show');
        console.log('Dropdown toggled to:', adminDropdown.classList.contains('show') ? 'showing' : 'hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.admin-options-wrapper')) {
          adminDropdown.classList.remove('show');
        }
      });
      
      console.log('Admin dropdown setup complete');
    } else {
      // Not an error - just means we're not on a page with admin dropdown
      console.debug('Admin dropdown not found on this page');
    }
    
    // Mobile drawer menu
    const drawerAdminOptionsBtn = document.getElementById('drawerAdminOptionsBtn');
    const drawerAdminMenu = document.getElementById('drawerAdminMenu');
    
    if (drawerAdminOptionsBtn && drawerAdminMenu) {
      const btn = drawerAdminOptionsBtn.querySelector('.admin-options-btn');
      if (btn) {
        // Remove existing listeners by cloning
        const newMobileBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newMobileBtn, btn);
        
        newMobileBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          drawerAdminMenu.classList.toggle('expanded');
          
          // Update button text
          const isExpanded = drawerAdminMenu.classList.contains('expanded');
          newMobileBtn.querySelector('span').textContent = isExpanded ? 'Options ▼' : 'Options ▶';
        });
      }
    }
  } catch (e) {
    console.error('setupAdminDropdown error:', e);
  }
}

function fixAssetPaths(){
  try{
    const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
    const isAdmin = p.includes('/src/html/admin/');
    const isLesson = p.includes('/src/html/lessons/');
    
    // Fix coin icon
    const coin = document.querySelector('.coins-panel .coin-icon');
    if (coin && coin.tagName === 'IMG'){
      if (isLesson){
        coin.src='../../../../assets/images/Coin.png';
      } else if (isAdmin) {
        coin.src='../../../assets/images/Coin.png';
      } else {
        coin.src='../../assets/images/Coin.png';
      }
    }

    // Fix all other asset images when in admin folder
    if (isAdmin) {
      // Fix navbar images - catch both relative and already resolved paths
      const navImages = document.querySelectorAll('.side-panel img');
      navImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          if (src.startsWith('../../assets/')) {
            img.src = src.replace('../../assets/', '../../../assets/');
          } else if (src.includes('/src/assets/')) {
            // Fix incorrectly resolved paths
            img.src = src.replace('/src/assets/', '/assets/');
          }
        }
      });

      // Fix topbar/drawer images
      const drawerImages = document.querySelectorAll('.drawer-overlay img, .drawer-panel img');
      drawerImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          if (src.startsWith('../../assets/')) {
            img.src = src.replace('../../assets/', '../../../assets/');
          } else if (src.includes('/src/assets/')) {
            img.src = src.replace('/src/assets/', '/assets/');
          }
        }
      });

      // Fix navbar links to include ../ prefix
      const navLinks = document.querySelectorAll('.side-panel .nav-item, .drawer-link');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('../') && !href.includes('admin')) {
          link.setAttribute('href', '../' + href);
        }
      });

      // Fix profile button
      const profileBtn = document.getElementById('topProfileBtn');
      if (profileBtn) {
        profileBtn.setAttribute('onclick', "window.location.href='../profile.html'");
      }

      // Fix admin options button to not add extra path
      const adminBtn = document.getElementById('adminOptionsBtn');
      if (adminBtn) {
        adminBtn.onclick = () => { window.location.href = 'user-management.html'; };
      }
    }
  }catch(e){
    console.error('fixAssetPaths error:', e);
  }
}

// Attach logout handler if topbar logout button is present
(() => {
  function logoutRedirectPath(){
    try{
      const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
      if (p.includes('/src/html/lessons/')) return '../../register-form.html';
      if (p.includes('/src/html/admin/')) return '../register-form.html';
      return './register-form.html';
    }catch{ return './register-form.html'; }
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#logoutTopBtn');
    if (!btn) return;
    // Open confirmation dialog instead of immediate logout
    e.preventDefault();
    openLogoutConfirmation(logoutRedirectPath);
  });
})();

function resetModuleProgressOnReload(){
  try{
    // Detect reload using Navigation Timing Level 2
    const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || null;
    const isReload = nav ? (nav.type === 'reload') : (performance && performance.navigation && performance.navigation.type === 1);
    if (!isReload) return;
    const modules = ['web-security','network-defense','cryptography','malware-defense'];
    modules.forEach(m => {
      try { localStorage.removeItem('moduleProgress:'+m); } catch {}
    });
  }catch(e){}
}

// ===== Logout confirmation (Cipher dialog) =====
function getAssetImgPath(fileName){
  try{
    const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
    if (p.includes('/src/html/lessons/')) return `../../../../assets/images/${fileName}`;
    if (p.includes('/src/html/admin/')) return `../../../assets/images/${fileName}`;
    if (p.includes('/html/admin/')) return `../../../assets/images/${fileName}`;
    return `../../assets/images/${fileName}`;
  }catch{
    return `../../assets/images/${fileName}`;
  }
}

function setupLogoutConfirmation(){
  if (document.getElementById('logoutConfirmModal')) return; // already present
  const overlay = document.createElement('div');
  overlay.id = 'logoutConfirmModal';
  overlay.className = 'modal-overlay';
  overlay.setAttribute('aria-hidden','true');
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');

  const cipherSrc = getAssetImgPath('Cipher.png');
  overlay.innerHTML = `
    <div class="modal-card" role="document" aria-labelledby="logoutDialogTitle" aria-describedby="logoutDialogDesc">
      <div class="modal-titlebar">
        <img class="modal-avatar" src="${cipherSrc}" alt="" aria-hidden="true"/>
        <h3 id="logoutDialogTitle" class="modal-title">Ready to log out?</h3>
      </div>
      <div class="modal-body">
        <p id="logoutDialogDesc" class="modal-message">Cipher: "I'll secure your console. You can resume anytime."</p>
      </div>
      <div class="modal-actions">
        <button id="confirmLogoutBtn" class="warning-button">Log out</button>
        <button id="cancelLogoutBtn" class="secondary-button">Cancel</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Wire interactions
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLogoutConfirmation(); // backdrop click closes
  });
  document.addEventListener('keydown', (e) => {
    const modalOpen = overlay.getAttribute('aria-hidden') === 'false';
    if (!modalOpen) return;
    if (e.key === 'Escape') closeLogoutConfirmation();
  });
}

function openLogoutConfirmation(getRedirect){
  const overlay = document.getElementById('logoutConfirmModal');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden','false');
  const confirmBtn = overlay.querySelector('#confirmLogoutBtn');
  const cancelBtn = overlay.querySelector('#cancelLogoutBtn');
  // Focus the primary action for accessibility
  setTimeout(() => { try{ confirmBtn && confirmBtn.focus(); }catch{} }, 0);

  const onConfirm = () => {
    try{ localStorage.removeItem('authToken'); localStorage.removeItem('authRole'); }catch{}
    const dest = (typeof getRedirect === 'function') ? getRedirect() : './register-form.html';
    window.location.href = dest;
  };
  const onCancel = () => closeLogoutConfirmation();

  confirmBtn && confirmBtn.addEventListener('click', onConfirm, { once:true });
  cancelBtn && cancelBtn.addEventListener('click', onCancel, { once:true });
}

function closeLogoutConfirmation(){
  const overlay = document.getElementById('logoutConfirmModal');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden','true');
}

// ===== Mobile drawer (hamburger) =====
function setupMobileDrawer(){
  try{
    const btn = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('drawerClose');
    if (!btn || !drawer) return;

    const open = () => {
      drawer.setAttribute('aria-hidden','false');
      btn.setAttribute('aria-expanded','true');
      btn.classList.add('is-open');
      // Sync profile name/avatar into drawer
      const name = document.getElementById('topProfileName')?.textContent || 'Profile';
      let avatarSrc = document.getElementById('topProfileAvatar')?.getAttribute('src') || '';
      
      // Fallback: get avatar from localStorage if topProfileAvatar is not set or is default
      if (!avatarSrc || avatarSrc.includes('pixel-avatar.png')) {
        const avatarMap = {
          'Sen': 'https://i.ibb.co/2W0DdZm/avatar1.png',
          'Aldrick': 'https://i.ibb.co/5Fsb0CQ/avatar2.png',
          'Maya': 'https://i.ibb.co/0hZk0hh/avatar3.png',
          'Annette': 'https://i.ibb.co/0rp25M5/avatar4.png'
        };
        const savedSrc = localStorage.getItem('cyberedAvatarSrc') || '';
        const savedNameKey = localStorage.getItem('cyberedAvatarName') || localStorage.getItem('cyberedAvatar') || '';
        avatarSrc = savedSrc || (savedNameKey ? avatarMap[savedNameKey] : '') || avatarSrc;
      }
      
      const nameEl = document.getElementById('drawerProfileName');
      const avatarEl = document.getElementById('drawerProfileAvatar');
      if (nameEl) nameEl.textContent = name;
      if (avatarEl && avatarSrc) avatarEl.src = avatarSrc;
    };
    const close = () => {
      drawer.setAttribute('aria-hidden','true');
      btn.setAttribute('aria-expanded','false');
      btn.classList.remove('is-open');
    };
    btn.addEventListener('click', () => {
      const hidden = drawer.getAttribute('aria-hidden') !== 'false';
      hidden ? open() : close();
    });
    closeBtn && closeBtn.addEventListener('click', close);
    drawer.addEventListener('click', (e) => { if (e.target === drawer) close(); });

    // Hook mobile logout inside drawer
    const logoutMobile = document.getElementById('logoutMobileBtn');
    if (logoutMobile){
      logoutMobile.addEventListener('click', (e) => {
        e.preventDefault();
        // Reuse confirmation modal
        const pathFn = () => {
          const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
          if (p.includes('/src/html/lessons/')) return '../../register-form.html';
          if (p.includes('/src/html/admin/')) return '../register-form.html';
          return './register-form.html';
        };
        openLogoutConfirmation(pathFn);
      });
    }

    // ESC key closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') close();
    });
  }catch(e){}
}

// Notification Badge System
async function updateNotificationBadge() {
  try {
    const role = localStorage.getItem('authRole');
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    // Determine API base
    const stored = localStorage.getItem('apiBase');
    let apiBase = stored ? stored.replace(/\/$/, '') : null;
    if (!apiBase) {
      const { protocol, hostname } = window.location || {};
      if (hostname) {
        const proto = protocol || 'http:';
        apiBase = `${proto}//${hostname}:4000/api`;
      } else {
        apiBase = 'http://localhost:4000/api';
      }
    }
    
    let count = 0;
    
    if (role === 'admin') {
      // Admin: count pending role requests
      const response = await fetch(`${apiBase}/role-requests/count/pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch notification count');
        return;
      }
      
      const data = await response.json();
      count = data.count || 0;
    } else {
      // Regular user: count unread approved/rejected requests
      const response = await fetch(`${apiBase}/role-requests/my-requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch user notifications');
        return;
      }
      
      const data = await response.json();
      const myRequests = data.requests || [];
      
      // Get shown notification IDs from localStorage
      const shownNotifications = JSON.parse(localStorage.getItem('shownNotifications') || '[]');
      
      // Count approved/rejected requests that haven't been dismissed
      count = myRequests.filter(req => {
        const reqId = req._id || req.id;
        return (req.status === 'approved' || req.status === 'rejected') && 
               !shownNotifications.includes(reqId);
      }).length;
    }
    
    // Update badge
    const badge = document.getElementById('notificationBadge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error updating notification badge:', error);
    // Silently fail - don't show errors to user if server is unavailable
    const badge = document.getElementById('notificationBadge');
    if (badge) {
      badge.style.display = 'none';
    }
  }
}

// Refresh notification badge every 30 seconds
setInterval(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    updateNotificationBadge();
  }
}, 30000);

// Make updateNotificationBadge globally accessible
window.updateNotificationBadge = updateNotificationBadge;

// Notification Dropdown System
function setupNotificationDropdown() {
  try {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const closeNotificationsBtn = document.getElementById('closeNotifications');
    
    if (!notificationBtn || !notificationDropdown) return;
    
    // Load badge count on page load
    updateNotificationBadge();
    
    // Toggle dropdown
    notificationBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const isShowing = notificationDropdown.classList.contains('show');
      
      if (!isShowing) {
        // Load notifications before showing
        await loadNotifications();
        notificationDropdown.classList.add('show');
      } else {
        notificationDropdown.classList.remove('show');
      }
    });
    
    // Close button
    closeNotificationsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.remove('show');
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notificationBtn') && !e.target.closest('#notificationDropdown')) {
        notificationDropdown.classList.remove('show');
      }
    });
  } catch (error) {
    console.error('Error setting up notification dropdown:', error);
  }
}

// Load notifications into dropdown
async function loadNotifications() {
  try {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');
    if (!token) return;
    
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;
    
    // For regular users, check for processed role requests
    if (role !== 'admin') {
      await loadUserNotifications(notificationList, token);
      return;
    }
    
    // Admin-only: Load pending role requests
    await loadAdminNotifications(notificationList, token);
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// Load notifications for regular users
async function loadUserNotifications(notificationList, token) {
  try {
    // Determine API base
    const stored = localStorage.getItem('apiBase');
    let apiBase = stored ? stored.replace(/\/$/, '') : null;
    if (!apiBase) {
      const { protocol, hostname } = window.location || {};
      if (hostname) {
        const proto = protocol || 'http:';
        apiBase = `${proto}//${hostname}:4000/api`;
      } else {
        apiBase = 'http://localhost:4000/api';
      }
    }
    
    // Fetch user's own role requests
    const response = await fetch(`${apiBase}/role-requests/my-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to load user notifications:', response.status);
      notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
      return;
    }
    
    const data = await response.json();
    const myRequests = data.requests || [];
    
    // Get shown notification IDs from localStorage
    const shownNotifications = JSON.parse(localStorage.getItem('shownNotifications') || '[]');
    
    // Filter for approved/rejected requests that haven't been dismissed
    const processedRequests = myRequests.filter(req => {
      const reqId = req._id || req.id;
      return (req.status === 'approved' || req.status === 'rejected') && 
             !shownNotifications.includes(reqId);
    });
    
    if (processedRequests.length === 0) {
      notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
      
      // Update badge
      const notificationBadge = document.getElementById('notificationBadge');
      if (notificationBadge) {
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
      }
      return;
    }
    
    // Build notification items
    notificationList.innerHTML = processedRequests.map(request => {
      const requestId = request._id || request.id;
      let message, statusClass, icon;
      
      if (request.status === 'approved') {
        message = 'Faculty role request approved';
        statusClass = 'success';
        icon = '✓';
      } else {
        message = 'Faculty role request rejected';
        statusClass = 'error';
        icon = '✕';
      }
      
      const timeAgo = request.respondedAt ? getTimeAgo(request.respondedAt) : 
                      request.updatedAt ? getTimeAgo(request.updatedAt) : 'Recently';
      
      return `
        <div class="notification-item user-notification" data-notification-id="${requestId}">
          <div class="notification-user">
            <div class="notification-icon ${statusClass}">${icon}</div>
            <div class="notification-user-info">
              <div class="notification-user-name">${message}</div>
              <div class="notification-time">${timeAgo}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Update badge count
    const notificationBadge = document.getElementById('notificationBadge');
    if (notificationBadge) {
      notificationBadge.textContent = processedRequests.length;
      notificationBadge.style.display = 'block';
    }
    
    // Add click handlers to dismiss
    notificationList.querySelectorAll('.user-notification').forEach(item => {
      item.addEventListener('click', () => {
        const notificationId = item.dataset.notificationId;
        
        // Mark as shown
        const shown = JSON.parse(localStorage.getItem('shownNotifications') || '[]');
        if (!shown.includes(notificationId)) {
          shown.push(notificationId);
          localStorage.setItem('shownNotifications', JSON.stringify(shown));
        }
        
        item.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          item.remove();
          
          // Update badge
          const remaining = notificationList.querySelectorAll('.notification-item').length;
          if (notificationBadge) {
            notificationBadge.textContent = remaining;
            if (remaining === 0) {
              notificationBadge.style.display = 'none';
              notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
            }
          }
        }, 300);
      });
    });
  } catch (error) {
    console.error('Error loading user notifications:', error);
    notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
  }
}

// Load notifications for admin users
async function loadAdminNotifications(notificationList, token) {
  try {
    // Determine API base
    const stored = localStorage.getItem('apiBase');
    let apiBase = stored ? stored.replace(/\/$/, '') : null;
    if (!apiBase) {
      const { protocol, hostname } = window.location || {};
      if (hostname) {
        const proto = protocol || 'http:';
        apiBase = `${proto}//${hostname}:4000/api`;
      } else {
        apiBase = 'http://localhost:4000/api';
      }
    }
    
    const response = await fetch(`${apiBase}/role-requests?status=pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to load notifications');
      return;
    }
    
    const data = await response.json();
    const requests = data.requests || [];
    
    if (requests.length === 0) {
      notificationList.innerHTML = '<div class="notification-empty">No pending requests</div>';
      return;
    }
    
    // Build notification items
    notificationList.innerHTML = requests.map(request => {
      const user = request.userId || {};
      const avatarUrl = getUserAvatarUrl(user.avatarName || user.avatarSrc);
      const timeAgo = getTimeAgo(request.createdAt);
      
      // Use user.id if available, otherwise use user._id
      const userId = user.id || user._id;
      
      return `
        <div class="notification-item" data-user-id="${userId}" data-request-id="${request._id}">
          <div class="notification-user">
            <img src="${avatarUrl}" alt="${user.username}">
            <div class="notification-user-info">
              <div class="notification-user-name">${user.username || user.email}</div>
              <div class="notification-time">${timeAgo}</div>
            </div>
          </div>
          <div class="notification-reason">Pending Faculty Request</div>
        </div>
      `;
    }).join('');
    
    // Add click handlers to notification items
    notificationList.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const userId = item.dataset.userId;
        if (userId) {
          // Check current path to determine redirect
          const currentPath = window.location.pathname.toLowerCase();
          const isOnUserManagement = currentPath.includes('user-management.html');
          
          // Close notification dropdown
          const notificationDropdown = document.getElementById('notificationDropdown');
          if (notificationDropdown) {
            notificationDropdown.classList.remove('active');
          }
          
          // Clear notification badge
          const badge = document.querySelector('.notification-badge');
          if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
          }
          
          if (isOnUserManagement) {
            // Already on user management, zoom and highlight the card
            console.log('Looking for user card with ID:', userId);
            const userCard = document.querySelector(`.user-card[data-user-id="${userId}"]`);
            console.log('Found user card:', userCard);
            
            if (userCard) {
              // Collapse all cards first (keep them collapsed)
              document.querySelectorAll('.user-card').forEach(c => {
                c.classList.remove('expanded');
                c.style.animation = '';
              });
              
              // Smooth scroll to card
              userCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Small delay for scroll, then animate WITHOUT expanding
              setTimeout(() => {
                userCard.style.animation = 'zoomHighlight 1.5s ease-out';
              }, 300);
              
              // Remove animation after it completes
              setTimeout(() => {
                userCard.style.animation = '';
              }, 1800);
            } else {
              console.error('User card not found! Available cards:', 
                Array.from(document.querySelectorAll('.user-card')).map(c => c.dataset.userId)
              );
            }
          } else {
            // Store user ID and redirect to user management
            sessionStorage.setItem('filterUserId', userId);
            const isInAdminFolder = currentPath.includes('/admin/');
            const redirectPath = isInAdminFolder 
              ? 'user-management.html' 
              : 'admin/user-management.html';
            window.location.href = redirectPath;
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// Helper function to get avatar URL
function getUserAvatarUrl(avatarInfo) {
  // Determine the correct path based on location
  let basePath;
  try {
    const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
    if (p.includes('/src/html/lessons/')) {
      basePath = '../../../../assets/images/';
    } else if (p.includes('/src/html/admin/') || p.includes('/html/admin/')) {
      basePath = '../../../assets/images/';
    } else {
      basePath = '../../assets/images/';
    }
  } catch {
    basePath = '../../assets/images/';
  }
  
  const avatarMap = {
    'Sen': basePath + 'Sen.png',
    'Aldrick': basePath + 'Aldrick.png',
    'Maya': basePath + 'Maya.png',
    'Annette': basePath + 'Annette.png'
  };
  
  if (avatarInfo && avatarMap[avatarInfo]) {
    return avatarMap[avatarInfo];
  }
  
  return avatarInfo || (basePath + 'Sen.png');
}

// Helper function to format time ago
function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
