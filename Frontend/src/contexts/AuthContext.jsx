import React, { createContext, useState, useEffect } from 'react';
import { performLogin, performRegister, refreshToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Assume the token is valid if it exists
          setUser({ token }); // Store the token or user info if needed
        } catch (error) {
          console.error('Authentication check failed:', error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await performLogin({ email, password });
      localStorage.setItem('token', data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (username, email, password) => {
    try {
      await performRegister({ username, email, password });
      await login(email, password); // Automatically log in after registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const newTokenData = await refreshToken(); // No need to pass the token
        localStorage.setItem('token', newTokenData.accessToken);
        setUser(newTokenData.user); // Update user with refreshed data
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        setUser(null); // Invalidate session on failure
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
