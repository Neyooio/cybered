console.log('[game.js] Loading Crypto Crack game...');

// Game State
const gameState = {
  currentShift: 0,
  currentMessage: '',
  currentPlaintext: '',
  currentAnswer: [],
  selectedBoxIndex: -1,
  totalXP: 0,          // Total lifetime XP
  currentLevelXP: 0,   // XP in current level (0-99)
  level: 1,            // Current level
  mastery: 0,          // Mastery level (0-10)
  puzzlesSolved: 0
};

// Level and Mastery Calculation
function calculateLevel(totalXP) {
  return Math.floor(totalXP / 100) + 1;
}

function calculateMastery(level) {
  // Mastery milestones: 3, 7, 12, 18, 25, 33, 42, 52, 63, 75
  if (level < 3) return 0;
  if (level < 7) return 1;
  if (level < 12) return 2;
  if (level < 18) return 3;
  if (level < 25) return 4;
  if (level < 33) return 5;
  if (level < 42) return 6;
  if (level < 52) return 7;
  if (level < 63) return 8;
  if (level < 75) return 9;
  return 10; // Max mastery
}

function updateLevelAndMastery() {
  gameState.level = calculateLevel(gameState.totalXP);
  gameState.mastery = calculateMastery(gameState.level);
  gameState.currentLevelXP = gameState.totalXP % 100;
}

// Caesar Cipher Functions
function encryptCaesar(text, shift) {
  return text.toUpperCase().split('').map(char => {
    if (char === ' ') return ' ';
    if (char < 'A' || char > 'Z') return char;
    const code = char.charCodeAt(0);
    return String.fromCharCode(((code - 65 + shift) % 26) + 65);
  }).join('');
}

function decryptCaesar(text, shift) {
  return encryptCaesar(text, 26 - shift);
}

// Sample messages - randomly selected each game
const messages = [
  { text: 'HACK THE SYSTEM', xp: 50 },
  { text: 'SECURE YOUR DATA', xp: 60 },
  { text: 'DECODE THE MESSAGE', xp: 70 },
  { text: 'CIPHER CHALLENGE', xp: 80 },
  { text: 'ENCRYPTION EXPERT', xp: 90 },
  { text: 'CRYPTOGRAPHY MASTER', xp: 100 },
  { text: 'DEFEND AGAINST CYBER ATTACKS', xp: 120 },
  { text: 'PROTECT YOUR PRIVACY ONLINE', xp: 120 },
  { text: 'BREAK THE CODE', xp: 50 },
  { text: 'CYBER SECURITY ROCKS', xp: 80 },
  { text: 'KEEP YOUR PASSWORDS SAFE', xp: 100 },
  { text: 'STAY VIGILANT ONLINE', xp: 80 },
  { text: 'ENCRYPTION IS KEY', xp: 70 },
  { text: 'TRUST NO ONE', xp: 50 },
  { text: 'DIGITAL FORTRESS', xp: 60 },
  { text: 'SHIELD YOUR IDENTITY', xp: 80 },
  { text: 'SECURE THE NETWORK', xp: 70 },
  { text: 'FIREWALL PROTECTION', xp: 70 },
  { text: 'AUTHENTICATE SAFELY', xp: 70 },
  { text: 'MALWARE DEFENSE', xp: 60 }
];

// Initialize Game
function initGame() {
  console.log('[initGame] Initializing game...');
  
  // Restore XP from localStorage
  const savedXP = localStorage.getItem('cyberedCrackXP');
  const savedSolved = localStorage.getItem('cyberedCrackSolved');
  if (savedXP) gameState.totalXP = parseInt(savedXP) || 0;
  if (savedSolved) gameState.puzzlesSolved = parseInt(savedSolved) || 0;
  
  // Calculate initial level and mastery
  updateLevelAndMastery();
  
  // Update HUD displays
  updateHUD();
  
  // Setup screens
  const titleScreen = document.getElementById('titleScreen');
  const gameScreen = document.getElementById('gameScreen');
  const successScreen = document.getElementById('successScreen');
  const playBtn = document.getElementById('playBtn');
  const nextBtn = document.getElementById('nextBtn');
  const backToMenuBtn = document.getElementById('backToMenuBtn');
  
  // Play button
  playBtn.addEventListener('click', () => {
    titleScreen.classList.remove('active');
    gameScreen.classList.add('active');
    successScreen.classList.remove('active');
    startNewPuzzle();
  });
  
  // Next puzzle button
  nextBtn.addEventListener('click', () => {
    successScreen.classList.remove('active');
    gameScreen.classList.add('active');
    titleScreen.classList.remove('active');
    startNewPuzzle();
  });
  
  // Back to menu button
  backToMenuBtn.addEventListener('click', () => {
    successScreen.classList.remove('active');
    titleScreen.classList.add('active');
    gameScreen.classList.remove('active');
  });
  
  // Setup letter ruler
  setupLetterRuler();
  
  // Submit button
  const submitBtn = document.getElementById('submitAnswerBtn');
  submitBtn.addEventListener('click', checkAnswer);
  
  console.log('[initGame] Game initialized');
}

