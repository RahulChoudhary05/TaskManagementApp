import { auth, isFirebaseAdminReady } from '../config/admin.js';

/**
 * Middleware to verify Firebase ID token
 * Works with or without Firebase Admin SDK
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // If Firebase Admin is configured, verify token
    if (isFirebaseAdminReady && auth) {
      try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name
        };
        next();
      } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Authentication failed'
        });
      }
    } else {
      // Fallback: Accept token without verification
      // In production, you should always verify tokens properly
      console.warn('⚠️  Firebase Admin not configured - accepting tokens without verification');
      console.warn('⚠️  For production, configure Firebase Admin SDK');
      
      // Basic token validation (not secure for production)
      if (token.length < 100) {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Token format invalid'
        });
      }

      // Extract user info from token header (basic decoding)
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return res.status(401).json({ 
            error: 'Invalid token',
            message: 'Token format invalid'
          });
        }
        
        // Store token in request for later use
        req.user = {
          uid: 'temp-user',
          email: 'user@example.com',
          token: token
        };
        next();
      } catch (err) {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Token parsing failed'
        });
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Authentication failed'
    });
  }
};
