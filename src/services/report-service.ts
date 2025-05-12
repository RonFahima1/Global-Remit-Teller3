/**
 * Report Service
 * Handles reporting and analytics for the Global Remit Teller application
 */

import apiService from './api-service';
import { handleApiError } from '@/lib/api-error-handler';

// Report type enum
export enum ReportType {
  TRANSACTION = 'transaction',
  CLIENT = 'client',
  FINANCIAL = 'financial',
  EXCHANGE = 'exchange',
  AUDIT = 'audit',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

// Report format enum
export enum ReportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json',
  HTML = 'html',
}

// Report status enum
export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Report interface
export interface Report {
  id: string;
  userId: string;
  name: string;
  type: ReportType;
  parameters: Record<string, any>;
  format: ReportFormat;
  status: ReportStatus;
  url?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  error?: string;
}

// Report template interface
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  parameters: Array<{
    name: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select';
    required: boolean;
    options?: Array<{ value: string; label: string }>;
    defaultValue?: any;
  }>;
  formats: ReportFormat[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Report Service class
 */
class ReportService {
  private apiEndpoint = '/reports';

  /**
   * Get all report templates
   */
  async getReportTemplates(type?: ReportType): Promise<ReportTemplate[]> {
    try {
      const endpoint = type 
        ? `${this.apiEndpoint}/templates?type=${type}` 
        : `${this.apiEndpoint}/templates`;
      
      const response = await apiService.get<ReportTemplate[]>(endpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch report templates');
      }
      
      return response.data || [];
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/templates`, 'GET');
    }
  }

  /**
   * Get report template by ID
   */
  async getReportTemplateById(id: string): Promise<ReportTemplate> {
    try {
      const response = await apiService.get<ReportTemplate>(`${this.apiEndpoint}/templates/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Report template ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/templates/${id}`, 'GET');
    }
  }

  /**
   * Generate a report
   */
  async generateReport(data: {
    templateId: string;
    name: string;
    parameters: Record<string, any>;
    format: ReportFormat;
  }): Promise<Report> {
    try {
      const response = await apiService.post<Report>(
        `${this.apiEndpoint}/generate`, 
        data,
        { showSuccessToast: true, successMessage: 'Report generation started' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to start report generation');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/generate`, 'POST');
    }
  }

  /**
   * Get user reports
   */
  async getUserReports(params?: {
    type?: ReportType;
    status?: ReportStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ reports: Report[]; total: number; page: number; limit: number }> {
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
        reports: Report[]; 
        total: number; 
        page: number; 
        limit: number 
      }>(`${this.apiEndpoint}?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user reports');
      }
      
      return response.data || { reports: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw handleApiError(error, this.apiEndpoint, 'GET');
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(id: string): Promise<Report> {
    try {
      const response = await apiService.get<Report>(`${this.apiEndpoint}/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Report ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'GET');
    }
  }

  /**
   * Delete a report
   */
  async deleteReport(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete<{ success: boolean }>(
        `${this.apiEndpoint}/${id}`,
        { showSuccessToast: true, successMessage: 'Report deleted successfully' }
      );
      
      if (!response.success) {
        throw new Error(response.message || `Failed to delete report ${id}`);
      }
      
      return response.data || { success: true };
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}`, 'DELETE');
    }
  }

  /**
   * Create a custom report template
   */
  async createReportTemplate(template: Omit<ReportTemplate, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>): Promise<ReportTemplate> {
    try {
      const response = await apiService.post<ReportTemplate>(
        `${this.apiEndpoint}/templates`, 
        template,
        { showSuccessToast: true, successMessage: 'Report template created successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create report template');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/templates`, 'POST');
    }
  }

  /**
   * Update a custom report template
   */
  async updateReportTemplate(id: string, template: Partial<Omit<ReportTemplate, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>>): Promise<ReportTemplate> {
    try {
      const response = await apiService.put<ReportTemplate>(
        `${this.apiEndpoint}/templates/${id}`, 
        template,
        { showSuccessToast: true, successMessage: 'Report template updated successfully' }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || `Failed to update report template ${id}`);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/templates/${id}`, 'PUT');
    }
  }

  /**
   * Get report download URL
   */
  async getReportDownloadUrl(id: string): Promise<string> {
    try {
      const response = await apiService.get<{ url: string }>(`${this.apiEndpoint}/${id}/download`);
      
      if (!response.success || !response.data?.url) {
        throw new Error(response.message || `Failed to get download URL for report ${id}`);
      }
      
      return response.data.url;
    } catch (error) {
      throw handleApiError(error, `${this.apiEndpoint}/${id}/download`, 'GET');
    }
  }
}

// Create an instance of the service
const reportService = new ReportService();

// Export the instance as default
export default reportService;

// Also export the class for testing or extension
export { ReportService };
