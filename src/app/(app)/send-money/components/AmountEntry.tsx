import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { FormData } from '../hooks/useSendMoneyForm';

interface AmountEntryProps {
  formData: FormData;
  handleInputChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  calculateFee: (amount: number) => number;
  calculateRecipientAmount: (amount: number) => number;
  calculateTotalAmount: (amount: number) => number;
  selectedReceiverCurrency?: string;
}

export const AmountEntry: React.FC<AmountEntryProps> = ({
  formData,
  handleInputChange,
  errors,
  calculateFee,
  calculateRecipientAmount,
  calculateTotalAmount,
  selectedReceiverCurrency = 'EUR'
}) => {
  return (
    <div className="space-y-6">
      {/* Removed duplicate title since it's already in the page header */}

      <GlassmorphicCard
        variant="elevated"
        colorScheme="blue"
        className="p-6 max-w-3xl mx-auto md:p-8 lg:p-10"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-lg">$</span>
              </div>
              <motion.input
                type="text"
                value={formData.amount}
                onChange={(e) => {
                  // Allow only numbers and decimals
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('amount', value);
                }}
                placeholder="0.00"
                className={cn(
                  "block w-full pl-8 pr-12 py-3 text-3xl font-semibold text-center rounded-lg",
                  "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
                  errors.amount ? "border-red-500" : ""
                )}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{formData.currency}</span>
              </div>
            </div>
            
            {/* Suggested Amounts */}
            <motion.div 
              className="mt-6 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Suggested Amounts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[100, 200, 500, 1000].map((amount) => (
                  <motion.button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('amount', amount.toString())}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center",
                      formData.amount === amount.toString()
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-lg">{formData.currency} {amount}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <motion.button
                  type="button"
                  onClick={() => handleInputChange('amount', '')}
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Custom Amount
                </motion.button>
              </div>
            </motion.div>
            
            {errors.amount && (
              <motion.p
                className="mt-2 text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.amount}
              </motion.p>
            )}
          </div>

          <motion.div
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Transfer Summary</h3>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 md:p-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Fee:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formData.currency}{calculateFee(parseFloat(formData.amount) || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Exchange Rate:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">1 {formData.currency} = {formData.exchangeRate} {selectedReceiverCurrency}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Recipient Gets:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedReceiverCurrency} {calculateRecipientAmount(parseFloat(formData.amount) || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">Total Amount:</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{formData.currency} {calculateTotalAmount(parseFloat(formData.amount) || 0).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </GlassmorphicCard>
      
      <motion.div
        className="max-w-3xl mx-auto mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Exchange Rate Information</p>
            <p>The exchange rate is updated in real-time based on current market conditions. The final rate will be locked in when you confirm the transfer.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
