'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Shield, ArrowLeftRight, User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRemittance } from '@/context/RemittanceContext';
import remittanceService from '@/services/remittance-service';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';

export const ConfirmationStep: React.FC = () => {
  const { state, resetTransaction } = useRemittance();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Calculate total amount
  const totalAmount = state.transactionDetail.sendAmount + state.transactionDetail.fee;

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted || !privacyAccepted) {
      setError('Please accept the terms and privacy policy to continue');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate a successful response
      const response = await remittanceService.createTransaction(state.transactionDetail);
      setTransactionId(response.id);
      setTransferComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    resetTransaction();
    setTransferComplete(false);
  };

  // Success screen when transfer is complete
  if (transferComplete) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ConfettiSuccess 
          message="Transfer Successful!"
          description="Your money transfer has been processed successfully."
          actionLabel="Go to Dashboard"
          onActionClick={() => window.location.href = '/dashboard'}
          onSendAnother={handleSendAnother}
          amount={state.transactionDetail.sendAmount.toFixed(2)}
          currency={state.transactionDetail.sendCurrency}
          receiverName={`${state.transactionDetail.receiver?.firstName} ${state.transactionDetail.receiver?.lastName}`}
          senderName={`${state.transactionDetail.sender?.firstName} ${state.transactionDetail.sender?.lastName}`}
          transferDate={new Date().toLocaleDateString()}
          referenceId={transactionId}
          fee={state.transactionDetail.fee.toFixed(2)}
          totalAmount={totalAmount.toFixed(2)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          >
            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Transaction Summary</h3>
          <div className="space-y-4">
            {/* Sender Information */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Sender</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {state.sender?.firstName} {state.sender?.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {state.sender?.phone}
                </p>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Receiver</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {state.receiver?.firstName} {state.receiver?.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {state.receiver?.phone}
                </p>
              </div>
            </div>

            {/* Amount Information */}
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <ArrowLeftRight className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Amount</h4>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">You send:</p>
                  <p className="text-sm font-medium">
                    {state.transactionDetail.sendCurrency} {state.transactionDetail.sendAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">They receive:</p>
                  <p className="text-sm font-medium">
                    {state.transactionDetail.receiveCurrency} {state.transactionDetail.receiveAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee:</p>
                  <p className="text-sm font-medium">
                    {state.transactionDetail.sendCurrency} {state.transactionDetail.fee.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">Total:</p>
                  <p className="text-sm font-medium">
                    {state.transactionDetail.sendCurrency} {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Transfer Details</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payout Method</p>
                    <p className="text-sm">{state.transactionDetail.payoutType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Purpose</p>
                    <p className="text-sm">{state.transactionDetail.payoutDetails?.purpose || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Source of Funds</p>
                    <p className="text-sm">{state.transactionDetail.payoutDetails?.sourceOfFunds || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-medium">Terms and Conditions</h3>
          
          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="termsAccepted" 
                checked={termsAccepted} 
                onCheckedChange={(checked: boolean | 'indeterminate') => setTermsAccepted(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and understand that my transaction will be processed according to these terms.
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="privacyAccepted" 
                checked={privacyAccepted} 
                onCheckedChange={(checked: boolean | 'indeterminate') => setPrivacyAccepted(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="privacyAccepted" className="text-sm text-gray-600 dark:text-gray-400">
                I have read and agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a> and consent to the processing of my personal data.
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !termsAccepted || !privacyAccepted}
            className="px-8 py-2"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Processing</span>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              </>
            ) : (
              'Confirm and Send'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
