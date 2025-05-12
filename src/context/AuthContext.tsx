'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

// Define user roles based on the Angular application
export type UserRole = 
  | 'AGENT_ADMIN' 
  | 'AGENT_USER' 
  | 'ORG_ADMIN' 
  | 'ORG_USER' 
  | 'COMPLIANCE_USER' 
  | 'USER';

// Define the User interface with additional properties
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId?: string;
  agentId?: string;
  profileImage?: string;
  phoneNumber?: string;
  lastLogin?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  permissions: string[];
}

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
  token: string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'AGENT_ADMIN': [
    'remittance.create', 'remittance.view', 'remittance.edit',
    'client.create', 'client.view', 'client.edit',
    'transaction.view', 'transaction.cancel',
    'exchange.create', 'exchange.view',
    'cash_register.manage', 'cash_register.view',
    'branch.manage', 'branch.view',
    'user.create', 'user.view', 'user.edit', 'user.delete',
    'report.view', 'report.export'
  ],
  'AGENT_USER': [
    'remittance.create', 'remittance.view',
    'client.create', 'client.view', 'client.edit',
    'transaction.view',
    'exchange.create', 'exchange.view',
    'cash_register.view'
  ],
  'ORG_ADMIN': [
    'remittance.view', 'remittance.edit',
    'client.view',
    'transaction.view', 'transaction.cancel',
    'exchange.view',
    'agent.manage', 'agent.view',
    'branch.manage', 'branch.view',
    'user.create', 'user.view', 'user.edit', 'user.delete',
    'report.view', 'report.export',
    'settings.manage'
  ],
  'ORG_USER': [
    'remittance.view',
    'client.view',
    'transaction.view',
    'exchange.view',
    'agent.view',
    'branch.view',
    'report.view', 'report.export'
  ],
  'COMPLIANCE_USER': [
    'client.view',
    'transaction.view',
    'compliance.manage', 'compliance.view',
    'report.view', 'report.export'
  ],
  'USER': [
    'profile.view', 'profile.edit'
  ]
};

// Enhanced mock users database with proper types and roles
const MOCK_USERS: Record<string, {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  password: string;
  role: UserRole;
  branchId?: string;
  agentId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}> = {
  'demo@example.com': {
    uid: 'demo-user',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: 'https://picsum.photos/32/32',
    password: 'demo',
    role: 'USER',
    status: 'ACTIVE',
  },
  'teller@globalremit.com': {
    uid: 'teller-user',
    email: 'teller@globalremit.com',
    displayName: 'Teller User',
    photoURL: 'https://picsum.photos/32/32?grayscale',
    password: 'password',
    role: 'AGENT_USER',
    branchId: 'branch-001',
    agentId: 'agent-001',
    status: 'ACTIVE',
  },
  'admin@globalremit.com': {
    uid: 'admin-user',
    email: 'admin@globalremit.com',
    displayName: 'Admin User',
    photoURL: 'https://picsum.photos/32/32?blur',
    password: 'admin',
    role: 'AGENT_ADMIN',
    branchId: 'branch-001',
    agentId: 'agent-001',
    status: 'ACTIVE',
  },
  'compliance@globalremit.com': {
    uid: 'compliance-user',
    email: 'compliance@globalremit.com',
    displayName: 'Compliance Officer',
    photoURL: 'https://picsum.photos/32/32?sepia',
    password: 'compliance',
    role: 'COMPLIANCE_USER',
    status: 'ACTIVE',
  },
};

// Mock JWT token generation function
const generateMockToken = (user: typeof MOCK_USERS[keyof typeof MOCK_USERS]): string => {
  // In a real app, this would be done on the server
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    sub: user.uid,
    email: user.email,
    name: user.displayName,
    role: user.role,
    branchId: user.branchId,
    agentId: user.agentId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };
  
  // Create a proper JWT format (header.payload.signature)
  // Use URL-safe base64 encoding for JWT
  const base64UrlEncode = (str: string) => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };
  
  const base64Header = base64UrlEncode(JSON.stringify(header));
  const base64Payload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode('mock-signature'); // In a real app, this would be a proper signature
  
  return `${base64Header}.${base64Payload}.${signature}`;
};

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    // For development purposes - auto login with mock user
    const isDevelopment = process.env.NODE_ENV === 'development';
    const devAutoLogin = localStorage.getItem('dev_auto_login') === 'true';
    
    // Set dev_auto_login to true by default in development mode
    if (isDevelopment && !localStorage.getItem('dev_auto_login')) {
      localStorage.setItem('dev_auto_login', 'true');
    }
    
    // Auto-login for development
    if (isDevelopment && devAutoLogin && !localStorage.getItem('auth_token')) {
      const mockUser = MOCK_USERS['teller@globalremit.com'];
      const mockToken = generateMockToken(mockUser);
      localStorage.setItem('auth_token', mockToken);
      
      const userObj: User = {
        id: mockUser.uid,
        email: mockUser.email,
        name: mockUser.displayName,
        role: mockUser.role,
        branchId: mockUser.branchId,
        agentId: mockUser.agentId,
        profileImage: mockUser.photoURL,
        status: mockUser.status,
        permissions: ROLE_PERMISSIONS[mockUser.role],
        lastLogin: new Date().toISOString()
      };
      
      setUser(userObj);
      setToken(mockToken);
      setLoading(false);
      router.push('/dashboard');
      return;
    }
    
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      try {
        // Decode the token to get user data
        const decoded = jwtDecode<{
          sub: string;
          email: string;
          name: string;
          role: UserRole;
          branchId?: string;
          agentId?: string;
          exp: number;
        }>(savedToken);
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          localStorage.removeItem('auth_token');
          setToken(null);
        } else {
          // Valid token, set user data
          setToken(savedToken);
          
          const userRole = decoded.role;
          setUser({
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: userRole,
            branchId: decoded.branchId,
            agentId: decoded.agentId,
            status: 'ACTIVE',
            permissions: ROLE_PERMISSIONS[userRole] || [],
          });
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validate against mock users
      const mockUser = MOCK_USERS[email];
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      if (mockUser.status !== 'ACTIVE') {
        throw new Error('Account is not active');
      }

      // Generate a mock token
      const authToken = generateMockToken(mockUser);
      
      // Create user data with permissions
      const userData: User = {
        id: mockUser.uid,
        email: mockUser.email,
        name: mockUser.displayName,
        role: mockUser.role,
        branchId: mockUser.branchId,
        agentId: mockUser.agentId,
        profileImage: mockUser.photoURL,
        status: mockUser.status,
        lastLogin: new Date().toISOString(),
        permissions: ROLE_PERMISSIONS[mockUser.role] || [],
      };
      
      // Store token first, then set user state
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(userData);
      
      // Add a small delay to ensure state updates before redirect
      setTimeout(() => {
        // Redirect based on role
        router.push('/dashboard');
        toast.success(`Welcome back, ${mockUser.displayName}!`);
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
      console.error('Login failed:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid email or password');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    updateUser,
    token,
  }), [user, loading, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
