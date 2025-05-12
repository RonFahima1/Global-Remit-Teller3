# Cash Register System

## Overview

The Cash Register System is a comprehensive solution for managing cash operations in the Global Remit Teller application. It provides a robust set of features for handling cash drawer operations, including opening/closing the drawer, adding/removing cash, reconciliation, and detailed operation history.

## Architecture

The system follows a modular architecture with clean separation of concerns, ensuring all files stay under 200 lines for maintainability. The architecture consists of:

### 1. Service Layer

The service layer handles all business logic and API communication:

- **`cash-register-service.ts`**: Core service that manages cash register operations and integrates with Redux for state management.

### 2. State Management

The system uses Redux for state management:

- **`cash-register-slice.ts`**: Redux slice that manages cash register state including drawer status, balances, and operations history.
- **`useCashRegisterService.ts`**: Custom hook that provides a unified interface to access cash register functionality.

### 3. UI Components

The UI layer consists of modular components:

- **`CashRegisterDashboard.tsx`**: Main dashboard component that integrates all cash register functionality.
- **`CashBalanceSummary.tsx`**: Displays currency balances with visual indicators.
- **`CashOperationsHistory.tsx`**: Shows a filterable history of cash operations.
- **`CashDrawerRedux.tsx`**: Handles denomination counting and reconciliation.
- **`AddCashModalRedux.tsx`**: Modal for adding cash to the drawer.
- **`RemoveCashModalRedux.tsx`**: Modal for removing cash from the drawer.
- **`ReconcileCashModalRedux.tsx`**: Modal for reconciling cash balances.

### 4. Pages

- **`unified/page.tsx`**: Unified cash register page that brings all components together.

## Data Flow

1. **User Interaction**: User interacts with UI components (e.g., clicks "Open Drawer").
2. **Hook Call**: Component calls the appropriate method from `useCashRegisterService`.
3. **Service Call**: Hook calls the corresponding method in `cash-register-service.ts`.
4. **Redux Update**: Service dispatches actions to update the Redux state.
5. **UI Update**: Components re-render based on the updated state.

## Core Features

### 1. Cash Drawer Management

- **Opening the Drawer**: Initialize the cash drawer with initial balances for each currency.
- **Closing the Drawer**: Close the drawer and record the final balances.
- **Drawer Status**: Track whether the drawer is open or closed, who opened it, and when.

### 2. Cash Operations

- **Add Cash**: Add cash to the drawer with specified amount, currency, and notes.
- **Remove Cash**: Remove cash from the drawer with validation to prevent overdrafts.
- **Reconcile Cash**: Adjust cash balances based on physical count.

### 3. Multi-Currency Support

The system supports multiple currencies:

- USD (US Dollar)
- EUR (Euro)
- ILS (Israeli Shekel)

Each currency has its own denominations (bills and coins) for detailed counting.

### 4. Operations History

- Track all cash operations with timestamps, user information, and details.
- Filter operations by type, search by various criteria, and sort by different fields.
- Paginate results for better performance with large datasets.

## Cash Operation Types

The system supports the following operation types:

- **OPEN**: Opening the cash drawer.
- **CLOSE**: Closing the cash drawer.
- **DEPOSIT**: Adding cash to the drawer.
- **WITHDRAWAL**: Removing cash from the drawer.
- **ADJUSTMENT**: Reconciling cash balances.

## State Structure

The Redux state for the cash register has the following structure:

```typescript
interface CashRegisterState {
  isOpen: boolean;
  openedAt: string | null;
  openedBy: string | null;
  balances: CashBalance[];
  recentOperations: CashOperation[];
  isLoading: boolean;
  error: string | null;
}

interface CashBalance {
  currency: string;
  amount: number;
  lastUpdated: string;
}

interface CashOperation {
  id: string;
  type: CashOperationType;
  amount: number;
  currency: string;
  timestamp: string;
  userId: string;
  notes?: string;
  reference?: string;
}
```

## Usage Examples

### Opening the Cash Drawer

```tsx
const { openCashRegister } = useCashRegisterService();

// Open the cash drawer with initial balances
await openCashRegister('user-123', [
  { currency: 'USD', amount: 1000, lastUpdated: new Date().toISOString() },
  { currency: 'EUR', amount: 500, lastUpdated: new Date().toISOString() },
  { currency: 'ILS', amount: 2000, lastUpdated: new Date().toISOString() }
]);
```

### Adding Cash

```tsx
const { addCash } = useCashRegisterService();

// Add $500 to the drawer
await addCash(500, 'USD', 'user-123', 'Cash deposit from customer');
```

### Reconciling Cash

```tsx
const { reconcileCash } = useCashRegisterService();

// Reconcile USD balance to $1200
await reconcileCash(1200, 'USD', 'user-123', 'End of day reconciliation');
```

## Error Handling

The system includes comprehensive error handling:

1. **Validation Errors**: Prevent invalid operations (e.g., removing more cash than available).
2. **State Errors**: Handle errors related to drawer state (e.g., attempting to add cash when drawer is closed).
3. **Service Errors**: Handle API communication errors.

All errors are displayed to the user with clear, actionable messages.

## UI Components Details

### CashRegisterDashboard

The main dashboard provides:

- Status overview (drawer open/closed, opened by, opened at)
- Balance summary across all currencies
- Quick actions (add cash, remove cash, reconcile)
- Tabbed interface for different views (overview, drawer, operations)

### CashDrawerRedux

Handles denomination counting with:

- Tabs for different currencies
- Input fields for each denomination
- Real-time calculation of totals
- Reconciliation functionality

### CashOperationsHistory

Provides a detailed view of operations with:

- Filtering by operation type
- Searching by various criteria
- Sorting by different fields
- Pagination for large datasets

## Best Practices

The Cash Register System follows these best practices:

1. **Modularity**: Each component and service has a single responsibility.
2. **Type Safety**: Comprehensive TypeScript types for all interfaces and methods.
3. **Error Handling**: Consistent error handling with user-friendly messages.
4. **Performance**: Optimized rendering with proper memoization.
5. **Accessibility**: Follows WCAG guidelines for accessibility.
6. **Responsiveness**: Works well on all device sizes.

## Future Enhancements

Potential future enhancements include:

1. **Reporting**: Generate detailed reports for cash operations.
2. **Audit Trail**: Enhanced audit trail for compliance purposes.
3. **Integration with Accounting**: Integrate with accounting systems.
4. **Cash Forecasting**: Predict cash needs based on historical data.
5. **Multi-Drawer Support**: Support multiple cash drawers for different tellers.
