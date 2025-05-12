/**
 * Transfer Confirmation Component
 * Final step in the money transfer process
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  Check, 
  AlertCircle, 
  Printer, 
  Download, 
  Copy,
  CheckCircle2
} from 'lucide-react';
import { useTransactionService } from '@/components/providers/service-provider';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import TransferReceipt from './TransferReceipt';
import { generateAndDownloadReceipt, ReceiptData } from '@/lib/receipt-generator';

// Types
interface Sender {
  id: string;
  firstName: string;
  lastName: string;
}

interface Receiver {
  id: string;
  firstName: string;
  lastName: string;
  country?: string;
}

interface TransferAmount {
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
}

interface TransferDetailsData {
  purpose: string;
  sourceOfFunds: string;
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
  referenceNumber?: string;
  termsAccepted: boolean;
}

interface TransferConfirmationProps {
  sender: Sender;
  receiver: Receiver;
  amount: TransferAmount;
  details: TransferDetailsData;
  onBack: () => void;
  onComplete: () => void;
}

/**
 * Transfer Confirmation Component
 */
export function TransferConfirmation({ 
  sender, 
  receiver, 
  amount, 
  details, 
  onBack,
  onComplete
}: TransferConfirmationProps) {
  const router = useRouter();
  const transactionService = useTransactionService();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  
  // Get purpose label
  const getPurposeLabel = (value: string) => {
    const purposeMap: Record<string, string> = {
      'family_support': 'Family Support',
      'education': 'Education',
      'medical': 'Medical Expenses',
      'business': 'Business',
      'travel': 'Travel',
      'gift': 'Gift',
      'other': 'Other'
    };
    
    return purposeMap[value] || value;
  };
  
  // Get source of funds label
  const getSourceOfFundsLabel = (value: string) => {
    const sourceMap: Record<string, string> = {
      'salary': 'Salary',
      'savings': 'Savings',
      'business_income': 'Business Income',
      'investment': 'Investment',
      'loan': 'Loan',
      'gift': 'Gift',
      'other': 'Other'
    };
    
    return sourceMap[value] || value;
  };
  
  // Get payment method label
  const getPaymentMethodLabel = (value: string) => {
    const methodMap: Record<string, string> = {
      'cash': 'Cash',
      'debit_card': 'Debit Card',
      'credit_card': 'Credit Card',
      'bank_transfer': 'Bank Transfer'
    };
    
    return methodMap[value] || value;
  };
  
  // Get delivery method label
  const getDeliveryMethodLabel = (value: string) => {
    const methodMap: Record<string, string> = {
      'cash': 'Cash Pickup',
      'bank_deposit': 'Bank Deposit',
      'mobile_wallet': 'Mobile Wallet',
      'home_delivery': 'Home Delivery'
    };
    
    return methodMap[value] || value;
  };
  
  // Handle confirm button click
  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      // Create transaction
      const response = await transactionService.createTransaction({
        senderId: sender.id,
        receiverId: receiver.id,
        sendAmount: amount.sendAmount,
        receiveAmount: amount.receiveAmount,
        sendCurrency: amount.sendCurrency,
        receiveCurrency: amount.receiveCurrency,
        exchangeRate: amount.exchangeRate,
        fee: amount.fee,
        purpose: details.purpose,
        sourceOfFunds: details.sourceOfFunds,
        paymentMethod: details.paymentMethod,
        deliveryMethod: details.deliveryMethod,
        notes: details.notes,
        referenceNumber: details.referenceNumber
      });
      
      // Set transaction info
      setTransactionId(response.transactionId);
      setTrackingNumber(response.trackingNumber);
      
      // Show success message
      toast.success('Transaction completed successfully');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to complete transaction');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle copy tracking number
  const handleCopyTrackingNumber = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      toast.success('Tracking number copied to clipboard');
    }
  };
  
  // Handle print receipt
  const handlePrintReceipt = () => {
    if (transactionId && trackingNumber) {
      const receiptData: ReceiptData = {
        transactionId: transactionId,
        trackingNumber: trackingNumber,
        date: new Date().toISOString(),
        sender: {
          name: `${sender.firstName} ${sender.lastName}`,
          id: sender.id
        },
        receiver: {
          name: `${receiver.firstName} ${receiver.lastName}`,
          id: receiver.id,
          country: receiver.country
        },
        amount: {
          sendAmount: amount.sendAmount,
          receiveAmount: amount.receiveAmount,
          sendCurrency: amount.sendCurrency,
          receiveCurrency: amount.receiveCurrency,
          exchangeRate: amount.exchangeRate,
          fee: amount.fee,
          totalCost: amount.totalCost
        },
        details: {
          purpose: getPurposeLabel(details.purpose),
          sourceOfFunds: getSourceOfFundsLabel(details.sourceOfFunds),
          paymentMethod: getPaymentMethodLabel(details.paymentMethod),
          deliveryMethod: getDeliveryMethodLabel(details.deliveryMethod),
          notes: details.notes,
          referenceNumber: details.referenceNumber
        },
        status: 'completed'
      };
      
      try {
        // In a production app, this would use a proper print API
        window.print();
        toast.success('Receipt printed successfully');
      } catch (error) {
        console.error('Error printing receipt:', error);
        toast.error('Failed to print receipt');
      }
    }
  };
  
  // Handle download receipt
  const handleDownloadReceipt = () => {
    if (transactionId && trackingNumber) {
      const receiptData: ReceiptData = {
        transactionId: transactionId,
        trackingNumber: trackingNumber,
        date: new Date().toISOString(),
        sender: {
          name: `${sender.firstName} ${sender.lastName}`,
          id: sender.id
        },
        receiver: {
          name: `${receiver.firstName} ${receiver.lastName}`,
          id: receiver.id,
          country: receiver.country
        },
        amount: {
          sendAmount: amount.sendAmount,
          receiveAmount: amount.receiveAmount,
          sendCurrency: amount.sendCurrency,
          receiveCurrency: amount.receiveCurrency,
          exchangeRate: amount.exchangeRate,
          fee: amount.fee,
          totalCost: amount.totalCost
        },
        details: {
          purpose: getPurposeLabel(details.purpose),
          sourceOfFunds: getSourceOfFundsLabel(details.sourceOfFunds),
          paymentMethod: getPaymentMethodLabel(details.paymentMethod),
          deliveryMethod: getDeliveryMethodLabel(details.deliveryMethod),
          notes: details.notes,
          referenceNumber: details.referenceNumber
        },
        status: 'completed'
      };
      
      try {
        generateAndDownloadReceipt(receiptData);
      } catch (error) {
        console.error('Error generating receipt:', error);
        toast.error('Failed to generate receipt');
      }
    }
  };
  
  // Handle new transaction
  const handleNewTransaction = () => {
    onComplete();
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto print:shadow-none" id="receipt">
      <CardHeader className="print:pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{isSuccess ? 'Transaction Complete' : 'Confirm Transfer'}</CardTitle>
            <CardDescription>
              {isSuccess 
                ? 'The money transfer has been successfully processed'
                : 'Review and confirm the transfer details'}
            </CardDescription>
          </div>
          
          {isSuccess && (
            <Badge className="bg-green-500">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 print:space-y-4">
        {isSuccess ? (
          <></>  
        ) : (
          <>
            <div className="space-y-4 print:space-y-2">
              <h3 className="text-sm font-medium">Transfer Information</h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
                </div>
                
                {trackingNumber && (
                  <div className="flex items-start gap-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Tracking Number</p>
                      <p className="text-sm font-medium">{trackingNumber}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 print:hidden" 
                      onClick={handleCopyTrackingNumber}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-muted-foreground">Reference Number</p>
                  <p className="text-sm font-medium">{details.referenceNumber}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">
                    <span className="text-yellow-600">Pending</span>
                  </p>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Sender</p>
                  <p className="text-sm font-medium">{sender.firstName} {sender.lastName}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Receiver</p>
                  <p className="text-sm font-medium">{receiver.firstName} {receiver.lastName}</p>
                  {receiver.country && (
                    <p className="text-xs text-muted-foreground">{receiver.country}</p>
                  )}
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Send Amount</p>
                  <p className="text-sm font-medium">{formatCurrency(amount.sendAmount, amount.sendCurrency)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Receive Amount</p>
                  <p className="text-sm font-medium">{formatCurrency(amount.receiveAmount, amount.receiveCurrency)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Exchange Rate</p>
                  <p className="text-sm font-medium">
                    1 {amount.sendCurrency} = {amount.exchangeRate.toFixed(4)} {amount.receiveCurrency}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Fee</p>
                  <p className="text-sm font-medium">{formatCurrency(amount.fee, amount.sendCurrency)}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-sm font-bold">{formatCurrency(amount.totalCost, amount.sendCurrency)}</p>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Purpose</p>
                  <p className="text-sm font-medium">{getPurposeLabel(details.purpose)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Source of Funds</p>
                  <p className="text-sm font-medium">{getSourceOfFundsLabel(details.sourceOfFunds)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <p className="text-sm font-medium">{getPaymentMethodLabel(details.paymentMethod)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Method</p>
                  <p className="text-sm font-medium">{getDeliveryMethodLabel(details.deliveryMethod)}</p>
                </div>
              </div>
              
              {details.notes && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{details.notes}</p>
                  </div>
                </>
              )}
            </div>
            
            <Alert className="print:hidden">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Please review carefully</AlertTitle>
              <AlertDescription>
                Once confirmed, this transaction cannot be easily reversed. Please ensure all details are correct.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
      
      {isSuccess ? (
        <TransferReceipt
          transactionData={{
            transactionId: transactionId || 'N/A',
            trackingNumber: trackingNumber || 'N/A',
            date: new Date().toISOString(),
            sender: {
              name: `${sender.firstName} ${sender.lastName}`,
              id: sender.id,
              country: ''
            },
            receiver: {
              name: `${receiver.firstName} ${receiver.lastName}`,
              id: receiver.id,
              country: receiver.country
            },
            amount: {
              sendAmount: amount.sendAmount,
              receiveAmount: amount.receiveAmount,
              sendCurrency: amount.sendCurrency,
              receiveCurrency: amount.receiveCurrency,
              exchangeRate: amount.exchangeRate,
              fee: amount.fee,
              totalCost: amount.totalCost
            },
            details: {
              purpose: getPurposeLabel(details.purpose),
              sourceOfFunds: getSourceOfFundsLabel(details.sourceOfFunds),
              paymentMethod: getPaymentMethodLabel(details.paymentMethod),
              deliveryMethod: getDeliveryMethodLabel(details.deliveryMethod),
              notes: details.notes,
              referenceNumber: details.referenceNumber
            },
            status: 'completed'
          }}
          onClose={onComplete}
          onNewTransfer={handleNewTransaction}
        />
      ) : (
        <CardFooter className="flex justify-between print:hidden">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Transfer
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
