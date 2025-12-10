document.addEventListener("DOMContentLoaded", () => {
 
  const HOMEPAGE_PATH = "./cybered.html";
  const ADMIN_PAGE_PATH = "./admin/user-management.html";
  // Dynamic API base: uses stored override, else derives from current host
  function deriveApiBase(){
    try{
      const stored = localStorage.getItem('apiBase');
      if (stored) return stored.replace(/\/$/, '');
      const { protocol, hostname } = window.location || {};
      
      // Production environment (Netlify or GitHub Pages)
      if (hostname && (hostname.includes('netlify.app') || hostname.includes('github.io'))) {
        return 'https://cybered-backend.onrender.com/api';
      }
      
      // Local development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:4000/api';
      }
      
      // Network access (IP address)
      if (hostname) {
        return `${protocol}//${hostname}:4000/api`;
      }
    }catch{}
    return 'http://localhost:4000/api';
  }
  const API_BASE = deriveApiBase(); // backend base URL

  // Intro dialogue handling 
  const overlay = document.getElementById("introOverlay");         
  const blurWrapper = document.getElementById("signupBlurWrapper"); 
  const textEl = document.getElementById("dialogueText");           

 
  const dialogues = [
    `Hello, Welcome to <span class="clr-dark-red">Cyber Ed</span>, your Cybersecurity e-learning buddy.`,
    `Before you begin to explore our website, you must <span class="clr-dark-red">create an account</span> first.`
  ];

  let step = 0;
  const renderDialogue = () => { if (textEl) textEl.innerHTML = dialogues[step]; };

  // Smoothly hide the intro overlay and enable the form
  const finishIntro = () => {
    if (!overlay || !blurWrapper) return;
    overlay.classList.add("fade-out");
    blurWrapper.classList.remove("blur-lg", "pointer-events-none");
    blurWrapper.classList.add("pointer-events-auto");
    setTimeout(() => (overlay.style.display = "none"), 400);
  };

  
  window.advanceDialogue = function advanceDialogue() {
    if (step < dialogues.length - 1) { step += 1; renderDialogue(); }
    else { finishIntro(); }
  };
  renderDialogue();

  // Auth form behavior (toggle Sign up/Login)
  const registerForm = document.getElementById("registerForm");
  const signupFields = document.getElementById("signupFields");
  const loginFields = document.getElementById("loginFields");
  const toggleBtn = document.getElementById("toggleFormBtn");
  const formTitle = document.getElementById("formTitle");
  const toggleText = document.getElementById("toggleText");

  // Inputs referenced for validation toggling
  const regUsername = document.getElementById("regUsername");
  const regEmail = document.getElementById("regEmail");
  const regPhone = document.getElementById("regPhone");
  const regPassword = document.getElementById("regPassword");
  const pwMeterFill = document.getElementById('pwMeterFill');
  const pwChecklist = document.getElementById('pwChecklist');
  const pwHint = document.getElementById('pwHint');
  const basePwHint = 'Use at least 8 characters with uppercase, lowercase, number, and symbol.';
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  let isLogin = false; // false => Sign Up view, true => Login view

 
  function syncRequired() {
    if (!regUsername || !regEmail || !regPhone || !regPassword || !loginEmail || !loginPassword) return;
    regUsername.required = !isLogin;
    regEmail.required = !isLogin;
    regPhone.required = !isLogin;
    regPassword.required = !isLogin;
    loginEmail.required = isLogin;
    loginPassword.required = isLogin;
  }
  syncRequired();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      isLogin = !isLogin;

      // Show/hide the correct field groups
      signupFields.classList.toggle("hidden", isLogin);
      loginFields.classList.toggle("hidden", !isLogin);

      formTitle.textContent = isLogin ? "Login" : "Sign Up";
      toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
      toggleBtn.textContent = isLogin ? "Sign Up" : "Login";

      
      syncRequired();
    });
  }

  // Password strength evaluation and UI updates
  function evalPassword(pw=''){
    const res = {
      len: pw.length >= 8,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      num: /\d/.test(pw),
      sym: /[^A-Za-z0-9]/.test(pw)
    };
    res.score = Object.values(res).filter(Boolean).length; // 0..5
    return res;
  }

  function updatePwUI(pw){
    const res = evalPassword(pw);
    // checklist
    if (pwChecklist){
      ['len','lower','upper','num','sym'].forEach(k => {
        const li = pwChecklist.querySelector(`[data-req="${k}"]`);
        if (li) li.classList.toggle('ok', !!res[k]);
      });
    }
    // meter
    if (pwMeterFill){
      const pct = Math.min(100, res.score * 20);
      pwMeterFill.style.width = pct + '%';
      pwMeterFill.style.backgroundColor = res.score <= 2 ? '#ef4444' : res.score === 3 ? '#f59e0b' : '#22c55e';
    }
    // hint bubble
    if (pwHint){
      const ok = res.len && res.lower && res.upper && res.num && res.sym;
      pwHint.style.display = 'block';
      pwHint.classList.toggle('ok', ok);
      pwHint.classList.toggle('bad', !ok);
      pwHint.textContent = ok ? 'Great! Strong password.' : basePwHint;
    }
    return res;
  }

  regPassword?.addEventListener('input', (e)=> updatePwUI(e.target.value));
  regPassword?.addEventListener('focus', (e)=>{
    if (pwHint){ pwHint.style.display='block'; }
    updatePwUI(e.target.value || '');
  });
  regPassword?.addEventListener('blur', (e)=>{
    const to = e.relatedTarget;
    const isEye = !!(to && (to.id === 'toggleRegPassword' || to.classList?.contains('reg-eye')));
    if (!isEye && pwHint){ pwHint.style.display='none'; }
  });

  
  function setupPasswordToggle(inputId, eyeId) {
    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);
    if (!input || !eye) return;

    eye.setAttribute("role", "button");
    eye.tabIndex = 0;

    const sync = () => {
      const isHidden = input.type === "password";
      eye.classList.toggle("eye-open", !isHidden);
      eye.classList.toggle("eye-closed", isHidden);
      eye.setAttribute("aria-label", isHidden ? "Show password" : "Hide password");
      eye.setAttribute("aria-pressed", String(!isHidden));
    };

    const toggle = () => {
      input.type = input.type === "password" ? "text" : "password";
      sync();
      // keep focus on the input and force re-evaluation of strength UI
      try { input.focus(); } catch {}
      try { input.dispatchEvent(new Event('input', { bubbles:true })); } catch {}
    };

    sync();
  // prevent losing focus when mouse is pressed on the eye icon (avoids blur/flicker)
  eye.addEventListener('mousedown', (e)=> e.preventDefault());
  eye.addEventListener("click", toggle);
    eye.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }
  // Initialize for both forms
  setupPasswordToggle("regPassword", "toggleRegPassword");
  setupPasswordToggle("loginPassword", "toggleLoginPassword");


  const avatarOverlay = document.getElementById("avatarOverlay");
  const avatarGrid = document.getElementById("avatarGrid");
  const avatarPlayBtn = document.getElementById("avatarPlayBtn");
  let selectedAvatar = null; 

  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmAvatarName = document.getElementById("confirmAvatarName");
  const confirmYesBtn = document.getElementById("confirmYesBtn");
  const confirmNoBtn = document.getElementById("confirmNoBtn");

 
  function openAvatarOverlay() {
    avatarOverlay.classList.remove("hidden");
    selectedAvatar = null;
  
    for (const btn of avatarGrid.querySelectorAll(".avatar-option")) {
      btn.classList.remove("is-selected");
    }
    avatarPlayBtn.disabled = true;
  }

  function openConfirm() {
    if (!selectedAvatar) return;
    
    if (confirmAvatarName) confirmAvatarName.textContent = selectedAvatar.name || "";
    avatarOverlay.classList.add("is-blurred");
    confirmOverlay.classList.remove("hidden");
  }
  function closeConfirm() {
    confirmOverlay.classList.add("hidden");
    avatarOverlay.classList.remove("is-blurred");
  }


  avatarGrid?.querySelectorAll(".avatar-option").forEach(btn => btn.tabIndex = 0);

  if (avatarGrid) {
    const clearSelections = () => avatarGrid.querySelectorAll(".avatar-option")
      .forEach(b => b.classList.remove("is-selected"));

    const updateContinueState = () => { avatarPlayBtn.disabled = !selectedAvatar; };

    avatarGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".avatar-option");
      if (!btn) return;

     
      if (btn.classList.contains("is-selected")) {
        btn.classList.remove("is-selected");
        selectedAvatar = null;
        updateContinueState();
        return;
      }

     
      clearSelections();
      btn.classList.add("is-selected");
      selectedAvatar = {
        id: btn.dataset.id,
        src: btn.dataset.src,
        name: btn.dataset.name || btn.querySelector(".avatar-name")?.textContent?.trim() || ""
      };
      updateContinueState();
    });

    // Keyboard support
    avatarGrid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const btn = e.target.closest(".avatar-option");
      if (!btn) return;
      e.preventDefault();
      btn.click();
    });
  }

  
  if (avatarPlayBtn) {
    avatarPlayBtn.addEventListener("click", () => {
      if (!selectedAvatar) return;
      openConfirm();
    });
  }

  // Confirmation actions
  confirmYesBtn?.addEventListener("click", async () => {
    try {
      if (selectedAvatar) {
        localStorage.setItem("cyberedAvatarId", selectedAvatar.id);
        localStorage.setItem("cyberedAvatarSrc", selectedAvatar.src);
        localStorage.setItem("cyberedAvatarName", selectedAvatar.name || "");
        
        // Send avatar data to backend
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            // Get user ID from token payload
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub;
            
            await fetch(`${API_BASE}/users/${userId}/avatar`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                avatarSrc: selectedAvatar.src,
                avatarName: selectedAvatar.name,
                avatar: selectedAvatar.src
              })
            });
          } catch (err) {
            console.error('Failed to save avatar to backend:', err);
          }
        }
      }
    } catch {}
    redirectToHome();
  });

  confirmNoBtn?.addEventListener("click", () => { closeConfirm(); });

  // ESC closes confirmation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !confirmOverlay.classList.contains("hidden")) {
      e.preventDefault();
      closeConfirm();
    }
  });

  function persistAuth(data){
    try{
      if (data.token) localStorage.setItem('authToken', data.token);
      if (data.role) localStorage.setItem('authRole', data.role);
      if (data.user && data.user.email) localStorage.setItem('cyberedUserEmail', data.user.email);
      const namePref = (data.user && (data.user.username || data.user.name)) || '';
      if (namePref) localStorage.setItem('cyberedUserName', namePref);
    }catch{}
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const notify = createNotifier();

      if (!isLogin) {
        // Sign Up -> call backend, then continue with avatar selection unless admin
        try{
          const username = (regUsername?.value || '').trim();
          const email = (regEmail?.value || '').trim();
          const phone = (regPhone?.value || '').trim();
          const password = (regPassword?.value || '').trim();
          if (!username || !email || !phone || !password){ notify('Please fill out all required fields.', 'error'); return; }
          const pwRes = updatePwUI(password);
          const meetsPolicy = pwRes.len && pwRes.lower && pwRes.upper && pwRes.num && pwRes.sym;
          if (!meetsPolicy){ notify('Password must be at least 8 chars and include upper, lower, number, and symbol.', 'error'); return; }
          const data = await apiJson('/auth/register', { username, email, phone, password });
          persistAuth(data);
          if (data.role === 'admin') { notify('Welcome back, Admin!', 'success'); setTimeout(()=>{ window.location.href = HOMEPAGE_PATH; }, 600); return; }
          notify('Registration successful! Choose your avatar to continue.', 'success');
          openAvatarOverlay();
        }catch(err){
          if (err.status === 409) {
            notify('Username or email already in use. Try a different one or login.', 'error');
          } else if (err.status === 400) {
            // Show server-provided details when available (e.g., password policy message)
            notify(err.message || 'Check your details and try again.', 'error');
          } else {
            notify('Sign up failed: ' + (err.message || 'Unknown error'), 'error');
          }
        }
      } else {
        // Login
        try{
          const email = (loginEmail?.value || '').trim();
          const password = (loginPassword?.value || '').trim();
          if (!email || !password){ notify('Please enter your email and password.', 'error'); return; }
          const data = await apiJson('/auth/login', { email, password });
          persistAuth(data);
          if (data.role === 'admin') { notify('Logged in as Admin.', 'success'); setTimeout(()=>{ window.location.href = HOMEPAGE_PATH; }, 600); return; }
          notify('Login successful!', 'success');
          setTimeout(()=> redirectToHome(), 600);
        }catch(err){
          if (err.status === 400) notify('Incorrect email or password.', 'error');
          else notify('Login failed: ' + (err.message || 'Unknown error'), 'error');
        }
      }
    });
  }

 
  function redirectToHome() {
    document.body.classList.add("page-exit");
    setTimeout(() => { window.location.href = HOMEPAGE_PATH; }, 320);
  }

  const AVATARS = [
    { id: 'default', name: 'Default', src: './assets/images/avatars/default.png', el: document.getElementById('avatar-default') },
    { id: 'alex', name: 'Alex', src: './assets/images/avatars/alex.png', el: document.getElementById('avatar-alex') },
    { id: 'jordan', name: 'Jordan', src: './assets/images/avatars/jordan.png', el: document.getElementById('avatar-jordan') },
    { id: 'sam', name: 'Sam', src: './assets/images/avatars/sam.png', el: document.getElementById('avatar-sam') },
    { id: 'taylor', name: 'Taylor', src: './assets/images/avatars/taylor.png', el: document.getElementById('avatar-taylor') },
    { id: 'maya', name: 'Maya', el: document.getElementById('avatar-maya') }
  ];

  // --- Notifications ---
  function createNotifier(){
    const el = document.getElementById('notify');
    return function(msg, type='info', timeout=2200){
      if (!el) return alert(msg);
      el.textContent = msg;
      el.style.display = 'block';
      el.classList.remove('success','error','info');
      el.classList.add(type || 'info');
      // force reflow to restart animation
      void el.offsetWidth; 
      el.classList.add('show');
      clearTimeout(el._hideTimer);
      el._hideTimer = setTimeout(()=>{
        el.classList.remove('show');
        setTimeout(()=>{ el.style.display='none'; }, 200);
      }, timeout);
    }
  }

  async function apiJson(path, body){
    const res = await fetch(API_BASE + path, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(body || {})
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok){ const err = new Error(data?.error || res.statusText); err.status = res.status; throw err; }
    return data;
  }
});