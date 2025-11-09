import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file require auth
router.use(requireAuth);

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

export default router;
