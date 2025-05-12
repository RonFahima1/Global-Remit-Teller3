'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types for cash transactions
export interface CashTransaction {
  id: string;
  date: string;
  type: 'add' | 'remove';
  amount: number;
  currency: string;
  description: string;
  referenceNumber?: string;
  performedBy: string;
  status: 'completed' | 'pending' | 'failed';
}

// Define types for cash balances
export interface CashBalance {
  currency: string;
  amount: number;
  lastUpdated: string;
}

// Define the state type
interface CashRegisterState {
  balances: CashBalance[];
  transactions: CashTransaction[];
  selectedCurrency: string;
  loading: boolean;
  error: string | null;
}

// Define action types
type CashRegisterAction =
  | { type: 'SET_BALANCES'; payload: CashBalance[] }
  | { type: 'SET_TRANSACTIONS'; payload: CashTransaction[] }
  | { type: 'SET_SELECTED_CURRENCY'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: CashTransaction }
  | { type: 'UPDATE_BALANCE'; payload: CashBalance }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: CashRegisterState = {
  balances: [
    { currency: 'USD', amount: 3200.00, lastUpdated: new Date().toISOString() },
    { currency: 'EUR', amount: 1800.50, lastUpdated: new Date().toISOString() },
    { currency: 'ILS', amount: 9500.00, lastUpdated: new Date().toISOString() },
  ],
  transactions: [
    {
      id: 'CASH1001',
      date: '2024-03-15T09:00:00',
      type: 'add',
      amount: 1000.00,
      currency: 'USD',
      description: 'Cash Deposit',
      performedBy: 'John Doe',
      status: 'completed',
    },
    {
      id: 'CASH1002',
      date: '2024-03-14T16:30:00',
      type: 'remove',
      amount: 500.00,
      currency: 'EUR',
      description: 'Cash Withdrawal',
      performedBy: 'Jane Smith',
      status: 'completed',
    },
    {
      id: 'CASH1003',
      date: '2024-03-13T11:15:00',
      type: 'add',
      amount: 2000.00,
      currency: 'ILS',
      description: 'Cash Adjustment',
      performedBy: 'John Doe',
      status: 'completed',
    },
  ],
  selectedCurrency: 'USD',
  loading: false,
  error: null,
};

// Reducer function
const cashRegisterReducer = (state: CashRegisterState, action: CashRegisterAction): CashRegisterState => {
  switch (action.type) {
    case 'SET_BALANCES':
      return { ...state, balances: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_SELECTED_CURRENCY':
      return { ...state, selectedCurrency: action.payload };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions] 
      };
    case 'UPDATE_BALANCE':
      return { 
        ...state, 
        balances: state.balances.map(balance => 
          balance.currency === action.payload.currency ? action.payload : balance
        ) 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Create context
interface CashRegisterContextType {
  state: CashRegisterState;
  dispatch: React.Dispatch<CashRegisterAction>;
  addCash: (amount: number, currency: string, description: string) => void;
  removeCash: (amount: number, currency: string, description: string) => void;
  reconcileCash: (newAmount: number, currency: string) => void;
  selectCurrency: (currency: string) => void;
}

const CashRegisterContext = createContext<CashRegisterContextType | undefined>(undefined);

// Provider component
export function CashRegisterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cashRegisterReducer, initialState);

  // Helper function to generate transaction ID
  const generateTransactionId = () => {
    return `CASH${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Add cash to register
  const addCash = (amount: number, currency: string, description: string) => {
    if (amount <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Amount must be greater than zero' });
      return;
    }

    // Create new transaction
    const newTransaction: CashTransaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      type: 'add',
      amount,
      currency,
      description,
      performedBy: 'Current User', // In a real app, this would come from auth context
      status: 'completed',
    };

    // Add transaction
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });

    // Update balance
    const currentBalance = state.balances.find(balance => balance.currency === currency);
    if (currentBalance) {
      const updatedBalance: CashBalance = {
        ...currentBalance,
        amount: currentBalance.amount + amount,
        lastUpdated: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_BALANCE', payload: updatedBalance });
    }
  };

  // Remove cash from register
  const removeCash = (amount: number, currency: string, description: string) => {
    if (amount <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Amount must be greater than zero' });
      return;
    }

    // Check if there's enough balance
    const currentBalance = state.balances.find(balance => balance.currency === currency);
    if (!currentBalance || currentBalance.amount < amount) {
      dispatch({ type: 'SET_ERROR', payload: 'Insufficient balance' });
      return;
    }

    // Create new transaction
    const newTransaction: CashTransaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      type: 'remove',
      amount,
      currency,
      description,
      performedBy: 'Current User', // In a real app, this would come from auth context
      status: 'completed',
    };

    // Add transaction
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });

    // Update balance
    const updatedBalance: CashBalance = {
      ...currentBalance,
      amount: currentBalance.amount - amount,
      lastUpdated: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_BALANCE', payload: updatedBalance });
  };

  // Reconcile cash (adjust to actual count)
  const reconcileCash = (newAmount: number, currency: string) => {
    if (newAmount < 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Amount cannot be negative' });
      return;
    }

    // Find current balance
    const currentBalance = state.balances.find(balance => balance.currency === currency);
    if (!currentBalance) {
      dispatch({ type: 'SET_ERROR', payload: 'Currency not found' });
      return;
    }

    // Calculate difference
    const difference = newAmount - currentBalance.amount;
    const transactionType = difference >= 0 ? 'add' : 'remove';
    const adjustmentAmount = Math.abs(difference);

    // Create adjustment transaction if there's a difference
    if (difference !== 0) {
      const newTransaction: CashTransaction = {
        id: generateTransactionId(),
        date: new Date().toISOString(),
        type: transactionType,
        amount: adjustmentAmount,
        currency,
        description: 'Cash Reconciliation Adjustment',
        performedBy: 'Current User', // In a real app, this would come from auth context
        status: 'completed',
      };

      // Add transaction
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    }

    // Update balance
    const updatedBalance: CashBalance = {
      ...currentBalance,
      amount: newAmount,
      lastUpdated: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_BALANCE', payload: updatedBalance });
  };

  // Select currency
  const selectCurrency = (currency: string) => {
    dispatch({ type: 'SET_SELECTED_CURRENCY', payload: currency });
  };

  return (
    <CashRegisterContext.Provider value={{ 
      state, 
      dispatch,
      addCash,
      removeCash,
      reconcileCash,
      selectCurrency
    }}>
      {children}
    </CashRegisterContext.Provider>
  );
}

// Custom hook to use the CashRegisterContext
export function useCashRegister() {
  const context = useContext(CashRegisterContext);
  if (context === undefined) {
    throw new Error('useCashRegister must be used within a CashRegisterProvider');
  }
  return context;
}
