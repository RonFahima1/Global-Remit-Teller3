/**
 * Service Provider Component
 * Makes all services available throughout the application
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import * as services from '@/services';

// Create a context for the services
const ServiceContext = createContext<typeof services | undefined>(undefined);

// Props for the ServiceProvider component
interface ServiceProviderProps {
  children: ReactNode;
}

/**
 * Service Provider Component
 * Provides access to all application services
 */
export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Custom hook to use the services in components
 */
export const useServices = () => {
  const context = useContext(ServiceContext);
  
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  
  return context;
};

/**
 * Individual service hooks for better type safety and convenience
 */
export const useApiService = () => useServices().apiService;
export const useTransactionService = () => useServices().transactionService;
export const useClientService = () => useServices().clientService;
export const useCurrencyExchangeService = () => useServices().currencyExchangeService;
export const useFinancialOperationsService = () => useServices().financialOperationsService;
export const useUserService = () => useServices().userService;
export const useNotificationService = () => useServices().notificationService;
export const useDashboardService = () => useServices().dashboardService;
export const useReportService = () => useServices().reportService;
export const useSearchService = () => useServices().searchService;

export default ServiceProvider;
