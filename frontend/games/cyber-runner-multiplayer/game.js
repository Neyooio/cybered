// Cyber Runner Multiplayer Game Client
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Socket.IO connection - detect environment
const getBackendUrl = () => {
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
  return `http://${hostname}:4000`;
};

// Set API URL globally for leaderboard-utils
window.API_BASE_URL = getBackendUrl();

const socket = io(getBackendUrl());

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

audio.theme.loop = true;
audio.theme.volume = 0.3;
audio.jump.volume = 0.5;
audio.gameOver.volume = 0.6;
audio.highScore.volume = 0.7;
audio.correctChoice.volume = 0.6;
audio.wrongChoice.volume = 0.6;
audio.touch.volume = 0.7;

// Get player data from localStorage
function getPlayerData() {
  const token = localStorage.getItem('authToken') || new URLSearchParams(window.location.search).get('token');
  const username = localStorage.getItem('username') || 'Player';
  const avatarSrc = localStorage.getItem('avatarSrc') || '👤';
  
  return { username, avatarSrc, token };
}

// Game state
let gameState = 'lobby'; // lobby, countdown, playing, spectating, results
let myPlayerId = null;
let myLane = 0;
let roomCode = null;
let isHost = false;
let isReady = false;

// Players data
let players = new Map(); // playerId -> player object
let obstacles = [];

// Canvas settings
function resizeCanvas() {
  const container = document.getElementById('gameContainer');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Player constants
const LANE_HEIGHT = canvas.height / 5; // 5 lanes max
const ROBOT_WIDTH = 35;
const ROBOT_HEIGHT = 45;
const GRAVITY = 0.8;
const JUMP_VELOCITY = -15;
const GAME_SPEED = 5;

// Initialize my player
const myPlayer = {
  x: 50,
  y: 0,
  width: ROBOT_WIDTH,
  height: ROBOT_HEIGHT,
  velocityY: 0,
  jumping: false,
  grounded: true,
  score: 0,
  isEliminated: false
};

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
    question: "What does VPN stand for?",
    options: ["Virtual Private Network", "Very Private Network", "Virtual Protected Network", "Verified Private Network"],
    correct: 0
  },
  {
    question: "Which is NOT a type of cybersecurity threat?",
    options: ["Malware", "Firewall", "Phishing", "Ransomware"],
    correct: 1
  },
  {
    question: "What is two-factor authentication?",
    options: ["Two passwords", "Password + biometric", "Email + SMS", "Any two security methods"],
    correct: 3
  },
  {
    question: "What is encryption?",
    options: ["Hiding data", "Converting data to code", "Deleting data", "Copying data"],
    correct: 1
  },
  {
    question: "Which protocol is secure for web browsing?",
    options: ["HTTP", "HTTPS", "FTP", "SMTP"],
    correct: 1
  },
  {
    question: "What is a brute force attack?",
    options: ["Physical attack", "Trial-and-error password guessing", "Network flooding", "Social engineering"],
    correct: 1
  },
  {
    question: "What does SQL injection target?",
    options: ["Databases", "Firewalls", "Routers", "Email servers"],
    correct: 0
  },
  {
    question: "What is phishing?",
    options: ["Network scanning", "Fake emails to steal info", "Password guessing", "Virus spreading"],
    correct: 1
  },
  {
    question: "What is the purpose of antivirus software?",
    options: ["Speed up computer", "Detect and remove malware", "Manage passwords", "Encrypt files"],
    correct: 1
  },
  {
    question: "What does XSS stand for?",
    options: ["Cross-Site Scripting", "External System Security", "X-Ray Security Scan", "Extra Safe System"],
    correct: 0
  }
];

let currentQuiz = null;

// ==================== LOBBY SYSTEM ====================

