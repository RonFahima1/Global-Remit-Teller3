/**
 * Providers Component
 * Combines all providers in one place for easy application wrapping
 */

'use client';

import React, { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { ServiceProvider } from './service-provider';
import { ReduxProvider } from './redux-provider';
import { ErrorBoundary } from 'react-error-boundary';
import { DefaultErrorFallback } from '@/components/error-fallback';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers component that wraps the application with all necessary providers
 * Order is important - providers that depend on others should be nested inside them
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary FallbackComponent={DefaultErrorFallback}>
      <ReduxProvider>
        <QueryProvider>
          <ServiceProvider>
            {children}
          </ServiceProvider>
        </QueryProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}

export default Providers;
