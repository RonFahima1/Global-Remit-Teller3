/**
 * Financial Operations Service
 * Handles deposits, withdrawals, and other financial transactions
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Transaction type enum
export enum FinancialOperationType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PAYOUT = 'payout',
  ADJUSTMENT = 'adjustment',
  FEE = 'fee',
  REFUND = 'refund',
}

// Payment method enum
export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  MOBILE_MONEY = 'mobile_money',
  CHECK = 'check',
  OTHER = 'other',
}

// Transaction status enum
export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Financial operation interface
export interface FinancialOperation {
  id: string;
  type: FinancialOperationType;
  clientId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  reference: string;
  description?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

// Cash register operation interface
export interface CashRegisterOperation {
  id: string;
  type: 'open' | 'close' | 'deposit' | 'withdrawal';
  userId: string;
  amount: number;
  currency: string;
  balance: number;
  description?: string;
  createdAt: string;
}

/**
 * Financial Operations Service class
 */
class FinancialOperationsService {
  private apiEndpoint = '/financial-operations';

  /**
   * Create a deposit
   */
  async createDeposit(depositData: {
    clientId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    reference?: string;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<FinancialOperation> {
    try {
      const response = await apiService.post<FinancialOperation>(
        `${this.apiEndpoint}/deposits`, 
        {
          ...depositData,
          type: FinancialOperationType.DEPOSIT,
        },
        { showSuccessToast: true, successMessage: 'Deposit created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create deposit');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/deposits`, 'POST');
    }
  }

  /**
   * Create a withdrawal
   */
  async createWithdrawal(withdrawalData: {
    clientId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    reference?: string;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<FinancialOperation> {
    try {
      const response = await apiService.post<FinancialOperation>(
        `${this.apiEndpoint}/withdrawals`, 
        {
          ...withdrawalData,
          type: FinancialOperationType.WITHDRAWAL,
        },
        { showSuccessToast: true, successMessage: 'Withdrawal created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create withdrawal');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/withdrawals`, 'POST');
    }
  }

  /**
   * Create a payout
   */
  async createPayout(payoutData: {
    clientId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    reference?: string;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<FinancialOperation> {
    try {
      const response = await apiService.post<FinancialOperation>(
        `${this.apiEndpoint}/payouts`, 
        {
          ...payoutData,
          type: FinancialOperationType.PAYOUT,
        },
        { showSuccessToast: true, successMessage: 'Payout created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create payout');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/payouts`, 'POST');
    }
  }

  /**
   * Get financial operations with filtering
   */
  async getFinancialOperations(params?: {
    type?: FinancialOperationType;
    clientId?: string;
    status?: TransactionStatus;
    startDate?: string;
    endDate?: string;
    currency?: string;
    page?: number;
    limit?: number;
  }): Promise<{ operations: FinancialOperation[]; total: number; page: number; limit: number }> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await apiService.get<{ 
        operations: FinancialOperation[]; 
        total: number; 
        page: number; 
        limit: number 
      }>(`${this.apiEndpoint}?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch financial operations');
      }
      
      return response.data || { operations: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  /**
   * Get financial operation by ID
   */
  async getFinancialOperationById(id: string): Promise<FinancialOperation> {
    try {
      const response = await apiService.get<FinancialOperation>(`${this.apiEndpoint}/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Financial operation ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'GET');
    }
  }

  /**
   * Update financial operation status
   */
  async updateOperationStatus(
    id: string, 
    status: TransactionStatus, 
    notes?: string
  ): Promise<FinancialOperation> {
    try {
      const response = await apiService.patch<FinancialOperation>(
        `${this.apiEndpoint}/${id}/status`, 
        { status, notes },
        { showSuccessToast: true, successMessage: `Operation status updated to ${status}` }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update operation status for ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/status`, 'PATCH');
    }
  }

  /**
   * Get cash register operations
   */
  async getCashRegisterOperations(params?: {
    type?: CashRegisterOperation['type'];
    startDate?: string;
    endDate?: string;
    currency?: string;
    page?: number;
    limit?: number;
  }): Promise<{ operations: CashRegisterOperation[]; total: number; page: number; limit: number }> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await apiService.get<{ 
        operations: CashRegisterOperation[]; 
        total: number; 
        page: number; 
        limit: number 
      }>(`${this.apiEndpoint}/cash-register?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch cash register operations');
      }
      
      return response.data || { operations: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/cash-register`, 'GET');
    }
  }

  /**
   * Open cash register
   */
  async openCashRegister(data: {
    amount: number;
    currency: string;
    description?: string;
  }): Promise<CashRegisterOperation> {
    try {
      const response = await apiService.post<CashRegisterOperation>(
        `${this.apiEndpoint}/cash-register/open`, 
        data,
        { showSuccessToast: true, successMessage: 'Cash register opened successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to open cash register');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/cash-register/open`, 'POST');
    }
  }

  /**
   * Close cash register
   */
  async closeCashRegister(data: {
    amount: number;
    currency: string;
    description?: string;
  }): Promise<CashRegisterOperation> {
    try {
      const response = await apiService.post<CashRegisterOperation>(
        `${this.apiEndpoint}/cash-register/close`, 
        data,
        { showSuccessToast: true, successMessage: 'Cash register closed successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to close cash register');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/cash-register/close`, 'POST');
    }
  }
}

// Create an instance of the service
const financialOperationsService = new FinancialOperationsService();

// Export the instance as default
export default financialOperationsService;

// Also export the class for testing or extension
export { FinancialOperationsService };
