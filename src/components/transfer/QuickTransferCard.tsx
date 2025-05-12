'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, Repeat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RecentRecipient } from '@/services/transfer-service';
import { formatCurrency } from '@/lib/utils';
import { useTransfer } from '@/context/transfer-context';

interface QuickTransferCardProps {
  recipient: RecentRecipient;
}

export function QuickTransferCard({ recipient }: QuickTransferCardProps) {
  const router = useRouter();
  const { dispatch } = useTransfer();
  const [isLoading, setIsLoading] = useState(false);

  // Get the first letter of first and last name for the avatar
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleQuickTransfer = () => {
    setIsLoading(true);
    
    // Set the transfer context with the recipient information
    dispatch({ 
      type: 'SET_RECEIVER', 
      payload: recipient.receiver 
    });
    
    // Set the amount and currency from the last transfer
    dispatch({
      type: 'SET_AMOUNT',
      payload: {
        amount: recipient.lastAmount,
        sourceCurrency: recipient.lastCurrency,
        targetCurrency: recipient.lastCurrency
      }
    });
    
    // Navigate to the confirmation step
    setTimeout(() => {
      router.push('/send-money?step=4');
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 bg-primary/10 text-primary">
            <span>{getInitials(recipient.receiver.name)}</span>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {recipient.receiver.name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs font-normal">
                {recipient.receiver.country}
              </Badge>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Repeat className="h-3 w-3 mr-1" />
                <span>{recipient.transferCount} transfers</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium">
                {formatCurrency(recipient.lastAmount, recipient.lastCurrency)}
              </span>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {new Date(recipient.lastTransferDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="rounded-full h-8 px-3"
            onClick={handleQuickTransfer}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-1 border-2 border-current border-t-transparent rounded-full" />
                <span>Loading</span>
              </span>
            ) : (
              <span className="flex items-center">
                <span>Send Again</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
