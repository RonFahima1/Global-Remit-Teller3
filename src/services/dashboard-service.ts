/**
 * Dashboard Service
 * Handles key metrics and analytics for the Global Remit Teller application
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Transaction summary interface
export interface TransactionSummary {
  totalCount: number;
  totalAmount: number;
  currency: string;
  pendingCount: number;
  pendingAmount: number;
  completedCount: number;
  completedAmount: number;
  failedCount: number;
  failedAmount: number;
  cancelledCount: number;
  cancelledAmount: number;
}

// Transaction by type interface
export interface TransactionsByType {
  type: string;
  count: number;
  amount: number;
  percentage: number;
}

// Client summary interface
export interface ClientSummary {
  totalClients: number;
  newClientsToday: number;
  newClientsThisWeek: number;
  newClientsThisMonth: number;
  verifiedClients: number;
  pendingVerification: number;
  activeClients: number;
}

// Exchange rate summary interface
export interface ExchangeRateSummary {
  currency: string;
  buyRate: number;
  sellRate: number;
  change24h: number;
  change7d: number;
  lastUpdated: string;
}

// Activity log interface
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

// Dashboard summary interface
export interface DashboardSummary {
  transactionSummary: TransactionSummary;
  transactionsByType: TransactionsByType[];
  clientSummary: ClientSummary;
  topExchangeRates: ExchangeRateSummary[];
  recentActivity: ActivityLog[];
}

/**
 * Dashboard Service class
 */
class DashboardService {
  private apiEndpoint = '/dashboard';

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiService.get<DashboardSummary>(`${this.apiEndpoint}/summary`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch dashboard summary');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/summary`, 'GET');
    }
  }

  /**
   * Get transaction summary
   */
  async getTransactionSummary(timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<any> {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const { getMockTransactionSummary } = await import('./mock/dashboard-mock-service');
      return getMockTransactionSummary(timeframe);
    }
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

      const response = await apiService.get<TransactionSummary>(
        `${this.apiEndpoint}/transactions?${queryParams.toString()}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch transaction summary');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/transactions`, 'GET');
    }
  }

  /**
   * Get transactions by type
   */
  async getTransactionsByType(params?: {
    startDate?: string;
    endDate?: string;
    currency?: string;
  }): Promise<TransactionsByType[]> {
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

      const response = await apiService.get<TransactionsByType[]>(
        `${this.apiEndpoint}/transactions-by-type?${queryParams.toString()}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch transactions by type');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/transactions-by-type`, 'GET');
    }
  }

  /**
   * Get client summary
   */
  async getClientSummary(): Promise<ClientSummary> {
    try {
      const response = await apiService.get<ClientSummary>(`${this.apiEndpoint}/clients`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch client summary');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/clients`, 'GET');
    }
  }

  /**
   * Get exchange rate summary
   */
  async getExchangeRateSummary(): Promise<ExchangeRateSummary[]> {
    try {
      const response = await apiService.get<ExchangeRateSummary[]>(`${this.apiEndpoint}/exchange-rates`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch exchange rate summary');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/exchange-rates`, 'GET');
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    try {
      const response = await apiService.get<ActivityLog[]>(
        `${this.apiEndpoint}/activity?limit=${limit}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch recent activity');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/activity`, 'GET');
    }
  }

  /**
   * Get transaction chart data
   */
  async getTransactionChartData(params: {
    startDate: string;
    endDate: string;
    interval: 'day' | 'week' | 'month';
    currency?: string;
  }): Promise<any> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const response = await apiService.get<any>(
        `${this.apiEndpoint}/transaction-chart?${queryParams.toString()}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch transaction chart data');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/transaction-chart`, 'GET');
    }
  }
}

// Create an instance of the service
const dashboardService = new DashboardService();

// Export the instance as default
export default dashboardService;

// Also export the class for testing or extension
export { DashboardService };
