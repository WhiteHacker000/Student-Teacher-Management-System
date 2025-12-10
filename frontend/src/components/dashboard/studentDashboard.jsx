import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';
import { mockStudents, mockCourses, mockAttendance, mockGrades } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Find current student data
  const currentStudent = mockStudents.find(s => s.email === user?.email);
  const studentAttendance = mockAttendance.filter(a => a.studentId === currentStudent?.studentId);
  const studentGrades = mockGrades.filter(g => g.studentId === currentStudent?.studentId);
  const enrolledCourses = mockCourses.filter(c => currentStudent?.enrolledCourses.includes(c.courseCode));

  const attendanceRate = studentAttendance.length > 0 
    ? Math.round((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100)
    : 0;

  const averageGrade = studentGrades.length > 0
    ? Math.round(studentGrades.reduce((sum, grade) => sum + grade.percentage, 0) / studentGrades.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">My Dashboard</h1>
          <p className="text-slate-400 text-lg">Track your academic progress</p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="mb-2 text-sm">
            Student ID: {currentStudent?.studentId}
          </Badge>
          <p className="text-sm text-slate-400">
            Enrolled: {new Date(currentStudent?.enrollmentDate || '').toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-gradient hover:scale-[1.02] transition-transform duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Current GPA</CardTitle>
            <div className="p-2 rounded-xl bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
              <Award className="h-5 w-5 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{currentStudent?.gpa}</div>
            <p className="text-xs text-slate-400 mt-1">
              Out of 4.0 scale
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient hover:scale-[1.02] transition-transform duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Enrolled Courses</CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{enrolledCourses.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {currentStudent?.totalCredits} total credits
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient hover:scale-[1.02] transition-transform duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Attendance Rate</CardTitle>
            <div className="p-2 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
              <Calendar className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{attendanceRate}%</div>
            <p className="text-xs text-slate-400 mt-1">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient hover:scale-[1.02] transition-transform duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Average Grade</CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{averageGrade}%</div>
            <p className="text-xs text-slate-400 mt-1">
              Across all courses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card className="card-gradient group hover:shadow-neon transition-all duration-300">
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <BookOpen className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-purple-100">My Courses</span>
            </CardTitle>
            <CardDescription>
              Your enrolled courses this semester
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                  </div>
                  <Badge variant="outline" className="status-present">
                    {course.credits} credits
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Instructor: {course.instructor}
                </p>
                <p className="text-xs text-muted-foreground">{course.schedule}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View Course Details
            </Button>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Recent Grades
            </CardTitle>
            <CardDescription>
              Your latest assignment scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentGrades.map((grade) => (
              <div key={grade.id} className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{grade.assignment}</h4>
                    <p className="text-sm text-muted-foreground">{grade.courseName}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      grade.percentage >= 90 ? 'grade-excellent' :
                      grade.percentage >= 80 ? 'grade-good' :
                      grade.percentage >= 70 ? 'grade-average' : 'grade-poor'
                    }
                  >
                    {grade.letterGrade}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={grade.percentage} className="flex-1" />
                  <span className="text-sm font-medium">{grade.percentage}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {grade.score}/{grade.maxScore} points • {new Date(grade.date).toLocaleDateString()}
                </p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Grades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently accessed features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <span>Check Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Award className="h-6 w-6 text-primary" />
              <span>View Grades</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Clock className="h-6 w-6 text-accent" />
              <span>Class Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
