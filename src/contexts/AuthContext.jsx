import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'teacher@school.edu',
    role: 'teacher',
    teacherId: 'T001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    role: 'student',
    studentId: 'S001',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@student.edu',
    role: 'student',
    studentId: 'S002',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('sms_user');
    const token = localStorage.getItem('sms_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    // Try to hydrate from token
    (async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('sms_user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('sms_user');
          localStorage.removeItem('sms_token');
          setUser(null);
        }
      } catch (_) {
        // ignore network errors for demo
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('sms_user', JSON.stringify(data.user));
      localStorage.setItem('sms_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_token');
  };

  const register = async ({ name, email, password, role }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Registration failed');
      }
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('sms_user', JSON.stringify(data.user));
      localStorage.setItem('sms_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
