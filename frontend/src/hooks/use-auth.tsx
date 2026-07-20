'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Admin } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('admin');

    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password);
    const { token: newToken, admin: adminData } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const signup = async (data: any) => {
    const response = await api.auth.signup(data);
    const { token: newToken, admin: adminData } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
