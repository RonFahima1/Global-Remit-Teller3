'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, isTokenValid, getCurrentUser, hasPermission as checkPermission, hasRole as checkRole } from '@/lib/auth';
import { login as loginService, logout as logoutService, refreshToken } from '@/services/auth-service';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  refreshUserSession: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token is valid
        if (!isTokenValid()) {
          // Try to refresh the token if it's expired
          const refreshed = await refreshToken();
          if (!refreshed) {
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
        
        // Get current user from token
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    // Refresh token every 15 minutes if user is logged in
    if (user) {
      const interval = setInterval(async () => {
        await refreshToken();
      }, 15 * 60 * 1000); // 15 minutes
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginService(credentials);
      
      if (!response.success) {
        setError(response.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
      
      // Get current user from token after successful login
      const currentUser = getCurrentUser();
      setUser(currentUser);
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
    router.push('/login');
  };

  // Refresh user session
  const refreshUserSession = async (): Promise<boolean> => {
    try {
      const success = await refreshToken();
      if (success) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  };

  // Check if user has permission
  const hasPermission = (permission: string): boolean => {
    return checkPermission(permission);
  };

  // Check if user has role
  const hasRole = (role: string | string[]): boolean => {
    return checkRole(role as any);
  };

  // Context value
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
    refreshUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
