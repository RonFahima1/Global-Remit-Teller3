'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Printer, Download, Share2, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTransfer } from '@/context/transfer-context';
import { submitTransfer, getTransferReceipt } from '@/services/transfer-service';
import { handleApiError } from '@/utils/api-error-handler';
import { cn } from '@/lib/utils';

// Define the types for the component
interface ConfirmationProps {}

export const Confirmation: React.FC<ConfirmationProps> = () => {
  const { state, dispatch } = useTransfer();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  
  // Handle going back to the previous step
  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };
  
  // Handle submitting the transfer
  const handleSubmit = async () => {
    // Validate required fields
    if (!state.sender || !state.receiver || !state.amount) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all required information before submitting.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update processing state
      dispatch({ type: 'SET_PROCESSING', payload: true });
      
      // Prepare transfer data
      const transferData = {
        senderId: state.sender.id,
        receiverId: state.receiver.id,
        amount: state.amount,
        sourceCurrency: state.sourceCurrency,
        targetCurrency: state.targetCurrency,
        exchangeRate: state.exchangeRate,
        fee: state.fee,
        totalAmount: state.totalAmount,
        purpose: state.purpose,
        reference: state.reference
      };
      
      // Submit the transfer
      const result = await submitTransfer(transferData);
      
      // Update UI state
      setTransactionId(result.id);
      setTransactionDate(new Date());
      setIsSuccess(true);
      
      // Show success toast
      toast({
        title: 'Transfer Successful',
        description: `Your transfer has been submitted successfully.`,
      });
      
    } catch (error) {
      // Handle errors
      handleApiError(error, 'Failed to submit transfer');
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit transfer. Please try again.' });
    } finally {
      // Reset loading states
      setIsSubmitting(false);
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };
  
  // Handle printing the receipt
  const handlePrint = () => {
    window.print();
  };
  
  // Handle downloading the receipt
  const handleDownloadReceipt = async () => {
    if (!transactionId) return;
    
    setDownloadingReceipt(true);
    
    try {
      const receiptBlob = await getTransferReceipt(transactionId);
      const url = URL.createObjectURL(receiptBlob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `transfer-receipt-${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Receipt Downloaded',
        description: 'The receipt has been downloaded successfully.',
      });
    } catch (error) {
      handleApiError(error, 'Failed to download receipt');
    } finally {
      setDownloadingReceipt(false);
    }
  };
  
  // Handle sharing the receipt
  const handleShareReceipt = async () => {
    if (!navigator.share) {
      toast({
        title: 'Sharing Not Supported',
        description: 'Your browser does not support the Web Share API.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await navigator.share({
        title: 'Money Transfer Receipt',
        text: `Money transfer of ${state.amount} ${state.sourceCurrency} to ${state.receiver?.name}. Transaction ID: ${transactionId}`,
        url: window.location.href,
      });
    } catch (error) {
      // User cancelled or share failed
      console.error('Share failed:', error);
    }
  };
  
  // Handle starting a new transfer
  const handleNewTransfer = () => {
    dispatch({ type: 'RESET' });
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {!isSuccess && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-2 rounded-full h-9 w-9"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-xl font-medium">{isSuccess ? 'Transfer Successful' : 'Confirm Transfer'}</h2>
        </div>
        
        {!isSuccess && !isSubmitting && (
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-5"
          >
            <span>Submit Transfer</span>
          </Button>
        )}
        
        {isSubmitting && (
          <Button 
            disabled
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-5"
          >
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Processing...</span>
          </Button>
        )}
      </div>
      
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-center py-6"
        >
          {/* Success Icon */}
          <motion.div 
            className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-success/20 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
          >
            <CheckCircle className="h-12 w-12 text-success" />
          </motion.div>
          
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-2">Transfer Successful</h2>
            <p className="text-muted-foreground mb-6">Your money is on its way to {state.receiver?.name}</p>
          </motion.div>
          
          {/* Receipt Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden border-border/50 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Receipt Details</h3>
                  <Badge variant="outline" className="flex items-center gap-1 bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed</span>
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{transactionDate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-medium">Within 24 hours</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sender</span>
                    <span className="font-medium">{state.sender?.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-medium">{state.receiver?.name}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Sent</span>
                    <span className="font-medium">{state.sourceCurrency} {state.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">{state.sourceCurrency} {state.fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-medium">{state.sourceCurrency} {state.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Recipient Gets</span>
                      <span className="font-semibold text-primary">{state.targetCurrency} {state.receiveAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="outline" onClick={handlePrint} className="rounded-full">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadReceipt} 
              className="rounded-full"
              disabled={downloadingReceipt}
            >
              {downloadingReceipt ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleShareReceipt} className="rounded-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Receipt
            </Button>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={handleNewTransfer}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 h-11"
            >
              New Transfer
            </Button>
            
            <Link href="/transfer-history">
              <Button 
                variant="outline"
                className="rounded-full px-6 py-2 h-11"
              >
                View Transfer History
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Transfer Summary</h3>
              <div className="space-y-4">
                {/* Sender and Receiver */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-sm font-medium mb-1">From</p>
                    <p className="font-medium">{state.sender?.name}</p>
                    <p className="text-sm text-muted-foreground">{state.sender?.phone}</p>
                    <p className="text-sm text-muted-foreground">{state.sender?.country}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-sm font-medium mb-1">To</p>
                    <p className="font-medium">{state.receiver?.name}</p>
                    <p className="text-sm text-muted-foreground">{state.receiver?.phone}</p>
                    <p className="text-sm text-muted-foreground">{state.receiver?.country}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Amount Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">{state.sourceCurrency} {state.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exchange Rate</p>
                    <p className="font-medium">1 {state.sourceCurrency} = {state.exchangeRate.toFixed(4)} {state.targetCurrency}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fee</p>
                    <p className="font-medium">{state.sourceCurrency} {state.fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">{state.sourceCurrency} {state.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Recipient Gets */}
                <div className="bg-primary/5 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">Recipient Gets</p>
                  <p className="text-xl font-semibold text-primary">{state.targetCurrency} {state.receiveAmount.toFixed(2)}</p>
                </div>
                
                <Separator />
                
                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium">{state.purpose || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-medium">{state.reference || 'Not specified'}</p>
                  </div>
                </div>
                
                {/* Delivery Time Estimate */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Estimated delivery time: <span className="font-medium text-foreground">Within 24 hours</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
