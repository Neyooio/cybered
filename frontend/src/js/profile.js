// Helper function to get API base URL
function getApiBase() {
	const stored = localStorage.getItem('apiBase');
	if (stored) return stored.replace(/\/$/, '');
	
	const { protocol, hostname } = window.location || {};
	if (hostname) {
		// Production environment (Netlify)
		if (hostname.includes('netlify.app')) {
			return 'https://cybered-backend.onrender.com/api';
		}
		// Local development
		if (hostname === 'localhost' || hostname === '127.0.0.1') {
			return 'http://localhost:4000/api';
		}
		// Network access
		return `${protocol || 'http:'}//${hostname}:4000/api`;
	}
	return 'http://localhost:4000/api';
}

// Refresh token to get updated role
async function refreshAuthToken() {
	try {
		const token = localStorage.getItem('authToken');
		if (!token) return false;
		
		const response = await fetch(`${getApiBase()}/auth/refresh-token`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		
		if (!response.ok) return false;
		
		const data = await response.json();
		if (data.token && data.user) {
			// Update localStorage with new token and user data
			localStorage.setItem('authToken', data.token);
			localStorage.setItem('authRole', data.user.role);
			if (data.user.username) localStorage.setItem('cyberedUserName', data.user.username);
			if (data.user.email) localStorage.setItem('cyberedUserEmail', data.user.email);
			
			console.log('✅ Token refreshed - Role updated to:', data.user.role);
			return true;
		}
		return false;
	} catch (error) {
		console.error('❌ Failed to refresh token:', error);
		return false;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Refresh token on page load to ensure role is up-to-date
	refreshAuthToken().then(() => {
		// Check for role request notifications first
		checkRoleRequestNotification();
		
		// Wait for includes to load, then check if admin is viewing
		setTimeout(() => {
			checkAdminViewing();
		}, 100);
		
		// Fetch and display user information, then initialize role request
		fetchUserProfile().then(() => {
			// Initialize role request handlers after profile is loaded
			setTimeout(() => {
				initializeRoleRequest();
				updateRoleRequestButton();
			}, 300);
		}).catch(() => {
			// Even if fetch fails, try to initialize based on localStorage
			setTimeout(() => {
				initializeRoleRequest();
				updateRoleRequestButton();
			}, 300);
		});
	});

	const swapBtn = document.getElementById('swapAvatarBtn');
	const overlay = document.getElementById('profileAvatarOverlay');
	const grid = document.getElementById('profileAvatarGrid');
	const saveBtn = document.getElementById('profileAvatarSaveBtn');
	const profileAvatarImg = document.getElementById('profileAvatar');

	let selected = null;

	function openOverlay(){ overlay.classList.remove('hidden'); selected = null; updateSaveState(); clearSelections(); }
	function closeOverlay(){ overlay.classList.add('hidden'); }
	function clearSelections(){ grid?.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('is-selected')); }
	function updateSaveState(){ if (saveBtn) saveBtn.disabled = !selected; }

	swapBtn?.addEventListener('click', () => {
		// tap animation: rotate the icon
		swapBtn.classList.remove('spin-once');
		void swapBtn.offsetWidth; // reflow to restart animation
		swapBtn.classList.add('spin-once');
		openOverlay();
	});

	if (grid){
		grid.addEventListener('click', (e) => {
			const btn = e.target.closest('.avatar-option');
			if (!btn) return;
			// toggle selection
			if (btn.classList.contains('is-selected')){
				btn.classList.remove('is-selected'); selected = null; updateSaveState(); return;
			}
			clearSelections();
			btn.classList.add('is-selected');
			selected = { id: btn.dataset.id, src: btn.dataset.src, name: btn.dataset.name };
			updateSaveState();
		});
		grid.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			const btn = e.target.closest('.avatar-option');
			if (btn){ e.preventDefault(); btn.click(); }
		});
	}

	saveBtn?.addEventListener('click', async () => {
		if (!selected) return;
		try{
			localStorage.setItem('cyberedAvatarId', selected.id);
			localStorage.setItem('cyberedAvatarSrc', selected.src);
			localStorage.setItem('cyberedAvatarName', selected.name || '');
		}catch{}

		// Update images on this page immediately
		if (profileAvatarImg) profileAvatarImg.src = selected.src;
		const topAvatar = document.getElementById('topProfileAvatar');
		if (topAvatar) topAvatar.src = selected.src;

		// Save to backend and wait for completion
		const success = await saveAvatarToBackend(selected);
		
		if (success) {
			console.log('Avatar saved successfully:', selected.name);
		}

		closeOverlay();
	});

		// Close when clicking backdrop (not the card)
		overlay?.addEventListener('click', (e) => {
			if (e.target === overlay) closeOverlay();
		});

	// Close with Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')){
			e.preventDefault();
			closeOverlay();
		}
	});
});