// Start New Puzzle - Creates random message with random shift each time
function startNewPuzzle() {
  console.log('[startNewPuzzle] Starting new puzzle...');
  
  // STEP 1: Randomly select a message from the pool
  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];
  gameState.currentPlaintext = message.text;
  
  // STEP 2: Generate random shift (3-23 range for balanced difficulty)
  // This shift is the CORRECT one that will decrypt the message
  gameState.currentShift = Math.floor(Math.random() * 21) + 3;
  
  // STEP 3: Encrypt the plaintext message using the shift
  // Example: "HELLO" with shift 5 becomes "MJQQT"
  gameState.currentMessage = encryptCaesar(gameState.currentPlaintext, gameState.currentShift);
  
  // STEP 4: Reset answer array to empty boxes
  gameState.currentAnswer = gameState.currentPlaintext.split('').map(char => char === ' ' ? ' ' : '');
  gameState.selectedBoxIndex = -1;
  
  // STEP 5: Display everything to the player
  displayShiftNumber();      // Shows the correct shift number
  displayEncryptedMessage(); // Shows the encrypted text
  displayAnswerBoxes();      // Shows empty answer boxes
  clearFeedback();
  
  console.log('[startNewPuzzle] Puzzle started:', {
    plaintext: gameState.currentPlaintext,
    encrypted: gameState.currentMessage,
    shift: gameState.currentShift,
    hint: `To decrypt, shift each letter BACK by ${gameState.currentShift} positions`
  });
}

// Update HUD displays
function updateHUD() {
  // Update level
  const levelDisplay = document.getElementById('currentLevel');
  if (levelDisplay) levelDisplay.textContent = gameState.level;
  
  // Update XP (show current level progress)
  const xpDisplay = document.getElementById('totalXP');
  if (xpDisplay) xpDisplay.textContent = `${gameState.currentLevelXP}/100`;
  
  // Update mastery
  const masteryDisplay = document.getElementById('masteryLevel');
  if (masteryDisplay) masteryDisplay.textContent = gameState.mastery;
  
  // Update title screen stats
  const startMastery = document.getElementById('startMasteryLevel');
  if (startMastery) startMastery.textContent = gameState.mastery;
  
  const startXP = document.getElementById('startTotalXP');
  if (startXP) startXP.textContent = gameState.totalXP;
}

// Display Shift Number (Fixed)
function displayShiftNumber() {
  const shiftDisplay = document.getElementById('shiftNumberDisplay');
  shiftDisplay.textContent = gameState.currentShift;
}

// Display Encrypted Message
function displayEncryptedMessage() {
  const encryptedText = document.getElementById('encryptedText');
  encryptedText.textContent = gameState.currentMessage;
}

// Display Answer Boxes
function displayAnswerBoxes() {
  const container = document.getElementById('answerInputBoxes');
  container.innerHTML = '';
  
  gameState.currentPlaintext.split('').forEach((char, index) => {
    const box = document.createElement('div');
    
    if (char === ' ') {
      // Space
      box.className = 'answer-box space';
    } else {
      // Letter box
      const userLetter = gameState.currentAnswer[index] || '';
      const correctLetter = gameState.currentPlaintext[index];
      
      // Determine color based on correctness
      if (!userLetter) {
        box.className = 'answer-box'; // Empty - blue
      } else if (userLetter === correctLetter) {
        box.className = 'answer-box correct-live'; // Correct - green
      } else {
        box.className = 'answer-box incorrect-live'; // Incorrect - red
      }
      
      box.textContent = userLetter;
      box.dataset.index = index;
      
      // Click to select
      box.addEventListener('click', () => {
        selectAnswerBox(index);
      });
    }
    
    container.appendChild(box);
  });
}

// Select Answer Box
function selectAnswerBox(index) {
  gameState.selectedBoxIndex = index;
  
  // Update UI
  const boxes = document.querySelectorAll('.answer-box:not(.space)');
  boxes.forEach((box, i) => {
    if (parseInt(box.dataset.index) === index) {
      box.classList.add('selected');
    } else {
      box.classList.remove('selected');
    }
  });
}

// Setup Letter Ruler
function setupLetterRuler() {
  const ruler = document.getElementById('letterRuler');
  ruler.innerHTML = '';
  
  // Create A-Z buttons
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const key = document.createElement('button');
    key.className = 'letter-key';
    key.textContent = letter;
    key.addEventListener('click', () => inputLetter(letter));
    ruler.appendChild(key);
  }
}

