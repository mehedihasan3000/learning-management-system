'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '@/types';
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getStoredAdminUser,
  setStoredAdminUser,
  loginAdminApi,
} from '@/lib/api';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved credentials
    const savedToken = getAuthToken();
    const savedUser = getStoredAdminUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginAdminApi(email, password);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.admin);
        setAuthToken(res.data.token);
        setStoredAdminUser(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeAuthToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
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

