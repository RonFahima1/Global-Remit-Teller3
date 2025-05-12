import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent' | 'user';
  permissions: string[];
  branchId?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'global_remit_access_token';
const REFRESH_TOKEN_KEY = 'global_remit_refresh_token';
const TOKEN_EXPIRY_KEY = 'global_remit_token_expiry';

/**
 * Store authentication tokens in localStorage
 */
export const storeTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt.toString());
};

/**
 * Get stored tokens from localStorage
 */
export const getStoredTokens = (): AuthTokens | null => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!accessToken || !refreshToken || !expiresAtStr) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt: parseInt(expiresAtStr, 10),
  };
};

/**
 * Clear stored tokens from localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Check if the current token is valid
 */
export const isTokenValid = (): boolean => {
  const tokens = getStoredTokens();
  if (!tokens) return false;

  // Check if token is expired (with 10 second buffer)
  const now = Math.floor(Date.now() / 1000);
  return tokens.expiresAt > now + 10;
};

/**
 * Get the current user from the token
 */
export const getCurrentUser = (): User | null => {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  try {
    const decoded = jwtDecode<User & { exp: number }>(tokens.accessToken);
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      permissions: decoded.permissions,
      branchId: decoded.branchId,
      avatar: decoded.avatar,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if the current user has a specific permission
 */
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin role has all permissions
  if (user.role === 'admin') return true;
  
  return user.permissions.includes(permission);
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: User['role'] | User['role'][]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
};
