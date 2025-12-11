import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function sign(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  return token;
}
function strongPassword(pw=''){
  return (
    typeof pw === 'string' &&
    pw.length >= 8 &&
    /[a-z]/.test(pw) &&
    /[A-Z]/.test(pw) &&
    /\d/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}


function isAdminCredential(email, password) {
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || '';
  return email.toLowerCase() === adminEmail && password === adminPass;
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, avatarUrl } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email and password required' });

    // Password policy (allow env-admin credentials to bypass to avoid dev lockout)
    if (!isAdminCredential(email, password) && !strongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 chars and include upper, lower, number and symbol.' });
    }

    const existing = await User.findOne({ $or: [ { email: email.toLowerCase() }, { username } ] });
    if (existing) return res.status(409).json({ error: 'Username or email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const role = isAdminCredential(email, password) ? 'admin' : 'user';

    const user = await User.create({ username, email: email.toLowerCase(), passwordHash, role, name, avatarUrl });
    const token = sign(user);
    return res.status(201).json({ token, role: user.role, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Admin shortcut by env
    if (isAdminCredential(email, password)) {
      // Ensure an admin user exists in DB
      let admin = await User.findOne({ email: email.toLowerCase() });
      if (!admin) {
        const passwordHash = await bcrypt.hash(password, 10);
        const username = (email.split('@')[0] || 'admin');
        admin = await User.create({ username, email: email.toLowerCase(), passwordHash, role: 'admin' });
      } else if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
      }
      return res.json({ token: sign(admin), role: 'admin', user: admin });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    return res.json({ token: sign(user), role: user.role, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarSrc: user.avatarSrc,
      avatarName: user.avatarName,
      xp: user.experience || 0,
      experience: user.experience || 0,
      streak: user.streak || 0,
      rank: user.rank || 0
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Refresh token endpoint - generates new token with updated user data
router.post('/refresh-token', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate new token with current role
    const token = sign(user);
    
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarSrc: user.avatarSrc,
        avatarName: user.avatarName
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Get user notification preferences
router.get('/notifications/preferences', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('deletedNotifications readNotifications');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json({
      deletedNotifications: user.deletedNotifications || [],
      readNotifications: user.readNotifications || []
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Delete a notification
router.delete('/notifications/:id', requireAuth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user = await User.findById(req.user.sub);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add to deletedNotifications if not already there
    if (!user.deletedNotifications) {
      user.deletedNotifications = [];
    }
    
    if (!user.deletedNotifications.includes(notificationId)) {
      user.deletedNotifications.push(notificationId);
      await user.save();
    }
    
    return res.json({ 
      success: true, 
      message: 'Notification deleted',
      deletedNotifications: user.deletedNotifications
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user = await User.findById(req.user.sub);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add to readNotifications if not already there
    if (!user.readNotifications) {
      user.readNotifications = [];
    }
    
    if (!user.readNotifications.includes(notificationId)) {
      user.readNotifications.push(notificationId);
      await user.save();
    }
    
    return res.json({ 
      success: true, 
      message: 'Notification marked as read',
      readNotifications: user.readNotifications
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/notifications/mark-all-read', requireAuth, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    if (!Array.isArray(notificationIds)) {
      return res.status(400).json({ error: 'notificationIds must be an array' });
    }
    
    const user = await User.findById(req.user.sub);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize if needed
    if (!user.readNotifications) {
      user.readNotifications = [];
    }
    
    // Add all new notification IDs
    notificationIds.forEach(id => {
      if (!user.readNotifications.includes(id)) {
        user.readNotifications.push(id);
      }
    });
    
    await user.save();
    
    return res.json({ 
      success: true, 
      message: 'All notifications marked as read',
      readNotifications: user.readNotifications
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // For security, always return success even if user doesn't exist
    // This prevents user enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    }
    
    // Generate a temporary password or reset token
    // For this implementation, we'll generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'; // Meets password policy
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    
    user.passwordHash = passwordHash;
    await user.save();
    
    // In a production environment, you would send an email here
    // For now, we'll just log it (DO NOT do this in production!)
    console.log(`Password reset for ${email}. Temporary password: ${tempPassword}`);
    console.log('NOTE: In production, this should be sent via email, not logged!');
    
    return res.json({ 
      success: true, 
      message: 'Password reset instructions have been sent to your email.',
      // TEMPORARY: Remove this in production!
      tempPassword: tempPassword // Only for development/testing
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

export default router;
