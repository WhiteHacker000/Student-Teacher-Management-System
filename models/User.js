import { getPool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  constructor(userData) {
    this.UserID = userData.UserID;
    this.Username = userData.Username;
    this.PasswordHash = userData.PasswordHash;
    this.Role = userData.Role;
    this.AssociatedID = userData.AssociatedID;
    this.CreatedAt = userData.CreatedAt;
    this.LastLogin = userData.LastLogin;
  }

  // Create a new user
  static async create(userData) {
    const pool = await getPool();
    const { Username, Password, Role, AssociatedID } = userData;
    
    // Hash the password
    const PasswordHash = await bcrypt.hash(Password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO Users (Username, PasswordHash, Role, AssociatedID) VALUES (?, ?, ?, ?)',
      [Username, PasswordHash, Role, AssociatedID]
    );
    
    return result.insertId;
  }

  // Find user by username
  static async findByUsername(username) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE Username = ?',
      [username]
    );
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Find user by ID
  static async findById(userId) {
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE UserID = ?',
      [userId]
    );
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.PasswordHash);
  }

  // Update last login
  async updateLastLogin() {
    const pool = await getPool();
    await pool.execute(
      'UPDATE Users SET LastLogin = CURRENT_TIMESTAMP WHERE UserID = ?',
      [this.UserID]
    );
  }

  // Get user profile with associated data
  async getProfile() {
    const pool = await getPool();
    let profile = {
      UserID: this.UserID,
      Username: this.Username,
      Role: this.Role,
      CreatedAt: this.CreatedAt,
      LastLogin: this.LastLogin
    };

    if (this.Role === 'student' && this.AssociatedID) {
      const [studentRows] = await pool.execute(
        'SELECT * FROM Students WHERE StudentID = ?',
        [this.AssociatedID]
      );
      if (studentRows.length > 0) {
        profile.StudentInfo = studentRows[0];
      }
    } else if (this.Role === 'teacher' && this.AssociatedID) {
      const [teacherRows] = await pool.execute(
        'SELECT * FROM Teachers WHERE TeacherID = ?',
        [this.AssociatedID]
      );
      if (teacherRows.length > 0) {
        profile.TeacherInfo = teacherRows[0];
      }
    }

    return profile;
  }

  // Get safe user data (without password)
  getSafeData() {
    return {
      UserID: this.UserID,
      Username: this.Username,
      Role: this.Role,
      AssociatedID: this.AssociatedID,
      CreatedAt: this.CreatedAt,
      LastLogin: this.LastLogin
    };
  }
}
