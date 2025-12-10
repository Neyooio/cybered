const INCLUDES_VERSION = '2025-12-10-v5-PRODUCTION-READY';
console.info('[includes.js] Script loaded and executing - VERSION:', INCLUDES_VERSION);

// Helper function to get API base URL
function getApiBase() {
  // Use global config if available
  if (window.API_BASE_URL) return window.API_BASE_URL + '/api';
  
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
}

// Run immediately if DOM is already ready, or wait for DOMContentLoaded
const initIncludes = async () => {
  console.info('[init] ===== Starting initialization =====');
  const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
  const isAdmin = p.includes('/src/html/admin/');
  
  console.debug('[init] Loading includes...');
  const includes = document.querySelectorAll('[data-include]');
  console.debug('[init] Found', includes.length, 'elements with data-include attribute');
  
  // Add loading class to prevent flash
  document.body.classList.add('loading-includes');
  
  await Promise.all(Array.from(includes).map(async host => {
    const url = host.getAttribute('data-include');
    const cacheBust = `${url}?v=${Date.now()}`;
    console.debug('[init] Fetching include:', cacheBust);
    try {
      const res = await fetch(cacheBust, { cache: 'no-store' });
      if (!res.ok) {
        console.error('[init] Include fetch failed:', url, 'Status:', res.status);
        return;
      }
      let html = await res.text();
      console.log('[init] ✅ Received HTML length:', html.length, 'for', url);
      
      // If we're in admin folder, fix asset paths in the HTML before inserting
      if (isAdmin && html.includes('../../assets/')) {
        html = html.replace(/\.\.\/\.\.\/assets\//g, '../../../assets/');
      }
      
      // Create a temp container to parse the HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Debug: log what we're about to insert
      console.log('[init] 🔍 Parsed HTML into', temp.children.length, 'child element(s)');
      if (url.includes('topbar')) {
        console.log('[init] 📌 TOPBAR CHILDREN:', Array.from(temp.children).map(c => ({
          tag: c.tagName,
          id: c.id,
          classes: c.className,
          hasDrawer: c.querySelector('#mobileDrawer') ? 'YES' : 'NO'
        })));
        // Check if mobileDrawer exists in the HTML
        const drawerInHTML = html.includes('id="mobileDrawer"');
        console.log('[init] 🎯 Does topbar.html contain mobileDrawer?', drawerInHTML);
      }
      
      // Insert all children from the temp container
      const parent = host.parentNode;
      const children = Array.from(temp.children);
      children.forEach(child => {
        parent.insertBefore(child, host);
      });
      
      // Remove the original placeholder
      host.remove();
      
      console.debug('[init] ✓ Loaded include:', url, '- Inserted', children.length, 'element(s)');
      
      // Verify topbar insertion
      if (url.includes('topbar')) {
        setTimeout(() => {
          console.debug('[init] Post-insert check: #mobileDrawer exists?', !!document.getElementById('mobileDrawer'));
        }, 50);
      }
    } catch (e) { 
      console.error('[init] Include failed:', url, e); 
    }
  }));
  console.info('[init] ===== All includes loaded =====');
  
  // Remove loading class to show navbar/sidenav
  document.body.classList.remove('loading-includes');

  resetModuleProgressOnReload();
  setActiveNav();
  restoreProfileBasics && restoreProfileBasics();
  fixAssetPaths && fixAssetPaths();
  forceUpdateAvatar && forceUpdateAvatar();
  
  // Show/hide space dropdown based on page
  checkSpaceDropdownVisibility();
  
  // Quick diagnostic after includes - with delay to ensure DOM is settled
  setTimeout(() => {
    try{
      const hbDiag = !!document.getElementById('hamburgerBtn');
      const drDiag = !!document.getElementById('mobileDrawer');
      console.debug('[init] post-includes existence: hamburgerBtn?', hbDiag, 'mobileDrawer?', drDiag);
    }catch(err){ console.error('[init] diagnostic error', err); }
  }, 50);
  
  // Wait a bit for DOM to settle, then check admin role and setup dropdown
  setTimeout(() => {
    checkAdminRole && checkAdminRole();
    setupAdminDropdown();
    setupMobileDrawer(); // Setup hamburger menu drawer
    setupSpaceButtons(); // Setup space navigation buttons
    updateNotificationBadge();
    setupNotificationDropdown();
    setupSpaceDropdowns(); // Setup space dropdowns after DOM is fully loaded
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
};

// Run immediately if DOM is already loaded, otherwise wait
if (document.readyState === 'loading') {
  console.info('[includes.js] Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initIncludes);
} else {
  console.info('[includes.js] DOM already loaded, running immediately');
  initIncludes();
}

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
      
      // Show Space button in sidebar for admin
      const spaceNavBtn = document.getElementById('spaceNavBtn');
      if (spaceNavBtn) {
        spaceNavBtn.style.display = '';
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

// Setup Space navigation buttons for all users
function setupSpaceButtons() {
  try {
    const spaceNavBtn = document.getElementById('spaceNavBtn');
    const drawerSpaceBtn = document.getElementById('drawerSpaceBtn');
    
    // Determine correct path based on current location
    const isInAdmin = window.location.pathname.includes('/admin/');
    const spacesPath = isInAdmin ? '../spaces.html' : 'spaces.html';
    
    if (spaceNavBtn) {
      // Add click handler to navigate to spaces page
      spaceNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = spacesPath;
      });
    }
    
    // Show and handle drawer space button
    if (drawerSpaceBtn) {
      const drawerSpaceLink = document.getElementById('drawerSpaceLink');
      if (drawerSpaceLink) {
        drawerSpaceLink.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = spacesPath;
        });
      }
    }
  } catch (e) {
    console.error('setupSpaceButtons error:', e);
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
      const toggleLink = document.getElementById('drawerAdminToggle');
      if (toggleLink) {
        // Remove existing listeners by cloning
        const newToggle = toggleLink.cloneNode(true);
        toggleLink.parentNode.replaceChild(newToggle, toggleLink);
        
        newToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          drawerAdminMenu.classList.toggle('expanded');
          
          // Update arrow direction
          const isExpanded = drawerAdminMenu.classList.contains('expanded');
          newToggle.querySelector('span').textContent = isExpanded ? 'Options ▼' : 'Options ▶';
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
  
  // Top bar logout button
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#logoutTopBtn');
    if (!btn) return;
    // Open confirmation dialog instead of immediate logout
    e.preventDefault();
    openLogoutConfirmation(logoutRedirectPath);
  });
  
  // Sidebar logout button
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#logoutSidebarBtn');
    if (!btn) return;
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

// Setup Mobile Drawer (Hamburger Menu)
function setupMobileDrawer() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('drawerOverlay');
  const panel = document.getElementById('drawerPanel');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const logoutBtn = document.getElementById('logoutMobileBtn');

  if (!hamburger || !overlay || !panel) {
    console.warn('[drawer] Elements not found:', { hamburger: !!hamburger, overlay: !!overlay, panel: !!panel });
    return;
  }

  console.info('[drawer] Setting up mobile drawer');

  // Sync profile info to drawer
  const syncProfile = () => {
    const topName = document.getElementById('topProfileName');
    const topAvatar = document.getElementById('topProfileAvatar');
    const drawerName = document.getElementById('drawerProfileName');
    const drawerAvatar = document.getElementById('drawerProfileAvatar');
    
    if (topName && drawerName) drawerName.textContent = topName.textContent;
    if (topAvatar && drawerAvatar) drawerAvatar.src = topAvatar.src;
  };

  // Open drawer
  const openDrawer = () => {
    syncProfile();
    overlay.setAttribute('aria-hidden', 'false');
    panel.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-open');
    
    // Hide chatbot when drawer opens
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotContainer) {
      chatbotContainer.style.display = 'none';
    }
    if (chatbotToggle) {
      chatbotToggle.style.display = 'none';
    }
    
    // Close space dropdown if open
    const spaceDropdownMenu = document.getElementById('topbarSpaceDropdownMenu');
    const spaceDropdownBtn = document.getElementById('topbarSpaceDropdownBtn');
    if (spaceDropdownMenu) {
      spaceDropdownMenu.classList.remove('show');
    }
    if (spaceDropdownBtn) {
      spaceDropdownBtn.classList.remove('active');
    }
  };

  // Close drawer
  const closeDrawer = () => {
    overlay.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-open');
    
    // Show chatbot when drawer closes
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotToggle) {
      chatbotToggle.style.display = 'flex';
    }
    // Don't auto-show chatbot container, let user toggle it
  };

  // Event listeners
  hamburger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const pathFn = () => {
        const p = (location.pathname || '').replace(/\\/g,'/').toLowerCase();
        if (p.includes('/src/html/lessons/')) return '../../register-form.html';
        if (p.includes('/src/html/admin/')) return '../register-form.html';
        return './register-form.html';
      };
      closeDrawer();
      if (typeof openLogoutConfirmation === 'function') {
        openLogoutConfirmation(pathFn);
      }
    });
  }

  // Show admin link if admin
  const role = localStorage.getItem('authRole');
  if (role === 'admin') {
    const adminLink = document.getElementById('adminLinkDrawer');
    if (adminLink) adminLink.style.display = 'list-item';
  }

  console.info('[drawer] Mobile drawer ready');
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

