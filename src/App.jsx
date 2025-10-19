import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import DashboardLayout from './components/layout/DashbordLayout.jsx';
import StudentDashboard from './components/dashboard/studentDashboard.jsx';
import TeacherDashboard from './components/dashboard/teacherDashboard.jsx';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  const dashboard = user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
  return <DashboardLayout>{dashboard}</DashboardLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/dashboard"
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
  );
}


