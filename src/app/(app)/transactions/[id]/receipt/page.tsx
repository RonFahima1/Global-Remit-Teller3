/**
 * Transaction Receipt Page
 * Displays receipt generation and history for a transaction
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ReceiptGenerator } from '@/components/receipts/ReceiptGenerator';
import { ReceiptHistory } from '@/components/receipts/ReceiptHistory';
import { ReceiptMetadata, ReceiptHistoryItem } from '@/types/receipt';
import { TransactionType } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, History, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

/**
 * Transaction Receipt Page
 */
export default function TransactionReceiptPage() {
  const params = useParams();
  const transactionId = params.id as string;
  
  // State
  const [transaction, setTransaction] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  
  // Load transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // In a real app, this would fetch the transaction from an API
        // For now, we'll use mock data
        setTransaction({
          id: transactionId,
          type: TransactionType.MONEY_TRANSFER,
          date: new Date().toISOString(),
          senderName: 'John Doe',
          senderPhone: '+1234567890',
          senderEmail: 'john.doe@example.com',
          receiverName: 'Jane Smith',
          receiverPhone: '+0987654321',
          amount: 1000,
          fee: 25,
          totalAmount: 1025,
          sourceCurrency: 'USD',
          destinationCurrency: 'EUR',
          exchangeRate: 0.92,
          paymentMethod: 'Credit Card',
          deliveryMethod: 'Bank Transfer',
          status: 'Completed',
          agentName: 'Global Remit Agent',
          locationName: 'Downtown Branch'
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setIsLoading(false);
      }
    };
    
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);
  
  // Handle receipt generation success
  const handleReceiptSuccess = (receiptUrl: string) => {
    // In a real app, this might open the receipt in a new tab
    console.log('Receipt generated:', receiptUrl);
    
    // Switch to history tab to show the new receipt
    setActiveTab('history');
  };
  
  // Handle receipt selection
  const handleSelectReceipt = (receipt: ReceiptHistoryItem) => {
    // In a real app, this might open the receipt in a preview
    console.log('Receipt selected:', receipt);
  };
  
  // Create receipt metadata from transaction
  const getReceiptMetadata = (): ReceiptMetadata => {
    if (!transaction) {
      return {
        transactionId: '',
        transactionType: TransactionType.MONEY_TRANSFER,
        transactionDate: new Date().toISOString(),
        senderName: '',
        receiverName: '',
        amount: 0,
        fee: 0,
        totalAmount: 0,
        sourceCurrency: '',
        destinationCurrency: '',
        paymentMethod: '',
        deliveryMethod: '',
        status: ''
      };
    }
    
    return {
      transactionId: transaction.id,
      transactionType: transaction.type,
      transactionDate: transaction.date,
      senderName: transaction.senderName,
      senderPhone: transaction.senderPhone,
      senderEmail: transaction.senderEmail,
      receiverName: transaction.receiverName,
      receiverPhone: transaction.receiverPhone,
      amount: transaction.amount,
      fee: transaction.fee,
      totalAmount: transaction.totalAmount,
      sourceCurrency: transaction.sourceCurrency,
      destinationCurrency: transaction.destinationCurrency,
      exchangeRate: transaction.exchangeRate,
      paymentMethod: transaction.paymentMethod,
      deliveryMethod: transaction.deliveryMethod,
      status: transaction.status,
      agentName: transaction.agentName,
      agentId: transaction.agentId,
      locationName: transaction.locationName,
      locationId: transaction.locationId,
      referenceNumber: transaction.id
    };
  };
  
  return (
    <Provider store={store}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/transactions/${transactionId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transaction
            </Button>
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transaction Receipt</h1>
            <p className="text-muted-foreground">
              Generate and manage receipts for transaction {transactionId}
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{transaction?.type}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      {transaction?.amount} {transaction?.sourceCurrency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee:</span>
                    <span>
                      {transaction?.fee} {transaction?.sourceCurrency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold">
                      {transaction?.totalAmount} {transaction?.sourceCurrency}
                    </span>
                  </div>
                  
                  {transaction?.exchangeRate && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exchange Rate:</span>
                        <span>
                          1 {transaction?.sourceCurrency} = {transaction?.exchangeRate} {transaction?.destinationCurrency}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipient Gets:</span>
                        <span className="font-medium">
                          {(transaction?.amount * transaction?.exchangeRate).toFixed(2)} {transaction?.destinationCurrency}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{transaction?.status}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="generate">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Receipt
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="mr-2 h-4 w-4" />
                    Receipt History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate" className="space-y-4">
                  <ReceiptGenerator 
                    transactionData={getReceiptMetadata()}
                    onSuccess={handleReceiptSuccess}
                  />
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <ReceiptHistory 
                    transactionId={transactionId}
                    onSelectReceipt={handleSelectReceipt}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </Provider>
  );
}
