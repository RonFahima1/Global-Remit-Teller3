import { v4 as uuidv4 } from 'uuid';
import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';
import { AppError, ErrorCategory, ErrorSeverity } from '@/lib/error-handling';

export interface Transaction {
  id: string;
  clientId: string;
  type: 'send' | 'receive' | 'deposit' | 'withdrawal' | 'exchange';
  amount: number;
  sourceCurrency: string;
  targetCurrency?: string;
  exchangeRate?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
  description: string;
  fee?: number;
  recipientName?: string;
  recipientId?: string;
  senderName?: string;
  senderId?: string;
  reference?: string;
}

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: 'TXN1001',
    clientId: 'C1001',
    type: 'send',
    amount: 500,
    sourceCurrency: 'USD',
    targetCurrency: 'EUR',
    exchangeRate: 0.92,
    status: 'completed',
    date: '2025-05-10T14:30:00Z',
    description: 'Money transfer to family',
    fee: 15,
    recipientName: 'Maria Garcia',
    recipientId: 'R2001',
    reference: 'FAM-SUPPORT-MAY'
  },
  {
    id: 'TXN1002',
    clientId: 'C1001',
    type: 'deposit',
    amount: 1000,
    sourceCurrency: 'USD',
    status: 'completed',
    date: '2025-05-05T10:15:00Z',
    description: 'Cash deposit',
    reference: 'DEP-1005-2025'
  },
  {
    id: 'TXN1003',
    clientId: 'C1002',
    type: 'send',
    amount: 250,
    sourceCurrency: 'EUR',
    targetCurrency: 'GBP',
    exchangeRate: 0.85,
    status: 'completed',
    date: '2025-05-09T16:45:00Z',
    description: 'Business payment',
    fee: 8,
    recipientName: 'John Smith Ltd',
    recipientId: 'R3045',
    reference: 'INV-2025-045'
  },
  {
    id: 'TXN1004',
    clientId: 'C1003',
    type: 'receive',
    amount: 350,
    sourceCurrency: 'GBP',
    status: 'completed',
    date: '2025-05-08T09:20:00Z',
    description: 'Payment received',
    senderName: 'Global Imports Inc',
    senderId: 'S4501',
    reference: 'PAY-2025-089'
  },
  {
    id: 'TXN1005',
    clientId: 'C1002',
    type: 'withdrawal',
    amount: 200,
    sourceCurrency: 'EUR',
    status: 'completed',
    date: '2025-05-07T14:10:00Z',
    description: 'Cash withdrawal',
    reference: 'WIT-0705-2025'
  },
  {
    id: 'TXN1006',
    clientId: 'C1001',
    type: 'exchange',
    amount: 500,
    sourceCurrency: 'USD',
    targetCurrency: 'ILS',
    exchangeRate: 3.65,
    status: 'completed',
    date: '2025-05-06T11:30:00Z',
    description: 'Currency exchange',
    fee: 10,
    reference: 'EXC-0605-2025'
  },
  {
    id: 'TXN1007',
    clientId: 'C1003',
    type: 'send',
    amount: 750,
    sourceCurrency: 'GBP',
    targetCurrency: 'USD',
    exchangeRate: 1.25,
    status: 'pending',
    date: '2025-05-11T08:45:00Z',
    description: 'Emergency funds',
    fee: 20,
    recipientName: 'Sarah Johnson',
    recipientId: 'R1089',
    reference: 'EMG-1105-2025'
  },
  {
    id: 'TXN1008',
    clientId: 'C1004',
    type: 'deposit',
    amount: 1500,
    sourceCurrency: 'ILS',
    status: 'completed',
    date: '2025-05-04T13:20:00Z',
    description: 'Business deposit',
    reference: 'BUS-DEP-0405'
  },
  {
    id: 'TXN1009',
    clientId: 'C1004',
    type: 'send',
    amount: 1000,
    sourceCurrency: 'ILS',
    targetCurrency: 'USD',
    exchangeRate: 0.27,
    status: 'failed',
    date: '2025-05-03T15:40:00Z',
    description: 'Supplier payment - failed due to verification',
    fee: 25,
    recipientName: 'Global Supplies Co',
    recipientId: 'R5067',
    reference: 'SUP-PAY-0305'
  },
  {
    id: 'TXN1010',
    clientId: 'C1001',
    type: 'receive',
    amount: 300,
    sourceCurrency: 'EUR',
    status: 'completed',
    date: '2025-05-02T10:10:00Z',
    description: 'Freelance payment received',
    senderName: 'Tech Solutions Ltd',
    senderId: 'S2089',
    reference: 'FREELANCE-0205'
  }
];

// Transaction service class
class TransactionService {
  private transactions: Transaction[] = mockTransactions;
  private apiEndpoint = '/transactions';

  // Get all transactions
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await apiService.get<Transaction[]>(this.apiEndpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  // Get transactions by client ID
  async getTransactionsByClientId(clientId: string): Promise<Transaction[]> {
    try {
      const response = await apiService.get<Transaction[]>(`${this.apiEndpoint}/client/${clientId}`);
      
      if (!response.success) {
        throw new Error(response.message || `Failed to fetch transactions for client ${clientId}`);
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/client/${clientId}`, 'GET');
    }
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await apiService.get<Transaction>(`${this.apiEndpoint}/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Transaction ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'GET');
    }
  }

  // Create a new transaction
  async createTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
    try {
      const response = await apiService.post<Transaction>(
        this.apiEndpoint, 
        transaction,
        { showSuccessToast: true, successMessage: 'Transaction created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create transaction');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'POST');
    }
  }

  // Update transaction status
  async updateTransactionStatus(id: string, status: Transaction['status']): Promise<Transaction> {
    try {
      const response = await apiService.patch<Transaction>(
        `${this.apiEndpoint}/${id}/status`, 
        { status },
        { showSuccessToast: true, successMessage: 'Transaction status updated' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update transaction ${id} status`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/status`, 'PATCH');
    }
  }
  
  // Cancel a transaction
  async cancelTransaction(id: string, reason: string): Promise<Transaction> {
    try {
      const response = await apiService.patch<Transaction>(
        `${this.apiEndpoint}/${id}/cancel`, 
        { reason },
        { showSuccessToast: true, successMessage: 'Transaction cancelled successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to cancel transaction ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/cancel`, 'PATCH');
    }
  }
  
  // Get transaction history with filters
  async getTransactionHistory(filters: {
    startDate?: string;
    endDate?: string;
    type?: Transaction['type'];
    status?: Transaction['status'];
    currency?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
    try {
      // Convert filters to query string
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await apiService.get<{ transactions: Transaction[]; total: number; page: number; limit: number }>(
        `${this.apiEndpoint}/history?${queryParams.toString()}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch transaction history');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/history`, 'GET');
    }
  }
  
  // For development/testing only - use mock data
  getMockTransactions(): Transaction[] {
    return mockTransactions;
  }
}

// Create an instance of the service
const transactionService = new TransactionService();

// Export the instance as default
export default transactionService;

// Also export the class for testing or extension
export { TransactionService };
