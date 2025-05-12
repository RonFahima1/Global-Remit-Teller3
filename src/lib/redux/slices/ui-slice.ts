/**
 * UI Slice
 * Manages UI-related state such as theme, sidebar visibility, and loading states
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Initial state
const initialState: UiState = {
  theme: 'system',
  sidebarOpen: true,
  globalLoading: false,
  loadingStates: {},
  currentView: null,
  modalState: {
    isOpen: false,
    type: null,
    data: null,
  },
};

/**
 * UI slice for managing UI-related state
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme management
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    // Loading state management
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.loadingStates[key] = isLoading;
    },
    
    // View management
    setCurrentView: (state, action: PayloadAction<string | null>) => {
      state.currentView = action.payload;
    },
    
    // Modal management
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modalState = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modalState = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    updateModalData: (state, action: PayloadAction<any>) => {
      if (state.modalState.isOpen) {
        state.modalState.data = action.payload;
      }
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  setLoadingState,
  setCurrentView,
  openModal,
  closeModal,
  updateModalData,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
