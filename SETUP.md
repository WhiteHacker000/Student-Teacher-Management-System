# Student Management System - Setup Guide

## Database Setup

### 1. Create Database
First, create your MySQL database:

```sql
CREATE DATABASE student_management_system;
USE student_management_system;
```

### 2. Run Database Schema
Execute the SQL commands from your existing schema or use the provided schema.sql file:

```sql
-- Your existing schema (already provided)
USE student_management_system;
CREATE TABLE Users(
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE,
    PasswordHash VARCHAR(255),
    Role ENUM('student','teacher','admin'),
    AssociatedID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL
);

-- ... (rest of your existing tables)
```

### 3. Environment Configuration
Create a `.env` file in your project root:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=student_management_system

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
# Start only the backend server
npm run server

# Or start both frontend and backend
npm run dev:all
```

### 3. Test the API
Visit `http://localhost:3001/api/health` to test if the server is running.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Students
- `GET /api/students` - Get all students (admin/teacher only)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (admin only)
- `PUT /api/students/:id` - Update student
- `GET /api/students/:id/classes` - Get student's classes
- `GET /api/students/:id/assignments` - Get student's assignments
- `GET /api/students/:id/attendance` - Get student's attendance
- `GET /api/students/:id/grades` - Get student's grades
- `GET /api/students/:id/dashboard` - Get student dashboard data

### Teachers
- `GET /api/teachers` - Get all teachers (admin only)
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher (admin only)
- `PUT /api/teachers/:id` - Update teacher
- `GET /api/teachers/:id/classes` - Get teacher's classes
- `GET /api/teachers/:id/students` - Get teacher's students
- `GET /api/teachers/:id/assignments` - Get teacher's assignments
- `GET /api/teachers/:id/classes/:classId/students` - Get students in specific class
- `GET /api/teachers/:id/classes/:classId/attendance` - Get class attendance
- `GET /api/teachers/:id/dashboard` - Get teacher dashboard data

### Classes & Attendance
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `GET /api/assignments` - Get all assignments
- `GET /api/attendance` - Get attendance records

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Frontend Integration

The frontend is already set up to work with the new API. The AuthContext will automatically use the new endpoints.

### Example API Usage

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'student1',
    password: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  // Use the token for subsequent requests
}

// Get student dashboard
const token = localStorage.getItem('token');
const dashboardResponse = await fetch('/api/students/1/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Database Models

The system includes the following models:
- **User** - Authentication and user management
- **Student** - Student information and academic data
- **Teacher** - Teacher information and class management
- **Class** - Class/course management
- **Assignment** - Assignment creation and management
- **Attendance** - Attendance tracking
- **Enrollment** - Student-class relationships

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- CORS protection
- Input validation
- SQL injection protection

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Check database credentials in `.env`
3. Verify database exists
4. Check firewall settings

### Authentication Issues
1. Verify JWT_SECRET is set
2. Check token expiration
3. Ensure proper Authorization header format

### CORS Issues
1. Update CORS_ORIGIN in `.env`
2. Check frontend URL matches CORS_ORIGIN
