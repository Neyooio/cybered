const modulesIndex = [
  {
    id: 'web-security',
    title: 'Web Security',
    icon: '../../assets/images/Web Security.png',
    description: 'Web security is the practice of protecting websites, web applications, and web services from malicious attacks. The primary goal is to ensure the confidentiality, integrity, and availability of data and systems.'
  },
  {
    id: 'network-defense',
    title: 'Network Defense',
    icon: '../../assets/images/Network Defense.png',
    description: 'This lesson will introduce the core concepts that form the basis of all network communication and defense. Understanding these fundamentals is crucial before learning how to secure a network.'
  },
  {
    id: 'cryptography',
    title: 'Cryptography',
    icon: '../../assets/images/Cryptography.png',
    description: 'Cryptography, at its core, is the practice and study of techniques for secure communication in the presence of adversarial behavior. It\'s about constructing and analyzing protocols that prevent third parties or the public from reading private messages.'
  },
  {
    id: 'malware-defense',
    title: 'Malware Defense',
    icon: '../../assets/images/Malware Defense.png',
    description: 'Malware types, infection methods, detection techniques, and preventive measures.'
  }
];

function renderModules(grid) {
  const markup = modulesIndex.map(module => `
    <article class="module-card" data-module="${module.id}">
      <div class="module-card-header">
        <div class="module-icon">
          <img src="${module.icon}" alt="${module.title}">
        </div>
        <h2 class="module-title">${module.title}</h2>
      </div>
      <p class="module-description">${module.description}</p>
      <div class="module-actions">
        <button type="button" class="module-start" data-module="${module.id}">Start Module</button>
      </div>
    </article>
  `).join('');

  grid.innerHTML = markup;
}

function getModuleById(id){
  return modulesIndex.find(m => m.id === id);
}

function startModule(id) {
  const pages = {
    'web-security': 'module-web-security.html',
    'network-defense': 'module-network-defense.html',
    'cryptography': 'module-cryptography.html',
    'malware-defense': 'module-malware-defense.html'
  };

  const page = pages[id];
  if (!page) {
    console.warn('Unknown module:', id);
    return;
  }

  const mod = getModuleById(id);
  if (mod){
    try {
      localStorage.setItem('currentModule', JSON.stringify({
        id: mod.id,
        title: mod.title,
        icon: mod.icon,
        description: mod.description
      }));
    } catch (err){
      console.debug('Unable to cache module selection', err);
    }
  }

  window.location.href = page;
}

const modulesGrid = document.getElementById('modulesGrid');
if (modulesGrid){
  renderModules(modulesGrid);

  modulesGrid.addEventListener('click', event => {
    const button = event.target.closest('.module-start');
    if (!button) return;

    const moduleId = button.dataset.module;
    if (moduleId) startModule(moduleId);
  });
}

// Search functionality
const searchInput = document.getElementById('moduleSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
      // Show all modules if search is empty
      renderModules(modulesGrid);
      return;
    }
    
    // Filter modules based on search term
    const filteredModules = modulesIndex.filter(module => {
      return module.title.toLowerCase().includes(searchTerm) ||
             module.description.toLowerCase().includes(searchTerm);
    });
    
    // Render filtered results
    if (filteredModules.length === 0) {
      modulesGrid.innerHTML = `
        <div class="no-results-message">
          <p>No modules found matching "${searchTerm}"</p>
          <p>Try a different search term</p>
        </div>
      `;
    } else {
      const markup = filteredModules.map(module => `
        <article class="module-card" data-module="${module.id}">
          <div class="module-card-header">
            <div class="module-icon">
              <img src="${module.icon}" alt="${module.title}">
            </div>
            <h2 class="module-title">${module.title}</h2>
          </div>
          <p class="module-description">${module.description}</p>
          <div class="module-actions">
            <button type="button" class="module-start" data-module="${module.id}">Start Module</button>
          </div>
        </article>
      `).join('');
      
      modulesGrid.innerHTML = markup;
    }
  });
}