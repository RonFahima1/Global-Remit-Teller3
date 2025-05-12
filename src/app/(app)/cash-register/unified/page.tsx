'use client';

/**
 * Unified Cash Register Page
 * Provides a comprehensive interface for cash register operations
 */

import React from 'react';
import { CashRegisterDashboard } from '../components/CashRegisterDashboard';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

/**
 * Unified Cash Register Page Component
 */
export default function UnifiedCashRegisterPage() {
  return (
    <Provider store={store}>
      <div className="container mx-auto py-6">
        <CashRegisterDashboard />
      </div>
    </Provider>
  );
}
