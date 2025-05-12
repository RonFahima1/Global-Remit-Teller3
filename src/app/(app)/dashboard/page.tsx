'use client';
import { Suspense } from 'react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { DashboardIndex } from './components/DashboardIndex';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Suspense fallback={<LoadingOverlay />}>
        <DashboardIndex />
      </Suspense>
    </div>
  );
}
