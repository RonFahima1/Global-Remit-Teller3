/**
 * Error handling utilities for the Global Remit Teller application
 * Provides centralized error handling, logging, and user-friendly error messages
 */

import { toast } from 'sonner';

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error category types
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  API = 'api',
  NETWORK = 'network',
  DATABASE = 'database',
  UNEXPECTED = 'unexpected',
  BUSINESS_LOGIC = 'business_logic',
}

// Error context interface
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  requestId?: string;
  // API-related context
  endpoint?: string;
  method?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  additionalData?: Record<string, any>;
}

// Application error class
export class AppError extends Error {
  severity: ErrorSeverity;
  category: ErrorCategory;
  userMessage: string;
  context: ErrorContext;
  originalError?: any;

  constructor({
    message,
    userMessage,
    severity = ErrorSeverity.ERROR,
    category = ErrorCategory.UNEXPECTED,
    context = {},
    originalError,
  }: {
    message: string;
    userMessage?: string;
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    context?: ErrorContext;
    originalError?: any;
  }) {
    super(message);
    this.name = 'AppError';
    this.severity = severity;
    this.category = category;
    this.userMessage = userMessage || this.getUserFriendlyMessage(message, category);
    this.context = context;
    this.originalError = originalError;
  }

  // Get user-friendly error message based on category
  private getUserFriendlyMessage(message: string, category: ErrorCategory): string {
    switch (category) {
      case ErrorCategory.AUTHENTICATION:
        return 'Authentication failed. Please sign in again.';
      case ErrorCategory.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorCategory.VALIDATION:
        return message; // Validation errors are usually already user-friendly
      case ErrorCategory.API:
        return 'Unable to complete the request. Please try again later.';
      case ErrorCategory.NETWORK:
        return 'Network error. Please check your connection and try again.';
      case ErrorCategory.DATABASE:
        return 'Database operation failed. Please try again later.';
      case ErrorCategory.BUSINESS_LOGIC:
        return message; // Business logic errors should have specific messages
      case ErrorCategory.UNEXPECTED:
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }

  // Log the error to the console and potentially to a monitoring service
  log(): void {
    const errorData = {
      message: this.message,
      severity: this.severity,
      category: this.category,
      context: this.context,
      stack: this.stack,
      originalError: this.originalError,
    };

    // Log to console
    console.error('[AppError]', errorData);

    // In production, you would send this to a monitoring service like Sentry
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: Sentry.captureException(this);
    }
  }

  // Display a toast notification to the user
  notify(): void {
    switch (this.severity) {
      case ErrorSeverity.INFO:
        toast.info(this.userMessage);
        break;
      case ErrorSeverity.WARNING:
        toast.warning(this.userMessage);
        break;
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.ERROR:
      default:
        toast.error(this.userMessage);
        break;
    }
  }

  // Handle the error by logging it and notifying the user
  handle(): void {
    this.log();
    this.notify();
  }
}

// Helper function to create and handle an error
export function handleError(
  error: any,
  {
    message,
    userMessage,
    severity = ErrorSeverity.ERROR,
    category = ErrorCategory.UNEXPECTED,
    context = {},
    notify = true,
  }: {
    message?: string;
    userMessage?: string;
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    context?: ErrorContext;
    notify?: boolean;
  } = {}
): AppError {
  // If the error is already an AppError, use it
  if (error instanceof AppError) {
    // Update context if provided
    if (Object.keys(context).length > 0) {
      error.context = { ...error.context, ...context };
    }
    
    // Log the error
    error.log();
    
    // Notify the user if requested
    if (notify) {
      error.notify();
    }
    
    return error;
  }

  // Create a new AppError
  const appError = new AppError({
    message: message || (error instanceof Error ? error.message : String(error)),
    userMessage,
    severity,
    category,
    context,
    originalError: error,
  });

  // Log the error
  appError.log();

  // Notify the user if requested
  if (notify) {
    appError.notify();
  }

  return appError;
}

// Error boundary fallback component props
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}
