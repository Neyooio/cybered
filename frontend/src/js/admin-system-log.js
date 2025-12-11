import { API_BASE_URL } from './config.js';

// State
let logs = [];
let filteredLogs = [];
let charts = {};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
  loadSystemData();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  document.getElementById('refreshBtn').addEventListener('click', loadSystemData);
  document.getElementById('typeFilter').addEventListener('change', filterLogs);
  document.getElementById('featureFilter').addEventListener('change', filterLogs);
  document.getElementById('searchInput').addEventListener('input', filterLogs);
}

// Load all system data
async function loadSystemData() {
  showLoading();
  try {
    await Promise.all([
      loadStats(),
      loadLogs(),
      loadPerformanceData()
    ]);
    showToast('Data refreshed successfully', 'success');
  } catch (error) {
    console.error('Error loading system data:', error);
    showToast('Failed to load system data', 'error');
  } finally {
    hideLoading();
  }
}

// Load statistics
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      // Use mock data if API not available
      updateStatsUI(getMockStats());
      return;
    }
    
    const data = await response.json();
    updateStatsUI(data);
  } catch (error) {
    console.error('Error loading stats:', error);
    updateStatsUI(getMockStats());
  }
}

// Update stats UI
function updateStatsUI(stats) {
  document.getElementById('totalErrors').textContent = stats.totalErrors || 0;
  document.getElementById('totalWarnings').textContent = stats.totalWarnings || 0;
  document.getElementById('avgResponseTime').textContent = `${stats.avgResponseTime || 0}ms`;
  document.getElementById('uptime').textContent = `${stats.uptime || 99.9}%`;
  
  // Update trends
  updateTrend('errorTrend', stats.errorTrend || 0);
  updateTrend('warningTrend', stats.warningTrend || 0);
  updateTrend('responseTrend', stats.responseTrend || 0);
}

// Update trend display
function updateTrend(elementId, value) {
  const element = document.getElementById(elementId);
  const isPositive = value >= 0;
  const icon = element.querySelector('i');
  const text = element.querySelector('span');
  
  if (elementId === 'responseTrend') {
    // Lower is better for response time
    element.className = `stat-trend ${value <= 0 ? 'positive' : 'negative'}`;
    icon.className = `fas fa-arrow-${value <= 0 ? 'down' : 'up'}`;
    text.textContent = `${Math.abs(value)}% ${value <= 0 ? 'faster' : 'slower'}`;
  } else {
    element.className = `stat-trend ${isPositive ? 'positive' : 'negative'}`;
    icon.className = `fas fa-arrow-${isPositive ? 'up' : 'down'}`;
    text.textContent = `${Math.abs(value)}% from last hour`;
  }
}

// Load logs
async function loadLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system/logs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      // Use mock data if API not available
      logs = getMockLogs();
      filteredLogs = [...logs];
      renderLogs();
      return;
    }
    
    const data = await response.json();
    logs = data.logs || [];
    filteredLogs = [...logs];
    renderLogs();
  } catch (error) {
    console.error('Error loading logs:', error);
    logs = getMockLogs();
    filteredLogs = [...logs];
    renderLogs();
  }
}

// Filter logs
function filterLogs() {
  const typeFilter = document.getElementById('typeFilter').value;
  const featureFilter = document.getElementById('featureFilter').value;
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
  filteredLogs = logs.filter(log => {
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesFeature = featureFilter === 'all' || log.feature === featureFilter;
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery) ||
      log.feature.toLowerCase().includes(searchQuery);
    
    return matchesType && matchesFeature && matchesSearch;
  });
  
  renderLogs();
}

// Render logs
function renderLogs() {
  const container = document.getElementById('logsContainer');
  
  if (filteredLogs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No logs found</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredLogs.map(log => `
    <div class="log-entry ${log.type}">
      <div class="log-header">
        <div>
          <span class="log-type ${log.type}">
            <i class="fas fa-${getLogIcon(log.type)}"></i>
            ${log.type}
          </span>
          <span class="log-feature">${log.feature}</span>
        </div>
        <span class="log-timestamp">${formatTimestamp(log.timestamp)}</span>
      </div>
      <p class="log-message">${log.message}</p>
      ${log.stack ? `<div class="log-stack">${log.stack}</div>` : ''}
    </div>
  `).join('');
}

// Get log icon
function getLogIcon(type) {
  const icons = {
    error: 'times-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle',
    success: 'check-circle'
  };
  return icons[type] || 'circle';
}

// Format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleString();
}