// Save avatar to backend
async function saveAvatarToBackend(avatarData) {
	try {
		const token = localStorage.getItem('authToken');
		if (!token) {
			console.error('No auth token found');
			return false;
		}
		
		// Get user ID from token payload
		const payload = JSON.parse(atob(token.split('.')[1]));
		const userId = payload.sub;
		
		const apiBase = getApiBase();
		
		console.log('Saving avatar to backend:', {
			userId,
			avatarName: avatarData.name,
			avatarSrc: avatarData.src,
			apiUrl: `${apiBase}/users/${userId}/avatar`
		});
		
		const response = await fetch(`${apiBase}/users/${userId}/avatar`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				avatarSrc: avatarData.src,
				avatarName: avatarData.name,
				avatar: avatarData.src
			})
		});
		
		if (!response.ok) {
			const error = await response.json();
			console.error('Failed to save avatar:', error);
			return false;
		}
		
		const result = await response.json();
		console.log('Avatar saved successfully:', result);
		return true;
	} catch (err) {
		console.error('Failed to save avatar to backend:', err);
		return false;
	}
}

// Check if admin is viewing another user's profile
function checkAdminViewing() {
	try {
		const isAdminViewing = sessionStorage.getItem('isAdminViewing');
		const viewingUserData = sessionStorage.getItem('viewingUserData');
		
		if (isAdminViewing === 'true' && viewingUserData) {
			// Wait a bit more to ensure topbar is loaded
			setTimeout(() => {
				// Hide the topbar when viewing another user's profile
				const topPanel = document.querySelector('.top-panel');
				if (topPanel) {
					topPanel.style.display = 'none';
				}
			}, 200);
			
			// Add a banner to indicate viewing another user's profile
			const main = document.querySelector('.main-wrapper') || document.querySelector('main');
			if (main) {
				const banner = document.createElement('div');
				banner.style.cssText = 'background: rgba(249,115,22,.15); border: 2px solid var(--orange-500); padding: 1rem; margin: 1rem; border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center;';
				banner.innerHTML = `
					<div style="color: var(--orange-400); font-weight: 600;">
						Viewing another user's profile
					</div>
					<button id="backToUserManagement" style="padding: 0.5rem 1rem; background: var(--orange-500); color: var(--black); border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
						← Back to User Management
					</button>
				`;
				main.insertBefore(banner, main.firstChild);
				
				document.getElementById('backToUserManagement')?.addEventListener('click', () => {
					sessionStorage.removeItem('isAdminViewing');
					sessionStorage.removeItem('viewingUserData');
					sessionStorage.removeItem('viewingUserId');
					window.location.href = 'admin/user-management.html';
				});
			}
			
			// Hide avatar swap button when viewing another user
			const swapBtn = document.getElementById('swapAvatarBtn');
			if (swapBtn) swapBtn.style.display = 'none';
		}
	} catch(e) {
		console.error('Error checking admin viewing:', e);
	}
}

