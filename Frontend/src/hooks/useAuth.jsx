import { useState, useEffect, useCallback } from 'react';
import { performLogin, performRegister, refreshToken } from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setUser({ token }); // Store the token or any user-related info
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await performLogin({ email, password });
      setUser(data.user);
      localStorage.setItem('token', data.accessToken);
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
    setUser(null);
    localStorage.removeItem('token');
  };

  const refreshUser = useCallback(async () => {
    try {
      const newTokenData = await refreshToken();
      setUser(newTokenData.user); // Update user with refreshed data
      localStorage.setItem('token', newTokenData.accessToken);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null); // Invalidate session on failure
    }
  }, []);

  return { user, loading, login, register, logout, refreshUser };
};

export default useAuth;
