import { Sender, Receiver, TransactionDetail } from '@/context/RemittanceContext';

// Cache for exchange rates
const rateCache = new Map<string, { rate: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Interface for transaction creation response
interface TransactionResponse {
  id: string;
  reference: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  receiptUrl?: string;
  createdAt: string;
}

// Interface for exchange rate response
interface ExchangeRateResponse {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  buyRate?: number;
  sellRate?: number;
}

/**
 * Service for handling remittance operations
 */
export const remittanceService = {
  /**
   * Get exchange rate with caching
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // Check cache first
      const cacheKey = `${fromCurrency}-${toCurrency}`;
      const cached = rateCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.rate;
      }
      
      // Fetch from API
      const response = await fetch(`/api/currency-exchange/rates?from=${fromCurrency}&to=${toCurrency}&activeOnly=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data: ExchangeRateResponse[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
      }
      
      const rate = data[0].rate;
      
      // Update cache
      rateCache.set(cacheKey, { rate, timestamp: Date.now() });
      
      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Return a fallback rate of 1 in case of error
      return 1;
    }
  },
  
  /**
   * Get all available destination countries
   */
  async getDestinationCountries(): Promise<{ label: string; value: string }[]> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll return a mock list
      return [
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'GB' },
        { label: 'Canada', value: 'CA' },
        { label: 'Australia', value: 'AU' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Spain', value: 'ES' },
        { label: 'Italy', value: 'IT' },
        { label: 'Japan', value: 'JP' },
        { label: 'China', value: 'CN' },
        { label: 'India', value: 'IN' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Mexico', value: 'MX' },
      ];
    } catch (error) {
      console.error('Error fetching destination countries:', error);
      return [];
    }
  },
  
  /**
   * Search for senders by query
   */
  async searchSenders(query: string): Promise<Sender[]> {
    try {
      const response = await fetch(`/api/clients?query=${encodeURIComponent(query)}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to search senders');
      }
      
      const data = await response.json();
      
      // Map the client data to the Sender interface
      return data.clients.map((client: any) => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        phoneNumber: client.phoneNumber,
        email: client.email,
        country: client.country,
        address: client.address,
        idType: client.idType,
        idNumber: client.idNumber,
        phoneVerified: client.kycStatus === 'VERIFIED',
      }));
    } catch (error) {
      console.error('Error searching senders:', error);
      return [];
    }
  },
  
  /**
   * Search for receivers by query
   */
  async searchReceivers(query: string): Promise<Receiver[]> {
    try {
      const response = await fetch(`/api/clients?query=${encodeURIComponent(query)}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to search receivers');
      }
      
      const data = await response.json();
      
      // Map the client data to the Receiver interface
      return data.clients.map((client: any) => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        phoneNumber: client.phoneNumber,
        email: client.email,
        country: client.country,
        address: client.address,
      }));
    } catch (error) {
      console.error('Error searching receivers:', error);
      return [];
    }
  },
  
  /**
   * Create a new transaction
   */
  async createTransaction(transactionDetail: TransactionDetail): Promise<TransactionResponse> {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: transactionDetail.type,
          sendAmount: transactionDetail.sendAmount,
          receiveAmount: transactionDetail.receiveAmount,
          fee: transactionDetail.fee,
          exchangeRate: transactionDetail.exchangeRate,
          sendCurrency: transactionDetail.sendCurrency,
          receiveCurrency: transactionDetail.receiveCurrency,
          senderId: transactionDetail.sender?.id,
          receiverId: transactionDetail.receiver?.id,
          payoutMethod: transactionDetail.payoutType,
          payoutDetails: transactionDetail.payoutDetails,
          notes: transactionDetail.notes,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
};

export default remittanceService;
