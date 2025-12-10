function getApiBase() {
  // Use global config if available
  if (window.API_BASE_URL) return window.API_BASE_URL;
  
  const hostname = window.location.hostname;
  
  // Production environments
  if (hostname.includes('netlify.app') || hostname.includes('github.io') || hostname.includes('onrender.com')) {
    return 'https://cybered-backend.onrender.com';
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Network access (LAN)
  return `${window.location.protocol}//${hostname}:4000`;
}

const API_BASE_URL = getApiBase();

class StudentSpaceJoiner {
  constructor() {
    this.modalOverlay = null;
    this.init();
  }

  init() {
    this.injectModal();
    this.attachEventListeners();
  }

  injectModal() {
    const modalHTML = `
      <div class="faculty-modal-overlay" id="studentJoinModal">
        <div class="faculty-modal">
          <div class="faculty-modal-header">
            <h2 class="faculty-modal-title">Join Space</h2>
            <button class="faculty-modal-close" id="closeJoinModal">&times;</button>
          </div>
          
          <div id="joinModalContent">
            <form id="studentJoinForm">
              <div class="faculty-form-group">
                <label class="faculty-form-label" for="spaceCode">Space Code</label>
                <input 
                  type="text" 
                  id="spaceCode" 
                  class="faculty-form-input space-code-input" 
                  placeholder="ABCDEF"
                  required
                  maxlength="6"
                  style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 1.5rem; text-align: center; font-weight: 600;"
                />
                <p class="faculty-form-helper">Ask your instructor for the space code</p>
              </div>

              <div id="joinErrorMessage"></div>

              <div class="faculty-form-actions">
                <button type="button" class="faculty-btn faculty-btn-secondary" id="cancelJoin">Cancel</button>
                <button type="submit" class="faculty-btn faculty-btn-primary" id="submitJoin">Join Space</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  attachEventListeners() {
    const modal = document.getElementById('studentJoinModal');
    const closeBtn = document.getElementById('closeJoinModal');
    const cancelBtn = document.getElementById('cancelJoin');
    const form = document.getElementById('studentJoinForm');
    const spaceCodeInput = document.getElementById('spaceCode');

    // Auto-uppercase input
    spaceCodeInput?.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });

    closeBtn?.addEventListener('click', () => this.closeModal());
    cancelBtn?.addEventListener('click', () => this.closeModal());
    
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  openModal() {
    const modal = document.getElementById('studentJoinModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Focus on input after modal opens
      setTimeout(() => {
        document.getElementById('spaceCode')?.focus();
      }, 100);
    }
  }

  closeModal() {
    const modal = document.getElementById('studentJoinModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.resetForm();
    }
  }

  resetForm() {
    const form = document.getElementById('studentJoinForm');
    form?.reset();
    
    const errorDiv = document.getElementById('joinErrorMessage');
    if (errorDiv) errorDiv.innerHTML = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitJoin');
    const errorDiv = document.getElementById('joinErrorMessage');
    
    const spaceCode = document.getElementById('spaceCode').value.trim().toUpperCase();
    
    if (!spaceCode || spaceCode.length !== 6) {
      this.showError('Please enter a valid 6-character space code');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';
    errorDiv.innerHTML = '';

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('You must be logged in to join a space');
      }

      const response = await fetch(`${API_BASE_URL}/api/faculty-modules/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          spaceCode: spaceCode
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to join space');
      }

      // Close modal and reload to show new space tab
      this.closeModal();
      
      // Show success message and reload page
      alert(`Successfully joined "${data.space.name}"!`);
      window.location.reload();
    } catch (error) {
      console.error('Join space error:', error);
      this.showError(error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join Space';
    }
  }

  showError(message) {
    const errorDiv = document.getElementById('joinErrorMessage');
    if (errorDiv) {
      errorDiv.innerHTML = `
        <div class="faculty-error-message">
          ${message}
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.studentSpaceJoiner = new StudentSpaceJoiner();
  });
} else {
  window.studentSpaceJoiner = new StudentSpaceJoiner();
}

export default StudentSpaceJoiner;
