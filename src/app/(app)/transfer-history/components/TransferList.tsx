'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransferHistory, cancelTransfer } from '@/services/history-service';
import { useToast } from '@/hooks/use-toast';

interface TransferListProps {
  transfers: TransferHistory[];
  onViewDetails: (transfer: TransferHistory) => void;
  onTransferCancelled: () => void;
}

export function TransferList({ transfers, onViewDetails, onTransferCancelled }: TransferListProps) {
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Handle transfer cancellation
  const handleCancelTransfer = async (id: string) => {
    setCancellingId(id);
    
    try {
      await cancelTransfer(id);
      
      toast({
        title: 'Transfer Cancelled',
        description: 'The transfer has been successfully cancelled.',
      });
      
      onTransferCancelled();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel transfer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (transfers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No transfers found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          No transfers match your current filters. Try adjusting your search criteria or create a new transfer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <motion.div
          key={transfer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{transfer.receiver.name}</h3>
                      <Badge variant={
                        transfer.status === 'completed' ? 'success' :
                        transfer.status === 'pending' ? 'warning' :
                        transfer.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {transfer.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {transfer.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {transfer.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Transfer ID: {transfer.id}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(transfer.date), 'MMM d, yyyy')} at {format(new Date(transfer.date), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: transfer.currency
                      }).format(transfer.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {transfer.purpose || 'Personal Transfer'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {transfer.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelTransfer(transfer.id)}
                        disabled={cancellingId === transfer.id}
                        className="h-8 rounded-full"
                      >
                        {cancellingId === transfer.id ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            <span>Cancelling</span>
                          </>
                        ) : (
                          <span>Cancel</span>
                        )}
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(transfer)}
                      className="h-8 rounded-full"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
