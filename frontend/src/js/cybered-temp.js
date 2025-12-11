
(function swapHomeCards() {
  function reorder() {
  const grid = document.querySelector('main .home-grid');
    if (!grid) return false;

    const cards = Array.from(grid.children);
    const getCard = (regex) =>
      cards.find(el => {
        const h = el.querySelector('h3, h2');
        return h && regex.test(h.textContent.trim());
      });

    const daily = getCard(/daily\s+mission/i);
    const cont = getCard(/continue\s+module/i);

    if (grid && daily && cont && cont.nextSibling !== daily) {
      grid.insertBefore(cont, daily); 
      return true;
    }
    return false;
  }

 
  const start = Date.now();
  const timer = setInterval(() => {
    if (reorder() || Date.now() - start > 5000) clearInterval(timer);
  }, 100);
})();

// Daily Mission and Streak System
(async function initializeDailyMission() {
  // Check daily login on page load
  await checkDailyLogin();
  
  // Add click handler to daily mission button
  const dailyMissionBtn = document.getElementById('dailyMissionBtn');
  if (dailyMissionBtn) {
    dailyMissionBtn.addEventListener('click', handleDailyMissionClick);
  }
})();

async function checkDailyLogin() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const response = await fetch(`${window.API_BASE_URL}/api/users/daily-login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Daily login check result:', data);
      
      // Update UI if streak was updated
      if (data.streakUpdated) {
        showNotification(`🌱 Login streak: ${data.streak} day${data.streak > 1 ? 's' : ''}!`, 'success');
      }
      
      // Update daily mission button state
      updateDailyMissionButton(data.dailyMissionCompleted);
    } else {
      console.error('Daily login check failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error checking daily login:', error);
  }
}

function updateDailyMissionButton(completed) {
  const dailyMissionBtn = document.getElementById('dailyMissionBtn');
  if (!dailyMissionBtn) return;
  
  // TESTING MODE: Comment out the button disable to allow multiple clicks
  /*
  if (completed) {
    dailyMissionBtn.disabled = true;
    dailyMissionBtn.classList.add('completed');
    dailyMissionBtn.innerHTML = `
      <div class="text-small" style="text-align:center;">
        Completed Today
        <div class="mission-completed-text">Come back tomorrow!</div>
      </div>
    `;
  }
  */
}

async function handleDailyMissionClick() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showNotification('Please log in to complete daily missions', 'error');
      return;
    }
    
    const response = await fetch(`${window.API_BASE_URL}/api/users/complete-daily-mission`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Daily mission result:', data);
    
    if (data.alreadyCompleted) {
      showNotification(data.message, 'info');
      updateDailyMissionButton(true);
    } else if (data.success) {
      showNotification(`🎉 ${data.message}`, 'success');
      updateDailyMissionButton(true);
      
      // Update streak in localStorage for profile page
      if (data.streak !== undefined) {
        localStorage.setItem('userStreak', data.streak);
      }
      
      // Update XP display if it exists on the page
      const xpEl = document.querySelector('.stat-value');
      if (xpEl) {
        xpEl.textContent = data.totalXp;
      }
      
      // Dispatch event to update profile if on profile page
      window.dispatchEvent(new CustomEvent('streakUpdated', { 
        detail: { 
          streak: data.streak,
          xp: data.totalXp
        } 
      }));
      
      console.log('✅ Daily mission completed! Streak:', data.streak, 'Total XP:', data.totalXp);
    } else {
      showNotification(data.error || 'Failed to complete mission', 'error');
    }
  } catch (error) {
    console.error('Error completing daily mission:', error);
    showNotification('Failed to complete daily mission', 'error');
  }
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Home hero: reflect current module icon/name/progress
(function updateHomeHero(){
  function pagesFor(id){
    return {
      'web-security':'module-web-security.html',
      'network-defense':'module-network-defense.html',
      'cryptography':'module-cryptography.html',
      'malware-defense':'module-malware-defense.html'
    }[id] || 'modules.html';
  }
  try{
    // Check if user is new (no current module set)
    let mod = JSON.parse(localStorage.getItem('currentModule') || 'null');
    
    if (!mod) {
      // New user - set default starting module and save it
      mod = {
        id: 'web-security', 
        title: 'Web Security', 
        icon: '../../assets/images/Web Security.png',
        description: 'The Web Security module covers vulnerabilities such as SQL Injection, XSS, and CSRF, and secure practices to protect web applications.'
      };
      localStorage.setItem('currentModule', JSON.stringify(mod));
    }
    const iconEl = document.getElementById('homeHeroIcon');
    const titleEl = document.getElementById('homeHeroTitle');
    const fillEl = document.getElementById('homeHeroFill');
    const descEl = document.getElementById('homeHeroDesc');
    const linkEl = document.getElementById('homeContinueLink');
    if (iconEl && mod.icon) iconEl.src = mod.icon;
    if (titleEl && mod.title) titleEl.textContent = mod.title;
    if (linkEl) linkEl.href = pagesFor(mod.id);
    // description fallback map
    const descMap = {
      'web-security': 'The Web Security module covers vulnerabilities such as SQL Injection, XSS, and CSRF, and secure practices to protect web applications.',
      'network-defense': 'Threat identification, firewalls, intrusion detection, protocol security, and layered strategies.',
      'cryptography': 'Principles of encryption, hashing, key management and secure communication.',
      'malware-defense': 'Malware types, infection methods, detection techniques, and preventive measures.'
    };
    const desc = (mod && mod.description) || descMap[mod.id] || '';
    if (descEl) descEl.textContent = desc;
    // compute progress from localStorage
    const raw = localStorage.getItem('moduleProgress:'+mod.id);
    let pct = 0;
    if (raw){
      try{
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length){
          const done = arr.filter(Boolean).length; pct = Math.round((done / Math.max(1, arr.length)) * 100);
        }
      }catch{}
    }
    if (fillEl) fillEl.style.width = (pct || 0) + '%';
  }catch(e){}
})();
