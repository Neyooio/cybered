const challengesIndex = [
  { 
    id: 'cyber-runner', 
    title: 'Cyber Runner', 
    icon: '../../assets/images/C2.png', 
    difficulty: 'Easy', 
    blurb: 'Solo or Multiplayer! Dodge viruses and answer questions!',
    gameUrl: '../../games/cyber-runner/index.html' // Local HTML5 game with multiplayer mode
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
    gameUrl: '../../games/security-breach-protocol/index.html' // Interactive branching scenario game
  },
  { 
    id: 'header-check', 
    title: 'Header Check', 
    icon: '../../assets/images/C1.png', 
    difficulty: 'Easy', 
    blurb: 'Spot phishing clues in mail headers.',
    gameUrl: '../../games/header-check/index.html' // Local multiplayer card game
  }
];

// Game Overlay Management
const gameOverlay = document.getElementById('gameOverlay');
const gameIframe = document.getElementById('gameIframe');
const gameLoading = document.getElementById('gameLoading');
const gameTitle = document.getElementById('gameTitle');
const closeGameBtn = document.getElementById('closeGameBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentGameUrl = '';

function openGame(challengeId) {
  const challenge = challengesIndex.find(c => c.id === challengeId);
  if (!challenge) return;

  // Get authentication info
  const token = localStorage.getItem('authToken');
  
  // Determine API base URL using centralized config
  function getApiBase() {
    // Use global config if available
    if (window.API_BASE_URL) return window.API_BASE_URL;
    
    const hostname = window.location.hostname;
    
    // Production environments
    if (hostname.includes('netlify.app') || hostname.includes('github.io') || hostname.includes('onrender.com')) {
      return 'https://cybered-backend.onrender.com';
    }
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }
    
    // Network access (LAN)
    return `${window.location.protocol}//${hostname}:4000`;
  }
  
  const apiBase = getApiBase() + '/api';

  // Build game URL with authentication parameters
  let gameUrl = challenge.gameUrl;
  
  // Add query parameters for Unity to receive
  const separator = gameUrl.includes('?') ? '&' : '?';
  gameUrl = `${gameUrl}${separator}token=${encodeURIComponent(token)}&api=${encodeURIComponent(apiBase)}&challenge=${challengeId}`;

  // Set game info
  gameTitle.textContent = challenge.title;
  currentGameUrl = gameUrl;

  // Show/hide multiplayer button based on game
  const multiplayerBtn = document.getElementById('multiplayerToggleBtn');
  if (multiplayerBtn) {
    if (challengeId === 'cyber-runner') {
      multiplayerBtn.style.display = 'inline-block';
      multiplayerBtn.textContent = '👥 Multiplayer';
      
      // Remove any existing listeners and add new one
      const newBtn = multiplayerBtn.cloneNode(true);
      multiplayerBtn.parentNode.replaceChild(newBtn, multiplayerBtn);
      
      newBtn.addEventListener('click', () => {
        console.log('🎮 Multiplayer button clicked');
        if (gameIframe && gameIframe.contentWindow) {
          console.log('📤 Sending toggleMultiplayer message to iframe');
          gameIframe.contentWindow.postMessage({ type: 'toggleMultiplayer' }, '*');
        } else {
          console.error('❌ Game iframe not available');
        }
      });
    } else {
      multiplayerBtn.style.display = 'none';
    }
  }

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
  // Exit fullscreen if currently in fullscreen
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  gameOverlay.classList.remove('active');
  gameIframe.src = ''; // Stop the game
  document.body.style.overflow = ''; // Restore scroll
  currentGameUrl = '';
  
  // Restore focus and pointer events
  setTimeout(() => {
    document.body.focus();
    document.body.style.pointerEvents = '';
  }, 100);
  
  // Hide multiplayer button
  const multiplayerBtn = document.getElementById('multiplayerToggleBtn');
  if (multiplayerBtn) {
    multiplayerBtn.style.display = 'none';
  }
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

// Listen for fullscreen change to restore focus
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    // Exiting fullscreen - restore focus to document body
    setTimeout(() => {
      document.body.focus();
      document.body.click(); // Trigger a click to reset pointer events
    }, 100);
  }
});

document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement) {
    setTimeout(() => {
      document.body.focus();
      document.body.click();
    }, 100);
  }
});

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
             challenge.blurb.toLowerCase().includes(searchTerm);
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

// External Quiz Modal Handler (for mobile)
const externalQuizModal = document.getElementById('externalQuizModal');
let currentQuizCallback = null;

