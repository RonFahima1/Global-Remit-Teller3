import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, CreditCard, Receipt, Shield, ArrowLeftRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';
import { Client, FormData } from '../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';

interface ConfirmationStepProps {
  selectedSender: Client | null;
  selectedReceiver: Client | null;
  formData: FormData;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  transferComplete: boolean;
  handleSendAnother: () => void;
  calculateFee: (amount: number) => number;
  calculateRecipientAmount: (amount: number) => number;
  calculateTotalAmount: (amount: number) => number;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedSender,
  selectedReceiver,
  formData,
  handleCheckboxChange,
  errors,
  isSubmitting,
  transferComplete,
  handleSendAnother,
  calculateFee,
  calculateRecipientAmount,
  calculateTotalAmount
}) => {
  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call the handleNavigation('next') function from the parent component
    // This will trigger the form submission in the useSendMoneyForm hook
    if (!isSubmitting) {
      // Simulate a direct form submission
      const submitEvent = new CustomEvent('submit-form');
      window.dispatchEvent(submitEvent);
    }
  };
  
  // Auto-accept terms when scrolling to bottom
  React.useEffect(() => {
    // Set terms accepted to true by default
    if (!formData.termsAccepted) {
      handleCheckboxChange('termsAccepted', true);
    }
    
    // Add scroll detection for better UX
    const handleScroll = () => {
      const marker = document.getElementById('scroll-end-marker');
      if (marker) {
        const rect = marker.getBoundingClientRect();
        // If the marker is visible in the viewport
        if (rect.top <= window.innerHeight) {
          handleCheckboxChange('termsAccepted', true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once to check initial position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  if (transferComplete) {
    return (
      <ConfettiSuccess
        message="Transfer Complete!"
        description={`Your money is on its way to ${selectedReceiver?.name}.`}
        actionLabel="Send Another"
        onActionClick={handleSendAnother}
        amount={formData.amount}
        currency={formData.currency}
        receiverName={selectedReceiver?.name}
      />
    );
  }
  
  const fee = calculateFee(parseFloat(formData.amount) || 0);
  const recipientAmount = calculateRecipientAmount(parseFloat(formData.amount) || 0);
  const totalAmount = calculateTotalAmount(parseFloat(formData.amount) || 0);
  
  // Get human-readable labels for form data
  const getSourceOfFundsLabel = () => {
    const map: Record<string, string> = {
      'salary': 'Salary',
      'savings': 'Savings',
      'business': 'Business Income',
      'investment': 'Investment Returns',
      'gift': 'Gift',
      'other': 'Other'
    };
    return map[formData.sourceOfFunds] || formData.sourceOfFunds;
  };
  
  const getPurposeOfTransferLabel = () => {
    const map: Record<string, string> = {
      'family_support': 'Family Support',
      'education': 'Education',
      'medical': 'Medical Expenses',
      'business': 'Business',
      'travel': 'Travel',
      'gift': 'Gift',
      'other': 'Other'
    };
    return map[formData.purposeOfTransfer] || formData.purposeOfTransfer;
  };
  
  const getTransferTypeLabel = () => {
    const map: Record<string, string> = {
      'bank': 'Bank Transfer',
      'cash': 'Cash Pickup',
      'mobile': 'Mobile Wallet'
    };
    return map[formData.transferType] || formData.transferType;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-5xl mx-auto">
      {/* Header - More compact for laptop displays */}
      {/* Simplified header - no text duplication */}
      <div className="flex items-center justify-center mb-4">
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
      </div>
      
      {/* Transaction Card */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Transaction Flow Visualization - iOS Style */}
        <div className="bg-gradient-to-r from-blue-500/90 to-green-500/90 p-6 relative overflow-hidden">
          {/* iOS-style blur effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            {/* Sender - iOS Card Style */}
            <div className="text-white bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-md">
                  {selectedSender?.name.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="font-medium text-white text-base">{selectedSender?.name}</h4>
                  <p className="text-xs text-blue-100">{selectedSender?.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Transfer Arrow - Animated */}
            <div className="flex-1 flex justify-center items-center px-4 relative">
              <div className="w-full h-0.5 bg-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
              </div>
              <motion.div
                initial={{ x: '-50%', y: '-50%' }}
                animate={{ 
                  x: ['-50%', '-50%'],
                  y: ['-50%', '-50%'],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
                className="absolute top-1/2 left-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg border-2 border-white/50"
              >
                <ArrowLeftRight className="h-4 w-4 text-white" />
              </motion.div>
            </div>
            
            {/* Receiver - iOS Card Style */}
            <div className="text-white bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium text-white text-base text-right">{selectedReceiver?.name}</h4>
                  <p className="text-xs text-green-100 text-right">{selectedReceiver?.phone}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold shadow-md">
                  {selectedReceiver?.name.charAt(0) || 'R'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction Details - iOS Style */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Compact cards for Sender and Receiver Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* iOS-style card for Sender Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/30">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                        <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xs font-medium text-gray-900 dark:text-white">Sender</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Name</div>
                        <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{selectedSender?.name}</div>
                      </div>
                      
                      <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID</div>
                        <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{selectedSender?.idType}: {selectedSender?.idNumber}</div>
                      </div>
                      
                      <div className="flex justify-between items-center py-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                        <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{selectedSender?.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* iOS-style card for Receiver Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:border-green-100 dark:hover:border-green-900/30">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                        <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xs font-medium text-gray-900 dark:text-white">Receiver</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Name</div>
                        <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{selectedReceiver?.name}</div>
                      </div>
                      
                      <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Account</div>
                        <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{selectedReceiver?.bankAccount}</div>
                      </div>
                      
                      <div className="flex justify-between items-center py-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Country</div>
                        <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{selectedReceiver?.country}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* iOS-style card for Transfer Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:border-purple-100 dark:hover:border-purple-900/30">
                  <div className="flex items-center mb-2">
                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2">
                      <CreditCard className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white">Transfer Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Source of Funds</div>
                      <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{formData.sourceOfFunds}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Purpose</div>
                      <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{formData.purposeOfTransfer}</div>
                    </div>
                    
                    <div className="space-y-1 col-span-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Transfer Type</div>
                      <div className="text-xs text-gray-900 dark:text-gray-200 font-medium capitalize">{formData.transferType}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Amount Details */}
              <div>
                {/* iOS-style card for Amount Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:border-amber-100 dark:hover:border-amber-900/30">
                  <div className="flex items-center mb-2">
                    <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-2">
                      <Receipt className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white">Amount Details</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Send Amount</div>
                      <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{formData.currency}{formData.amount}</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Fee</div>
                      <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">{formData.currency}{fee.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Exchange Rate</div>
                      <div className="text-xs text-gray-900 dark:text-gray-200 font-medium">1 {formData.currency} = {formData.exchangeRate} {selectedReceiver?.currency}</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Recipient Gets</div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">{selectedReceiver?.currency}{recipientAmount.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Total Amount</div>
                      <div className="text-sm text-gray-900 dark:text-white font-bold">{formData.currency}{totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll detection for auto-activating the button */}
      <div id="scroll-end-marker" className="h-4" />
      
      {/* Warning - iOS Style */}
      <motion.div
        className="mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-orange-500 shadow-sm flex items-start space-x-4">
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Important Notice</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Please review all details carefully before confirming. Once submitted, this transaction cannot be easily reversed.
            </p>
            <div className="mt-3 flex items-center text-xs text-orange-600 dark:text-orange-400">
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>This transaction is protected by our secure payment system</span>
            </div>
          </div>
        </div>
      </motion.div>


      
      {/* Submit Button - Always Active */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mb-6"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          id="confirm-transfer-button"
          type="submit" 
          className="w-full py-4 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md hover:shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Confirm</span>
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};
