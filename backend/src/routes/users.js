import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file require auth
router.use(requireAuth);

// Check daily login and update streak
router.post('/daily-login', async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    const lastLoginDay = lastLogin ? new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()) : null;
    
    let streakUpdated = false;
    let newStreak = user.streak || 0;
    
    // Check if this is a new day
    if (!lastLoginDay || today > lastLoginDay) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If last login was yesterday, increment streak
      if (lastLoginDay && lastLoginDay.getTime() === yesterday.getTime()) {
        newStreak = (user.streak || 0) + 1;
        streakUpdated = true;
      }
      // If last login was before yesterday, reset streak to 1
      else if (!lastLoginDay || lastLoginDay < yesterday) {
        newStreak = 1;
        streakUpdated = true;
      }
      
      // Update user
      user.lastLoginDate = now;
      user.streak = newStreak;
      user.dailyMissionCompleted = false; // Reset daily mission for new day
      await user.save();
    }
    
    res.json({ 
      streak: newStreak,
      streakUpdated,
      dailyMissionCompleted: user.dailyMissionCompleted,
      lastLoginDate: user.lastLoginDate
    });
  } catch (error) {
    console.error('Error checking daily login:', error);
    res.status(500).json({ error: 'Failed to check daily login' });
  }
});

// Complete daily mission
router.post('/complete-daily-mission', async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const missionDate = user.dailyMissionDate ? new Date(user.dailyMissionDate) : null;
    const missionDay = missionDate ? new Date(missionDate.getFullYear(), missionDate.getMonth(), missionDate.getDate()) : null;
    
    // Check if mission already completed today (COMMENTED OUT FOR TESTING)
    // if (user.dailyMissionCompleted && missionDay && missionDay.getTime() === today.getTime()) {
    //   return res.json({ 
    //     alreadyCompleted: true,
    //     message: 'Daily mission already completed today!',
    //     streak: user.streak,
    //     experience: user.experience
    //   });
    // }
    
    // Award XP
    const xpReward = 35;
    user.experience = (user.experience || 0) + xpReward;
    
    // Increment streak
    user.streak = (user.streak || 0) + 1;
    
    // Mark mission as completed
    user.dailyMissionCompleted = true;
    user.dailyMissionDate = now;
    
    await user.save();
    
    res.json({ 
      success: true,
      xpAwarded: xpReward,
      totalXp: user.experience,
      streak: user.streak,
      message: 'Daily Growth Completed +1'
    });
  } catch (error) {
    console.error('Error completing daily mission:', error);
    res.status(500).json({ error: 'Failed to complete daily mission' });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  await User.deleteOne({ _id: id });
  res.json({ ok: true });
});

// Update user (username and/or role)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body || {};
    
    const updateData = {};
    if (username) updateData.username = username;
    if (role) {
      if (!['user', 'admin', 'faculty'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      updateData.role = role;
    }
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User updated:', user.username, updateData);
    res.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.put('/:id/role', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body || {};
  if (!['user','admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  res.json({ user });
});

// Update user avatar (can be used by user themselves or admin)
router.put('/:id/avatar', async (req, res) => {
  try {
    const { id } = req.params;
    const { avatarSrc, avatarName, avatar } = req.body || {};
    
    console.log('Avatar update request:', { id, avatarSrc, avatarName, user: req.user?.sub, role: req.user?.role });
    
    // Allow user to update their own avatar, or admin to update anyone's
    if (req.user.sub !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const updateData = {};
    if (avatarSrc) updateData.avatarSrc = avatarSrc;
    if (avatarName) updateData.avatarName = avatarName;
    if (avatar) updateData.avatar = avatar;
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Avatar updated successfully for user:', user?.username);
    res.json({ user });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Update user profile (bio, avatar, etc.) - user can update their own or admin can update anyone's
router.put('/:id/profile', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, bio, avatarSrc, avatarName, avatar } = req.body;
    
    console.log('Profile update request:', { id, displayName, bio, avatarSrc, avatarName, user: req.user?.sub, role: req.user?.role });
    
    // Allow user to update their own profile, or admin to update anyone's
    if (req.user.sub !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const updateData = {};
    if (displayName !== undefined) updateData.name = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarSrc) updateData.avatarSrc = avatarSrc;
    if (avatarName) updateData.avatarName = avatarName;
    if (avatar) updateData.avatar = avatar;
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Profile updated successfully for user:', user?.username);
    res.json({ user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
