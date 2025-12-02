import { getDb } from '../config/sqlite.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.UserID, 
      username: user.Username, 
      role: user.Role,
      associatedId: user.AssociatedID 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const db = await getDb();
    
    // Find user by username
    const user = await db.get('SELECT * FROM Users WHERE Username = ?', [username]);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    await db.run('UPDATE Users SET LastLogin = CURRENT_TIMESTAMP WHERE UserID = ?', [user.UserID]);

    // Get user profile
    let profile = {
      UserID: user.UserID,
      Username: user.Username,
      Role: user.Role,
      CreatedAt: user.CreatedAt,
      LastLogin: user.LastLogin
    };

    if (user.Role === 'student' && user.AssociatedID) {
      const student = await db.get('SELECT * FROM Students WHERE StudentID = ?', [user.AssociatedID]);
      if (student) {
        profile.StudentInfo = student;
      }
    } else if (user.Role === 'teacher' && user.AssociatedID) {
      const teacher = await db.get('SELECT * FROM Teachers WHERE TeacherID = ?', [user.AssociatedID]);
      if (teacher) {
        profile.TeacherInfo = teacher;
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          UserID: user.UserID,
          Username: user.Username,
          Role: user.Role,
          AssociatedID: user.AssociatedID,
          CreatedAt: user.CreatedAt,
          LastLogin: user.LastLogin
        },
        profile,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, password, role, firstName, lastName, email, phone } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and role are required' 
      });
    }

    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.get('SELECT UserID FROM Users WHERE Username = ?', [username]);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create associated record based on role
    let associatedId = null;
    if (role === 'student') {
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'First name, last name, and email are required for students' 
        });
      }
      
      const result = await db.run(`
        INSERT INTO Students (FirstName, LastName, Email, Phone, EnrollmentDate)
        VALUES (?, ?, ?, ?, CURRENT_DATE)
      `, [firstName, lastName, email, phone]);
      
      associatedId = result.lastID;
    } else if (role === 'teacher') {
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'First name, last name, and email are required for teachers' 
        });
      }
      
      const result = await db.run(`
        INSERT INTO Teachers (FirstName, LastName, Email, Phone, HireDate)
        VALUES (?, ?, ?, ?, CURRENT_DATE)
      `, [firstName, lastName, email, phone]);
      
      associatedId = result.lastID;
    }

    // Create user account
    const result = await db.run(`
      INSERT INTO Users (Username, PasswordHash, Role, AssociatedID)
      VALUES (?, ?, ?, ?)
    `, [username, passwordHash, role, associatedId]);

    const userId = result.lastID;

    // Get the created user
    const user = await db.get('SELECT * FROM Users WHERE UserID = ?', [userId]);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          UserID: user.UserID,
          Username: user.Username,
          Role: user.Role,
          AssociatedID: user.AssociatedID,
          CreatedAt: user.CreatedAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM Users WHERE UserID = ?', [req.user.userId]);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    let profile = {
      UserID: user.UserID,
      Username: user.Username,
      Role: user.Role,
      CreatedAt: user.CreatedAt,
      LastLogin: user.LastLogin
    };

    if (user.Role === 'student' && user.AssociatedID) {
      const student = await db.get('SELECT * FROM Students WHERE StudentID = ?', [user.AssociatedID]);
      if (student) {
        profile.StudentInfo = student;
      }
    } else if (user.Role === 'teacher' && user.AssociatedID) {
      const teacher = await db.get('SELECT * FROM Teachers WHERE TeacherID = ?', [user.AssociatedID]);
      if (teacher) {
        profile.TeacherInfo = teacher;
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          UserID: user.UserID,
          Username: user.Username,
          Role: user.Role,
          AssociatedID: user.AssociatedID,
          CreatedAt: user.CreatedAt,
          LastLogin: user.LastLogin
        },
        profile
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete user account permanently
export const deleteAccount = async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user.userId;
    
    // Get user to find associated record
    const user = await db.get('SELECT * FROM Users WHERE UserID = ?', [userId]);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Delete associated record (Student or Teacher) if exists
    if (user.AssociatedID) {
      if (user.Role === 'student') {
        await db.run('DELETE FROM Students WHERE StudentID = ?', [user.AssociatedID]);
      } else if (user.Role === 'teacher') {
        await db.run('DELETE FROM Teachers WHERE TeacherID = ?', [user.AssociatedID]);
      }
    }

    // Delete the user account
    await db.run('DELETE FROM Users WHERE UserID = ?', [userId]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