// Fetch user profile data from backend
async function fetchUserProfile() {
	try {
		// Check if admin is viewing another user's profile
		const isAdminViewing = sessionStorage.getItem('isAdminViewing');
		const viewingUserData = sessionStorage.getItem('viewingUserData');
		
		if (isAdminViewing === 'true' && viewingUserData) {
			// Load the viewed user's data
			const userData = JSON.parse(viewingUserData);
			updateProfileUI(userData);
			return;
		}
		
		// First, check localStorage for role
		let storedRole = localStorage.getItem('authRole');
		
		// If no role in localStorage, try to decode from token
		const token = localStorage.getItem('authToken') || localStorage.getItem('token');
		if (token && !storedRole) {
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				if (payload.role) {
					storedRole = payload.role;
					localStorage.setItem('authRole', storedRole);
					console.log('Extracted role from token:', storedRole);
				}
			} catch (e) {
				console.error('Failed to decode token:', e);
			}
		}
		
		if (!token) {
			console.warn('No token found');
			// If no token but we have role in localStorage, use it
			if (storedRole) {
				updateProfileUI({ role: storedRole });
			}
			return;
		}

		const apiBase = getApiBase();
		const response = await fetch(`${apiBase}/auth/profile`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch profile');
		}

		const data = await response.json();
		// Merge with localStorage role if backend doesn't provide it
		if (!data.role && storedRole) {
			data.role = storedRole;
		}
		// Save role to localStorage for future use
		if (data.role) {
			localStorage.setItem('authRole', data.role);
		}
		updateProfileUI(data);
	} catch (error) {
		console.error('Error fetching profile:', error);
		// If fetch fails, try to use localStorage role
		const storedRole = localStorage.getItem('authRole');
		if (storedRole) {
			updateProfileUI({ role: storedRole });
		}
	}
}

// Update the profile UI with user data
function updateProfileUI(userData) {
	// Ensure we have userData object
	if (!userData) userData = {};
	
	// Check if we're viewing another user's profile
	const isAdminViewing = sessionStorage.getItem('isAdminViewing') === 'true';
	
	// Always check localStorage for role if not in userData (only for own profile)
	if (!userData.role && !isAdminViewing) {
		userData.role = localStorage.getItem('authRole') || 'user';
	}
	
	// Update username - don't use localStorage when viewing another user
	const profileNameEl = document.getElementById('profileName');
	if (profileNameEl) {
		if (isAdminViewing) {
			// Use only the userData when viewing another user
			profileNameEl.textContent = userData.username || userData.email || 'User';
		} else {
			// For own profile, try localStorage first, then userData
			const localUsername = localStorage.getItem('cyberedUserName');
			const localEmail = localStorage.getItem('cyberedUserEmail');
			profileNameEl.textContent = userData.username || localUsername || 
				(localEmail ? localEmail.split('@')[0] : 'User');
		}
	}

	// Update email if present
	const profileEmailEl = document.getElementById('profileEmail');
	if (profileEmailEl && userData.email) {
		profileEmailEl.textContent = userData.email;
	}

	// Update role badge
	const profileRoleEl = document.getElementById('profileRole');
	const roleTextEl = profileRoleEl?.querySelector('.role-text');
	if (profileRoleEl && userData.role) {
		const role = userData.role.toLowerCase();
		
		// Remove existing role classes
		profileRoleEl.classList.remove('role-user', 'role-faculty', 'role-admin');
		
		// Add appropriate role class
		if (role === 'admin') {
			profileRoleEl.classList.add('role-admin');
			if (roleTextEl) roleTextEl.textContent = 'Admin';
		} else if (role === 'faculty') {
			profileRoleEl.classList.add('role-faculty');
			if (roleTextEl) roleTextEl.textContent = 'Faculty';
		} else {
			// For 'user' role, display as 'Student'
			if (roleTextEl) roleTextEl.textContent = 'Student';
		}
	}
	
	// Update avatar if available
	const profileAvatarImg = document.getElementById('profileAvatar');
	if (profileAvatarImg) {
		const avatarMap = {
			'Sen': 'https://i.ibb.co/2W0DdZm/avatar1.png',
			'Aldrick': 'https://i.ibb.co/5Fsb0CQ/avatar2.png',
			'Maya': 'https://i.ibb.co/0hZk0hh/avatar3.png',
			'Annette': 'https://i.ibb.co/0rp25M5/avatar4.png'
	};
	
	if (isAdminViewing) {
		// Use only userData when viewing another user
		const avatarUrl = userData.avatarSrc || userData.avatar || 
			(userData.avatarName ? avatarMap[userData.avatarName] : '') ||
			'https://i.ibb.co/c1g1kkh/pixel-avatar.png';
		profileAvatarImg.src = avatarUrl;
	} else {
		// For own profile, prioritize database over localStorage
		const avatarUrl = userData.avatarSrc || userData.avatar || 
			(userData.avatarName ? avatarMap[userData.avatarName] : '') ||
			localStorage.getItem('cyberedAvatarSrc') ||
			(localStorage.getItem('cyberedAvatarName') ? avatarMap[localStorage.getItem('cyberedAvatarName')] : '') ||
			'https://i.ibb.co/c1g1kkh/pixel-avatar.png';
		profileAvatarImg.src = avatarUrl;
		
		// Sync localStorage with database value
		if (userData.avatarSrc) {
			localStorage.setItem('cyberedAvatarSrc', userData.avatarSrc);
		}
		if (userData.avatarName) {
			localStorage.setItem('cyberedAvatarName', userData.avatarName);
		}
	}
}	// Update XP if available
	if (userData.xp !== undefined) {
		const xpLabel = document.getElementById('xpLabel');
		const xpProgress = document.getElementById('xpProgress');
		const maxXP = 10000; // You can adjust this or get it from backend
		
		if (xpLabel) {
			xpLabel.textContent = `${userData.xp} / ${maxXP} XP`;
		}
		
		if (xpProgress) {
			const percentage = (userData.xp / maxXP) * 100;
			xpProgress.style.width = `${percentage}%`;
		}
	}

	// Update rank if available
	if (userData.rank) {
		const rankEl = document.getElementById('rank');
		if (rankEl) {
			rankEl.textContent = userData.rank;
		}
	}

	// Update plant streak
	updatePlantStreak(userData.streak || 0);
	
	// Update role request button visibility
	updateRoleRequestButton();
}

