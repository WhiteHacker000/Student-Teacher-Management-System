import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery, executeQuerySingle } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'student', phone, address, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await executeQuerySingle(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate student/teacher ID
    const prefix = role === 'teacher' ? 'T' : 'S';
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const generatedId = `${prefix}${timestamp}${randomNum}`;

    // Insert user
    const query = `
      INSERT INTO users (
        name, email, password_hash, role, phone, address, date_of_birth,
        ${role === 'teacher' ? 'teacher_id' : 'student_id'}
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      name, email, passwordHash, role, phone || null, 
      address || null, dateOfBirth || null, generatedId
    ]);

    // Fetch created user
    const newUser = await executeQuerySingle(
      'SELECT id, name, email, role, student_id, teacher_id, phone, address FROM users WHERE id = ?',
      [result.insertId]
    );

    // Generate token
    const token = generateToken(newUser);

    logger.info(`✅ New user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          studentId: newUser.student_id,
          teacherId: newUser.teacher_id,
          phone: newUser.phone,
          address: newUser.address
        },
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await executeQuerySingle(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user);

    logger.info(`✅ User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.student_id,
          teacherId: user.teacher_id,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await executeQuerySingle(
      'SELECT id, name, email, role, student_id, teacher_id, phone, address, date_of_birth, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.student_id,
        teacherId: user.teacher_id,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.date_of_birth,
        avatar: user.avatar,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth, avatar } = req.body;
    
    const query = `
      UPDATE users 
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          date_of_birth = COALESCE(?, date_of_birth),
          avatar = COALESCE(?, avatar),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(query, [
      name || null, phone || null, address || null, 
      dateOfBirth || null, avatar || null, req.user.id
    ]);

    // Fetch updated user
    const updatedUser = await executeQuerySingle(
      'SELECT id, name, email, role, student_id, teacher_id, phone, address, date_of_birth, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    logger.info(`✅ Profile updated for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studentId: updatedUser.student_id,
        teacherId: updatedUser.teacher_id,
        phone: updatedUser.phone,
        address: updatedUser.address,
        dateOfBirth: updatedUser.date_of_birth,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await executeQuerySingle(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await executeQuery(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    logger.info(`✅ Password changed for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
