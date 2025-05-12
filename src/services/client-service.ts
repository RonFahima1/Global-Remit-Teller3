/**
 * Client Management Service
 * Handles client data and operations with proper API integration and error handling
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Client interface
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth?: string;
  nationality?: string;
  idType?: 'passport' | 'driverLicense' | 'nationalId' | 'other';
  idNumber?: string;
  idExpiryDate?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycVerificationDate?: string;
  createdAt: string;
  updatedAt: string;
  preferredCurrency?: string;
  notes?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

/**
 * Client service class for managing client data
 */
class ClientService {
  private apiEndpoint = '/clients';

  /**
   * Get all clients with optional filtering
   */
  async getAllClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    kycStatus?: Client['kycStatus'];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ clients: Client[]; total: number; page: number; limit: number }> {
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

      const endpoint = `${this.apiEndpoint}?${queryParams.toString()}`;
      const response = await apiService.get<{ clients: Client[]; total: number; page: number; limit: number }>(endpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch clients');
      }
      
      return response.data || { clients: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  /**
   * Get client by ID
   */
  async getClientById(id: string): Promise<Client> {
    try {
      const response = await apiService.get<Client>(`${this.apiEndpoint}/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Client ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'GET');
    }
  }

  /**
   * Create a new client
   */
  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const response = await apiService.post<Client>(
        this.apiEndpoint, 
        client,
        { showSuccessToast: true, successMessage: 'Client created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create client');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'POST');
    }
  }

  /**
   * Update client information
   */
  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await apiService.put<Client>(
        `${this.apiEndpoint}/${id}`, 
        clientData,
        { showSuccessToast: true, successMessage: 'Client updated successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update client ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'PUT');
    }
  }

  /**
   * Update client KYC status
   */
  async updateKycStatus(
    id: string, 
    status: Client['kycStatus'], 
    notes?: string
  ): Promise<Client> {
    try {
      const response = await apiService.patch<Client>(
        `${this.apiEndpoint}/${id}/kyc`, 
        { status, notes, verificationDate: new Date().toISOString() },
        { showSuccessToast: true, successMessage: `Client KYC status updated to ${status}` }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update KYC status for client ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/kyc`, 'PATCH');
    }
  }

  /**
   * Search clients
   */
  async searchClients(query: string): Promise<Client[]> {
    try {
      const response = await apiService.get<Client[]>(`${this.apiEndpoint}/search?q=${encodeURIComponent(query)}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to search clients');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/search`, 'GET');
    }
  }

  /**
   * Get client transaction history
   */
  async getClientTransactions(id: string): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`${this.apiEndpoint}/${id}/transactions`);
      
      if (!response.success) {
        throw new Error(response.message || `Failed to fetch transactions for client ${id}`);
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/transactions`, 'GET');
    }
  }
}

// Create an instance of the service
const clientService = new ClientService();

// Export the instance as default
export default clientService;

// Also export the class for testing or extension
export { ClientService };
