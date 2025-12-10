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

class FacultySpaceCreator {
  constructor() {
    this.modalOverlay = null;
    this.selectedColor = '#1d4ed8';
    this.init();
  }

  init() {
    this.injectModal();
    this.attachEventListeners();
  }

  injectModal() {
    const modalHTML = `
      <div class="faculty-modal-overlay" id="facultyModuleModal">
        <div class="faculty-modal">
          <div class="faculty-modal-header">
            <h2 class="faculty-modal-title">Create Space</h2>
            <button class="faculty-modal-close" id="closeFacultyModal">&times;</button>
          </div>
          
          <div id="facultyModalContent">
            <form id="facultyModuleForm">
              <div class="faculty-form-group">
                <label class="faculty-form-label" for="moduleTitle">Space Name</label>
                <input 
                  type="text" 
                  id="moduleTitle" 
                  class="faculty-form-input" 
                  placeholder="e.g., CyberSec 101 - Fall 2025"
                  required
                  maxlength="60"
                />
              </div>

              <div class="faculty-form-group">
                <label class="faculty-form-label" for="moduleDescription">Space Description</label>
                <textarea 
                  id="moduleDescription" 
                  class="faculty-form-textarea" 
                  placeholder="Brief description of this learning space..."
                  required
                  maxlength="300"
                ></textarea>
              </div>

              <div class="faculty-form-group">
                <label class="faculty-form-label">Space Color Theme</label>
                <div class="faculty-color-picker-group">
                  <label class="faculty-color-option selected" style="background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);">
                    <input type="radio" name="moduleColor" value="#1d4ed8" checked>
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);">
                    <input type="radio" name="moduleColor" value="#7c3aed">
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">
                    <input type="radio" name="moduleColor" value="#059669">
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
                    <input type="radio" name="moduleColor" value="#dc2626">
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                    <input type="radio" name="moduleColor" value="#f59e0b">
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);">
                    <input type="radio" name="moduleColor" value="#ec4899">
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);">
                    <input type="radio" name="moduleColor" value="#06b6d4">
                  </label>
                  <label class="faculty-color-option" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
                    <input type="radio" name="moduleColor" value="#64748b">
                  </label>
                </div>
              </div>

              <div id="facultyErrorMessage"></div>

              <div class="faculty-form-actions">
                <button type="button" class="faculty-btn faculty-btn-secondary" id="cancelFacultyModule">Cancel</button>
                <button type="submit" class="faculty-btn faculty-btn-primary" id="submitFacultyModule">Create Space</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  attachEventListeners() {
    const modal = document.getElementById('facultyModuleModal');
    const closeBtn = document.getElementById('closeFacultyModal');
    const cancelBtn = document.getElementById('cancelFacultyModule');
    const form = document.getElementById('facultyModuleForm');

    // Color selection
    const colorOptions = document.querySelectorAll('.faculty-color-option');
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedColor = option.querySelector('input').value;
      });
    });

    closeBtn?.addEventListener('click', () => this.closeModal());
    cancelBtn?.addEventListener('click', () => this.closeModal());
    
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  openModal() {
    const modal = document.getElementById('facultyModuleModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('facultyModuleModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.resetForm();
    }
  }

  resetForm() {
    const form = document.getElementById('facultyModuleForm');
    form?.reset();
    
    const colorOptions = document.querySelectorAll('.faculty-color-option');
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    colorOptions[0]?.classList.add('selected');
    
    this.selectedColor = '#1d4ed8';
    
    const errorDiv = document.getElementById('facultyErrorMessage');
    if (errorDiv) errorDiv.innerHTML = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitFacultyModule');
    const errorDiv = document.getElementById('facultyErrorMessage');
    
    const title = document.getElementById('moduleTitle').value.trim();
    const description = document.getElementById('moduleDescription').value.trim();
    
    if (!title || !description) {
      this.showError('Please fill in all fields');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    errorDiv.innerHTML = '';

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('You must be logged in to create a space');
      }

      const response = await fetch(`${API_BASE_URL}/api/faculty-modules/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: title,
          description,
          primaryColor: this.selectedColor
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create space');
      }

      // Close modal and redirect to space immediately
      this.closeModal();
      
      // Redirect to the newly created space
      window.location.href = `faculty-space.html?id=${data.space._id || data.space.id}`;
    } catch (error) {
      console.error('Create space error:', error);
      this.showError(error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Space';
    }
  }

  showError(message) {
    const errorDiv = document.getElementById('facultyErrorMessage');
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
    window.facultyModuleCreator = new FacultySpaceCreator();
  });
} else {
  window.facultyModuleCreator = new FacultySpaceCreator();
}

export default FacultySpaceCreator;
