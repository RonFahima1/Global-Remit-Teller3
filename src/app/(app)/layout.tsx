"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { LoadingState } from '@/components/ui/loading-state';
import { CustomSidebarProvider } from '@/components/providers/SidebarProvider';
import { SearchProvider } from '@/components/providers/SearchProvider';
import { useLoadingTransition } from '@/hooks/useLoadingTransition';

export default function AppAreaLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const showLoading = useLoadingTransition(loading);

  // Always in development inspection mode for now
  useEffect(() => {
    // Set development inspection mode to true by default
    if (typeof window !== 'undefined') {
      localStorage.setItem('dev_inspection_mode', 'true');
    }
  }, []);

  if (showLoading) {
    return <LoadingState fullScreen message="Loading..." />;
  }
  
  // Always consider dev inspection mode as true
  const devInspectionMode = true;

  // Add a dev mode indicator if in dev inspection mode
  return (
    <CustomSidebarProvider>
      <SearchProvider>
        <AppLayout>{children}</AppLayout>
        {devInspectionMode && (
          <div 
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              background: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              zIndex: 9999
            }}
          >
            DEV INSPECTION MODE (Ctrl+Shift+D to toggle)
          </div>
        )}
      </SearchProvider>
    </CustomSidebarProvider>
  );
}