// Input Letter from Ruler
function inputLetter(letter) {
  // Auto-select next empty box if no box is selected
  if (gameState.selectedBoxIndex === -1) {
    // Find first empty box
    for (let i = 0; i < gameState.currentAnswer.length; i++) {
      if (gameState.currentPlaintext[i] !== ' ' && !gameState.currentAnswer[i]) {
        gameState.selectedBoxIndex = i;
        break;
      }
    }
  }
  
  // Input letter if a box is selected
  if (gameState.selectedBoxIndex !== -1) {
    gameState.currentAnswer[gameState.selectedBoxIndex] = letter;
    
    // Update display
    displayAnswerBoxes();
    
    // Auto-select next empty box
    const nextEmptyIndex = findNextEmptyBox(gameState.selectedBoxIndex);
    if (nextEmptyIndex !== -1) {
      selectAnswerBox(nextEmptyIndex);
    } else {
      gameState.selectedBoxIndex = -1;
      // Remove all selected classes
      document.querySelectorAll('.answer-box.selected').forEach(box => {
        box.classList.remove('selected');
      });
    }
  }
}

// Find Next Empty Box
function findNextEmptyBox(startIndex) {
  for (let i = startIndex + 1; i < gameState.currentAnswer.length; i++) {
    if (gameState.currentPlaintext[i] !== ' ' && !gameState.currentAnswer[i]) {
      return i;
    }
  }
  return -1;
}

// Check Answer
function checkAnswer() {
  const userAnswer = gameState.currentAnswer.join('');
  const correctAnswer = gameState.currentPlaintext;
  
  if (userAnswer === correctAnswer) {
    // Correct!
    showFeedback('🎉 CORRECT! Amazing work, Code Breaker!', 'correct');
    markBoxes(true);
    
    // Award XP - 20 XP per puzzle
    const xpAwarded = 20;
    const previousLevel = gameState.level;
    
    gameState.totalXP += xpAwarded;
    gameState.puzzlesSolved++;
    updateLevelAndMastery();
    
    // Check if leveled up
    const leveledUp = gameState.level > previousLevel;
    
    // Save to localStorage
    localStorage.setItem('cyberedCrackXP', gameState.totalXP);
    localStorage.setItem('cyberedCrackSolved', gameState.puzzlesSolved);
    
    // Update HUD
    updateHUD();
    
    // Show success screen after delay
    setTimeout(() => {
      showSuccessScreen(xpAwarded, leveledUp);
    }, 1500);
  } else {
    // Incorrect
    showFeedback('❌ Not quite right. Keep trying!', 'incorrect');
    markBoxes(false);
  }
}

// Mark Boxes as Correct/Wrong
function markBoxes(isCorrect) {
  const boxes = document.querySelectorAll('.answer-box:not(.space)');
  boxes.forEach(box => {
    if (isCorrect) {
      box.classList.add('correct');
      box.classList.remove('wrong');
    } else {
      box.classList.add('wrong');
      setTimeout(() => box.classList.remove('wrong'), 500);
    }
  });
}

// Show Feedback
function showFeedback(message, type) {
  const feedback = document.getElementById('feedbackMessage');
  feedback.textContent = message;
  feedback.className = `feedback-message ${type}`;
}

// Clear Feedback
function clearFeedback() {
  const feedback = document.getElementById('feedbackMessage');
  feedback.textContent = '';
  feedback.className = 'feedback-message';
}

// Show Success Screen
function showSuccessScreen(xpAwarded, leveledUp) {
  const gameScreen = document.getElementById('gameScreen');
  const successScreen = document.getElementById('successScreen');
  const titleScreen = document.getElementById('titleScreen');
  
  gameScreen.classList.remove('active');
  successScreen.classList.add('active');
  titleScreen.classList.remove('active');
  
  // Update success screen content
  const xpDisplay = document.getElementById('xpAwarded');
  const totalXPDisplay = document.getElementById('totalXP');
  const messageDisplay = document.getElementById('successMessage');
  const solutionDisplay = document.getElementById('solutionInfo');
  
  xpDisplay.textContent = `+${xpAwarded} XP`;
  
  if (leveledUp) {
    totalXPDisplay.textContent = `🎉 LEVEL UP! Now Level ${gameState.level} (Mastery ${gameState.mastery})`;
    totalXPDisplay.style.color = '#10b981';
    totalXPDisplay.style.fontSize = '1rem';
  } else {
    totalXPDisplay.textContent = `Level ${gameState.level} Progress: ${gameState.currentLevelXP}/100 XP`;
    totalXPDisplay.style.color = '#94a3b8';
    totalXPDisplay.style.fontSize = '0.8rem';
  }
  
  messageDisplay.textContent = `You cracked the code! The message was "${gameState.currentPlaintext}" with a shift of ${gameState.currentShift}.`;
  
  // Educational fact
  const facts = [
    'The Caesar cipher is named after Julius Caesar, who used it to protect military messages.',
    'ROT13 is a Caesar cipher with a shift of 13, commonly used in online forums to hide spoilers.',
    'Modern encryption uses much more complex algorithms than simple substitution ciphers.',
    'Frequency analysis can help crack Caesar ciphers by looking at letter patterns.',
    'The Caesar cipher is vulnerable because there are only 25 possible shifts to try.'
  ];
  solutionDisplay.textContent = facts[Math.floor(Math.random() * facts.length)];
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

console.log('[game.js] Script loaded');


