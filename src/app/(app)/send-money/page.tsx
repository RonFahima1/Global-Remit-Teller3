'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Users, FileText, DollarSign, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransferProvider, useTransfer } from '@/context/transfer-context';
import { SenderSelection } from './components/SenderSelection';
import { ReceiverSelection } from './components/ReceiverSelection';
import { TransferDetails } from './components/TransferDetails';
import { AmountEntry } from './components/AmountEntry';
import { Confirmation } from './components/Confirmation';
import { Button } from '@/components/ui/button';

// Define step interfaces
interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Main component wrapper with TransferProvider
export default function SendMoneyPage() {
  return (
    <TransferProvider>
      <SendMoneyContent />
    </TransferProvider>
  );
}

// Content component that uses the TransferContext
function SendMoneyContent() {
  const { state, dispatch } = useTransfer();
  
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
      title: 'Amount', 
      icon: <DollarSign className="h-5 w-5" />, 
      color: 'bg-amber-500',
      description: 'Enter the amount you want to send'
    },
    { 
      id: 4, 
      title: 'Details', 
      icon: <FileText className="h-5 w-5" />, 
      color: 'bg-purple-500',
      description: 'Provide details about your transfer'
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
  const progressPercentage = Math.round((state.step / steps.length) * 100);
  
  // Function to go to a specific step
  const goToStep = (step: number) => {
    if (step < state.step) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return <SenderSelection />;
      case 2:
        return <ReceiverSelection />;
      case 3:
        return <AmountEntry />;
      case 4:
        return <TransferDetails />;
      case 5:
        return <Confirmation />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mx-auto"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">
              {steps[state.step - 1]?.title}
            </h2>
            <span className="text-sm text-muted-foreground">
              Step {state.step} of {steps.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: `${Math.round(((state.step - 1) / steps.length) * 100)}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                <motion.div 
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                    step.id < state.step ? "bg-success text-white" : 
                    step.id === state.step ? "bg-primary text-white" : 
                    "bg-muted text-muted-foreground"
                  )}
                  onClick={() => step.id < state.step && goToStep(step.id)}
                  style={{ cursor: step.id < state.step ? 'pointer' : 'default' }}
                  whileHover={step.id < state.step ? { scale: 1.05 } : {}}
                  whileTap={step.id < state.step ? { scale: 0.95 } : {}}
                >
                  {step.id < state.step ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {step.icon}
                    </motion.div>
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs mt-2 text-center",
                  step.id === state.step ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="max-w-3xl mx-auto"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Bottom Navigation */}
        {state.step !== 5 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-10">
            <div className="container mx-auto flex justify-between items-center max-w-3xl">
              <Button 
                variant="outline"
                onClick={handlePrevStep}
                disabled={state.step === 1}
                className="w-28"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleNextStep}
                className="w-28"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
