// Header Check Multiplayer Socket Service
// Manages room-based multiplayer with turn-based gameplay

const rooms = new Map(); // roomCode -> room object

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function initializeHeaderCheckSocket(io) {
  // Create namespace for header check game
  const ns = io.of('/header-check');
  
  ns.on('connection', (socket) => {
    console.log(`[header-check] player connected: ${socket.id}`);

    // Create a new room
    socket.on('create-room', (playerData, callback) => {
      const roomCode = generateRoomCode();
      const room = {
        code: roomCode,
        host: socket.id,
        players: new Map(),
        gameState: 'lobby', // lobby, countdown, phase1, phase2, phase3, turn-end
        maxPlayers: 6,
        readyPlayers: new Set(),
        currentTurn: 0,
        currentPhase: null,
        phaseEndTime: null,
        cards: [], // Shared card deck for all players
        colorAssignments: [] // Array of colors for players
      };

      const playerColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

      // Add host as first player
      room.players.set(socket.id, {
        id: socket.id,
        username: playerData.username,
        avatarSrc: playerData.avatarSrc,
        color: playerColors[0],
        colorIndex: 0,
        actionPoints: 3,
        cards: [], // Player's personal cards (infected, contained, etc)
        firewallUsed: false,
        ready: false,
        isEliminated: false
      });

      room.colorAssignments = playerColors;

      rooms.set(roomCode, room);
      socket.join(roomCode);
      socket.roomCode = roomCode;

      console.log(`[header-check] room created: ${roomCode} by ${playerData.username}`);
      
      callback({ success: true, roomCode });
      
      // Broadcast updated player list to room
      emitPlayerList(ns, roomCode);
    });

    // Join an existing room
    socket.on('join-room', (data, callback) => {
      const { roomCode, playerData } = data;
      const room = rooms.get(roomCode);

      if (!room) {
        return callback({ success: false, error: 'Room not found' });
      }

      if (room.players.size >= room.maxPlayers) {
        return callback({ success: false, error: 'Room is full (max 6 players)' });
      }

      if (room.gameState !== 'lobby') {
        return callback({ success: false, error: 'Game already in progress' });
      }

      const playerColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
      const colorIndex = room.players.size;

      room.players.set(socket.id, {
        id: socket.id,
        username: playerData.username,
        avatarSrc: playerData.avatarSrc,
        color: playerColors[colorIndex],
        colorIndex: colorIndex,
        actionPoints: 3,
        cards: [],
        firewallUsed: false,
        ready: false,
        isEliminated: false
      });

      socket.join(roomCode);
      socket.roomCode = roomCode;

      console.log(`[header-check] ${playerData.username} joined room: ${roomCode}`);
      
      callback({ success: true, roomCode, colorIndex });
      
      // Broadcast updated player list to room
      emitPlayerList(ns, roomCode);
    });

    // Player ready status
    socket.on('player-ready', (ready) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player) {
        player.ready = ready;
        
        if (ready) {
          room.readyPlayers.add(socket.id);
        } else {
          room.readyPlayers.delete(socket.id);
        }
      }

      emitPlayerList(ns, roomCode);
      
      // Check if all players ready (all players except host must be ready)
      const nonHostPlayers = Array.from(room.players.values()).filter(p => p.id !== room.host);
      const allNonHostReady = nonHostPlayers.every(p => p.ready);
      const canStart = room.players.size >= 2 && allNonHostReady;
      
      ns.to(room.host).emit('can-start-game', canStart);
    });

    // Start game (host only)
    socket.on('start-game', () => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room || room.host !== socket.id) return;

      const canStart = room.players.size >= 2;
      
      if (!canStart) {
        socket.emit('error-message', 'Need at least 2 players to start');
        return;
      }

      room.gameState = 'countdown';
      ns.to(roomCode).emit('game-starting');
      
      console.log(`[header-check] game starting in room: ${roomCode}`);

      // Countdown: 3, 2, 1, GO!
      let count = 3;
      const countdownInterval = setInterval(() => {
        if (count > 0) {
          ns.to(roomCode).emit('countdown-tick', count);
          count--;
        } else {
          clearInterval(countdownInterval);
          startTurn(ns, roomCode);
        }
      }, 1000);
    });

    // Player action: Scan card
    socket.on('scan-card', (data, callback) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room || room.gameState === 'lobby') {
        return callback({ success: false, error: 'Game not active' });
      }

      const player = room.players.get(socket.id);
      if (!player || player.isEliminated) {
        return callback({ success: false, error: 'Player not active' });
      }

      if (player.actionPoints < 1) {
        return callback({ success: false, error: 'Not enough action points' });
      }

      // Deduct AP
      player.actionPoints -= 1;
      
      // Broadcast scan to all players
      ns.to(roomCode).emit('card-scanned', {
        playerId: socket.id,
        cardIndex: data.cardIndex,
        isInfected: data.isInfected
      });

      callback({ success: true, actionPoints: player.actionPoints });
      emitPlayerList(ns, roomCode);
    });

    // Player action: Send email
    socket.on('send-email', (data, callback) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room || room.currentPhase !== 'phase2') {
        return callback({ success: false, error: 'Can only send emails in Phase 2' });
      }

      const player = room.players.get(socket.id);
      if (!player || player.isEliminated) {
        return callback({ success: false, error: 'Player not active' });
      }

      if (player.actionPoints < 1) {
        return callback({ success: false, error: 'Not enough action points' });
      }

      // Deduct AP
      player.actionPoints -= 1;
      
      // Broadcast email send to all players
      ns.to(roomCode).emit('email-sent', {
        fromPlayerId: socket.id,
        toPlayerId: data.toPlayerId,
        cardIndex: data.cardIndex,
        isInfected: data.isInfected
      });

      callback({ success: true, actionPoints: player.actionPoints });
      emitPlayerList(ns, roomCode);
    });

    // Player action: Cyber guard guess
    socket.on('cyber-guard', (data, callback) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room || room.currentPhase !== 'phase3') {
        return callback({ success: false, error: 'Can only use Cyber Guard in Phase 3' });
      }

      const player = room.players.get(socket.id);
      if (!player || player.isEliminated) {
        return callback({ success: false, error: 'Player not active' });
      }

      if (player.actionPoints < 1) {
        return callback({ success: false, error: 'Not enough action points' });
      }

      // Deduct AP
      player.actionPoints -= 1;
      
      // Broadcast cyber guard result to all players
      ns.to(roomCode).emit('cyber-guard-used', {
        playerId: socket.id,
        cardIndex: data.cardIndex,
        guessedInfected: data.guessedInfected,
        actuallyInfected: data.actuallyInfected,
        isCorrect: data.guessedInfected === data.actuallyInfected
      });

      callback({ success: true, actionPoints: player.actionPoints });
      emitPlayerList(ns, roomCode);
    });

    // Player action: Use firewall
    socket.on('use-firewall', (callback) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room || room.gameState === 'lobby') {
        return callback({ success: false, error: 'Game not active' });
      }

      const player = room.players.get(socket.id);
      if (!player || player.isEliminated) {
        return callback({ success: false, error: 'Player not active' });
      }

      if (player.firewallUsed) {
        return callback({ success: false, error: 'Firewall already used this game' });
      }

      if (player.actionPoints < 2) {
        return callback({ success: false, error: 'Not enough action points (need 2)' });
      }

      // Deduct AP and mark firewall as used
      player.actionPoints -= 2;
      player.firewallUsed = true;
      
      // Broadcast firewall use to all players
      ns.to(roomCode).emit('firewall-used', {
        playerId: socket.id
      });

      callback({ success: true, actionPoints: player.actionPoints, firewallUsed: true });
      emitPlayerList(ns, roomCode);
    });

    // Player elimination
    socket.on('player-eliminated', () => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player && !player.isEliminated) {
        player.isEliminated = true;
        
        console.log(`[header-check] ${player.username} eliminated`);
        
        // Broadcast elimination to all players
        ns.to(roomCode).emit('player-eliminated-event', {
          playerId: socket.id,
          username: player.username
        });

        // Check if game should end (only 1 or 0 active players)
        const activePlayers = Array.from(room.players.values()).filter(p => !p.isEliminated);
        
        if (activePlayers.length <= 1) {
          setTimeout(() => endGame(ns, roomCode), 2000);
        } else {
          emitPlayerList(ns, roomCode);
        }
      }
    });

    // Leave room
    socket.on('leave-room', () => {
      handlePlayerLeave(ns, socket);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[header-check] player disconnected: ${socket.id}`);
      handlePlayerLeave(ns, socket);
    });
  });
}

function emitPlayerList(ns, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const playerList = Array.from(room.players.values()).map(p => ({
    id: p.id,
    username: p.username,
    avatarSrc: p.avatarSrc,
    color: p.color,
    colorIndex: p.colorIndex,
    actionPoints: p.actionPoints,
    firewallUsed: p.firewallUsed,
    ready: p.ready,
    isHost: p.id === room.host,
    isEliminated: p.isEliminated
  }));

  ns.to(roomCode).emit('players-updated', {
    players: playerList,
    count: room.players.size
  });
}

function startTurn(ns, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.currentTurn += 1;
  
  console.log(`[header-check] Turn ${room.currentTurn} starting in room ${roomCode}`);

  // Reset all player AP to 3
  room.players.forEach(player => {
    if (!player.isEliminated) {
      player.actionPoints = 3;
    }
  });

  // Show turn splash screen
  ns.to(roomCode).emit('turn-starting', { turnNumber: room.currentTurn });

  setTimeout(() => {
    startPhase(ns, roomCode, 'phase1');
  }, 3000);
}

function startPhase(ns, roomCode, phase) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.currentPhase = phase;
  
  const phaseDurations = {
    phase1: 30000, // 30 seconds
    phase2: 20000, // 20 seconds
    phase3: 10000  // 10 seconds
  };

  const duration = phaseDurations[phase];
  room.phaseEndTime = Date.now() + duration;

  console.log(`[header-check] ${phase} starting in room ${roomCode}`);

  ns.to(roomCode).emit('phase-starting', {
    phase: phase,
    duration: duration,
    endsAt: room.phaseEndTime
  });

  // Auto-advance to next phase or end turn
  setTimeout(() => {
    if (phase === 'phase1') {
      startPhase(ns, roomCode, 'phase2');
    } else if (phase === 'phase2') {
      startPhase(ns, roomCode, 'phase3');
    } else if (phase === 'phase3') {
      endTurn(ns, roomCode);
    }
  }, duration);
}

function endTurn(ns, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  console.log(`[header-check] Turn ${room.currentTurn} ending in room ${roomCode}`);

  // Broadcast turn end (so clients can uncontain cards, etc)
  ns.to(roomCode).emit('turn-ending');

  // Check for game end condition
  const activePlayers = Array.from(room.players.values()).filter(p => !p.isEliminated);
  
  if (activePlayers.length <= 1) {
    setTimeout(() => endGame(ns, roomCode), 3000);
  } else {
    // Start next turn after brief delay
    setTimeout(() => startTurn(ns, roomCode), 3000);
  }
}

function endGame(ns, roomCode) {
  console.log(`[header-check] Game ending in room ${roomCode}`);
  const room = rooms.get(roomCode);
  if (!room) return;

  room.gameState = 'finished';

  // Calculate rankings (survivors > eliminated)
  const rankings = Array.from(room.players.values())
    .map(p => ({
      id: p.id,
      username: p.username,
      avatarSrc: p.avatarSrc,
      color: p.color,
      isEliminated: p.isEliminated
    }))
    .sort((a, b) => {
      // Active players rank first
      if (a.isEliminated && !b.isEliminated) return 1;
      if (!a.isEliminated && b.isEliminated) return -1;
      return 0;
    });

  const results = rankings.map((player, index) => ({
    ...player,
    rank: index + 1
  }));

  console.log(`[header-check] Game ended in room: ${roomCode}`);
  console.log(`[header-check] Rankings:`, results.map(r => `${r.rank}. ${r.username}`));

  ns.to(roomCode).emit('game-ended', { results });
  
  // Reset room state for play again
  room.gameState = 'lobby';
  room.currentTurn = 0;
  room.currentPhase = null;
  room.readyPlayers.clear();
  room.players.forEach(player => {
    player.ready = false;
    player.isEliminated = false;
    player.actionPoints = 3;
    player.firewallUsed = false;
    player.cards = [];
  });
  
  emitPlayerList(ns, roomCode);
  ns.to(room.host).emit('can-start-game', false);
}

function handlePlayerLeave(ns, socket) {
  const roomCode = socket.roomCode;
  if (!roomCode) return;

  const room = rooms.get(roomCode);
  if (!room) return;

  const player = room.players.get(socket.id);
  if (player) {
    console.log(`[header-check] ${player.username} left room: ${roomCode}`);
  }

  room.players.delete(socket.id);
  room.readyPlayers.delete(socket.id);
  socket.leave(roomCode);
  delete socket.roomCode;

  socket.emit('left-room');

  // If host left, assign new host
  if (room.host === socket.id && room.players.size > 0) {
    const newHost = Array.from(room.players.keys())[0];
    room.host = newHost;
    const newHostPlayer = room.players.get(newHost);
    if (newHostPlayer) {
      newHostPlayer.ready = false;
      room.readyPlayers.delete(newHost);
    }
    ns.to(newHost).emit('you-are-host');
  }

  // If room is empty, delete it
  if (room.players.size === 0) {
    rooms.delete(roomCode);
    console.log(`[header-check] room deleted: ${roomCode}`);
  } else {
    emitPlayerList(ns, roomCode);
    
    // Update can-start status for host after player leaves
    if (room.host) {
      const nonHostPlayers = Array.from(room.players.values()).filter(p => p.id !== room.host);
      const allNonHostReady = nonHostPlayers.every(p => p.ready);
      const canStart = room.players.size >= 2 && allNonHostReady;
      ns.to(room.host).emit('can-start-game', canStart);
    }
  }
}
