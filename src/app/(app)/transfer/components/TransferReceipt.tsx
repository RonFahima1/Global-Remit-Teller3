/**
 * TransferReceipt Component
 * Displays and handles receipt generation for completed transfers
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateAndDownloadReceipt, ReceiptData } from '@/lib/receipt-generator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Download, Mail, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface TransferReceiptProps {
  transactionData: {
    transactionId: string;
    trackingNumber: string;
    date: string;
    sender: {
      name: string;
      id: string;
      country?: string;
    };
    receiver: {
      name: string;
      id: string;
      country?: string;
    };
    amount: {
      sendAmount: number;
      receiveAmount: number;
      sendCurrency: string;
      receiveCurrency: string;
      exchangeRate: number;
      fee: number;
      totalCost: number;
    };
    details: {
      purpose: string;
      sourceOfFunds: string;
      paymentMethod: string;
      deliveryMethod: string;
      notes?: string;
      referenceNumber?: string;
    };
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
  };
  onClose: () => void;
  onNewTransfer: () => void;
}

const TransferReceipt: React.FC<TransferReceiptProps> = ({
  transactionData,
  onClose,
  onNewTransfer
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle download receipt
  const handleDownloadReceipt = () => {
    setIsGenerating(true);
    
    try {
      // Convert transaction data to receipt data format
      const receiptData: ReceiptData = {
        ...transactionData
      };
      
      // Generate and download receipt
      generateAndDownloadReceipt(receiptData);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle email receipt
  const handleEmailReceipt = () => {
    // In a real app, this would send the receipt to the user's email
    toast.success('Receipt sent to email');
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    setIsGenerating(true);
    
    try {
      // Convert transaction data to receipt data format
      const receiptData: ReceiptData = {
        ...transactionData
      };
      
      // Generate receipt and open in new window for printing
      const pdfBlob = generateAndDownloadReceipt(receiptData);
      
      // In a real implementation, we would use a print library
      // For now, we'll just simulate it with a success message
      toast.success('Receipt sent to printer');
    } catch (error) {
      console.error('Error generating receipt for print:', error);
      toast.error('Failed to print receipt');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle share receipt
  const handleShareReceipt = () => {
    // In a real app, this would open a share dialog
    toast.success('Share dialog opened');
  };

  return (
    <div className="space-y-6">
      {/* Success message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
        <div className="bg-green-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-green-800">Transfer Successful</h3>
          <p className="text-sm text-green-600">Your money transfer has been processed successfully.</p>
        </div>
      </div>

      {/* Transaction details card */}
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transfer Receipt</h2>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {transactionData.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4">
          {/* Transaction info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-medium">{transactionData.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-medium">{transactionData.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">{formatDate(transactionData.date)}</p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Sender & Receiver */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Sender</h3>
              <p className="text-sm">{transactionData.sender.name}</p>
              <p className="text-sm text-gray-500">ID: {transactionData.sender.id}</p>
              {transactionData.sender.country && (
                <p className="text-sm text-gray-500">Country: {transactionData.sender.country}</p>
              )}
            </div>
            <div>
              <h3 className="font-medium mb-2">Receiver</h3>
              <p className="text-sm">{transactionData.receiver.name}</p>
              <p className="text-sm text-gray-500">ID: {transactionData.receiver.id}</p>
              {transactionData.receiver.country && (
                <p className="text-sm text-gray-500">Country: {transactionData.receiver.country}</p>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* Amount details */}
          <div>
            <h3 className="font-medium mb-2">Amount Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Send Amount</span>
                <span className="text-sm">
                  {formatCurrency(transactionData.amount.sendAmount, transactionData.amount.sendCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Receive Amount</span>
                <span className="text-sm">
                  {formatCurrency(transactionData.amount.receiveAmount, transactionData.amount.receiveCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Exchange Rate</span>
                <span className="text-sm">
                  1 {transactionData.amount.sendCurrency} = {transactionData.amount.exchangeRate.toFixed(4)} {transactionData.amount.receiveCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fee</span>
                <span className="text-sm">
                  {formatCurrency(transactionData.amount.fee, transactionData.amount.sendCurrency)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Cost</span>
                <span>
                  {formatCurrency(transactionData.amount.totalCost, transactionData.amount.sendCurrency)}
                </span>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Transfer details */}
          <div>
            <h3 className="font-medium mb-2">Transfer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="text-sm">{transactionData.details.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source of Funds</p>
                <p className="text-sm">{transactionData.details.sourceOfFunds}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm">{transactionData.details.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Method</p>
                <p className="text-sm">{transactionData.details.deliveryMethod}</p>
              </div>
              {transactionData.details.referenceNumber && (
                <div>
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="text-sm">{transactionData.details.referenceNumber}</p>
                </div>
              )}
              {transactionData.details.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm">{transactionData.details.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Receipt actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handlePrintReceipt}
          disabled={isGenerating}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleDownloadReceipt}
          disabled={isGenerating}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleEmailReceipt}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleShareReceipt}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onNewTransfer}>
          New Transfer
        </Button>
      </div>
    </div>
  );
};

export default TransferReceipt;
