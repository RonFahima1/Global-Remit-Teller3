/**
 * Currency Exchange Mock Service
 * Provides mock data for currency exchange components during development
 */

/**
 * Generate mock exchange rate data
 */
export const getMockExchangeRate = (fromCurrency: string, toCurrency: string) => {
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

// Export all mock functions
export const currencyExchangeMockService = {
  getExchangeRate: getMockExchangeRate
};

export default currencyExchangeMockService;
