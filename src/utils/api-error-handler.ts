import { toast } from '@/hooks/use-toast';

/**
 * Standard API error interface
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Validation error interface for form fields
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Network error interface
 */
export interface NetworkError {
  status: number;
  message: string;
}

/**
 * Handles API responses and throws standardized errors
 * @param response The fetch Response object
 * @returns Parsed JSON response
 * @throws Error with standardized message
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      status: response.status,
      message: response.statusText || 'An error occurred',
    }));
    
    throw new Error(errorData.message || 'An error occurred');
  }
  
  return response.json();
}

/**
 * Handles API errors and displays toast notifications
 * @param error The error object
 * @param fallbackMessage Fallback message if error is not an Error instance
 * @returns The error message
 */
export function handleApiError(error: unknown, fallbackMessage: string = 'An error occurred'): string {
  console.error('API Error:', error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  });
  
  return errorMessage;
}

/**
 * Formats validation errors for form display
 * @param errors Validation errors from API
 * @returns Formatted errors object for React Hook Form
 */
export function formatValidationErrors(errors?: Record<string, string[]>): Record<string, { message: string }> {
  if (!errors) return {};
  
  return Object.entries(errors).reduce((acc, [field, messages]) => {
    acc[field] = { message: messages[0] || 'Invalid value' };
    return acc;
  }, {} as Record<string, { message: string }>);
}

/**
 * Creates a safe API fetcher for use with SWR or React Query
 * @param url API endpoint URL
 * @param options Fetch options
 * @returns Promise with the parsed response
 */
export async function apiFetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    return handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
