
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
    const mod = JSON.parse(localStorage.getItem('currentModule') || 'null') || {
      id:'web-security', title:'Web Security', icon:'../../assets/images/Web Security.png'
    };
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