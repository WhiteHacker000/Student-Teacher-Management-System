# Delete Operations API Documentation

## Overview

This document describes the DELETE operations that have been added to complete the CRUD functionality for Students and Teachers in the Student-Teacher Management System.

## Authentication Required

All DELETE operations require:
- **Authentication**: Valid JWT token in the Authorization header
- **Authorization**: Admin role required for deletion operations

### Authorization Header Format
```
Authorization: Bearer <your_jwt_token>
```

---

## Student DELETE Operation

### Endpoint
```
DELETE /api/students/:id
```

### Description
Deletes a student record from the database. Only administrators can delete students.

### Parameters
- **id** (path parameter) - The Student ID to delete

### Request Example
```bash
curl -X DELETE "http://localhost:3001/api/students/123" \
  -H "Authorization: Bearer <your_token>"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

### Error Responses

#### Student Not Found (404)
```json
{
  "success": false,
  "message": "Student not found"
}
```

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

#### Forbidden (403)
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Teacher DELETE Operation

### Endpoint
```
DELETE /api/teachers/:id
```

### Description
Deletes a teacher record from the database. Only administrators can delete teachers.

### Parameters
- **id** (path parameter) - The Teacher ID to delete

### Request Example
```bash
curl -X DELETE "http://localhost:3001/api/teachers/456" \
  -H "Authorization: Bearer <your_token>"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Teacher deleted successfully"
}
```

### Error Responses

#### Teacher Not Found (404)
```json
{
  "success": false,
  "message": "Teacher not found"
}
```

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

#### Forbidden (403)
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Complete CRUD Operations Summary

### Students

| Operation | Method | Endpoint | Description | Auth Required | Admin Only |
|-----------|--------|----------|-------------|---------------|------------|
| **Create** | POST | `/api/students` | Create a new student | ✅ | ✅ |
| **Read All** | GET | `/api/students` | Get all students | ✅ | ❌ |
| **Read One** | GET | `/api/students/:id` | Get student by ID | ✅ | ❌ |
| **Update** | PUT | `/api/students/:id` | Update student info | ✅ | ❌ |
| **Delete** | DELETE | `/api/students/:id` | Delete a student | ✅ | ✅ |

### Teachers

| Operation | Method | Endpoint | Description | Auth Required | Admin Only |
|-----------|--------|----------|-------------|---------------|------------|
| **Create** | POST | `/api/teachers` | Create a new teacher | ✅ | ✅ |
| **Read All** | GET | `/api/teachers` | Get all teachers | ✅ | ✅ |
| **Read One** | GET | `/api/teachers/:id` | Get teacher by ID | ✅ | ❌ |
| **Update** | PUT | `/api/teachers/:id` | Update teacher info | ✅ | ❌ |
| **Delete** | DELETE | `/api/teachers/:id` | Delete a teacher | ✅ | ✅ |

---

## Usage Example

### Complete Workflow: Create, Read, Update, Delete a Student

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}' \
  | jq -r '.data.token')

# 2. CREATE - Add a new student
curl -X POST "http://localhost:3001/api/students" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john.doe@student.com",
    "Phone": "123-456-7890",
    "DOB": "2005-05-15",
    "EnrollmentDate": "2024-01-15"
  }'

# 3. READ - Get all students
curl -X GET "http://localhost:3001/api/students" \
  -H "Authorization: Bearer $TOKEN"

# 4. READ - Get specific student (ID: 1)
curl -X GET "http://localhost:3001/api/students/1" \
  -H "Authorization: Bearer $TOKEN"

# 5. UPDATE - Update student information
curl -X PUT "http://localhost:3001/api/students/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "John",
    "LastName": "Doe Updated",
    "Email": "john.doe.updated@student.com"
  }'

# 6. DELETE - Remove the student
curl -X DELETE "http://localhost:3001/api/students/1" \
  -H "Authorization: Bearer $TOKEN"

# 7. VERIFY - Try to get deleted student (should return 404)
curl -X GET "http://localhost:3001/api/students/1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Implementation Details

### Model Layer
Both `Student.js` and `Teacher.js` models now include a `delete()` method:

```javascript
// Delete student/teacher
async delete() {
  const pool = await getPool();
  await pool.execute(
    'DELETE FROM Students WHERE StudentID = ?',  // or Teachers
    [this.StudentID]  // or this.TeacherID
  );
}
```

### Controller Layer
Both controllers include delete functions with:
- ID validation
- Existence checking
- Error handling
- Success/failure responses

### Route Layer
Routes are protected with:
- `authenticateToken` middleware - Validates JWT
- `authorize('admin')` middleware - Ensures admin role

---

## Security Considerations

1. **Admin-Only Access**: DELETE operations are restricted to admin users only
2. **Token Validation**: All requests must include a valid JWT token
3. **Resource Verification**: Checks if the resource exists before attempting deletion
4. **Error Handling**: Comprehensive error handling prevents information leakage

---

## Notes

- Deleting a student/teacher will remove the record from the database
- Consider implementing soft deletes (marking as inactive) instead of hard deletes for data retention
- Ensure cascade delete rules are properly configured in your database for related records
- Always backup data before performing delete operations in production
