// Game Socket Service for Cyber Runner Multiplayer
// Handles room management, player connections, and game state synchronization

const rooms = new Map(); // roomCode -> room object

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function initializeGameSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[game-socket] player connected: ${socket.id}`);

    // Create a new room
    socket.on('create-room', (playerData, callback) => {
      const roomCode = generateRoomCode();
      const room = {
        code: roomCode,
        host: socket.id,
        players: new Map(),
        gameState: 'lobby', // lobby, countdown, playing, finished
        maxPlayers: 5,
        readyPlayers: new Set(),
        gameStartTime: null,
        obstacles: [],
        obstacleCounter: 0
      };

      // Add host as first player
      room.players.set(socket.id, {
        id: socket.id,
        username: playerData.username,
        avatarSrc: playerData.avatarSrc,
        score: 0,
        isEliminated: false,
        position: { x: 50, y: 0, velocityY: 0 },
        lane: 0,
        ready: false
      });

      rooms.set(roomCode, room);
      socket.join(roomCode);
      socket.roomCode = roomCode;

      console.log(`[game-socket] room created: ${roomCode} by ${playerData.username}`);
      
      callback({ success: true, roomCode });
      
      // Broadcast updated player list to room
      emitPlayerList(io, roomCode);
    });

    // Join an existing room
    socket.on('join-room', (data, callback) => {
      const { roomCode, playerData } = data;
      const room = rooms.get(roomCode);

      if (!room) {
        return callback({ success: false, error: 'Room not found' });
      }

      if (room.players.size >= room.maxPlayers) {
        return callback({ success: false, error: 'Room is full' });
      }

      if (room.gameState !== 'lobby') {
        return callback({ success: false, error: 'Game already in progress' });
      }

      // Assign lane based on player count
      const lane = room.players.size;

      room.players.set(socket.id, {
        id: socket.id,
        username: playerData.username,
        avatarSrc: playerData.avatarSrc,
        score: 0,
        isEliminated: false,
        position: { x: 50, y: 0, velocityY: 0 },
        lane,
        ready: false
      });

      socket.join(roomCode);
      socket.roomCode = roomCode;

      console.log(`[game-socket] ${playerData.username} joined room: ${roomCode}`);
      
      callback({ success: true, roomCode, lane });
      
      // Broadcast updated player list to room
      emitPlayerList(io, roomCode);
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

      emitPlayerList(io, roomCode);
      
      // Check if all players ready (all players except host must be ready)
      const nonHostPlayers = Array.from(room.players.values()).filter(p => p.id !== room.host);
      const allNonHostReady = nonHostPlayers.every(p => p.ready);
      const canStart = room.players.size >= 2 && allNonHostReady;
      
      io.to(room.host).emit('can-start-game', canStart);
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
      io.to(roomCode).emit('game-starting', { countdown: 3 });
      
      console.log(`[game-socket] game starting in room: ${roomCode}`);

      // Countdown: 3, 2, 1, GO!
      let count = 3;
      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          io.to(roomCode).emit('countdown-tick', count);
        } else {
          clearInterval(countdownInterval);
          room.gameState = 'playing';
          room.gameStartTime = Date.now();
          io.to(roomCode).emit('game-started');
          
          // Start obstacle generation
          startObstacleGeneration(io, roomCode);
        }
      }, 1000);
    });

    // Player position update
    socket.on('player-update', (data) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room || room.gameState !== 'playing') return;

      const player = room.players.get(socket.id);
      if (player && !player.isEliminated) {
        player.position = data.position;
        player.score = data.score;
        
        // Broadcast to other players
        socket.to(roomCode).emit('player-moved', {
          playerId: socket.id,
          position: data.position,
          score: data.score
        });
      }
    });

    // Player collision/elimination
    socket.on('player-eliminated', (data) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player && !player.isEliminated) {
        player.isEliminated = true;
        player.finalScore = data.score;
        player.eliminationTime = Date.now();
        
        console.log(`[game-socket] ${player.username} eliminated with score: ${data.score}`);
        
        // Broadcast elimination to all players
        io.to(roomCode).emit('player-eliminated', {
          playerId: socket.id,
          username: player.username,
          score: data.score
        });

        // Check if this was the last active player
        const activePlayers = Array.from(room.players.values()).filter(p => !p.isEliminated);
        console.log(`[game-socket] Active players after elimination: ${activePlayers.length}`);
        
        if (activePlayers.length === 0) {
          // Last player eliminated - end game (whether from quiz or collision)
          console.log(`[game-socket] ⚠️ ENDING GAME - Last player eliminated. Calling endGame in 2 seconds...`);
          setTimeout(() => {
            console.log(`[game-socket] ⚠️ CALLING endGame NOW for room ${roomCode}`);
            endGame(io, roomCode);
          }, 2000);
        }
      }
    });

    // Player paused for quiz
    socket.on('player-paused', (data) => {
      const roomCode = socket.roomCode;
      socket.to(roomCode).emit('player-paused', {
        playerId: socket.id,
        position: data.position
      });
    });

    // Player resumed from quiz
    socket.on('player-resumed', (data) => {
      const roomCode = socket.roomCode;
      socket.to(roomCode).emit('player-resumed', {
        playerId: socket.id
      });
    });

    // Quiz answer
    socket.on('quiz-answer', (data) => {
      const roomCode = socket.roomCode;
      const room = rooms.get(roomCode);
      
      if (!room) {
        console.log(`[game-socket] quiz-answer: Room ${roomCode} not found`);
        return;
      }
      
      console.log(`[game-socket] quiz-answer from ${socket.id}, correct: ${data.correct}, room: ${roomCode}`);
      
      // Broadcast to other players
      socket.to(roomCode).emit('player-answered-quiz', {
        playerId: socket.id,
        correct: data.correct
      });
      
      // If player answered wrong, mark them as eliminated immediately on server side
      if (!data.correct) {
        const player = room.players.get(socket.id);
        if (player && !player.isEliminated) {
          player.isEliminated = true;
          player.finalScore = player.score;
          player.eliminationTime = Date.now();
          console.log(`[game-socket] Marked ${player.username} as eliminated (wrong answer)`);
        }
        
        // Count remaining active players (now excluding the player we just marked as eliminated)
        const activePlayers = Array.from(room.players.values()).filter(p => !p.isEliminated);
        const playerNames = activePlayers.map(p => p.username).join(', ');
        console.log(`[game-socket] Active players remaining: ${activePlayers.length} [${playerNames}]`);
        
        // If no active players remain, end the game
        if (activePlayers.length === 0) {
          // Last player answered wrong - end game
          console.log(`[game-socket] ⚠️ ENDING GAME - Last player eliminated. Calling endGame in 2 seconds...`);
          setTimeout(() => {
            console.log(`[game-socket] ⚠️ CALLING endGame NOW for room ${roomCode}`);
            endGame(io, roomCode);
          }, 2000); // Wait 2 seconds for the player to see the wrong answer feedback
        } else {
          console.log(`[game-socket] Not ending game yet - ${activePlayers.length} players still active`);
        }
      }
    });

    // Leave room
    socket.on('leave-room', () => {
      handlePlayerLeave(io, socket);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[game-socket] player disconnected: ${socket.id}`);
      handlePlayerLeave(io, socket);
    });
  });
}

