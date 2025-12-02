import jwt from 'jsonwebtoken';
import { getDb } from '../config/sqlite.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    // Try multiple header formats (case-insensitive)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Extract token from "Bearer TOKEN" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid authorization header format:', authHeader);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authorization header format. Expected: Bearer <token>' 
      });
    }

    const token = parts[1];
    if (!token) {
      console.log('No token found in authorization header');
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        console.log('JWT verification failed - invalid token:', jwtError.message);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }
      if (jwtError.name === 'TokenExpiredError') {
        console.log('JWT verification failed - token expired');
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired' 
        });
      }
      throw jwtError;
    }
    
    // Get user from database
    const db = await getDb();
    const user = await db.get('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);
    if (!user) {
      console.log('User not found for userId:', decoded.userId);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
    }

    // Add user info to request
    req.user = {
      userId: user.UserID,
      username: user.Username,
      role: user.Role,
      associatedId: user.AssociatedID
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Check if user can access resource (own data or admin)
export const canAccessResource = (resourceUserIdField = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is accessing their own data
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    if (resourceUserId && resourceUserId.toString() === req.user.associatedId?.toString()) {
      return next();
    }

    // For teachers, check if they're accessing their own students
    if (req.user.role === 'teacher') {
      // This would need additional logic to check if the student is in teacher's class
      // For now, allow access (implement specific checks in controllers)
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: 'Access denied - insufficient permissions' 
    });
  };
};
