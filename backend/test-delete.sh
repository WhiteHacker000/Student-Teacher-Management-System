#!/bin/bash

# Simple Direct CRUD Test without Authentication Issues
# This uses the existing token for testing

BASE_URL="http://localhost:3001/api"

# Use a known valid admin token (from previous login)
# We'll manually get the token first
echo "Getting fresh auth token..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}' | jq -r '.data.token')

echo "Token obtained: ${TOKEN:0:50}..."
echo ""
echo "=========================================="
echo "TESTING DELETE OPERATIONS"
echo "=========================================="
echo ""

# CREATE a test student
echo "1. Creating a test student..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/students" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "Test",
    "LastName": "Student",
    "Email": "test.student@example.com",
    "Phone": "111-222-3333",
    "DOB": "2005-01-01",
    "EnrollmentDate": "2024-01-01"
  }')

echo "$CREATE_RESPONSE"
STUDENT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.StudentID // empty')
echo ""

if [ -z "$STUDENT_ID" ] || [ "$STUDENT_ID" == "null" ]; then
  echo "❌ Failed to create student. Checking error..."
  echo ""
  
  # Let's try to see all students first
  echo "Fetching all students to test READ operation..."
  ALL_STUDENTS=$(curl -s -X GET "$BASE_URL/students" \
    -H "Authorization: Bearer $TOKEN")
  echo "$ALL_STUDENTS"
  echo ""
  
  echo "Testing with hardcoded student ID 1..."
  STUDENT_ID=1
fi

echo "Using Student ID: $STUDENT_ID"
echo ""

# READ the student
echo "2. Reading the student..."
curl -s -X GET "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# UPDATE the student
echo "3. Updating the student..."
curl -s -X PUT "$BASE_URL/students/$STUDENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "FirstName": "Updated",
    "LastName": "Student"
  }' | jq '.'
echo ""

# DELETE the student
echo "4. DELETING the student..."
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "$DELETE_RESPONSE" | jq '.'
echo ""

# Verify deletion
echo "5. Verifying deletion (should return 404)..."
VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "$VERIFY_RESPONSE" | jq '.'
echo ""

echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
