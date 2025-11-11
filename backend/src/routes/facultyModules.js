import express from 'express';
import FacultySpace from '../models/FacultyModule.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate unique space code
function generateSpaceCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create new faculty space
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { name, description, primaryColor } = req.body;
    
    // Check if user is faculty or admin
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied. Faculty or admin only.' });
    }
    
    // Generate unique space code
    let spaceCode;
    let isUnique = false;
    while (!isUnique) {
      spaceCode = generateSpaceCode();
      const existing = await FacultySpace.findOne({ spaceCode });
      if (!existing) isUnique = true;
    }
    
    const space = new FacultySpace({
      name,
      description,
      spaceCode,
      creatorId: req.user.sub,
      creatorName: req.user.email,
      theme: {
        primaryColor: primaryColor || '#1d4ed8',
        accentColor: '#f97316',
        backgroundImage: ''
      },
      isPublished: false,
      enrolledStudents: [],
      modules: [],
      announcements: [],
      assignments: []
    });
    
    await space.save();
    
    res.json({ 
      success: true, 
      space: space.toJSON(),
      message: 'Space created successfully' 
    });
  } catch (error) {
    console.error('Create space error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all faculty spaces (for admins) or user's own spaces
router.get('/my-spaces', requireAuth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { creatorId: req.user.sub };
    
    const spaces = await FacultySpace.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, spaces });
  } catch (error) {
    console.error('Get spaces error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get enrolled spaces (MUST be before /:spaceId route)
router.get('/enrolled', requireAuth, async (req, res) => {
  try {
    console.log('Fetching enrolled spaces for user:', req.user.sub);
    
    const spaces = await FacultySpace.find({ 
      enrolledStudents: req.user.sub 
    }).sort({ createdAt: -1 }).lean();
    
    console.log('Found enrolled spaces:', spaces.length);
    
    res.json({ success: true, spaces });
  } catch (error) {
    console.error('Get enrolled spaces error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single space details
router.get('/:spaceId', requireAuth, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const space = await FacultySpace.findById(spaceId)
      .populate('enrolledStudents', 'username email name avatarSrc avatarName avatar')
      .lean();
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    // Check if user has access
    const isCreator = space.creatorId.toString() === req.user.sub;
    const isEnrolled = space.enrolledStudents.some(student => 
      (student._id || student).toString() === req.user.sub
    );
    const isAdmin = req.user.role === 'admin';
    
    if (!isCreator && !isEnrolled && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.json({ success: true, space });
  } catch (error) {
    console.error('Get space error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enroll in space using space code
router.post('/enroll', requireAuth, async (req, res) => {
  try {
    const { spaceCode } = req.body;
    
    const space = await FacultySpace.findOne({ spaceCode: spaceCode.toUpperCase() });
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Invalid space code' });
    }
    
    // Check if already enrolled
    if (space.enrolledStudents.includes(req.user.sub)) {
      return res.json({ success: true, message: 'Already enrolled', space: space.toJSON() });
    }
    
    space.enrolledStudents.push(req.user.sub);
    await space.save();
    
    res.json({ 
      success: true, 
      message: 'Successfully enrolled in space',
      space: space.toJSON()
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update space details
router.put('/:spaceId', requireAuth, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const updates = req.body;
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    Object.assign(space, updates);
    await space.save();
    
    res.json({ success: true, space: space.toJSON() });
  } catch (error) {
    console.error('Update space error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add module to space
router.post('/:spaceId/modules', requireAuth, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const moduleData = req.body;
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    space.modules.push({
      ...moduleData,
      order: space.modules.length,
      lessons: [],
      quizzes: []
    });
    
    await space.save();
    
    res.json({ success: true, space: space.toJSON() });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete space
router.delete('/:spaceId', requireAuth, async (req, res) => {
  try {
    const { spaceId } = req.params;
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    await FacultySpace.findByIdAndDelete(spaceId);
    
    res.json({ success: true, message: 'Space deleted successfully' });
  } catch (error) {
    console.error('Delete space error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
