/**
 * Base API service for handling API requests
 * Implements common functionality like authentication, error handling, and caching
 */

import { toast } from 'sonner';

// API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// API error interface
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// API request options
export interface ApiRequestOptions {
  requiresAuth?: boolean;
  cacheKey?: string;
  cacheTtl?: number; // in seconds
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

// Default API options
const defaultOptions: ApiRequestOptions = {
  requiresAuth: true,
  showErrorToast: true,
  showSuccessToast: false,
};

/**
 * Base API service class
 */
export class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  /**
   * Handle API errors
   */
  private handleError(error: any, options: ApiRequestOptions): ApiError {
    const status = error.status || 500;
    let message = error.message || 'An unexpected error occurred';
    
    // Try to parse error message from response
    if (error.json) {
      try {
        const data = error.json();
        message = data.message || message;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }
    
    // Show error toast if enabled
    if (options.showErrorToast) {
      toast.error(message);
    }
    
    // Return structured error
    return {
      status,
      message,
      errors: error.errors,
    };
  }
  
  /**
   * Make API request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Merge options with defaults
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Prepare request URL
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Prepare request headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(mergedOptions.requiresAuth ? this.getAuthHeaders() : {}),
    };
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    try {
      // Make the request
      const response = await fetch(url, requestOptions);
      
      // Check if response is OK
      if (!response.ok) {
        throw {
          status: response.status,
          message: response.statusText,
          json: async () => response.json(),
        };
      }
      
      // Parse response
      const result = await response.json();
      
      // Show success toast if enabled
      if (mergedOptions.showSuccessToast && mergedOptions.successMessage) {
        toast.success(mergedOptions.successMessage);
      }
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      const apiError = this.handleError(error, mergedOptions);
      
      return {
        success: false,
        message: apiError.message,
        errors: apiError.errors,
      };
    }
  }
  
  /**
   * GET request
   */
  public async get<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }
  
  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, options);
  }
  
  /**
   * PUT request
   */
  public async put<T>(
    endpoint: string,
    data: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, options);
  }
  
  /**
   * PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, options);
  }
  
  /**
   * DELETE request
   */
  public async delete<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}

// Create and export default instance
const apiService = new ApiService();
export default apiService;
