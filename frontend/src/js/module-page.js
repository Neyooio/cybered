document.addEventListener('DOMContentLoaded', () => {
  initModulePage();
});

function getModuleKey() {
  const file = (location.pathname.split('/').pop() || '').toLowerCase().replace('.html','');
  // e.g., module-web-security -> web-security
  return file.replace(/^module-/, '') || 'module';
}

function defaultLessons(moduleKey){
  // Per-module lesson titles (6 each to match existing lesson pages)
  const catalog = {
    'web-security': [
      'Lesson 1: Introduction to Web Security',
      'Lesson 2: Critical Web Application Vulnerabilities',
      'Lesson 3: Secure Coding and Web Hardening',
      'Lesson 4: Web Application Penetration Testing '
    ],
    'network-defense': [
      'Lesson 1: Networking Fundamentals',
      'Lesson 2: Common Network Threats',
      'Lesson 3: Firewalls, IDS, and IPS',
      'Lesson 4: Network Monitoring & Incident Response'
    ],
    'cryptography': [
      'Lesson 1: Fundamentals of Cryptography',
      'Lesson 2: Classical and Modern Encryption Algorithms',
      'Lesson 3: Hashing and Digital Signatures',
      'Lesson 4: Cryptography in Real-World Applications'
    ],
    'malware-defense': [
      'Lesson 1: Malware Types & Lifecycle',
      'Lesson 2: Infection Vectors & Payloads',
      'Lesson 3: Detection Techniques & Sandboxing',
      'Lesson 4: Endpoint Protection & Hardening'
    ]
  };

  const titles = catalog[moduleKey] || [
    'Lesson 1: Getting Started',
    'Lesson 2: Core Concepts',
    'Lesson 3: Best Practices',
    'Lesson 4: Hands-on Exercise'
  ];

  const iconBase = '../../assets/images/';
  const iconNames = ['C1.png','C2.png','C3.png','C4.png'];
  const icons = iconNames.map(n => iconBase + n);
  return titles.map((title, i) => ({ id: i+1, title, icon: icons[i % icons.length], progress: 0 }));
}

function loadProgress(moduleKey, count) {
  try {
    const raw = localStorage.getItem('moduleProgress:'+moduleKey);
    if (!raw) return Array(count).fill(false);
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return Array(count).fill(false);
    return arr.slice(0, count).concat(Array(Math.max(0, count - arr.length)).fill(false));
  } catch { return Array(count).fill(false); }
}

function saveProgress(moduleKey, completedArray){
  try { localStorage.setItem('moduleProgress:'+moduleKey, JSON.stringify(completedArray)); } catch {}
}

function initModulePage(){
  const grid = document.getElementById('lessonsGrid');
  if (!grid) return;
  const moduleKey = getModuleKey();
  const lessons = defaultLessons(moduleKey);
  const completed = loadProgress(moduleKey, lessons.length);

  renderLessons(grid, lessons, completed, moduleKey);
}

function renderLessons(root, lessons, completed, moduleKey){
  root.innerHTML = '';
  lessons.forEach((lesson, idx) => {
    const unlocked = idx === 0 || completed[idx-1] === true;
    const isDone = !!completed[idx];

    const card = document.createElement('div');
    card.className = 'lesson-card';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'lesson-icon';
    const img = document.createElement('img'); img.src = lesson.icon; img.alt = '';
    iconWrap.appendChild(img);

    const body = document.createElement('div');
    body.className = 'lesson-body';
    const title = document.createElement('div');
    title.className = 'lesson-title';
    title.textContent = lesson.title;
    const prog = document.createElement('div'); prog.className = 'lesson-progress';
    const fill = document.createElement('div'); fill.className = 'lesson-fill'; fill.style.width = (isDone ? '100%' : '0%');
    prog.appendChild(fill);
    body.appendChild(title); body.appendChild(prog);

    const cta = document.createElement('div'); cta.className = 'lesson-cta';
    if (unlocked && !isDone){
      const btn = document.createElement('a');
      btn.className = 'start-pill'; btn.textContent = 'Start';
      btn.href = `lessons/${moduleKey}/lesson-${idx+1}.html`;
      cta.appendChild(btn);
    } else if (isDone){
      const link = document.createElement('a');
      link.className = 'start-pill';
      link.style.background = 'var(--green-400)';
      link.style.color = '#000';
      link.textContent = 'Open';
      link.href = `lessons/${moduleKey}/lesson-${idx+1}.html`;
      cta.appendChild(link);
    } else {
      const lock = document.createElement('div'); lock.className = 'lock-pill';
  const limg = document.createElement('img'); limg.src = '../../assets/images/Lock.png'; limg.alt = '';
      const span = document.createElement('span'); span.textContent = 'Lock';
      lock.appendChild(limg); lock.appendChild(span);
      cta.appendChild(lock);
    }

    card.appendChild(iconWrap); card.appendChild(body); card.appendChild(cta);
    root.appendChild(card);
  });
}