// UI Elements
const lobbyScreen = document.getElementById('lobbyScreen');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomInput = document.getElementById('joinRoomInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomSection = document.getElementById('roomSection');
const roomCodeDisplay = document.getElementById('roomCode');
const playersList = document.getElementById('playersList');
const playerCount = document.getElementById('playerCount');
const readyBtn = document.getElementById('readyBtn');
const startGameBtn = document.getElementById('startGameBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const playersInfo = document.getElementById('playersInfo');
const spectatorOverlay = document.getElementById('spectatorOverlay');
const spectatorScore = document.getElementById('spectatorScore');
const resultsScreen = document.getElementById('resultsScreen');
const playAgainBtn = document.getElementById('playAgainBtn');
const backToLobbyBtn = document.getElementById('backToLobbyBtn');

// Create room
createRoomBtn.addEventListener('click', () => {
  const playerData = getPlayerData();
  socket.emit('create-room', playerData, (response) => {
    if (response.success) {
      roomCode = response.roomCode;
      myPlayerId = socket.id;
      isHost = true;
      showRoomSection();
    }
  });
});

// Join room
joinRoomBtn.addEventListener('click', () => {
  const code = joinRoomInput.value.trim().toUpperCase();
  if (!code) return;
  
  const playerData = getPlayerData();
  socket.emit('join-room', { roomCode: code, playerData }, (response) => {
    if (response.success) {
      roomCode = response.roomCode;
      myPlayerId = socket.id;
      myLane = response.lane;
      showRoomSection();
    } else {
      alert(response.error);
    }
  });
});

// Ready toggle
readyBtn.addEventListener('click', () => {
  isReady = !isReady;
  socket.emit('player-ready', isReady);
  readyBtn.textContent = isReady ? 'UNREADY' : 'READY';
  readyBtn.style.background = isReady ? '#22c55e' : '#f97316';
});

// Start game (host only)
startGameBtn.addEventListener('click', () => {
  socket.emit('start-game');
});

// Leave room
leaveRoomBtn.addEventListener('click', () => {
  socket.emit('leave-room');
  resetLobby();
});

// Play again
playAgainBtn.addEventListener('click', () => {
  hideResults();
  showRoomSection();
  resetGameState();
});

// Back to lobby
backToLobbyBtn.addEventListener('click', () => {
  socket.emit('leave-room');
  hideResults();
  resetLobby();
});

function showRoomSection() {
  roomCodeDisplay.textContent = roomCode;
  roomSection.style.display = 'block';
  createRoomBtn.disabled = true;
  joinRoomInput.disabled = true;
  joinRoomBtn.disabled = true;
  
  if (isHost) {
    startGameBtn.style.display = 'inline-block';
    readyBtn.style.display = 'none';
  }
}

function resetLobby() {
  lobbyScreen.classList.remove('hidden');
  roomSection.style.display = 'none';
  createRoomBtn.disabled = false;
  joinRoomInput.disabled = false;
  joinRoomBtn.disabled = false;
  joinRoomInput.value = '';
  roomCode = null;
  isHost = false;
  isReady = false;
  myPlayerId = null;
  readyBtn.textContent = 'READY';
  readyBtn.style.background = '#f97316';
  startGameBtn.style.display = 'none';
  readyBtn.style.display = 'inline-block';
  players.clear();
  obstacles = [];
}

function resetGameState() {
  myPlayer.score = 0;
  myPlayer.isEliminated = false;
  myPlayer.velocityY = 0;
  myPlayer.y = 0;
  gameState = 'lobby';
  obstacles = [];
  audio.theme.pause();
  audio.theme.currentTime = 0;
}

function hideResults() {
  resultsScreen.style.display = 'none';
}

// ==================== SOCKET EVENTS ====================

socket.on('players-updated', (data) => {
  players.clear();
  data.players.forEach(p => {
    players.set(p.id, p);
    if (p.id === myPlayerId) {
      myLane = p.lane;
    }
  });
  updatePlayersList(data.players);
  playerCount.textContent = data.count;
});

socket.on('can-start-game', (canStart) => {
  if (isHost) {
    startGameBtn.disabled = !canStart;
  }
});

socket.on('game-starting', () => {
  lobbyScreen.classList.add('hidden');
  gameState = 'countdown';
});

socket.on('countdown-tick', (count) => {
  showCountdown(count);
});

socket.on('game-started', () => {
  gameState = 'playing';
  myPlayer.y = getLaneGroundY(myLane) - myPlayer.height;
  myPlayer.grounded = true;
  audio.theme.play();
  gameLoop();
});

socket.on('obstacle-spawned', (obstacle) => {
  obstacles.push({
    ...obstacle,
    x: canvas.width,
    width: 30,
    height: obstacle.type === 'ground' ? 40 : 30
  });
});

socket.on('player-moved', (data) => {
  const player = players.get(data.playerId);
  if (player) {
    player.position = data.position;
    player.score = data.score;
  }
});

socket.on('player-eliminated', (data) => {
  const player = players.get(data.playerId);
  if (player) {
    player.isEliminated = true;
    player.score = data.score;
  }
  
  if (data.playerId === myPlayerId) {
    myPlayer.isEliminated = true;
    gameState = 'spectating';
    spectatorScore.textContent = data.score;
    spectatorOverlay.style.display = 'block';
    audio.gameOver.play();
  }
  
  updatePlayersInfo();
});

socket.on('game-ended', (data) => {
  gameState = 'results';
  audio.theme.pause();
  showResults(data.results);
  
  // Submit score to backend
  submitScore(data.results);
});

socket.on('you-are-host', () => {
  isHost = true;
  startGameBtn.style.display = 'inline-block';
  readyBtn.style.display = 'none';
});

socket.on('error-message', (message) => {
  alert(message);
});

// ==================== GAME MECHANICS ====================

function getLaneGroundY(lane) {
  return (lane + 1) * LANE_HEIGHT - 20;
}

function jump() {
  if (myPlayer.grounded && !myPlayer.isEliminated && gameState === 'playing') {
    myPlayer.velocityY = JUMP_VELOCITY;
    myPlayer.jumping = true;
    myPlayer.grounded = false;
    audio.jump.play();
  }
}

// Input handlers
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && gameState === 'playing') {
    e.preventDefault();
    jump();
  }
});

