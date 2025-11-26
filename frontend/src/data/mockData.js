// Mock data
export const mockStudents = [
  {
    id: '1',
    studentId: 'S001',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    enrolledCourses: ['CS101', 'MATH201', 'PHYS101'],
    totalCredits: 18,
    gpa: 3.8,
    status: 'active',
    enrollmentDate: '2023-08-15'
  },
  {
    id: '2',
    studentId: 'S002',
    name: 'Bob Wilson',
    email: 'bob@student.edu',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
    enrolledCourses: ['CS101', 'MATH201'],
    totalCredits: 12,
    gpa: 3.5,
    status: 'active',
    enrollmentDate: '2023-08-15'
  },
  {
    id: '3',
    studentId: 'S003',
    name: 'Carol Davis',
    email: 'carol@student.edu',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    enrolledCourses: ['MATH201', 'PHYS101', 'CHEM101'],
    totalCredits: 18,
    gpa: 3.9,
    status: 'active',
    enrollmentDate: '2023-08-15'
  },
  {
    id: '4',
    studentId: 'S004',
    name: 'David Miller',
    email: 'david@student.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    enrolledCourses: ['CS101', 'PHYS101'],
    totalCredits: 12,
    gpa: 3.2,
    status: 'active',
    enrollmentDate: '2023-08-15'
  }
];

export const mockCourses = [
  {
    id: '1',
    courseCode: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Fundamentals of programming and computer science concepts',
    credits: 3,
    instructor: 'Dr. Smith',
    schedule: 'MWF 10:00-11:00 AM',
    enrolledStudents: 25,
    maxStudents: 30,
    status: 'active'
  },
  {
    id: '2',
    courseCode: 'MATH201',
    name: 'Calculus II',
    description: 'Advanced calculus including integration techniques and series',
    credits: 4,
    instructor: 'Prof. Johnson',
    schedule: 'TTh 2:00-3:30 PM',
    enrolledStudents: 20,
    maxStudents: 25,
    status: 'active'
  },
  {
    id: '3',
    courseCode: 'PHYS101',
    name: 'General Physics I',
    description: 'Classical mechanics and thermodynamics',
    credits: 4,
    instructor: 'Dr. Wilson',
    schedule: 'MWF 1:00-2:00 PM, Lab: Th 3:00-5:00 PM',
    enrolledStudents: 18,
    maxStudents: 20,
    status: 'active'
  },
  {
    id: '4',
    courseCode: 'CHEM101',
    name: 'General Chemistry',
    description: 'Introduction to chemical principles and reactions',
    credits: 4,
    instructor: 'Dr. Brown',
    schedule: 'TTh 9:00-10:30 AM, Lab: F 2:00-5:00 PM',
    enrolledStudents: 15,
    maxStudents: 20,
    status: 'active'
  }
];

export const mockAttendance = [
  {
    id: '1',
    studentId: 'S001',
    studentName: 'Alice Johnson',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    date: '2024-01-15',
    status: 'present'
  },
  {
    id: '2',
    studentId: 'S002',
    studentName: 'Bob Wilson',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    date: '2024-01-15',
    status: 'late'
  },
  {
    id: '3',
    studentId: 'S003',
    studentName: 'Carol Davis',
    courseId: 'MATH201',
    courseName: 'Calculus II',
    date: '2024-01-15',
    status: 'present'
  },
  {
    id: '4',
    studentId: 'S004',
    studentName: 'David Miller',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    date: '2024-01-15',
    status: 'absent'
  }
];

export const mockGrades = [
  {
    id: '1',
    studentId: 'S001',
    studentName: 'Alice Johnson',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    assignment: 'Midterm Exam',
    score: 88,
    maxScore: 100,
    percentage: 88,
    letterGrade: 'B+',
    date: '2024-01-10'
  },
  {
    id: '2',
    studentId: 'S001',
    studentName: 'Alice Johnson',
    courseId: 'MATH201',
    courseName: 'Calculus II',
    assignment: 'Quiz 1',
    score: 95,
    maxScore: 100,
    percentage: 95,
    letterGrade: 'A',
    date: '2024-01-08'
  },
  {
    id: '3',
    studentId: 'S002',
    studentName: 'Bob Wilson',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    assignment: 'Midterm Exam',
    score: 76,
    maxScore: 100,
    percentage: 76,
    letterGrade: 'B-',
    date: '2024-01-10'
  },
  {
    id: '4',
    studentId: 'S003',
    studentName: 'Carol Davis',
    courseId: 'MATH201',
    courseName: 'Calculus II',
    assignment: 'Quiz 1',
    score: 98,
    maxScore: 100,
    percentage: 98,
    letterGrade: 'A+',
    date: '2024-01-08'
  }
];
