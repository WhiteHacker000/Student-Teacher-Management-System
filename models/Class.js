import { getPool } from '../config/database.js';

export class Class {
  constructor(classData) {
    this.ClassId = classData.ClassId;
    this.ClassName = classData.ClassName;
    this.TeacherID = classData.TeacherID;
    this.RoomNumber = classData.RoomNumber;
    this.Schedule = classData.Schedule;
  }

  // Create a new class
  static async create(classData) {
    const pool = await getPool();
    const { ClassName, TeacherID, RoomNumber, Schedule } = classData;
    
    const [result] = await pool.execute(
      'INSERT INTO Classes (ClassName, TeacherID, RoomNumber, Schedule) VALUES (?, ?, ?, ?)',
      [ClassName, TeacherID, RoomNumber, Schedule]
    );
    
    return result.insertId;
  }

  // Find class by ID
  static async findById(classId) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Classes WHERE ClassId = ?',
      [classId]
    );
    return rows.length > 0 ? new Class(rows[0]) : null;
  }

  // Get all classes
  static async findAll() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT c.*, t.FirstName as TeacherFirstName, t.LastName as TeacherLastName
      FROM Classes c
      LEFT JOIN Teachers t ON c.TeacherID = t.TeacherID
      ORDER BY c.ClassName
    `);
    return rows.map(row => new Class(row));
  }

  // Get classes by teacher
  static async findByTeacher(teacherId) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Classes WHERE TeacherID = ? ORDER BY ClassName',
      [teacherId]
    );
    return rows.map(row => new Class(row));
  }

  // Get class with teacher info
  async getWithTeacher() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT c.*, t.FirstName as TeacherFirstName, t.LastName as TeacherLastName, t.Email as TeacherEmail
      FROM Classes c
      LEFT JOIN Teachers t ON c.TeacherID = t.TeacherID
      WHERE c.ClassId = ?
    `, [this.ClassId]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Get enrolled students
  async getEnrolledStudents() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT s.*, e.EnrollmentDate, e.Grade
      FROM Students s
      JOIN Enrollments e ON s.StudentID = e.StudentID
      WHERE e.ClassID = ?
      ORDER BY s.FirstName, s.LastName
    `, [this.ClassId]);
    return rows;
  }

  // Get class assignments
  async getAssignments() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT a.*, t.FirstName as TeacherFirstName, t.LastName as TeacherLastName
      FROM Assignments a
      LEFT JOIN Teachers t ON a.TeacherID = t.TeacherID
      WHERE a.ClassID = ?
      ORDER BY a.DueDate DESC
    `, [this.ClassId]);
    return rows;
  }

  // Get class attendance
  async getAttendance(date = null) {
    const pool = await getPool();
    let query = `
      SELECT a.*, s.FirstName, s.LastName
      FROM Attendance a
      JOIN Students s ON a.StudentID = s.StudentID
      WHERE a.ClassID = ?
    `;
    const params = [this.ClassId];
    
    if (date) {
      query += ' AND a.Date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY a.Date DESC, s.FirstName';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get attendance summary
  async getAttendanceSummary() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT 
        s.StudentID,
        s.FirstName,
        s.LastName,
        COUNT(CASE WHEN a.Status = 'Present' THEN 1 END) as PresentCount,
        COUNT(CASE WHEN a.Status = 'Absent' THEN 1 END) as AbsentCount,
        COUNT(CASE WHEN a.Status = 'Late' THEN 1 END) as LateCount,
        COUNT(*) as TotalDays
      FROM Students s
      JOIN Enrollments e ON s.StudentID = e.StudentID
      LEFT JOIN Attendance a ON s.StudentID = a.StudentID AND a.ClassID = ?
      WHERE e.ClassID = ?
      GROUP BY s.StudentID, s.FirstName, s.LastName
      ORDER BY s.FirstName, s.LastName
    `, [this.ClassId, this.ClassId]);
    return rows;
  }

  // Update class
  async update(updateData) {
    const pool = await getPool();
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length > 0) {
      values.push(this.ClassId);
      await pool.execute(
        `UPDATE Classes SET ${fields.join(', ')} WHERE ClassId = ?`,
        values
      );
    }
  }
}
