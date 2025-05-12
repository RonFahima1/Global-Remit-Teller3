# Global Remit Teller Services

This directory contains service implementations for the Global Remit Teller application. These services handle business logic and API communication, following a modular architecture with clean separation of concerns.

## Service Architecture

All services follow these design principles:

- **Modular Design**: Each service has a single responsibility
- **File Size Limit**: All files are kept under 200 lines for maintainability
- **Error Handling**: Consistent error handling using the global error handling system
- **API Integration**: All services use the base API service for communication
- **Type Safety**: Comprehensive TypeScript types for all interfaces and methods

## Available Services

### Core Services

- **API Service**: Base service for handling API requests, authentication, and caching
- **Transaction Service**: Handles money transfer operations and transaction management
- **Client Service**: Manages client data, profiles, and KYC verification
- **Currency Exchange Service**: Handles currency exchange operations and rate management
- **Financial Operations Service**: Manages deposits, withdrawals, and other financial transactions

### User Management

- **User Service**: Handles user operations, roles, and permissions

### Communication

- **Notification Service**: Manages user notifications across different channels

### Analytics and Reporting

- **Dashboard Service**: Provides key metrics and analytics for the dashboard
- **Report Service**: Handles report generation and management

### Utility Services

- **Search Service**: Provides global search functionality across the application

## Using Services

Services can be accessed in components using the custom hooks provided by the ServiceProvider:

```tsx
import { useClientService } from '@/components/providers/service-provider';

function ClientList() {
  const clientService = useClientService();
  
  // Use the service methods
  const fetchClients = async () => {
    const clients = await clientService.getAllClients();
    // ...
  };
  
  return (
    // ...
  );
}
```

## State Management

The application uses Redux Toolkit for global state management, with the following slices:

- **Auth Slice**: Manages authentication state
- **UI Slice**: Handles UI-related state
- **Cash Register Slice**: Manages cash register operations

Redux state can be accessed using the custom hooks:

```tsx
import { useAuth, useUI, useCashRegister } from '@/lib/redux/hooks';

function Component() {
  const { user, isAuthenticated } = useAuth();
  const { theme, sidebarOpen } = useUI();
  const { isOpen, balances } = useCashRegister();
  
  return (
    // ...
  );
}
```

## Error Handling

All services use the global error handling system, which provides:

- Structured error objects with severity levels
- User-friendly error messages
- Consistent error handling across the application
- Integration with the UI for error display

## Best Practices

1. **Service Instantiation**: Always use the exported service instances, not the classes directly
2. **Error Handling**: Always handle errors from service methods using try/catch
3. **Loading States**: Implement loading states for async operations
4. **Caching**: Use React Query for data fetching and caching when appropriate
5. **Type Safety**: Use the provided TypeScript interfaces for type safety
