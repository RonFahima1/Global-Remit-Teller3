/**
 * Dashboard Mock Service
 * Provides mock data for dashboard components during development
 */

import { 
  TransactionSummary, 
  TransactionsByType, 
  ClientSummary, 
  ExchangeRateSummary, 
  ActivityLog, 
  DashboardSummary 
} from '../dashboard-service';

/**
 * Generate mock transaction summary data
 */
export const getMockTransactionSummary = (timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'): any => {
  // Base data
  const baseData = {
    totalTransactions: {
      label: 'Total Transactions',
      value: 234,
      change: 5.2,
      isPositiveGood: true
    },
    totalVolume: {
      label: 'Total Volume',
      value: 125750,
      change: 7.8,
      currency: 'USD',
      isPositiveGood: true
    },
    averageAmount: {
      label: 'Average Amount',
      value: 537.4,
      change: 2.1,
      currency: 'USD',
      isPositiveGood: true
    },
    newClients: {
      label: 'New Clients',
      value: 18,
      change: 12.5,
      isPositiveGood: true
    },
    successRate: {
      label: 'Success Rate',
      value: 98.2,
      change: 0.5,
      isPercentage: true,
      isPositiveGood: true
    },
    topCurrencies: [
      { currency: 'USD', volume: 75450, transactions: 142 },
      { currency: 'EUR', volume: 32150, transactions: 58 },
      { currency: 'GBP', volume: 18150, transactions: 34 }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'send',
        amount: 1250,
        currency: 'USD',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'completed',
        clientName: 'John Smith'
      },
      {
        id: '2',
        type: 'receive',
        amount: 850,
        currency: 'EUR',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'completed',
        clientName: 'Maria Rodriguez'
      },
      {
        id: '3',
        type: 'exchange',
        amount: 2000,
        currency: 'GBP',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        status: 'pending',
        clientName: 'David Chen'
      },
      {
        id: '4',
        type: 'deposit',
        amount: 500,
        currency: 'USD',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        status: 'completed',
        clientName: 'Sarah Johnson'
      },
      {
        id: '5',
        type: 'withdrawal',
        amount: 300,
        currency: 'EUR',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        status: 'failed',
        clientName: 'Michael Brown'
      }
    ]
  };
  
  // Adjust data based on timeframe
  switch (timeframe) {
    case 'weekly':
      return {
        ...baseData,
        totalTransactions: { ...baseData.totalTransactions, value: 1245, change: 3.8 },
        totalVolume: { ...baseData.totalVolume, value: 675890, change: 4.2 },
        averageAmount: { ...baseData.averageAmount, value: 542.9, change: 1.5 },
        newClients: { ...baseData.newClients, value: 87, change: 8.3 }
      };
    case 'monthly':
      return {
        ...baseData,
        totalTransactions: { ...baseData.totalTransactions, value: 5234, change: 2.5 },
        totalVolume: { ...baseData.totalVolume, value: 2845750, change: 3.1 },
        averageAmount: { ...baseData.averageAmount, value: 543.7, change: 0.8 },
        newClients: { ...baseData.newClients, value: 342, change: 5.7 }
      };
    default:
      return baseData;
  }
};

/**
 * Generate mock exchange rate data
 */
export const getMockExchangeRate = (fromCurrency: string, toCurrency: string): any => {
  // Base exchange rates
  const baseRates: Record<string, Record<string, number>> = {
    'USD': {
      'EUR': 0.9234,
      'GBP': 0.7845,
      'ILS': 3.7520,
      'CAD': 1.3645,
      'AUD': 1.5234,
      'JPY': 143.21,
      'CHF': 0.8934
    },
    'EUR': {
      'USD': 1.0830,
      'GBP': 0.8495,
      'ILS': 4.0634,
      'CAD': 1.4778,
      'AUD': 1.6497,
      'JPY': 155.09,
      'CHF': 0.9674
    },
    'GBP': {
      'USD': 1.2747,
      'EUR': 1.1770,
      'ILS': 4.7827,
      'CAD': 1.7394,
      'AUD': 1.9420,
      'JPY': 182.55,
      'CHF': 1.1387
    }
  };
  
  // Add missing currency pairs
  Object.keys(baseRates).forEach(from => {
    Object.keys(baseRates[from]).forEach(to => {
      if (!baseRates[to]) {
        baseRates[to] = {};
      }
      if (!baseRates[to][from]) {
        baseRates[to][from] = 1 / baseRates[from][to];
      }
    });
  });
  
  // Ensure all currencies have entries
  const allCurrencies = ['USD', 'EUR', 'GBP', 'ILS', 'CAD', 'AUD', 'JPY', 'CHF'];
  allCurrencies.forEach(from => {
    if (!baseRates[from]) {
      baseRates[from] = {};
    }
    allCurrencies.forEach(to => {
      if (from !== to && !baseRates[from][to]) {
        // Generate a random rate if not defined
        baseRates[from][to] = Math.random() * 10;
      }
    });
  });
  
  // Generate a random change percentage between -2% and +2%
  const change = (Math.random() * 4 - 2).toFixed(2);
  
  // Return the exchange rate data
  return {
    fromCurrency,
    toCurrency,
    rate: baseRates[fromCurrency]?.[toCurrency] || 1.0,
    change: parseFloat(change),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Generate mock client activity data
 */
export const getMockClientActivities = (): any => {
  return {
    activities: [
      {
        id: '1',
        clientId: 'client-1',
        clientName: 'John Smith',
        clientAvatar: '',
        activityType: 'registration',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        details: 'New client registration'
      },
      {
        id: '2',
        clientId: 'client-2',
        clientName: 'Maria Rodriguez',
        clientAvatar: '',
        activityType: 'verification',
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        details: 'Identity verification in progress'
      },
      {
        id: '3',
        clientId: 'client-3',
        clientName: 'David Chen',
        clientAvatar: '',
        activityType: 'transaction',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        details: 'Completed money transfer of $2,000'
      },
      {
        id: '4',
        clientId: 'client-4',
        clientName: 'Sarah Johnson',
        clientAvatar: '',
        activityType: 'kyc',
        status: 'rejected',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        details: 'KYC documents rejected'
      },
      {
        id: '5',
        clientId: 'client-5',
        clientName: 'Michael Brown',
        clientAvatar: '',
        activityType: 'update',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        details: 'Updated contact information'
      }
    ]
  };
};

/**
 * Get mock new clients count
 */
export const getMockNewClientsCount = (): any => {
  return { count: 12 };
};

/**
 * Get mock pending verifications count
 */
export const getMockPendingVerificationsCount = (): any => {
  return { count: 8 };
};

// Export all mock functions
export const dashboardMockService = {
  getTransactionSummary: getMockTransactionSummary,
  getExchangeRate: getMockExchangeRate,
  getClientActivities: getMockClientActivities,
  getNewClientsCount: getMockNewClientsCount,
  getPendingVerificationsCount: getMockPendingVerificationsCount
};

export default dashboardMockService;
