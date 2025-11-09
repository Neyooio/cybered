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
    const { username, email, phone, password, name, avatarUrl } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email and password required' });

    // Password policy (allow env-admin credentials to bypass to avoid dev lockout)
    if (!isAdminCredential(email, password) && !strongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 chars and include upper, lower, number and symbol.' });
    }

    const existing = await User.findOne({ $or: [ { email: email.toLowerCase() }, { username } ] });
    if (existing) return res.status(409).json({ error: 'Username or email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const role = isAdminCredential(email, password) ? 'admin' : 'user';

    const user = await User.create({ username, email: email.toLowerCase(), phone, passwordHash, role, name, avatarUrl });
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
      xp: user.xp || 0,
      streak: user.streak || 0,
      rank: user.rank || 0
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