// Listen for messages from the game iframe
window.addEventListener('message', (event) => {
  // Security: Verify origin if needed
  // if (event.origin !== expectedOrigin) return;
  
  const data = event.data;
  
  console.log('📨 Parent received message:', data);
  
  if (data.type === 'showQuiz') {
    showExternalQuiz(data.question, data.options, data.correct);
  } else if (data.type === 'hideQuiz') {
    hideExternalQuiz();
  } else if (data.type === 'showMultiplayerLobby') {
    console.log('📱 Showing external multiplayer lobby');
    showExternalMultiplayerLobby();
  } else if (data.type === 'hideMultiplayerLobby') {
    hideExternalMultiplayerLobby();
  } else if (data.type === 'lobbyUpdate') {
    updateExternalLobby(data);
  } else if (data.type === 'updateMultiplayerButton') {
    console.log('🔄 Updating button text to:', data.text);
    const multiplayerBtn = document.getElementById('multiplayerToggleBtn');
    if (multiplayerBtn && data.text) {
      multiplayerBtn.textContent = data.text;
    }
  }
});

function showExternalQuiz(question, options, correctIndex) {
  // Check if mobile device
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return; // Only show external modal on mobile
  
  document.getElementById('externalQuizQuestion').textContent = question;
  
  const optionsContainer = document.getElementById('externalQuizOptions');
  optionsContainer.innerHTML = '';
  
  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'external-quiz-option';
    button.textContent = option;
    
    button.onclick = () => handleExternalQuizAnswer(index, correctIndex, button);
    
    optionsContainer.appendChild(button);
  });
  
  document.getElementById('externalQuizFeedback').textContent = '';
  externalQuizModal.style.display = 'flex';
}

function handleExternalQuizAnswer(selectedIndex, correctIndex, button) {
  const allButtons = document.querySelectorAll('.external-quiz-option');
  allButtons.forEach(btn => btn.disabled = true);
  
  const isCorrect = selectedIndex === correctIndex;
  
  if (isCorrect) {
    button.classList.add('correct');
    document.getElementById('externalQuizFeedback').textContent = '✓ Correct! Continue running!';
    document.getElementById('externalQuizFeedback').style.color = '#22c55e';
  } else {
    button.classList.add('wrong');
    allButtons[correctIndex].classList.add('correct');
    document.getElementById('externalQuizFeedback').textContent = '✗ Wrong! Game Over!';
    document.getElementById('externalQuizFeedback').style.color = '#ef4444';
  }
  
  // Send result back to iframe
  setTimeout(() => {
    gameIframe.contentWindow.postMessage({
      type: 'quizAnswer',
      correct: isCorrect
    }, '*');
    
    hideExternalQuiz();
  }, isCorrect ? 1500 : 2000);
}

function hideExternalQuiz() {
  externalQuizModal.style.display = 'none';
}

// External Multiplayer Lobby Handler (for mobile)
const externalMultiplayerLobby = document.getElementById('externalMultiplayerLobby');

function showExternalMultiplayerLobby() {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return;
  
  externalMultiplayerLobby.style.display = 'flex';
  
  // Setup event handlers
  const createBtn = document.getElementById('externalCreateRoomBtn');
  const joinInput = document.getElementById('externalJoinRoomInput');
  const joinBtn = document.getElementById('externalJoinRoomBtn');
  const closeBtn = document.getElementById('externalCloseLobbyBtn');
  const readyBtn = document.getElementById('externalReadyBtn');
  const startBtn = document.getElementById('externalStartGameBtn');
  const leaveBtn = document.getElementById('externalLeaveRoomBtn');
  
  // Create room
  createBtn.ontouchend = createBtn.onclick = (e) => {
    e.preventDefault();
    gameIframe.contentWindow.postMessage({ type: 'multiplayerAction', action: 'createRoom' }, '*');
  };
  
  // Join room
  joinBtn.ontouchend = joinBtn.onclick = (e) => {
    e.preventDefault();
    const code = joinInput.value.trim().toUpperCase();
    if (code) {
      gameIframe.contentWindow.postMessage({ type: 'multiplayerAction', action: 'joinRoom', code }, '*');
    }
  };
  
  // Ready
  readyBtn.ontouchend = readyBtn.onclick = (e) => {
    e.preventDefault();
    gameIframe.contentWindow.postMessage({ type: 'multiplayerAction', action: 'toggleReady' }, '*');
  };
  
  // Start game
  startBtn.ontouchend = startBtn.onclick = (e) => {
    e.preventDefault();
    // Only start if button is not disabled
    if (!startBtn.disabled) {
      gameIframe.contentWindow.postMessage({ type: 'multiplayerAction', action: 'startGame' }, '*');
    }
  };
  
  // Leave room
  leaveBtn.ontouchend = leaveBtn.onclick = (e) => {
    e.preventDefault();
    gameIframe.contentWindow.postMessage({ type: 'multiplayerAction', action: 'leaveRoom' }, '*');
    // Don't hide immediately - wait for hideRoom message from game
  };
  
  // Close lobby
  closeBtn.ontouchend = closeBtn.onclick = (e) => {
    e.preventDefault();
    hideExternalMultiplayerLobby();
    
    // Update button text to Multiplayer since we're going back to single player
    const multiplayerBtn = document.getElementById('multiplayerToggleBtn');
    if (multiplayerBtn) {
      multiplayerBtn.textContent = '👥 Multiplayer';
    }
    
    gameIframe.contentWindow.postMessage({ type: 'multiplayerAction', action: 'closeLobby' }, '*');
  };
}

