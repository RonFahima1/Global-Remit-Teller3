'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCashRegister } from '@/context/CashRegisterContext';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ReconcileCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReconcileCashModal({ isOpen, onClose }: ReconcileCashModalProps) {
  const { state, reconcileCash } = useCashRegister();
  const [actualAmount, setActualAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>(state.selectedCurrency);
  const [errors, setErrors] = useState<{ actualAmount?: string }>({});
  const [systemAmount, setSystemAmount] = useState<number>(0);
  const [difference, setDifference] = useState<number>(0);

  // Reset form on open and set system amount based on selected currency
  useEffect(() => {
    if (isOpen) {
      setCurrency(state.selectedCurrency);
      setErrors({});
      
      // Set system amount based on current balance
      const currentBalance = state.balances.find(b => b.currency === state.selectedCurrency);
      const currentAmount = currentBalance?.amount || 0;
      setSystemAmount(currentAmount);
      setActualAmount(currentAmount.toString());
      setDifference(0);
    }
  }, [isOpen, state.selectedCurrency, state.balances]);

  // Update system amount when currency changes
  useEffect(() => {
    const currentBalance = state.balances.find(b => b.currency === currency);
    const currentAmount = currentBalance?.amount || 0;
    setSystemAmount(currentAmount);
    
    // Calculate difference
    const actualAmountNum = actualAmount ? parseFloat(actualAmount) : 0;
    setDifference(actualAmountNum - currentAmount);
  }, [currency, actualAmount, state.balances]);

  // Update difference when actual amount changes
  useEffect(() => {
    const actualAmountNum = actualAmount ? parseFloat(actualAmount) : 0;
    setDifference(actualAmountNum - systemAmount);
  }, [actualAmount, systemAmount]);

  const validateForm = (): boolean => {
    const newErrors: { actualAmount?: string } = {};
    
    // Validate actual amount
    if (!actualAmount) {
      newErrors.actualAmount = 'Actual amount is required';
    } else if (isNaN(parseFloat(actualAmount)) || parseFloat(actualAmount) < 0) {
      newErrors.actualAmount = 'Amount must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        reconcileCash(parseFloat(actualAmount), currency);
        toast.success('Cash reconciled successfully');
        onClose();
      } catch (error) {
        toast.error('Failed to reconcile cash');
        console.error(error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-500" />
            Reconcile Cash
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {state.balances.map((balance) => (
                  <SelectItem key={balance.currency} value={balance.currency}>
                    {balance.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-sm text-gray-500 mb-2">System Balance</div>
            <div className="text-lg font-semibold">{systemAmount.toFixed(2)} {currency}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="actualAmount">Actual Cash Count</Label>
            <div className="relative">
              <Input
                id="actualAmount"
                type="number"
                step="0.01"
                min="0"
                value={actualAmount}
                onChange={(e) => setActualAmount(e.target.value)}
                className={`pl-8 ${errors.actualAmount ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
            </div>
            {errors.actualAmount && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-sm text-red-500 mt-1"
              >
                {errors.actualAmount}
              </motion.p>
            )}
          </div>
          
          {/* Difference display */}
          {!isNaN(difference) && (
            <div className={`p-4 rounded-xl ${
              difference === 0 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : difference > 0 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              <div className="text-sm mb-1">Difference</div>
              <div className="text-lg font-semibold">
                {difference === 0 
                  ? 'No difference' 
                  : `${difference > 0 ? '+' : ''}${difference.toFixed(2)} ${currency}`}
              </div>
              <div className="text-xs mt-1">
                {difference === 0 
                  ? 'System and actual count match' 
                  : difference > 0 
                    ? 'Actual count exceeds system balance' 
                    : 'System balance exceeds actual count'}
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isNaN(parseFloat(actualAmount))}
            >
              Reconcile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
