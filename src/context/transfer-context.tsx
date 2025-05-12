'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types for the transfer process
export interface Sender {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
}

export interface Receiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    swiftCode?: string;
  };
}

export interface TransferState {
  step: number;
  sender: Sender | null;
  receiver: Receiver | null;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  fee: number;
  receiveAmount: number;
  totalAmount: number;
  purpose: string;
  reference: string;
  isProcessing: boolean;
  error: string | null;
}

type TransferAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SENDER'; payload: Sender }
  | { type: 'SET_RECEIVER'; payload: Receiver }
  | { type: 'SET_AMOUNT'; payload: number }
  | { type: 'SET_SOURCE_CURRENCY'; payload: string }
  | { type: 'SET_TARGET_CURRENCY'; payload: string }
  | { type: 'SET_EXCHANGE_RATE'; payload: number }
  | { type: 'SET_FEE'; payload: number }
  | { type: 'SET_RECEIVE_AMOUNT'; payload: number }
  | { type: 'SET_PURPOSE'; payload: string }
  | { type: 'SET_REFERENCE'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: TransferState = {
  step: 1,
  sender: null,
  receiver: null,
  amount: 0,
  sourceCurrency: 'USD',
  targetCurrency: 'EUR',
  exchangeRate: 0,
  fee: 0,
  receiveAmount: 0,
  totalAmount: 0,
  purpose: '',
  reference: '',
  isProcessing: false,
  error: null
};

// Create the context
const TransferContext = createContext<{
  state: TransferState;
  dispatch: React.Dispatch<TransferAction>;
} | undefined>(undefined);

// Reducer function to handle state updates
function transferReducer(state: TransferState, action: TransferAction): TransferState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SENDER':
      return { ...state, sender: action.payload };
    case 'SET_RECEIVER':
      return { ...state, receiver: action.payload };
    case 'SET_AMOUNT':
      return { 
        ...state, 
        amount: action.payload,
        totalAmount: action.payload + state.fee
      };
    case 'SET_SOURCE_CURRENCY':
      return { ...state, sourceCurrency: action.payload };
    case 'SET_TARGET_CURRENCY':
      return { ...state, targetCurrency: action.payload };
    case 'SET_EXCHANGE_RATE':
      return { ...state, exchangeRate: action.payload };
    case 'SET_FEE':
      return { 
        ...state, 
        fee: action.payload,
        totalAmount: state.amount + action.payload
      };
    case 'SET_RECEIVE_AMOUNT':
      return { ...state, receiveAmount: action.payload };
    case 'SET_PURPOSE':
      return { ...state, purpose: action.payload };
    case 'SET_REFERENCE':
      return { ...state, reference: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Provider component
export function TransferProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transferReducer, initialState);
  
  return (
    <TransferContext.Provider value={{ state, dispatch }}>
      {children}
    </TransferContext.Provider>
  );
}

// Custom hook to use the context
export function useTransfer() {
  const context = useContext(TransferContext);
  if (context === undefined) {
    throw new Error('useTransfer must be used within a TransferProvider');
  }
  return context;
}
