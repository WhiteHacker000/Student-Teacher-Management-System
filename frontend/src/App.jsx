import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import DashboardLayout from './components/layout/DashbordLayout.jsx';
import StudentDashboard from './components/dashboard/studentDashboard.jsx';
import TeacherDashboard from './components/dashboard/teacherDashboard.jsx';
import Students from './pages/Students.jsx';
import Courses from './pages/Courses.jsx';
import Attendance from './pages/Attendance.jsx';
import Settings from './pages/Settings.jsx';
import AssignmentsManage from './pages/Assignments.jsx';
import MyCourses from './pages/student/MyCourses.jsx';
import MyAttendance from './pages/student/MyAttendance.jsx';
import MyGrades from './pages/student/MyGrades.jsx';
import Timetable from './pages/student/Timetable.jsx';
import Assignments from './pages/student/Assignments.jsx';
import Feedback from './pages/student/Feedback.jsx';
import Messages from './pages/student/Messages.jsx';
import Notifications from './pages/student/Notifications.jsx';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-purple-400 mx-auto" />
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-purple-500/20 blur-xl animate-pulse mx-auto"></div>
          </div>
          <p className="mt-6 text-purple-200 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-purple-400 mx-auto" />
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-purple-500/20 blur-xl animate-pulse mx-auto"></div>
          </div>
          <p className="mt-6 text-purple-200 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  const isTeacher = user?.Role === 'teacher';
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={isTeacher ? <TeacherDashboard /> : <StudentDashboard />} />
        {isTeacher ? (
          <>
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<AssignmentsManage />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="settings" element={<Settings />} />
          </>
        ) : (
          <>
            <Route path="timetable" element={<Timetable />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="my-attendance" element={<MyAttendance />} />
            <Route path="my-grades" element={<MyGrades />} />
            <Route path="settings" element={<Settings />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterForm /></PublicOnlyRoute>} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}


