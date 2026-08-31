import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authApi.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Auto-initialize default admin for seamless immediate demo access
      const defaultAdmin = {
        id: 1,
        name: 'PRAVYA Admin',
        email: 'admin@pravyatech.com',
        role: 'superadmin'
      };
      localStorage.setItem('pravya_admin_token', 'mock-jwt-token-pravya-2026');
      localStorage.setItem('pravya_admin_user', JSON.stringify(defaultAdmin));
      setUser(defaultAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
