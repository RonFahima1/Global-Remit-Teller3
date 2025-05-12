/**
 * Redux Hooks
 * Custom hooks for accessing the Redux store and dispatch functions
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { User } from './slices/auth-slice';
import { CashBalance, CashOperation } from './slices/cash-register-slice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth state interface
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authProvider: 'microsoft' | 'credentials' | null;
}

// UI state interface
interface UiState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  currentView: string | null;
  modalState: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
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

/**
 * Auth hooks for accessing auth state and actions
 */
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth) as AuthState;
  const dispatch = useAppDispatch();
  
  return {
    user: auth.user,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    authProvider: auth.authProvider,
    isAdmin: auth.user?.role === 'admin',
    isManager: auth.user?.role === 'manager' || auth.user?.role === 'admin',
    isTeller: auth.user?.role === 'teller' || auth.user?.role === 'manager' || auth.user?.role === 'admin',
    hasPermission: (permission: string) => auth.user?.permissions?.includes(permission) || false,
  };
};

/**
 * UI hooks for accessing UI state and actions
 */
export const useUI = () => {
  const ui = useAppSelector((state) => state.ui) as UiState;
  
  return {
    theme: ui.theme,
    sidebarOpen: ui.sidebarOpen,
    globalLoading: ui.globalLoading,
    loadingStates: ui.loadingStates,
    currentView: ui.currentView,
    modalState: ui.modalState,
    isLoading: (key?: string) => {
      if (key) {
        return ui.loadingStates[key] || false;
      }
      return ui.globalLoading;
    },
  };
};

/**
 * Cash register hooks for accessing cash register state and actions
 */
export const useCashRegister = () => {
  const cashRegister = useAppSelector((state) => state.cashRegister) as CashRegisterState;
  
  return {
    isOpen: cashRegister.isOpen,
    openedAt: cashRegister.openedAt,
    openedBy: cashRegister.openedBy,
    balances: cashRegister.balances,
    recentOperations: cashRegister.recentOperations,
    isLoading: cashRegister.isLoading,
    error: cashRegister.error,
    getBalance: (currency: string) => {
      const balance = cashRegister.balances.find((b: CashBalance) => b.currency === currency);
      return balance?.amount || 0;
    },
    getTotalBalance: () => {
      // Note: This doesn't convert currencies, just sums the amounts
      return cashRegister.balances.reduce((total: number, balance: CashBalance) => total + balance.amount, 0);
    },
  };
};
