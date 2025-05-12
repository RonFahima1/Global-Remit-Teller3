/**
 * Receipt Service
 * Handles the generation and delivery of transaction receipts
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ReceiptGenerationRequest,
  ReceiptGenerationResponse,
  ReceiptHistoryItem,
  ReceiptTemplate,
  ReceiptTemplateType,
  ReceiptFormat,
  ReceiptDeliveryMethod,
  ReceiptLanguage
} from '@/types/receipt';
import { mockReceiptTemplates } from './mock-data/receipt-templates';
import { mockReceiptHistory } from './mock-data/receipt-history';

/**
 * Receipt Service Class
 */
class ReceiptService {
  private receiptTemplates: ReceiptTemplate[] = mockReceiptTemplates;
  private receiptHistory: ReceiptHistoryItem[] = mockReceiptHistory;

  /**
   * Generate a receipt based on the provided request
   */
  async generateReceipt(request: ReceiptGenerationRequest): Promise<ReceiptGenerationResponse> {
    try {
      // In a real implementation, this would call a PDF generation service
      // or use a library like jsPDF, PDFMake, or react-pdf
      
      // For now, we'll simulate the receipt generation
      const receiptId = uuidv4();
      const now = new Date();
      const expiryDate = request.options.expiryDays 
        ? new Date(now.getTime() + request.options.expiryDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
      
      // Create a mock download URL
      const downloadUrl = `/api/receipts/${receiptId}/download`;
      const previewUrl = `/api/receipts/${receiptId}/preview`;
      
      // Add to receipt history
      const historyItem: ReceiptHistoryItem = {
        id: receiptId,
        transactionId: request.metadata.transactionId,
        transactionType: request.metadata.transactionType,
        createdAt: now.toISOString(),
        format: request.options.format,
        deliveryMethod: request.delivery?.method || ReceiptDeliveryMethod.DOWNLOAD,
        deliveryDestination: request.delivery?.destination,
        deliveryStatus: request.delivery ? 'pending' : 'not_applicable',
        downloadUrl,
        expiryDate
      };
      
      this.receiptHistory.unshift(historyItem);
      
      // If delivery is requested, process it
      let deliveryStatus: 'sent' | 'failed' | 'pending' | 'not_applicable' = 'not_applicable';
      
      if (request.delivery) {
        deliveryStatus = await this.deliverReceipt(receiptId, request);
      }
      
      return {
        receiptId,
        downloadUrl,
        previewUrl,
        expiryDate,
        status: 'success',
        deliveryStatus
      };
    } catch (error) {
      console.error('Error generating receipt:', error);
      return {
        receiptId: '',
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Deliver a receipt via the specified method
   */
  private async deliverReceipt(
    receiptId: string, 
    request: ReceiptGenerationRequest
  ): Promise<'sent' | 'failed' | 'pending'> {
    if (!request.delivery) {
      return 'not_applicable';
    }
    
    try {
      // In a real implementation, this would call email/SMS services
      // For now, we'll simulate successful delivery
      
      // Update the receipt history with the delivery status
      const historyItem = this.receiptHistory.find(item => item.id === receiptId);
      if (historyItem) {
        historyItem.deliveryStatus = 'sent';
      }
      
      return 'sent';
    } catch (error) {
      console.error('Error delivering receipt:', error);
      
      // Update the receipt history with the failed status
      const historyItem = this.receiptHistory.find(item => item.id === receiptId);
      if (historyItem) {
        historyItem.deliveryStatus = 'failed';
      }
      
      return 'failed';
    }
  }
  
  /**
   * Get a receipt by ID
   */
  async getReceiptById(receiptId: string): Promise<ReceiptHistoryItem | null> {
    const receipt = this.receiptHistory.find(item => item.id === receiptId);
    return receipt || null;
  }
  
  /**
   * Get receipt history for a transaction
   */
  async getReceiptHistoryByTransactionId(transactionId: string): Promise<ReceiptHistoryItem[]> {
    return this.receiptHistory.filter(item => item.transactionId === transactionId);
  }
  
  /**
   * Get all receipt templates
   */
  async getReceiptTemplates(): Promise<ReceiptTemplate[]> {
    return this.receiptTemplates;
  }
  
  /**
   * Get a receipt template by ID
   */
  async getReceiptTemplateById(templateId: string): Promise<ReceiptTemplate | null> {
    const template = this.receiptTemplates.find(item => item.id === templateId);
    return template || null;
  }
  
  /**
   * Get the default receipt template for a specific type
   */
  async getDefaultReceiptTemplate(type: ReceiptTemplateType): Promise<ReceiptTemplate | null> {
    const template = this.receiptTemplates.find(item => item.type === type && item.isDefault);
    return template || null;
  }
  
  /**
   * Check if a language is supported for a template
   */
  async isLanguageSupported(templateId: string, language: ReceiptLanguage): Promise<boolean> {
    const template = await this.getReceiptTemplateById(templateId);
    return template ? template.supportedLanguages.includes(language) : false;
  }
}
