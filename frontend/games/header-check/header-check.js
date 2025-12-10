/* Header Check game client scaffold */
(function () {
  // Splash screen interaction
  let splashReady = false;
  const splashScreen = document.getElementById('splashScreen');
  
  // Show prompt after loading bar completes
  setTimeout(() => {
    splashReady = true;
    const prompt = document.querySelector('.splash-prompt');
    if (prompt) prompt.classList.add('visible');
  }, 3000);

  // Handle splash dismiss on click/tap or space
  function dismissSplash() {
    if (!splashReady) return;
    splashScreen.classList.add('ready');
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 500);
  }

  splashScreen.addEventListener('click', dismissSplash);
  splashScreen.addEventListener('touchend', (e) => {
    e.preventDefault();
    dismissSplash();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && splashReady) {
      e.preventDefault();
      dismissSplash();
    }
  });

  const state = {
    gameId: null,
    playerId: null,
    turnNumber: 0,
    phase: 'lobby',
    endsAt: null,
    isGuard: false,
    hand: [],
    players: [],
    joined: false,
    sentThisPhase: false,
    currentPhase: 1,
    currentTurn: 1,
    actionPoints: 3,
    maxActionPoints: 3,
    isHost: false,
    isReady: false,
    firewallUsed: false,
    selectedCard: null,
    selectedAction: null,
  };

  const els = {
    phaseName: document.getElementById('phaseName'),
    countdown: document.getElementById('countdown'),
    turnNumber: document.getElementById('turnNumber'),
    lobby: document.getElementById('lobby'),
    hud: document.getElementById('hud'),
    joinSection: document.getElementById('joinSection'),
    roomSection: document.getElementById('roomSection'),
    playerGrid: document.getElementById('playerGrid'),
    roomCodeDisplay: document.getElementById('roomCodeDisplay'),
    playerCount: document.getElementById('playerCount'),
    roomCodeInput: document.getElementById('roomCodeInput'),
    createRoomBtn: document.getElementById('createRoomBtn'),
    joinRoomBtn: document.getElementById('joinRoomBtn'),
    addBotBtn: document.getElementById('addBotBtn'),
    leaveRoomBtn: document.getElementById('leaveRoomBtn'),
    leaveGameBtn: document.getElementById('leaveGameBtn'),
    startBtn: document.getElementById('startBtn'),
    hand: document.getElementById('hand'),
    toast: document.getElementById('toast'),
    rulesModal: document.getElementById('rulesModal'),
    closeRulesBtn: document.getElementById('closeRulesBtn'),
    phaseInfoModal: document.getElementById('phaseInfoModal'),
    phaseInfoBtn: document.getElementById('phaseInfoBtn'),
    closePhaseInfoBtn: document.getElementById('closePhaseInfoBtn'),
    phaseInfoTitle: document.getElementById('phaseInfoTitle'),
    phaseInfoBody: document.getElementById('phaseInfoBody'),
    gamePhase: document.getElementById('gamePhase'),
    gameTurnNumber: document.getElementById('gameTurnNumber'),
    playersBtn: document.getElementById('playersBtn'),
    leaveGameFieldBtn: document.getElementById('leaveGameFieldBtn'),
    countdownOverlay: document.getElementById('countdownOverlay'),
    shuffleOverlay: document.getElementById('shuffleOverlay'),
    phaseSplash: document.getElementById('phaseSplash'),
    headerCheckSplash: document.getElementById('headerCheckSplash'),
    sendEmailSplash: document.getElementById('sendEmailSplash'),
    cyberGuardSplash: document.getElementById('cyberGuardSplash'),
    scanBin: document.getElementById('scanBin'),
    sendBin: document.getElementById('sendBin'),
    playersDisplay: document.getElementById('playersDisplay'),
    cyberGuardModal: document.getElementById('cyberGuardModal'),
    cyberGuardYes: document.getElementById('cyberGuardYes'),
    cyberGuardNo: document.getElementById('cyberGuardNo'),
    targetPlayerName: document.getElementById('targetPlayerName'),
    questionModal: document.getElementById('questionModal'),
    questionText: document.getElementById('questionText'),
    questionChoices: document.getElementById('questionChoices'),
    eliminatedModal: document.getElementById('eliminatedModal'),
    eliminatedReturnBtn: document.getElementById('eliminatedReturnBtn'),
    turnNumber: document.getElementById('turnNumber'),
    apValue: document.getElementById('apValue'),
    phaseIndicator: document.getElementById('phaseIndicator'),
    actionButtons: document.getElementById('actionButtons'),
    scanBtn: document.getElementById('scanBtn'),
    firewallBtn: document.getElementById('firewallBtn'),
    phishingBtn: document.getElementById('phishingBtn'),
    firewallUsed: document.getElementById('firewallUsed'),
    timerValue: document.getElementById('timerValue'),
    timerBar: document.getElementById('timerBar'),
  };

  // Timer state
  let timerInterval = null;
  let timeRemaining = 30;

  // Game state additions
  let selectedCyberGuardTarget = null;
  let isCyberGuard = false;
  let cardToSend = null;
  
  // Player color rotation system (hidden mechanic)
  const playerColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  let currentPlayerColor = null; // Your current color
  let otherPlayersColors = []; // Colors visible to you (excluding your own)

  // Phase durations
  const phaseDurations = {
    1: 30, // Phase 1: Header Check - 30 seconds
    2: 20, // Phase 2: Email Exchange - 20 seconds
    3: 10  // Phase 3: Cyber Guard - 10 seconds
  };

  // Random cybersecurity questions pool
  const questions = [
    { question: "WHAT IS CYBERSECURITY?", choices: ["Protection of systems", "Video games", "Social media", "Email service"], correct: 0 },
    { question: "WHAT IS PHISHING?", choices: ["Catching fish", "Email scam", "Fishing sport", "Phone call"], correct: 1 },
    { question: "WHAT IS MALWARE?", choices: ["Good software", "Harmful software", "Hardware", "Network"], correct: 1 },
    { question: "WHAT IS A FIREWALL?", choices: ["Physical wall", "Security barrier", "Fire extinguisher", "Building material"], correct: 1 },
    { question: "WHAT IS ENCRYPTION?", choices: ["Deleting files", "Encoding data", "Backing up", "Downloading"], correct: 1 },
    { question: "WHAT IS TWO-FACTOR AUTH?", choices: ["One password", "Two passwords", "Extra security layer", "Username only"], correct: 2 },
    { question: "WHAT IS A VPN?", choices: ["Virus program", "Virtual private network", "Video player", "Voice protocol"], correct: 1 },
    { question: "WHAT IS RANSOMWARE?", choices: ["Free software", "Data hostage malware", "Security tool", "Backup system"], correct: 1 },
    { question: "WHAT IS SOCIAL ENGINEERING?", choices: ["Building bridges", "Manipulating people", "Software design", "Network setup"], correct: 1 },
    { question: "WHAT IS A ZERO-DAY ATTACK?", choices: ["No attack", "Unknown vulnerability exploit", "Scheduled attack", "Prevented attack"], correct: 1 },
  ];

  let usedQuestions = [];

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.remove('hidden');
    setTimeout(() => els.toast.classList.add('hidden'), 2000);
  }
  
  // Get player data from localStorage
  function getPlayerData() {
    const token = localStorage.getItem('authToken') || new URLSearchParams(window.location.search).get('token');
    const username = localStorage.getItem('username') || 'Player' + Math.floor(Math.random() * 1000);
    const avatarSrc = localStorage.getItem('avatarSrc') || '👤';
    
    return { username, avatarSrc, token };
  }

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

  // Connect to Socket.IO namespace
  const socket = io(getBackendUrl() + '/header-check');

  socket.on('connect', () => {
    console.log('[header-check] Connected to server:', socket.id);
    state.playerId = socket.id;
  });

  socket.on('disconnect', () => {
    console.log('[header-check] Disconnected from server');
  });

  socket.on('error-message', (message) => {
    showToast(message);
  });

  // Auto-uppercase room code input as user types
  els.roomCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
  
  // Socket.IO event listeners for multiplayer
  socket.on('players-updated', (data) => {
    state.players = data.players;
    renderPlayers();
    
    // Update player count
    const playerCountEl = document.getElementById('playerCount');
    if (playerCountEl) {
      playerCountEl.textContent = `${data.count}/6`;
    }
  });

  socket.on('can-start-game', (canStart) => {
    if (state.isHost) {
      els.startBtn.disabled = !canStart;
    }
  });

  socket.on('you-are-host', () => {
    state.isHost = true;
    els.startBtn.textContent = 'Start';
    els.startBtn.classList.remove('btn-secondary');
    els.startBtn.classList.add('btn-start');
  });

  socket.on('game-starting', () => {
    // Hide lobby, show game
    els.lobby.classList.add('hidden');
    els.hud.classList.remove('hidden');
    addGameLog('Game is starting!', 'system');
  });

  socket.on('countdown-tick', (count) => {
    // Show countdown
    const countdownEl = document.getElementById('phaseSplash');
    if (countdownEl) {
      countdownEl.querySelector('.phase-splash-text').textContent = String(count);
      countdownEl.classList.remove('hidden');
      setTimeout(() => countdownEl.classList.add('hidden'), 800);
    }
  });

  socket.on('turn-starting', (data) => {
    state.currentTurn = data.turnNumber;
    els.turnNumber.textContent = String(data.turnNumber);
    
    // Show turn splash
    showTurnSplash(data.turnNumber);
    addGameLog(`Turn ${data.turnNumber} starting`, 'system');
  });

  socket.on('phase-starting', (data) => {
    state.currentPhase = data.phase === 'phase1' ? 1 : data.phase === 'phase2' ? 2 : 3;
    state.phaseEndTime = data.endsAt;
    
    updatePhaseUI();
    startTimer(data.duration);
    
    const phaseName = data.phase === 'phase1' ? 'Header Check' : data.phase === 'phase2' ? 'Send Email' : 'Cyber Guard';
    addGameLog(`${phaseName} phase started`, 'system');
  });

  socket.on('turn-ending', () => {
    // Uncontain all cards
    state.hand.forEach(card => {
      if (card.contained) {
        card.contained = false;
      }
    });
    renderHand();
    addGameLog('Turn ended - contained cards uncontained', 'warning');
  });

  socket.on('player-eliminated-event', (data) => {
    if (data.playerId === state.playerId) {
      // You were eliminated
      showEliminatedModal();
    } else {
      addGameLog(`${data.username} was eliminated!`, 'warning');
    }
  });

  socket.on('game-ended', (data) => {
    addGameLog('Game has ended!', 'system');
    showResultsScreen(data.results);
  });

  socket.on('left-room', () => {
    // Reset to lobby
    resetToLobby();
  });

  // Bot management functions
  let botCounter = 0;

  function addBot() {
    if (!state.isHost) return;
    if (state.players.length >= 6) {
      showToast('Room is full!');
      return;
    }

    botCounter++;
    const botPlayer = {
      id: `bot-${Date.now()}-${botCounter}`,
      username: `Bot${botCounter}`,
      avatarSrc: '🤖',
      isBot: true,
      ready: true,
      isHost: false
    };

    state.players.push(botPlayer);
    renderPlayers();
    showToast(`Bot${botCounter} added`);
  }

  function removeBot(botId) {
    if (!state.isHost) return;

    const botIndex = state.players.findIndex(p => p.id === botId);
    if (botIndex > -1) {
      const botName = state.players[botIndex].username;
      state.players.splice(botIndex, 1);
      renderPlayers();
      showToast(`${botName} removed`);
    }
  }

  // Add bot button handler
  if (els.addBotBtn) {
    els.addBotBtn.addEventListener('click', addBot);
  }

  function addGameLog(message, type = 'system') {
    const logsContent = document.querySelector('.logs-content');
    if (!logsContent) return;
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    
    // Add type icon/prefix
    let prefix = '';
    switch(type) {
      case 'success': prefix = '✓ '; break;
      case 'warning': prefix = '⚠ '; break;
      case 'error': prefix = '✗ '; break;
      case 'system': prefix = '» '; break;
    }
    
    logEntry.textContent = prefix + message;
    logsContent.appendChild(logEntry);
    
    // Auto-scroll to bottom
    logsContent.scrollTop = logsContent.scrollHeight;
  }

  function showTurnSplash(turnNumber) {
    const splash = document.getElementById('phaseSplash');
    if (!splash) return;
    
    splash.querySelector('.phase-splash-text').textContent = `TURN ${turnNumber}`;
    splash.classList.remove('hidden');
    setTimeout(() => splash.classList.add('hidden'), 2000);
  }

  function updatePhaseUI() {
    const phaseNames = ['', 'Header Check', 'Send Email', 'Cyber Guard'];
    const phaseIndicator = document.getElementById('phaseIndicator');
    if (phaseIndicator) {
      phaseIndicator.textContent = `Phase ${state.currentPhase}: ${phaseNames[state.currentPhase]}`;
    }
    
    // Show/hide phase-specific UI elements
    const scanBin = document.getElementById('scanBin');
    const sendBin = document.getElementById('sendBin');
    const actionButtons = document.getElementById('actionButtons');
    
    if (state.currentPhase === 1) {
      if (scanBin) scanBin.classList.remove('hidden');
      if (sendBin) sendBin.classList.add('hidden');
      if (actionButtons) actionButtons.classList.remove('hidden');
    } else if (state.currentPhase === 2) {
      if (scanBin) scanBin.classList.add('hidden');
      if (sendBin) sendBin.classList.remove('hidden');
      if (actionButtons) actionButtons.classList.add('hidden');
    } else if (state.currentPhase === 3) {
      if (scanBin) scanBin.classList.add('hidden');
      if (sendBin) sendBin.classList.add('hidden');
      if (actionButtons) actionButtons.classList.add('hidden');
    }
  }

  function startTimer(duration) {
    const timerValue = document.getElementById('timerValue');
    const timerBar = document.getElementById('timerBar');
    if (!timerValue || !timerBar) return;
    
    const endTime = Date.now() + duration;
    
    function updateTimer() {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      timerValue.textContent = remaining;
      
      const progress = (remaining / (duration / 1000)) * 100;
      timerBar.style.width = `${progress}%`;
      
      if (remaining > 0) {
        requestAnimationFrame(updateTimer);
      }
    }
    
    updateTimer();
  }

  function showResultsScreen(results) {
    // Hide game UI
    els.hud.classList.add('hidden');
    
    // Show results modal or screen
    console.log('Game results:', results);
    alert('Game Ended!\n\n' + results.map(r => `${r.rank}. ${r.username} ${r.isEliminated ? '(Eliminated)' : '(Winner)'}`).join('\n'));
    
    // Return to lobby
    resetToLobby();
  }

  function setPhase(phase) {
    state.phase = phase;
    els.phaseName.textContent = phase === 'headerCheck' ? 'Header Check' : phase === 'sendMail' ? 'Send Mail' : phase === 'cyberGuard' ? 'Cyber Guard' : 'Lobby';
    // Phase-specific UI updates will be implemented later
  }

  function renderPlayers() {
    const maxSlots = 6;
    els.playerGrid.innerHTML = '';
    
    // Show/hide add bot button (only for host and if room not full)
    if (els.addBotBtn) {
      if (state.isHost && state.players.length < maxSlots) {
        els.addBotBtn.classList.remove('hidden');
      } else {
        els.addBotBtn.classList.add('hidden');
      }
    }
    
    // Fill with actual players
    state.players.forEach((p, idx) => {
      const slot = document.createElement('div');
      const isHost = p.isHost;
      const isBot = p.isBot;
      slot.className = `player-slot active ${isHost ? 'host' : ''} ${isBot ? 'bot' : ''}`;
      
      const playerLabel = p.username || `P${idx + 1}`;
      const badge = isHost ? 'HOST' : (isBot ? 'BOT' : '');
      const readyStatus = !isHost && !isBot ? (p.ready ? 'Ready' : 'Not Ready') : '';
      
      // Add remove button for bots (only for host)
      const removeBtn = (isBot && state.isHost) ? `<button class="bot-remove" data-bot-id="${p.id}">✕</button>` : '';
      
      slot.innerHTML = `
        ${removeBtn}
        <div class="player-avatar">${isBot ? '🤖' : (p.avatarSrc || playerLabel.substring(0, 2).toUpperCase())}</div>
        <div class="player-info">
          <div class="player-name">${playerLabel}</div>
          ${badge ? `<div class="player-badge ${isHost ? 'host-badge' : ''}">${badge}</div>` : ''}
          ${readyStatus ? `<div class="player-badge" style="color: ${p.ready ? '#22c55e' : '#ef4444'}">${readyStatus}</div>` : ''}
        </div>
      `;
      els.playerGrid.appendChild(slot);
    });
    
    // Add event listeners for bot remove buttons
    document.querySelectorAll('.bot-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const botId = btn.getAttribute('data-bot-id');
        removeBot(botId);
      });
    });
    
    // Fill empty slots
    for (let i = state.players.length; i < maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'player-slot empty';
      slot.innerHTML = `
        <div class="player-avatar">P${i + 1}</div>
        <div class="player-info">
          <div class="player-name">Waiting...</div>
        </div>
      `;
      els.playerGrid.appendChild(slot);
    }
    
    // Update player count
    els.playerCount.textContent = `${state.players.length}/${maxSlots}`;
    
    // Update start button for host (can start with 1+ players including bots)
    if (state.isHost) {
      els.startBtn.disabled = state.players.length < 1;
    }
  }

  function renderHand() {
    els.hand.innerHTML = '';
    state.hand.forEach((card, idx) => {
      const div = document.createElement('div');
      
      // Determine visual state
      let visualState = 'clean';
      let cardImage = '../../assets/images/Clean Email.png';
      
      if (card.disguised) {
        // Disguised infected appears as clean
        visualState = 'clean';
        cardImage = '../../assets/images/Clean Email.png';
      } else if (card.state === 'infected') {
        visualState = card.contained ? 'contained' : 'infected';
        cardImage = '../../assets/images/Infected Email.png';
      }
      
      div.className = `email-card ${visualState}`;
      div.dataset.cardId = card.cardId;
      div.draggable = true;
      
      div.innerHTML = `
        <img src="${cardImage}" alt="${visualState} email" class="card-image" />
        ${card.contained ? '<div class="contained-badge">CONTAINED</div>' : ''}
        ${card.disguised ? '<div class="disguised-indicator">?</div>' : ''}
      `;
      
      // Drag events
      div.ondragstart = (e) => {
        e.dataTransfer.setData('cardId', card.cardId);
        e.dataTransfer.setData('cardState', card.state);
        div.style.opacity = '0.5';
      };
      
      div.ondragend = (e) => {
        div.style.opacity = '1';
      };
      
      // Hover detection for automatic scanning (Phase 1 only)
      let isScanning = false; // Prevent multiple scans on same hover
      div.onmouseenter = () => {
        if (state.currentPhase !== 1) return;
        if (card.scanned) return; // Already scanned
        if (isScanning) return; // Currently processing scan
        
        // Check if card is infected or disguised (needs scanning)
        if (card.state === 'infected' || card.disguised) {
          // Check if player has enough AP
          if (state.actionPoints >= 1) {
            isScanning = true; // Lock to prevent double-scanning
            
            // Deduct 1 AP
            state.actionPoints--;
            updateActionPoints();
            
            // Mark as scanned
            card.scanned = true;
            
            // Show scan result
            if (card.state === 'infected' && !card.contained) {
              showToast('⚠ Scanned: Infected email detected! (-1 AP)');
              addGameLog('Infected email detected via scan', 'warning');
            } else if (card.disguised) {
              showToast('⚠ Scanned: Disguised phishing email! (-1 AP)');
              addGameLog('Disguised phishing email detected via scan', 'warning');
            } else if (card.contained) {
              showToast('ℹ Scanned: Already contained (-1 AP)');
              addGameLog('Contained email scanned', 'system');
            }
          } else {
            showToast('Not enough AP to scan!');
          }
        }
      };
      
      div.onclick = () => {
        if (state.phase !== 'sendMail') return;
        document.querySelectorAll('.email-card').forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
      };
      
      els.hand.appendChild(div);
    });
  }

  function setCountdown(endsAt) {
    state.endsAt = endsAt;
    function tick() {
      if (!state.endsAt) return;
      const ms = Math.max(0, state.endsAt - Date.now());
      const s = Math.floor(ms / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      els.countdown.textContent = `${mm}:${ss}`;
    }
    tick();
    const id = setInterval(() => {
      tick();
      if (Date.now() >= state.endsAt) clearInterval(id);
    }, 500);
  }

  // Create Room
  els.createRoomBtn.addEventListener('click', () => {
    console.log('[header-check] Create room button clicked');
    console.log('[header-check] Socket connected:', socket.connected);
    console.log('[header-check] Socket ID:', socket.id);
    
    if (!socket.connected) {
      showToast('Connecting to server...');
      console.error('[header-check] Socket not connected yet');
      return;
    }
    
    const playerData = getPlayerData();
    console.log('[header-check] Player data:', playerData);
    
    socket.emit('create-room', playerData, (response) => {
      console.log('[header-check] Create room response:', response);
      
      if (response.success) {
        state.gameId = response.roomCode;
        state.playerId = socket.id;
        state.isHost = true;
        state.joined = true;
        
        // Update UI
        els.roomCodeDisplay.textContent = state.gameId;
        els.joinSection.classList.add('hidden');
        els.roomSection.classList.remove('hidden');
        
        showToast('Room created: ' + state.gameId);
        console.log('[header-check] Room created:', state.gameId);
      } else {
        showToast('Failed to create room');
        console.error('[header-check] Room creation failed:', response);
      }
    });
  });

  // Join Room
  els.joinRoomBtn.addEventListener('click', () => {
    const code = (els.roomCodeInput.value || '').trim().toUpperCase();
    if (!code) return showToast('Enter room code');
    
    const playerData = getPlayerData();
    socket.emit('join-room', { roomCode: code, playerData }, (response) => {
      if (response.success) {
        state.gameId = response.roomCode;
        state.playerId = socket.id;
        state.isHost = false;
        state.joined = true;
        state.myColorIndex = response.colorIndex;
        
        // Update UI
        els.roomCodeDisplay.textContent = state.gameId;
        els.joinSection.classList.add('hidden');
        els.roomSection.classList.remove('hidden');
        
        // Change button to ready for non-host
        els.startBtn.textContent = 'Ready';
        els.startBtn.classList.remove('btn-start');
        els.startBtn.classList.add('btn-secondary');
        els.startBtn.disabled = false;
        
        showToast('Joined room: ' + code);
        console.log('[header-check] Joined room:', code);
      } else {
        showToast(response.error);
      }
    });
  });

  // Start/Ready Button Handler
  els.startBtn.addEventListener('click', () => {
    if (state.isHost) {
      // Host: Start game
      socket.emit('start-game');
    } else {
      // Player: Toggle ready
      state.isReady = !state.isReady;
      socket.emit('player-ready', state.isReady);
      
      // Update button appearance
      els.startBtn.textContent = state.isReady ? 'Unready' : 'Ready';
      els.startBtn.style.background = state.isReady ? '#22c55e' : '#f97316';
    }
  });

  // Leave Room Button
  els.leaveRoomBtn.addEventListener('click', () => {
    els.rulesModal.classList.remove('hidden');
  });

  // Leave Game Button (in-game)
  els.leaveGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the room?')) {
      socket.emit('leave-room');
    }
  });

  // Leave Game Field Button
  const leaveGameFieldBtn = document.getElementById('leaveGameFieldBtn');
  if (leaveGameFieldBtn) {
    leaveGameFieldBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to leave the game?')) {
        socket.emit('leave-room');
      }
    });
  }

  function resetToLobby() {
    state.gameId = null;
    state.playerId = null;
    state.joined = false;
    state.isHost = false;
    state.isReady = false;
    state.players = [];
    state.currentTurn = 1;
    state.currentPhase = 1;
    state.actionPoints = 3;
    state.hand = [];
    
    // Reset UI
    els.lobby.classList.remove('hidden');
    els.hud.classList.add('hidden');
    els.roomSection.classList.add('hidden');
    els.joinSection.classList.remove('hidden');
    els.roomCodeInput.value = '';
    els.startBtn.textContent = 'Start';
    els.startBtn.classList.add('btn-start');
    els.startBtn.classList.remove('btn-secondary');
    els.startBtn.disabled = true;
    
    showToast('Left room');
  }

  els.leaveGameBtn.addEventListener('click', () => {
    els.roomSection.classList.add('hidden');
    els.joinSection.classList.remove('hidden');
    state.players = [];
    state.joined = false;
    showToast('Left room');
  });

  els.closeRulesBtn.addEventListener('click', () => {
    els.rulesModal.classList.add('hidden');
  });

  // Close modal when clicking outside
  els.rulesModal.addEventListener('click', (e) => {
    if (e.target === els.rulesModal) {
      els.rulesModal.classList.add('hidden');
    }
  });

  // Phase Info Modal handlers
  els.phaseInfoBtn.addEventListener('click', () => {
    showPhaseInfo(1); // Show Phase 1 info
  });

  els.closePhaseInfoBtn.addEventListener('click', () => {
    els.phaseInfoModal.classList.add('hidden');
  });

  els.phaseInfoModal.addEventListener('click', (e) => {
    if (e.target === els.phaseInfoModal) {
      els.phaseInfoModal.classList.add('hidden');
    }
  });

  els.startBtn.addEventListener('click', () => {
    // If not host, toggle ready status
    if (!state.isHost) {
      state.isReady = !state.isReady;
      
      // Update player ready status
      const playerIndex = state.players.findIndex(p => p.id === state.playerId);
      if (playerIndex !== -1) {
        state.players[playerIndex].ready = state.isReady;
      }
      
      // Update localStorage
      const roomData = localStorage.getItem(`room_${state.gameId}`);
      if (roomData) {
        const room = JSON.parse(roomData);
        room.players = state.players;
        localStorage.setItem(`room_${state.gameId}`, JSON.stringify(room));
      }
      
      // Update button text
      els.startBtn.textContent = state.isReady ? 'Not Ready' : 'Ready';
      els.startBtn.classList.toggle('btn-success', state.isReady);
      els.startBtn.classList.toggle('btn-secondary', !state.isReady);
      
      // Re-render players to show updated status
      renderPlayers();
      showToast(state.isReady ? 'You are ready!' : 'You are not ready');
      return;
    }
    
    // Host: Start the game
    // Add bots if needed for solo testing
    const botsNeeded = Math.max(0, 6 - state.players.length);
    if (botsNeeded > 0) {
      const botNames = ['Agent Smith', 'Cyber Bot', 'Guardian AI', 'Sentinel', 'NetWatch', 'FirewallBot', 'Protocol', 'Cipher'];
      for (let i = 0; i < botsNeeded; i++) {
        const botId = 'bot-' + Math.random().toString(36).slice(2, 9);
        const botName = botNames[i % botNames.length] + (i >= botNames.length ? ` ${Math.floor(i / botNames.length) + 1}` : '');
        state.players.push({ id: botId, name: botName, isBot: true });
      }
      renderPlayers();
      showToast(`Added ${botsNeeded} bot player${botsNeeded > 1 ? 's' : ''}`);
    }
    
    // Start countdown animation
    startCountdownAnimation();
  });

  // Action Button Event Listeners
  // Scan is now automatic on hover - no button needed

  els.firewallBtn.addEventListener('click', () => {
    if (spendActionPoints(2)) {
      state.firewallUsed = true;
      updateActionButtons();
      showToast('Firewall activated! You will only receive clean emails this turn.');
      // Apply firewall effect (handled server-side in multiplayer)
    }
  });

  els.phishingBtn.addEventListener('click', () => {
    // Check if in Phase 2 and has infected cards
    if (state.currentPhase !== 2) {
      showToast('Phishing Attack is only available in Phase 2!');
      return;
    }
    
    const hasInfectedCards = state.hand.some(card => card.state === 'infected' && !card.contained);
    if (!hasInfectedCards) {
      showToast('You need infected cards to use Phishing Attack!');
      return;
    }
    
    if (spendActionPoints(2)) {
      state.selectedAction = 'phishing';
      showToast('Select an infected email to send via Phishing Attack, then drop it in the SEND bin');
      addGameLog('Phishing mode active - Drop infected card in SEND bin', 'system');
      // Card selection will trigger phishing action
    }
  });

  function startCountdownAnimation() {
    const countdownNumbers = [3, 2, 1];
    let currentIndex = 0;
    
    // Show countdown overlay
    els.countdownOverlay.classList.remove('hidden');
    const countdownNumber = els.countdownOverlay.querySelector('.countdown-number');
    
    function showNextNumber() {
      if (currentIndex < countdownNumbers.length) {
        countdownNumber.textContent = countdownNumbers[currentIndex];
        countdownNumber.style.animation = 'none';
        setTimeout(() => {
          countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
        }, 10);
        currentIndex++;
        setTimeout(showNextNumber, 1000);
      } else {
        // Hide countdown, initialize game (but don't show cards yet)
        els.countdownOverlay.classList.add('hidden');
        initializeGame();
      }
    }
    
    showNextNumber();
  }

  function initializeGame() {
    // Initialize game state
    state.currentTurn = 1;
    state.currentPhase = 1;
    state.actionPoints = 3;
    state.firewallUsed = false;
    
    // Initialize color rotation - assign random color to player
    currentPlayerColor = playerColors[Math.floor(Math.random() * playerColors.length)];
    // Other players get the remaining 4 colors (excluding yours)
    otherPlayersColors = playerColors.filter(c => c !== currentPlayerColor);
    
    // Render colored player icons
    renderPlayerIcons();
    
    // Randomly select ONE player to have infected email
    const hasInfectedEmail = Math.random() < (1 / state.players.length) || state.players.length <= 1;
    
    // Initialize hand with 5 cards
    state.hand = [];
    const infectedCardIndex = hasInfectedEmail ? Math.floor(Math.random() * 5) : -1;
    
    for (let i = 0; i < 5; i++) {
      state.hand.push({
        cardId: 'card-' + i,
        state: i === infectedCardIndex ? 'infected' : 'clean',
        contained: false,
        disguised: false,
        scanned: false
      });
    }
    
    // Show game field but WITHOUT cards yet
    els.lobby.classList.add('hidden');
    els.hud.classList.remove('hidden');
    
    // Update UI
    updateTurnDisplay();
    updatePhaseDisplay();
    updateActionPoints();
    
    // Hide game logs initially
    const logsContent = document.querySelector('.logs-content');
    if (logsContent) {
      logsContent.style.display = 'none';
    }
    
    // Start shuffle animation after a short delay
    setTimeout(() => {
      startShuffleAnimation();
    }, 500);
  }

  function startShuffleAnimation() {
    // Show shuffle overlay
    els.shuffleOverlay.classList.remove('hidden');
    
    // After 3 seconds of shuffling, show Phase 1 splash
    setTimeout(() => {
      els.shuffleOverlay.classList.add('hidden');
      showPhaseSplash();
    }, 3000);
  }

  function showPhaseSplash() {
    // Show phase splash screen (no fade, just display)
    els.phaseSplash.classList.remove('hidden');
    
    // After 2 seconds, show Header Check splash
    setTimeout(() => {
      els.phaseSplash.classList.add('hidden');
      showHeaderCheckSplash();
    }, 2000);
  }

  function showHeaderCheckSplash() {
    // Show Header Check splash screen
    els.headerCheckSplash.classList.remove('hidden');
    
    // After 2 seconds, hide it and activate game
    setTimeout(() => {
      els.headerCheckSplash.classList.add('hidden');
      activateGame();
    }, 2000);
  }

  function activateGame() {
    // Render cards (now they appear)
    renderHand();
    
    // Show game logs in right sidebar
    const logsContent = document.querySelector('.logs-content');
    if (logsContent) {
      logsContent.style.display = 'flex';
    }
    
    // Start Phase 1 timer
    startTimer(1);
    addGameLog('Phase 1 started - Hover over cards to auto-scan (1 AP each)', 'system');
    
    // Log initial infection status
    const hasInfected = state.hand.some(c => c.state === 'infected');
    if (hasInfected) {
      addGameLog('You received 1 infected email!', 'warning');
    } else {
      addGameLog('You have all clean emails!', 'success');
    }
  }
  
  function renderPlayerIcons() {
    els.playersDisplay.innerHTML = '';
    
    // Show only 5 colors (excluding your own)
    otherPlayersColors.forEach((color, idx) => {
      const icon = document.createElement('div');
      icon.className = 'player-icon';
      icon.setAttribute('data-color', color);
      icon.setAttribute('data-player', idx + 1);
      icon.style.backgroundColor = getColorValue(color);
      icon.style.border = '3px solid ' + getColorValue(color);
      icon.style.width = '50px';
      icon.style.height = '50px';
      icon.style.borderRadius = '50%';
      icon.style.cursor = 'pointer';
      icon.style.transition = 'all 0.3s';
      
      els.playersDisplay.appendChild(icon);
    });
  }
  
  function getColorValue(color) {
    const colorMap = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#22c55e',
      'yellow': '#eab308',
      'purple': '#a855f7',
      'orange': '#f97316'
    };
    return colorMap[color] || '#666';
  }

  function showPhaseInfo(phase) {
    // Phase information content
    const phaseData = {
      1: {
        title: 'Phase 1: Header Check',
        content: `
          <p><strong>Duration:</strong> 30 seconds</p>
          <p><strong>Action Points:</strong> 3 AP per turn</p>
          
          <p><strong>Objective:</strong> Scan and contain infected emails before they spread.</p>
          
          <p><strong>Setup:</strong></p>
          <ul>
            <li>At game start, ONE random player receives 1 infected email</li>
            <li>All other players start with clean emails</li>
            <li>Each player has 5 email cards total</li>
          </ul>
          
          <p><strong>Actions Available:</strong></p>
          <ul>
            <li><strong>SCAN EMAIL (1 AP)</strong> - Drag infected card to scan bin, answer cybersecurity question correctly to CONTAIN it (stops spreading but stays infected)</li>
            <li><strong>FIREWALL (2 AP, 1 use per game)</strong> - Only receive clean emails this turn</li>
            <li><strong>PHISHING ATTACK (2 AP)</strong> - Send infected email to another player, appears clean to them until scanned</li>
          </ul>
          
          <p><strong>Important Rules:</strong></p>
          <ul>
            <li>✓ Correct answer = Email CONTAINED (won't spread)</li>
            <li>✗ Wrong answer = 1 clean card gets infected immediately</li>
            <li>⚠ Unscanned infected emails = Spread to 2 cards at phase end</li>
            <li>Contained infected cards DON'T count toward elimination</li>
          </ul>
          
          <p><strong>Elimination:</strong> If all 5 cards become uncontained infected, you're eliminated!</p>
        `
      },
      2: {
        title: 'Phase 2: Email Exchange',
        content: `
          <p><strong>Duration:</strong> 20 seconds</p>
          
          <p><strong>Objective:</strong> Strategically send emails to eliminate opponents.</p>
          
          <p><strong>How It Works:</strong></p>
          <ul>
            <li>MANDATORY - Every player MUST send 1 email card</li>
            <li>Drag your chosen card to the SEND BIN</li>
            <li>Recipients are assigned through HIDDEN ROTATION (anonymous)</li>
            <li>You don't know who sent you emails or who receives yours</li>
          </ul>
          
          <p><strong>Strategy Tips:</strong></p>
          <ul>
            <li>Send infected emails to spread the threat</li>
            <li>Send clean emails to stay safe</li>
            <li>Cards from Phishing Attacks appear clean to recipients</li>
            <li>Use Firewall ability before this phase to only receive clean emails</li>
          </ul>
          
          <p><strong>After Exchange:</strong> Check your new hand and prepare for Phase 3!</p>
        `
      },
      3: {
        title: 'Phase 3: Cyber Guard',
        content: `
          <p><strong>Duration:</strong> 10 seconds</p>
          
          <p><strong>Objective:</strong> Identify players with uncontained infected emails.</p>
          
          <p><strong>How It Works:</strong></p>
          <ul>
            <li>System randomly selects ONE player as Cyber Guard</li>
            <li>Cyber Guard makes ONE guess on which player has uncontained infected emails</li>
            <li>All other players wait for the Cyber Guard's decision</li>
          </ul>
          
          <p><strong>If Cyber Guard Guesses CORRECTLY:</strong></p>
          <ul>
            <li>✓ Cyber Guard: 1 infected card becomes clean</li>
            <li>✗ Target Player: Receives 1 new infected email</li>
          </ul>
          
          <p><strong>If Cyber Guard Guesses WRONG:</strong></p>
          <ul>
            <li>✗ Cyber Guard: Receives 1 infected email as penalty</li>
            <li>Target Player: No effect</li>
          </ul>
          
          <p><strong>Special Cases:</strong></p>
          <ul>
            <li>If Cyber Guard has no infected emails, no reward given</li>
            <li>If target has no infected emails, guess automatically fails</li>
          </ul>
          
          <p><strong>Strategy Tip:</strong> Watch game logs and player actions in previous phases!</p>
        `
      }
    };

    const data = phaseData[phase] || phaseData[1];
    els.phaseInfoTitle.textContent = data.title;
    els.phaseInfoBody.innerHTML = data.content;
    els.phaseInfoModal.classList.remove('hidden');
  }

  // UI Update Functions
  function updateActionPoints() {
    els.apValue.textContent = state.actionPoints;
    
    // Update button states based on AP
    updateActionButtons();
  }

  function updateActionButtons() {
    // Scan button - Phase 1 only
    els.scanBtn.disabled = state.actionPoints < 1 || state.currentPhase !== 1;
    
    // Firewall button - Phase 1 only
    els.firewallBtn.disabled = state.actionPoints < 2 || state.firewallUsed || state.currentPhase !== 1;
    if (state.firewallUsed) {
      els.firewallUsed.classList.remove('hidden');
    }
    
    // Phishing button - only usable in Phase 2 if player has infected cards
    const hasInfectedCards = state.hand.some(card => card.state === 'infected' && !card.contained);
    const isPhase2 = state.currentPhase === 2;
    els.phishingBtn.disabled = state.actionPoints < 2 || !isPhase2 || !hasInfectedCards;
    
    // Update phishing button opacity
    if (state.currentPhase === 1) {
      els.phishingBtn.style.opacity = '0.3';
    } else if (!isPhase2 || !hasInfectedCards) {
      els.phishingBtn.style.opacity = '0.4';
    } else {
      els.phishingBtn.style.opacity = '1';
    }
    
    // Show/hide action buttons based on phase
    if (state.currentPhase === 1) {
      // Phase 1: Show Scan and Firewall, hide Phishing
      els.actionButtons.style.display = 'flex';
      els.scanBtn.style.display = 'flex';
      els.firewallBtn.style.display = 'flex';
      els.phishingBtn.style.display = 'none';
    } else if (state.currentPhase === 2) {
      // Phase 2: Show only Phishing
      els.actionButtons.style.display = 'flex';
      els.scanBtn.style.display = 'none';
      els.firewallBtn.style.display = 'none';
      els.phishingBtn.style.display = 'flex';
    } else {
      // Phase 3: Hide all action buttons
      els.actionButtons.style.display = 'none';
    }
  }

  function updatePhaseDisplay() {
    const phaseNames = {
      1: 'Phase 1: Header Check',
      2: 'Phase 2: Email Exchange',
      3: 'Phase 3: Cyber Guard'
    };
    els.phaseIndicator.textContent = phaseNames[state.currentPhase] || 'Phase 1: Header Check';
  }

  function updateTurnDisplay() {
    els.turnNumber.textContent = state.currentTurn;
  }

  function startTimer(phase) {
    // Clear existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Set duration based on phase
    const duration = phaseDurations[phase] || 30;
    timeRemaining = duration;
    
    // Update display
    updateTimerDisplay();
    
    // Start countdown
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();
      
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        onTimerEnd();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (els.timerValue) {
      els.timerValue.textContent = timeRemaining;
      
      // Add warning class when time is low
      if (timeRemaining <= 5) {
        els.timerValue.classList.add('warning');
      } else {
        els.timerValue.classList.remove('warning');
      }
      
      // Update progress bar
      const phase = state.currentPhase;
      const maxTime = phaseDurations[phase] || 30;
      const percentage = (timeRemaining / maxTime) * 100;
      
      if (els.timerBar) {
        els.timerBar.style.width = percentage + '%';
      }
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function onTimerEnd() {
    addGameLog(`Phase ${state.currentPhase} ended - Time expired`, 'system');
    
    // Handle phase-specific end logic
    if (state.currentPhase === 1) {
      handleUnscannedInfectedSpread();
      transitionToPhase2();
    } else if (state.currentPhase === 2) {
      handleEmailDistribution();
      transitionToPhase3();
    } else if (state.currentPhase === 3) {
      handlePhase3End();
    }
  }

  function transitionToPhase2() {
    // Stop timer
    stopTimer();
    
    // Hide Phase 1 elements
    els.scanBin.classList.add('hidden');
    els.actionButtons.style.display = 'none';
    
    // Hide all splash screens first
    els.phaseSplash.classList.add('hidden');
    els.headerCheckSplash.classList.add('hidden');
    els.sendEmailSplash.classList.add('hidden');
    els.cyberGuardSplash.classList.add('hidden');
    
    // Show Phase 2 splash
    setTimeout(() => {
      els.phaseSplash.classList.remove('hidden');
      els.phaseSplash.querySelector('.phase-splash-text').textContent = 'PHASE 2';
      
      setTimeout(() => {
        els.phaseSplash.classList.add('hidden');
        
        // Show Send Email splash
        els.sendEmailSplash.classList.remove('hidden');
        
        setTimeout(() => {
          els.sendEmailSplash.classList.add('hidden');
          
          // Activate Phase 2
          state.currentPhase = 2;
          updatePhaseDisplay();
          updateActionButtons();
          updateActionPoints();
          
          // Show send bin and reset its state
          els.sendBin.classList.remove('hidden');
          els.sendBin.style.opacity = '1';
          els.sendBin.style.cursor = 'pointer';
          
          addGameLog('Phase 2: Send Email - Drop a card in the bin to send', 'system');
          startTimer(2);
          
          // Enable card sending
          setupSendBinDragDrop();
        }, 2000);
      }, 2000);
    }, 100);
  }

  function transitionToPhase3() {
    // Stop timer
    stopTimer();
    
    // Hide Phase 2 elements
    els.sendBin.classList.add('hidden');
    
    // Hide all splash screens first
    els.phaseSplash.classList.add('hidden');
    els.headerCheckSplash.classList.add('hidden');
    els.sendEmailSplash.classList.add('hidden');
    els.cyberGuardSplash.classList.add('hidden');
    
    // Show Phase 3 splash
    setTimeout(() => {
      els.phaseSplash.classList.remove('hidden');
      els.phaseSplash.querySelector('.phase-splash-text').textContent = 'PHASE 3';
      
      setTimeout(() => {
        els.phaseSplash.classList.add('hidden');
        
        // Show Cyber Guard splash
        els.cyberGuardSplash.classList.remove('hidden');
        
        setTimeout(() => {
          els.cyberGuardSplash.classList.add('hidden');
          
          // Activate Phase 3
          state.currentPhase = 3;
          updatePhaseDisplay();
          
          // Randomly select cyber guard (for demo, assume player 1 is cyber guard)
          isCyberGuard = true; // TODO: This should be determined by server
          
          if (isCyberGuard) {
            addGameLog('You are the Cyber Guard!', 'success');
            addGameLog('Click a player to check if they have infected emails', 'system');
            activateCyberGuardMode();
          } else {
            addGameLog('Phase 3: Cyber Guard is investigating...', 'system');
          }
          
          startTimer(3);
        }, 2000);
      }, 2000);
    }, 100);
  }

  function handlePhase3End() {
    // Stop timer
    stopTimer();
    
    // Deactivate cyber guard mode
    deactivateCyberGuardMode();
    
    // Check for elimination before ending turn
    checkElimination();
    
    addGameLog('═══ TURN END ═══', 'system');
    
    // Hide all splash screens first
    els.phaseSplash.classList.add('hidden');
    els.headerCheckSplash.classList.add('hidden');
    els.sendEmailSplash.classList.add('hidden');
    els.cyberGuardSplash.classList.add('hidden');
    
    // Show Turn End splash
    setTimeout(() => {
      els.phaseSplash.classList.remove('hidden');
      els.phaseSplash.querySelector('.phase-splash-text').textContent = 'TURN END';
      
      setTimeout(() => {
        els.phaseSplash.classList.add('hidden');
        
        // Show "Preparing" splash
        setTimeout(() => {
          els.phaseSplash.classList.remove('hidden');
          els.phaseSplash.querySelector('.phase-splash-text').textContent = 'PREPARING...';
          
          setTimeout(() => {
            els.phaseSplash.classList.add('hidden');
            startNextTurn();
          }, 1500);
        }, 100);
      }, 1500);
    }, 500);
  }
  
  function startNextTurn() {
    // Reset for next turn
    state.currentTurn++;
    state.currentPhase = 1;
    state.actionPoints = 3; // Reset to 3 AP
    state.maxActionPoints = 3;
    // DON'T reset firewallUsed - it's once per game, not per turn
    isCyberGuard = false;
    
    // Rotate player colors - assign new random color
    currentPlayerColor = playerColors[Math.floor(Math.random() * playerColors.length)];
    otherPlayersColors = playerColors.filter(c => c !== currentPlayerColor);
    
    // Re-render player icons with new colors
    renderPlayerIcons();
    
    // Reset card states for new turn
    state.hand.forEach(card => {
      card.scanned = false;
      // Uncontain all contained emails at turn end
      if (card.contained) {
        card.contained = false;
      }
    });
    
    updateTurnDisplay();
    updatePhaseDisplay();
    updateActionButtons();
    updateActionPoints();
    
    // Hide all splash screens and Phase 3 elements
    els.phaseSplash.classList.add('hidden');
    els.headerCheckSplash.classList.add('hidden');
    els.sendEmailSplash.classList.add('hidden');
    els.cyberGuardSplash.classList.add('hidden');
    els.sendBin.classList.add('hidden');
    
    // Show Phase 1 elements
    els.scanBin.classList.remove('hidden');
    els.actionButtons.style.display = 'flex';
    
    renderHand();
    addGameLog(`Turn ${state.currentTurn} - Phase 1 begins`, 'system');
    startTimer(1);
  }

  function handleUnscannedInfectedSpread() {
    // Find all UNSCANNED, uncontained infected cards
    const unscannedInfected = state.hand.filter(c => 
      c.state === 'infected' && !c.contained && !c.scanned
    );
    
    if (unscannedInfected.length === 0) {
      return;
    }
    
    let totalNewInfections = 0;
    
    unscannedInfected.forEach(infectedCard => {
      // Each unscanned infected spreads to 2 clean cards
      const cleanCards = state.hand.filter(c => c.state === 'clean' && !c.disguised);
      
      for (let i = 0; i < 2 && cleanCards.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * cleanCards.length);
        const targetCard = cleanCards[randomIndex];
        targetCard.state = 'infected';
        targetCard.contained = false;
        targetCard.scanned = false;
        cleanCards.splice(randomIndex, 1); // Remove from available targets
        totalNewInfections++;
      }
    });
    
    if (totalNewInfections > 0) {
      showToast(`⚠ ${unscannedInfected.length} unscanned infected email(s) spread!`);
      addGameLog(`${unscannedInfected.length} unscanned infected spread to ${totalNewInfections} clean cards`, 'warning');
      addGameLog('Tip: Hover over suspicious cards in Phase 1 to scan them', 'system');
      renderHand();
      checkElimination();
    }
  }

  function spendActionPoints(cost) {
    if (state.actionPoints >= cost) {
      state.actionPoints -= cost;
      updateActionPoints();
      return true;
    }
    showToast('Not enough Action Points!');
    return false;
  }

  function resetActionPoints() {
    state.actionPoints = state.maxActionPoints;
    updateActionPoints();
  }

  // Setup scan bin drag and drop for containment (answer questions)
  if (els.scanBin) {
    els.scanBin.ondragover = (e) => {
      e.preventDefault();
      els.scanBin.classList.add('drag-over');
    };
    
    els.scanBin.ondragleave = () => {
      els.scanBin.classList.remove('drag-over');
    };
    
    els.scanBin.ondrop = (e) => {
      e.preventDefault();
      els.scanBin.classList.remove('drag-over');
      
      const cardId = e.dataTransfer.getData('cardId');
      
      // Find the card in hand
      const card = state.hand.find(c => c.cardId === cardId);
      
      if (!card) {
        showToast('Card not found!');
        return;
      }
      
      // Only allow containing infected or disguised cards that have been scanned
      if ((card.state === 'infected' || card.disguised) && card.scanned) {
        if (card.contained) {
          showToast('This email is already contained.');
          return;
        }
        
        // Show question modal to attempt containment
        state.currentScannedCard = card;
        showRandomQuestion(card);
      } else if (!card.scanned) {
        showToast('Hover over the card first to scan it!');
      } else {
        showToast('This email is clean. No need to contain.');
      }
    };
  }

  function getRandomQuestion() {
    // Reset used questions if all have been used
    if (usedQuestions.length >= questions.length) {
      usedQuestions = [];
    }
    
    // Get unused questions
    const availableQuestions = questions.filter((q, idx) => !usedQuestions.includes(idx));
    
    // Pick random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Mark as used
    const originalIndex = questions.indexOf(selectedQuestion);
    usedQuestions.push(originalIndex);
    
    return selectedQuestion;
  }

  function showRandomQuestion(card) {
    const question = getRandomQuestion();
    
    els.questionText.textContent = question.question;
    els.questionChoices.innerHTML = '';
    
    question.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}</strong><br>${choice}`; // A: answer text
      btn.dataset.choice = idx;
      
      btn.onclick = () => {
        const isCorrect = parseInt(btn.dataset.choice) === question.correct;
        handleScanAnswer(card, isCorrect);
        els.questionModal.classList.add('hidden');
      };
      
      els.questionChoices.appendChild(btn);
    });
    
    els.questionModal.classList.remove('hidden');
  }

  function handleScanAnswer(card, isCorrect) {
    if (isCorrect) {
      // CORRECT: Contain the infected email
      if (card.state === 'infected' && !card.contained) {
        card.contained = true;
        showToast('✓ Correct! Email contained!');
        addGameLog('Infected email contained successfully', 'success');
      } else if (card.disguised) {
        // Reveal disguised card and contain it
        card.state = 'infected';
        card.contained = true;
        card.disguised = false;
        showToast('✓ Correct! Phishing email revealed and contained!');
        addGameLog('Disguised phishing email exposed and contained', 'success');
      } else {
        showToast('✓ Correct! Email was already contained.');
      }
    } else {
      // WRONG: Infected email infects 1 clean card
      showToast('✗ Wrong answer! Infection spread!');
      
      // Find a clean card to infect
      const cleanCards = state.hand.filter(c => c.state === 'clean' && !c.disguised);
      
      if (cleanCards.length > 0) {
        const randomClean = cleanCards[Math.floor(Math.random() * cleanCards.length)];
        randomClean.state = 'infected';
        randomClean.contained = false;
        randomClean.scanned = true; // Mark as scanned to prevent phase-end spread
        addGameLog('Wrong answer! 1 clean email became infected', 'warning');
      } else {
        addGameLog('Wrong answer but no clean emails to infect', 'system');
      }
    }
    
    // Re-render hand to show updated states
    renderHand();
    
    // Check elimination condition
    checkElimination();
  }

  function checkElimination() {
    // Count total infected cards (including contained ones)
    const totalInfected = state.hand.filter(c => c.state === 'infected').length;
    const totalCards = state.hand.length;
    
    // Check if player has 5 or all cards infected (including contained)
    if (totalCards >= 5 && totalInfected >= 5) {
      addGameLog('═══ YOU HAVE BEEN ELIMINATED ═══', 'warning');
      addGameLog('All your emails are infected (including contained)!', 'warning');
      
      // Stop all timers and disable interactions
      stopTimer();
      
      // Disable all action buttons
      els.scanBtn.disabled = true;
      els.firewallBtn.disabled = true;
      els.phishingBtn.disabled = true;
      
      // Show eliminated modal
      els.eliminatedModal.classList.remove('hidden');
      
      return true;
    }
    return false;
  }

  // Phase 2: Setup Send Bin Drag and Drop
  function setupSendBinDragDrop() {
    if (!els.sendBin) return;

    // Flag to track if card has been sent
    let hasDroppedCard = false;

    els.sendBin.ondragover = (e) => {
      if (hasDroppedCard) {
        e.preventDefault();
        return; // Don't show drop zone if already dropped
      }
      e.preventDefault();
      els.sendBin.classList.add('drag-over');
    };
    
    els.sendBin.ondragleave = () => {
      els.sendBin.classList.remove('drag-over');
    };
    
    els.sendBin.ondrop = (e) => {
      e.preventDefault();
      els.sendBin.classList.remove('drag-over');
      
      // Prevent multiple drops
      if (hasDroppedCard) {
        showToast('You can only send one card per phase!');
        return;
      }
      
      const cardId = e.dataTransfer.getData('cardId');
      const card = state.hand.find(c => c.cardId === cardId);
      
      if (!card) {
        showToast('Card not found!');
        return;
      }
      
      // Store card to send
      cardToSend = card;
      hasDroppedCard = true;
      
      // If contained card is sent, it becomes uncontained for recipient
      if (card.contained) {
        card.contained = false;
        addGameLog('Contained email sent - will be uncontained for recipient', 'warning');
      }
      
      // Remove card from hand
      const cardIndex = state.hand.findIndex(c => c.cardId === cardId);
      if (cardIndex > -1) {
        state.hand.splice(cardIndex, 1);
        renderHand();
        addGameLog('Email sent! It will be distributed to players', 'success');
        showToast('Email sent successfully!');
        
        // Visually disable the bin
        els.sendBin.style.opacity = '0.5';
        els.sendBin.style.cursor = 'not-allowed';
      }
    };
  }

  // Phase 2: Handle email distribution at end
  function handleEmailDistribution() {
    // If player didn't send a card, automatically send one (prioritize clean cards)
    if (!cardToSend && state.hand.length > 0) {
      // Try to find a clean card first
      let cardToAutoSend = state.hand.find(c => c.state === 'clean' && !c.disguised);
      
      // If no clean cards, pick any random card
      if (!cardToAutoSend) {
        const randomIndex = Math.floor(Math.random() * state.hand.length);
        cardToAutoSend = state.hand[randomIndex];
      }
      
      if (cardToAutoSend) {
        const cardIndex = state.hand.findIndex(c => c.cardId === cardToAutoSend.cardId);
        if (cardIndex > -1) {
          state.hand.splice(cardIndex, 1);
          cardToSend = cardToAutoSend;
          addGameLog('No card sent - Random card auto-sent', 'warning');
          renderHand();
        }
      }
    }
    
    // Each player receives one random card (clean, infected, or disguised)
    // For demo, add one random card to player's hand
    const cardTypes = ['clean', 'clean', 'clean', 'infected', 'disguised'];
    const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    
    const newCard = {
      cardId: 'card-' + Date.now(),
      state: randomType === 'disguised' ? 'clean' : randomType,
      contained: false,
      disguised: randomType === 'disguised',
      scanned: false
    };
    
    state.hand.push(newCard);
    renderHand();
    
    if (randomType === 'infected') {
      addGameLog('⚠ You received an infected email!', 'warning');
    } else if (randomType === 'disguised') {
      addGameLog('You received an email (may be disguised)', 'system');
    } else {
      addGameLog('You received a clean email', 'success');
    }
    
    // Reset cardToSend for next phase 2
    cardToSend = null;
  }

  // Phase 3: Activate Cyber Guard Mode
  function activateCyberGuardMode() {
    const playerIcons = els.playersDisplay.querySelectorAll('.player-icon');
    
    playerIcons.forEach(icon => {
      icon.classList.add('cyber-guard-active');
      
      icon.onclick = () => {
        const playerId = icon.getAttribute('data-player');
        const playerColor = icon.getAttribute('data-color');
        const playerName = `${playerColor.toUpperCase()} Player`;
        
        // Show confirmation modal
        selectedCyberGuardTarget = playerId;
        els.targetPlayerName.textContent = playerName;
        els.cyberGuardModal.classList.remove('hidden');
      };
    });
  }

  // Phase 3: Cyber Guard Modal Handlers
  if (els.cyberGuardYes) {
    els.cyberGuardYes.addEventListener('click', () => {
      els.cyberGuardModal.classList.add('hidden');
      
      if (selectedCyberGuardTarget) {
        // TODO: In multiplayer, this should check actual player data from server
        // For now, simulate checking if target player has infected cards
        // In a real game, you would get this data from the server
        
        // Simulate: 50% chance player has infected cards (this should come from server)
        const targetHasInfected = Math.random() > 0.5;
        const targetColor = els.playersDisplay.querySelector(`[data-player="${selectedCyberGuardTarget}"]`)?.getAttribute('data-color') || 'unknown';
        const targetPlayerName = `${targetColor.toUpperCase()} Player`;
        
        if (targetHasInfected) {
          // Correct guess - infect the target player's clean card
          addGameLog(`✓ Correct! ${targetPlayerName} has infected emails!`, 'success');
          addGameLog(`${targetPlayerName}'s clean card becomes infected!`, 'success');
          showToast('Correct guess! Target receives infected card!');
          
          // In multiplayer, this would infect target's card
          // socket.emit('infect-player', { targetId: selectedCyberGuardTarget });
        } else {
          // Wrong guess - target has no infected cards
          addGameLog(`✗ Wrong! ${targetPlayerName} has no infected emails`, 'warning');
          
          // Apply penalty: infect one of your clean cards
          const cleanCards = state.hand.filter(c => c.state === 'clean' && !c.disguised);
          
          if (cleanCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * cleanCards.length);
            const cardToInfect = cleanCards[randomIndex];
            cardToInfect.state = 'infected';
            cardToInfect.contained = false;
            cardToInfect.scanned = false;
            
            addGameLog('Penalty: 1 of your clean emails got infected!', 'warning');
            showToast('Wrong guess! 1 card infected as penalty');
            renderHand();
            checkElimination();
          } else {
            addGameLog('Penalty avoided - no clean cards to infect', 'system');
            showToast('Wrong guess but no clean cards to infect');
          }
          // For now, just show the message
        }
        
        selectedCyberGuardTarget = null;
        deactivateCyberGuardMode();
      }
    });
  }

  if (els.cyberGuardNo) {
    els.cyberGuardNo.addEventListener('click', () => {
      els.cyberGuardModal.classList.add('hidden');
      selectedCyberGuardTarget = null;
    });
  }

  function deactivateCyberGuardMode() {
    const playerIcons = els.playersDisplay.querySelectorAll('.player-icon');
    playerIcons.forEach(icon => {
      icon.classList.remove('cyber-guard-active');
      icon.onclick = null;
    });
  }

  els.leaveGameFieldBtn.addEventListener('click', () => {
    els.hud.classList.add('hidden');
    els.lobby.classList.remove('hidden');
    els.roomSection.classList.add('hidden');
    els.joinSection.classList.remove('hidden');
    state.players = [];
    state.hand = [];
    showToast('Left game');
  });

  els.eliminatedReturnBtn.addEventListener('click', () => {
    // Hide eliminated modal
    els.eliminatedModal.classList.add('hidden');
    
    // Return to lobby
    els.hud.classList.add('hidden');
    els.lobby.classList.remove('hidden');
    els.roomSection.classList.add('hidden');
    els.joinSection.classList.remove('hidden');
    
    // Reset game state
    state.players = [];
    state.hand = [];
    state.currentTurn = 1;
    state.currentPhase = 1;
    state.actionPoints = 3;
    
    showToast('Returned to lobby');
  });

  // Local simulation fallback removed - will be implemented with actual game logic
})();
