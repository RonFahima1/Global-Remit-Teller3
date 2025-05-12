/**
 * Exchange Rate Service
 * Handles exchange rate operations and integrations
 */

import { 
  ExchangeRate, 
  ExchangeRateHistory, 
  ExchangeRateUpdate, 
  ExchangeRateSource,
  ExchangeRateFilter,
  CurrencyPair,
  MarginConfiguration
} from '@/types/exchange-rate';
import { v4 as uuidv4 } from 'uuid';
import { mockExchangeRates } from './mock-data/exchange-rates';

/**
 * Exchange Rate Service Class
 */
class ExchangeRateService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  /**
   * Get all exchange rates
   */
  async getAllRates(): Promise<ExchangeRate[]> {
    try {
      // In a real app, this would be an API call
      // return await fetch(`${this.apiUrl}/exchange-rates`).then(res => res.json());
      
      // Using mock data for now
      return Promise.resolve(mockExchangeRates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }
  
  /**
   * Get exchange rates by filter
   */
  async getRatesByFilter(filter: ExchangeRateFilter): Promise<ExchangeRate[]> {
    try {
      // In a real app, this would be an API call with query params
      
      // Using mock data with filtering
      const filteredRates = mockExchangeRates.filter(rate => {
        if (filter.baseCurrency && rate.baseCurrency !== filter.baseCurrency) return false;
        if (filter.targetCurrency && rate.targetCurrency !== filter.targetCurrency) return false;
        if (filter.isActive !== undefined && rate.isActive !== filter.isActive) return false;
        if (filter.source && rate.source !== filter.source) return false;
        
        if (filter.startDate) {
          const startDate = new Date(filter.startDate);
          const effectiveDate = new Date(rate.effectiveDate);
          if (effectiveDate < startDate) return false;
        }
        
        if (filter.endDate) {
          const endDate = new Date(filter.endDate);
          if (rate.expirationDate) {
            const expirationDate = new Date(rate.expirationDate);
            if (expirationDate > endDate) return false;
          }
        }
        
        return true;
      });
      
      return Promise.resolve(filteredRates);
    } catch (error) {
      console.error('Error fetching exchange rates by filter:', error);
      throw error;
    }
  }
  
  /**
   * Get exchange rate by currency pair
   */
  async getRateByCurrencyPair(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate | null> {
    try {
      // In a real app, this would be an API call
      
      // Using mock data
      const rate = mockExchangeRates.find(
        r => r.baseCurrency === baseCurrency && 
             r.targetCurrency === targetCurrency &&
             r.isActive
      );
      
      return Promise.resolve(rate || null);
    } catch (error) {
      console.error('Error fetching exchange rate by currency pair:', error);
      throw error;
    }
  }
  
  /**
   * Create a new exchange rate
   */
  async createRate(rateData: ExchangeRateUpdate, userId: string): Promise<ExchangeRate> {
    try {
      // In a real app, this would be an API call
      
      // Create new exchange rate
      const now = new Date().toISOString();
      const newRate: ExchangeRate = {
        id: uuidv4(),
        baseCurrency: rateData.baseCurrency,
        targetCurrency: rateData.targetCurrency,
        rate: rateData.rate,
        inverseRate: 1 / rateData.rate,
        effectiveDate: rateData.effectiveDate || now,
        expirationDate: rateData.expirationDate || null,
        marginPercentage: rateData.marginPercentage || 0,
        isActive: rateData.isActive !== undefined ? rateData.isActive : true,
        lastUpdated: now,
        updatedBy: userId,
        source: ExchangeRateSource.MANUAL
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(newRate);
    } catch (error) {
      console.error('Error creating exchange rate:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing exchange rate
   */
  async updateRate(id: string, rateData: Partial<ExchangeRateUpdate>, userId: string): Promise<ExchangeRate> {
    try {
      // In a real app, this would be an API call
      
      // Find existing rate
      const existingRate = mockExchangeRates.find(r => r.id === id);
      if (!existingRate) {
        throw new Error('Exchange rate not found');
      }
      
      // Create history record before updating
      await this.createHistoryRecord(existingRate);
      
      // Update rate
      const updatedRate: ExchangeRate = {
        ...existingRate,
        ...rateData,
        inverseRate: rateData.rate ? 1 / rateData.rate : existingRate.inverseRate,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(updatedRate);
    } catch (error) {
      console.error('Error updating exchange rate:', error);
      throw error;
    }
  }
  
  /**
   * Create a history record for an exchange rate
   */
  private async createHistoryRecord(rate: ExchangeRate): Promise<ExchangeRateHistory> {
    try {
      // Create history record
      const historyRecord: ExchangeRateHistory = {
        id: uuidv4(),
        exchangeRateId: rate.id,
        baseCurrency: rate.baseCurrency,
        targetCurrency: rate.targetCurrency,
        rate: rate.rate,
        marginPercentage: rate.marginPercentage,
        effectiveDate: rate.effectiveDate,
        expirationDate: rate.expirationDate,
        source: rate.source,
        createdAt: new Date().toISOString()
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(historyRecord);
    } catch (error) {
      console.error('Error creating history record:', error);
      throw error;
    }
  }
  
  /**
   * Get exchange rate history
   */
  async getRateHistory(exchangeRateId: string): Promise<ExchangeRateHistory[]> {
    try {
      // In a real app, this would be an API call
      
      // Mock history data
      const mockHistory: ExchangeRateHistory[] = [];
      
      return Promise.resolve(mockHistory);
    } catch (error) {
      console.error('Error fetching exchange rate history:', error);
      throw error;
    }
  }
  
  /**
   * Calculate converted amount
   */
  async calculateConversion(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<{ amount: number; rate: number; fee: number; totalCost: number }> {
    try {
      // Get exchange rate
      const rate = await this.getRateByCurrencyPair(fromCurrency, toCurrency);
      
      if (!rate) {
        throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
      }
      
      // Calculate converted amount
      const convertedAmount = amount * rate.rate;
      
      // Calculate fee (in a real app, this would be based on fee configuration)
      const fee = amount * 0.03; // 3% fee
      
      // Calculate total cost
      const totalCost = amount + fee;
      
      return {
        amount: convertedAmount,
        rate: rate.rate,
        fee,
        totalCost
      };
    } catch (error) {
      console.error('Error calculating conversion:', error);
      throw error;
    }
  }
  
  /**
   * Refresh exchange rates from external provider
   */
  async refreshRatesFromProvider(providerId: string): Promise<ExchangeRate[]> {
    try {
      // In a real app, this would call an external API
      
      // Mock refreshed rates
      const refreshedRates: ExchangeRate[] = mockExchangeRates.map(rate => ({
        ...rate,
        lastUpdated: new Date().toISOString(),
        source: ExchangeRateSource.API
      }));
      
      return Promise.resolve(refreshedRates);
    } catch (error) {
      console.error('Error refreshing rates from provider:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const exchangeRateService = new ExchangeRateService();
