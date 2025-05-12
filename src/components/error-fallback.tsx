/**
 * Error Fallback Components
 * Provides consistent error UI for the application
 */

'use client';

import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Default Error Fallback Component
 * Used as the default fallback for the ErrorBoundary
 */
export const DefaultErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-lg border border-red-200 bg-red-50 text-red-800">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      
      <div className="text-sm text-center mb-4 max-w-md">
        <p className="mb-2">
          We encountered an error while trying to process your request.
        </p>
        <p className="text-xs text-red-600 font-mono p-2 bg-red-100 rounded overflow-auto max-w-full">
          {error.message || 'Unknown error'}
        </p>
      </div>
      
      <button
        onClick={resetErrorBoundary}
        className="flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try again
      </button>
    </div>
  );
};

/**
 * Inline Error Fallback Component
 * Used for smaller, inline error displays
 */
export const InlineErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="flex items-center p-3 rounded border border-red-200 bg-red-50 text-red-800 text-sm">
      <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
      <span className="mr-3 flex-grow">{error.message || 'An error occurred'}</span>
      <button
        onClick={resetErrorBoundary}
        className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

/**
 * Card Error Fallback Component
 * Used for card-based UI components
 */
export const CardErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-red-200 bg-white text-red-800 shadow-sm min-h-[150px]">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <h4 className="font-medium mb-1">Error Loading Content</h4>
      <p className="text-xs text-center text-gray-600 mb-3">{error.message || 'Failed to load content'}</p>
      <button
        onClick={resetErrorBoundary}
        className="text-xs px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
      >
        Reload
      </button>
    </div>
  );
};

/**
 * Modal Error Fallback Component
 * Used within modal dialogs
 */
export const ModalErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-center">Operation Failed</h3>
      
      <p className="text-sm text-center text-gray-600 mb-4">
        {error.message || 'We encountered an error while processing your request.'}
      </p>
      
      <div className="flex space-x-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};
