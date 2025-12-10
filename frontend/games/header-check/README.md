# Header Check - Multiplayer Card Game

## Game Overview
Header Check is a 6-10 player elimination card game where players must identify and contain infected emails while avoiding elimination.

## Core Mechanics

### Setup
- **Players**: 6-10 per match
- **Cards**: Each player has 5 email cards at all times
- **Initial State**: One random card is infected in one random player's hand at game start

### Card States
- **Clean**: Normal email, no infection
- **Infected**: Red-marked email that triggers questions
- **Contained**: Temporarily stopped from spreading (only for current holder, current turn)

### Win/Loss Conditions
- **Elimination**: When all 5 cards in a player's hand are infected
- **Victory**: Last remaining active player wins

## Turn Structure

Each turn consists of 3 phases that loop until one winner remains:

### Phase 1: Header Check (20 seconds)
- Players with infected cards receive security questions (one per infected card)
- **Correct Answer**: That infected card becomes "contained" for this turn only (won't spread while you hold it)
- **Wrong Answer**: One random clean card in your hand becomes infected
- Contained cards don't trigger questions for the current holder

### Phase 2: Send Mail (10 seconds)
- Every player selects exactly one card to send
- Server routes cards using balanced give-and-receive (everyone sends one, receives one)
- Recipient identity is hidden from sender
- Hand size remains at 5 cards
- **Important**: Contained cards become active infected for the recipient in their next Header Check

### Phase 3: Cyber Guard (10 seconds)
- One random player becomes the Cyber Guard
- Guard guesses which player is holding infected emails
- **Correct Guess**:
  - One random clean card in the target's hand becomes infected
  - One infected card in the Guard's own hand becomes clean (if Guard has any infected)
- **Incorrect Guess**:
  - One random clean card in the Guard's hand becomes infected

## Key Rules

1. **Permanent Infection**: Once infected, cards stay infected unless cleaned by Cyber Guard
2. **Containment is Temporary**: Only prevents spread for current holder during current turn
3. **Card Transfer Reactivates**: Contained cards become active infected when transferred
4. **Fixed Hand Size**: Always 5 cards per player
5. **Generic Questions**: Uses general cybersecurity questions (not module-specific)
6. **Balanced Routing**: Send Mail phase ensures everyone gives and receives exactly one card

## Technical Implementation

### Frontend
- **Location**: `frontend/games/header-check/`
- **Files**: `index.html`, `header-check.js`, `header-check.css`
- **Styling**: Uses site palette from `global.css` and `cybered.css`

### Backend
- **Socket Namespace**: `/header-check`
- **Service**: `backend/src/services/headerCheckSocket.js`
- **Integration**: Wired in `server.js`

### Socket Events

#### Server → Client
- `game:state` - Full game state with players, turn, phase
- `phase:update` - Phase transitions with countdown timers
- `hand:update` - Private player hand state
- `questions:enqueue` - Questions for infected cards
- `guard:role` - Notify who is Cyber Guard
- `elimination` - Player eliminated notification
- `victory` - Game winner announcement
- `action:ack` - Action acceptance/rejection

#### Client → Server
- `game:create` - Create new game room
- `game:join` - Join existing room
- `game:start` - Start the game (host)
- `answerQuestion` - Submit answer during Header Check
- `sendMail` - Send selected card during Send Mail
- `guardGuess` - Cyber Guard's guess

## Access
- **URL**: http://localhost:4000/games/header-check/index.html
- **Server**: Backend must be running on port 4000

## Development Status
- ✅ Frontend scaffold complete
- ✅ Backend socket namespace created
- ✅ Phase timing implemented
- ⏳ Game logic (infection, containment, routing) - in progress
- ⏳ Question pool integration - pending
- ⏳ Full testing - pending
