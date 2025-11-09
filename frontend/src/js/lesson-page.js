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
    completeBtn.addEventListener('click', () => {
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
