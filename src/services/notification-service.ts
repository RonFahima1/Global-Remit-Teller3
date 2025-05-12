/**
 * Notification Service
 * Handles user notifications for various events in the system
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Notification type enum
export enum NotificationType {
  TRANSACTION = 'transaction',
  CLIENT = 'client',
  SYSTEM = 'system',
  KYC = 'kyc',
  SECURITY = 'security',
  EXCHANGE = 'exchange',
}

// Notification priority enum
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

/**
 * Notification Service class
 */
class NotificationService {
  private apiEndpoint = '/notifications';

  /**
   * Get all notifications for the current user
   */
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: NotificationType;
    priority?: NotificationPriority;
  }): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
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
        notifications: Notification[]; 
        total: number; 
        unreadCount: number 
      }>(`${this.apiEndpoint}?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch notifications');
      }
      
      return response.data || { notifications: [], total: 0, unreadCount: 0 };
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiService.get<{ count: number }>(`${this.apiEndpoint}/unread-count`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch unread notification count');
      }
      
      return response.data?.count || 0;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/unread-count`, 'GET');
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await apiService.patch<Notification>(`${this.apiEndpoint}/${id}/read`, {});
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to mark notification as read');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/read`, 'PATCH');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiService.post<{ success: boolean; count: number }>(
        `${this.apiEndpoint}/mark-all-read`, 
        {},
        { showSuccessToast: true, successMessage: 'All notifications marked as read' }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark all notifications as read');
      }
      
      return response.data || { success: true, count: 0 };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/mark-all-read`, 'POST');
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete<{ success: boolean }>(
        `${this.apiEndpoint}/${id}`,
        { showSuccessToast: true, successMessage: 'Notification deleted' }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete notification');
      }
      
      return response.data || { success: true };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'DELETE');
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiService.delete<{ success: boolean; count: number }>(
        `${this.apiEndpoint}/clear-all`,
        { showSuccessToast: true, successMessage: 'All notifications cleared' }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to clear all notifications');
      }
      
      return response.data || { success: true, count: 0 };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/clear-all`, 'DELETE');
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
    types?: Partial<Record<NotificationType, boolean>>;
  }): Promise<{ success: boolean }> {
    try {
      const response = await apiService.put<{ success: boolean }>(
        `${this.apiEndpoint}/preferences`, 
        preferences,
        { showSuccessToast: true, successMessage: 'Notification preferences updated' }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update notification preferences');
      }
      
      return response.data || { success: true };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/preferences`, 'PUT');
    }
  }
}

// Create an instance of the service
const notificationService = new NotificationService();

// Export the instance as default
export default notificationService;

// Also export the class for testing or extension
export { NotificationService };
