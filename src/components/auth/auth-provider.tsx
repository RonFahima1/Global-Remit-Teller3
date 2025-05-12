'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define user roles based on the application
export type UserRole = 
  | 'AGENT_ADMIN' 
  | 'AGENT_USER' 
  | 'ORG_ADMIN' 
  | 'ORG_USER' 
  | 'COMPLIANCE_USER' 
  | 'USER';

// Define the User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  image?: string;
}

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
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
  ],
  'ORG_USER': [
    'remittance.view',
    'client.view',
    'transaction.view',
    'exchange.view',
    'branch.view',
    'report.view'
  ],
  'COMPLIANCE_USER': [
    'remittance.view',
    'client.view', 'client.verify',
    'transaction.view', 'transaction.approve',
    'report.view', 'report.export',
    'compliance.manage'
  ],
  'USER': [
    'remittance.view',
    'client.view',
    'transaction.view'
  ]
};

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Update user state when session changes
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      // Extract user data from session
      const userData: User = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user.role as UserRole) || 'USER',
        permissions: session.user.permissions || [],
        image: session.user.image || undefined,
      };
      
      setUser(userData);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, [session, status]);

  // Login with credentials (email/password)
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Refresh session data
      router.refresh();
      
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Microsoft
  const loginWithMicrosoft = async () => {
    try {
      setLoading(true);
      
      await signIn('azure-ad', { callbackUrl: '/dashboard' });
      
      // Note: We don't need to handle success here as the user will be redirected
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login with Microsoft');
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      
      await signOut({ redirect: false });
      
      // Clear user state
      setUser(null);
      
      // Redirect to login page
      router.push('/login');
      
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Get permissions for the user's role
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    return rolePermissions.includes(permission);
  };

  // Check if user has any of the specified roles
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithCredentials,
        loginWithMicrosoft,
        logout,
        hasPermission,
        hasRole,
      }}
    >
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