// Plant Streak System
function updatePlantStreak(streakDays) {
	const streakValueEl = document.getElementById('streakValue');
	const streakPlantImg = document.getElementById('streakPlantImg');
	
	if (streakValueEl) {
		streakValueEl.textContent = `${streakDays} Days`;
	}
	
	if (streakPlantImg) {
		const plantImage = getPlantImage(streakDays);
		streakPlantImg.src = plantImage;
	}
}

function getPlantImage(days) {
	const basePath = '../../assets/images/Tree_Streak/';
	
	// 150+ days: Prismatic tree
	if (days >= 150) {
		return basePath + 'Prismatic_tree.png';
	}
	
	// 100-149 days: Random colored tree (Yellow, Purple, Red)
	if (days >= 100) {
		const colorTrees = ['Yellow_tree.png', 'Purple_tree.png', 'Red_tree.png'];
		// Use modulo to get consistent random but deterministic selection based on day count
		const index = Math.floor(days / 10) % colorTrees.length;
		return basePath + colorTrees[index];
	}
	
	// 80-99 days: tree5
	if (days >= 80) {
		return basePath + 'tree5.png';
	}
	
	// 60-79 days: tree4
	if (days >= 60) {
		return basePath + 'tree4.png';
	}
	
	// 40-59 days: tree3
	if (days >= 40) {
		return basePath + 'tree3.png';
	}
	
	// 20-39 days: tree2
	if (days >= 20) {
		return basePath + 'tree2.png';
	}
	
	// 10-19 days: tree1
	if (days >= 10) {
		return basePath + 'tree1.png';
	}
	
	// 0-9 days: tree1 (starting plant)
	return basePath + 'tree1.png';
}

// Initialize streak from localStorage or set to 0
function initializeStreak() {
	const savedStreak = localStorage.getItem('userStreak');
	const streak = savedStreak ? parseInt(savedStreak, 10) : 0;
	updatePlantStreak(streak);
}

// Call on page load
initializeStreak();

// Debug function to test different streak values (can be called from console)
window.testStreak = function(days) {
	localStorage.setItem('userStreak', days);
	updatePlantStreak(days);
	console.log(`Streak set to ${days} days. Plant image:`, getPlantImage(days));
};

