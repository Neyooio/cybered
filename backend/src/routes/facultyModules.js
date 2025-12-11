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

// ==============================================
// MODULE ROUTES - These MUST come before /:spaceId routes
// ==============================================

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
    
    // Create new module with materials
    const newModule = {
      title: moduleData.title || moduleData.name,
      description: moduleData.description || '',
      order: space.modules.length,
      materials: moduleData.materials || [],
      lessons: [],
      quizzes: []
    };
    
    space.modules.push(newModule);
    
    await space.save();
    
    res.json({ success: true, space: space.toJSON() });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update module in space
router.put('/:spaceId/modules/:moduleId', requireAuth, async (req, res) => {
  try {
    const { spaceId, moduleId } = req.params;
    const { name, title, description, materials, lessons, quizzes } = req.body;
    
    console.log('[Update Module] Received request');
    console.log('[Update Module] Space ID:', spaceId);
    console.log('[Update Module] Module ID:', moduleId);
    console.log('[Update Module] Request body:', { name, title, description, materials: materials?.length });
    console.log('[Update Module] User:', req.user?.sub);
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      console.error('[Update Module] Space not found:', spaceId);
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    console.log('[Update Module] Found space:', space.name);
    console.log('[Update Module] Space has', space.modules?.length, 'modules');
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    // Find the module
    const module = space.modules.find(m => m._id.toString() === moduleId);
    
    if (!module) {
      console.error('[Update Module] Module not found in space');
      console.error('[Update Module] Looking for module ID:', moduleId);
      console.error('[Update Module] Available module IDs:', space.modules.map(m => m._id.toString()));
      return res.status(404).json({ success: false, error: 'Module not found' });
    }
    
    console.log('[Update Module] Found module:', module.title);
    
    // Update module fields
    if (name || title) module.title = name || title;
    if (description !== undefined) module.description = description;
    if (materials !== undefined) module.materials = materials;
    if (lessons !== undefined) module.lessons = lessons;
    if (quizzes !== undefined) module.quizzes = quizzes;
    
    await space.save();
    
    console.log('[Update Module] Module updated successfully');
    res.json({ success: true, message: 'Module updated successfully', space: space.toJSON() });
  } catch (error) {
    console.error('[Update Module] Error:', error);
    console.error('[Update Module] Error stack:', error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete module from space
router.delete('/:spaceId/modules/:moduleId', requireAuth, async (req, res) => {
  try {
    const { spaceId, moduleId } = req.params;
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    // Find and remove the module
    const moduleIndex = space.modules.findIndex(m => m._id.toString() === moduleId);
    
    if (moduleIndex === -1) {
      return res.status(404).json({ success: false, error: 'Module not found' });
    }
    
    space.modules.splice(moduleIndex, 1);
    
    await space.save();
    
    res.json({ success: true, message: 'Module deleted successfully', space: space.toJSON() });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================================
// ANNOUNCEMENT ROUTES - Must come before /:spaceId routes
// ==============================================

// Add announcement to space
router.post('/:spaceId/announcements', requireAuth, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { title, content } = req.body;
    
    console.log('[Add Announcement] Received request');
    console.log('[Add Announcement] Space ID:', spaceId);
    console.log('[Add Announcement] Title:', title);
    console.log('[Add Announcement] User:', req.user?.sub);
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      console.error('[Add Announcement] Space not found:', spaceId);
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    console.log('[Add Announcement] Found space:', space.name);
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    // Create new announcement
    const newAnnouncement = {
      title: title,
      content: content,
      createdBy: req.user.sub,
      createdAt: new Date()
    };
    
    space.announcements.push(newAnnouncement);
    
    await space.save();
    
    console.log('[Add Announcement] Announcement added successfully');
    res.json({ success: true, message: 'Announcement added successfully', space: space.toJSON() });
  } catch (error) {
    console.error('[Add Announcement] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update announcement in space
router.put('/:spaceId/announcements/:announcementId', requireAuth, async (req, res) => {
  try {
    const { spaceId, announcementId } = req.params;
    const { title, content } = req.body;
    
    console.log('[Update Announcement] Received request');
    console.log('[Update Announcement] Space ID:', spaceId);
    console.log('[Update Announcement] Announcement ID:', announcementId);
    console.log('[Update Announcement] User:', req.user?.sub);
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      console.error('[Update Announcement] Space not found:', spaceId);
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    console.log('[Update Announcement] Found space:', space.name);
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    // Find the announcement
    const announcement = space.announcements.find(a => a._id.toString() === announcementId);
    
    if (!announcement) {
      console.error('[Update Announcement] Announcement not found in space');
      console.error('[Update Announcement] Looking for announcement ID:', announcementId);
      console.error('[Update Announcement] Available announcement IDs:', space.announcements.map(a => a._id.toString()));
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }
    
    console.log('[Update Announcement] Found announcement:', announcement.title);
    
    // Update announcement fields
    if (title !== undefined) announcement.title = title;
    if (content !== undefined) announcement.content = content;
    announcement.updatedAt = new Date();
    
    await space.save();
    
    console.log('[Update Announcement] Announcement updated successfully');
    res.json({ success: true, message: 'Announcement updated successfully', space: space.toJSON() });
  } catch (error) {
    console.error('[Update Announcement] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete announcement from space
router.delete('/:spaceId/announcements/:announcementId', requireAuth, async (req, res) => {
  try {
    const { spaceId, announcementId } = req.params;
    
    const space = await FacultySpace.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    // Check permissions
    if (space.creatorId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    // Find and remove the announcement
    const announcementIndex = space.announcements.findIndex(a => a._id.toString() === announcementId);
    
    if (announcementIndex === -1) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }
    
    space.announcements.splice(announcementIndex, 1);
    
    await space.save();
    
    res.json({ success: true, message: 'Announcement deleted successfully', space: space.toJSON() });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================================
// SPACE ROUTES - Generic /:spaceId routes come AFTER module routes
// ==============================================

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
