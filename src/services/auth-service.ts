import { AuthTokens, storeTokens, getStoredTokens, clearTokens } from '@/lib/auth';

/**
 * Interface for login request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Interface for login response
 */
export interface LoginResponse {
  success: boolean;
  tokens?: AuthTokens;
  message?: string;
}

/**
 * Interface for registration request
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Interface for registration response
 */
export interface RegisterResponse {
  success: boolean;
  message?: string;
}

/**
 * Interface for password reset request
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * Interface for password reset confirmation
 */
export interface ConfirmResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Login a user with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    // This would be a real API call in production
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Login failed. Please try again.',
      };
    }

    const data = await response.json();
    
    // Store tokens in localStorage
    if (data.tokens) {
      storeTokens(data.tokens);
    }

    return {
      success: true,
      tokens: data.tokens,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Register a new user
 */
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  try {
    // This would be a real API call in production
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Registration failed. Please try again.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Logout the current user
 */
export function logout(): void {
  // Clear tokens from localStorage
  clearTokens();
  
  // In a real application, you might also want to invalidate the token on the server
  fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(error => {
    console.error('Logout error:', error);
  });
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshToken(): Promise<boolean> {
  const tokens = getStoredTokens();
  if (!tokens) return false;

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const data = await response.json();
    storeTokens(data.tokens);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    return false;
  }
}

/**
 * Request a password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Password reset request failed. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Confirm password reset with token and new password
 */
export async function confirmPasswordReset(
  data: ConfirmResetPasswordRequest
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/reset-password/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Password reset failed. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Your password has been reset successfully. You can now log in with your new password.',
    };
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
