'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, User, Users, FileText, DollarSign, CheckCircle, Shield, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';
import { useSendMoneyForm } from './hooks/useSendMoneyForm';
import { SenderSelection } from './components/SenderSelection';
import { ReceiverSelection } from './components/ReceiverSelection';
import { TransferDetails } from './components/TransferDetails';
import { AmountEntry } from './components/AmountEntry';
import { ConfirmationStep } from './components/ConfirmationStep';
import { ProgressIndicator } from './components/ProgressIndicator';

// Define step interfaces
interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function SendMoneyPage() {
  const {
    steps: formSteps,
    activeStep,
    navigationDirection,
    transferComplete,
    showSuccessMessage,
    isSubmitting,
    initialLoading,
    errors,
    searchQuery,
    setSearchQuery,
    selectedSender,
    setSelectedSender,
    selectedReceiver,
    setSelectedReceiver,
    showNewSenderForm,
    setShowNewSenderForm,
    showNewReceiverForm,
    setShowNewReceiverForm,
    formData,
    setFormData,
    filteredClients,
    handleNavigation,
    canProceed,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    calculateFee,
    calculateRecipientAmount,
    calculateTotalAmount,
    handleSendAnother
  } = useSendMoneyForm();
  
  // Define our steps with icons and colors
  const steps: Step[] = [
    { 
      id: 1, 
      title: 'Sender', 
      icon: <User className="h-5 w-5" />, 
      color: 'bg-blue-500',
      description: 'Select who is sending the money'
    },
    { 
      id: 2, 
      title: 'Receiver', 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-green-500',
      description: 'Select who will receive the money'
    },
    { 
      id: 3, 
      title: 'Details', 
      icon: <FileText className="h-5 w-5" />, 
      color: 'bg-purple-500',
      description: 'Provide details about your transfer'
    },
    { 
      id: 4, 
      title: 'Amount', 
      icon: <DollarSign className="h-5 w-5" />, 
      color: 'bg-amber-500',
      description: 'Enter the amount you want to send'
    },
    { 
      id: 5, 
      title: 'Confirm', 
      icon: <CheckCircle className="h-5 w-5" />, 
      color: 'bg-emerald-500',
      description: 'Review and confirm your transfer details'
    }
  ];
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate progress percentage
  const progressPercentage = Math.round((activeStep / steps.length) * 100);
  
  // Add event listener for form submission from ConfirmationStep
  useEffect(() => {
    const handleFormSubmit = () => {
      if (activeStep === 5 && formData.termsAccepted && !isSubmitting) {
        // Trigger the next step navigation which will call handleSubmit() in the hook
        handleNavigation('next');
      }
    };
    
    window.addEventListener('submit-form', handleFormSubmit);
    return () => window.removeEventListener('submit-form', handleFormSubmit);
  }, [activeStep, formData.termsAccepted, isSubmitting, handleNavigation]);
  
  // Render the current step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <SenderSelection
            initialLoading={initialLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredClients={filteredClients}
            selectedSender={selectedSender}
            setSelectedSender={setSelectedSender}
            setShowNewSenderForm={setShowNewSenderForm}
          />
        );
      case 2:
        return (
          <ReceiverSelection
            initialLoading={initialLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredClients={filteredClients}
            selectedReceiver={selectedReceiver}
            setSelectedReceiver={setSelectedReceiver}
            setShowNewReceiverForm={setShowNewReceiverForm}
          />
        );
      case 3:
        return (
          <TransferDetails
            formData={formData}
            handleSelectChange={handleSelectChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <AmountEntry
            formData={formData}
            handleInputChange={handleInputChange}
            calculateFee={calculateFee}
            calculateRecipientAmount={calculateRecipientAmount}
            calculateTotalAmount={calculateTotalAmount}
            errors={errors}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            formData={formData}
            selectedSender={selectedSender}
            selectedReceiver={selectedReceiver}
            handleCheckboxChange={handleCheckboxChange}
            isSubmitting={isSubmitting}
            errors={errors}
            transferComplete={transferComplete}
            handleSendAnother={handleSendAnother}
            calculateFee={calculateFee}
            calculateRecipientAmount={calculateRecipientAmount}
            calculateTotalAmount={calculateTotalAmount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header - iOS Style */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {activeStep > 1 && (
              <motion.button 
                onClick={() => handleNavigation('back')}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Send Money</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {activeStep} of {steps.length}
            </span>
          </div>
        </div>
      </header>
      
      {/* Enhanced Progress bar - iOS Style */}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 w-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600" 
          initial={{ width: 0, x: -20 }}
          animate={{ width: `${progressPercentage}%`, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
          }}
        />
      </div>
      
      {/* Main content - Responsive Layout for Larger Screens with reduced padding */}
      <main className="container mx-auto px-4 py-4 pb-16 flex flex-col lg:flex-row lg:gap-6 lg:items-start">
        {isLoading || initialLoading ? (
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mx-auto"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mt-8"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col max-w-7xl mx-auto">
            {/* Horizontal Progress Indicator - iOS Style */}
            <ProgressIndicator steps={steps} activeStep={activeStep} />
            
            {/* Step content */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8">
                
                {/* Render the active step component */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {activeStep > 1 && (
                  <Button
                    onClick={() => handleNavigation('back')}
                    variant="outline"
                    className="rounded-xl border-gray-300 dark:border-gray-700 order-2 sm:order-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                
                {activeStep < steps.length && (
                  <motion.div
                    whileHover={{ scale: canProceed ? 1.01 : 1 }}
                    whileTap={{ scale: canProceed ? 0.98 : 1 }}
                    className="order-1 sm:order-2"
                  >
                    <Button
                      onClick={() => handleNavigation('next')}
                      className={cn(
                        "rounded-xl w-full sm:w-auto",
                        !canProceed ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" :
                        "bg-blue-500 hover:bg-blue-600 text-white"
                      )}
                      disabled={!canProceed || isSubmitting}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Success Message Overlay */}
      <AnimatePresence>
        {showSuccessMessage && (
          <ConfettiSuccess
            message="Transfer Successful!"
            description={`Your money transfer has been processed successfully.`}
            actionLabel="Go to Dashboard"
            onActionClick={() => window.location.href = '/dashboard'}
            onSendAnother={handleSendAnother}
            amount={formData.amount}
            currency={formData.currency || '$'}
            receiverName={selectedReceiver?.name || 'Recipient'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
