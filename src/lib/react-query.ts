/**
 * React Query configuration and utility functions
 * Provides efficient data fetching, caching, and state management
 */

import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default query options
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
      retry: 1, // Only retry failed queries once
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
    },
    mutations: {
      // Default mutation options
      retry: 1, // Only retry failed mutations once
    },
  },
});

// Query key factory to ensure consistent query keys
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
  clients: {
    all: ['clients'],
    detail: (id: string) => ['clients', id],
    search: (query: string) => ['clients', 'search', query],
    recent: ['clients', 'recent'],
  },
  transactions: {
    all: ['transactions'],
    detail: (id: string) => ['transactions', id],
    history: (params?: any) => ['transactions', 'history', params],
    pending: ['transactions', 'pending'],
    recent: ['transactions', 'recent'],
  },
  transfers: {
    all: ['transfers'],
    detail: (id: string) => ['transfers', id],
    history: (params?: any) => ['transfers', 'history', params],
  },
  exchange: {
    rates: ['exchange', 'rates'],
    history: ['exchange', 'history'],
  },
  cashRegister: {
    summary: ['cashRegister', 'summary'],
    transactions: ['cashRegister', 'transactions'],
  },
  dashboard: {
    summary: ['dashboard', 'summary'],
    charts: ['dashboard', 'charts'],
    activity: ['dashboard', 'activity'],
  },
  users: {
    all: ['users'],
    detail: (id: string) => ['users', id],
  },
  settings: {
    all: ['settings'],
    category: (category: string) => ['settings', category],
  },
};

// Utility function to invalidate related queries
export const invalidateQueries = async (keys: string[][]) => {
  const promises = keys.map(key => queryClient.invalidateQueries({ queryKey: key }));
  await Promise.all(promises);
};

// Utility function to prefetch queries
export const prefetchQueries = async (
  queries: Array<{
    queryKey: string[];
    queryFn: () => Promise<any>;
    staleTime?: number;
  }>
) => {
  const promises = queries.map(({ queryKey, queryFn, staleTime }) => 
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime,
    })
  );
  await Promise.all(promises);
};

// Utility function to reset cache
export const resetQueryCache = () => {
  queryClient.clear();
};
