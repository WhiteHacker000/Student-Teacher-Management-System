# CRUD Operations Quick Reference

## Student Operations

### Create Student
```bash
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "Phone": "123-456-7890",
  "DOB": "2005-01-01",
  "EnrollmentDate": "2024-01-01"
}
```

### Read All Students
```bash
GET /api/students
Authorization: Bearer <token>
```

### Read One Student
```bash
GET /api/students/:id
Authorization: Bearer <token>
```

### Update Student
```bash
PUT /api/students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "FirstName": "Jane",
  "LastName": "Doe",
  "Email": "jane@example.com"
}
```

### Delete Student ⭐ NEW
```bash
DELETE /api/students/:id
Authorization: Bearer <token>
Requires: Admin role
```

---

## Teacher Operations

### Create Teacher
```bash
POST /api/teachers
Authorization: Bearer <token>
Content-Type: application/json

{
  "FirstName": "Jane",
  "LastName": "Smith",
  "Email": "jane.smith@example.com",
  "Phone": "555-123-4567",
  "HireDate": "2023-08-01"
}
```

### Read All Teachers
```bash
GET /api/teachers
Authorization: Bearer <token>
```

### Read One Teacher
```bash
GET /api/teachers/:id
Authorization: Bearer <token>
```

### Update Teacher
```bash
PUT /api/teachers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "FirstName": "Jane",
  "LastName": "Smith Updated",
  "Email": "jane.updated@example.com"
}
```

### Delete Teacher ⭐ NEW
```bash
DELETE /api/teachers/:id
Authorization: Bearer <token>
Requires: Admin role
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Authorization

- All operations require JWT authentication
- DELETE operations require admin role
- Token format: `Bearer <your_jwt_token>`

## Files Modified

- ✅ `models/Student.js` - Added delete() method
- ✅ `models/Teacher.js` - Added update() and delete() methods
- ✅ `controllers/studentController.js` - Added deleteStudent()
- ✅ `controllers/teacherController.js` - Added deleteTeacher()
- ✅ `server.js` - Added DELETE routes
