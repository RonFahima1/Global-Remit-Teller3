/**
 * Reconcile Cash Modal Component (Redux Version)
 * Modal for reconciling cash drawer amounts using Redux state
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
import { toast } from 'sonner';

interface ReconcileCashModalReduxProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Reconcile Cash Modal Component
 */
export function ReconcileCashModalRedux({ isOpen, onClose }: ReconcileCashModalReduxProps) {
  const dispatch = useAppDispatch();
  const { isOpen: isDrawerOpen, getBalance } = useCashRegister();
  const financialOperationsService = useFinancialOperationsService();
  
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Reset form on close
  const handleClose = () => {
    setAmount('');
    setCurrency('USD');
    setNotes('');
    onClose();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || parseFloat(amount) < 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!currency) {
      toast.error('Please select a currency');
      return;
    }
    
    if (!isDrawerOpen) {
      toast.error('Cash drawer is closed. Please open it first.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const amountValue = parseFloat(amount);
      const currentBalance = getBalance(currency);
      const difference = amountValue - currentBalance;
      const reconciliationNotes = notes || 
        `Reconciliation adjustment from ${currentBalance} to ${amountValue} ${currency}`;
      
      // Create adjustment operation
      const operation = {
        id: `op-${Date.now()}`,
        type: CashOperationType.ADJUSTMENT,
        amount: amountValue,
        currency,
        timestamp: new Date().toISOString(),
        userId: 'current-user', // In a real app, get from auth
        notes: reconciliationNotes,
        reference: `RECON-${Date.now()}`
      };
      
      // Update Redux state
      dispatch(addCashOperation(operation));
      
      // Determine if this is an addition or removal for the service call
      if (difference > 0) {
        // More actual cash than recorded - add the difference
        await financialOperationsService.createDeposit({
          clientId: 'system-adjustment',
          amount: difference,
          currency,
          paymentMethod: 'cash',
          description: `Cash reconciliation adjustment (surplus)`,
          metadata: {
            type: 'reconciliation',
            previousAmount: currentBalance,
            newAmount: amountValue
          }
        });
      } else if (difference < 0) {
        // Less actual cash than recorded - remove the difference
        await financialOperationsService.createWithdrawal({
          clientId: 'system-adjustment',
          amount: Math.abs(difference),
          currency,
          paymentMethod: 'cash',
          description: `Cash reconciliation adjustment (shortage)`,
          metadata: {
            type: 'reconciliation',
            previousAmount: currentBalance,
            newAmount: amountValue
          }
        });
      }
      
      toast.success(`Cash reconciled successfully (${difference > 0 ? '+' : ''}${difference} ${currency})`);
      handleClose();
    } catch (error) {
      console.error('Error reconciling cash:', error);
      toast.error('Failed to reconcile cash');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reconcile Cash</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Actual Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
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
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes about the reconciliation"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm space-y-2">
            <p>Current recorded balance: {getBalance(currency)} {currency}</p>
            {amount && (
              <>
                <p>Actual counted amount: {parseFloat(amount)} {currency}</p>
                <p className={`font-medium ${parseFloat(amount) > getBalance(currency) ? 'text-green-600' : parseFloat(amount) < getBalance(currency) ? 'text-red-600' : 'text-blue-600'}`}>
                  Difference: {parseFloat(amount) > getBalance(currency) ? '+' : ''}{(parseFloat(amount) - getBalance(currency)).toFixed(2)} {currency}
                </p>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDrawerOpen}>
              {isSubmitting ? 'Reconciling...' : 'Reconcile Cash'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