// Initialize charts
function initializeCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
          font: {
            family: "'Share Tech Mono', monospace"
          }
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148,163,184,0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148,163,184,0.1)' }
      }
    }
  };
  
  // Response Time Chart
  charts.responseTime = new Chart(document.getElementById('responseTimeChart'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Response Time (ms)',
        data: [],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: chartOptions
  });
  
  // Error Distribution Chart
  charts.errorDistribution = new Chart(document.getElementById('errorDistributionChart'), {
    type: 'doughnut',
    data: {
      labels: ['Errors', 'Warnings', 'Info', 'Success'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(239,68,68,0.8)',
          'rgba(234,179,8,0.8)',
          'rgba(59,130,246,0.8)',
          'rgba(34,197,94,0.8)'
        ],
        borderColor: [
          '#ef4444',
          '#eab308',
          '#3b82f6',
          '#22c55e'
        ],
        borderWidth: 2
      }]
    },
    options: {
      ...chartOptions,
      scales: undefined
    }
  });
  
  // Memory Chart
  charts.memory = new Chart(document.getElementById('memoryChart'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Memory Usage (%)',
        data: [],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: chartOptions
  });
  
  // CPU Chart
  charts.cpu = new Chart(document.getElementById('cpuChart'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'CPU Usage (%)',
        data: [],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: chartOptions
  });
}

// Load performance data
async function loadPerformanceData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system/performance`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      // Use mock data if API not available
      updateCharts(getMockPerformanceData());
      return;
    }
    
    const data = await response.json();
    updateCharts(data);
  } catch (error) {
    console.error('Error loading performance data:', error);
    updateCharts(getMockPerformanceData());
  }
}

// Update charts
function updateCharts(data) {
  // Response Time
  charts.responseTime.data.labels = data.timeLabels;
  charts.responseTime.data.datasets[0].data = data.responseTime;
  charts.responseTime.update();
  
  // Error Distribution
  charts.errorDistribution.data.datasets[0].data = data.errorDistribution;
  charts.errorDistribution.update();
  
  // Memory Usage
  charts.memory.data.labels = data.timeLabels;
  charts.memory.data.datasets[0].data = data.memoryUsage;
  charts.memory.update();
  
  // CPU Usage
  charts.cpu.data.labels = data.timeLabels;
  charts.cpu.data.datasets[0].data = data.cpuUsage;
  charts.cpu.update();
}

// Mock data generators
function getMockStats() {
  return {
    totalErrors: 23,
    totalWarnings: 47,
    avgResponseTime: 127,
    uptime: 99.8,
    errorTrend: -12,
    warningTrend: 5,
    responseTrend: -8
  };
}

function getMockLogs() {
  const features = ['auth', 'quiz', 'challenges', 'leaderboard', 'modules', 'chatbot', 'database', 'api'];
  const types = ['error', 'warning', 'info', 'success'];
  const messages = [
    'Database connection timeout',
    'User authentication successful',
    'Quiz data loaded successfully',
    'Failed to fetch leaderboard data',
    'Module content updated',
    'Challenge submission processed',
    'Chatbot response generated',
    'API rate limit warning',
    'Memory usage above threshold',
    'Cache cleared successfully',
    'Invalid token provided',
    'WebSocket connection established',
    'File upload completed',
    'Session expired',
    'New user registered'
  ];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    feature: features[Math.floor(Math.random() * features.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    stack: Math.random() > 0.7 ? 'Error: Connection timeout\n    at Database.connect (/app/db.js:45:12)\n    at Server.start (/app/server.js:89:5)' : null
  }));
}

function getMockPerformanceData() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  return {
    timeLabels: hours,
    responseTime: hours.map(() => Math.floor(Math.random() * 200 + 50)),
    errorDistribution: [23, 47, 156, 324],
    memoryUsage: hours.map(() => Math.floor(Math.random() * 30 + 40)),
    cpuUsage: hours.map(() => Math.floor(Math.random() * 40 + 20))
  };
}

// UI helpers
function showLoading() {
  document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('active');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = toast.querySelector('i');
  const messageEl = toast.querySelector('.toast-message');
  
  icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  messageEl.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
