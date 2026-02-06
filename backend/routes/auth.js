import express from 'express';
import { auth } from '../config/admin.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('displayName').notEmpty().withMessage('Display name is required')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, displayName } = req.body;

    // Create user with Firebase Admin
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        error: 'Email already in use',
        message: 'This email is already registered' 
      });
    }
    
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify user token
 * @access  Public
 */
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Token required',
        message: 'Please provide a token' 
      });
    }

    // Verify token
    const decodedToken = await auth.verifyIdToken(token);

    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name
      }
    });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token verification failed' 
    });
  }
});

/**
 * @route   DELETE /api/auth/delete/:uid
 * @desc    Delete user account
 * @access  Private (requires admin)
 */
router.delete('/delete/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    await auth.deleteUser(uid);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('User deletion error:', error.message);
    res.status(500).json({ 
      error: 'Delete failed',
      message: error.message 
    });
  }
});

export default router;
