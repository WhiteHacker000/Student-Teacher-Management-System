import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';

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

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, password, role, firstName, lastName, email, phone, dob, hireDate, departmentId, classId } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and role are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Create associated record based on role
    let associatedId = null;
    if (role === 'student') {
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'First name, last name, and email are required for students' 
        });
      }
      associatedId = await Student.create({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
        DOB: dob,
        EnrollmentDate: new Date(),
        ClassID: classId
      });
    } else if (role === 'teacher') {
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'First name, last name, and email are required for teachers' 
        });
      }
      associatedId = await Teacher.create({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
        HireDate: hireDate || new Date(),
        DepartmentID: departmentId
      });
    }

    // Create user account
    const userId = await User.create({
      Username: username,
      Password: password,
      Role: role,
      AssociatedID: associatedId
    });

    // Get the created user
    const user = await User.findById(userId);
    const token = generateToken(user);

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getSafeData(),
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

    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    await user.updateLastLogin();

    // Get user profile
    const profile = await user.getProfile();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getSafeData(),
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

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const profile = await user.getProfile();

    res.json({
      success: true,
      data: {
        user: user.getSafeData(),
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

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const { firstName, lastName, email, phone } = req.body;

    // Update associated record
    if (user.Role === 'student' && user.AssociatedID) {
      const student = await Student.findById(user.AssociatedID);
      if (student) {
        await student.update({ FirstName: firstName, LastName: lastName, Email: email, Phone: phone });
      }
    } else if (user.Role === 'teacher' && user.AssociatedID) {
      const teacher = await Teacher.findById(user.AssociatedID);
      if (teacher) {
        await teacher.update({ FirstName: firstName, LastName: lastName, Email: email, Phone: phone });
      }
    }

    const profile = await user.getProfile();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getSafeData(),
        profile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
