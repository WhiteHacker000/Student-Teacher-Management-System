import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export const getDb = async () => {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, '..', '..', 'database', 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await createTables();
  }
  return db;
};

async function createTables() {
  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT UNIQUE NOT NULL,
      PasswordHash TEXT NOT NULL,
      Role TEXT CHECK(Role IN ('student', 'teacher', 'admin')) NOT NULL,
      AssociatedID INTEGER,
      CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      LastLogin DATETIME
    )
  `);

  // Create Students table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Students (
      StudentID INTEGER PRIMARY KEY AUTOINCREMENT,
      FirstName TEXT,
      LastName TEXT,
      Email TEXT UNIQUE,
      Phone TEXT,
      DOB DATE,
      EnrollmentDate DATE,
      ClassID INTEGER
    )
  `);

  // Create Teachers table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Teachers (
      TeacherID INTEGER PRIMARY KEY AUTOINCREMENT,
      FirstName TEXT,
      LastName TEXT,
      Email TEXT UNIQUE,
      Phone TEXT,
      HireDate DATE,
      DepartmentID INTEGER
    )
  `);

  // Create Classes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Classes (
      ClassId INTEGER PRIMARY KEY AUTOINCREMENT,
      ClassName TEXT,
      TeacherID INTEGER,
      RoomNumber TEXT,
      Schedule TEXT
    )
  `);

  // Create sample data
  await createSampleData();
}

async function createSampleData() {
  // Check if users already exist
  const userCount = await db.get('SELECT COUNT(*) as count FROM Users');

  if (userCount.count === 0) {
    // Create sample teacher
    const teacherPassword = await bcrypt.hash('password123', 10);
    await db.run(`
      INSERT INTO Teachers (FirstName, LastName, Email, Phone, HireDate)
      VALUES ('John', 'Smith', 'john@school.edu', '1234567890', '2023-01-01')
    `);

    const teacherResult = await db.get('SELECT TeacherID FROM Teachers WHERE Email = ?', ['john@school.edu']);

    await db.run(`
      INSERT INTO Users (Username, PasswordHash, Role, AssociatedID)
      VALUES ('teacher1', ?, 'teacher', ?)
    `, [teacherPassword, teacherResult.TeacherID]);

    // Create sample student
    const studentPassword = await bcrypt.hash('password123', 10);
    await db.run(`
      INSERT INTO Students (FirstName, LastName, Email, Phone, DOB, EnrollmentDate)
      VALUES ('Alice', 'Johnson', 'alice@student.edu', '0987654321', '2005-01-01', '2023-09-01')
    `);

    const studentResult = await db.get('SELECT StudentID FROM Students WHERE Email = ?', ['alice@student.edu']);

    await db.run(`
      INSERT INTO Users (Username, PasswordHash, Role, AssociatedID)
      VALUES ('student1', ?, 'student', ?)
    `, [studentPassword, studentResult.StudentID]);

    console.log('✅ Sample data created successfully');
  }
}

export default db;
