// Cyber Runner Game - Chrome Dino Clone with Cybersecurity Questions
// Supports both Single Player and Multiplayer modes

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game mode: 'single' or 'multi'
let gameMode = 'single';

// Socket.IO connection (only for multiplayer)
let socket = null;
let multiplayerState = {
  myPlayerId: null,
  myLane: 0,
  roomCode: null,
  isHost: false,
  isReady: false,
  players: new Map(),
  spectating: false
};

// Player colors based on lane (0-4)
const playerColors = [
  { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af', name: 'Blue' },    // Player 1
  { main: '#eab308', light: '#facc15', dark: '#a16207', name: 'Yellow' },  // Player 2
  { main: '#10b981', light: '#34d399', dark: '#047857', name: 'Green' },   // Player 3
  { main: '#a855f7', light: '#c084fc', dark: '#7e22ce', name: 'Purple' },  // Player 4
  { main: '#f97316', light: '#fb923c', dark: '#c2410c', name: 'Orange' }   // Player 5
];

// Audio elements
const audio = {
  theme: new Audio('../gameaudio/CyberRunnerTheme.mp3'),
  jump: new Audio('../gameaudio/jump.mp3'),
  gameOver: new Audio('../gameaudio/Gameover.mp3'),
  highScore: new Audio('../gameaudio/HighScore.mp3'),
  correctChoice: new Audio('../gameaudio/Correctchoice.mp3'),
  wrongChoice: new Audio('../gameaudio/Wrongchoice.mp3'),
  touch: new Audio('../gameaudio/touch.mp3')
};

// Set theme to loop
audio.theme.loop = true;
audio.theme.volume = 0.3; // Lower volume for background music

// Set sound effect volumes
audio.jump.volume = 0.5;
audio.gameOver.volume = 0.6;
audio.highScore.volume = 0.7;
audio.correctChoice.volume = 0.6;
audio.wrongChoice.volume = 0.6;
audio.touch.volume = 0.7;

// Get backend server URL from query params or default
function getBackendUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const apiUrl = urlParams.get('api');
  
  if (apiUrl) {
    // Extract base URL from API URL (remove /api)
    return apiUrl.replace('/api', '');
  }
  
  // Default: try to use the same host as the frontend
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' 
    ? 'http://localhost:4000' 
    : `http://${hostname}:4000`;
}

// Get user-specific high score key
function getHighScoreKey() {
  const userId = new URLSearchParams(window.location.search).get('token')?.split('.')[1];
  if (userId) {
    try {
      const decoded = JSON.parse(atob(userId));
      return `cyberRunnerHighScore_${decoded.sub}`;
    } catch (e) {
      console.log('Could not decode token, using default key');
    }
  }
  // Fallback to checking localStorage for userId
  const storedUserId = localStorage.getItem('authUserId');
  return storedUserId ? `cyberRunnerHighScore_${storedUserId}` : 'cyberRunnerHighScore';
}

// Game state
let gameStarted = false;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem(getHighScoreKey()) || 0;
let gameSpeed = 3;
let gravity = 0.8;
let obstacleTimer = 0;
let obstacleInterval = 150;
let speedIncreaseTimer = 0;
let highScoreSoundPlayed = false;
let highScoreFlicker = false;
let flickerTimer = 0;

// Robot player
const robot = {
  x: 50,
  y: 0,
  width: 40,
  height: 50,
  velocityY: 0,
  jumping: false,
  grounded: true
};

const ground = canvas.height - 50;
robot.y = ground - robot.height;

// Obstacles array
let obstacles = [];

// Quiz questions bank
const quizQuestions = [
  {
    question: "What is the most common type of malware?",
    options: ["Virus", "Worm", "Trojan", "Ransomware"],
    correct: 0
  },
  {
    question: "Which port is used for HTTP?",
    options: ["21", "80", "443", "3389"],
    correct: 1
  },
  {
    question: "What does SSL stand for?",
    options: ["Secure Socket Layer", "System Security Layer", "Safe Server Link", "Secure System Login"],
    correct: 0
  },
  {
    question: "What type of attack floods a network with traffic?",
    options: ["Phishing", "DDoS", "SQL Injection", "XSS"],
    correct: 1
  },
  {
    question: "What is a firewall used for?",
    options: ["Encrypting data", "Blocking unauthorized access", "Scanning viruses", "Creating backups"],
    correct: 1
  },
  {
    question: "Which protocol encrypts web traffic?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correct: 2
  },
  {
    question: "What is phishing?",
    options: ["A type of malware", "Social engineering attack", "Network scanning", "Password cracking"],
    correct: 1
  },
  {
    question: "What does VPN stand for?",
    options: ["Virtual Private Network", "Very Protected Network", "Verified Public Network", "Visual Protocol Node"],
    correct: 0
  },
  {
    question: "Which is NOT a strong password practice?",
    options: ["Using special characters", "Using dictionary words", "Using uppercase and lowercase", "Using numbers"],
    correct: 1
  },
  {
    question: "What is ransomware?",
    options: ["Steals passwords", "Encrypts files for ransom", "Tracks browsing", "Sends spam"],
    correct: 1
  },
  {
    question: "What is two-factor authentication?",
    options: ["Two passwords", "Password + secondary verification", "Two usernames", "Two devices"],
    correct: 1
  },
  {
    question: "What does AES stand for in encryption?",
    options: ["Advanced Encryption Standard", "Automated Email Security", "Applied Encryption System", "Active Encryption Service"],
    correct: 0
  },
  {
    question: "What is a zero-day exploit?",
    options: ["Old vulnerability", "Unknown vulnerability", "Patched vulnerability", "Fake vulnerability"],
    correct: 1
  },
  {
    question: "What is SQL injection?",
    options: ["Database attack", "Network attack", "Physical attack", "Social attack"],
    correct: 0
  },
  {
    question: "What does IDS stand for?",
    options: ["Internet Data Service", "Intrusion Detection System", "Internal Defense System", "Internet Defense Service"],
    correct: 1
  }
];

let currentQuestion = null;

// Update high score display
document.getElementById('highScore').textContent = `HI: ${highScore}`;