// Notification Badge System
async function updateNotificationBadge() {
  try {
    const role = localStorage.getItem('authRole');
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const apiBase = getApiBase();
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
      await fetchNotificationPreferences();
      
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
      
      // Count approved/rejected requests that haven't been dismissed, deleted, or marked as read
      count = myRequests.filter(req => {
        const reqId = req._id || req.id;
        return (req.status === 'approved' || req.status === 'rejected') && 
               !shownNotifications.includes(reqId) &&
               !userNotificationPreferences.deletedNotifications.includes(reqId) &&
               !userNotificationPreferences.readNotifications.includes(reqId);
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

// Notification Management Functions
let userNotificationPreferences = {
  deletedNotifications: [],
  readNotifications: []
};

// Fetch user notification preferences from backend
async function fetchNotificationPreferences() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const apiBase = getApiBase();
    const response = await fetch(`${apiBase}/auth/notifications/preferences`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      userNotificationPreferences = data;
    }
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
  }
}

// Delete a notification
async function deleteNotification(notificationId) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    const apiBase = getApiBase();
    const response = await fetch(`${apiBase}/auth/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      userNotificationPreferences.deletedNotifications = data.deletedNotifications || [];
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    const apiBase = getApiBase();
    const response = await fetch(`${apiBase}/auth/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      userNotificationPreferences.readNotifications = data.readNotifications || [];
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// Mark all notifications as read
async function markAllNotificationsAsRead(notificationIds) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    const apiBase = getApiBase();
    const response = await fetch(`${apiBase}/auth/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notificationIds })
    });
    
    if (response.ok) {
      const data = await response.json();
      userNotificationPreferences.readNotifications = data.readNotifications || [];
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error marking all as read:', error);
    return false;
  }
}

// Notification Dropdown System
async function setupNotificationDropdown() {
  try {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const closeNotificationsBtn = document.getElementById('closeNotifications');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    
    if (!notificationBtn || !notificationDropdown) return;
    
    // Load badge count and preferences on page load
    await fetchNotificationPreferences();
    updateNotificationBadge();
    
    // Mark all as read button
    markAllReadBtn?.addEventListener('click', async (e) => {
      e.stopPropagation();
      const notificationItems = document.querySelectorAll('.notification-item[data-notification-id]');
      const notificationIds = Array.from(notificationItems).map(item => item.dataset.notificationId);
      
      if (notificationIds.length === 0) return;
      
      const success = await markAllNotificationsAsRead(notificationIds);
      if (success) {
        // Update UI - mark all as read
        notificationItems.forEach(item => {
          item.classList.add('read');
        });
        markAllReadBtn.style.display = 'none';
        
        // Update badge to reflect all marked as read
        await updateNotificationBadge();
      }
    });
    
    // Toggle dropdown
    notificationBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const isShowing = notificationDropdown.classList.contains('show');
      
      if (!isShowing) {
        // Load notifications before showing
        await fetchNotificationPreferences();
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
    const apiBase = getApiBase();
    
    // Fetch user preferences first
    await fetchNotificationPreferences();
    
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
    
    // Filter for approved/rejected requests that haven't been dismissed or deleted
    const processedRequests = myRequests.filter(req => {
      const reqId = req._id || req.id;
      return (req.status === 'approved' || req.status === 'rejected') && 
             !shownNotifications.includes(reqId) &&
             !userNotificationPreferences.deletedNotifications.includes(reqId);
    });
    
    if (processedRequests.length === 0) {
      notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
      
      // Update badge and hide mark all button
      const notificationBadge = document.getElementById('notificationBadge');
      const markAllReadBtn = document.getElementById('markAllReadBtn');
      if (notificationBadge) {
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
      }
      if (markAllReadBtn) {
        markAllReadBtn.style.display = 'none';
      }
      return;
    }
    
    // Build notification items
    notificationList.innerHTML = processedRequests.map(request => {
      const requestId = request._id || request.id;
      const isRead = userNotificationPreferences.readNotifications.includes(requestId);
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
        <div class="notification-item user-notification ${isRead ? 'read' : ''}" data-notification-id="${requestId}">
          <button class="notification-menu-btn" data-menu-id="menu-${requestId}" onclick="event.stopPropagation()">⋮</button>
          <div class="notification-menu" id="menu-${requestId}">
            <button class="notification-menu-item mark-read" data-action="mark-read">Mark as read</button>
            <button class="notification-menu-item delete" data-action="delete">Delete</button>
          </div>
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
    
    // Update badge count and show mark all button if there are unread
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const unreadCount = processedRequests.filter(req => 
      !userNotificationPreferences.readNotifications.includes(req._id || req.id)
    ).length;
    
    if (notificationBadge) {
      notificationBadge.textContent = unreadCount;
      notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    if (markAllReadBtn) {
      markAllReadBtn.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    // Add event handlers for notification items
    setupNotificationItemHandlers(notificationList);
    
  } catch (error) {
    console.error('Error loading user notifications:', error);
    notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
  }
}

// Setup notification item event handlers
function setupNotificationItemHandlers(notificationList) {
  console.log('Setting up notification handlers...');
  
  // Click on notification item (not on menu button)
  notificationList.querySelectorAll('.notification-item').forEach(notificationItem => {
    const notificationUser = notificationItem.querySelector('.notification-user');
    if (notificationUser) {
      notificationUser.addEventListener('click', (e) => {
        // Don't trigger if clicking on menu button
        if (e.target.closest('.notification-menu-btn') || e.target.closest('.notification-menu')) {
          return;
        }
        
        // Navigate to profile page for role request notifications
        window.location.href = 'profile.html';
      });
      
      // Make it look clickable
      notificationUser.style.cursor = 'pointer';
    }
  });
  
  // Three-dot menu toggle
  const menuButtons = notificationList.querySelectorAll('.notification-menu-btn');
  console.log('Found menu buttons:', menuButtons.length);
  
  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Menu button clicked');
      const menuId = btn.dataset.menuId;
      const menu = document.getElementById(menuId);
      console.log('Menu ID:', menuId, 'Menu element:', menu);
      
      // Close all other menus
      document.querySelectorAll('.notification-menu.show').forEach(m => {
        if (m.id !== menuId) m.classList.remove('show');
      });
      
      // Toggle this menu
      menu?.classList.toggle('show');
    });
  });
  
  // Menu item actions
  const menuItems = notificationList.querySelectorAll('.notification-menu-item');
  console.log('Found menu items:', menuItems.length);
  
  menuItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      const menu = item.closest('.notification-menu');
      const notificationItem = item.closest('.notification-item');
      const notificationId = notificationItem?.dataset.notificationId;
      
      if (!notificationId) {
        console.error('No notification ID found');
        return;
      }
      
      console.log('Notification action:', action, 'ID:', notificationId);
      
      menu?.classList.remove('show');
      
      if (action === 'delete') {
        console.log('Deleting notification:', notificationId);
        const success = await deleteNotification(notificationId);
        console.log('Delete success:', success);
        if (success) {
          notificationItem.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(async () => {
            notificationItem.remove();
            
            // Update badge to reflect deletion
            await updateNotificationBadge();
            
            // Check if list is empty
            const remaining = notificationList.querySelectorAll('.notification-item').length;
            if (remaining === 0) {
              notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
              const markAllReadBtn = document.getElementById('markAllReadBtn');
              if (markAllReadBtn) markAllReadBtn.style.display = 'none';
            }
          }, 300);
        } else {
          console.error('Failed to delete notification');
        }
      } else if (action === 'mark-read') {
        console.log('Marking as read:', notificationId);
        const success = await markNotificationAsRead(notificationId);
        console.log('Mark as read success:', success);
        if (success) {
          notificationItem.classList.add('read');
          
          // Update badge immediately to reflect read status
          await updateNotificationBadge();
          
          // Hide mark all button if all are read
          const unread = notificationList.querySelectorAll('.notification-item:not(.read)').length;
          const markAllReadBtn = document.getElementById('markAllReadBtn');
          if (markAllReadBtn && unread === 0) {
            markAllReadBtn.style.display = 'none';
          }
        } else {
          console.error('Failed to mark notification as read');
        }
      }
    });
  });
  
  // Click anywhere else to close menus
  document.addEventListener('click', () => {
    document.querySelectorAll('.notification-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });
  });
}

// Load notifications for admin users
async function loadAdminNotifications(notificationList, token) {
  try {
    const apiBase = getApiBase();
    
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

// Show/hide space dropdown based on current page
function checkSpaceDropdownVisibility() {
  try {
    const currentPath = window.location.pathname.toLowerCase();
    const isModulesPage = currentPath.includes('modules.html');
    
    // Show topbar space dropdown on all pages
    const topbarSpaceDropdown = document.getElementById('topbarSpaceDropdown');
    if (topbarSpaceDropdown) {
      topbarSpaceDropdown.style.display = 'block'; // Always show
    }
    
    // Show drawer space item on all pages
    const drawerSpaceItem = document.getElementById('drawerSpaceItem');
    if (drawerSpaceItem) {
      drawerSpaceItem.style.display = 'block'; // Always show
    }
    
    // Load spaces if not on modules page (modules page loads its own)
    if (!isModulesPage) {
      loadSpacesForNav();
    }
  } catch (error) {
    console.error('Error checking space dropdown visibility:', error);
  }
}

// Load spaces for navigation dropdowns (non-modules pages)
async function loadSpacesForNav() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const userRole = localStorage.getItem('authRole');
    const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';
    
    const apiBase = getApiBase();
    
    const endpoint = isFacultyOrAdmin 
      ? `${apiBase}/faculty-modules/my-spaces`
      : `${apiBase}/faculty-modules/enrolled`;
    
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return;
    
    const data = await response.json();
    const userSpaces = data.spaces || [];
    
    // Populate topbar dropdown
    const topbarDropdownMenu = document.getElementById('topbarSpaceDropdownMenu');
    if (topbarDropdownMenu) {
      populateSpaceDropdown(topbarDropdownMenu, userSpaces, true);
    }
    
    // Populate drawer dropdown
    const drawerSpaceMenu = document.getElementById('drawerSpaceMenu');
    if (drawerSpaceMenu) {
      populateDrawerSpaces(drawerSpaceMenu, userSpaces);
    }
  } catch (error) {
    console.error('Error loading spaces for nav:', error);
  }
}

// Populate space dropdown menu
function populateSpaceDropdown(menuElement, spaces, isTopbar) {
  const spaceItems = spaces.map(space => `
    <button class="space-dropdown-item" onclick="window.location.href='faculty-space.html?id=${space._id}'">
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/>
      </svg>
      <span>${space.name}</span>
    </button>
  `).join('');
  
  menuElement.innerHTML = `
    <button class="space-dropdown-item active" onclick="window.location.href='modules.html'">
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
      </svg>
      <span>All Modules</span>
    </button>
    ${spaceItems}
  `;
}

// Populate drawer space menu
function populateDrawerSpaces(menuElement, spaces) {
  const spaceItems = spaces.map(space => `
    <li><a href="faculty-space.html?id=${space._id}" class="drawer-link">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/>
      </svg>
      <span>${space.name}</span>
    </a></li>
  `).join('');
  
  menuElement.innerHTML = `
    <li><a href="modules.html" class="drawer-link">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
      </svg>
      <span>All Modules</span>
    </a></li>
    ${spaceItems}
  `;
}

// Setup space dropdown handlers
function setupSpaceDropdowns() {
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
      e.preventDefault();
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
}
