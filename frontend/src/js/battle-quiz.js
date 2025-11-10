// Battle Quiz System - Pokemon GBA Style
class BattleQuiz {
  constructor(module, lessonNumber) {
    this.module = module;
    this.lessonNumber = lessonNumber;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.playerHealth = 10;
    this.monsterHealth = 10;
    this.maxHealth = 10;
    this.score = 0;
    this.correctAnswers = 0;
    this.startTime = null;
    this.questionStartTime = null;
    this.monster = null;
    this.isAnswering = false;
    this.battleMusic = null;
    
    this.init();
  }
  
  async init() {
    // Don't auto-show, wait for user to click trigger button
    console.log('Battle Quiz initialized for', this.module, 'Lesson', this.lessonNumber);
  }
  
  openOverlay() {
    const overlay = document.getElementById('battleOverlay');
    const container = document.getElementById('battleContainer');
    if (!overlay || !container) {
      console.error('Battle overlay elements not found');
      return;
    }
    
    // Show overlay
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
    
    // Reset state
    this.playerHealth = 10;
    this.monsterHealth = 10;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    
    // Show start screen
    this.renderStartScreen(container);
  }
  
  closeOverlay() {
    const overlay = document.getElementById('battleOverlay');
    if (!overlay) return;
    
    // Stop battle music
    this.stopBattleMusic();
    
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      // Reset state
      this.playerHealth = 10;
      this.monsterHealth = 10;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.correctAnswers = 0;
    }, 300);
  }
  
  renderStartScreen(container) {
    container.innerHTML = `
      <div class="battle-start-screen">
        <div class="battle-start-card">
          <button class="battle-close-btn" onclick="battleQuiz.closeOverlay()">✕</button>
          
          <div class="battle-start-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
          </div>
          
          <h2 class="battle-start-title">Battle Quiz</h2>
          
          <p class="battle-start-description">
            Test your knowledge through a game to complete this module.
          </p>
          
          <div class="battle-start-rules">
            <h3>How to Play:</h3>
            <ul>
              <li>Answer 10 questions to complete the quiz</li>
              <li>Each answer (correct or wrong) deals 1 damage</li>
              <li>You must have an average of 80 percent life to move to the next lesson</li>
              <li>Defeat the monster to prove your knowledge</li>
            </ul>
          </div>
          
          <button class="battle-start-button" onclick="battleQuiz.startBattle()">
            <span class="play-icon">▶</span> Start Battle
          </button>
        </div>
      </div>
    `;
  }
  
  async startBattle() {
    const container = document.getElementById('battleContainer');
    
    // Show loading screen
    container.innerHTML = `
      <div class="battle-arena ${this.module}">
        <div class="battle-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading battle...</div>
        </div>
      </div>
    `;
    
    try {
      const response = await fetch(`http://localhost:4000/api/quiz/battle/start/${this.module}/${this.lessonNumber}`);
      
      if (!response.ok) throw new Error('Failed to load quiz');
      
      const data = await response.json();
      this.questions = data.questions;
      this.monster = data.monster;
      this.startTime = Date.now();
      
      // Start the Pokemon-style intro sequence
      await this.playIntroSequence(container);
      
    } catch (error) {
      console.error('Error starting battle:', error);
      container.innerHTML = `
        <div class="battle-arena ${this.module}">
          <div class="battle-message error">
            Failed to load quiz. Please try again.
          </div>
          <button class="start-battle-btn" onclick="battleQuiz.startBattle()" style="margin-top: 1rem;">
            Try Again
          </button>
        </div>
      `;
    }
  }
  
  renderBattle(container) {
    container.innerHTML = `
      <div class="battle-transition" id="battleTransition"></div>
      <div class="battle-arena intro-bg ${this.module}">
        <!-- Bottom Blocker - Hides lower portion during intro -->
        <div class="bottom-blocker" id="bottomBlocker"></div>
        
        <!-- Blue Panel with Question & Answers -->
        <div class="battle-panel intro-hidden" id="battlePanel">
          <!-- Intro content (shows first, then hidden) -->
          <div class="intro-panel-content" id="introPanelContent">
            <h2 class="intro-panel-title">A wild ${this.monster.name} appears!</h2>
            <p class="intro-panel-subtitle">Prepare for battle!</p>
          </div>
          
          <!-- Question content (hidden at first, then shown) -->
          <div class="question-side" id="questionSide" style="display: none;">
            <div class="question-header">
              <div class="question-number" id="questionNumber">Question 1/10</div>
              <div class="question-timer">
                <span class="timer-icon">⏱️</span>
                <span id="timerText">00:00</span>
              </div>
            </div>
            <div class="question-text" id="questionText">Loading...</div>
          </div>
          
          <!-- Answer content (hidden at first, then shown) -->
          <div class="answer-side" id="answerSide" style="display: none;">
            <!-- Answers will be inserted here -->
          </div>
        </div>
        
        <!-- Status Panels -->
        <div class="battle-status intro-hidden">
          <div class="player-panel">
            <div class="player-info">
              <span class="player-name">You</span>
              <span class="player-level">Lvl 1</span>
            </div>
            <div class="health-bar-container">
              <div class="health-bar high" id="playerHealthBar" style="width: 100%;">
                <span id="playerHealthText">${this.playerHealth} / ${this.maxHealth}</span>
              </div>
            </div>
          </div>
          
          <div class="enemy-panel">
            <div class="enemy-info">
              <span class="enemy-name">${this.monster.name}</span>
              <span class="enemy-level">Lvl ${this.monster.level}</span>
            </div>
            <div class="health-bar-container">
              <div class="health-bar high" id="monsterHealthBar" style="width: 100%;">
                <span id="monsterHealthText">${this.monsterHealth} / ${this.maxHealth}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Battle Sprites -->
            <div class="battle-stage">
              <div class="sprite-slot player" id="playerSpriteSlot">
                <img src="${this.getPlayerSprite()}" alt="Player" id="playerSprite" class="player-sprite" />
              </div>
              <div class="sprite-slot enemy" id="enemySpriteSlot">
                <img src="${this.monster.spriteUrl}" alt="${this.monster.name}" id="monsterSprite" class="enemy-sprite" />
              </div>
            </div>
        
        <!-- Battle Messages -->
        <div id="battleMessages"></div>
      </div>
    `;
  }
  
  showQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endBattle();
      return;
    }
    
    this.questionStartTime = Date.now();
    this.isAnswering = false;
    
    const question = this.questions[this.currentQuestionIndex];
    
    // Update question side
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    questionNumber.textContent = `Question ${this.currentQuestionIndex + 1}/10`;
    questionText.textContent = question.question;
    
    // Update answer side
    const answerSide = document.getElementById('answerSide');
    answerSide.innerHTML = question.choices.map((choice, index) => `
      <button class="move-button" onclick="battleQuiz.selectAnswer(${index})" id="choice${index}">
        ${choice.text}
        <span class="move-letter">${String.fromCharCode(65 + index)}</span>
      </button>
    `).join('');
    
    // Start timer
    this.startTimer();
  }
  
  startTimer() {
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.questionStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const timerText = document.getElementById('timerText');
      if (timerText) {
        timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);
  }
  
  async selectAnswer(choiceIndex) {
    if (this.isAnswering) return;
    this.isAnswering = true;
    
    clearInterval(this.timerInterval);
    const timeToAnswer = Math.floor((Date.now() - this.questionStartTime) / 1000);
    
    // Disable all buttons
    document.querySelectorAll('.move-button').forEach(btn => btn.disabled = true);
    
    const question = this.questions[this.currentQuestionIndex];
    const correctIndex = question.choices.findIndex(c => c.isCorrect);
    const isCorrect = choiceIndex === correctIndex;
    
    // Visual feedback
    const selectedButton = document.getElementById(`choice${choiceIndex}`);
    const correctButton = document.getElementById(`choice${correctIndex}`);
    
    if (isCorrect) {
      selectedButton.classList.add('correct');
      await this.dealDamage(timeToAnswer);
    } else {
      selectedButton.classList.add('incorrect');
      correctButton.classList.add('correct');
      await this.takeDamage();
    }
    
    // Wait for animation
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.showQuestion();
    }, 2000);
  }
  
  async dealDamage(timeToAnswer) {
    let damage = 1;
    
    this.showMessage(`Correct! ${damage} damage dealt! ✓`, 'success');
    
    this.monsterHealth = Math.max(0, this.monsterHealth - damage);
    this.score += damage;
    this.correctAnswers++;
    
    // Play hit sound
    this.playSound('../../../../assets/audios/battle-hit.mp3', 0.5);
    
    // Apply shake animation to the sprite SLOT (not the image)
    const enemySpriteSlot = document.getElementById('enemySpriteSlot');
    const monsterSprite = document.getElementById('monsterSprite');
    
    if (!enemySpriteSlot || !monsterSprite) {
      console.error('❌ Enemy sprite elements not found!');
      return;
    }
    
    console.log('🎯 MONSTER HIT! Applying .hurt class to sprite slot');
    
    // Add hurt class for shake animation
    enemySpriteSlot.classList.add('hurt');
    
    // Add subtle red filter to the image
    monsterSprite.style.filter = 'drop-shadow(0 1.4vw 1.6vw rgba(255,0,0,0.4)) brightness(1.2) saturate(1.5) hue-rotate(-10deg)';
    
    // Remove hurt class and reset filter when animation ends
    const handleAnimationEnd = () => {
      enemySpriteSlot.classList.remove('hurt');
      monsterSprite.style.filter = 'drop-shadow(0 1.4vw 1.6vw rgba(0,0,0,0.8))';
      enemySpriteSlot.removeEventListener('animationend', handleAnimationEnd);
      console.log('✅ Shake animation completed');
    };
    
    enemySpriteSlot.addEventListener('animationend', handleAnimationEnd);
    
    this.updateHealthBars();
    
    if (this.monsterHealth <= 0) {
      setTimeout(() => this.victory(), 1000);
    }
  }
  
  async takeDamage() {
    const damage = 1;
    this.playerHealth = Math.max(0, this.playerHealth - damage);
    
    this.showMessage(`Wrong answer! You took ${damage} damage! ✗`, 'error');
    
    // Play hit sound
    this.playSound('../../../../assets/audios/battle-hit.mp3', 0.5);
    
    // Apply shake animation to the sprite SLOT (not the image)
    const playerSpriteSlot = document.getElementById('playerSpriteSlot');
    const playerSprite = document.getElementById('playerSprite');
    
    if (!playerSpriteSlot || !playerSprite) {
      console.error('❌ Player sprite elements not found!');
      return;
    }
    
    console.log('💔 PLAYER HIT! Applying .hurt class to sprite slot');
    
    // Add hurt class for shake animation
    playerSpriteSlot.classList.add('hurt');
    
    // Add subtle red filter to the image
    playerSprite.style.filter = 'drop-shadow(0 1.4vw 1.6vw rgba(255,0,0,0.4)) brightness(1.2) saturate(1.5) hue-rotate(-10deg)';
    
    // Remove hurt class and reset filter when animation ends
    const handleAnimationEnd = () => {
      playerSpriteSlot.classList.remove('hurt');
      playerSprite.style.filter = 'drop-shadow(0 1.4vw 1.6vw rgba(0,0,0,0.8))';
      playerSpriteSlot.removeEventListener('animationend', handleAnimationEnd);
      console.log('✅ Shake animation completed');
    };
    
    playerSpriteSlot.addEventListener('animationend', handleAnimationEnd);
    
    this.updateHealthBars();
    
    if (this.playerHealth <= 0) {
      setTimeout(() => this.defeat(), 1000);
    }
  }
  
  updateHealthBars() {
    // Update player health
    const playerHealthBar = document.getElementById('playerHealthBar');
    const playerHealthText = document.getElementById('playerHealthText');
    const playerPercent = (this.playerHealth / this.maxHealth) * 100;
    
    playerHealthBar.style.width = playerPercent + '%';
    playerHealthText.textContent = `${this.playerHealth} / ${this.maxHealth}`;
    
    if (playerPercent > 50) {
      playerHealthBar.className = 'health-bar high';
    } else if (playerPercent > 25) {
      playerHealthBar.className = 'health-bar medium';
    } else {
      playerHealthBar.className = 'health-bar low';
    }
    
    // Update monster health
    const monsterHealthBar = document.getElementById('monsterHealthBar');
    const monsterHealthText = document.getElementById('monsterHealthText');
    const monsterPercent = (this.monsterHealth / this.maxHealth) * 100;
    
    monsterHealthBar.style.width = monsterPercent + '%';
    monsterHealthText.textContent = `${this.monsterHealth} / ${this.maxHealth}`;
    
    if (monsterPercent > 50) {
      monsterHealthBar.className = 'health-bar high';
    } else if (monsterPercent > 25) {
      monsterHealthBar.className = 'health-bar medium';
    } else {
      monsterHealthBar.className = 'health-bar low';
    }
  }
  
  showMessage(message, type = '') {
    const messagesDiv = document.getElementById('battleMessages');
    messagesDiv.innerHTML = `<div class="battle-message ${type}">${message}</div>`;
    
    setTimeout(() => {
      messagesDiv.innerHTML = '';
    }, 2000);
  }
  
  victory() {
    clearInterval(this.timerInterval);
    this.stopBattleMusic();
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = Math.round((this.correctAnswers / this.questions.length) * 100);
    
    const container = document.getElementById('battleContainer');
    container.innerHTML = `
      <div class="battle-arena ${this.module}">
        <div class="battle-result-card">
          <h2 class="result-title victory">VICTORY</h2>
          <p class="result-subtitle">You defeated ${this.monster.name}!</p>
          
          <div class="result-stats">
            <div class="result-stat">
              <span class="stat-label">SCORE:</span>
              <span class="stat-value">${this.score}</span>
            </div>
            <div class="result-stat">
              <span class="stat-label">ACCURACY:</span>
              <span class="stat-value">${accuracy}%</span>
            </div>
            <div class="result-stat">
              <span class="stat-label">CORRECT ANSWERS:</span>
              <span class="stat-value">${this.correctAnswers}/${this.questions.length}</span>
            </div>
            <div class="result-stat">
              <span class="stat-label">TIME:</span>
              <span class="stat-value">${Math.floor(totalTime / 60)}:${String(totalTime % 60).padStart(2, '0')}</span>
            </div>
          </div>
          
          <button class="battle-result-button" onclick="battleQuiz.openOverlay()">
            PLAY AGAIN
          </button>
          <button class="battle-result-button secondary" onclick="battleQuiz.closeOverlay()">
            CLOSE
          </button>
        </div>
      </div>
    `;
  }
  
  defeat() {
    clearInterval(this.timerInterval);
    this.stopBattleMusic();
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    const accuracy = Math.round((this.correctAnswers / Math.max(1, this.currentQuestionIndex)) * 100);
    
    const container = document.getElementById('battleContainer');
    container.innerHTML = `
      <div class="battle-arena ${this.module}">
        <div class="battle-result-card">
          <h2 class="result-title defeat">DEFEATED</h2>
          <p class="result-subtitle">${this.monster.name} won this battle...</p>
          
          <div class="result-stats">
            <div class="result-stat">
              <span class="stat-label">SCORE:</span>
              <span class="stat-value">${this.score}</span>
            </div>
            <div class="result-stat">
              <span class="stat-label">ACCURACY:</span>
              <span class="stat-value">${accuracy}%</span>
            </div>
            <div class="result-stat">
              <span class="stat-label">CORRECT ANSWERS:</span>
              <span class="stat-value">${this.correctAnswers}/${this.currentQuestionIndex}</span>
            </div>
            <div class="result-stat">
              <span class="stat-label">TIME:</span>
              <span class="stat-value">${Math.floor(totalTime / 60)}:${String(totalTime % 60).padStart(2, '0')}</span>
            </div>
          </div>
          
          <button class="battle-result-button" onclick="battleQuiz.openOverlay()">
            TRY AGAIN
          </button>
          <button class="battle-result-button secondary" onclick="battleQuiz.closeOverlay()">
            CLOSE
          </button>
        </div>
      </div>
    `;
  }
  
  endBattle() {
    if (this.monsterHealth > 0) {
      this.defeat();
    } else {
      this.victory();
    }
  }
  
  getPlayerSprite() {
    // Get the user's current avatar from localStorage
    const avatarName = localStorage.getItem('cyberedAvatarName') || localStorage.getItem('cyberedAvatar') || '';
    
    // Map avatar name to battle sprite (e.g., 'sen' -> 'sen-battle.png')
    if (avatarName) {
      // Remove any file extension if present
      const cleanName = avatarName.replace(/\.(png|jpg|jpeg|gif)$/i, '');
      return `../../../../assets/images/battle_avatar/${cleanName}-battle.png`;
    }
    
    // Default to 'sen' if no avatar is set
    return '../../../../assets/images/battle_avatar/sen-battle.png';
  }
  
  playSound(soundUrl, volume = 0.5) {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      audio.play().catch(err => {
        console.log('Could not play sound:', err);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
  
  playMonsterSound() {
    if (!this.monster || !this.monster.audioUrl) {
      console.log('No monster audio available');
      return;
    }
    
    try {
      const audio = new Audio(this.monster.audioUrl);
      audio.volume = 0.6; // Set volume to 60%
      audio.play().catch(err => {
        console.log('Could not play monster sound:', err);
      });
    } catch (error) {
      console.error('Error playing monster sound:', error);
    }
  }
  
  playBattleMusic() {
    try {
      this.battleMusic = new Audio('../../../../assets/audios/battle-opener.mp3');
      this.battleMusic.volume = 0.3; // Set volume to 30%
      
      // Define loop points (adjust these based on your audio file)
      const loopStart = 8.0;  // Start of looping section in seconds
      const loopEnd = 14.0;   // End of looping section in seconds
      
      let hasIntroPlayed = false; // Track if intro has played
      
      // Start playing from the beginning
      this.battleMusic.play().catch(err => {
        console.log('Could not play battle music:', err);
      });
      
      // Monitor playback and handle looping
      this.battleMusic.addEventListener('timeupdate', () => {
        const currentTime = this.battleMusic.currentTime;
        
        // If we haven't played the intro yet and we've reached the loop start point
        if (!hasIntroPlayed && currentTime >= loopStart) {
          hasIntroPlayed = true; // Mark intro as played
        }
        
        // If intro has played and we've reached the loop end, jump back to loop start
        if (hasIntroPlayed && currentTime >= loopEnd) {
          this.battleMusic.currentTime = loopStart;
        }
      });
      
    } catch (error) {
      console.error('Error playing battle music:', error);
    }
  }
  
  stopBattleMusic() {
    if (this.battleMusic) {
      this.battleMusic.pause();
      this.battleMusic.currentTime = 0;
      this.battleMusic = null;
    }
  }
  
  async playIntroSequence(container) {
    // Step 1: Render the battle arena with all elements hidden
    this.renderBattle(container);
    
    // Start battle music immediately before any animations
    this.playBattleMusic();
    
    await this.delay(100);
    
    // Step 2: Play transition wipe effect (no sound here)
    const transition = document.getElementById('battleTransition');
    transition.classList.add('active');
    
    await this.delay(800);
    
    // Step 3: Slide in background
    const arena = container.querySelector('.battle-arena');
    arena.classList.add('animate-in');
    
    await this.delay(400);
    
    // Step 4: Show blue battle panel first with intro text
    const battlePanel = document.getElementById('battlePanel');
    battlePanel.classList.remove('intro-hidden');
    battlePanel.classList.add('animate-in');
    
    // Hide bottom blocker when panel appears
    const bottomBlocker = document.getElementById('bottomBlocker');
    bottomBlocker.classList.add('fade-out');
    
    await this.delay(1500); // Let the message display
    
    // Step 5: Hide intro text and show question/answer content
    const introPanelContent = document.getElementById('introPanelContent');
    const questionSide = document.getElementById('questionSide');
    const answerSide = document.getElementById('answerSide');
    
    introPanelContent.style.display = 'none';
    questionSide.style.display = 'flex';
    answerSide.style.display = 'grid';
    
    await this.delay(400);
    
    // Step 6: Animate status panels
    const status = container.querySelector('.battle-status');
    status.classList.remove('intro-hidden');
    status.classList.add('animate-in');
    
    await this.delay(300);
    
    // Step 7: Player sprite slides in from left
    const playerSprite = document.getElementById('playerSprite');
    playerSprite.classList.remove('intro-hidden');
    playerSprite.classList.add('animate-in');
    
    await this.delay(500);
    
    // Re-enable float animation for player
    playerSprite.classList.add('intro-complete');
    
  // Step 8: Enemy sprite appears on the RIGHT under its panel
  const enemySprite = document.getElementById('monsterSprite');
  const enemySpriteSlot = document.getElementById('enemySpriteSlot');
  enemySprite.classList.remove('intro-hidden');
  // Ensure no leftover animation moves it across the arena
  enemySprite.classList.remove('animate-in');
  enemySprite.style.transform = '';
  enemySprite.classList.add('sprite-flash', 'intro-complete');
    
  // Play monster cry and shake animation simultaneously
  await this.delay(150);
  this.playMonsterSound();
  
  // Add shake effect to monster during its cry
  enemySpriteSlot.classList.add('hurt');
  const handleIntroShake = () => {
    enemySpriteSlot.classList.remove('hurt');
    enemySpriteSlot.removeEventListener('animationend', handleIntroShake);
  };
  enemySpriteSlot.addEventListener('animationend', handleIntroShake);
    
    await this.delay(400);
    
    // Step 9: Brief pause to let the moment settle
    await this.delay(300);
    
    // Step 10: Show the first question (content already in the panel)
    this.showQuestion();
  }  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize battle quiz on page load
let battleQuiz;

document.addEventListener('DOMContentLoaded', () => {
  // Check if battle overlay exists on this page
  const battleOverlay = document.getElementById('battleOverlay');
  
  if (battleOverlay) {
    // Extract module and lesson from body data attributes or URL
    const body = document.querySelector('body');
    const module = body.getAttribute('data-module');
    const lessonNumber = parseInt(body.getAttribute('data-lesson'));
    
    if (module && lessonNumber) {
      battleQuiz = new BattleQuiz(module, lessonNumber);
    }
  }
});
