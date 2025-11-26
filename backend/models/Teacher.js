import { getPool } from '../config/database.js';

export class Teacher {
  constructor(teacherData) {
    this.TeacherID = teacherData.TeacherID;
    this.FirstName = teacherData.FirstName;
    this.LastName = teacherData.LastName;
    this.Email = teacherData.Email;
    this.Phone = teacherData.Phone;
    this.HireDate = teacherData.HireDate;
    this.DepartmentID = teacherData.DepartmentID;
  }

  // Create a new teacher
  static async create(teacherData) {
    const pool = await getPool();
    const { FirstName, LastName, Email, Phone, HireDate, DepartmentID } = teacherData;
    
    const [result] = await pool.execute(
      'INSERT INTO Teachers (FirstName, LastName, Email, Phone, HireDate, DepartmentID) VALUES (?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, Email, Phone, HireDate, DepartmentID]
    );
    
    return result.insertId;
  }

  // Find teacher by ID
  static async findById(teacherId) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Teachers WHERE TeacherID = ?',
      [teacherId]
    );
    return rows.length > 0 ? new Teacher(rows[0]) : null;
  }

  // Find teacher by email
  static async findByEmail(email) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Teachers WHERE Email = ?',
      [email]
    );
    return rows.length > 0 ? new Teacher(rows[0]) : null;
  }

  // Get all teachers
  static async findAll() {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Teachers ORDER BY FirstName, LastName'
    );
    return rows.map(row => new Teacher(row));
  }

  // Get teacher's classes
  async getClasses() {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Classes WHERE TeacherID = ? ORDER BY ClassName',
      [this.TeacherID]
    );
    return rows;
  }

  // Get teacher's students
  async getStudents() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT DISTINCT s.*, c.ClassName
      FROM Students s
      JOIN Enrollments e ON s.StudentID = e.StudentID
      JOIN Classes c ON e.ClassID = c.ClassId
      WHERE c.TeacherID = ?
      ORDER BY s.FirstName, s.LastName
    `, [this.TeacherID]);
    return rows;
  }

  // Get teacher's assignments
  async getAssignments() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT a.*, c.ClassName
      FROM Assignments a
      JOIN Classes c ON a.ClassID = c.ClassId
      WHERE a.TeacherID = ?
      ORDER BY a.DueDate DESC
    `, [this.TeacherID]);
    return rows;
  }

  // Get students in a specific class
  async getStudentsInClass(classId) {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT s.*, e.EnrollmentDate, e.Grade
      FROM Students s
      JOIN Enrollments e ON s.StudentID = e.StudentID
      WHERE e.ClassID = ? AND e.ClassID IN (
        SELECT ClassId FROM Classes WHERE TeacherID = ?
      )
      ORDER BY s.FirstName, s.LastName
    `, [classId, this.TeacherID]);
    return rows;
  }

  // Get attendance for a class
  async getClassAttendance(classId, date = null) {
    const pool = await getPool();
    let query = `
      SELECT a.*, s.FirstName, s.LastName, c.ClassName
      FROM Attendance a
      JOIN Students s ON a.StudentID = s.StudentID
      JOIN Classes c ON a.ClassID = c.ClassId
      WHERE c.TeacherID = ? AND a.ClassID = ?
    `;
    const params = [this.TeacherID, classId];
    
    if (date) {
      query += ' AND a.Date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY a.Date DESC, s.FirstName';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get full name
  getFullName() {
    return `${this.FirstName} ${this.LastName}`;
  }
}
