import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authApi.getCurrentUser();
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
    setIsAuthenticated(true);
    handleApiSuccess('Welcome back!');
    return data;
  };

  const register = async (userData) => {
    const { data } = await authApi.register(userData);
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setUser(data.user);
      setIsAuthenticated(true);
    }
    handleApiSuccess('Account created successfully!');
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      handleApiError(error, 'Logout failed');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    const { data } = await authApi.updateProfile(profileData);
    setUser(data);
    handleApiSuccess('Profile updated');
    return data;
  };

  const changePassword = async (passwordData) => {
    await authApi.changePassword(passwordData);
    handleApiSuccess('Password changed successfully');
  };

  const forgotPassword = async (email) => {
    await authApi.forgotPassword(email);
    handleApiSuccess('Password reset link sent to your email');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
