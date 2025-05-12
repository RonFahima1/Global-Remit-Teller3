'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCashRegister } from '@/context/CashRegisterContext';
import { motion } from 'framer-motion';
import { Minus } from 'lucide-react';
import { toast } from 'sonner';

interface RemoveCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RemoveCashModal({ isOpen, onClose }: RemoveCashModalProps) {
  const { state, removeCash } = useCashRegister();
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>(state.selectedCurrency);
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});
  const [maxAmount, setMaxAmount] = useState<number>(0);

  // Reset form on open and set max amount based on selected currency
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setCurrency(state.selectedCurrency);
      setDescription('');
      setErrors({});
      
      // Set max amount based on current balance
      const currentBalance = state.balances.find(b => b.currency === state.selectedCurrency);
      setMaxAmount(currentBalance?.amount || 0);
    }
  }, [isOpen, state.selectedCurrency, state.balances]);

  // Update max amount when currency changes
  useEffect(() => {
    const currentBalance = state.balances.find(b => b.currency === currency);
    setMaxAmount(currentBalance?.amount || 0);
  }, [currency, state.balances]);

  const validateForm = (): boolean => {
    const newErrors: { amount?: string; description?: string } = {};
    
    // Validate amount
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (parseFloat(amount) > maxAmount) {
      newErrors.amount = `Amount exceeds available balance (${maxAmount.toFixed(2)} ${currency})`;
    }
    
    // Validate description
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        removeCash(parseFloat(amount), currency, description);
        toast.success('Cash removed successfully');
        onClose();
      } catch (error) {
        toast.error('Failed to remove cash');
        console.error(error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Minus className="h-5 w-5 text-red-500" />
            Remove Cash
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
            </div>
            {errors.amount && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-sm text-red-500 mt-1"
              >
                {errors.amount}
              </motion.p>
            )}
            <p className="text-xs text-gray-500">
              Available: {maxAmount.toFixed(2)} {currency}
            </p>
          </div>
          
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              placeholder="Enter reason for removing cash"
              rows={3}
            />
            {errors.description && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-sm text-red-500 mt-1"
              >
                {errors.description}
              </motion.p>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              Remove Cash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
