import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Badge definitions with criteria
const BADGES = {
  'first-steps': {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson quiz',
    icon: 'badge-first-steps.png',
    checkCriteria: (user) => {
      const quizCompletions = user.moduleProgress?.filter(p => p.quizPassed).length || 0;
      return quizCompletions >= 1;
    }
  },
  'quick-learner': {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Complete 5 lesson quizzes',
    icon: 'badge-quick-learner.png',
    checkCriteria: (user) => {
      const quizCompletions = user.moduleProgress?.filter(p => p.quizPassed).length || 0;
      return quizCompletions >= 5;
    }
  },
  'code-master': {
    id: 'code-master',
    name: 'Code Master',
    description: 'Complete 3 challenges',
    icon: 'badge-code-master.png',
    checkCriteria: (user) => {
      const challengeCompletions = user.challengeProgress?.filter(p => p.completed).length || 0;
      return challengeCompletions >= 3;
    }
  },
  'security-pro': {
    id: 'security-pro',
    name: 'Security Pro',
    description: 'Complete all lessons in a module',
    icon: 'badge-security-pro.png',
    checkCriteria: (user) => {
      // Check if any module has all 4 lessons completed
      const modules = ['cryptography', 'web-security', 'network-defense', 'malware-defense'];
      return modules.some(moduleId => {
        const completedLessons = user.moduleProgress?.filter(
          p => p.moduleId === moduleId && p.completed
        ).length || 0;
        return completedLessons >= 4;
      });
    }
  },
  'challenge-champion': {
    id: 'challenge-champion',
    name: 'Challenge Champion',
    description: 'Complete all challenges',
    icon: 'badge-challenge-champion.png',
    checkCriteria: (user) => {
      const challengeCompletions = user.challengeProgress?.filter(p => p.completed).length || 0;
      return challengeCompletions >= 5; // Adjust based on total challenges
    }
  },
  'master-hacker': {
    id: 'master-hacker',
    name: 'Master Hacker',
    description: 'Complete all modules and reach level 10',
    icon: 'badge-master-hacker.png',
    checkCriteria: (user) => {
      const totalLessons = user.moduleProgress?.filter(p => p.completed).length || 0;
      return totalLessons >= 16 && (user.level || 1) >= 10;
    }
  },
  'streak-warrior': {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 30-day streak',
    icon: 'badge-streak-warrior.png',
    checkCriteria: (user) => {
      return (user.streak || 0) >= 30;
    }
  }
};

// Calculate achievement count and check for new badges
function calculateAchievements(user) {
  const earnedBadges = user.badges || [];
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));
  const newBadges = [];
  
  // Check each badge
  for (const [badgeId, badge] of Object.entries(BADGES)) {
    if (!earnedBadgeIds.has(badgeId) && badge.checkCriteria(user)) {
      newBadges.push({
        badgeId,
        earnedAt: new Date(),
        progress: 100
      });
    }
  }
  
  return {
    newBadges,
    totalAchievements: earnedBadges.length + newBadges.length
  };
}

// Calculate next goal based on user progress
function calculateNextGoal(user) {
  const xp = user.experience || 0;
  const level = user.level || 1;
  const completedLessons = user.moduleProgress?.filter(p => p.completed).length || 0;
  const completedChallenges = user.challengeProgress?.filter(p => p.completed).length || 0;
  
  // Priority: lessons > challenges > XP milestones
  if (completedLessons < 16) {
    const remaining = 16 - completedLessons;
    return `Complete ${remaining} more lesson${remaining > 1 ? 's' : ''}`;
  }
  
  if (completedChallenges < 5) {
    const remaining = 5 - completedChallenges;
    return `Complete ${remaining} more challenge${remaining > 1 ? 's' : ''}`;
  }
  
  // XP milestones
  const xpMilestones = [500, 1000, 2000, 3000, 5000, 10000];
  const nextMilestone = xpMilestones.find(m => m > xp);
  
  if (nextMilestone) {
    return `Reach ${nextMilestone} XP`;
  }
  
  return 'Master of CyberEd!';
}

