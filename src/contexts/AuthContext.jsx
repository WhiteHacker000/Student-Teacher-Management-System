import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('sms_user');
    const token = localStorage.getItem('sms_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Try to hydrate from token in background
      (async () => {
        try {
          const res = await fetch('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.data.user);
            localStorage.setItem('sms_user', JSON.stringify(data.data.user));
          } else {
            // Only clear if the token is actually invalid
            localStorage.removeItem('sms_user');
            localStorage.removeItem('sms_token');
            setUser(null);
          }
        } catch (_) {
          // ignore network errors for demo
        }
      })();
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data.user);
        localStorage.setItem('sms_user', JSON.stringify(data.data.user));
        localStorage.setItem('sms_token', data.data.token);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_token');
  };

  const register = async ({ username, password, role, firstName, lastName, email, phone, dob, hireDate, departmentId, classId }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password, 
          role, 
          firstName, 
          lastName, 
          email, 
          phone, 
          dob, 
          hireDate, 
          departmentId, 
          classId 
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Registration failed');
      }
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        localStorage.setItem('sms_user', JSON.stringify(data.data.user));
        localStorage.setItem('sms_token', data.data.token);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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
