/**
 * Cash Register Slice
 * Manages cash register state including drawer status, balances, and transactions
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Cash register operation type
export enum CashOperationType {
  OPEN = 'open',
  CLOSE = 'close',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  ADJUSTMENT = 'adjustment',
}

// Cash register operation interface
export interface CashOperation {
  id: string;
  type: CashOperationType;
  amount: number;
  currency: string;
  timestamp: string;
  userId: string;
  notes?: string;
  reference?: string;
}

// Cash balance interface
export interface CashBalance {
  currency: string;
  amount: number;
  lastUpdated: string;
}

// Cash register state interface
interface CashRegisterState {
  isOpen: boolean;
  openedAt: string | null;
  openedBy: string | null;
  balances: CashBalance[];
  recentOperations: CashOperation[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CashRegisterState = {
  isOpen: false,
  openedAt: null,
  openedBy: null,
  balances: [],
  recentOperations: [],
  isLoading: false,
  error: null,
};

/**
 * Cash register slice for managing cash register state
 */
const cashRegisterSlice = createSlice({
  name: 'cashRegister',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    // Open cash register
    openCashRegister: (state, action: PayloadAction<{
      userId: string;
      timestamp: string;
      initialBalances: CashBalance[];
    }>) => {
      const { userId, timestamp, initialBalances } = action.payload;
      state.isOpen = true;
      state.openedAt = timestamp;
      state.openedBy = userId;
      state.balances = initialBalances;
      state.isLoading = false;
      state.error = null;
    },
    
    // Close cash register
    closeCashRegister: (state) => {
      state.isOpen = false;
      state.openedAt = null;
      state.openedBy = null;
      state.balances = [];
      state.recentOperations = [];
      state.isLoading = false;
      state.error = null;
    },
    
    // Add cash operation
    addCashOperation: (state, action: PayloadAction<CashOperation>) => {
      const operation = action.payload;
      
      // Update balances
      const balanceIndex = state.balances.findIndex(b => b.currency === operation.currency);
      
      if (balanceIndex >= 0) {
        const balance = state.balances[balanceIndex];
        let newAmount = balance.amount;
        
        // Adjust balance based on operation type
        switch (operation.type) {
          case CashOperationType.DEPOSIT:
            newAmount += operation.amount;
            break;
          case CashOperationType.WITHDRAWAL:
            newAmount -= operation.amount;
            break;
          case CashOperationType.ADJUSTMENT:
            newAmount = operation.amount; // Direct set for adjustments
            break;
          default:
            break;
        }
        
        // Update balance
        state.balances[balanceIndex] = {
          ...balance,
          amount: newAmount,
          lastUpdated: operation.timestamp,
        };
      } else if (
        operation.type === CashOperationType.DEPOSIT || 
        operation.type === CashOperationType.ADJUSTMENT
      ) {
        // Add new currency balance
        state.balances.push({
          currency: operation.currency,
          amount: operation.amount,
          lastUpdated: operation.timestamp,
        });
      }
      
      // Add to recent operations
      state.recentOperations = [operation, ...state.recentOperations].slice(0, 10);
    },
    
    // Set cash balances
    setCashBalances: (state, action: PayloadAction<CashBalance[]>) => {
      state.balances = action.payload;
    },
    
    // Set recent operations
    setRecentOperations: (state, action: PayloadAction<CashOperation[]>) => {
      state.recentOperations = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  openCashRegister,
  closeCashRegister,
  addCashOperation,
  setCashBalances,
  setRecentOperations,
  setError,
  clearError,
} = cashRegisterSlice.actions;

// Export reducer
export default cashRegisterSlice.reducer;
