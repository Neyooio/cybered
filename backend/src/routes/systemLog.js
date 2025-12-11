import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for logs (in production, use a proper logging service or database)
let systemLogs = [];
let performanceMetrics = {
  responseTime: [],
  memoryUsage: [],
  cpuUsage: [],
  errorDistribution: { error: 0, warning: 0, info: 0, success: 0 }
};

// Initialize with some sample data
function initializeSampleData() {
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
  
  // Generate sample logs
  systemLogs = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    feature: features[Math.floor(Math.random() * features.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    stack: Math.random() > 0.8 ? 'Error: Connection timeout\n    at Database.connect (/app/db.js:45:12)\n    at Server.start (/app/server.js:89:5)' : null
  }));
  
  // Generate sample performance metrics
  const hours = Array.from({ length: 24 }, (_, i) => i);
  performanceMetrics.responseTime = hours.map(() => Math.floor(Math.random() * 200 + 50));
  performanceMetrics.memoryUsage = hours.map(() => Math.floor(Math.random() * 30 + 40));
  performanceMetrics.cpuUsage = hours.map(() => Math.floor(Math.random() * 40 + 20));
  
  // Count error distribution
  performanceMetrics.errorDistribution = systemLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, { error: 0, warning: 0, info: 0, success: 0 });
}

// Initialize sample data
initializeSampleData();

// Helper function to add a log entry
export function addSystemLog(type, feature, message, stack = null) {
  const log = {
    id: systemLogs.length + 1,
    type,
    feature,
    message,
    timestamp: new Date().toISOString(),
    stack
  };
  
  systemLogs.unshift(log); // Add to beginning
  
  // Keep only last 1000 logs
  if (systemLogs.length > 1000) {
    systemLogs = systemLogs.slice(0, 1000);
  }
  
  // Update error distribution
  performanceMetrics.errorDistribution[type] = (performanceMetrics.errorDistribution[type] || 0) + 1;
  
  return log;
}

// GET /api/system/stats - Get system statistics
router.get('/stats', requireAuth, requireAdmin, (req, res) => {
  try {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    // Calculate stats
    const recentLogs = systemLogs.filter(log => new Date(log.timestamp).getTime() > oneHourAgo);
    const previousHourLogs = systemLogs.filter(log => {
      const time = new Date(log.timestamp).getTime();
      return time <= oneHourAgo && time > oneHourAgo - 3600000;
    });
    
    const totalErrors = systemLogs.filter(log => log.type === 'error').length;
    const totalWarnings = systemLogs.filter(log => log.type === 'warning').length;
    
    const recentErrors = recentLogs.filter(log => log.type === 'error').length;
    const previousErrors = previousHourLogs.filter(log => log.type === 'error').length;
    
    const recentWarnings = recentLogs.filter(log => log.type === 'warning').length;
    const previousWarnings = previousHourLogs.filter(log => log.type === 'warning').length;
    
    // Calculate trends
    const errorTrend = previousErrors > 0 ? Math.round(((recentErrors - previousErrors) / previousErrors) * 100) : 0;
    const warningTrend = previousWarnings > 0 ? Math.round(((recentWarnings - previousWarnings) / previousWarnings) * 100) : 0;
    
    // Calculate average response time
    const avgResponseTime = performanceMetrics.responseTime.length > 0
      ? Math.round(performanceMetrics.responseTime.reduce((a, b) => a + b, 0) / performanceMetrics.responseTime.length)
      : 0;
    
    const previousAvgResponseTime = avgResponseTime + Math.floor(Math.random() * 20 - 10);
    const responseTrend = previousAvgResponseTime > 0 
      ? Math.round(((avgResponseTime - previousAvgResponseTime) / previousAvgResponseTime) * 100)
      : 0;
    
    res.json({
      totalErrors,
      totalWarnings,
      avgResponseTime,
      uptime: 99.8,
      errorTrend,
      warningTrend,
      responseTrend
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ message: 'Failed to fetch system stats' });
  }
});

// GET /api/system/logs - Get system logs
router.get('/logs', requireAuth, requireAdmin, (req, res) => {
  try {
    const { type, feature, limit = 100, offset = 0 } = req.query;
    
    let filteredLogs = [...systemLogs];
    
    // Apply filters
    if (type && type !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.type === type);
    }
    
    if (feature && feature !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.feature === feature);
    }
    
    // Apply pagination
    const total = filteredLogs.length;
    const logs = filteredLogs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      logs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// GET /api/system/performance - Get performance metrics
router.get('/performance', requireAuth, requireAdmin, (req, res) => {
  try {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    
    res.json({
      timeLabels: hours,
      responseTime: performanceMetrics.responseTime,
      errorDistribution: [
        performanceMetrics.errorDistribution.error || 0,
        performanceMetrics.errorDistribution.warning || 0,
        performanceMetrics.errorDistribution.info || 0,
        performanceMetrics.errorDistribution.success || 0
      ],
      memoryUsage: performanceMetrics.memoryUsage,
      cpuUsage: performanceMetrics.cpuUsage
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
});

// POST /api/system/logs - Add a new log entry (for internal use)
router.post('/logs', requireAuth, requireAdmin, (req, res) => {
  try {
    const { type, feature, message, stack } = req.body;
    
    if (!type || !feature || !message) {
      return res.status(400).json({ message: 'Type, feature, and message are required' });
    }
    
    const log = addSystemLog(type, feature, message, stack);
    
    res.status(201).json({ log });
  } catch (error) {
    console.error('Error adding log:', error);
    res.status(500).json({ message: 'Failed to add log' });
  }
});

// DELETE /api/system/logs - Clear all logs
router.delete('/logs', requireAuth, requireAdmin, (req, res) => {
  try {
    systemLogs = [];
    performanceMetrics.errorDistribution = { error: 0, warning: 0, info: 0, success: 0 };
    
    res.json({ message: 'All logs cleared successfully' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ message: 'Failed to clear logs' });
  }
});

// POST /api/system/metrics - Update performance metrics (for internal monitoring)
router.post('/metrics', (req, res) => {
  try {
    const { responseTime, memoryUsage, cpuUsage } = req.body;
    
    if (responseTime !== undefined) {
      performanceMetrics.responseTime.push(responseTime);
      if (performanceMetrics.responseTime.length > 24) {
        performanceMetrics.responseTime.shift();
      }
    }
    
    if (memoryUsage !== undefined) {
      performanceMetrics.memoryUsage.push(memoryUsage);
      if (performanceMetrics.memoryUsage.length > 24) {
        performanceMetrics.memoryUsage.shift();
      }
    }
    
    if (cpuUsage !== undefined) {
      performanceMetrics.cpuUsage.push(cpuUsage);
      if (performanceMetrics.cpuUsage.length > 24) {
        performanceMetrics.cpuUsage.shift();
      }
    }
    
    res.json({ message: 'Metrics updated successfully' });
  } catch (error) {
    console.error('Error updating metrics:', error);
    res.status(500).json({ message: 'Failed to update metrics' });
  }
});

export default router;
