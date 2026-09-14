import React, { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await authApi.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.user) {
      flushSync(() => {
        setUser(res.user);
      });
    }
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

