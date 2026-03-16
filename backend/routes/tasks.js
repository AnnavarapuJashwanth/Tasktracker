import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Middleware to check admin authentication
const adminAuth = (req, res, next) => {
  // Headers are typically lowercase in Express
  const adminPin = req.headers.adminpin || req.headers['admin-pin'] || req.headers.adminPin;
  const expectedPin = process.env.ADMIN_PIN;
  
  console.log('Auth Check - Headers:', req.headers);
  console.log('Auth Check - Received PIN:', adminPin, 'Expected PIN:', expectedPin);
  
  if (!adminPin || adminPin !== expectedPin) {
    console.log('Auth failed. Expected:', expectedPin, 'Got:', adminPin);
    return res.status(401).json({ message: 'Unauthorized - Invalid PIN' });
  }
  next();
};

// Create task
router.post('/create', adminAuth, upload.single('photo'), async (req, res, next) => {
  try {
    const { title, description, priority, category, sector, dueDate, referencePhone, referenceNumber, assignedToContactId, assignedToContact } = req.body;

    console.log('Creating task with:', { title, description, priority, category, sector, dueDate, referencePhone, referenceNumber, assignedToContactId, assignedToContact });
    console.log('File uploaded:', req.file ? req.file.filename : 'No file');

    let photoUrl = null;
    if (req.file) {
      // Store the relative path/URL for the photo
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const task = new Task({
      title,
      description,
      priority,
      category,
      sector,
      dueDate,
      referencePhone,
      referenceNumber,
      assignedToContactId,
      assignedToContact,
      photo: photoUrl, // Store the photo URL instead of base64
      createdBy: 'admin',
    });

    await task.save();
    console.log('Task created with ID:', task._id);
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.log('Error creating task:', error.message);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Get all tasks
router.get('/all', adminAuth, async (req, res) => {
  try {
    console.log('Fetching all tasks...');
    
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('Database not connected, returning empty tasks');
      return res.json([]);
    }
    
    const tasks = await Task.find().sort({ createdAt: -1 });
    console.log('Tasks found:', tasks.length);
    res.json(tasks);
  } catch (error) {
    console.log('Error fetching tasks:', error.message);
    // Return empty array instead of error
    res.json([]);
  }
});

// Get tasks by sector
router.get('/sector/:sector', adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ sector: req.params.sector }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Get task statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    console.log('Fetching task statistics...');
    
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('Database not connected, returning default stats');
      return res.json({ 
        total: 0, 
        pending: 0, 
        inProgress: 0, 
        completed: 0,
        warning: 'Database connection unavailable - showing default values'
      });
    }
    
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });

    console.log('Stats calculated:', { total, pending, inProgress, completed });
    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    console.log('Error fetching stats:', error.message);
    // Return default stats instead of error
    res.json({ 
      total: 0, 
      pending: 0, 
      inProgress: 0, 
      completed: 0,
      error: error.message 
    });
  }
});

// Update task status
router.put('/update/:id', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const { status, startTime, endTime, title, description, priority, category, sector, dueDate, referencePhone, referenceNumber, assignedToContactId, assignedToContact, photo } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update basic fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (sector !== undefined) task.sector = sector;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (referencePhone !== undefined) task.referencePhone = referencePhone;
    if (referenceNumber !== undefined) task.referenceNumber = referenceNumber;
    if (assignedToContactId !== undefined) task.assignedToContactId = assignedToContactId;
    if (assignedToContact !== undefined) task.assignedToContact = assignedToContact;
    
    // Handle photo: if new file was uploaded, use it; otherwise use provided value
    if (req.file) {
      task.photo = `/uploads/${req.file.filename}`;
    } else if (photo !== undefined) {
      task.photo = photo;
    }

    // Handle status changes with timing logic
    if (status) {
      if (status === 'In Progress' && !task.startTime) {
        task.startTime = new Date();
        task.status = status;
      } else if (status === 'Completed' && task.startTime) {
        task.endTime = new Date();
        const durationMs = task.endTime - task.startTime;
        const hours = Math.floor(durationMs / 3600000);
        const minutes = Math.floor((durationMs % 3600000) / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        task.duration = `${hours}h ${minutes}m ${seconds}s`;
        task.status = status;
      } else {
        task.status = status;
      }
    }

    task.updatedAt = new Date();
    await task.save();

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Assign task
router.put('/assign/:id', adminAuth, async (req, res) => {
  try {
    const { assignedTo, assignedToPhone } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assignedTo = assignedTo;
    task.assignedToPhone = assignedToPhone;
    task.status = 'In Progress';
    task.startTime = new Date();
    task.updatedAt = new Date();

    await task.save();

    res.json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
});

// Delete task
router.delete('/delete/:id', adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Get single task
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// Error handler middleware for multer and other errors
router.use((err, req, res, next) => {
  if (err) {
    console.error('Route error:', err.message);
    
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files' });
    }
    if (err.message && err.message.includes('MIME')) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }
    
    // Generic error
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
  next();
});

export default router;
