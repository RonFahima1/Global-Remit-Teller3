/**
 * Global API error handler
 * Provides consistent error handling for API requests
 */

import { AppError, ErrorCategory, ErrorSeverity, handleError } from './error-handling';

// API error response interface
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
  status?: number;
}

/**
 * Handle API errors consistently
 * @param error The error object from the API request
 * @param endpoint The API endpoint that was called
 * @param method The HTTP method that was used
 * @returns An AppError instance
 */
export function handleApiError(
  error: any,
  endpoint: string,
  method: string
): AppError {
  // Default error information
  let message = 'API request failed';
  let userMessage = 'Unable to complete the request. Please try again later.';
  let category = ErrorCategory.API;
  let severity = ErrorSeverity.ERROR;
  
  // Extract status code
  const statusCode = error.status || error.statusCode || 500;
  
  // Try to parse error response
  let errorResponse: ApiErrorResponse = {};
  
  try {
    if (error.json && typeof error.json === 'function') {
      errorResponse = error.json();
    } else if (error.response && typeof error.response.json === 'function') {
      errorResponse = error.response.json();
    } else if (error.data) {
      errorResponse = error.data;
    }
  } catch (e) {
    // Ignore JSON parsing errors
  }
  
  // Extract error message
  message = errorResponse.message || errorResponse.error || error.message || message;
  
  // Determine error category and severity based on status code
  switch (statusCode) {
    case 400:
      category = ErrorCategory.VALIDATION;
      severity = ErrorSeverity.WARNING;
      userMessage = message; // Validation errors are usually already user-friendly
      break;
    case 401:
      category = ErrorCategory.AUTHENTICATION;
      severity = ErrorSeverity.WARNING;
      userMessage = 'Your session has expired. Please sign in again.';
      break;
    case 403:
      category = ErrorCategory.AUTHORIZATION;
      severity = ErrorSeverity.WARNING;
      userMessage = 'You do not have permission to perform this action.';
      break;
    case 404:
      category = ErrorCategory.API;
      severity = ErrorSeverity.WARNING;
      userMessage = 'The requested resource was not found.';
      break;
    case 422:
      category = ErrorCategory.VALIDATION;
      severity = ErrorSeverity.WARNING;
      userMessage = message; // Validation errors are usually already user-friendly
      break;
    case 429:
      category = ErrorCategory.API;
      severity = ErrorSeverity.WARNING;
      userMessage = 'Too many requests. Please try again later.';
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      category = ErrorCategory.API;
      severity = ErrorSeverity.ERROR;
      userMessage = 'A server error occurred. Please try again later.';
      break;
    default:
      if (statusCode >= 400 && statusCode < 500) {
        category = ErrorCategory.API;
        severity = ErrorSeverity.WARNING;
      } else if (statusCode >= 500) {
        category = ErrorCategory.API;
        severity = ErrorSeverity.ERROR;
      }
      break;
  }
  
  // Special case for network errors
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    category = ErrorCategory.NETWORK;
    severity = ErrorSeverity.WARNING;
    userMessage = 'Network error. Please check your connection and try again.';
  }
  
  // Create and return the AppError
  return handleError(error, {
    message: `API Error (${method} ${endpoint}): ${message}`,
    userMessage,
    severity,
    category,
    context: {
      endpoint,
      method,
      statusCode,
      errors: errorResponse.errors,
    },
  });
}

/**
 * Format validation errors from the API
 * @param errors The validation errors object
 * @returns A formatted string of validation errors
 */
export function formatValidationErrors(errors?: Record<string, string[]>): string {
  if (!errors || Object.keys(errors).length === 0) {
    return 'Validation failed';
  }
  
  // Format the errors into a readable string
  const formattedErrors = Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
      
      return `${fieldName}: ${messages.join(', ')}`;
    })
    .join('\n');
  
  return formattedErrors;
}
