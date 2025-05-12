/**
 * Cash Register Service Hook
 * Custom hook to access cash register service functionality with Redux integration
 */

import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { cashRegisterService } from '@/services/cash-register-service';
import { CashBalance, CashOperation } from '@/lib/redux/slices/cash-register-slice';
import { useCashRegister } from '@/lib/redux/hooks';

/**
 * Custom hook for cash register service
 */
export function useCashRegisterService() {
  const dispatch = useAppDispatch();
  const { isOpen, balances, openedAt, openedBy, isLoading, error } = useCashRegister();
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  
  /**
   * Open cash register
   */
  const openCashRegister = async (userId: string, initialBalances: CashBalance[]): Promise<void> => {
    setIsServiceLoading(true);
    setServiceError(null);
    
    try {
      await cashRegisterService.openCashRegister(userId, initialBalances);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Failed to open cash register');
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };
  
  /**
   * Close cash register
   */
  const closeCashRegister = async (userId: string): Promise<void> => {
    setIsServiceLoading(true);
    setServiceError(null);
    
    try {
      await cashRegisterService.closeCashRegister(userId);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Failed to close cash register');
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };
  
  /**
   * Add cash to register
   */
  const addCash = async (
    amount: number, 
    currency: string, 
    userId: string, 
    notes?: string, 
    reference?: string
  ): Promise<void> => {
    setIsServiceLoading(true);
    setServiceError(null);
    
    try {
      await cashRegisterService.addCash(amount, currency, userId, notes, reference);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Failed to add cash');
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };
  
  /**
   * Remove cash from register
   */
  const removeCash = async (
    amount: number, 
    currency: string, 
    userId: string, 
    notes?: string, 
    reference?: string
  ): Promise<void> => {
    setIsServiceLoading(true);
    setServiceError(null);
    
    try {
      await cashRegisterService.removeCash(amount, currency, userId, notes, reference);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Failed to remove cash');
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };
  
  /**
   * Reconcile cash balance
   */
  const reconcileCash = async (
    newAmount: number, 
    currency: string, 
    userId: string, 
    notes?: string
  ): Promise<void> => {
    setIsServiceLoading(true);
    setServiceError(null);
    
    try {
      await cashRegisterService.reconcileCash(newAmount, currency, userId, notes);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Failed to reconcile cash');
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };
  
  /**
   * Get cash register operations history
   */
  const getOperationsHistory = async (limit: number = 50): Promise<CashOperation[]> => {
    setIsServiceLoading(true);
    setServiceError(null);
    
    try {
      return await cashRegisterService.getOperationsHistory(limit);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Failed to fetch operations history');
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };
  
  /**
   * Get balance for a specific currency
   */
  const getBalance = (currency: string): number => {
    const balance = balances.find(b => b.currency === currency);
    return balance ? balance.amount : 0;
  };
  
  /**
   * Get total balance across all currencies
   */
  const getTotalBalance = (): number => {
    return balances.reduce((total, balance) => total + balance.amount, 0);
  };
  
  return {
    // State from Redux
    isOpen,
    balances,
    openedAt,
    openedBy,
    isLoading: isLoading || isServiceLoading,
    error: error || serviceError,
    
    // Service methods
    openCashRegister,
    closeCashRegister,
    addCash,
    removeCash,
    reconcileCash,
    getOperationsHistory,
    
    // Helper methods
    getBalance,
    getTotalBalance
  };
}
