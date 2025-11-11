import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// XP rewards for each challenge type
const CHALLENGE_XP_REWARDS = {
  'header-check': {
    base: 50,
    perfect: 100,    // All correct
    good: 75,        // 80%+ correct
    complete: 50     // Just completing
  },
  'firewall-frenzy': {
    base: 75,
    perfect: 150,
    good: 100,
    complete: 75
  },
  'crypto-crack': {
    base: 100,
    perfect: 200,
    good: 150,
    complete: 100
  },
  'intrusion-intercept': {
    base: 150,
    perfect: 300,
    good: 225,
    complete: 150
  }
};

// Calculate level from XP (simple curve: level = sqrt(xp/100))
function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Get user's challenge progress
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      progress: {
        experience: user.experience || 0,
        level: user.level || 1,
        challenges: user.challengeProgress || []
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit challenge completion
router.post('/complete', requireAuth, async (req, res) => {
  try {
    const { challengeId, score, maxScore, timeSpent, correct, total } = req.body;
    
    if (!challengeId || score === undefined || maxScore === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: challengeId, score, maxScore' 
      });
    }
    
    const user = await User.findById(req.user.sub);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Calculate performance percentage
    const percentage = (score / maxScore) * 100;
    
    // Determine XP reward
    const rewards = CHALLENGE_XP_REWARDS[challengeId] || CHALLENGE_XP_REWARDS['header-check'];
    let xpEarned = rewards.complete;
    
    if (percentage >= 100) {
      xpEarned = rewards.perfect;
    } else if (percentage >= 80) {
      xpEarned = rewards.good;
    }
    
    // Find or create challenge progress entry
    const existingProgress = user.challengeProgress?.find(p => p.challengeId === challengeId);
    
    if (existingProgress) {
      // Update existing progress
      existingProgress.attempts += 1;
      existingProgress.lastPlayed = new Date();
      
      // Update best score if this is better
      if (score > existingProgress.bestScore) {
        existingProgress.bestScore = score;
      }
      
      // Mark as completed if not already and score is good enough
      if (!existingProgress.completed && percentage >= 70) {
        existingProgress.completed = true;
        existingProgress.completedAt = new Date();
      }
    } else {
      // Create new progress entry
      user.challengeProgress = user.challengeProgress || [];
      user.challengeProgress.push({
        challengeId,
        completed: percentage >= 70,
        bestScore: score,
        attempts: 1,
        lastPlayed: new Date(),
        completedAt: percentage >= 70 ? new Date() : null
      });
    }
    
    // Award XP
    const oldXP = user.experience || 0;
    const oldLevel = user.level || 1;
    
    user.experience = oldXP + xpEarned;
    user.level = calculateLevel(user.experience);
    
    const leveledUp = user.level > oldLevel;
    
    await user.save();
    
    res.json({
      success: true,
      result: {
        xpEarned,
        totalXP: user.experience,
        oldLevel,
        newLevel: user.level,
        leveledUp,
        percentage: Math.round(percentage),
        challengeCompleted: percentage >= 70
      }
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', requireAuth, async (req, res) => {
  try {
    const { challengeId } = req.query;
    
    let users;
    
    if (challengeId) {
      // Leaderboard for specific challenge
      users = await User.find({
        'challengeProgress.challengeId': challengeId
      })
      .select('username avatarName avatarSrc experience level challengeProgress')
      .lean();
      
      // Extract best score for this challenge and sort
      users = users
        .map(user => {
          const progress = user.challengeProgress.find(p => p.challengeId === challengeId);
          return {
            username: user.username,
            avatarName: user.avatarName,
            avatarSrc: user.avatarSrc,
            level: user.level,
            score: progress?.bestScore || 0,
            completed: progress?.completed || false
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 50); // Top 50
    } else {
      // Overall leaderboard by XP
      users = await User.find()
        .select('username avatarName avatarSrc experience level')
        .sort({ experience: -1 })
        .limit(50)
        .lean();
      
      users = users.map(user => ({
        username: user.username,
        avatarName: user.avatarName,
        avatarSrc: user.avatarSrc,
        level: user.level,
        experience: user.experience
      }));
    }
    
    res.json({
      success: true,
      leaderboard: users
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