// Game loop
function gameLoop() {
  if (!gameRunning || gamePaused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  drawGround();

  // Update and check collisions only if not spectating
  if (gameMode === 'single' || !multiplayerState.spectating) {
    updateRobot();
    checkCollisions();
  }

  // Draw players based on game mode
  if (gameMode === 'multi') {
    // Update own player's position in the players map
    if (!multiplayerState.spectating) {
      const myPlayer = multiplayerState.players.get(multiplayerState.myPlayerId);
      if (myPlayer) {
        myPlayer.position = { x: robot.x, y: robot.y, velocityY: robot.velocityY };
        myPlayer.score = Math.floor(score / 10);
      }
    }
    // Draw all players (including self)
    drawAllPlayers();
  } else {
    // Single player mode - only draw own robot
    drawRobot();
  }

  // Update and draw obstacles
  updateObstacles();
  drawObstacles();

  // Update score (only if not spectating)
  if (gameMode === 'single' || !multiplayerState.spectating) {
    score++;
  }
  
  const displayScore = Math.floor(score / 10);
  if (gameMode === 'single' || !multiplayerState.spectating) {
    document.getElementById('score').textContent = `SCORE: ${displayScore}`;
  }

  // Check if high score is reached for the first time (only if there was a previous high score)
  if ((gameMode === 'single' || !multiplayerState.spectating) && displayScore > highScore && !highScoreSoundPlayed && highScore > 0) {
    // Play high score sound
    audio.highScore.currentTime = 0;
    audio.highScore.play().catch(e => console.log('Audio play failed:', e));
    highScoreSoundPlayed = true;
    highScoreFlicker = true;
    flickerTimer = 0;
  }

  // Handle high score flickering effect
  if (highScoreFlicker) {
    flickerTimer++;
    const shouldShow = Math.floor(flickerTimer / 15) % 2 === 0; // Flicker every 15 frames
    const highScoreElement = document.getElementById('highScore');
    if (shouldShow) {
      highScoreElement.style.color = '#fbbf24';
      highScoreElement.style.transform = 'scale(1.2)';
      highScoreElement.textContent = `HI: ${displayScore} 🔥`;
    } else {
      highScoreElement.style.color = '#60a5fa';
      highScoreElement.style.transform = 'scale(1)';
      highScoreElement.textContent = `HI: ${displayScore}`;
    }
    
    // Stop flickering after 3 seconds (180 frames at 60fps)
    if (flickerTimer > 180) {
      highScoreFlicker = false;
      highScoreElement.style.color = '#60a5fa';
      highScoreElement.style.transform = 'scale(1)';
      highScoreElement.textContent = `HI: ${displayScore}`;
    }
  }

  // Gradually increase speed at certain score milestones (+1 speed every 50 points)
  // Calculate target speed based on score
  const targetSpeed = 3 + Math.floor(displayScore / 50);
  
  // Increase speed if we haven't reached the target yet
  if (gameSpeed < targetSpeed) {
    gameSpeed = targetSpeed;
  }

  // Spawn obstacles (only in single player mode, multiplayer uses server-spawned obstacles)
  if (gameMode === 'single') {
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
      spawnObstacle();
      obstacleTimer = 0;
      // Gradually reduce spawn interval as score increases (more challenging)
      obstacleInterval = Math.max(80, 150 - Math.floor(score / 2000));
    }
  }

  requestAnimationFrame(gameLoop);
}

// Draw ground
function drawGround() {
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  
  // Grid lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 50) {
    const offset = (score * gameSpeed) % 50;
    ctx.beginPath();
    ctx.moveTo(i - offset, ground);
    ctx.lineTo(i - offset, canvas.height);
    ctx.stroke();
  }
}

// Update robot
function updateRobot() {
  if (robot.jumping) {
    robot.velocityY += gravity;
    robot.y += robot.velocityY;

    if (robot.y >= ground - robot.height) {
      robot.y = ground - robot.height;
      robot.velocityY = 0;
      robot.jumping = false;
      robot.grounded = true;
    }
  }
}

// Draw robot
function drawRobot(x = robot.x, y = robot.y, width = robot.width, height = robot.height, colorScheme = playerColors[0], animOffset = 0) {
  ctx.fillStyle = colorScheme.main;
  
  // Body
  ctx.fillRect(x, y, width, height * 0.6);
  
  // Head
  ctx.fillStyle = colorScheme.light;
  ctx.fillRect(x + 5, y - 15, width - 10, 15);
  
  // Eyes
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 10, y - 10, 8, 6);
  ctx.fillRect(x + width - 18, y - 10, 8, 6);
  
  // Legs
  ctx.fillStyle = colorScheme.dark;
  const legOffset = Math.floor(animOffset / 5) % 2 === 0 ? 0 : 5;
  ctx.fillRect(x + 8, y + height * 0.6, 10, height * 0.4 - legOffset);
  ctx.fillRect(x + width - 18, y + height * 0.6, 10, height * 0.4 + legOffset);
  
  // Arms
  ctx.fillStyle = colorScheme.main;
  ctx.fillRect(x - 5, y + 10, 5, 20);
  ctx.fillRect(x + width, y + 10, 5, 20);
}

function drawAllPlayers() {
  multiplayerState.players.forEach(player => {
    if (player.isEliminated) return; // Don't draw eliminated players
    if (!player.position) return; // Skip if position not yet initialized
    
    const colorScheme = playerColors[player.lane] || playerColors[0];
    const pos = player.position;
    
    // Draw player's robot
    drawRobot(pos.x, pos.y, robot.width, robot.height, colorScheme, player.score || 0);
  });
}

// Spawn obstacle
function spawnObstacle() {
  const type = Math.random() > 0.7 ? 'flying' : 'ground';
  const obstacle = {
    x: canvas.width,
    y: type === 'flying' ? ground - 100 : ground,
    width: 30,
    height: type === 'flying' ? 30 : 40,
    type: type,
    color: type === 'flying' ? '#ef4444' : '#dc2626'
  };
  obstacles.push(obstacle);
}

// Update obstacles
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= gameSpeed;
    
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }
}

