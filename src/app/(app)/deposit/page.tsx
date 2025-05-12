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

export default function DepositPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the deposit flow
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [depositDetails, setDepositDetails] = useState<{
    amount: number;
    currency: string;
    note: string;
    source: string;
    transactionId?: string;
    timestamp?: Date;
  }>({ amount: 0, currency: '', note: '', source: 'cash' });

  // Steps for the deposit process
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
  const handleAmountSubmit = (amount: number, currency: string, note: string, source: string) => {
    setDepositDetails({ amount, currency, note, source });
    setCurrentStep(2);
  };

  // Handle verification
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to process the deposit
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate transaction details
      const transactionId = generateTransactionId('DP');
      const timestamp = new Date();
      
      // Update the deposit details with transaction info
      setDepositDetails(prev => ({
        ...prev,
        transactionId,
        timestamp
      }));
      
      // Update client balance (in a real app, this would happen server-side)
      if (selectedClient?.balances) {
        const updatedBalances = selectedClient.balances.map((balance: any) => 
          balance.currency === depositDetails.currency
            ? { ...balance, amount: balance.amount + depositDetails.amount }
            : balance
        );
        setSelectedClient({ ...selectedClient, balances: updatedBalances });
      }
      
      // Show success toast
      toast({
        title: "Deposit Successful",
        description: `${depositDetails.amount} ${depositDetails.currency} has been deposited.`,
      });
      
      // Move to confirmation step
      setCurrentStep(3);
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast({
        title: "Deposit Failed",
        description: "There was an error processing the deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the flow to start a new deposit
  const handleComplete = () => {
    setSelectedClient(null);
    setDepositDetails({ amount: 0, currency: '', note: '', source: 'cash' });
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
          <div className="h-12 w-full bg-muted rounded-md" />
          <div className="h-[400px] w-full bg-muted rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-h1 font-h1 text-foreground">Client Deposit</h1>
        <p className="text-muted-foreground">Deposit funds into client accounts</p>
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
            depositDetails={depositDetails} 
            onVerify={handleVerify} 
            onBack={handleBack}
            isLoading={isLoading} 
          />
        )}

        {currentStep === 3 && selectedClient && depositDetails.transactionId && (
          <ConfirmationStep 
            client={selectedClient} 
            depositDetails={depositDetails as any} 
            onComplete={handleComplete} 
          />
        )}
      </div>
    </div>
  );
}
