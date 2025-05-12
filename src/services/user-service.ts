/**
 * User Management Service
 * Handles user operations, roles, and permissions
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// User role enum
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TELLER = 'teller',
  ACCOUNTANT = 'accountant',
  READONLY = 'readonly',
}

// User status enum
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: string[];
  preferredLanguage?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

// Permission interface
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

/**
 * User Management Service class
 */
class UserService {
  private apiEndpoint = '/users';

  /**
   * Get all users with filtering
   */
  async getAllUsers(params?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await apiService.get<{ 
        users: User[]; 
        total: number; 
        page: number; 
        limit: number 
      }>(`${this.apiEndpoint}?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch users');
      }
      
      return response.data || { users: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiService.get<User>(`${this.apiEndpoint}/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `User ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'GET');
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    password?: string;
    sendInvite?: boolean;
    permissions?: string[];
    preferredLanguage?: string;
    metadata?: Record<string, any>;
  }): Promise<User> {
    try {
      const response = await apiService.post<User>(
        this.apiEndpoint, 
        userData,
        { showSuccessToast: true, successMessage: 'User created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create user');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'POST');
    }
  }

  /**
   * Update user information
   */
  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    try {
      const response = await apiService.put<User>(
        `${this.apiEndpoint}/${id}`, 
        userData,
        { showSuccessToast: true, successMessage: 'User updated successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update user ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'PUT');
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    try {
      const response = await apiService.patch<User>(
        `${this.apiEndpoint}/${id}/status`, 
        { status },
        { showSuccessToast: true, successMessage: `User status updated to ${status}` }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update status for user ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/status`, 'PATCH');
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(id: string, role: UserRole): Promise<User> {
    try {
      const response = await apiService.patch<User>(
        `${this.apiEndpoint}/${id}/role`, 
        { role },
        { showSuccessToast: true, successMessage: `User role updated to ${role}` }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update role for user ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/role`, 'PATCH');
    }
  }

  /**
   * Get all available permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await apiService.get<Permission[]>(`${this.apiEndpoint}/permissions`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch permissions');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/permissions`, 'GET');
    }
  }

  /**
   * Update user permissions
   */
  async updateUserPermissions(id: string, permissions: string[]): Promise<User> {
    try {
      const response = await apiService.patch<User>(
        `${this.apiEndpoint}/${id}/permissions`, 
        { permissions },
        { showSuccessToast: true, successMessage: 'User permissions updated successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update permissions for user ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/permissions`, 'PATCH');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>(`${this.apiEndpoint}/me`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch current user profile');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/me`, 'GET');
    }
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    preferredLanguage?: string;
    avatar?: string;
  }): Promise<User> {
    try {
      const response = await apiService.put<User>(
        `${this.apiEndpoint}/me`, 
        userData,
        { showSuccessToast: true, successMessage: 'Profile updated successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update profile');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/me`, 'PUT');
    }
  }
}

// Create an instance of the service
const userService = new UserService();

// Export the instance as default
export default userService;

// Also export the class for testing or extension
export { UserService };