// Draw obstacles (viruses)
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    
    if (obstacle.type === 'flying') {
      // Flying virus (bird-like)
      ctx.beginPath();
      ctx.arc(obstacle.x + 15, obstacle.y + 15, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Wings
      ctx.fillStyle = '#7f1d1d';
      const wingFlap = Math.floor(score / 5) % 2 === 0 ? -5 : 5;
      ctx.fillRect(obstacle.x - 5, obstacle.y + 10 + wingFlap, 10, 5);
      ctx.fillRect(obstacle.x + 25, obstacle.y + 10 + wingFlap, 10, 5);
    } else {
      // Ground virus (cactus-like) - drawn from ground up
      const virusHeight = obstacle.height;
      const virusY = ground - virusHeight;
      
      // Main body
      ctx.fillRect(obstacle.x, virusY, obstacle.width, virusHeight);
      
      // Spikes on top
      ctx.fillStyle = '#991b1b';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x + i * 12, virusY);
        ctx.lineTo(obstacle.x + i * 12 + 6, virusY - 10);
        ctx.lineTo(obstacle.x + i * 12 + 12, virusY);
        ctx.fill();
      }
    }
  });
}

// Check collisions
function checkCollisions() {
  obstacles.forEach(obstacle => {
    // Adjust collision box for ground obstacles
    const obstacleY = obstacle.type === 'ground' ? ground - obstacle.height : obstacle.y;
    
    if (
      robot.x < obstacle.x + obstacle.width &&
      robot.x + robot.width > obstacle.x &&
      robot.y < obstacleY + obstacle.height &&
      robot.y + robot.height > obstacleY
    ) {
      // Collision detected - show quiz
      pauseGameForQuiz();
    }
  });
}

// Pause game and show quiz
function pauseGameForQuiz() {
  gamePaused = true;
  
  // In multiplayer, notify other players that this player is paused for quiz
  if (gameMode === 'multi' && socket) {
    socket.emit('player-paused', { 
      playerId: multiplayerState.myPlayerId,
      position: { x: robot.x, y: robot.y, velocityY: robot.velocityY }
    });
  }
  
  // Play collision/hit sound (touch.mp3)
  audio.touch.currentTime = 0;
  audio.touch.play().catch(e => console.log('Audio play failed:', e));
  
  // Select random question
  currentQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
  
  // Check if on mobile and in iframe - if so, use external modal
  const isMobile = window.innerWidth <= 768;
  const inIframe = window.self !== window.top;
  
  if (isMobile && inIframe) {
    // Send quiz to parent window for external modal
    window.parent.postMessage({
      type: 'showQuiz',
      question: currentQuestion.question,
      options: currentQuestion.options,
      correct: currentQuestion.correct
    }, '*');
    return;
  }
  
  // Display quiz in iframe (desktop)
  document.getElementById('quizQuestion').textContent = currentQuestion.question;
  
  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';
  
  // Use different answer handler based on game mode
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = option;
    
    // Add both click and touchend handlers for mobile support
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (gameMode === 'multi') {
        answerQuizMultiplayer(index);
      } else {
        checkAnswer(index, button);
      }
    };
    
    button.onclick = handler;
    button.ontouchend = handler;
    
    optionsContainer.appendChild(button);
  });
  
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizModal').style.display = 'block';
}

// Check quiz answer
function checkAnswer(selectedIndex, button) {
  const allButtons = document.querySelectorAll('.quiz-option');
  allButtons.forEach(btn => btn.disabled = true);
  
  if (selectedIndex === currentQuestion.correct) {
    // Correct answer
    button.classList.add('correct');
    document.getElementById('quizFeedback').textContent = '✓ Correct! Continue running!';
    document.getElementById('quizFeedback').style.color = '#22c55e';
    
    // Play correct choice sound
    audio.correctChoice.currentTime = 0;
    audio.correctChoice.play().catch(e => console.log('Audio play failed:', e));
    
    setTimeout(() => {
      document.getElementById('quizModal').style.display = 'none';
      obstacles = []; // Clear obstacles
      gamePaused = false;
      
      // In multiplayer, notify other players that this player resumed
      if (gameMode === 'multi' && socket) {
        socket.emit('player-resumed', { playerId: multiplayerState.myPlayerId });
      }
    }, 1500);
  } else {
    // Wrong answer
    button.classList.add('wrong');
    allButtons[currentQuestion.correct].classList.add('correct');
    document.getElementById('quizFeedback').style.color = '#ef4444';
    
    // Play wrong choice sound
    audio.wrongChoice.currentTime = 0;
    audio.wrongChoice.play().catch(e => console.log('Audio play failed:', e));
    
    if (gameMode === 'multi') {
      // Multiplayer: eliminate and spectate
      document.getElementById('quizFeedback').textContent = '✗ Wrong! You are eliminated!';
      setTimeout(() => {
        document.getElementById('quizModal').style.display = 'none';
        eliminatePlayer();
      }, 2000);
    } else {
      // Single player: game over
      document.getElementById('quizFeedback').textContent = '✗ Wrong! Game Over!';
      setTimeout(() => {
        document.getElementById('quizModal').style.display = 'none';
        endGame();
      }, 2000);
    }
  }
}

// Jump
function jump() {
  if (robot.grounded && gameRunning && !gamePaused) {
    robot.velocityY = -15;
    robot.jumping = true;
    robot.grounded = false;
    
    // Play jump sound
    audio.jump.currentTime = 0; // Reset to start
    audio.jump.play().catch(e => console.log('Audio play failed:', e));
  }
}

// Start game
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    document.getElementById('startScreen').style.display = 'none';
    
    // Start playing theme music
    audio.theme.currentTime = 0;
    audio.theme.play().catch(e => console.log('Audio play failed:', e));
  }
  
  // Reset all game variables
  gameRunning = true;
  gamePaused = false;
  score = 0;
  gameSpeed = 3;
  obstacles = [];
  obstacleTimer = 0;
  obstacleInterval = 150;
  speedIncreaseTimer = 0;
  highScoreSoundPlayed = false;
  highScoreFlicker = false;
  flickerTimer = 0;
  
  // Reset robot position and state
  robot.y = ground - robot.height;
  robot.velocityY = 0;
  robot.jumping = false;
  robot.grounded = true;
  
  // Hide overlays
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('quizModal').style.display = 'none';
  
  // Update score display
  document.getElementById('score').textContent = 'SCORE: 0';
  
  // Reset high score display
  document.getElementById('highScore').style.color = '#60a5fa';
  document.getElementById('highScore').style.transform = 'scale(1)';
  
  // Resume theme music if it was paused
  if (audio.theme.paused) {
    audio.theme.play().catch(e => console.log('Audio play failed:', e));
  }
}