canvas.addEventListener('click', () => {
  if (gameState === 'playing') {
    jump();
  }
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (gameState === 'playing') {
    jump();
  }
});

function updatePhysics() {
  if (myPlayer.isEliminated) return;
  
  const laneGround = getLaneGroundY(myLane);
  
  // Apply gravity
  myPlayer.velocityY += GRAVITY;
  myPlayer.y += myPlayer.velocityY;
  
  // Ground collision
  if (myPlayer.y >= laneGround - myPlayer.height) {
    myPlayer.y = laneGround - myPlayer.height;
    myPlayer.velocityY = 0;
    myPlayer.jumping = false;
    myPlayer.grounded = true;
  }
  
  // Increase score
  myPlayer.score++;
  
  // Check obstacle collisions
  for (let obs of obstacles) {
    if (checkCollision(myPlayer, obs)) {
      handleCollision();
      break;
    }
  }
  
  // Emit position to server
  if (Date.now() % 5 === 0) { // Throttle updates
    socket.emit('player-update', {
      position: { x: myPlayer.x, y: myPlayer.y, velocityY: myPlayer.velocityY },
      score: myPlayer.score
    });
  }
}

function checkCollision(player, obstacle) {
  const playerInLane = Math.abs((player.y + player.height) - getLaneGroundY(myLane)) < 5;
  
  return player.x < obstacle.x + obstacle.width &&
         player.x + player.width > obstacle.x &&
         player.y < obstacle.y + obstacle.height &&
         player.y + player.height > obstacle.y &&
         playerInLane;
}

function handleCollision() {
  audio.touch.play();
  showQuizModal();
}

function showQuizModal() {
  gameState = 'quiz';
  currentQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
  
  document.getElementById('quizQuestion').textContent = currentQuiz.question;
  
  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';
  
  currentQuiz.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => answerQuiz(index);
    optionsContainer.appendChild(btn);
  });
  
  document.getElementById('quizModal').style.display = 'block';
}

function answerQuiz(selectedIndex) {
  const correct = selectedIndex === currentQuiz.correct;
  const buttons = document.querySelectorAll('.quiz-option');
  
  buttons[selectedIndex].classList.add(correct ? 'correct' : 'wrong');
  buttons[currentQuiz.correct].classList.add('correct');
  
  if (correct) {
    audio.correctChoice.play();
    document.getElementById('quizFeedback').textContent = '✓ Correct! Continue running!';
    document.getElementById('quizFeedback').style.color = '#22c55e';
    
    setTimeout(() => {
      document.getElementById('quizModal').style.display = 'none';
      gameState = 'playing';
    }, 1500);
  } else {
    audio.wrongChoice.play();
    document.getElementById('quizFeedback').textContent = '✗ Wrong! You are eliminated!';
    document.getElementById('quizFeedback').style.color = '#ef4444';
    
    setTimeout(() => {
      document.getElementById('quizModal').style.display = 'none';
      myPlayer.isEliminated = true;
      socket.emit('player-eliminated', { score: myPlayer.score });
    }, 1500);
  }
  
  console.log('📤 Emitting quiz-answer:', { correct });
  socket.emit('quiz-answer', { correct });
  
  buttons.forEach(btn => btn.disabled = true);
}

