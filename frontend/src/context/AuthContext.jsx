import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If 404 or 401, clear token and user
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 403) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    updateUser,
    refreshUser: fetchUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

