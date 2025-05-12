'use client';

import { ReactNode } from 'react';
import { RemittanceProvider as RemittanceContextProvider } from '@/context/RemittanceContext';

export function RemittanceProvider({ children }: { children: ReactNode }) {
  return (
    <RemittanceContextProvider>
      {children}
    </RemittanceContextProvider>
  );
}
