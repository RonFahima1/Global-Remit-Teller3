'use client';

import { createContext, useContext, useState, useReducer, ReactNode, useMemo } from 'react';
import { z } from 'zod';

// Define types for sender
export interface Sender {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  country: string;
  address?: string;
  idType?: string;
  idNumber?: string;
  phoneVerified?: boolean;
  phoneVerifyDismissed?: boolean;
}

// Define types for receiver
export interface Receiver {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  country: string;
  address?: string;
  accountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankCode?: string;
  mobileWallet?: string;
}

// Define types for transaction details
export interface TransactionDetail {
  type: 'REMITTANCE' | 'EXCHANGE' | 'DEPOSIT' | 'WITHDRAWAL';
  sendAmount: number;
  receiveAmount: number;
  fee: number;
  exchangeRate: number;
  sendCurrency: string;
  receiveCurrency: string;
  payoutType: string;
  payoutDetails?: Record<string, any>;
  notes?: string;
  sender?: Sender;
  receiver?: Receiver;
  accountNumber?: string;
  cardNumber?: string;
  loanDetails?: {
    totalDue?: number;
    loanId?: string;
    loanType?: string;
  };
}

// Define the state type
interface RemittanceState {
  currentStep: number;
  transactionDetail: TransactionDetail;
  isSenderDefined: boolean;
  isReceiverDefined: boolean;
  isPayoutRequisitesDefined: boolean;
  editingSender: boolean;
  editingReceiver: boolean;
  newSender: boolean;
  newReceiver: boolean;
  destinationCountries: { label: string; value: string }[];
  fxRates: Record<string, number>;
  loading: boolean;
  error: string | null;
}

// Define action types
type RemittanceAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SENDER'; payload: Sender }
  | { type: 'SET_RECEIVER'; payload: Receiver }
  | { type: 'SET_TRANSACTION_DETAIL'; payload: Partial<TransactionDetail> }
  | { type: 'SET_SENDER_DEFINED'; payload: boolean }
  | { type: 'SET_RECEIVER_DEFINED'; payload: boolean }
  | { type: 'SET_PAYOUT_REQUISITES_DEFINED'; payload: boolean }
  | { type: 'SET_EDITING_SENDER'; payload: boolean }
  | { type: 'SET_EDITING_RECEIVER'; payload: boolean }
  | { type: 'SET_NEW_SENDER'; payload: boolean }
  | { type: 'SET_NEW_RECEIVER'; payload: boolean }
  | { type: 'SET_DESTINATION_COUNTRIES'; payload: { label: string; value: string }[] }
  | { type: 'SET_FX_RATES'; payload: Record<string, number> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_TRANSACTION' };

// Initial state
const initialState: RemittanceState = {
  currentStep: 1,
  transactionDetail: {
    type: 'REMITTANCE',
    sendAmount: 0,
    receiveAmount: 0,
    fee: 0,
    exchangeRate: 1,
    sendCurrency: 'USD',
    receiveCurrency: 'USD',
    payoutType: 'CASH',
  },
  isSenderDefined: false,
  isReceiverDefined: false,
  isPayoutRequisitesDefined: false,
  editingSender: false,
  editingReceiver: false,
  newSender: false,
  newReceiver: false,
  destinationCountries: [],
  fxRates: {},
  loading: false,
  error: null,
};

// Reducer function
function remittanceReducer(state: RemittanceState, action: RemittanceAction): RemittanceState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SENDER':
      return { 
        ...state, 
        transactionDetail: { ...state.transactionDetail, sender: action.payload },
        isSenderDefined: true,
        editingSender: false,
        newSender: false
      };
    case 'SET_RECEIVER':
      return { 
        ...state, 
        transactionDetail: { ...state.transactionDetail, receiver: action.payload },
        isReceiverDefined: true,
        editingReceiver: false,
        newReceiver: false
      };
    case 'SET_TRANSACTION_DETAIL':
      return { 
        ...state, 
        transactionDetail: { ...state.transactionDetail, ...action.payload } 
      };
    case 'SET_SENDER_DEFINED':
      return { ...state, isSenderDefined: action.payload };
    case 'SET_RECEIVER_DEFINED':
      return { ...state, isReceiverDefined: action.payload };
    case 'SET_PAYOUT_REQUISITES_DEFINED':
      return { ...state, isPayoutRequisitesDefined: action.payload };
    case 'SET_EDITING_SENDER':
      return { ...state, editingSender: action.payload };
    case 'SET_EDITING_RECEIVER':
      return { ...state, editingReceiver: action.payload };
    case 'SET_NEW_SENDER':
      return { ...state, newSender: action.payload };
    case 'SET_NEW_RECEIVER':
      return { ...state, newReceiver: action.payload };
    case 'SET_DESTINATION_COUNTRIES':
      return { ...state, destinationCountries: action.payload };
    case 'SET_FX_RATES':
      return { ...state, fxRates: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_TRANSACTION':
      return {
        ...initialState,
        destinationCountries: state.destinationCountries,
        fxRates: state.fxRates,
      };
    default:
      return state;
  }
}

// Create context
interface RemittanceContextType {
  state: RemittanceState;
  dispatch: React.Dispatch<RemittanceAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetTransaction: () => void;
  updateTransactionDetail: (details: Partial<TransactionDetail>) => void;
  setSender: (sender: Sender) => void;
  setReceiver: (receiver: Receiver) => void;
  calculateReceiveAmount: (sendAmount: number, exchangeRate: number) => number;
  calculateFee: (sendAmount: number) => number;
}

const RemittanceContext = createContext<RemittanceContextType | undefined>(undefined);

// Provider component
export function RemittanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(remittanceReducer, initialState);

  // Helper functions
  const nextStep = () => {
    if (state.currentStep < 5) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const resetTransaction = () => {
    dispatch({ type: 'RESET_TRANSACTION' });
  };

  const updateTransactionDetail = (details: Partial<TransactionDetail>) => {
    dispatch({ type: 'SET_TRANSACTION_DETAIL', payload: details });
  };

  const setSender = (sender: Sender) => {
    dispatch({ type: 'SET_SENDER', payload: sender });
  };

  const setReceiver = (receiver: Receiver) => {
    dispatch({ type: 'SET_RECEIVER', payload: receiver });
  };

  const calculateReceiveAmount = (sendAmount: number, exchangeRate: number): number => {
    return sendAmount * exchangeRate;
  };

  const calculateFee = (sendAmount: number): number => {
    // Simple fee calculation logic - can be replaced with more complex logic
    return Math.max(5, sendAmount * 0.02); // 2% fee with $5 minimum
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      dispatch,
      nextStep,
      prevStep,
      goToStep,
      resetTransaction,
      updateTransactionDetail,
      setSender,
      setReceiver,
      calculateReceiveAmount,
      calculateFee,
    }),
    [state]
  );

  return (
    <RemittanceContext.Provider value={value}>
      {children}
    </RemittanceContext.Provider>
  );
}

// Custom hook to use the RemittanceContext
export function useRemittance() {
  const context = useContext(RemittanceContext);
  if (context === undefined) {
    throw new Error('useRemittance must be used within a RemittanceProvider');
  }
  return context;
}
