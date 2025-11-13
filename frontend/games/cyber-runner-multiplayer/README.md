# Cyber Runner Multiplayer - Battle Mode

## Overview
Cyber Runner Multiplayer is a real-time competitive version of Cyber Runner where 2-5 players battle to be the last runner standing. Players compete on separate lanes, and the winner receives score multipliers based on their final placement.

## How to Play

### Creating a Room
1. Navigate to Challenges page
2. Click "Play" on Cyber Runner Multiplayer
3. Click "CREATE ROOM" to host a new game
4. Share the 6-character room code with friends

### Joining a Room
1. Get the room code from the host
2. Click "Cyber Runner Multiplayer" in Challenges
3. Enter the room code and click "JOIN"
4. Click "READY" when you're prepared to play

### Starting the Game
- **Host**: Once at least 2 players are in the room, click "START GAME"
- **Players**: Must click "READY" before host can start
- A 3-second countdown begins, then the race starts!

## Game Mechanics

### Core Gameplay
- Same as single-player: Jump over/under virus obstacles
- Answer cybersecurity quiz questions when you collide
- **Correct answer**: Continue playing
- **Wrong answer**: You're ELIMINATED

### Multiplayer Features
- **Multiple Lanes**: Each player has their own lane (up to 5)
- **Synchronized Obstacles**: All players face the same obstacles at the same time
- **Real-time Updates**: See other players' positions and scores live
- **Spectator Mode**: Eliminated players watch remaining competitors

### Elimination & Spectating
- When eliminated, your screen shows "ELIMINATED!"
- Your final score is locked
- You can watch other players continue the battle
- Current standings are displayed on the left

### Game End Conditions
- Only 1 player remains alive
- All players are eliminated

## Scoring & Multipliers

Final scores are calculated with placement multipliers:

- **🥇 1st Place**: Score × 3
- **🥈 2nd Place**: Score × 2  
- **🥉 3rd Place**: Score × 1.5
- **4th-5th Place**: Score × 1 (no multiplier)

### Example
If you score 150 points and place 2nd:
- Base Score: 150
- Multiplier: 2x
- **Final Score: 300**

## Results Screen

After the game ends, you'll see:
- **Podium**: Top 3 players with medals
- **Score Breakdown**: Base score → Multiplied final score
- **Rankings**: All players ranked by performance
- **Options**: Play Again or Return to Lobby

## Leaderboards

Multiplier-adjusted scores are submitted to the backend and appear on the Leaderboards page under "Multiplayer" tab. Compete to be the top Cyber Runner champion!

## Technical Details

### Backend (Socket.IO)
- Real-time WebSocket communication via Socket.IO
- Room-based multiplayer system
- Server-authoritative obstacle generation
- Player elimination tracking
- Final score calculation with multipliers

### Frontend
- Canvas-based rendering with multi-lane layout
- Client-side physics for smooth player movement
- Position updates throttled to reduce network traffic
- Spectator camera for eliminated players
- Lobby system with room codes

### API Integration
- Scores submitted to `/api/challenges/complete`
- Challenge ID: `cyber-runner-multiplayer`
- Final score includes multiplier
- Rank (1-5) stored as level

## Files

### Game Files
- `frontend/games/cyber-runner-multiplayer/index.html` - Game UI & lobby
- `frontend/games/cyber-runner-multiplayer/game.js` - Client-side game logic

### Backend
- `backend/src/services/gameSocket.js` - Socket.IO game server
- `backend/src/server.js` - HTTP + WebSocket server

### Integration
- `frontend/src/js/challenges.js` - Challenge listing
- `frontend/src/html/leaderboards.html` - Multiplayer leaderboard tab

## Tips for Players

1. **Timing is Everything**: Practice your jumps in single-player mode first
2. **Know Your Questions**: Study cybersecurity concepts to answer faster
3. **Stay Calm**: Wrong answers eliminate you - think before clicking
4. **Watch Others**: While spectating, learn from surviving players' strategies
5. **Aim for Top 3**: Only the podium gets multipliers - play to win!

## Troubleshooting

### Can't Connect to Room
- Ensure backend server is running on port 4000
- Check that Socket.IO is initialized (look for `[socket.io] ready` in server logs)
- Verify room code is correct (6 characters, case-insensitive)

### Game Feels Laggy
- Position updates are throttled to every 5 frames
- Obstacles are synchronized from server
- Check your network connection

### Scores Not Submitting
- Ensure you're logged in with valid authToken
- Check browser console for API errors
- Verify `/api/challenges/complete` endpoint is accessible

## Future Enhancements

- Tournament brackets (8+ players)
- Custom game modes (speed runs, quiz-only)
- In-game chat
- Cosmetic skins/avatars
- Power-ups and special abilities
- Spectator commentary mode
