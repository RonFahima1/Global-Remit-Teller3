/**
 * Mock Exchange Rates
 * Provides mock data for exchange rates
 */

import { ExchangeRate, ExchangeRateSource } from '@/types/exchange-rate';

/**
 * Mock Exchange Rates
 */
export const mockExchangeRates: ExchangeRate[] = [
  {
    id: '1',
    baseCurrency: 'USD',
    targetCurrency: 'EUR',
    rate: 0.92,
    inverseRate: 1.087,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.5,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '2',
    baseCurrency: 'USD',
    targetCurrency: 'ILS',
    rate: 3.65,
    inverseRate: 0.274,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 3.0,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '3',
    baseCurrency: 'EUR',
    targetCurrency: 'ILS',
    rate: 3.97,
    inverseRate: 0.252,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.8,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '4',
    baseCurrency: 'USD',
    targetCurrency: 'GBP',
    rate: 0.78,
    inverseRate: 1.282,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.2,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '5',
    baseCurrency: 'USD',
    targetCurrency: 'CAD',
    rate: 1.35,
    inverseRate: 0.741,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.0,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '6',
    baseCurrency: 'USD',
    targetCurrency: 'AUD',
    rate: 1.48,
    inverseRate: 0.676,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.3,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '7',
    baseCurrency: 'USD',
    targetCurrency: 'JPY',
    rate: 109.25,
    inverseRate: 0.0092,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.1,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '8',
    baseCurrency: 'USD',
    targetCurrency: 'CHF',
    rate: 0.89,
    inverseRate: 1.124,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 2.4,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '9',
    baseCurrency: 'USD',
    targetCurrency: 'CNY',
    rate: 7.18,
    inverseRate: 0.139,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 3.2,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  },
  {
    id: '10',
    baseCurrency: 'USD',
    targetCurrency: 'INR',
    rate: 83.45,
    inverseRate: 0.012,
    effectiveDate: '2025-05-01T00:00:00Z',
    expirationDate: null,
    marginPercentage: 3.5,
    isActive: true,
    lastUpdated: '2025-05-12T10:00:00Z',
    updatedBy: 'system',
    source: ExchangeRateSource.API
  }
];
