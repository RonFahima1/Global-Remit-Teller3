/**
 * Redux Store Configuration
 * Central state management for the Global Remit Teller application
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers
import authReducer from './slices/auth-slice';
import uiReducer from './slices/ui-slice';
import cashRegisterReducer from './slices/cash-register-slice';

/**
 * Configure the Redux store with all reducers
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    cashRegister: cashRegisterReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'auth.error'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