// End game
function endGame() {
  gameRunning = false;
  const finalScore = Math.floor(score / 10);
  
  // Pause theme music
  audio.theme.pause();
  
  const gameOverTitle = document.getElementById('gameOverTitle');
  const gameOverMessage = document.getElementById('gameOverMessage');
  
  if (finalScore > highScore) {
    highScore = finalScore;
    localStorage.setItem(getHighScoreKey(), highScore);
    document.getElementById('highScore').textContent = `HI: ${highScore}`;
    document.getElementById('highScore').style.color = '#60a5fa';
    document.getElementById('highScore').style.transform = 'scale(1)';
    
    // Show GAME OVER with high score message
    gameOverTitle.textContent = 'GAME OVER';
    gameOverTitle.classList.remove('new-high-score');
    gameOverMessage.innerHTML = `🏆 NEW HIGH SCORE! 🏆<br><span style="color: #fbbf24; font-size: 1.2rem; font-weight: bold; margin-top: 10px; display: block;">${finalScore}</span>`;
    
    // Play high score sound (if not already played during game)
    if (!highScoreSoundPlayed) {
      audio.highScore.currentTime = 0;
      audio.highScore.play().catch(e => console.log('Audio play failed:', e));
    }
  } else {
    // Show normal GAME OVER message
    gameOverTitle.textContent = 'GAME OVER';
    gameOverTitle.classList.remove('new-high-score');
    gameOverMessage.innerHTML = `Your final score: <span id="finalScore">${finalScore}</span>`;
    
    // Play game over sound
    audio.gameOver.currentTime = 0;
    audio.gameOver.play().catch(e => console.log('Audio play failed:', e));
  }
  
  document.getElementById('gameOver').style.display = 'block';
}

// Event listeners
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameStarted || !gameRunning) {
      startGame();
    } else {
      jump();
    }
  }
});

canvas.addEventListener('click', () => {
  if (!gameStarted || !gameRunning) {
    startGame();
  } else {
    jump();
  }
});

// Mobile touch support
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameStarted || !gameRunning) {
    startGame();
  } else {
    jump();
  }
});

// Prevent default touch behavior on the entire game container
document.getElementById('gameContainer').addEventListener('touchstart', (e) => {
  e.preventDefault();
}, { passive: false });

// Restart button with touch support
const restartBtn = document.getElementById('restartBtn');
const restartGame = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // Play jump sound as button click feedback
  audio.jump.currentTime = 0;
  audio.jump.play().catch(e => console.log('Audio play failed:', e));
  startGame();
};

restartBtn.addEventListener('click', restartGame);
restartBtn.addEventListener('touchend', restartGame);

// ==================== MODE SWITCHING ====================

const startScreen = document.getElementById('startScreen');
const multiplayerLobby = document.getElementById('multiplayerLobby');

// Listen for multiplayer toggle from parent window
window.addEventListener('message', (event) => {
  console.log('📨 Game received message:', event.data);
  
  if (event.data.action === 'toggle-multiplayer' || event.data.type === 'toggleMultiplayer') {
    console.log('🔄 Calling toggleMultiplayer()');
    toggleMultiplayer();
  } else if (event.data.type === 'quizAnswer') {
    // Handle answer from external quiz modal
    handleExternalQuizAnswer(event.data.correct);
  } else if (event.data.type === 'multiplayerAction') {
    // Handle multiplayer actions from external lobby
    handleExternalMultiplayerAction(event.data);
  }
});

function handleExternalQuizAnswer(isCorrect) {
  if (isCorrect) {
    // Correct answer - continue game
    obstacles = []; // Clear obstacles
    gamePaused = false;
    
    // In multiplayer, notify other players that this player resumed
    if (gameMode === 'multi' && socket) {
      socket.emit('player-resumed', { playerId: multiplayerState.myPlayerId });
    }
  } else {
    // Wrong answer
    if (gameMode === 'multi') {
      // Multiplayer: eliminate and spectate
      eliminatePlayer();
    } else {
      // Single player: game over
      endGame();
    }
  }
}

function handleExternalMultiplayerAction(data) {
  const { action, code } = data;
  
  switch(action) {
    case 'createRoom':
      const playerData = getPlayerData();
      socket.emit('create-room', playerData, (response) => {
        if (response.success) {
          multiplayerState.roomCode = response.roomCode;
          multiplayerState.myPlayerId = socket.id;
          multiplayerState.isHost = true;
          // Update external lobby UI
          window.parent.postMessage({
            type: 'lobbyUpdate',
            action: 'showRoom',
            roomCode: response.roomCode,
            isHost: true
          }, '*');
        }
      });
      break;
      
    case 'joinRoom':
      const playerData2 = getPlayerData();
      socket.emit('join-room', { roomCode: code, playerData: playerData2 }, (response) => {
        if (response.success) {
          multiplayerState.roomCode = response.roomCode;
          multiplayerState.myPlayerId = socket.id;
          multiplayerState.myLane = response.lane;
          window.parent.postMessage({
            type: 'lobbyUpdate',
            action: 'showRoom',
            roomCode: response.roomCode,
            isHost: false
          }, '*');
        } else {
          alert(response.error);
        }
      });
      break;
      
    case 'toggleReady':
      multiplayerState.isReady = !multiplayerState.isReady;
      socket.emit('player-ready', multiplayerState.isReady);
      window.parent.postMessage({
        type: 'lobbyUpdate',
        action: 'updateReady',
        isReady: multiplayerState.isReady
      }, '*');
      break;
      
    case 'startGame':
      socket.emit('start-game');
      break;
      
    case 'leaveRoom':
      socket.emit('leave-room');
      // Don't reset immediately - wait for 'left-room' event from server
      break;
      
    case 'closeLobby':
      gameMode = 'single';
      startScreen.style.display = 'block';
      multiplayerLobby.style.display = 'none';
      resetMultiplayerLobby();
      break;
  }
}

