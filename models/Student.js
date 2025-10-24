import { getPool } from '../config/database.js';

export class Student {
  constructor(studentData) {
    this.StudentID = studentData.StudentID;
    this.FirstName = studentData.FirstName;
    this.LastName = studentData.LastName;
    this.Email = studentData.Email;
    this.Phone = studentData.Phone;
    this.DOB = studentData.DOB;
    this.EnrollmentDate = studentData.EnrollmentDate;
    this.ClassID = studentData.ClassID;
  }

  // Create a new student
  static async create(studentData) {
    const pool = await getPool();
    const { FirstName, LastName, Email, Phone, DOB, EnrollmentDate, ClassID } = studentData;
    
    const [result] = await pool.execute(
      'INSERT INTO Students (FirstName, LastName, Email, Phone, DOB, EnrollmentDate, ClassID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, Email, Phone, DOB, EnrollmentDate, ClassID]
    );
    
    return result.insertId;
  }

  // Find student by ID
  static async findById(studentId) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Students WHERE StudentID = ?',
      [studentId]
    );
    return rows.length > 0 ? new Student(rows[0]) : null;
  }

  // Find student by email
  static async findByEmail(email) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Students WHERE Email = ?',
      [email]
    );
    return rows.length > 0 ? new Student(rows[0]) : null;
  }

  // Get all students
  static async findAll() {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Students ORDER BY FirstName, LastName'
    );
    return rows.map(row => new Student(row));
  }

  // Get students by class
  static async findByClass(classId) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Students WHERE ClassID = ? ORDER BY FirstName, LastName',
      [classId]
    );
    return rows.map(row => new Student(row));
  }

  // Update student
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
      values.push(this.StudentID);
      await pool.execute(
        `UPDATE Students SET ${fields.join(', ')} WHERE StudentID = ?`,
        values
      );
    }
  }

  // Get student's classes
  async getClasses() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT c.*, e.EnrollmentDate, e.Grade
      FROM Classes c
      JOIN Enrollments e ON c.ClassId = e.ClassID
      WHERE e.StudentID = ?
      ORDER BY c.ClassName
    `, [this.StudentID]);
    return rows;
  }

  // Get student's assignments
  async getAssignments() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT a.*, c.ClassName, t.FirstName as TeacherFirstName, t.LastName as TeacherLastName
      FROM Assignments a
      JOIN Classes c ON a.ClassID = c.ClassId
      JOIN Teachers t ON a.TeacherID = t.TeacherID
      JOIN Enrollments e ON c.ClassId = e.ClassID
      WHERE e.StudentID = ?
      ORDER BY a.DueDate
    `, [this.StudentID]);
    return rows;
  }

  // Get student's attendance
  async getAttendance(classId = null) {
    const pool = await getPool();
    let query = `
      SELECT a.*, c.ClassName
      FROM Attendance a
      JOIN Classes c ON a.ClassID = c.ClassId
      WHERE a.StudentID = ?
    `;
    const params = [this.StudentID];
    
    if (classId) {
      query += ' AND a.ClassID = ?';
      params.push(classId);
    }
    
    query += ' ORDER BY a.Date DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get student's grades
  async getGrades() {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT s.*, a.Title as AssignmentTitle, c.ClassName
      FROM Submissions s
      JOIN Assignments a ON s.AssignmentID = a.AssignmentID
      JOIN Classes c ON a.ClassID = c.ClassId
      WHERE s.StudentID = ?
      ORDER BY s.SubmittedAt DESC
    `, [this.StudentID]);
    return rows;
  }

  // Get full name
  getFullName() {
    return `${this.FirstName} ${this.LastName}`;
  }
}