// @route   POST /api/progress/quiz
// @desc    Record quiz/lesson completion
// @access  Private
router.post('/quiz', requireAuth, async (req, res) => {
  try {
    const { moduleId, lessonNumber, score, passed } = req.body;
    const userId = req.user.sub;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize moduleProgress if needed
    if (!user.moduleProgress) user.moduleProgress = [];
    
    // Find existing progress or create new
    let progress = user.moduleProgress.find(
      p => p.moduleId === moduleId && p.lessonNumber === lessonNumber
    );
    
    if (progress) {
      // Update existing
      if (score > progress.quizScore) progress.quizScore = score;
      if (passed && !progress.quizPassed) {
        progress.quizPassed = true;
        progress.completed = true;
        progress.completedAt = new Date();
      }
    } else {
      // Create new
      user.moduleProgress.push({
        moduleId,
        lessonNumber,
        quizScore: score,
        quizPassed: passed,
        completed: passed,
        completedAt: passed ? new Date() : null
      });
    }
    
    // Award XP for quiz completion
    if (passed) {
      const xpReward = 100; // 100 XP per quiz
      user.experience = (user.experience || 0) + xpReward;
      user.level = Math.floor(1 + Math.sqrt((user.experience || 0) / 100));
    }
    
    // Check for new badges
    const { newBadges, totalAchievements } = calculateAchievements(user);
    if (newBadges.length > 0) {
      if (!user.badges) user.badges = [];
      user.badges.push(...newBadges);
      user.achievementCount = totalAchievements;
    }
    
    await user.save();
    
    res.json({
      success: true,
      progress: {
        moduleId,
        lessonNumber,
        completed: passed,
        score
      },
      newBadges: newBadges.map(nb => BADGES[nb.badgeId]),
      totalAchievements,
      nextGoal: calculateNextGoal(user),
      experience: user.experience,
      level: user.level
    });
  } catch (error) {
    console.error('Error recording quiz progress:', error);
    res.status(500).json({ error: 'Failed to record progress' });
  }
});

// @route   GET /api/progress/stats
// @desc    Get user's progress statistics
// @access  Private
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const completedLessons = user.moduleProgress?.filter(p => p.completed).length || 0;
    const completedChallenges = user.challengeProgress?.filter(p => p.completed).length || 0;
    const earnedBadges = user.badges || [];
    
    // Get badge details
    const badgeDetails = earnedBadges.map(eb => ({
      ...BADGES[eb.badgeId],
      earnedAt: eb.earnedAt
    }));
    
    // Calculate total achievements (completed lessons + challenges + badges)
    const totalAchievements = completedLessons + completedChallenges + earnedBadges.length;
    const maxAchievements = 16 + 5 + Object.keys(BADGES).length; // 16 lessons + 5 challenges + 8 badges
    
    res.json({
      achievements: {
        current: totalAchievements,
        max: maxAchievements,
        display: `${totalAchievements} / ${maxAchievements}`
      },
      nextGoal: calculateNextGoal(user),
      streak: user.streak || 0,
      badges: {
        earned: badgeDetails,
        available: Object.values(BADGES).map(b => ({
          ...b,
          earned: earnedBadges.some(eb => eb.badgeId === b.id),
          progress: getProgressTowards(user, b.id)
        }))
      },
      modules: {
        cryptography: calculateModuleProgress(user, 'cryptography'),
        'web-security': calculateModuleProgress(user, 'web-security'),
        'network-defense': calculateModuleProgress(user, 'network-defense'),
        'malware-defense': calculateModuleProgress(user, 'malware-defense')
      },
      challenges: {
        completed: completedChallenges,
        total: 5
      }
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Helper function to calculate module progress
function calculateModuleProgress(user, moduleId) {
  const lessons = user.moduleProgress?.filter(p => p.moduleId === moduleId) || [];
  return {
    completed: lessons.filter(l => l.completed).length,
    total: 4,
    percentage: Math.round((lessons.filter(l => l.completed).length / 4) * 100)
  };
}

// Helper function to get progress towards a badge
function getProgressTowards(user, badgeId) {
  switch(badgeId) {
    case 'first-steps':
      return Math.min(100, ((user.moduleProgress?.filter(p => p.quizPassed).length || 0) / 1) * 100);
    case 'quick-learner':
      return Math.min(100, ((user.moduleProgress?.filter(p => p.quizPassed).length || 0) / 5) * 100);
    case 'code-master':
      return Math.min(100, ((user.challengeProgress?.filter(p => p.completed).length || 0) / 3) * 100);
    case 'security-pro': {
      const modules = ['cryptography', 'web-security', 'network-defense', 'malware-defense'];
      const maxProgress = Math.max(...modules.map(moduleId => {
        return user.moduleProgress?.filter(p => p.moduleId === moduleId && p.completed).length || 0;
      }));
      return Math.min(100, (maxProgress / 4) * 100);
    }
    case 'challenge-champion':
      return Math.min(100, ((user.challengeProgress?.filter(p => p.completed).length || 0) / 5) * 100);
    case 'master-hacker': {
      const lessonProgress = (user.moduleProgress?.filter(p => p.completed).length || 0) / 16;
      const levelProgress = ((user.level || 1) / 10);
      return Math.min(100, ((lessonProgress + levelProgress) / 2) * 100);
    }
    case 'streak-warrior':
      return Math.min(100, ((user.streak || 0) / 30) * 100);
    default:
      return 0;
  }
}

export default router;