function toggleMultiplayer() {
  console.log('🎮 toggleMultiplayer called, current mode:', gameMode);
  
  // Check if Socket.IO is loaded
  if (typeof io === 'undefined') {
    console.error('❌ Socket.IO not loaded');
    alert('Multiplayer mode requires an active internet connection to the game server. Please ensure the backend server is running.');
    return;
  }
  
  if (gameMode === 'single') {
    console.log('➡️ Switching from single to multi');
    // Switch to multiplayer
    gameMode = 'multi';
    startScreen.style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('quizModal').style.display = 'none';
    
    // Check if mobile and in iframe - use external lobby
    const isMobile = window.innerWidth <= 768;
    const inIframe = window.self !== window.top;
    
    console.log('📱 isMobile:', isMobile, 'inIframe:', inIframe);
    
    if (isMobile && inIframe) {
      // Send message to parent to show external lobby
      console.log('📤 Sending showMultiplayerLobby to parent');
      window.parent.postMessage({ type: 'showMultiplayerLobby' }, '*');
    } else {
      console.log('🖥️ Showing internal lobby');
      console.log('multiplayerLobby element:', multiplayerLobby);
      multiplayerLobby.style.display = 'block';
    }
    
    // Initialize socket if not already done
    if (!socket) {
      const backendUrl = getBackendUrl();
      socket = io(backendUrl);
      initializeMultiplayerListeners();
    }
    
    // Update button text in parent via postMessage
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ 
        type: 'updateMultiplayerButton', 
        mode: 'multi',
        text: '👤 Single Player'
      }, '*');
    }
  } else {
    // Switch to single player
    gameMode = 'single';
    multiplayerLobby.style.display = 'none';
    startScreen.style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('spectatorOverlay').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    resetMultiplayerLobby();
    
    // Hide external multiplayer lobby if shown
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'hideMultiplayerLobby' }, '*');
      
      // Update button text in parent via postMessage
      window.parent.postMessage({ 
        type: 'updateMultiplayerButton', 
        mode: 'single',
        text: '👥 Multiplayer'
      }, '*');
    }
  }
}

// ==================== MULTIPLAYER FUNCTIONS ====================

function getPlayerData() {
  const token = localStorage.getItem('authToken') || new URLSearchParams(window.location.search).get('token');
  const username = localStorage.getItem('username') || 'Player';
  const avatarSrc = localStorage.getItem('avatarSrc') || '👤';
  return { username, avatarSrc, token };
}

