'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AuthProvider as CustomAuthProvider } from '@/components/auth/auth-provider';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Combined authentication provider that integrates NextAuth.js with our custom auth context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <CustomAuthProvider>
        {children}
      </CustomAuthProvider>
    </SessionProvider>
  );
}
