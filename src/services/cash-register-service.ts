/**
 * Cash Register Service
 * Handles cash register operations including opening/closing, deposits, withdrawals, and reconciliation
 */

import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  CashOperationType, 
  CashOperation, 
  CashBalance,
  openCashRegister as openCashRegisterAction,
  closeCashRegister as closeCashRegisterAction,
  addCashOperation as addCashOperationAction,
  setCashBalances as setCashBalancesAction,
  setRecentOperations as setRecentOperationsAction,
  setLoading as setLoadingAction,
  setError as setErrorAction
} from '@/lib/redux/slices/cash-register-slice';
import { store } from '@/lib/redux/store';

/**
 * Cash Register Service Class
 */
class CashRegisterService {
  /**
   * Open cash register with initial balances
   */
  async openCashRegister(userId: string, initialBalances: CashBalance[]): Promise<void> {
    try {
      store.dispatch(setLoadingAction(true));
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const timestamp = new Date().toISOString();
      
      // Dispatch action to open cash register
      store.dispatch(openCashRegisterAction({
        userId,
        timestamp,
        initialBalances
      }));
      
      // Create open operation
      const openOperation: CashOperation = {
        id: uuidv4(),
        type: CashOperationType.OPEN,
        amount: initialBalances.reduce((total, balance) => total + balance.amount, 0),
        currency: 'MULTI',
        timestamp,
        userId,
        notes: 'Cash register opened'
      };
      
      // Add operation to history
      store.dispatch(addCashOperationAction(openOperation));
      
      toast.success('Cash register opened successfully');
    } catch (error) {
      console.error('Error opening cash register:', error);
      store.dispatch(setErrorAction('Failed to open cash register'));
      toast.error('Failed to open cash register');
    }
  }
  
  /**
   * Close cash register
   */
  async closeCashRegister(userId: string): Promise<void> {
    try {
      store.dispatch(setLoadingAction(true));
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const timestamp = new Date().toISOString();
      const currentState = store.getState().cashRegister;
      
      // Create close operation
      const closeOperation: CashOperation = {
        id: uuidv4(),
        type: CashOperationType.CLOSE,
        amount: currentState.balances.reduce((total, balance) => total + balance.amount, 0),
        currency: 'MULTI',
        timestamp,
        userId,
        notes: 'Cash register closed'
      };
      
      // Add operation to history
      store.dispatch(addCashOperationAction(closeOperation));
      
      // Dispatch action to close cash register
      store.dispatch(closeCashRegisterAction());
      
      toast.success('Cash register closed successfully');
    } catch (error) {
      console.error('Error closing cash register:', error);
      store.dispatch(setErrorAction('Failed to close cash register'));
      toast.error('Failed to close cash register');
    }
  }
  
  /**
   * Add cash to register
   */
  async addCash(
    amount: number, 
    currency: string, 
    userId: string, 
    notes?: string, 
    reference?: string
  ): Promise<void> {
    try {
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      
      store.dispatch(setLoadingAction(true));
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const timestamp = new Date().toISOString();
      
      // Create deposit operation
      const depositOperation: CashOperation = {
        id: uuidv4(),
        type: CashOperationType.DEPOSIT,
        amount,
        currency,
        timestamp,
        userId,
        notes,
        reference
      };
      
      // Add operation to history
      store.dispatch(addCashOperationAction(depositOperation));
      
      toast.success(`Added ${amount} ${currency} to cash register`);
    } catch (error) {
      console.error('Error adding cash:', error);
      store.dispatch(setErrorAction(error instanceof Error ? error.message : 'Failed to add cash'));
      toast.error(error instanceof Error ? error.message : 'Failed to add cash');
    } finally {
      store.dispatch(setLoadingAction(false));
    }
  }
  
  /**
   * Remove cash from register
   */
  async removeCash(
    amount: number, 
    currency: string, 
    userId: string, 
    notes?: string, 
    reference?: string
  ): Promise<void> {
    try {
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      
      const currentState = store.getState().cashRegister;
      const currentBalance = currentState.balances.find(b => b.currency === currency);
      
      if (!currentBalance || currentBalance.amount < amount) {
        throw new Error(`Insufficient ${currency} balance`);
      }
      
      store.dispatch(setLoadingAction(true));
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const timestamp = new Date().toISOString();
      
      // Create withdrawal operation
      const withdrawalOperation: CashOperation = {
        id: uuidv4(),
        type: CashOperationType.WITHDRAWAL,
        amount,
        currency,
        timestamp,
        userId,
        notes,
        reference
      };
      
      // Add operation to history
      store.dispatch(addCashOperationAction(withdrawalOperation));
      
      toast.success(`Removed ${amount} ${currency} from cash register`);
    } catch (error) {
      console.error('Error removing cash:', error);
      store.dispatch(setErrorAction(error instanceof Error ? error.message : 'Failed to remove cash'));
      toast.error(error instanceof Error ? error.message : 'Failed to remove cash');
    } finally {
      store.dispatch(setLoadingAction(false));
    }
  }
  
  /**
   * Reconcile cash balance
   */
  async reconcileCash(
    newAmount: number, 
    currency: string, 
    userId: string, 
    notes?: string
  ): Promise<void> {
    try {
      if (newAmount < 0) {
        throw new Error('Amount cannot be negative');
      }
      
      store.dispatch(setLoadingAction(true));
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const timestamp = new Date().toISOString();
      const currentState = store.getState().cashRegister;
      const currentBalance = currentState.balances.find(b => b.currency === currency);
      const currentAmount = currentBalance?.amount || 0;
      
      // Create adjustment operation
      const adjustmentOperation: CashOperation = {
        id: uuidv4(),
        type: CashOperationType.ADJUSTMENT,
        amount: newAmount,
        currency,
        timestamp,
        userId,
        notes: notes || `Reconciled ${currency} balance from ${currentAmount} to ${newAmount}`
      };
      
      // Add operation to history
      store.dispatch(addCashOperationAction(adjustmentOperation));
      
      toast.success(`Reconciled ${currency} balance to ${newAmount}`);
    } catch (error) {
      console.error('Error reconciling cash:', error);
      store.dispatch(setErrorAction(error instanceof Error ? error.message : 'Failed to reconcile cash'));
      toast.error(error instanceof Error ? error.message : 'Failed to reconcile cash');
    } finally {
      store.dispatch(setLoadingAction(false));
    }
  }
  
  /**
   * Get cash register operations history
   */
  async getOperationsHistory(limit: number = 50): Promise<CashOperation[]> {
    try {
      store.dispatch(setLoadingAction(true));
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const currentState = store.getState().cashRegister;
      return currentState.recentOperations.slice(0, limit);
    } catch (error) {
      console.error('Error fetching operations history:', error);
      store.dispatch(setErrorAction('Failed to fetch operations history'));
      toast.error('Failed to fetch operations history');
      return [];
    } finally {
      store.dispatch(setLoadingAction(false));
    }
  }
}

// Export singleton instance
export const cashRegisterService = new CashRegisterService();
export default cashRegisterService;
