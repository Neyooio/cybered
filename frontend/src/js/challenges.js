const challengesIndex = [
  { 
    id: 'firewall-frenzy', 
    title: 'Firewall Frenzy', 
    icon: '../../assets/images/C2.png', 
    difficulty: 'Easy', 
    blurb: 'Turn-based Q&A defense battle.',
    gameUrl: 'https://example.com/unity-games/firewall-frenzy' // Replace with actual Unity WebGL URL
  },
  { 
    id: 'crypto-crack', 
    title: 'Crypto Crack', 
    icon: '../../assets/images/C3.png', 
    difficulty: 'Medium', 
    blurb: 'Solve ciphers with earned hints.',
    gameUrl: 'https://example.com/unity-games/crypto-crack' // Replace with actual Unity WebGL URL
  },
  { 
    id: 'intrusion-intercept', 
    title: 'Intrusion Intercept', 
    icon: '../../assets/images/C4.png', 
    difficulty: 'Hard', 
    blurb: 'Outsmart stealthy hacker NPCs before they breach the core.',
    gameUrl: 'https://example.com/unity-games/intrusion-intercept' // Replace with actual Unity WebGL URL
  },
  { 
    id: 'header-check', 
    title: 'Header Check', 
    icon: '../../assets/images/C1.png', 
    difficulty: 'Easy', 
    blurb: 'Spot phishing clues in mail headers.',
    gameUrl: 'https://example.com/unity-games/header-check' // Replace with actual Unity WebGL URL
  }
];

// Game Overlay Management
const gameOverlay = document.getElementById('gameOverlay');
const gameIframe = document.getElementById('gameIframe');
const gameLoading = document.getElementById('gameLoading');
const gameTitle = document.getElementById('gameTitle');
const gameDifficulty = document.getElementById('gameDifficulty');
const closeGameBtn = document.getElementById('closeGameBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentGameUrl = '';

function openGame(challengeId) {
  const challenge = challengesIndex.find(c => c.id === challengeId);
  if (!challenge) return;

  // Get authentication info
  const token = localStorage.getItem('authToken');
  const apiBase = localStorage.getItem('apiBase') || window.location.origin.includes('localhost') 
    ? 'http://localhost:4000/api' 
    : `${window.location.protocol}//${window.location.hostname}:4000/api`;

  // Build game URL with authentication parameters
  let gameUrl = challenge.gameUrl;
  
  // Add query parameters for Unity to receive
  const separator = gameUrl.includes('?') ? '&' : '?';
  gameUrl = `${gameUrl}${separator}token=${encodeURIComponent(token)}&api=${encodeURIComponent(apiBase)}&challenge=${challengeId}`;

  // Set game info
  gameTitle.textContent = challenge.title;
  gameDifficulty.textContent = challenge.difficulty;
  currentGameUrl = gameUrl;

  // Show overlay and loading
  gameOverlay.classList.add('active');
  gameLoading.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scroll

  // Load game in iframe
  gameIframe.src = gameUrl;

  // Hide loading after iframe loads (or after 3 seconds timeout)
  const hideLoading = () => {
    setTimeout(() => {
      gameLoading.classList.add('hidden');
    }, 2000);
  };

  gameIframe.addEventListener('load', hideLoading, { once: true });
  setTimeout(hideLoading, 5000); // Fallback timeout
}

function closeGame() {
  gameOverlay.classList.remove('active');
  gameIframe.src = ''; // Stop the game
  document.body.style.overflow = ''; // Restore scroll
  currentGameUrl = '';
}

function restartGame() {
  if (!currentGameUrl) return;
  gameLoading.classList.remove('hidden');
  gameIframe.src = currentGameUrl; // Reload the game
  setTimeout(() => {
    gameLoading.classList.add('hidden');
  }, 2000);
}

function toggleFullscreen() {
  const container = document.querySelector('.game-container');
  
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
    fullscreenBtn.textContent = '⛶ Exit Fullscreen';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    fullscreenBtn.textContent = '⛶ Fullscreen';
  }
}

// Event Listeners
closeGameBtn?.addEventListener('click', closeGame);
restartGameBtn?.addEventListener('click', restartGame);
fullscreenBtn?.addEventListener('click', toggleFullscreen);

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameOverlay.classList.contains('active')) {
    closeGame();
  }
});

// Close on overlay click (outside game container)
gameOverlay?.addEventListener('click', (e) => {
  if (e.target === gameOverlay) {
    closeGame();
  }
});

// Update fullscreen button text when fullscreen changes
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    fullscreenBtn.textContent = '⛶ Exit Fullscreen';
  } else {
    fullscreenBtn.textContent = '⛶ Fullscreen';
  }
});

function renderChallenges() {
  const grid = document.getElementById('challengesGrid');
  grid.innerHTML = challengesIndex.map(c => `
    <div class='challenge-card'>
      <div class='challenge-card-header'>
        <div class='challenge-icon'>
          <img src='${c.icon}' alt='${c.title}'>
        </div>
        <div>
          <h3 class='challenge-title'>${c.title}</h3>
          <p class='challenge-difficulty'>${c.difficulty} • Challenge</p>
        </div>
      </div>
      <p class='challenge-description'>${c.blurb}</p>
      <div class='challenge-actions'>
        <button onclick="openGame('${c.id}')" class='challenge-play'>Play</button>
      </div>
    </div>`).join('');
}

renderChallenges();

// Search functionality
const searchInput = document.getElementById('challengeSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const grid = document.getElementById('challengesGrid');
    
    if (!searchTerm) {
      // Show all challenges if search is empty
      renderChallenges();
      return;
    }
    
    // Filter challenges based on search term
    const filteredChallenges = challengesIndex.filter(challenge => {
      return challenge.title.toLowerCase().includes(searchTerm) ||
             challenge.blurb.toLowerCase().includes(searchTerm) ||
             challenge.difficulty.toLowerCase().includes(searchTerm);
    });
    
    // Render filtered results
    if (filteredChallenges.length === 0) {
      grid.innerHTML = `
        <div class="no-results-message">
          <p>No challenges found matching "${searchTerm}"</p>
          <p>Try a different search term</p>
        </div>
      `;
    } else {
      grid.innerHTML = filteredChallenges.map(c => `
        <div class='challenge-card'>
          <div class='challenge-card-header'>
            <div class='challenge-icon'>
              <img src='${c.icon}' alt='${c.title}'>
            </div>
            <div>
              <h3 class='challenge-title'>${c.title}</h3>
              <p class='challenge-difficulty'>${c.difficulty} • Challenge</p>
            </div>
          </div>
          <p class='challenge-description'>${c.blurb}</p>
          <div class='challenge-actions'>
            <button onclick="openGame('${c.id}')" class='challenge-play'>Play</button>
          </div>
        </div>`).join('');
    }
  });
}
