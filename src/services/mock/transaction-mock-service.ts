/**
 * Transaction Mock Service
 * Provides mock data for transaction-related components during development
 */

/**
 * Generate mock transaction summary data
 */
export const getMockTransactionSummary = (timeframe: 'daily' | 'weekly' | 'monthly' = 'daily') => {
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

// Export all mock functions
export const transactionMockService = {
  getTransactionSummary: getMockTransactionSummary
};

export default transactionMockService;