function initializeMultiplayerListeners() {
  const createRoomBtn = document.getElementById('createRoomBtn');
  const joinRoomInput = document.getElementById('joinRoomInput');
  const joinRoomBtn = document.getElementById('joinRoomBtn');
  const readyBtn = document.getElementById('readyBtn');
  const startGameBtn = document.getElementById('startGameBtn');
  const leaveRoomBtn = document.getElementById('leaveRoomBtn');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const backToLobbyBtn = document.getElementById('backToLobbyBtn');

  // Create room
  const createRoomHandler = (e) => {
    e.preventDefault();
    const playerData = getPlayerData();
    socket.emit('create-room', playerData, (response) => {
      if (response.success) {
        multiplayerState.roomCode = response.roomCode;
        multiplayerState.myPlayerId = socket.id;
        multiplayerState.isHost = true;
        showRoomSection();
      }
    });
  };
  createRoomBtn.addEventListener('click', createRoomHandler);
  createRoomBtn.addEventListener('touchend', createRoomHandler);

  // Join room
  const joinRoomHandler = (e) => {
    e.preventDefault();
    const code = joinRoomInput.value.trim().toUpperCase();
    if (!code) return;
    
    const playerData = getPlayerData();
    socket.emit('join-room', { roomCode: code, playerData }, (response) => {
      if (response.success) {
        multiplayerState.roomCode = response.roomCode;
        multiplayerState.myPlayerId = socket.id;
        multiplayerState.myLane = response.lane;
        showRoomSection();
      } else {
        alert(response.error);
      }
    });
  };
  joinRoomBtn.addEventListener('click', joinRoomHandler);
  joinRoomBtn.addEventListener('touchend', joinRoomHandler);

  // Ready toggle
  const readyHandler = (e) => {
    e.preventDefault();
    multiplayerState.isReady = !multiplayerState.isReady;
    socket.emit('player-ready', multiplayerState.isReady);
    readyBtn.textContent = multiplayerState.isReady ? 'UNREADY' : 'READY';
    readyBtn.style.background = multiplayerState.isReady ? '#22c55e' : '#f97316';
  };
  readyBtn.addEventListener('click', readyHandler);
  readyBtn.addEventListener('touchend', readyHandler);

  // Start game (host only)
  const startGameHandler = (e) => {
    e.preventDefault();
    socket.emit('start-game');
  };
  startGameBtn.addEventListener('click', startGameHandler);
  startGameBtn.addEventListener('touchend', startGameHandler);

  // Leave room
  const leaveRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('leave-room');
    // Don't reset immediately - wait for 'left-room' event from server
  };
  leaveRoomBtn.addEventListener('click', leaveRoomHandler);
  leaveRoomBtn.addEventListener('touchend', leaveRoomHandler);

  // Play again
  const playAgainHandler = (e) => {
    e.preventDefault();
    console.log('🔄 Play again clicked');
    
    // Hide results screen
    document.getElementById('resultsScreen').style.display = 'none';
    
    // Reset game state
    resetGameForMultiplayer();
    
    // Reset ready status
    multiplayerState.isReady = false;
    
    // Emit player-ready false to server to reset ready state
    socket.emit('player-ready', false);
    
    // Update ready button text and color for non-hosts
    if (!multiplayerState.isHost) {
      const readyBtn = document.getElementById('readyBtn');
      readyBtn.textContent = 'READY';
      readyBtn.style.background = '#f97316';
    }
    
    // Show room section (lobby with players)
    showRoomSection();
    
    // Show multiplayer lobby
    const isMobile = window.innerWidth <= 768;
    const inIframe = window.self !== window.top;
    
    console.log('📱 isMobile:', isMobile, 'inIframe:', inIframe);
    
    if (isMobile && inIframe) {
      console.log('📤 Sending showMultiplayerLobby to parent');
      // Show external lobby
      window.parent.postMessage({ type: 'showMultiplayerLobby' }, '*');
      
      // Then update with room data
      setTimeout(() => {
        window.parent.postMessage({
          type: 'lobbyUpdate',
          action: 'showRoom',
          roomCode: multiplayerState.roomCode,
          isHost: multiplayerState.isHost
        }, '*');
      }, 100);
    } else {
      console.log('🖥️ Showing internal lobby');
      multiplayerLobby.style.display = 'block';
    }
  };
  playAgainBtn.addEventListener('click', playAgainHandler);
  playAgainBtn.addEventListener('touchend', playAgainHandler);

  // Back to lobby
  const backToLobbyHandler = (e) => {
    e.preventDefault();
    // Stop the game
    gameRunning = false;
    audio.theme.pause();
    // Hide results screen
    document.getElementById('resultsScreen').style.display = 'none';
    // Leave the room
    socket.emit('leave-room');
    // The 'left-room' event will handle showing the lobby
  };
  backToLobbyBtn.addEventListener('click', backToLobbyHandler);
  backToLobbyBtn.addEventListener('touchend', backToLobbyHandler);

  // Spectator leave button
  const spectatorLeaveBtn = document.getElementById('spectatorLeaveBtn');
  const spectatorLeaveHandler = (e) => {
    e.preventDefault();
    // Stop the game
    gameRunning = false;
    audio.theme.pause();
    // Hide spectator overlay
    document.getElementById('spectatorOverlay').style.display = 'none';
    // Leave the room
    socket.emit('leave-room');
    // The 'left-room' event will handle showing the lobby
  };
  spectatorLeaveBtn.addEventListener('click', spectatorLeaveHandler);
  spectatorLeaveBtn.addEventListener('touchend', spectatorLeaveHandler);

  // Socket events
  socket.on('players-updated', (data) => {
    multiplayerState.players.clear();
    data.players.forEach(p => {
      multiplayerState.players.set(p.id, p);
      if (p.id === multiplayerState.myPlayerId) {
        multiplayerState.myLane = p.lane;
      }
    });
    updatePlayersList(data.players);
    document.getElementById('playerCount').textContent = data.count;
    
    // Update external lobby on mobile
    const isMobile = window.innerWidth <= 768;
    const inIframe = window.self !== window.top;
    if (isMobile && inIframe) {
      window.parent.postMessage({
        type: 'lobbyUpdate',
        action: 'updatePlayers',
        players: data.players,
        playerCount: data.count
      }, '*');
    }
  });

  socket.on('can-start-game', (canStart) => {
    if (multiplayerState.isHost) {
      startGameBtn.disabled = !canStart;
      // Change button color: green when can start, gray when disabled
      startGameBtn.style.background = canStart ? '#22c55e' : '#6b7280';
      startGameBtn.style.cursor = canStart ? 'pointer' : 'not-allowed';
      
      // Update external lobby on mobile
      const isMobile = window.innerWidth <= 768;
      const inIframe = window.self !== window.top;
      if (isMobile && inIframe) {
        window.parent.postMessage({
          type: 'lobbyUpdate',
          action: 'canStart',
          canStart: canStart
        }, '*');
      }
    }
  });

  socket.on('game-starting', () => {
    startScreen.style.display = 'none';
    multiplayerLobby.style.display = 'none';
    document.getElementById('playersInfo').style.display = 'flex';
    
    // Hide external lobby on mobile
    const isMobile = window.innerWidth <= 768;
    const inIframe = window.self !== window.top;
    if (isMobile && inIframe) {
      window.parent.postMessage({ type: 'hideMultiplayerLobby' }, '*');
    }
  });

  socket.on('countdown-tick', (count) => {
    showCountdown(count);
  });

  socket.on('game-started', () => {
    startMultiplayerGame();
  });

  socket.on('obstacle-spawned', (obstacle) => {
    obstacles.push({
      x: canvas.width,
      y: obstacle.y,
      width: 40,
      height: obstacle.type === 'ground' ? 50 : 40,
      type: obstacle.type,
      color: obstacle.type === 'flying' ? '#ef4444' : '#dc2626'
    });
  });

  socket.on('player-moved', (data) => {
    const player = multiplayerState.players.get(data.playerId);
    if (player) {
      player.position = data.position;
      player.score = data.score;
      player.isPaused = false; // Player is moving, so not paused
    }
  });

  socket.on('player-paused', (data) => {
    const player = multiplayerState.players.get(data.playerId);
    if (player) {
      player.isPaused = true;
      player.position = data.position; // Update to paused position
    }
  });

  socket.on('player-resumed', (data) => {
    const player = multiplayerState.players.get(data.playerId);
    if (player) {
      player.isPaused = false;
    }
  });

  socket.on('player-eliminated', (data) => {
    console.log('📡 Received player-eliminated:', data);
    const player = multiplayerState.players.get(data.playerId);
    if (player) {
      player.isEliminated = true;
      player.score = data.score;
      console.log(`  - Marked player ${player.username} as eliminated`);
    }
    
    if (data.playerId === multiplayerState.myPlayerId) {
      console.log('  - This is ME getting eliminated');
      multiplayerState.spectating = true;
      document.getElementById('spectatorScore').textContent = data.score;
      
      // Check if this is the last active player
      const activePlayers = Array.from(multiplayerState.players.values()).filter(p => !p.isEliminated);
      const isLastPlayer = activePlayers.length === 0; // All players now eliminated
      
      console.log(`  - Active players after elimination: ${activePlayers.length}`);
      console.log(`  - Is last player: ${isLastPlayer}`);
      
      if (!isLastPlayer) {
        // Not the last player - show spectator overlay
        console.log('  - Showing spectator overlay');
        document.getElementById('spectatorOverlay').style.display = 'block';
        audio.gameOver.play();
      } else {
        console.log('  - Last player - waiting for game-ended event');
      }
      // If last player, wait for game-ended event
    } else {
      console.log(`  - Another player (${player ? player.username : 'unknown'}) was eliminated`);
    }
    
    updatePlayersInfo();
  });

  socket.on('game-ended', (data) => {
    console.log('🏁 Game ended event received!', data);
    console.log('  - Results:', data.results);
    gameRunning = false;
    audio.theme.pause();
    // Hide spectator overlay if it's showing
    console.log('  - Hiding spectator overlay');
    document.getElementById('spectatorOverlay').style.display = 'none';
    console.log('  - Showing multiplayer results');
    showMultiplayerResults(data.results);
    console.log('  - Submitting scores');
    submitMultiplayerScore(data.results);
  });

  socket.on('you-are-host', () => {
    multiplayerState.isHost = true;
    startGameBtn.style.display = 'inline-block';
    readyBtn.style.display = 'none';
    
    // Update external lobby on mobile
    const isMobile = window.innerWidth <= 768;
    const inIframe = window.self !== window.top;
    if (isMobile && inIframe) {
      window.parent.postMessage({
        type: 'lobbyUpdate',
        action: 'showRoom',
        roomCode: multiplayerState.roomCode,
        isHost: true
      }, '*');
    }
  });

  socket.on('left-room', () => {
    // Server confirmed we left, reset lobby to creation screen
    resetMultiplayerLobby();
    
    // Show the multiplayer lobby again
    const isMobile = window.innerWidth <= 768;
    const inIframe = window.self !== window.top;
    if (isMobile && inIframe) {
      window.parent.postMessage({
        type: 'lobbyUpdate',
        action: 'hideRoom'
      }, '*');
      window.parent.postMessage({ type: 'showMultiplayerLobby' }, '*');
    } else {
      multiplayerLobby.style.display = 'block';
    }
  });
}

