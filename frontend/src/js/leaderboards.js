// Leaderboards Page JavaScript
console.log('[leaderboards.js] Loading...');

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:4000';

// Challenge names mapping
const CHALLENGES = {
  'cyber-runner': 'Cyber Runner',
  'cyber-runner-mp': 'Cyber Runner MP',
  'intrusion-intercept': 'Intrusion Intercept',
  'crypto-crack': 'Crypto Crack'
};

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
async function loadLeaderboard(gameId) {
  const leaderboardBody = document.getElementById('leaderboardBody');
  if (!leaderboardBody) {
    console.error('Leaderboard body element not found');
    return;
  }
  
  leaderboardBody.innerHTML = '<div class="loading">Loading leaderboard...</div>';
  
  try {
    const challengeName = CHALLENGES[gameId];
    if (!challengeName) {
      console.error('Unknown game ID:', gameId);
      showEmptyState('Game not found');
      return;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/challenge/${encodeURIComponent(challengeName)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    
    const leaderboard = await response.json();
    
    if (leaderboard.length === 0) {
      showEmptyState('No scores yet for this game! Be the first to play and set a record.');
      return;
    }
    
    displayLeaderboard(leaderboard);
    
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    showError('Failed to load leaderboard. Please try again.');
  }
}

// Show empty state
function showEmptyState(message) {
  const leaderboardBody = document.getElementById('leaderboardBody');
  if (!leaderboardBody) return;
  
  leaderboardBody.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📊</div>
      <p>${message}</p>
    </div>
  `;
}

// Show error
function showError(message) {
  const leaderboardBody = document.getElementById('leaderboardBody');
  if (!leaderboardBody) return;
  
  leaderboardBody.innerHTML = `
    <div class="empty-state" style="color: #ef4444;">
      <div class="empty-state-icon">⚠️</div>
      <p>${message}</p>
    </div>
  `;
}

// Display leaderboard data
function displayLeaderboard(data) {
  const leaderboardBody = document.getElementById('leaderboardBody');
  
  if (!leaderboardBody) {
    console.error('Leaderboard body element not found');
    return;
  }
  
  if (data.length === 0) {
    showEmptyState('No scores yet!');
    return;
  }
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUsername = user.username;
  
  leaderboardBody.innerHTML = data.map(player => {
    let rankClass = 'normal';
    if (player.rank === 1) rankClass = 'gold';
    else if (player.rank === 2) rankClass = 'silver';
    else if (player.rank === 3) rankClass = 'bronze';
    
    const isCurrentUser = player.username === currentUsername;
    const highlightClass = isCurrentUser ? 'style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6;"' : '';
    
    // Generate avatar emoji based on name
    const avatarEmoji = getAvatarEmoji(player.username);
    
    return `
      <div class="table-row" ${highlightClass}>
        <div class="rank ${rankClass}">${player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}</div>
        <div class="player-info">
          <div class="player-avatar">${avatarEmoji}</div>
          <div class="player-name">${escapeHtml(player.username)}${isCurrentUser ? ' (You)' : ''}</div>
        </div>
        <div class="score">${player.score.toLocaleString()}</div>
        <div class="level">Lv ${player.level}</div>
      </div>
    `;
  }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Get avatar emoji based on player name
function getAvatarEmoji(name) {
  const emojis = ['🤖', '👾', '🦾', '🛡️', '🔐', '💻', '🖥️', '⚡', '🔥', '⭐'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
}
