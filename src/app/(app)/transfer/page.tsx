/**
 * Transfer Page
 * Money transfer process page
 */

import React from 'react';
import { TransferFlow } from './components/TransferFlow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Money Transfer | Global Remit Teller',
  description: 'Send money to friends and family worldwide with competitive rates and fast delivery.',
};

/**
 * Transfer Page Component
 */
export default function TransferPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Money Transfer</h1>
        <p className="text-muted-foreground">
          Send money to friends and family worldwide with competitive rates and fast delivery.
        </p>
      </div>
      
      <TransferFlow />
    </div>
  );
}
