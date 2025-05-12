'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the state interface
interface AppState {
  currentStep: number;
  isDrawerOpen: boolean;
  activeCurrency: string;
  activeTab: string;
  searchQuery: string;
  filters: Record<string, any>;
  selectedItems: string[];
  lastUpdated: Date;
}

// Define action types
type AppAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean }
  | { type: 'SET_ACTIVE_CURRENCY'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Record<string, any> }
  | { type: 'UPDATE_FILTER'; payload: { key: string; value: any } }
  | { type: 'RESET_FILTERS' }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'DESELECT_ITEM'; payload: string }
  | { type: 'TOGGLE_ITEM_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTED_ITEMS' };

// Define the initial state
const initialState: AppState = {
  currentStep: 1,
  isDrawerOpen: false,
  activeCurrency: 'USD',
  activeTab: 'overview',
  searchQuery: '',
  filters: {},
  selectedItems: [],
  lastUpdated: new Date(),
};

// Create the context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Create the reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
        lastUpdated: new Date(),
      };
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        isDrawerOpen: action.payload !== undefined ? action.payload : !state.isDrawerOpen,
        lastUpdated: new Date(),
      };
    case 'SET_ACTIVE_CURRENCY':
      return {
        ...state,
        activeCurrency: action.payload,
        lastUpdated: new Date(),
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
        lastUpdated: new Date(),
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        lastUpdated: new Date(),
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        lastUpdated: new Date(),
      };
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
        lastUpdated: new Date(),
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {},
        lastUpdated: new Date(),
      };
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.payload],
        lastUpdated: new Date(),
      };
    case 'DESELECT_ITEM':
      return {
        ...state,
        selectedItems: state.selectedItems.filter(id => id !== action.payload),
        lastUpdated: new Date(),
      };
    case 'TOGGLE_ITEM_SELECTION':
      return {
        ...state,
        selectedItems: state.selectedItems.includes(action.payload)
          ? state.selectedItems.filter(id => id !== action.payload)
          : [...state.selectedItems, action.payload],
        lastUpdated: new Date(),
      };
    case 'CLEAR_SELECTED_ITEMS':
      return {
        ...state,
        selectedItems: [],
        lastUpdated: new Date(),
      };
    default:
      return state;
  }
}

// Create the provider component
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Create a custom hook for using the context
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// Create action creator hooks for common operations
export function useAppActions() {
  const { dispatch } = useAppState();

  return {
    setCurrentStep: (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    toggleDrawer: (isOpen?: boolean) => dispatch({ type: 'TOGGLE_DRAWER', payload: isOpen }),
    setActiveCurrency: (currency: string) => dispatch({ type: 'SET_ACTIVE_CURRENCY', payload: currency }),
    setActiveTab: (tab: string) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    setFilters: (filters: Record<string, any>) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    updateFilter: (key: string, value: any) => dispatch({ type: 'UPDATE_FILTER', payload: { key, value } }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    selectItem: (id: string) => dispatch({ type: 'SELECT_ITEM', payload: id }),
    deselectItem: (id: string) => dispatch({ type: 'DESELECT_ITEM', payload: id }),
    toggleItemSelection: (id: string) => dispatch({ type: 'TOGGLE_ITEM_SELECTION', payload: id }),
    clearSelectedItems: () => dispatch({ type: 'CLEAR_SELECTED_ITEMS' }),
  };
}
