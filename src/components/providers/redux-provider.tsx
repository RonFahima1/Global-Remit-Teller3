/**
 * Redux Provider Component
 * Makes the Redux store available throughout the application
 */

'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

// Props for the ReduxProvider component
interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Redux Provider Component
 * Wraps the application with the Redux Provider
 */
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
