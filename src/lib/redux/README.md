# Redux State Management

This directory contains Redux implementation for the Global Remit Teller application. Redux is used for global state management, following a modular architecture with clean separation of concerns.

## Architecture

The Redux implementation follows these design principles:

- **Modular Design**: State is divided into focused slices with single responsibilities
- **File Size Limit**: All files are kept under 200 lines for maintainability
- **Type Safety**: Comprehensive TypeScript types for all state and actions
- **Performance**: Optimized for performance with proper memoization
- **Developer Experience**: Custom hooks for easy state access

## Store Configuration

The Redux store is configured in `store.ts` with the following features:

- Combined reducers from all slices
- Middleware configuration with serialization settings
- DevTools integration for development
- TypeScript types for the root state and dispatch

## State Slices

### Auth Slice

Manages authentication state including:

- User information
- Access and refresh tokens
- Authentication status
- Error handling

### UI Slice

Handles UI-related state such as:

- Theme settings
- Sidebar visibility
- Loading states
- Modal management
- Current view tracking

### Cash Register Slice

Manages cash register operations including:

- Drawer open/close status
- Cash balances by currency
- Recent operations
- Error handling

## Custom Hooks

Custom hooks are provided in `hooks.ts` for easy access to the Redux state:

- `useAppDispatch`: Typed dispatch function
- `useAppSelector`: Typed selector function
- `useAuth`: Access to authentication state with helper methods
- `useUI`: Access to UI state with helper methods
- `useCashRegister`: Access to cash register state with helper methods

## Usage

To use Redux in components:

```tsx
import { useAuth, useUI, useCashRegister } from '@/lib/redux/hooks';
import { setTheme, toggleSidebar } from '@/lib/redux/slices/ui-slice';
import { logout } from '@/lib/redux/slices/auth-slice';

function Component() {
  const { user, isAuthenticated } = useAuth();
  const { theme, sidebarOpen } = useUI();
  const dispatch = useAppDispatch();
  
  // Dispatch actions
  const handleThemeChange = () => {
    dispatch(setTheme('dark'));
  };
  
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    // ...
  );
}
```

## Best Practices

1. **Use Custom Hooks**: Always use the provided custom hooks instead of direct selectors
2. **Minimize Rerenders**: Select only the state you need to avoid unnecessary rerenders
3. **Action Creators**: Use the exported action creators for dispatching actions
4. **Immutability**: Never mutate state directly, always use the reducer functions
5. **Selectors**: Create memoized selectors for derived state when needed
