import express from 'express';
import RoleRequest from '../models/RoleRequest.js';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create a new role request (any authenticated user)
router.post('/', async (req, res) => {
  try {
    const { requestedRole, reason } = req.body || {};
    const userId = req.user.sub;
    
    if (!requestedRole || !reason) {
      return res.status(400).json({ error: 'Requested role and reason are required' });
    }
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user already has a pending request
    const existingRequest = await RoleRequest.findOne({ 
      userId, 
      status: 'pending' 
    });
    
    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending role request' });
    }
    
    // Create role request
    const roleRequest = await RoleRequest.create({
      userId,
      username: user.username,
      email: user.email,
      currentRole: user.role,
      requestedRole,
      reason,
      status: 'pending'
    });
    
    console.log('Role request created:', roleRequest.id, 'by user:', user.username);
    res.json({ roleRequest });
  } catch (error) {
    console.error('Error creating role request:', error);
    res.status(500).json({ error: 'Failed to create role request' });
  }
});

// Get all role requests (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const requests = await RoleRequest.find(filter)
      .populate('userId', 'username email avatarSrc avatarName role')
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching role requests:', error);
    res.status(500).json({ error: 'Failed to fetch role requests' });
  }
});

// Get current user's role requests (any authenticated user)
router.get('/my-requests', async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const requests = await RoleRequest.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching user role requests:', error);
    res.status(500).json({ error: 'Failed to fetch role requests' });
  }
});

// Get pending requests count (admin only)
router.get('/count/pending', requireAdmin, async (req, res) => {
  try {
    const count = await RoleRequest.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    console.error('Error counting pending requests:', error);
    res.status(500).json({ error: 'Failed to count requests' });
  }
});

// Update role request status (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body || {};
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const roleRequest = await RoleRequest.findById(id);
    if (!roleRequest) {
      return res.status(404).json({ error: 'Role request not found' });
    }
    
    if (roleRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }
    
    // Update role request
    roleRequest.status = status;
    roleRequest.adminResponse = adminResponse;
    roleRequest.respondedBy = req.user.sub;
    roleRequest.respondedAt = new Date();
    await roleRequest.save();
    
    // If approved, update user's role
    if (status === 'approved') {
      await User.findByIdAndUpdate(roleRequest.userId, { 
        role: roleRequest.requestedRole 
      });
      console.log('User role updated:', roleRequest.username, 'to', roleRequest.requestedRole);
    }
    
    console.log('Role request', status, ':', roleRequest.id);
    res.json({ roleRequest });
  } catch (error) {
    console.error('Error updating role request:', error);
    res.status(500).json({ error: 'Failed to update role request' });
  }
});

export default router;