// Role Request System
function updateRoleRequestButton() {
	const profileRoleBadge = document.getElementById('profileRole');
	if (!profileRoleBadge) return;
	
	// Check if we're viewing another user's profile
	const isAdminViewing = sessionStorage.getItem('isAdminViewing') === 'true';
	if (isAdminViewing) {
		profileRoleBadge.classList.remove('clickable');
		profileRoleBadge.style.cursor = 'default';
		profileRoleBadge.title = '';
		return;
	}
	
	// Make role badge clickable for users with 'user' role
	const storedRole = localStorage.getItem('authRole');
	
	if (storedRole && storedRole.toLowerCase() === 'user') {
		profileRoleBadge.classList.add('clickable');
		profileRoleBadge.style.cursor = 'pointer';
		profileRoleBadge.title = 'Click to request Faculty role';
	} else {
		profileRoleBadge.classList.remove('clickable');
		profileRoleBadge.style.cursor = 'default';
		profileRoleBadge.title = '';
	}
}

function initializeRoleRequest() {
	const profileRoleBadge = document.getElementById('profileRole');
	const overlay = document.getElementById('roleRequestOverlay');
	const closeBtn = document.getElementById('closeRoleRequest');
	const cancelBtn = document.getElementById('cancelRoleRequest');
	const submitBtn = document.getElementById('submitRoleRequest');
	const form = document.getElementById('roleRequestForm');
	const reasonTextarea = document.getElementById('requestReason');
	
	// Update badge clickability
	updateRoleRequestButton();
	
	// Open modal when clicking the role badge (if user role)
	profileRoleBadge?.addEventListener('click', () => {
		const storedRole = localStorage.getItem('authRole');
		const isAdminViewing = sessionStorage.getItem('isAdminViewing') === 'true';
		
		// Only open for user role and not when admin is viewing
		if (storedRole && storedRole.toLowerCase() === 'user' && !isAdminViewing) {
			overlay?.classList.remove('hidden');
			if (reasonTextarea) reasonTextarea.value = '';
		}
	});
	
	// Close modal functions
	const closeModal = () => {
		overlay?.classList.add('hidden');
	};
	
	closeBtn?.addEventListener('click', closeModal);
	cancelBtn?.addEventListener('click', closeModal);
	
	// Close when clicking backdrop
	overlay?.addEventListener('click', (e) => {
		if (e.target === overlay) closeModal();
	});
	
	// Close with Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
			e.preventDefault();
			closeModal();
		}
	});
	
	// Handle form submission
	form?.addEventListener('submit', async (e) => {
		e.preventDefault();
		
		const reason = reasonTextarea.value.trim();
		if (!reason) {
			showRequestNotification('Please provide a reason for your request.', 'error');
			return;
		}
		
		if (reason.length < 20) {
			showRequestNotification('Please provide a more detailed reason (at least 20 characters).', 'error');
			return;
		}
		
		// Disable submit button
		submitBtn.disabled = true;
		submitBtn.textContent = 'Submitting...';
		
		try {
			const success = await submitRoleRequest(reason);
			
			if (success) {
				showRequestNotification('Your faculty role request has been submitted successfully! An admin will review it soon.', 'success');
				closeModal();
				// Remove clickable class after successful submission
				const profileRoleBadge = document.getElementById('profileRole');
				if (profileRoleBadge) {
					profileRoleBadge.classList.remove('clickable');
					profileRoleBadge.style.cursor = 'default';
					profileRoleBadge.title = '';
				}
			} else {
				showRequestNotification('Failed to submit role request. You may already have a pending request.', 'error');
			}
		} catch (error) {
			console.error('Error submitting role request:', error);
			showRequestNotification('An error occurred. Please try again later.', 'error');
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Submit Request';
		}
	});
}

// Show styled notification
function showRequestNotification(message, type = 'success') {
	// Remove any existing notification
	const existing = document.querySelector('.request-notification');
	if (existing) {
		existing.remove();
	}
	
	// Create notification element
	const notification = document.createElement('div');
	notification.className = 'request-notification';
	
	const icon = type === 'success' ? '✓' : '✕';
	const title = type === 'success' ? 'Success!' : 'Error';
	
	notification.innerHTML = `
		<div class="request-notification-header">
			<div class="request-notification-icon ${type}">${icon}</div>
			<h3 class="request-notification-title">${title}</h3>
		</div>
		<p class="request-notification-message">${message}</p>
		<button class="request-notification-button">Got it</button>
	`;
	
	document.body.appendChild(notification);
	
	// Close on button click
	const closeBtn = notification.querySelector('.request-notification-button');
	closeBtn.addEventListener('click', () => {
		notification.classList.add('slide-out');
		setTimeout(() => notification.remove(), 300);
	});
	
	// Auto-close after 5 seconds
	setTimeout(() => {
		if (document.body.contains(notification)) {
			notification.classList.add('slide-out');
			setTimeout(() => notification.remove(), 300);
		}
	}, 5000);
}

