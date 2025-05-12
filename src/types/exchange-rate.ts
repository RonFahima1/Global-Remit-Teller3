/**
 * Exchange Rate Types
 * Defines types for exchange rate management
 */

/**
 * Exchange Rate Model
 * Represents an exchange rate between two currencies
 */
export interface ExchangeRate {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  inverseRate: number;
  effectiveDate: string;
  expirationDate: string | null;
  marginPercentage: number;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  source: ExchangeRateSource;
}

/**
 * Exchange Rate Source
 * Represents the source of an exchange rate
 */
export enum ExchangeRateSource {
  MANUAL = 'MANUAL',
  API = 'API',
  PARTNER = 'PARTNER'
}

/**
 * Exchange Rate History
 * Represents a historical exchange rate record
 */
export interface ExchangeRateHistory {
  id: string;
  exchangeRateId: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  marginPercentage: number;
  effectiveDate: string;
  expirationDate: string | null;
  source: ExchangeRateSource;
  createdAt: string;
}

/**
 * Exchange Rate Update
 * Represents data for updating an exchange rate
 */
export interface ExchangeRateUpdate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  marginPercentage?: number;
  effectiveDate?: string;
  expirationDate?: string | null;
  isActive?: boolean;
}

/**
 * Currency Pair
 * Represents a pair of currencies for exchange
 */
export interface CurrencyPair {
  baseCurrency: string;
  targetCurrency: string;
}

/**
 * Margin Configuration
 * Represents margin configuration for a currency pair
 */
export interface MarginConfiguration {
  id: string;
  currencyPair: CurrencyPair;
  defaultMargin: number;
  minMargin: number;
  maxMargin: number;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

/**
 * Exchange Rate Provider
 * Represents an external exchange rate provider
 */
export interface ExchangeRateProvider {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  isActive: boolean;
  supportedCurrencies: string[];
  refreshInterval: number; // in minutes
  lastRefresh: string | null;
}

/**
 * Exchange Rate Filter
 * Represents filters for querying exchange rates
 */
export interface ExchangeRateFilter {
  baseCurrency?: string;
  targetCurrency?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  source?: ExchangeRateSource;
}
