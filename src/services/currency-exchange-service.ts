/**
 * Currency Exchange Service
 * Handles currency exchange operations and rate management
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Currency interface
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isActive: boolean;
}

// Exchange rate interface
export interface ExchangeRate {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  inverseRate: number;
  lastUpdated: string;
  provider: string;
}

// Exchange transaction interface
export interface ExchangeTransaction {
  id: string;
  userId: string;
  clientId?: string;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  targetAmount: number;
  rate: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  notes?: string;
  reference?: string;
}

/**
 * Currency Exchange Service class
 */
class CurrencyExchangeService {
  private apiEndpoint = '/currency-exchange';

  /**
   * Get all supported currencies
   */
  async getAllCurrencies(): Promise<Currency[]> {
    try {
      const response = await apiService.get<Currency[]>(`${this.apiEndpoint}/currencies`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch currencies');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/currencies`, 'GET');
    }
  }

  /**
   * Get active currencies only
   */
  async getActiveCurrencies(): Promise<Currency[]> {
    try {
      const response = await apiService.get<Currency[]>(`${this.apiEndpoint}/currencies/active`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch active currencies');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/currencies/active`, 'GET');
    }
  }

  /**
   * Get exchange rate between two currencies
   */
  async getExchangeRate(sourceCurrency: string, targetCurrency: string): Promise<ExchangeRate> {
    try {
      const response = await apiService.get<ExchangeRate>(
        `${this.apiEndpoint}/rates/${sourceCurrency}/${targetCurrency}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(
          response.message || 
          `Failed to fetch exchange rate from ${sourceCurrency} to ${targetCurrency}`
        );
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(
        error, 
        `${this.apiEndpoint}/rates/${sourceCurrency}/${targetCurrency}`, 
        'GET'
      );
    }
  }

  /**
   * Get all exchange rates
   */
  async getAllExchangeRates(): Promise<ExchangeRate[]> {
    try {
      const response = await apiService.get<ExchangeRate[]>(`${this.apiEndpoint}/rates`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch exchange rates');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/rates`, 'GET');
    }
  }

  /**
   * Convert amount between currencies
   */
  async convertAmount(
    sourceCurrency: string, 
    targetCurrency: string, 
    amount: number
  ): Promise<{ sourceAmount: number; targetAmount: number; rate: number }> {
    try {
      const response = await apiService.get<{ sourceAmount: number; targetAmount: number; rate: number }>(
        `${this.apiEndpoint}/convert?from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(
          response.message || 
          `Failed to convert ${amount} ${sourceCurrency} to ${targetCurrency}`
        );
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(
        error, 
        `${this.apiEndpoint}/convert`, 
        'GET'
      );
    }
  }

  /**
   * Perform currency exchange
   */
  async performExchange(exchangeData: {
    userId: string;
    clientId?: string;
    sourceCurrency: string;
    targetCurrency: string;
    sourceAmount: number;
    notes?: string;
    reference?: string;
  }): Promise<ExchangeTransaction> {
    try {
      const response = await apiService.post<ExchangeTransaction>(
        `${this.apiEndpoint}/transactions`, 
        exchangeData,
        { showSuccessToast: true, successMessage: 'Currency exchange completed successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(
          response.message || 
          'Failed to perform currency exchange'
        );
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(
        error, 
        `${this.apiEndpoint}/transactions`, 
        'POST'
      );
    }
  }

  /**
   * Get exchange transaction history
   */
  async getExchangeHistory(filters?: {
    userId?: string;
    clientId?: string;
    startDate?: string;
    endDate?: string;
    status?: ExchangeTransaction['status'];
    page?: number;
    limit?: number;
  }): Promise<{ transactions: ExchangeTransaction[]; total: number; page: number; limit: number }> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await apiService.get<{ 
        transactions: ExchangeTransaction[]; 
        total: number; 
        page: number; 
        limit: number 
      }>(
        `${this.apiEndpoint}/transactions?${queryParams.toString()}`
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch exchange history');
      }
      
      return response.data || { transactions: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw handleApiError(
        error, 
        `${this.apiEndpoint}/transactions`, 
        'GET'
      );
    }
  }
}

// Create an instance of the service
const currencyExchangeService = new CurrencyExchangeService();

// Export the instance as default
export default currencyExchangeService;

// Also export the class for testing or extension
export { CurrencyExchangeService };
