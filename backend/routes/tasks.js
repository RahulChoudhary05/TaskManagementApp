import express from 'express';
import { db, isFirebaseAdminReady } from '../config/admin.js';
import { verifyToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // If Firebase Admin not configured, return demo data
    if (!isFirebaseAdminReady || !db) {
      console.log('ℹ️  Firebase Admin not configured - returning demo tasks');
      return res.json({
        success: true,
        message: 'Demo mode - no real data stored',
        count: 0,
        tasks: []
      });
    }

    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const userId = req.user.uid;

    let query = db.collection('tasks').where('userId', '==', userId);

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    query = query.orderBy(sortBy, order);

    const snapshot = await query.get();
    
    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
        updatedAt: doc.data().updatedAt?.toDate?.(),
        dueDate: doc.data().dueDate?.toDate?.()
      });
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Fetch tasks error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      message: error.message 
    });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    if (!isFirebaseAdminReady || !db) {
      return res.status(503).json({
        error: 'Service not available',
        message: 'Firebase not configured'
      });
    }

    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('tasks').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Task not found'
      });
    }

    const task = doc.data();

    if (task.userId !== userId) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to access this task' 
      });
    }

    res.json({
      success: true,
      task: {
        id: doc.id,
        ...task,
        createdAt: task.createdAt?.toDate?.(),
        updatedAt: task.updatedAt?.toDate?.(),
        dueDate: task.dueDate?.toDate?.()
      }
    });
  } catch (error) {
    console.error('Fetch task error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch task',
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private
 */
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!isFirebaseAdminReady || !db) {
      return res.status(503).json({
        error: 'Service not available',
        message: 'Firebase not configured - tasks cannot be persisted'
      });
    }

    const { title, description, status = 'todo', dueDate } = req.body;
    const userId = req.user.uid;

    const taskData = {
      userId,
      title,
      description: description || '',
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const docRef = await db.collection('tasks').add(taskData);
    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: newDoc.data().createdAt?.toDate?.(),
        updatedAt: newDoc.data().updatedAt?.toDate?.(),
        dueDate: newDoc.data().dueDate?.toDate?.()
      }
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ 
      error: 'Failed to create task',
      message: error.message 
    });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!isFirebaseAdminReady || !db) {
      return res.status(503).json({
        error: 'Service not available'
      });
    }

    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('tasks').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Task not found'
      });
    }

    const task = doc.data();

    if (task.userId !== userId) {
      return res.status(403).json({ 
        error: 'Forbidden'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    if (req.body.dueDate) {
      updateData.dueDate = new Date(req.body.dueDate);
    }

    await db.collection('tasks').doc(id).update(updateData);
    const updatedDoc = await db.collection('tasks').doc(id).get();

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.(),
        updatedAt: updatedDoc.data().updatedAt?.toDate?.(),
        dueDate: updatedDoc.data().dueDate?.toDate?.()
      }
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ 
      error: 'Failed to update task'
    });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!isFirebaseAdminReady || !db) {
      return res.status(503).json({
        error: 'Service not available'
      });
    }

    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('tasks').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Task not found'
      });
    }

    const task = doc.data();

    if (task.userId !== userId) {
      return res.status(403).json({ 
        error: 'Forbidden'
      });
    }

    await db.collection('tasks').doc(id).delete();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete task'
    });
  }
});

export default router;