function showRoomSection() {
  document.getElementById('roomCode').textContent = multiplayerState.roomCode;
  document.getElementById('roomSection').style.display = 'block';
  document.getElementById('createRoomBtn').disabled = true;
  document.getElementById('joinRoomInput').disabled = true;
  document.getElementById('joinRoomBtn').disabled = true;
  
  if (multiplayerState.isHost) {
    document.getElementById('startGameBtn').style.display = 'inline-block';
    document.getElementById('readyBtn').style.display = 'none';
  } else {
    // Non-host players show READY button
    document.getElementById('startGameBtn').style.display = 'none';
    document.getElementById('readyBtn').style.display = 'inline-block';
  }
}

function resetMultiplayerLobby() {
  // Hide room section and reset to lobby creation screen
  document.getElementById('roomSection').style.display = 'none';
  document.getElementById('createRoomBtn').disabled = false;
  document.getElementById('joinRoomInput').disabled = false;
  document.getElementById('joinRoomBtn').disabled = false;
  document.getElementById('joinRoomInput').value = '';
  document.getElementById('playersInfo').style.display = 'none';
  
  // Reset ready button styling
  const readyBtn = document.getElementById('readyBtn');
  readyBtn.textContent = 'READY';
  readyBtn.style.background = '#f97316';
  
  // Reset start button styling
  const startGameBtn = document.getElementById('startGameBtn');
  startGameBtn.style.background = '#6b7280';
  startGameBtn.disabled = true;
  
  // Reset multiplayer state
  multiplayerState = {
    myPlayerId: null,
    myLane: 0,
    roomCode: null,
    isHost: false,
    isReady: false,
    players: new Map(),
    spectating: false
  };
  
  resetGameForMultiplayer();
}

function resetGameForMultiplayer() {
  score = 0;
  gameSpeed = 3;
  obstacleTimer = 0;
  obstacleInterval = 150;
  obstacles = [];
  robot.y = ground - robot.height;
  robot.velocityY = 0;
  robot.jumping = false;
  robot.grounded = true;
  multiplayerState.spectating = false;
  document.getElementById('spectatorOverlay').style.display = 'none';
}

function startMultiplayerGame() {
  startScreen.style.display = 'none';
  multiplayerLobby.style.display = 'none';
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('spectatorOverlay').style.display = 'none';
  
  resetGameForMultiplayer();
  
  // Initialize all players' positions
  multiplayerState.players.forEach(player => {
    if (!player.position) {
      player.position = { x: robot.x, y: robot.y, velocityY: 0 };
    }
  });
  
  gameStarted = true;
  gameRunning = true;
  gamePaused = false;
  
  audio.theme.currentTime = 0;
  audio.theme.play().catch(e => console.log('Audio play failed:', e));
}

function updatePlayersList(playersList) {
  const listEl = document.getElementById('playersList');
  listEl.innerHTML = '';
  
  playersList.forEach(player => {
    const colorScheme = playerColors[player.lane] || playerColors[0];
    const li = document.createElement('li');
    li.className = 'player-item';
    
    if (player.isHost) {
      li.classList.add('host');
    } else if (player.ready) {
      li.classList.add('ready');
    }
    
    // Add color indicator
    const colorDot = document.createElement('span');
    colorDot.style.display = 'inline-block';
    colorDot.style.width = '12px';
    colorDot.style.height = '12px';
    colorDot.style.borderRadius = '50%';
    colorDot.style.background = colorScheme.main;
    colorDot.style.marginRight = '8px';
    colorDot.style.border = '2px solid ' + colorScheme.light;
    li.appendChild(colorDot);
    
    const name = document.createElement('span');
    name.textContent = player.username;
    li.appendChild(name);
    
    const badges = document.createElement('span');
    if (player.isHost) {
      badges.innerHTML = '<span class="host-badge">👑 HOST</span>';
    } else if (player.ready) {
      badges.innerHTML = '<span class="ready-badge">✓ READY</span>';
    }
    li.appendChild(badges);
    
    listEl.appendChild(li);
  });
}

function updatePlayersInfo() {
  const playersInfo = document.getElementById('playersInfo');
  playersInfo.innerHTML = '';
  
  // Convert to array and sort by lane
  const playersArray = Array.from(multiplayerState.players.values()).sort((a, b) => a.lane - b.lane);
  
  playersArray.forEach(player => {
    const colorScheme = playerColors[player.lane] || playerColors[0];
    const icon = document.createElement('div');
    icon.className = 'player-icon';
    icon.title = `${player.username}: ${player.score || 0}`;
    
    // Set background color based on player status
    if (player.isEliminated) {
      icon.style.background = '#6b7280'; // Gray for eliminated
      icon.classList.add('eliminated');
    } else {
      icon.style.background = colorScheme.main;
    }
    
    // Add border for self
    if (player.id === multiplayerState.myPlayerId) {
      icon.style.border = '2px solid #fbbf24';
      icon.style.boxShadow = '0 0 10px rgba(251, 191, 36, 0.5)';
    }
    
    // Add robot emoji or icon
    icon.innerHTML = '🤖';
    
    playersInfo.appendChild(icon);
  });
}

