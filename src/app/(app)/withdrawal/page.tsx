'use client';

import { useState } from 'react';
import { ClientSelection } from './components/ClientSelection';
import { AmountEntry } from './components/AmountEntry';
import { VerificationStep } from './components/VerificationStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { generateTransactionId } from '@/utils/format';
import { useToast } from '@/hooks/use-toast';

// Mock data for client balances
const mockClientBalances = [
  { currency: 'USD', amount: 1500.75 },
  { currency: 'EUR', amount: 750.25 },
  { currency: 'ILS', amount: 5000.00 },
];

export default function WithdrawalPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the withdrawal flow
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [withdrawalDetails, setWithdrawalDetails] = useState<{
    amount: number;
    currency: string;
    note: string;
    transactionId?: string;
    timestamp?: Date;
  }>({ amount: 0, currency: '', note: '' });

  // Steps for the withdrawal process
  const steps = ['Client', 'Amount', 'Verify', 'Complete'];

  // Handle client selection
  const handleClientSelect = (client: any) => {
    // In a real app, we would fetch the client's balances from the API
    // For now, we'll use mock data
    setSelectedClient({
      ...client,
      balances: mockClientBalances
    });
    setCurrentStep(1);
  };

  // Handle amount entry
  const handleAmountSubmit = (amount: number, currency: string, note: string) => {
    setWithdrawalDetails({ amount, currency, note });
    setCurrentStep(2);
  };

  // Handle verification
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to process the withdrawal
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate transaction details
      const transactionId = generateTransactionId('WD');
      const timestamp = new Date();
      
      // Update the withdrawal details with transaction info
      setWithdrawalDetails(prev => ({
        ...prev,
        transactionId,
        timestamp
      }));
      
      // Update client balance (in a real app, this would happen server-side)
      if (selectedClient?.balances) {
        const updatedBalances = selectedClient.balances.map((balance: any) => 
          balance.currency === withdrawalDetails.currency
            ? { ...balance, amount: balance.amount - withdrawalDetails.amount }
            : balance
        );
        setSelectedClient({ ...selectedClient, balances: updatedBalances });
      }
      
      // Show success toast
      toast({
        title: "Withdrawal Successful",
        description: `${withdrawalDetails.amount} ${withdrawalDetails.currency} has been withdrawn.`,
      });
      
      // Move to confirmation step
      setCurrentStep(3);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing the withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the flow to start a new withdrawal
  const handleComplete = () => {
    setSelectedClient(null);
    setWithdrawalDetails({ amount: 0, currency: '', note: '' });
    setCurrentStep(0);
  };

  // Handle going back to the previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Loading state for initial data fetch
  if (isLoading && currentStep === 0) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-h1 font-h1 text-foreground">Client Withdrawal</h1>
        <p className="text-muted-foreground">Withdraw funds from client accounts</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} steps={steps} />
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {currentStep === 0 && (
          <ClientSelection 
            onClientSelected={handleClientSelect} 
            isLoading={isLoading} 
          />
        )}

        {currentStep === 1 && selectedClient && (
          <AmountEntry 
            client={selectedClient} 
            onAmountSubmit={handleAmountSubmit} 
            isLoading={isLoading} 
          />
        )}

        {currentStep === 2 && selectedClient && (
          <VerificationStep 
            client={selectedClient} 
            withdrawalDetails={withdrawalDetails} 
            onVerify={handleVerify} 
            onBack={handleBack}
            isLoading={isLoading} 
          />
        )}

        {currentStep === 3 && selectedClient && withdrawalDetails.transactionId && (
          <ConfirmationStep 
            client={selectedClient} 
            withdrawalDetails={withdrawalDetails as any} 
            onComplete={handleComplete} 
          />
        )}
      </div>
    </div>
  );
}