// Submit role request to backend
async function submitRoleRequest(reason) {
	try {
		const token = localStorage.getItem('authToken');
		if (!token) {
			console.error('No auth token found');
			return false;
		}
		
		const apiBase = getApiBase();
		
		const response = await fetch(`${apiBase}/role-requests`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				requestedRole: 'faculty',
				reason: reason
			})
		});
		
		if (!response.ok) {
			const error = await response.json();
			console.error('Failed to submit role request:', error);
			return false;
		}
		
		const result = await response.json();
		console.log('Role request submitted successfully:', result);
		return true;
	} catch (err) {
		console.error('Failed to submit role request:', err);
		return false;
	}
}

// Check for role request notification (approved/rejected)
async function checkRoleRequestNotification() {
	try {
		const token = localStorage.getItem('authToken');
		if (!token) return;
		
		const apiBase = getApiBase();
		
		// Check if we've already shown notification for this session
		const shownNotification = sessionStorage.getItem('roleRequestNotificationShown');
		if (shownNotification) return;
		
		const response = await fetch(`${apiBase}/role-requests`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		
		if (!response.ok) return;
		
		const data = await response.json();
		const myRequests = data.requests || [];
		
		// Find the most recent approved or rejected request that hasn't been seen
		const processedRequest = myRequests.find(req => 
			(req.status === 'approved' || req.status === 'rejected')
		);
		
		if (processedRequest) {
			// Add notification to the bell
			setTimeout(() => {
				addUserNotification(processedRequest);
				
				// Mark as shown for this session
				sessionStorage.setItem('roleRequestNotificationShown', 'true');
			}, 1000);
		}
	} catch (err) {
		console.error('Failed to check role request notification:', err);
	}
}

// Add notification to user's notification bell
function addUserNotification(request) {
	const notificationList = document.getElementById('notificationList');
	const notificationBadge = document.getElementById('notificationBadge');
	
	if (!notificationList) return;
	
	// Remove "No pending requests" message if present
	const emptyMessage = notificationList.querySelector('.notification-empty');
	if (emptyMessage) {
		emptyMessage.remove();
	}
	
	// Create notification item
	const notificationItem = document.createElement('div');
	notificationItem.className = 'notification-item user-notification';
	
	let message, statusClass;
	if (request.status === 'approved') {
		message = 'Your faculty role request has been approved! 🎉';
		statusClass = 'success';
	} else {
		message = 'Your faculty role request has been rejected.';
		statusClass = 'error';
	}
	
	notificationItem.innerHTML = `
		<div class="notification-user">
			<div class="notification-icon ${statusClass}">
				${request.status === 'approved' ? '✓' : '✕'}
			</div>
			<div class="notification-user-info">
				<div class="notification-user-name">${message}</div>
				<div class="notification-time">Just now</div>
			</div>
		</div>
	`;
	
	// Add to top of list
	notificationList.insertBefore(notificationItem, notificationList.firstChild);
	
	// Update badge
	if (notificationBadge) {
		const currentCount = parseInt(notificationBadge.textContent) || 0;
		const newCount = currentCount + 1;
		notificationBadge.textContent = newCount;
		notificationBadge.style.display = 'block';
	}
	
	// Add click handler to dismiss
	notificationItem.addEventListener('click', () => {
		notificationItem.style.animation = 'slideOut 0.3s ease-in';
		setTimeout(() => {
			notificationItem.remove();
			
			// Update badge
			if (notificationBadge) {
				const currentCount = parseInt(notificationBadge.textContent) || 0;
				const newCount = Math.max(0, currentCount - 1);
				notificationBadge.textContent = newCount;
				if (newCount === 0) {
					notificationBadge.style.display = 'none';
					// Add back empty message if no notifications
					if (notificationList.children.length === 0) {
						notificationList.innerHTML = '<div class="notification-empty">No pending requests</div>';
					}
				}
			}
		}, 300);
	});
}
