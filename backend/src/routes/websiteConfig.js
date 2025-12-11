import express from 'express';
import WebsiteConfig from '../models/WebsiteConfig.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get current website configuration (PUBLIC - all users need this)
router.get('/config', async (req, res) => {
  try {
    const config = await WebsiteConfig.getConfig();
    res.json({
      success: true,
      config: {
        modules: config.modules,
        challenges: config.challenges,
        lastUpdated: config.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update website configuration (ADMIN ONLY)
router.put('/config', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { modules, challenges } = req.body;
    
    const config = await WebsiteConfig.getConfig();
    
    if (modules) {
      config.modules = modules;
    }
    
    if (challenges) {
      config.challenges = challenges;
    }
    
    config.lastUpdated = new Date();
    config.updatedBy = req.user.sub;
    
    await config.save();
    
    res.json({
      success: true,
      message: 'Configuration updated successfully',
      config: {
        modules: config.modules,
        challenges: config.challenges,
        lastUpdated: config.lastUpdated
      }
    });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset to defaults (ADMIN ONLY)
router.post('/config/reset', requireAuth, requireAdmin, async (req, res) => {
  try {
    const config = await WebsiteConfig.getConfig();
    
    // Enable all features
    config.modules.forEach(module => module.enabled = true);
    config.challenges.forEach(challenge => challenge.enabled = true);
    
    config.lastUpdated = new Date();
    config.updatedBy = req.user.sub;
    
    await config.save();
    
    res.json({
      success: true,
      message: 'Configuration reset to defaults',
      config: {
        modules: config.modules,
        challenges: config.challenges,
        lastUpdated: config.lastUpdated
      }
    });
  } catch (error) {
    console.error('Reset config error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
