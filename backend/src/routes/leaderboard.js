import express from 'express';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit score to leaderboard (only students)
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { challengeName, score, level, completionTime } = req.body;
    
    // Verify user is a student
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can submit scores to the leaderboard' });
    }
    
    // Check if user already has a score for this challenge
    const existingEntry = await Leaderboard.findOne({
      userId: req.userId,
      challengeName: challengeName
    });
    
    if (existingEntry) {
      // Only update if new score is higher
      if (score > existingEntry.score) {
        existingEntry.score = score;
        existingEntry.level = level || existingEntry.level;
        existingEntry.completionTime = completionTime || existingEntry.completionTime;
        existingEntry.date = new Date();
        await existingEntry.save();
        
        return res.json({
          message: 'New high score! Leaderboard updated.',
          entry: existingEntry,
          isNewHighScore: true
        });
      } else {
        return res.json({
          message: 'Score submitted but not a new high score.',
          entry: existingEntry,
          isNewHighScore: false
        });
      }
    }
    
    // Create new leaderboard entry
    const leaderboardEntry = new Leaderboard({
      userId: req.userId,
      username: user.username,
      challengeName,
      score,
      level: level || 1,
      completionTime: completionTime || 0
    });
    
    await leaderboardEntry.save();
    
    res.status(201).json({
      message: 'Score submitted to leaderboard!',
      entry: leaderboardEntry,
      isNewHighScore: true
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard for a specific challenge
router.get('/challenge/:challengeName', async (req, res) => {
  try {
    const { challengeName } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    const leaderboard = await Leaderboard.find({ challengeName })
      .sort({ score: -1, completionTime: 1 }) // Higher score first, faster time as tiebreaker
      .limit(limit)
      .populate('userId', 'username role')
      .lean();
    
    // Filter out any non-students (extra safety check)
    const studentLeaderboard = leaderboard.filter(entry => 
      entry.userId && entry.userId.role === 'student'
    );
    
    // Add rank to each entry
    const rankedLeaderboard = studentLeaderboard.map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      score: entry.score,
      level: entry.level,
      completionTime: entry.completionTime,
      date: entry.date
    }));
    
    res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get overall leaderboard (all challenges combined)
router.get('/overall', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    // Aggregate total scores per user across all challenges
    const leaderboard = await Leaderboard.aggregate([
      {
        $group: {
          _id: '$userId',
          username: { $first: '$username' },
          totalScore: { $sum: '$score' },
          challengesCompleted: { $sum: 1 },
          maxLevel: { $max: '$level' }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: limit
      }
    ]);
    
    // Verify all are students
    const userIds = leaderboard.map(entry => entry._id);
    const users = await User.find({ _id: { $in: userIds }, role: 'student' });
    const studentIds = new Set(users.map(u => u._id.toString()));
    
    const studentLeaderboard = leaderboard
      .filter(entry => studentIds.has(entry._id.toString()))
      .map((entry, index) => ({
        rank: index + 1,
        username: entry.username,
        totalScore: entry.totalScore,
        challengesCompleted: entry.challengesCompleted,
        maxLevel: entry.maxLevel
      }));
    
    res.json(studentLeaderboard);
  } catch (error) {
    console.error('Error fetching overall leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's personal stats
router.get('/my-stats', requireAuth, async (req, res) => {
  try {
    const userEntries = await Leaderboard.find({ userId: req.userId })
      .sort({ score: -1 })
      .lean();
    
    const stats = {
      totalChallenges: userEntries.length,
      totalScore: userEntries.reduce((sum, entry) => sum + entry.score, 0),
      highestScore: Math.max(...userEntries.map(e => e.score), 0),
      challenges: userEntries.map(entry => ({
        challengeName: entry.challengeName,
        score: entry.score,
        level: entry.level,
        date: entry.date
      }))
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's rank in a specific challenge
router.get('/my-rank/:challengeName', requireAuth, async (req, res) => {
  try {
    const { challengeName } = req.params;
    
    const userEntry = await Leaderboard.findOne({
      userId: req.userId,
      challengeName
    });
    
    if (!userEntry) {
      return res.json({ rank: null, message: 'No score submitted yet' });
    }
    
    // Count how many scores are higher
    const higherScores = await Leaderboard.countDocuments({
      challengeName,
      score: { $gt: userEntry.score }
    });
    
    res.json({
      rank: higherScores + 1,
      score: userEntry.score,
      level: userEntry.level
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
