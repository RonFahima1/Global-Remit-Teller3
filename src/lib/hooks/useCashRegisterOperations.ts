/**
 * Cash Register Operations Hook
 * Custom hook for managing cash register operations using Redux
 */

import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useCashRegister } from '@/lib/redux/hooks';
import { 
  addCashOperation, 
  CashOperationType,
  openCashRegister,
  closeCashRegister
} from '@/lib/redux/slices/cash-register-slice';
import { useFinancialOperationsService } from '@/components/providers/service-provider';
import { PaymentMethod } from '@/services/financial-operations-service';
import { toast } from 'sonner';

/**
 * Hook for managing cash register operations
 */
export function useCashRegisterOperations() {
  const dispatch = useAppDispatch();
  const { 
    isOpen, 
    balances, 
    getBalance, 
    recentOperations 
  } = useCashRegister();
  const financialOperationsService = useFinancialOperationsService();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Add cash to the register
   */
  const addCash = async (
    amount: number, 
    currency: string, 
    description: string, 
    reference?: string
  ) => {
    if (!isOpen) {
      toast.error('Cash drawer is closed. Please open it first.');
      return false;
    }
    
    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create operation for Redux
      const operation = {
        id: `op-${Date.now()}`,
        type: CashOperationType.DEPOSIT,
        amount,
        currency,
        timestamp: new Date().toISOString(),
        userId: 'current-user', // In a real app, get from auth
        notes: description,
        reference: reference || `DEP-${Date.now()}`
      };
      
      // Update Redux state
      dispatch(addCashOperation(operation));
      
      // Call service to create deposit
      await financialOperationsService.createDeposit({
        clientId: 'walk-in-client', // In a real app, get from selected client
        amount,
        currency,
        paymentMethod: PaymentMethod.CASH,
        description,
        reference: reference || `DEP-${Date.now()}`
      });
      
      toast.success('Cash added successfully');
      return true;
    } catch (err) {
      console.error('Error adding cash:', err);
      setError('Failed to add cash');
      toast.error('Failed to add cash');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Remove cash from the register
   */
  const removeCash = async (
    amount: number, 
    currency: string, 
    description: string, 
    reference?: string
  ) => {
    if (!isOpen) {
      toast.error('Cash drawer is closed. Please open it first.');
      return false;
    }
    
    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return false;
    }
    
    const currentBalance = getBalance(currency);
    
    if (amount > currentBalance) {
      toast.error(`Insufficient ${currency} balance. Available: ${currentBalance}`);
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create operation for Redux
      const operation = {
        id: `op-${Date.now()}`,
        type: CashOperationType.WITHDRAWAL,
        amount,
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
        amount,
        currency,
        paymentMethod: PaymentMethod.CASH,
        description,
        reference: reference || `WD-${Date.now()}`
      });
      
      toast.success('Cash removed successfully');
      return true;
    } catch (err) {
      console.error('Error removing cash:', err);
      setError('Failed to remove cash');
      toast.error('Failed to remove cash');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Reconcile cash drawer
   */
  const reconcileCash = async (
    actualAmount: number, 
    currency: string, 
    notes?: string
  ) => {
    if (!isOpen) {
      toast.error('Cash drawer is closed. Please open it first.');
      return false;
    }
    
    if (actualAmount < 0) {
      toast.error('Amount must be zero or greater');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const currentBalance = getBalance(currency);
      const difference = actualAmount - currentBalance;
      const reconciliationNotes = notes || 
        `Reconciliation adjustment from ${currentBalance} to ${actualAmount} ${currency}`;
      
      // Create adjustment operation
      const operation = {
        id: `op-${Date.now()}`,
        type: CashOperationType.ADJUSTMENT,
        amount: actualAmount,
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
            newAmount: actualAmount
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
            newAmount: actualAmount
          }
        });
      }
      
      toast.success(`Cash reconciled successfully (${difference > 0 ? '+' : ''}${difference} ${currency})`);
      return true;
    } catch (err) {
      console.error('Error reconciling cash:', err);
      setError('Failed to reconcile cash');
      toast.error('Failed to reconcile cash');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Open cash drawer
   */
  const openDrawer = async (initialBalances: Array<{currency: string, amount: number}>) => {
    if (isOpen) {
      toast.error('Cash drawer is already open');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Filter out zero balances
      const filteredBalances = initialBalances.filter(balance => balance.amount > 0);
      
      if (filteredBalances.length === 0) {
        toast.error('Please enter at least one currency amount');
        return false;
      }
      
      // Open cash register in Redux
      dispatch(openCashRegister({
        userId: 'current-user', // In a real app, get from auth
        timestamp: new Date().toISOString(),
        initialBalances: filteredBalances.map(balance => ({
          ...balance,
          lastUpdated: new Date().toISOString()
        }))
      }));
      
      // Call service to open cash register
      await financialOperationsService.openCashRegister({
        amount: filteredBalances.reduce((total, balance) => total + balance.amount, 0),
        currency: filteredBalances[0].currency, // Primary currency
        description: 'Cash drawer opened with initial count'
      });
      
      toast.success('Cash drawer opened successfully');
      return true;
    } catch (err) {
      console.error('Error opening cash drawer:', err);
      setError('Failed to open cash drawer');
      toast.error('Failed to open cash drawer');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Close cash drawer
   */
  const closeDrawer = async (finalBalances?: Array<{currency: string, amount: number}>) => {
    if (!isOpen) {
      toast.error('Cash drawer is already closed');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Close cash register in Redux
      dispatch(closeCashRegister());
      
      // If final balances provided, use them for the service call
      if (finalBalances && finalBalances.length > 0) {
        const filteredBalances = finalBalances.filter(balance => balance.amount > 0);
        
        // Call service to close cash register
        await financialOperationsService.closeCashRegister({
          amount: filteredBalances.reduce((total, balance) => total + balance.amount, 0),
          currency: filteredBalances[0].currency, // Primary currency
          description: 'Cash drawer closed with final count'
        });
      } else {
        // Use current balances
        await financialOperationsService.closeCashRegister({
          amount: balances.reduce((total, balance) => total + balance.amount, 0),
          currency: balances[0]?.currency || 'USD', // Primary currency
          description: 'Cash drawer closed'
        });
      }
      
      toast.success('Cash drawer closed successfully');
      return true;
    } catch (err) {
      console.error('Error closing cash drawer:', err);
      setError('Failed to close cash drawer');
      toast.error('Failed to close cash drawer');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // State
    isOpen,
    balances,
    recentOperations,
    isLoading,
    error,
    
    // Methods
    getBalance,
    addCash,
    removeCash,
    reconcileCash,
    openDrawer,
    closeDrawer
  };
}