function hideExternalMultiplayerLobby() {
  externalMultiplayerLobby.style.display = 'none';
  document.getElementById('externalLobbyCreation').style.display = 'block';
  document.getElementById('externalRoomSection').style.display = 'none';
  document.getElementById('externalJoinRoomInput').value = '';
}

function updateExternalLobby(data) {
  const { action, roomCode, players, playerCount, isHost, canStart, isReady } = data;
  
  if (action === 'showRoom') {
    // Hide creation section, show room section
    document.getElementById('externalLobbyCreation').style.display = 'none';
    document.getElementById('externalRoomSection').style.display = 'block';
    document.getElementById('externalRoomCode').textContent = roomCode;
    
    // Reset ready button
    const readyBtn = document.getElementById('externalReadyBtn');
    readyBtn.textContent = 'READY';
    readyBtn.style.background = '#f97316';
    
    // Show/hide host-only buttons
    const startBtn = document.getElementById('externalStartGameBtn');
    if (isHost) {
      startBtn.style.display = 'inline-block';
      startBtn.disabled = true;
      startBtn.style.background = '#6b7280';
      startBtn.style.cursor = 'not-allowed';
      readyBtn.style.display = 'none';
    } else {
      startBtn.style.display = 'none';
      readyBtn.style.display = 'inline-block';
    }
  }
  
  if (action === 'updatePlayers' && players) {
    // Player colors based on lane
    const playerColors = [
      { main: '#3b82f6', light: '#60a5fa' },  // Blue
      { main: '#eab308', light: '#facc15' },  // Yellow
      { main: '#10b981', light: '#34d399' },  // Green
      { main: '#a855f7', light: '#c084fc' },  // Purple
      { main: '#f97316', light: '#fb923c' }   // Orange
    ];
    
    // Update player list
    const playersList = document.getElementById('externalPlayersList');
    playersList.innerHTML = '';
    
    players.forEach(player => {
      const colorScheme = playerColors[player.lane] || playerColors[0];
      const li = document.createElement('li');
      li.className = 'player-item';
      if (player.ready) li.classList.add('ready');
      if (player.isHost) li.classList.add('host');
      
      // Create color dot
      const colorDot = document.createElement('span');
      colorDot.style.display = 'inline-block';
      colorDot.style.width = '12px';
      colorDot.style.height = '12px';
      colorDot.style.borderRadius = '50%';
      colorDot.style.background = colorScheme.main;
      colorDot.style.marginRight = '8px';
      colorDot.style.border = '2px solid ' + colorScheme.light;
      
      const nameSpan = document.createElement('span');
      nameSpan.appendChild(colorDot);
      nameSpan.appendChild(document.createTextNode(player.username));
      
      const badgesSpan = document.createElement('span');
      if (player.isHost) {
        badgesSpan.innerHTML = '<span class="host-badge">HOST</span>';
      } else if (player.ready) {
        badgesSpan.innerHTML = '<span class="ready-badge">✓ READY</span>';
      }
      
      li.appendChild(nameSpan);
      li.appendChild(badgesSpan);
      playersList.appendChild(li);
    });
    
    document.getElementById('externalPlayerCount').textContent = playerCount || players.length;
  }
  
  if (action === 'updateReady') {
    const readyBtn = document.getElementById('externalReadyBtn');
    readyBtn.textContent = isReady ? 'UNREADY' : 'READY';
    readyBtn.style.background = isReady ? '#22c55e' : '#f97316';
  }
  
  if (action === 'canStart') {
    const startBtn = document.getElementById('externalStartGameBtn');
    startBtn.disabled = !canStart;
    // Change button color: green when can start, gray when disabled
    startBtn.style.background = canStart ? '#22c55e' : '#6b7280';
    startBtn.style.cursor = canStart ? 'pointer' : 'not-allowed';
  }
  
  if (action === 'hideRoom') {
    hideExternalMultiplayerLobby();
  }
}