function emitPlayerList(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const playerList = Array.from(room.players.values()).map(p => ({
    id: p.id,
    username: p.username,
    avatarSrc: p.avatarSrc,
    ready: p.ready,
    isHost: p.id === room.host,
    score: p.score,
    isEliminated: p.isEliminated,
    lane: p.lane
  }));

  io.to(roomCode).emit('players-updated', {
    players: playerList,
    count: room.players.size
  });
}

function startObstacleGeneration(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const obstacleInterval = setInterval(() => {
    if (room.gameState !== 'playing') {
      clearInterval(obstacleInterval);
      return;
    }

    // Generate obstacle
    const obstacle = {
      id: room.obstacleCounter++,
      type: Math.random() > 0.6 ? 'flying' : 'ground',
      x: 1000,
      y: Math.random() > 0.6 ? 180 : 280,
      timestamp: Date.now()
    };

    room.obstacles.push(obstacle);
    io.to(roomCode).emit('obstacle-spawned', obstacle);

    // Clean up old obstacles
    const now = Date.now();
    room.obstacles = room.obstacles.filter(obs => now - obs.timestamp < 10000);

  }, 2000); // Spawn obstacle every 2 seconds

  room.obstacleInterval = obstacleInterval;
}

function endGame(io, roomCode) {
  console.log(`[game-socket] 🏁 endGame called for room ${roomCode}`);
  const room = rooms.get(roomCode);
  if (!room) {
    console.log(`[game-socket] ❌ endGame: Room ${roomCode} not found!`);
    return;
  }

  console.log(`[game-socket] 🏁 Setting room ${roomCode} to finished state`);
  room.gameState = 'finished';
  
  if (room.obstacleInterval) {
    clearInterval(room.obstacleInterval);
  }

  // Calculate final rankings
  const rankings = Array.from(room.players.values())
    .map(p => ({
      id: p.id,
      username: p.username,
      avatarSrc: p.avatarSrc,
      score: p.finalScore || p.score,
      isEliminated: p.isEliminated,
      eliminationTime: p.eliminationTime
    }))
    .sort((a, b) => {
      // Active players (not eliminated) rank first
      if (a.isEliminated && !b.isEliminated) return 1;
      if (!a.isEliminated && b.isEliminated) return -1;
      
      // If both eliminated, sort by elimination time (later = better)
      if (a.isEliminated && b.isEliminated) {
        return b.eliminationTime - a.eliminationTime;
      }
      
      // If both active, sort by score
      return b.score - a.score;
    });

  // Apply multipliers
  const multipliers = [3, 2, 1.5, 1, 1];
  const results = rankings.map((player, index) => ({
    ...player,
    rank: index + 1,
    multiplier: multipliers[index] || 1,
    finalScore: Math.floor(player.score * (multipliers[index] || 1))
  }));

  console.log(`[game-socket] 🏁 Game ended in room: ${roomCode}`);
  console.log(`[game-socket] 🏁 Rankings:`, results.map(r => `${r.rank}. ${r.username}: ${r.finalScore}`));

  console.log(`[game-socket] 🏁 Emitting game-ended event to room ${roomCode}`);
  io.to(roomCode).emit('game-ended', { results });
  console.log(`[game-socket] ✅ game-ended event emitted successfully`);
  
  // Reset room state for play again
  room.gameState = 'waiting';
  room.readyPlayers.clear();
  room.players.forEach(player => {
    player.ready = false;
    player.isEliminated = false;
    player.score = 0;
    player.finalScore = 0;
    player.position = null;
  });
  console.log(`[game-socket] 🔄 Room ${roomCode} reset for play again`);
  
  // Emit updated player list so everyone sees the reset state
  emitPlayerList(io, roomCode);
  
  // Update host's start button state (should be disabled since no one is ready)
  io.to(room.host).emit('can-start-game', false);
}

