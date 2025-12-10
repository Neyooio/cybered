document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_LESSONS = 4;
  const params = new URLSearchParams(location.search);
  const moduleKey = document.body.getAttribute('data-module') || params.get('module') || detectModuleFromPath();
  const lessonIndex = parseInt(document.body.getAttribute('data-lesson') || params.get('lesson') || detectLessonIndexFromPath(), 10) - 1;
  const backHref = getModuleHref(moduleKey);
  const back = document.getElementById('backToModule');
  if (back) back.href = backHref;

  // Sync hero title with page header title if present
  const pageTitle = document.querySelector('.page-header .title-medium');
  const heroTitle = document.querySelector('.lesson-hero .lesson-title');
  if (pageTitle && heroTitle) heroTitle.textContent = pageTitle.textContent;

  // Interactive Panel Toggle
  document.querySelectorAll('.panel-header').forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      if (content && content.classList.contains('panel-content')) {
        content.classList.toggle('collapsed');
        this.classList.toggle('collapsed');
      }
    });
  });

  // Prev/Next navigation inside the same lessons folder
  const prev = document.getElementById('prevLesson');
  const next = document.getElementById('nextLesson');
  const folder = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
  if (!Number.isNaN(lessonIndex)){
    if (prev){
      if (lessonIndex > 0){
        prev.href = folder + 'lesson-' + (lessonIndex) + '.html';
      } else {
        prev.classList.add('muted-text');
        prev.style.pointerEvents = 'none';
      }
    }
    if (next){
      if (lessonIndex + 1 < TOTAL_LESSONS){
        next.href = folder + 'lesson-' + (lessonIndex + 2) + '.html';
      } else {
        next.classList.add('muted-text');
        next.style.pointerEvents = 'none';
      }
    }
  }

  const completeBtn = document.getElementById('completeLesson');
  if (completeBtn) {
    // Check if user has achieved victory in battle
    const lessonNumber = parseInt(lessonIndex) + 1; // Convert index to lesson number (1-based)
    const lessonKey = `lesson_${moduleKey}_${lessonNumber}_victory`;
    
    // Function to check and update button state
    const updateCompleteButtonState = () => {
      const hasVictory = localStorage.getItem(lessonKey) === 'true';
      console.log('Checking victory status:', lessonKey, hasVictory); // Debug log
      
      if (hasVictory) {
        completeBtn.disabled = false;
        completeBtn.style.opacity = '1';
        completeBtn.style.cursor = 'pointer';
        completeBtn.title = 'Mark this lesson as complete';
      } else {
        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.5';
        completeBtn.style.cursor = 'not-allowed';
        completeBtn.title = 'You must achieve Victory in the battle quiz (score 8+) to mark this lesson complete';
      }
    };
    
    // Initial check
    updateCompleteButtonState();
    
    // Listen for storage changes (when battle quiz updates victory status)
    window.addEventListener('storage', (e) => {
      if (e.key === lessonKey) {
        updateCompleteButtonState();
      }
    });
    
    // Listen for custom event from battle quiz (same-tab updates)
    window.addEventListener('battleVictoryUpdated', (e) => {
      if (e.detail && e.detail.lessonKey === lessonKey) {
        updateCompleteButtonState();
      }
    });
    
    // Also check when the page becomes visible again (for same-tab updates)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateCompleteButtonState();
      }
    });
    
    completeBtn.addEventListener('click', () => {
      const hasVictory = localStorage.getItem(lessonKey) === 'true';
      if (!hasVictory) {
        alert('You must achieve Victory in the battle quiz (score 8 or above) before marking this lesson as complete!');
        return;
      }
      
      const completed = loadProgress(moduleKey, TOTAL_LESSONS);
      if (lessonIndex >= 0 && lessonIndex < completed.length){
        completed[lessonIndex] = true;
        saveProgress(moduleKey, completed);
      }
      location.href = backHref;
    });
  }
});

function detectModuleFromPath(){
  const parts = location.pathname.split('/');
  const mod = parts.find(p => ['web-security','network-defense','cryptography','malware-defense'].includes(p));
  return mod || 'module';
}
function detectLessonIndexFromPath(){
  const base = (location.pathname.split('/').pop() || '').toLowerCase();
  const m = base.match(/lesson-(\d+)\.html/);
  return m ? m[1] : '1';
}
function getModuleHref(moduleKey){
  switch(moduleKey){
    case 'web-security': return '../../module-web-security.html';
    case 'network-defense': return '../../module-network-defense.html';
    case 'cryptography': return '../../module-cryptography.html';
    case 'malware-defense': return '../../module-malware-defense.html';
    default: return '../../modules.html';
  }
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
