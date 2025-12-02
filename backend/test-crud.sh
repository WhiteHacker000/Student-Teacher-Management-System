#!/bin/bash

# CRUD Operations Test Script
# This script demonstrates all CRUD operations for Students and Teachers

echo "========================================"
echo "Student-Teacher Management System"
echo "CRUD Operations Test"
echo "========================================"
echo ""

BASE_URL="http://localhost:3001/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# First, we need to register and login to get a token
echo -e "${BLUE}Step 1: Register Admin User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@test.com",
    "role": "admin"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
echo ""

echo -e "${BLUE}Step 2: Login to Get Token${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }')
echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo ""
echo "Access Token: $TOKEN"
echo ""

# Test Student CRUD Operations
echo "========================================"
echo "STUDENT CRUD OPERATIONS"
echo "========================================"
echo ""

# CREATE Student
echo -e "${GREEN}CREATE: Adding a new student${NC}"
CREATE_STUDENT=$(curl -s -X POST "$BASE_URL/students" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john.doe@student.com",
    "Phone": "123-456-7890",
    "DOB": "2005-05-15",
    "EnrollmentDate": "2024-01-15"
  }')
echo "$CREATE_STUDENT" | jq '.'
STUDENT_ID=$(echo "$CREATE_STUDENT" | jq -r '.data.StudentID')
echo ""
echo "Created Student ID: $STUDENT_ID"
echo ""

# READ All Students
echo -e "${GREEN}READ: Getting all students${NC}"
curl -s -X GET "$BASE_URL/students" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# READ Student by ID
echo -e "${GREEN}READ: Getting student by ID ($STUDENT_ID)${NC}"
curl -s -X GET "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# UPDATE Student
echo -e "${GREEN}UPDATE: Updating student information${NC}"
curl -s -X PUT "$BASE_URL/students/$STUDENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john.doe.updated@student.com",
    "Phone": "999-888-7777"
  }' | jq '.'
echo ""

# DELETE Student
echo -e "${RED}DELETE: Deleting student${NC}"
curl -s -X DELETE "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Verify deletion
echo -e "${BLUE}Verification: Trying to get deleted student (should return 404)${NC}"
curl -s -X GET "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test Teacher CRUD Operations
echo "========================================"
echo "TEACHER CRUD OPERATIONS"
echo "========================================"
echo ""

# CREATE Teacher
echo -e "${GREEN}CREATE: Adding a new teacher${NC}"
CREATE_TEACHER=$(curl -s -X POST "$BASE_URL/teachers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "Jane",
    "LastName": "Smith",
    "Email": "jane.smith@teacher.com",
    "Phone": "555-123-4567",
    "HireDate": "2023-08-01"
  }')
echo "$CREATE_TEACHER" | jq '.'
TEACHER_ID=$(echo "$CREATE_TEACHER" | jq -r '.data.TeacherID')
echo ""
echo "Created Teacher ID: $TEACHER_ID"
echo ""

# READ All Teachers
echo -e "${GREEN}READ: Getting all teachers${NC}"
curl -s -X GET "$BASE_URL/teachers" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# READ Teacher by ID
echo -e "${GREEN}READ: Getting teacher by ID ($TEACHER_ID)${NC}"
curl -s -X GET "$BASE_URL/teachers/$TEACHER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# UPDATE Teacher
echo -e "${GREEN}UPDATE: Updating teacher information${NC}"
curl -s -X PUT "$BASE_URL/teachers/$TEACHER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "Jane",
    "LastName": "Smith",
    "Email": "jane.smith.updated@teacher.com",
    "Phone": "777-999-8888"
  }' | jq '.'
echo ""

# DELETE Teacher
echo -e "${RED}DELETE: Deleting teacher${NC}"
curl -s -X DELETE "$BASE_URL/teachers/$TEACHER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Verify deletion
echo -e "${BLUE}Verification: Trying to get deleted teacher (should return 404)${NC}"
curl -s -X GET "$BASE_URL/teachers/$TEACHER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "========================================"
echo "CRUD Tests Completed!"
echo "========================================"
