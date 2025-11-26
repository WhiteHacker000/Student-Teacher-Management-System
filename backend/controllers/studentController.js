import { Student } from '../models/Student.js';
import { Class } from '../models/Class.js';
import { getPool } from '../config/database.js';

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get student's classes
export const getStudentClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const classes = await student.getClasses();
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Get student classes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get student's assignments
export const getStudentAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const assignments = await student.getAssignments();
    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get student's attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.query;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const attendance = await student.getAttendance(classId);
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get student's grades
export const getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const grades = await student.getGrades();
    res.json({
      success: true,
      data: grades
    });
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Phone, DOB, EnrollmentDate, ClassID } = req.body;

    if (!FirstName || !LastName || !Email) {
      return res.status(400).json({ 
        success: false, 
        message: 'First name, last name, and email are required' 
      });
    }

    const studentId = await Student.create({
      FirstName,
      LastName,
      Email,
      Phone,
      DOB,
      EnrollmentDate: EnrollmentDate || new Date(),
      ClassID
    });

    const student = await Student.findById(studentId);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const { FirstName, LastName, Email, Phone, DOB, ClassID } = req.body;
    await student.update({
      FirstName,
      LastName,
      Email,
      Phone,
      DOB,
      ClassID
    });

    const updatedStudent = await Student.findById(id);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get student dashboard data
export const getStudentDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const [classes, assignments, attendance, grades] = await Promise.all([
      student.getClasses(),
      student.getAssignments(),
      student.getAttendance(),
      student.getGrades()
    ]);

    // Get recent assignments (next 7 days)
    const recentAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.DueDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= weekFromNow;
    });

    // Calculate attendance percentage
    const attendanceStats = attendance.reduce((stats, record) => {
      stats.total++;
      if (record.Status === 'Present') stats.present++;
      else if (record.Status === 'Late') stats.late++;
      else stats.absent++;
      return stats;
    }, { total: 0, present: 0, late: 0, absent: 0 });

    const attendancePercentage = attendanceStats.total > 0 
      ? ((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        student,
        classes,
        recentAssignments,
        attendance: {
          stats: attendanceStats,
          percentage: Math.round(attendancePercentage)
        },
        grades: grades.slice(0, 10) // Recent 10 grades
      }
    });
  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
