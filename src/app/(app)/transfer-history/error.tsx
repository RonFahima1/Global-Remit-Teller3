'use client';

import { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TransferHistoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Transfer History Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 px-6 pb-8 flex flex-col items-center text-center">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading your transfer history. Please try again or contact support if the problem persists.
          </p>
          
          <div className="flex gap-4">
            <Button onClick={reset} className="rounded-full">
              Try again
            </Button>
            
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'} className="rounded-full">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
