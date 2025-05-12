/**
 * Transfer Flow Component
 * Manages the complete money transfer process flow
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SenderSelection } from './SenderSelection';
import { ReceiverSelection } from './ReceiverSelection';
import { AmountEntry } from './AmountEntry';
import { TransferDetails } from './TransferDetails';
import { TransferConfirmation } from './TransferConfirmation';
import { Steps, Step } from '@/components/ui/steps';

// Types
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  kycStatus?: 'verified' | 'pending' | 'rejected' | 'not_started';
  riskLevel?: 'low' | 'medium' | 'high';
  avatarUrl?: string;
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

/**
 * Transfer Flow Component
 */
export function TransferFlow() {
  const router = useRouter();
  
  // State for current step
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // State for transfer data
  const [sender, setSender] = useState<Client | null>(null);
  const [receiver, setReceiver] = useState<Client | null>(null);
  const [amount, setAmount] = useState<TransferAmount | null>(null);
  const [details, setDetails] = useState<TransferDetailsData | null>(null);
  
  // Handle sender selection
  const handleSenderSelected = (selectedSender: Client) => {
    setSender(selectedSender);
    setCurrentStep(1);
  };
  
  // Handle new sender
  const handleNewSender = () => {
    // In a real app, this would navigate to a new client form
    router.push('/clients/new?returnTo=transfer');
  };
  
  // Handle receiver selection
  const handleReceiverSelected = (selectedReceiver: Client) => {
    setReceiver(selectedReceiver);
    setCurrentStep(2);
  };
  
  // Handle new receiver
  const handleNewReceiver = () => {
    // In a real app, this would navigate to a new client form
    router.push('/clients/new?returnTo=transfer&senderSelected=true');
  };
  
  // Handle amount confirmation
  const handleAmountConfirmed = (transferAmount: TransferAmount) => {
    setAmount(transferAmount);
    setCurrentStep(3);
  };
  
  // Handle details confirmation
  const handleDetailsConfirmed = (transferDetails: TransferDetailsData) => {
    setDetails(transferDetails);
    setCurrentStep(4);
  };
  
  // Handle back button
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Handle completion
  const handleComplete = () => {
    // Reset the flow
    setSender(null);
    setReceiver(null);
    setAmount(null);
    setDetails(null);
    setCurrentStep(0);
  };
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SenderSelection
            onSenderSelected={handleSenderSelected}
            onNewSender={handleNewSender}
          />
        );
      case 1:
        if (!sender) return null;
        return (
          <ReceiverSelection
            sender={sender}
            onReceiverSelected={handleReceiverSelected}
            onNewReceiver={handleNewReceiver}
            onBack={handleBack}
          />
        );
      case 2:
        if (!sender || !receiver) return null;
        return (
          <AmountEntry
            sender={sender}
            receiver={receiver}
            onAmountConfirmed={handleAmountConfirmed}
            onBack={handleBack}
          />
        );
      case 3:
        if (!sender || !receiver || !amount) return null;
        return (
          <TransferDetails
            sender={sender}
            receiver={receiver}
            amount={amount}
            onDetailsConfirmed={handleDetailsConfirmed}
            onBack={handleBack}
          />
        );
      case 4:
        if (!sender || !receiver || !amount || !details) return null;
        return (
          <TransferConfirmation
            sender={sender}
            receiver={receiver}
            amount={amount}
            details={details}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Steps currentStep={currentStep} className="mb-8">
        <Step title="Sender" description="Select sender" />
        <Step title="Receiver" description="Select receiver" />
        <Step title="Amount" description="Specify amount" />
        <Step title="Details" description="Transfer details" />
        <Step title="Confirm" description="Review and confirm" />
      </Steps>
      
      {renderStep()}
    </div>
  );
}
