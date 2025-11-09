const challengesIndex = [
  { id: 'firewall-frenzy', title: 'Firewall Frenzy', icon: '../../assets/images/C2.png', difficulty: 'Easy', blurb: 'Turn-based Q&A defense battle.' },
  { id: 'crypto-crack', title: 'Crypto Crack', icon: '../../assets/images/C3.png', difficulty: 'Medium', blurb: 'Solve ciphers with earned hints.' },
  { id: 'intrusion-intercept', title: 'Intrusion Intercept', icon: '../../assets/images/C4.png', difficulty: 'Hard', blurb: 'Outsmart stealthy hacker NPCs before they breach the core.' },
  { id: 'header-check', title: 'Header Check', icon: '../../assets/images/C1.png', difficulty: 'Easy', blurb: 'Spot phishing clues in mail headers.' }
];

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
          <p class='challenge-difficulty'>${c.difficulty} • Challenge</p>
        </div>
      </div>
      <p class='challenge-description'>${c.blurb}</p>
      <div class='challenge-actions'>
        <button onclick="startChallenge('${c.id}')" class='challenge-play'>Play</button>
      </div>
    </div>`).join('');
}

function startChallenge(id) { alert('Launching challenge: ' + id); }

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
             challenge.blurb.toLowerCase().includes(searchTerm) ||
             challenge.difficulty.toLowerCase().includes(searchTerm);
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
              <p class='challenge-difficulty'>${c.difficulty} • Challenge</p>
            </div>
          </div>
          <p class='challenge-description'>${c.blurb}</p>
          <div class='challenge-actions'>
            <button onclick="startChallenge('${c.id}')" class='challenge-play'>Play</button>
          </div>
        </div>`).join('');
    }
  });
}
