'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Printer, Download, ArrowRight, Copy } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useToast } from '@/hooks/use-toast';

interface ConfirmationStepProps {
  client: any;
  depositDetails: {
    amount: number;
    currency: string;
    note: string;
    source: string;
    transactionId: string;
    timestamp: Date;
  };
  onComplete: () => void;
}

export function ConfirmationStep({ client, depositDetails, onComplete }: ConfirmationStepProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Format source of funds for display
  const formatSource = (source: string) => {
    return source.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCopyReceipt = () => {
    const receiptText = `
      DEPOSIT RECEIPT
      Transaction ID: ${depositDetails.transactionId}
      Date: ${depositDetails.timestamp.toLocaleString()}
      
      Client: ${client.firstName} ${client.lastName}
      Client ID: ${client.id}
      
      Amount: ${formatCurrency(depositDetails.amount, depositDetails.currency)}
      Source: ${formatSource(depositDetails.source)}
      
      Note: ${depositDetails.note || 'N/A'}
      
      Thank you for using Global Remit Teller
    `;
    
    navigator.clipboard.writeText(receiptText.trim());
    setCopied(true);
    
    toast({
      title: "Receipt copied to clipboard",
      description: "You can now paste it anywhere",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintReceipt = () => {
    // In a real app, this would trigger a print dialog with a formatted receipt
    window.print();
  };

  return (
    <Card className="card-ios">
      <CardHeader className="bg-green-50 dark:bg-green-950/20 border-b">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-center text-h3 font-h3 text-green-600 dark:text-green-400">
          Deposit Successful
        </CardTitle>
        <CardDescription className="text-center">
          The deposit has been processed successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Receipt */}
        <div className="bg-muted/50 border rounded-lg p-4 space-y-4">
          <div className="text-center pb-2 border-b">
            <h3 className="font-bold text-lg">DEPOSIT RECEIPT</h3>
            <p className="text-sm text-muted-foreground">
              {depositDetails.timestamp.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{depositDetails.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client ID</p>
                <p className="font-medium">{client.id}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{client.firstName} {client.lastName}</p>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-bold text-xl">{formatCurrency(depositDetails.amount, depositDetails.currency)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Source of Funds</p>
              <p className="font-medium">{formatSource(depositDetails.source)}</p>
            </div>
            
            {depositDetails.note && (
              <div>
                <p className="text-sm text-muted-foreground">Note</p>
                <p className="font-medium">{depositDetails.note}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={handleCopyReceipt}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied' : 'Copy Receipt'}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
            <Printer className="h-4 w-4 mr-1" />
            Print Receipt
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </Button>
        </div>
        
        {/* Updated Balance */}
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-center mb-1">Updated Balance</p>
          <p className="text-center font-bold text-lg">
            {formatCurrency(
              (client.balances?.find(b => b.currency === depositDetails.currency)?.amount || 0) + depositDetails.amount,
              depositDetails.currency
            )}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onComplete}>
          New Deposit
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Dashboard
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
