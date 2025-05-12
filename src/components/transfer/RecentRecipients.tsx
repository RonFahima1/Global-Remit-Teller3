'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickTransferCard } from './QuickTransferCard';
import { getRecentRecipients, RecentRecipient } from '@/services/transfer-service';
import { handleApiError } from '@/utils/api-error-handler';

interface RecentRecipientsProps {
  limit?: number;
  showViewAll?: boolean;
}

export function RecentRecipients({ limit = 3, showViewAll = true }: RecentRecipientsProps) {
  const [recipients, setRecipients] = useState<RecentRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentRecipients();
        // Apply the limit
        setRecipients(data.slice(0, limit));
        setError(null);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="h-24 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md text-sm text-destructive">
        Failed to load recent recipients: {error}
      </div>
    );
  }

  if (recipients.length === 0) {
    return (
      <div className="p-4 border border-muted rounded-md text-sm text-muted-foreground">
        No recent recipients found. Send your first transfer to see recipients here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recipients.map((recipient) => (
        <QuickTransferCard key={recipient.id} recipient={recipient} />
      ))}
      
      {showViewAll && recipients.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => window.location.href = '/transfer-history'}
          >
            <span>View All Transfers</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
