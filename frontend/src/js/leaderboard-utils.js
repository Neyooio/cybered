/**
 * Leaderboard Utility
 * Handles score submission for all challenge games
 */

// Submit score to leaderboard
async function submitToLeaderboard(challengeName, score, level = 1, completionTime = 0) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('[Leaderboard] User not logged in - score not submitted');
      return { success: false, reason: 'not_logged_in' };
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'student') {
      console.log('[Leaderboard] Only students can submit to leaderboard');
      return { success: false, reason: 'not_student' };
    }

    const API_BASE_URL = window.API_BASE_URL || 'http://localhost:4000';
    
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        challengeName,
        score,
        level,
        completionTime
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Leaderboard] Submit error:', error);
      return { success: false, reason: error.error };
    }

    const data = await response.json();
    console.log('[Leaderboard] Score submitted:', data);
    
    // Show notification if new high score
    if (data.isNewHighScore) {
      showLeaderboardNotification('🏆 New High Score!', `Your score: ${score}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('[Leaderboard] Submit failed:', error);
    return { success: false, reason: error.message };
  }
}

// Show leaderboard notification
function showLeaderboardNotification(title, message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'leaderboard-notification';
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    border: 2px solid #000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: 'Press Start 2P', monospace;
    font-size: 0.7rem;
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 0.5rem;">${title}</div>
    <div style="font-size: 0.6rem;">${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations to document
if (!document.getElementById('leaderboard-animations')) {
  const style = document.createElement('style');
  style.id = 'leaderboard-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Make globally available
window.submitToLeaderboard = submitToLeaderboard;
window.showLeaderboardNotification = showLeaderboardNotification;
