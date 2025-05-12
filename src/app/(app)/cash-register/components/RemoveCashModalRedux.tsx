/**
 * Remove Cash Modal Component (Redux Version)
 * Modal for removing cash from the register using Redux state
 */

'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useCashRegister } from '@/lib/redux/hooks';
import { addCashOperation, CashOperationType } from '@/lib/redux/slices/cash-register-slice';
import { useFinancialOperationsService } from '@/components/providers/service-provider';
import { PaymentMethod } from '@/services/financial-operations-service';
import { toast } from 'sonner';

interface RemoveCashModalReduxProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Remove Cash Modal Component
 */
export function RemoveCashModalRedux({ isOpen, onClose }: RemoveCashModalReduxProps) {
  const dispatch = useAppDispatch();
  const { isOpen: isDrawerOpen, getBalance } = useCashRegister();
  const financialOperationsService = useFinancialOperationsService();
  
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [description, setDescription] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Reset form on close
  const handleClose = () => {
    setAmount('');
    setCurrency('USD');
    setDescription('');
    setReference('');
    onClose();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!currency) {
      toast.error('Please select a currency');
      return;
    }
    
    if (!description) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!isDrawerOpen) {
      toast.error('Cash drawer is closed. Please open it first.');
      return;
    }
    
    const amountValue = parseFloat(amount);
    const currentBalance = getBalance(currency);
    
    // Check if there's enough balance
    if (amountValue > currentBalance) {
      toast.error(`Insufficient ${currency} balance. Available: ${currentBalance}`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create operation for Redux
      const operation = {
        id: `op-${Date.now()}`,
        type: CashOperationType.WITHDRAWAL,
        amount: amountValue,
        currency,
        timestamp: new Date().toISOString(),
        userId: 'current-user', // In a real app, get from auth
        notes: description,
        reference: reference || `WD-${Date.now()}`
      };
      
      // Update Redux state
      dispatch(addCashOperation(operation));
      
      // Call service to create withdrawal
      await financialOperationsService.createWithdrawal({
        clientId: 'walk-in-client', // In a real app, get from selected client
        amount: amountValue,
        currency,
        paymentMethod: PaymentMethod.CASH,
        description,
        reference: reference || `WD-${Date.now()}`
      });
      
      toast.success('Cash removed successfully');
      handleClose();
    } catch (error) {
      console.error('Error removing cash:', error);
      toast.error('Failed to remove cash');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Cash</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency} required>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="ILS">ILS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference">Reference (Optional)</Label>
            <Input
              id="reference"
              placeholder="Enter reference number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          
          <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p>Available balance: {getBalance(currency)} {currency}</p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDrawerOpen}>
              {isSubmitting ? 'Removing...' : 'Remove Cash'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
