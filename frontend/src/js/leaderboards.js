// Leaderboards Page JavaScript
console.log('[leaderboards.js] Loading...');

let currentGame = 'cyber-runner';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[leaderboards.js] DOM Content Loaded');
  
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    window.location.href = 'register-form.html';
    return;
  }
  
  // Initialize game tabs
  initializeGameTabs();
  
  // Load initial leaderboard
  await loadLeaderboard(currentGame);
});

// Initialize game tab switching
function initializeGameTabs() {
  const tabs = document.querySelectorAll('.game-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Get game ID
      const gameId = tab.getAttribute('data-game');
      currentGame = gameId;
      
      // Load leaderboard for this game
      await loadLeaderboard(gameId);
    });
  });
}

// Load leaderboard data
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

async function loadLeaderboard(gameId) {
  const leaderboardBody = document.getElementById('leaderboardBody');
  leaderboardBody.innerHTML = '<div class="loading">Loading leaderboard</div>';
  
  try {
    const token = localStorage.getItem('authToken');
    const apiBase = getApiBase();
    
    if (gameId === 'cyber-runner') {
      // Fetch real player data from backend
      const response = await fetch(`${apiBase}/api/challenges/leaderboard?challengeId=cyber-runner&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      const leaderboard = data.leaderboard || [];
      
      // Add local high score if not in leaderboard
      const localHighScore = localStorage.getItem('cyberRunnerHighScore') || 0;
      const currentUserId = localStorage.getItem('authUserId');
      
      // Transform data for display - only show players from backend
      const leaderboardData = leaderboard.map((entry, index) => ({
        rank: index + 1,
        name: entry.user?.username || entry.username || entry.name || 'Anonymous',
        score: entry.bestScore || entry.score || 0,
        level: entry.level || Math.floor((entry.bestScore || 0) / 100) + 1,
        userId: entry.user?._id || entry.userId || entry._id
      }));
      
      displayLeaderboard(leaderboardData);
    } else {
      // Other games - show empty state
      leaderboardBody.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎮</div>
          <p>Leaderboard for this game is coming soon!</p>
          <p style="margin-top: 1rem; font-size: 0.9rem;">Play Cyber Runner to see your scores here.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    leaderboardBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Failed to load leaderboard</p>
        <p style="margin-top: 1rem;">Please try again later.</p>
      </div>
    `;
  }
}

// Display leaderboard data
function displayLeaderboard(data) {
  const leaderboardBody = document.getElementById('leaderboardBody');
  
  if (data.length === 0) {
    leaderboardBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <p>No scores yet!</p>
        <p style="margin-top: 1rem;">Be the first to play and set a record.</p>
      </div>
    `;
    return;
  }
  
  const currentUserId = localStorage.getItem('authUserId');
  
  leaderboardBody.innerHTML = data.map(player => {
    let rankClass = 'normal';
    if (player.rank === 1) rankClass = 'gold';
    else if (player.rank === 2) rankClass = 'silver';
    else if (player.rank === 3) rankClass = 'bronze';
    
    const isCurrentUser = player.userId === currentUserId;
    const highlightClass = isCurrentUser ? 'style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6;"' : '';
    
    // Generate avatar emoji based on name
    const avatarEmoji = getAvatarEmoji(player.name);
    
    return `
      <div class="table-row" ${highlightClass}>
        <div class="rank ${rankClass}">${player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}</div>
        <div class="player-info">
          <div class="player-avatar">${avatarEmoji}</div>
          <div class="player-name">${player.name}${isCurrentUser ? ' (You)' : ''}</div>
        </div>
        <div class="score">${player.score}</div>
        <div class="level">Lv ${player.level}</div>
      </div>
    `;
  }).join('');
}

// Get current user's username from backend
async function getCurrentUsername(token, apiBase) {
  try {
    const response = await fetch(`${apiBase}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.username || 'Player';
    }
  } catch (error) {
    console.error('Error fetching username:', error);
  }
  return localStorage.getItem('authUser') || 'Player';
}

// Get avatar emoji based on player name
function getAvatarEmoji(name) {
  const emojis = ['🤖', '👾', '🦾', '🛡️', '🔐', '💻', '🖥️', '⚡', '🔥', '⭐'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
}
