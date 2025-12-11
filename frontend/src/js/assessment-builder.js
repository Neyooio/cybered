// ==================== Assessment Builder ====================

// Notification function for assessment builder
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
    border: 2px solid #000;
    border-radius: 10px;
    color: #ffffff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.95rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    animation: slideInRight 0.3s ease forwards;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function openAssessmentBuilder(moduleId) {
  const modal = createModal({
    title: moduleId ? 'Create Assessment for Module' : 'Create Assessment',
    content: `
      <div class="assessment-builder-container">
        <div class="assessment-section">
          <h3 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Assessment Information
          </h3>
          <div class="form-group">
            <label for="assessmentTitle">Assessment Title</label>
            <input type="text" id="assessmentTitle" placeholder="e.g., Cryptography Quiz" required>
          </div>
          <div class="form-group">
            <label for="assessmentDescription">Description</label>
            <textarea id="assessmentDescription" rows="3" placeholder="Brief description of the assessment..."></textarea>
          </div>
        </div>

        <div class="assessment-section">
          <h3 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            Select Game Template
          </h3>
          <div class="game-templates-grid" id="gameTemplatesGrid">
            ${createGameTemplateCards()}
          </div>
        </div>

        <div class="assessment-section">
          <div style="display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 16px;">
            <h3 class="section-title" style="margin-bottom: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Questions (Excel File)
            </h3>
            <button 
              class="download-template-btn" 
              id="downloadTemplateBtn" 
              type="button"
              style="display: flex !important; align-items: center !important; padding: 10px 18px !important; background: #6366f1 !important; border: 2px solid #6366f1 !important; border-radius: 8px !important; color: white !important; font-family: 'Press Start 2P', monospace !important; font-size: 10px !important; cursor: pointer !important; visibility: visible !important; opacity: 1 !important; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.6) !important;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 18px; height: 18px; margin-right: 6px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Template
            </button>
          </div>
          <div class="excel-upload-zone" id="excelUploadZone">
            <div class="upload-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 48px; height: 48px; margin: 0 auto 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="upload-text">Drop your Excel file here or click to browse</p>
              <p class="upload-hint">Supported formats: .xlsx, .xls, .csv</p>
              <p class="upload-hint">Required columns: question, answer, options (optional), correctIndex (optional)</p>
              <input type="file" id="excelFileInput" accept=".xlsx,.xls,.csv" style="display: none;">
            </div>
            <div class="uploaded-file-info" id="uploadedFileInfo" style="display: none;">
              <div class="file-icon">📄</div>
              <div class="file-details">
                <p class="file-name" id="uploadedFileName"></p>
                <p class="file-size" id="uploadedFileSize"></p>
                <p class="file-questions" id="uploadedFileQuestions"></p>
              </div>
              <button class="remove-file-btn" id="removeFileBtn">×</button>
            </div>
          </div>
          <div class="questions-preview" id="questionsPreview" style="display: none;">
            <h4>Questions Preview (First 3)</h4>
            <div id="questionsPreviewContent"></div>
          </div>
        </div>
      </div>
    `,
    primaryButton: {
      text: 'Create Assessment',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`,
      onClick: () => handleCreateAssessment(moduleId, modal)
    }
  });

  modal.id = 'assessmentBuilderModal';
  document.body.appendChild(modal);
  initializeAssessmentUpload(modal);
  initializeGameTemplateSelection(modal);
  
  // Add download template button handler
  const downloadBtn = modal.querySelector('#downloadTemplateBtn');
  console.log('Download Template Button Found:', downloadBtn);
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadAssessmentTemplate);
    console.log('Download button click handler attached');
  } else {
    console.error('Download Template Button NOT FOUND in modal!');
  }
}

function createGameTemplateCards() {
  const templates = [
    {
      id: 'quiz',
      name: 'Quiz',
      icon: '📝',
      description: 'Multiple choice questions with instant feedback',
      color: '#6366f1'
    },
    {
      id: 'cyber-runner',
      name: 'Cyber Runner',
      icon: '🏃',
      description: 'Answer questions while running through obstacles',
      color: '#f59e0b'
    },
    {
      id: 'intrusion-intercept',
      name: 'Intrusion Intercept',
      icon: '🛡️',
      description: 'Defend against attacks by answering correctly',
      color: '#ef4444'
    },
    {
      id: 'crypto-crack',
      name: 'Crypto Crack',
      icon: '🔐',
      description: 'Crack codes by solving cryptography questions',
      color: '#8b5cf6'
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: '🗂️',
      description: 'Study mode with flippable cards',
      color: '#10b981'
    },
    {
      id: 'matching',
      name: 'Matching Game',
      icon: '🎯',
      description: 'Match terms with their definitions',
      color: '#ec4899'
    }
  ];

  return templates.map(template => `
    <div class="game-template-card" data-template-id="${template.id}" style="border-color: ${template.color}">
      <div class="template-icon" style="background: ${template.color}20; color: ${template.color}">
        ${template.icon}
      </div>
      <h4 class="template-name">${template.name}</h4>
      <p class="template-description">${template.description}</p>
      <div class="template-selected-badge">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  `).join('');
}

function initializeGameTemplateSelection(modal) {
  const cards = modal.querySelectorAll('.game-template-card');
  
  console.log('Initializing game template selection');
  console.log('Found cards:', cards.length);
  console.log('Found modal:', modal);
  
  let selectedTemplate = null;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      console.log('Card clicked:', card.dataset.templateId);
      
      // Remove selection from all cards
      cards.forEach(c => c.classList.remove('selected'));
      
      // Select this card
      card.classList.add('selected');
      selectedTemplate = card.dataset.templateId;
      
      // Store selection in the modal
      if (modal) {
        modal.dataset.selectedTemplate = selectedTemplate;
        console.log('Template selected:', selectedTemplate);
        console.log('Stored in modal dataset:', modal.dataset.selectedTemplate);
      } else {
        console.error('Modal not found when selecting template');
      }
    });
  });
}

function initializeAssessmentUpload(modal) {
  const uploadZone = modal.querySelector('#excelUploadZone');
  const fileInput = modal.querySelector('#excelFileInput');
  const uploadedFileInfo = modal.querySelector('#uploadedFileInfo');
  const removeFileBtn = modal.querySelector('#removeFileBtn');
  let uploadedQuestions = [];

  // Click to upload
  uploadZone.addEventListener('click', (e) => {
    if (!e.target.closest('.remove-file-btn')) {
      fileInput.click();
    }
  });

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  });

  // Remove file
  removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetFileUpload();
  });

  function handleFileUpload(file) {
    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      showNotification('Please upload an Excel (.xlsx, .xls) or CSV file', 'error');
      return;
    }

    // Show loading
    uploadZone.querySelector('.upload-placeholder').innerHTML = `
      <div class="loading-spinner"></div>
      <p class="upload-text">Processing file...</p>
    `;

    // Parse file based on extension
    if (fileExtension === '.csv') {
      parseCSVFile(file);
    } else {
      parseExcelFile(file);
    }
  }

  function parseCSVFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }

        // Parse header
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const questionIndex = headers.indexOf('question');
        const answerIndex = headers.indexOf('answer');
        const optionsIndex = headers.indexOf('options');
        const correctIndexIndex = headers.indexOf('correctindex');

        if (questionIndex === -1 || answerIndex === -1) {
          throw new Error('CSV must have "question" and "answer" columns');
        }

        // Parse data rows
        uploadedQuestions = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          
          const question = {
            question: values[questionIndex]?.trim() || '',
            answer: values[answerIndex]?.trim() || ''
          };

          // Parse options if available
          if (optionsIndex !== -1 && values[optionsIndex]) {
            question.options = values[optionsIndex].split('|').map(opt => opt.trim());
          }

          // Parse correct index if available
          if (correctIndexIndex !== -1 && values[correctIndexIndex]) {
            question.correctIndex = parseInt(values[correctIndexIndex]);
          }

          if (question.question && question.answer) {
            uploadedQuestions.push(question);
          }
        }

        if (uploadedQuestions.length === 0) {
          throw new Error('No valid questions found in CSV file');
        }

        displayUploadedFile(file, uploadedQuestions);
        showNotification(`Successfully loaded ${uploadedQuestions.length} questions`, 'success');
        
      } catch (error) {
        showNotification(`Error parsing CSV: ${error.message}`, 'error');
        resetFileUpload();
      }
    };

    reader.onerror = () => {
      showNotification('Error reading file', 'error');
      resetFileUpload();
    };

    reader.readAsText(file);
  }

  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  function parseExcelFile(file) {
    // For Excel files, we'll need to use a library like SheetJS (xlsx)
    // For now, show a message to use CSV or implement SheetJS integration
    showNotification('Excel support coming soon! Please use CSV format for now.', 'error');
    
    // Reset to show upload zone again
    setTimeout(() => {
      resetFileUpload();
    }, 2000);
    
    // TODO: Implement SheetJS integration
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const data = new Uint8Array(e.target.result);
    //   const workbook = XLSX.read(data, { type: 'array' });
    //   // Process workbook...
    // };
    // reader.readAsArrayBuffer(file);
  }

  function displayUploadedFile(file, questions) {
    const placeholder = uploadZone.querySelector('.upload-placeholder');
    placeholder.style.display = 'none';
    
    uploadedFileInfo.style.display = 'flex';
    uploadedFileInfo.querySelector('#uploadedFileName').textContent = file.name;
    uploadedFileInfo.querySelector('#uploadedFileSize').textContent = formatFileSize(file.size);
    uploadedFileInfo.querySelector('#uploadedFileQuestions').textContent = `${questions.length} questions loaded`;

    // Store questions in modal data
    const modal = uploadZone.closest('.modal-overlay');
    console.log('Storing questions in modal:', modal);
    console.log('Questions to store:', questions.length);
    if (modal) {
      modal.dataset.uploadedQuestions = JSON.stringify(questions);
      console.log('Questions stored in modal.dataset.uploadedQuestions');
      console.log('Verification - stored value:', modal.dataset.uploadedQuestions);
    } else {
      console.error('Modal not found when storing questions!');
    }

    // Show preview of first 3 questions
    displayQuestionsPreview(questions);
  }

  function displayQuestionsPreview(questions) {
    const preview = uploadZone.parentElement.querySelector('#questionsPreview');
    const content = uploadZone.parentElement.querySelector('#questionsPreviewContent');
    
    const previewQuestions = questions.slice(0, 3);
    content.innerHTML = previewQuestions.map((q, index) => `
      <div class="question-preview-item">
        <p class="preview-question"><strong>Q${index + 1}:</strong> ${q.question}</p>
        <p class="preview-answer"><strong>A:</strong> ${q.answer}</p>
        ${q.options ? `<p class="preview-options"><strong>Options:</strong> ${q.options.join(', ')}</p>` : ''}
      </div>
    `).join('');
    
    preview.style.display = 'block';
  }

  function resetFileUpload() {
    uploadedFileInfo.style.display = 'none';
    document.getElementById('questionsPreview').style.display = 'none';
    
    const placeholder = uploadZone.querySelector('.upload-placeholder');
    placeholder.style.display = 'block';
    placeholder.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 48px; height: 48px; margin: 0 auto 16px;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="upload-text">Drop your Excel file here or click to browse</p>
      <p class="upload-hint">Supported formats: .xlsx, .xls, .csv</p>
      <p class="upload-hint">Required columns: question, answer, options (optional), correctIndex (optional)</p>
      <input type="file" id="excelFileInput" accept=".xlsx,.xls,.csv" style="display: none;">
    `;
    
    fileInput.value = '';
    uploadedQuestions = [];
    
    const modal = uploadZone.closest('.modal-overlay');
    if (modal) {
      delete modal.dataset.uploadedQuestions;
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

async function handleCreateAssessment(moduleId, modal) {
  try {
    if (!modal) {
      modal = document.getElementById('assessmentBuilderModal');
    }
    const title = document.getElementById('assessmentTitle').value.trim();
    const description = document.getElementById('assessmentDescription').value.trim();
    const selectedTemplate = modal.dataset.selectedTemplate;
    const questionsData = modal.dataset.uploadedQuestions;

    console.log('Creating assessment...');
    console.log('Modal dataset:', modal.dataset);
    console.log('Selected template:', selectedTemplate);
    console.log('Questions data:', questionsData);

    // Validation
    if (!title) {
      showNotification('Please enter an assessment title', 'error');
      return false;
    }

    if (!selectedTemplate) {
      console.error('No template selected. Modal dataset:', modal.dataset);
      showNotification('Please select a game template', 'error');
      return false;
    }

    if (!questionsData) {
      showNotification('Please upload a questions file', 'error');
      return false;
    }

    const questions = JSON.parse(questionsData);

    // Prepare assessment data
    const assessmentData = {
      title,
      description,
      gameTemplate: selectedTemplate,
      questions,
      createdAt: new Date().toISOString()
    };

    // If moduleId provided, save to that module
    if (moduleId) {
      const token = localStorage.getItem('authToken');
      const spaceId = getCurrentSpaceId();

      console.log('Token:', token ? 'exists' : 'missing');
      console.log('Space ID:', spaceId);
      console.log('Module ID:', moduleId);

      if (!spaceId) {
        showNotification('No active space selected', 'error');
        return false;
      }

      if (!token) {
        showNotification('Authentication required. Please log in again.', 'error');
        return false;
      }

      const response = await fetch(`http://localhost:4000/api/faculty-modules/${spaceId}/modules/${moduleId}/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.message || `Failed to save assessment (${response.status})`);
      }

      showNotification('Assessment created successfully!', 'success');
      closeModal(modal);
      
      // Reload the space data to show the new assessment
      if (window.reloadCurrentSpace) {
        await window.reloadCurrentSpace();
      }
      
    } else {
      // Just creating standalone assessment - could be saved to localStorage or different endpoint
      showNotification('Assessment created! (Standalone mode)', 'success');
      console.log('Assessment data:', assessmentData);
    }

    return true;

  } catch (error) {
    console.error('Error creating assessment:', error);
    showNotification('Error creating assessment: ' + error.message, 'error');
    return false;
  }
}

function getCurrentSpaceId() {
  // Get current space from faculty-space.js
  if (window.getCurrentSpace) {
    const space = window.getCurrentSpace();
    return space ? (space._id || space.id) : null;
  }
  
  // Fallback: try to get from DOM
  const activeSpace = document.querySelector('.space-card.active');
  return activeSpace ? activeSpace.dataset.spaceId : null;
}

function downloadAssessmentTemplate() {
  // Create sample CSV content with example questions
  const csvContent = `question,answer,options,correctIndex
"What is the full form of HTTP?","HyperText Transfer Protocol","HyperText Transfer Protocol|HyperText Transmission Protocol|High Transfer Text Protocol|Home Tool Transfer Protocol",0
"Which port does HTTPS use by default?","443","80|443|8080|3000",1
"What does SSL stand for?","Secure Sockets Layer","Secure Server Layer|Secure Sockets Layer|Secure System Link|Secure Software Layer",1
"What is a firewall used for?","To monitor and control network traffic","To speed up internet|To monitor and control network traffic|To store passwords|To encrypt files",1
"Which of the following is a strong password?","P@ssw0rd#2024!","password123|123456|P@ssw0rd#2024!|admin",2
"What does VPN stand for?","Virtual Private Network"
"What is phishing?","A social engineering attack to steal sensitive information"
"What is the purpose of encryption?","To convert data into a coded format to prevent unauthorized access"
"What is two-factor authentication?","A security process requiring two different authentication methods"
"What is malware?","Malicious software designed to harm or exploit systems"`;

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a temporary download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'assessment-template.csv');
  link.style.visibility = 'hidden';
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
  
  showToast('Template downloaded! Edit the file and upload it back.', 'success');
}
