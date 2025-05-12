/**
 * Search Service
 * Handles global search functionality across the application
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Search result type enum
export enum SearchResultType {
  CLIENT = 'client',
  TRANSACTION = 'transaction',
  USER = 'user',
  FINANCIAL_OPERATION = 'financial_operation',
  EXCHANGE = 'exchange',
  REPORT = 'report',
}

// Search result interface
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  highlights?: Array<{
    field: string;
    snippet: string;
  }>;
  metadata?: Record<string, any>;
}

// Search response interface
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  query: string;
  filters: Record<string, any>;
  searchTime: number;
}

/**
 * Search Service class
 */
class SearchService {
  private apiEndpoint = '/search';

  /**
   * Perform a global search across all entities
   */
  async globalSearch(params: {
    query: string;
    types?: SearchResultType[];
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }): Promise<SearchResponse> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('query', params.query);
      
      if (params.page !== undefined) {
        queryParams.append('page', String(params.page));
      }
      
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit));
      }
      
      if (params.types && params.types.length > 0) {
        params.types.forEach(type => {
          queryParams.append('types', type);
        });
      }
      
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach(v => {
                queryParams.append(`filters[${key}]`, String(v));
              });
            } else {
              queryParams.append(`filters[${key}]`, String(value));
            }
          }
        });
      }

      const response = await apiService.get<SearchResponse>(
        `${this.apiEndpoint}?${queryParams.toString()}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to perform search');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  /**
   * Search clients
   */
  async searchClients(query: string, params?: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }): Promise<SearchResponse> {
    try {
      const searchParams = {
        query,
        types: [SearchResultType.CLIENT],
        page: params?.page,
        limit: params?.limit,
        filters: params?.filters,
      };
      
      return await this.globalSearch(searchParams);
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}?types=client`, 'GET');
    }
  }

  /**
   * Search transactions
   */
  async searchTransactions(query: string, params?: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }): Promise<SearchResponse> {
    try {
      const searchParams = {
        query,
        types: [SearchResultType.TRANSACTION],
        page: params?.page,
        limit: params?.limit,
        filters: params?.filters,
      };
      
      return await this.globalSearch(searchParams);
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}?types=transaction`, 'GET');
    }
  }

  /**
   * Search financial operations
   */
  async searchFinancialOperations(query: string, params?: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }): Promise<SearchResponse> {
    try {
      const searchParams = {
        query,
        types: [SearchResultType.FINANCIAL_OPERATION],
        page: params?.page,
        limit: params?.limit,
        filters: params?.filters,
      };
      
      return await this.globalSearch(searchParams);
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}?types=financial_operation`, 'GET');
    }
  }

  /**
   * Search users
   */
  async searchUsers(query: string, params?: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  }): Promise<SearchResponse> {
    try {
      const searchParams = {
        query,
        types: [SearchResultType.USER],
        page: params?.page,
        limit: params?.limit,
        filters: params?.filters,
      };
      
      return await this.globalSearch(searchParams);
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}?types=user`, 'GET');
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await apiService.get<string[]>(
        `${this.apiEndpoint}/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get search suggestions');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/suggestions`, 'GET');
    }
  }

  /**
   * Get recent searches
   */
  async getRecentSearches(limit: number = 10): Promise<{ query: string; timestamp: string }[]> {
    try {
      const response = await apiService.get<{ query: string; timestamp: string }[]>(
        `${this.apiEndpoint}/recent?limit=${limit}`
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get recent searches');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/recent`, 'GET');
    }
  }

  /**
   * Clear recent searches
   */
  async clearRecentSearches(): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete<{ success: boolean }>(
        `${this.apiEndpoint}/recent`,
        { showSuccessToast: true, successMessage: 'Recent searches cleared' }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to clear recent searches');
      }
      
      return response.data || { success: true };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/recent`, 'DELETE');
    }
  }
}

// Create an instance of the service
const searchService = new SearchService();

// Export the instance as default
export default searchService;

// Also export the class for testing or extension
export { SearchService };
