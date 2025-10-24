import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Import controllers
import * as authController from './controllers/authController.js';
import * as studentController from './controllers/studentController.js';
import * as teacherController from './controllers/teacherController.js';

// Import middleware
import { authenticateToken, authorize } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
testConnection().then(connected => {
  if (connected) {
    console.log('✅ Database connection successful');
  } else {
    console.log('❌ Database connection failed');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', authenticateToken, authController.getProfile);
app.put('/api/auth/profile', authenticateToken, authController.updateProfile);

// Student routes
app.get('/api/students', authenticateToken, authorize('admin', 'teacher'), studentController.getAllStudents);
app.get('/api/students/:id', authenticateToken, studentController.getStudentById);
app.post('/api/students', authenticateToken, authorize('admin'), studentController.createStudent);
app.put('/api/students/:id', authenticateToken, studentController.updateStudent);
app.get('/api/students/:id/classes', authenticateToken, studentController.getStudentClasses);
app.get('/api/students/:id/assignments', authenticateToken, studentController.getStudentAssignments);
app.get('/api/students/:id/attendance', authenticateToken, studentController.getStudentAttendance);
app.get('/api/students/:id/grades', authenticateToken, studentController.getStudentGrades);
app.get('/api/students/:id/dashboard', authenticateToken, studentController.getStudentDashboard);

// Teacher routes
app.get('/api/teachers', authenticateToken, authorize('admin'), teacherController.getAllTeachers);
app.get('/api/teachers/:id', authenticateToken, teacherController.getTeacherById);
app.post('/api/teachers', authenticateToken, authorize('admin'), teacherController.createTeacher);
app.put('/api/teachers/:id', authenticateToken, teacherController.updateTeacher);
app.get('/api/teachers/:id/classes', authenticateToken, teacherController.getTeacherClasses);
app.get('/api/teachers/:id/students', authenticateToken, teacherController.getTeacherStudents);
app.get('/api/teachers/:id/assignments', authenticateToken, teacherController.getTeacherAssignments);
app.get('/api/teachers/:id/classes/:classId/students', authenticateToken, teacherController.getStudentsInClass);
app.get('/api/teachers/:id/classes/:classId/attendance', authenticateToken, teacherController.getClassAttendance);
app.get('/api/teachers/:id/dashboard', authenticateToken, teacherController.getTeacherDashboard);

// Class routes (basic CRUD)
app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    const { Class } = await import('./models/Class.js');
    const classes = await Class.findAll();
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

app.get('/api/classes/:id', authenticateToken, async (req, res) => {
  try {
    const { Class } = await import('./models/Class.js');
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    const classWithTeacher = await classData.getWithTeacher();
    res.json({
      success: true,
      data: classWithTeacher
    });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Assignment routes
app.get('/api/assignments', authenticateToken, async (req, res) => {
  try {
    const { getPool } = await import('./config/database.js');
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT a.*, c.ClassName, t.FirstName as TeacherFirstName, t.LastName as TeacherLastName
      FROM Assignments a
      LEFT JOIN Classes c ON a.ClassID = c.ClassId
      LEFT JOIN Teachers t ON a.TeacherID = t.TeacherID
      ORDER BY a.DueDate DESC
    `);
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Attendance routes
app.get('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { getPool } = await import('./config/database.js');
    const pool = await getPool();
    const { classId, date, studentId } = req.query;
    
    let query = `
      SELECT a.*, s.FirstName, s.LastName, c.ClassName
      FROM Attendance a
      JOIN Students s ON a.StudentID = s.StudentID
      JOIN Classes c ON a.ClassID = c.ClassId
      WHERE 1=1
    `;
    const params = [];
    
    if (classId) {
      query += ' AND a.ClassID = ?';
      params.push(classId);
    }
    if (date) {
      query += ' AND a.Date = ?';
      params.push(date);
    }
    if (studentId) {
      query += ' AND a.StudentID = ?';
      params.push(studentId);
    }
    
    query += ' ORDER BY a.Date DESC, s.FirstName';
    
    const [rows] = await pool.execute(query, params);
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.MYSQL_DATABASE || 'student_management_system'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});