function eliminatePlayer() {
  const finalScore = Math.floor(score / 10);
  
  // Check if this is the last active player BEFORE emitting elimination
  const activePlayers = Array.from(multiplayerState.players.values()).filter(p => !p.isEliminated);
  const isLastPlayer = activePlayers.length === 1 && activePlayers[0].id === multiplayerState.myPlayerId;
  
  console.log('⚠️ eliminatePlayer called');
  console.log('  - Final score:', finalScore);
  console.log('  - Active players before:', activePlayers.length);
  console.log('  - My player ID:', multiplayerState.myPlayerId);
  console.log('  - Is last player:', isLastPlayer);
  console.log('  - All players:', Array.from(multiplayerState.players.values()).map(p => ({id: p.id, username: p.username, eliminated: p.isEliminated})));
  
  // Emit elimination to server
  if (socket) {
    console.log('  - Emitting player-eliminated to server');
    socket.emit('player-eliminated', { score: finalScore });
  }
  
  // Set spectator mode
  multiplayerState.spectating = true;
  document.getElementById('spectatorScore').textContent = finalScore;
  
  if (!isLastPlayer) {
    // Not the last player - show spectator overlay
    console.log('Showing spectator overlay');
    document.getElementById('spectatorOverlay').style.display = 'flex';
    
    // Show leave button in spectator overlay
    const leaveBtn = document.getElementById('spectatorLeaveBtn');
    if (leaveBtn) {
      leaveBtn.style.display = 'inline-block';
    }
    
    // Play game over sound
    audio.gameOver.currentTime = 0;
    audio.gameOver.play().catch(e => console.log('Audio play failed:', e));
  } else {
    console.log('Last player - waiting for game-ended event');
    // If last player, don't show spectator overlay - wait for game-ended event to show results
  }
  
  // Update players info
  updatePlayersInfo();
}

function showCountdown(count) {
  const countdownEl = document.createElement('div');
  countdownEl.className = 'countdown';
  countdownEl.textContent = count === 0 ? 'GO!' : count;
  document.getElementById('gameContainer').appendChild(countdownEl);
  
  setTimeout(() => {
    countdownEl.remove();
  }, 1000);
}

function showMultiplayerResults(results) {
  const resultsScreen = document.getElementById('resultsScreen');
  resultsScreen.style.display = 'flex';
  
  const podium = document.getElementById('podium');
  podium.innerHTML = '';
  
  const otherPlayersList = document.getElementById('otherPlayersList');
  otherPlayersList.innerHTML = '';
  
  // Show top 3 on podium
  results.slice(0, 3).forEach((player, index) => {
    const place = document.createElement('div');
    place.className = `podium-place ${['first', 'second', 'third'][index]}`;
    
    const medals = ['🥇', '🥈', '🥉'];
    
    place.innerHTML = `
      <div class="place-number">${medals[index]}</div>
      <div class="place-username">${player.username}</div>
      <div class="place-score">Score: ${player.score}</div>
      <div class="multiplier">x${player.multiplier} = ${player.finalScore}</div>
    `;
    
    podium.appendChild(place);
  });
  
  // Show remaining players
  if (results.length > 3) {
    document.getElementById('otherPlayers').style.display = 'block';
    
    results.slice(3).forEach(player => {
      const div = document.createElement('div');
      div.className = 'other-player';
      div.textContent = `${player.rank}. ${player.username} - ${player.score} (x${player.multiplier} = ${player.finalScore})`;
      otherPlayersList.appendChild(div);
    });
  }
}

async function submitMultiplayerScore(results) {
  const myResult = results.find(r => r.id === multiplayerState.myPlayerId);
  if (!myResult) return;
  
  const playerData = getPlayerData();
  if (!playerData.token) {
    console.log('No token found, skipping score submission');
    return;
  }
  
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/challenges/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${playerData.token}`
      },
      body: JSON.stringify({
        challengeId: 'cyber-runner',
        score: myResult.finalScore,
        maxScore: myResult.finalScore,
        level: myResult.rank
      })
    });
    
    if (response.ok) {
      console.log('Multiplayer score submitted successfully');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('Score submission failed:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to submit multiplayer score:', error);
  }
}

// Emit player updates in multiplayer mode
function emitPlayerUpdate() {
  if (gameMode === 'multi' && socket && !multiplayerState.spectating) {
    socket.emit('player-update', {
      position: { x: robot.x, y: robot.y, velocityY: robot.velocityY },
      score: Math.floor(score / 10)
    });
  }
}

// Multiplayer quiz answer handler
function answerQuizMultiplayer(selectedIndex) {
  const correct = selectedIndex === currentQuestion.correct;
  const buttons = document.querySelectorAll('.quiz-option');
  
  buttons[selectedIndex].classList.add(correct ? 'correct' : 'wrong');
  buttons[currentQuestion.correct].classList.add('correct');
  buttons.forEach(btn => btn.disabled = true);
  
  console.log(`📤 Emitting quiz-answer: correct=${correct}`);
  console.log(`  - Socket connected:`, socket && socket.connected);
  console.log(`  - Room code:`, multiplayerState.roomCode);
  if (socket && socket.connected) {
    socket.emit('quiz-answer', { correct });
    console.log(`  - quiz-answer emitted successfully`);
  } else {
    console.error('  - ❌ Socket not connected! Cannot emit quiz-answer');
  }
  
  if (correct) {
    audio.correctChoice.play();
    document.getElementById('quizFeedback').textContent = '✓ Correct! Continue running!';
    document.getElementById('quizFeedback').style.color = '#22c55e';
    
    setTimeout(() => {
      document.getElementById('quizModal').style.display = 'none';
      obstacles = []; // Clear obstacles
      gamePaused = false;
      socket.emit('player-resumed', { playerId: multiplayerState.myPlayerId });
    }, 1500);
  } else {
    audio.wrongChoice.play();
    document.getElementById('quizFeedback').textContent = '✗ Wrong! You are eliminated!';
    document.getElementById('quizFeedback').style.color = '#ef4444';
    
    setTimeout(() => {
      document.getElementById('quizModal').style.display = 'none';
      eliminatePlayer();
    }, 1500);
  }
}

// Add periodic player updates to game loop
let updateCounter = 0;
const originalGameLoop = gameLoop;
window.gameLoop = function() {
  originalGameLoop();
  
  if (gameMode === 'multi' && gameRunning) {
    updateCounter++;
    if (updateCounter >= 10) { // Update every 10 frames
      if (!multiplayerState.spectating) {
        emitPlayerUpdate();
      }
      updatePlayersInfo();
      updateCounter = 0;
    }
  }
};

// Start animation loop
gameLoop();
