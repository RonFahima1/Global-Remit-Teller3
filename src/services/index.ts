/**
 * Services Index
 * Export all services from a single location for easy imports
 */

// Core services
export { default as apiService } from './api-service';
export { default as transactionService } from './transaction-service';
export { default as clientService } from './client-service';
export { default as currencyExchangeService } from './currency-exchange-service';
export { default as financialOperationsService } from './financial-operations-service';

// User and authentication related services
export { default as userService } from './user-service';

// Notification and communication services
export { default as notificationService } from './notification-service';

// Reporting and analytics services
export { default as dashboardService } from './dashboard-service';
export { default as reportService } from './report-service';

// Utility services
export { default as searchService } from './search-service';

// Also export types from services
export * from './transaction-service';
export * from './client-service';
export * from './currency-exchange-service';
export * from './financial-operations-service';
export * from './user-service';
export * from './notification-service';
export * from './dashboard-service';
export * from './report-service';
export * from './search-service';
