import { Teacher } from '../models/Teacher.js';
import { Class } from '../models/Class.js';
import { getPool } from '../config/database.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json({
      success: true,
      data: teachers
    });
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Get teacher by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get teacher's classes
export const getTeacherClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const classes = await teacher.getClasses();
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Get teacher classes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get teacher's students
export const getTeacherStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const students = await teacher.getStudents();
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get students in a specific class
export const getStudentsInClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const students = await teacher.getStudentsInClass(classId);
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get students in class error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get teacher's assignments
export const getTeacherAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const assignments = await teacher.getAssignments();
    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Get teacher assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get class attendance
export const getClassAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.params;
    const { date } = req.query;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const attendance = await teacher.getClassAttendance(classId, date);
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Create new teacher
export const createTeacher = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Phone, HireDate, DepartmentID } = req.body;

    if (!FirstName || !LastName || !Email) {
      return res.status(400).json({ 
        success: false, 
        message: 'First name, last name, and email are required' 
      });
    }

    const teacherId = await Teacher.create({
      FirstName,
      LastName,
      Email,
      Phone,
      HireDate: HireDate || new Date(),
      DepartmentID
    });

    const teacher = await Teacher.findById(teacherId);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const { FirstName, LastName, Email, Phone, DepartmentID } = req.body;
    await teacher.update({
      FirstName,
      LastName,
      Email,
      Phone,
      DepartmentID
    });

    const updatedTeacher = await Teacher.findById(id);

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get teacher dashboard data
export const getTeacherDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    const [classes, students, assignments] = await Promise.all([
      teacher.getClasses(),
      teacher.getStudents(),
      teacher.getAssignments()
    ]);

    // Get recent assignments (next 7 days)
    const recentAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.DueDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= weekFromNow;
    });

    // Get attendance summary for all classes
    const pool = await getPool();
    const [attendanceStats] = await pool.execute(`
      SELECT 
        c.ClassId,
        c.ClassName,
        COUNT(a.AttendanceID) as TotalRecords,
        COUNT(CASE WHEN a.Status = 'Present' THEN 1 END) as PresentCount,
        COUNT(CASE WHEN a.Status = 'Absent' THEN 1 END) as AbsentCount,
        COUNT(CASE WHEN a.Status = 'Late' THEN 1 END) as LateCount
      FROM Classes c
      LEFT JOIN Attendance a ON c.ClassId = a.ClassID
      WHERE c.TeacherID = ?
      GROUP BY c.ClassId, c.ClassName
    `, [id]);

    res.json({
      success: true,
      data: {
        teacher,
        classes,
        students: students.length,
        recentAssignments,
        attendanceStats
      }
    });
  } catch (error) {
    console.error('Get teacher dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
