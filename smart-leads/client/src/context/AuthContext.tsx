import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { User, AuthFormData } from '../types';
import api from '../lib/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: AuthFormData) => Promise<void>;
  register: (data: AuthFormData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { token, user: userData } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { token, user: userData } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
