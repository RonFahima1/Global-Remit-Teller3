# Exchange Rate Management System

## Overview

The Exchange Rate Management System is a comprehensive solution for managing currency exchange rates in the Global Remit Teller application. It provides functionality for creating, updating, and tracking exchange rates, with support for multiple currencies, margin configuration, and integration with external rate providers.

## Architecture

The system follows a modular architecture with clean separation of concerns, ensuring all files stay under 200 lines for maintainability. The architecture consists of:

### 1. Data Models

The system uses TypeScript interfaces to define the data models:

- **`ExchangeRate`**: Represents an exchange rate between two currencies.
- **`ExchangeRateHistory`**: Represents a historical exchange rate record.
- **`ExchangeRateUpdate`**: Represents data for updating an exchange rate.
- **`CurrencyPair`**: Represents a pair of currencies for exchange.
- **`MarginConfiguration`**: Represents margin configuration for a currency pair.
- **`ExchangeRateProvider`**: Represents an external exchange rate provider.
- **`ExchangeRateFilter`**: Represents filters for querying exchange rates.

### 2. Service Layer

The service layer handles all business logic and API communication:

- **`exchange-rate-service.ts`**: Core service that manages exchange rate operations.

### 3. State Management

The system uses Redux for state management:

- **`exchange-rate-slice.ts`**: Redux slice that manages exchange rate state.
- **`useExchangeRates.ts`**: Custom hook that provides a unified interface to access exchange rate functionality.

### 4. UI Components

The UI layer consists of modular components:

- **`ExchangeRateTable.tsx`**: Displays a table of exchange rates with filtering and sorting.
- **`ExchangeRateForm.tsx`**: Form for creating and editing exchange rates.

### 5. Pages

- **`exchange-rates/page.tsx`**: Main page for managing exchange rates.

## Core Features

### 1. Exchange Rate Management

- **Create Exchange Rates**: Add new exchange rates between currency pairs.
- **Update Exchange Rates**: Modify existing exchange rates.
- **View Exchange Rates**: Display all exchange rates with filtering and sorting.
- **Track Rate History**: Maintain a history of rate changes.

### 2. Multi-Currency Support

The system supports multiple currencies:

- USD (US Dollar)
- EUR (Euro)
- ILS (Israeli Shekel)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- INR (Indian Rupee)

### 3. Margin Configuration

- Set margin percentages for each currency pair.
- Configure default margins for new rates.
- Track margin changes over time.

### 4. Rate Provider Integration

- Configure external rate providers.
- Automatically refresh rates from providers.
- Track the source of each rate (Manual, API, Partner).

## Data Flow

1. **User Interaction**: User interacts with UI components (e.g., clicks "Create Rate").
2. **Form Submission**: User fills out the form and submits.
3. **Hook Call**: Component calls the appropriate method from `useExchangeRates`.
4. **Redux Action**: Hook dispatches an action to the Redux store.
5. **Service Call**: Redux thunk calls the corresponding method in `exchange-rate-service.ts`.
6. **State Update**: Service returns the result, which updates the Redux state.
7. **UI Update**: Components re-render based on the updated state.

## State Structure

The Redux state for exchange rates has the following structure:

```typescript
interface ExchangeRateState {
  rates: ExchangeRate[];
  currentRate: ExchangeRate | null;
  rateHistory: ExchangeRateHistory[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
```

## Usage Examples

### Fetching Exchange Rates

```tsx
const { loadAllRates, rates, isLoading } = useExchangeRates();

// Load all rates
useEffect(() => {
  loadAllRates();
}, [loadAllRates]);

// Display rates
return (
  <div>
    {isLoading ? (
      <p>Loading rates...</p>
    ) : (
      <ul>
        {rates.map(rate => (
          <li key={rate.id}>
            {rate.baseCurrency} to {rate.targetCurrency}: {rate.rate}
          </li>
        ))}
      </ul>
    )}
  </div>
);
```

### Creating a New Rate

```tsx
const { createRate } = useExchangeRates();

// Create a new rate
const handleCreateRate = async () => {
  try {
    await createRate({
      baseCurrency: 'USD',
      targetCurrency: 'EUR',
      rate: 0.92,
      marginPercentage: 2.5,
      effectiveDate: new Date().toISOString(),
      isActive: true
    }, 'user-123');
    
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Converting Currency

```tsx
const { calculateConversion } = useExchangeRates();

// Convert currency
const handleConvert = () => {
  try {
    const result = calculateConversion(100, 'USD', 'EUR');
    console.log(`100 USD = ${result.amount} EUR`);
    console.log(`Fee: ${result.fee} USD`);
    console.log(`Total cost: ${result.totalCost} USD`);
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling

The system includes comprehensive error handling:

1. **Validation Errors**: Prevent invalid rates (e.g., negative rates).
2. **Service Errors**: Handle API communication errors.
3. **State Errors**: Handle Redux state errors.

All errors are displayed to the user with clear, actionable messages.

## UI Components Details

### ExchangeRateTable

The main table component provides:

- Filtering by base currency, target currency, and source
- Sorting by any column
- Search functionality
- Actions for editing rates
- Refresh button to update rates

### ExchangeRateForm

The form component provides:

- Fields for all rate properties
- Validation for all inputs
- Support for both creating and editing rates
- Clear error messages

## Best Practices

The Exchange Rate Management System follows these best practices:

1. **Modularity**: Each component and service has a single responsibility.
2. **Type Safety**: Comprehensive TypeScript types for all interfaces and methods.
3. **Error Handling**: Consistent error handling with user-friendly messages.
4. **Performance**: Optimized rendering with proper memoization.
5. **Accessibility**: Follows WCAG guidelines for accessibility.
6. **Responsiveness**: Works well on all device sizes.

## Future Enhancements

Potential future enhancements include:

1. **Rate Alerts**: Notify users when rates change significantly.
2. **Rate Forecasting**: Predict future rates based on historical data.
3. **Batch Updates**: Update multiple rates at once.
4. **Rate Scheduling**: Schedule rate changes for future dates.
5. **Advanced Reporting**: Generate reports on rate changes and margins.
6. **API Integration**: Integrate with more external rate providers.
7. **Rate Comparison**: Compare rates from different providers.
8. **Custom Formulas**: Allow custom formulas for calculating rates.
