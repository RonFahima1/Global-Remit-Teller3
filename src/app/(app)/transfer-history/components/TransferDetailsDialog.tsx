'use client';

import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  Download,
  Printer,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { TransferHistory } from '@/services/history-service';
import { getTransferReceipt } from '@/services/transfer-service';
import { useToast } from '@/hooks/use-toast';

interface TransferDetailsDialogProps {
  transfer: TransferHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferDetailsDialog({ 
  transfer, 
  open, 
  onOpenChange 
}: TransferDetailsDialogProps) {
  const { toast } = useToast();

  if (!transfer) return null;

  const handlePrint = async () => {
    try {
      const receipt = await getTransferReceipt(transfer.id);
      const url = URL.createObjectURL(receipt);
      const printWindow = window.open(url);
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to print receipt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async () => {
    try {
      const receipt = await getTransferReceipt(transfer.id);
      const url = URL.createObjectURL(receipt);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${transfer.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download receipt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const receipt = await getTransferReceipt(transfer.id);
        const file = new File([receipt], `receipt-${transfer.id}.pdf`, { type: 'application/pdf' });
        
        await navigator.share({
          title: 'Transfer Receipt',
          text: `Receipt for transfer to ${transfer.receiver.name}`,
          files: [file]
        });
      } else {
        toast({
          title: 'Sharing not supported',
          description: 'Your browser does not support sharing. Please download the receipt instead.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share receipt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Details</DialogTitle>
          <DialogDescription>
            View the details of your money transfer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-primary/10">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Money Transfer</span>
            </div>
            
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
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {format(new Date(transfer.date), 'MMMM d, yyyy')} at {format(new Date(transfer.date), 'h:mm a')}
            </span>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Transfer ID</h4>
              <p className="font-medium">{transfer.id}</p>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Amount</h4>
              <p className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: transfer.currency
                }).format(transfer.amount)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Recipient</h4>
              <p className="font-medium">{transfer.receiver.name}</p>
              <p className="text-sm text-muted-foreground">{transfer.receiver.country}</p>
            </div>
            
            {transfer.purpose && (
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">Purpose</h4>
                <p className="font-medium">{transfer.purpose}</p>
              </div>
            )}
            
            {transfer.reference && (
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">Reference</h4>
                <p className="font-medium">{transfer.reference}</p>
              </div>
            )}
          </div>
          
          {transfer.status === 'completed' && (
            <>
              <Separator />
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 rounded-full"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 rounded-full"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
