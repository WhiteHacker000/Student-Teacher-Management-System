import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, TrendingUp, UserPlus, Plus } from 'lucide-react';
import { mockStudents, mockCourses, mockAttendance } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeacherDashboard = () => {
  const totalStudents = mockStudents.length;
  const activeCourses = mockCourses.filter(c => c.status === 'active').length;
  const todayAttendance = mockAttendance.filter(a => a.date === '2024-01-15').length;
  const attendanceRate = Math.round((mockAttendance.filter(a => a.status === 'present').length / mockAttendance.length) * 100);

  const recentStudents = mockStudents.slice(0, 3);
  const upcomingClasses = mockCourses.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your classes and students</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+1</span> new this semester
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{todayAttendance}</div>
            <p className="text-xs text-muted-foreground">
              Records marked today
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+5%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Students
            </CardTitle>
            <CardDescription>
              Newly enrolled students this semester
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    GPA: {student.gpa}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {student.enrolledCourses.length} courses
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Students
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Today's Classes
            </CardTitle>
            <CardDescription>
              Your scheduled classes for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={course.status === 'active' ? 'status-present' : ''}
                  >
                    {course.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{course.schedule}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {course.enrolledStudents}/{course.maxStudents} students
                  </span>
                  <Button size="sm" variant="outline">
                    Take Attendance
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
