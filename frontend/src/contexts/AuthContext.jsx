import React, { createContext, useContext, useState, useEffect } from 'react';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('sms_user');
    const token = localStorage.getItem('sms_token');

    if (storedUser && token) {
      // Set user immediately from localStorage for instant UI
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // If parsing fails, clear corrupted data
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('sms_user');
        localStorage.removeItem('sms_token');
        setIsLoading(false);
        return;
      }

      // Validate token in background with timeout
      let isMounted = true;
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('Token validation timeout - keeping cached user');
          setIsLoading(false);
        }
      }, 5000); // 5 second timeout

      (async () => {
        try {
          // Trim token to remove any whitespace
          const cleanToken = token.trim();

          const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${cleanToken}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.success) {
              // Update user with fresh data from server
              setUser(data.data.user);
              localStorage.setItem('sms_user', JSON.stringify(data.data.user));
            }
          } else {
            const errorData = await res.json().catch(() => ({}));
            console.log('Profile validation failed:', res.status, errorData.message || errorData);

            // Only clear on actual authentication failures, not server errors
            if (res.status === 401) {
              // Check if it's a real auth failure or server issue
              const errorMsg = errorData.message || '';
              if (errorMsg.includes('Invalid token') || errorMsg.includes('Token expired') || errorMsg.includes('user not found')) {
                // Real auth failure - clear session
                if (isMounted) {
                  console.log('Authentication failed - clearing session');
                  localStorage.removeItem('sms_user');
                  localStorage.removeItem('sms_token');
                  setUser(null);
                }
              } else {
                // Might be a server issue - keep cached user
                console.warn('401 error but keeping cached user - might be server issue');
              }
            } else if (res.status === 404) {
              // User not found - clear session
              if (isMounted) {
                localStorage.removeItem('sms_user');
                localStorage.removeItem('sms_token');
                setUser(null);
              }
            }
            // For other errors (500, network issues), keep the user from localStorage
          }
        } catch (error) {
          clearTimeout(timeoutId);
          // On network errors, keep the user from localStorage
          // This prevents clearing valid sessions due to temporary network issues
          console.warn('Token validation network error, keeping cached user:', error.message);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    } else {
      // No stored auth, set loading to false immediately
      setIsLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
        // Trim token to ensure no whitespace issues
        localStorage.setItem('sms_token', data.data.token.trim());
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

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('sms_token');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Trim token to remove any whitespace
      const cleanToken = token.trim();

      if (!cleanToken) {
        throw new Error('Invalid authentication token. Please log in again.');
      }

      // First verify the token is still valid by checking profile
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!profileRes.ok && profileRes.status === 401) {
          // Token is invalid, clear session
          localStorage.removeItem('sms_user');
          localStorage.removeItem('sms_token');
          setUser(null);
          throw new Error('Your session has expired. Please log in again to delete your account.');
        }
      } catch (profileError) {
        // If profile check fails, still try to delete (might be network issue)
        console.warn('Profile check failed, proceeding with deletion:', profileError);
      }

      // Now attempt to delete the account
      const res = await fetch(`${API_BASE_URL}/api/auth/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMessage = data.message || `Failed to delete account (${res.status})`;

        // If token is invalid, clear session
        if (res.status === 401) {
          localStorage.removeItem('sms_user');
          localStorage.removeItem('sms_token');
          setUser(null);
          throw new Error('Your session has expired. Please log in again.');
        }

        throw new Error(errorMessage);
      }

      // Clear user data and logout immediately
      setUser(null);
      localStorage.removeItem('sms_user');
      localStorage.removeItem('sms_token');
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ username, password, role, firstName, lastName, email, phone, dob, hireDate, departmentId, classId }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
        // Trim token to ensure no whitespace issues
        localStorage.setItem('sms_token', data.data.token.trim());
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
    <AuthContext.Provider value={{ user, login, logout, register, deleteAccount, isLoading }}>
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