function handlePlayerLeave(io, socket) {
  const roomCode = socket.roomCode;
  if (!roomCode) return;

  const room = rooms.get(roomCode);
  if (!room) return;

  const player = room.players.get(socket.id);
  if (player) {
    console.log(`[game-socket] ${player.username} left room: ${roomCode}`);
  }

  room.players.delete(socket.id);
  room.readyPlayers.delete(socket.id);
  socket.leave(roomCode);
  delete socket.roomCode;

  // Notify the leaving player that they've left
  socket.emit('left-room');

  // If host left, assign new host
  if (room.host === socket.id && room.players.size > 0) {
    const newHost = Array.from(room.players.keys())[0];
    room.host = newHost;
    const newHostPlayer = room.players.get(newHost);
    if (newHostPlayer) {
      newHostPlayer.ready = false; // Host doesn't need to be ready
      room.readyPlayers.delete(newHost);
    }
    io.to(newHost).emit('you-are-host');
  }

  // If room is empty, delete it
  if (room.players.size === 0) {
    if (room.obstacleInterval) {
      clearInterval(room.obstacleInterval);
    }
    rooms.delete(roomCode);
    console.log(`[game-socket] room deleted: ${roomCode}`);
  } else {
    emitPlayerList(io, roomCode);
    
    // Update can-start status for host after player leaves
    if (room.host) {
      const nonHostPlayers = Array.from(room.players.values()).filter(p => p.id !== room.host);
      const allNonHostReady = nonHostPlayers.every(p => p.ready);
      const canStart = room.players.size >= 2 && allNonHostReady;
      io.to(room.host).emit('can-start-game', canStart);
    }
  }
}