// ==================== RENDERING ====================

function drawLanes() {
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * LANE_HEIGHT);
    ctx.lineTo(canvas.width, i * LANE_HEIGHT);
    ctx.stroke();
  }
}

function drawRobot(x, y, color = '#60a5fa') {
  ctx.fillStyle = color;
  
  // Body
  ctx.fillRect(x + 10, y + 10, 20, 25);
  
  // Head
  ctx.fillRect(x + 12, y, 16, 10);
  
  // Arms
  ctx.fillRect(x + 5, y + 15, 5, 15);
  ctx.fillRect(x + 30, y + 15, 5, 15);
  
  // Legs (animated)
  const legOffset = Math.sin(Date.now() / 100) * 3;
  ctx.fillRect(x + 12, y + 35, 6, 10 + legOffset);
  ctx.fillRect(x + 22, y + 35, 6, 10 - legOffset);
  
  // Eyes
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 14, y + 3, 3, 3);
  ctx.fillRect(x + 23, y + 3, 3, 3);
}

function drawObstacle(obs) {
  if (obs.type === 'ground') {
    // Virus icon (ground)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height - 10);
  } else {
    // Flying virus
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayers() {
  players.forEach(player => {
    if (player.id === myPlayerId) return; // Don't draw self, we draw that separately
    
    const laneGround = getLaneGroundY(player.lane);
    const y = player.position?.y || (laneGround - ROBOT_HEIGHT);
    
    const color = player.isEliminated ? '#64748b' : '#22c55e';
    drawRobot(player.position?.x || 50, y, color);
    
    // Draw username above robot
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText(player.username, player.position?.x || 50, y - 5);
  });
  
  // Draw my robot
  if (!myPlayer.isEliminated) {
    drawRobot(myPlayer.x, myPlayer.y, '#fbbf24');
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (gameState === 'playing' || gameState === 'spectating' || gameState === 'quiz') {
    drawLanes();
    
    // Draw obstacles
    obstacles.forEach(obs => {
      obs.x -= GAME_SPEED;
      drawObstacle(obs);
    });
    
    // Remove off-screen obstacles
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    
    // Draw all players
    drawPlayers();
  }
}

function gameLoop() {
  if (gameState === 'playing') {
    updatePhysics();
  }
  
  render();
  updatePlayersInfo();
  
  if (gameState === 'playing' || gameState === 'spectating' || gameState === 'quiz') {
    requestAnimationFrame(gameLoop);
  }
}

// ==================== UI UPDATES ====================

function updatePlayersList(playersList) {
  playersList.innerHTML = '';
  
  playersList.forEach(player => {
    const li = document.createElement('li');
    li.className = 'player-item';
    
    if (player.isHost) {
      li.classList.add('host');
    } else if (player.ready) {
      li.classList.add('ready');
    }
    
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
    
    playersList.appendChild(li);
  });
}

function updatePlayersInfo() {
  playersInfo.innerHTML = '';
  
  players.forEach(player => {
    const div = document.createElement('div');
    div.className = 'player-info';
    
    if (player.isEliminated) {
      div.classList.add('eliminated');
    }
    if (player.id === myPlayerId) {
      div.classList.add('self');
    }
    
    div.innerHTML = `
      <span class="player-name">${player.username}</span>
      <span class="player-score">${player.score || 0}</span>
      ${player.isEliminated ? '<span class="player-status">ELIMINATED</span>' : ''}
    `;
    
    playersInfo.appendChild(div);
  });
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

function showResults(results) {
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

async function submitScore(results) {
  const myResult = results.find(r => r.id === myPlayerId);
  if (!myResult) return;
  
  const playerData = getPlayerData();
  if (!playerData.token) return;
  
  try {
    const response = await fetch(`${getBackendUrl()}/api/challenges/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${playerData.token}`
      },
      body: JSON.stringify({
        challengeId: 'cyber-runner-multiplayer',
        score: myResult.finalScore,
        level: myResult.rank
      })
    });
    
    if (response.ok) {
      console.log('Score submitted successfully');
    }
    
    // Submit to leaderboard
    if (typeof submitToLeaderboard === 'function') {
      submitToLeaderboard('Cyber Runner MP', myResult.finalScore, myResult.rank, 0);
    }
  } catch (error) {
    console.error('Failed to submit score:', error);
  }
}

// Initialize
resizeCanvas();
