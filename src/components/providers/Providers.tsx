'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './LanguageProvider';
import { AuthProvider } from '../auth/auth-provider';
import { QueryProvider } from './query-provider';
import { AppStateProvider } from '@/context/app-state-context';
import { CurrentUserProvider, useCurrentUser } from '@/context/CurrentUserContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuditLogProvider } from '@/context/AuditLogContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Wrapper component to access the current user for AuditLogProvider
function AuditLogWrapper({ children }: { children: React.ReactNode }) {
  const currentUser = useCurrentUser();
  return (
    <AuditLogProvider userId={currentUser.id.toString()}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuditLogProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AppStateProvider>
          <LanguageProvider>
            <AuthProvider>
              <CurrentUserProvider>
                <AuditLogWrapper>
                  {children}
                  <Toaster />
                  <SonnerToaster position="top-right" />
                </AuditLogWrapper>
              </CurrentUserProvider>
            </AuthProvider>
          </LanguageProvider>
        </AppStateProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}