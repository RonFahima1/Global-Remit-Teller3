'use client';

import { useState } from 'react';
import { ClientSelection } from './components/ClientSelection';
import { PersonalInfoVerification } from './components/PersonalInfoVerification';
import { DocumentUpload } from './components/DocumentUpload';
import { ReviewAndSubmit } from './components/ReviewAndSubmit';
import { ConfirmationStep } from './components/ConfirmationStep';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientVerificationPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the KYC verification flow
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  // Steps for the KYC verification process
  const steps = ['Client', 'Personal Info', 'Documents', 'Review', 'Complete'];

  // Handle client selection
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setCurrentStep(1);
  };

  // Handle personal info verification
  const handleInfoVerified = (info: any) => {
    setPersonalInfo(info);
    setCurrentStep(2);
  };

  // Handle document upload
  const handleDocumentsUploaded = (docs: any[]) => {
    setDocuments(docs);
    setCurrentStep(3);
  };

  // Handle KYC submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to submit the KYC verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update client KYC status
      if (selectedClient) {
        selectedClient.kycStatus = 'pending';
      }
      
      // Show success toast
      toast({
        title: "KYC Verification Submitted",
        description: "Your verification request has been submitted successfully.",
      });
      
      // Move to confirmation step
      setCurrentStep(4);
    } catch (error) {
      console.error('Error submitting KYC verification:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the flow to start a new verification
  const handleComplete = () => {
    setSelectedClient(null);
    setPersonalInfo(null);
    setDocuments([]);
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
        <h1 className="text-h1 font-h1 text-foreground">KYC Verification</h1>
        <p className="text-muted-foreground">Complete your identity verification to access all features</p>
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
          <PersonalInfoVerification 
            client={selectedClient} 
            onInfoVerified={handleInfoVerified} 
            onBack={handleBack}
            isLoading={isLoading} 
          />
        )}

        {currentStep === 2 && selectedClient && personalInfo && (
          <DocumentUpload 
            client={selectedClient} 
            onDocumentsUploaded={handleDocumentsUploaded} 
            onBack={handleBack}
            isLoading={isLoading} 
          />
        )}

        {currentStep === 3 && selectedClient && personalInfo && documents.length > 0 && (
          <ReviewAndSubmit 
            client={selectedClient} 
            personalInfo={personalInfo}
            documents={documents}
            onSubmit={handleSubmit} 
            onBack={handleBack}
            isLoading={isLoading} 
          />
        )}

        {currentStep === 4 && selectedClient && (
          <ConfirmationStep 
            client={selectedClient} 
            onComplete={handleComplete} 
          />
        )}
      </div>
    </div>
  );
}
