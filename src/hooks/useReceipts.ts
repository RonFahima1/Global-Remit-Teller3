/**
 * useReceipts Hook
 * Custom hook for accessing receipt functionality
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  generateReceipt,
  fetchReceiptHistory,
  fetchReceiptTemplates,
  fetchDefaultTemplate,
  clearCurrentReceipt,
  clearError,
  setCurrentTemplate,
  selectReceipts,
  selectCurrentReceipt,
  selectTemplates,
  selectCurrentTemplate,
  selectIsLoading,
  selectError
} from '@/lib/redux/slices/receipt-slice';
import {
  ReceiptGenerationRequest,
  ReceiptTemplateType,
  ReceiptFormat,
  ReceiptLanguage,
  ReceiptBranding,
  ReceiptMetadata,
  ReceiptOptions,
  ReceiptDeliveryOptions,
  ReceiptTemplate
} from '@/types/receipt';
import { AppDispatch } from '@/lib/redux/store';

/**
 * useReceipts hook
 */
export function useReceipts() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const receipts = useSelector(selectReceipts);
  const currentReceipt = useSelector(selectCurrentReceipt);
  const templates = useSelector(selectTemplates);
  const currentTemplate = useSelector(selectCurrentTemplate);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  /**
   * Generate a receipt
   */
  const generateReceiptForTransaction = useCallback(
    async (metadata: ReceiptMetadata, options: ReceiptOptions, delivery?: ReceiptDeliveryOptions) => {
      const request: ReceiptGenerationRequest = {
        metadata,
        options,
        delivery
      };
      
      return dispatch(generateReceipt(request)).unwrap();
    },
    [dispatch]
  );
  
  /**
   * Generate a receipt with default options
   */
  const generateDefaultReceipt = useCallback(
    async (
      metadata: ReceiptMetadata,
      templateType: ReceiptTemplateType = ReceiptTemplateType.STANDARD,
      format: ReceiptFormat = ReceiptFormat.PDF,
      language: ReceiptLanguage = 'en',
      branding: ReceiptBranding = { companyName: 'Global Remit Teller' }
    ) => {
      const options: ReceiptOptions = {
        template: templateType,
        format,
        language,
        branding,
        includeTermsAndConditions: true,
        includeSupportInfo: true
      };
      
      return generateReceiptForTransaction(metadata, options);
    },
    [generateReceiptForTransaction]
  );
  
  /**
   * Get receipt history for a transaction
   */
  const getReceiptHistory = useCallback(
    (transactionId: string) => {
      return dispatch(fetchReceiptHistory(transactionId)).unwrap();
    },
    [dispatch]
  );
  
  /**
   * Get all receipt templates
   */
  const getReceiptTemplates = useCallback(
    () => {
      return dispatch(fetchReceiptTemplates()).unwrap();
    },
    [dispatch]
  );
  
  /**
   * Get default template for a specific type
   */
  const getDefaultTemplate = useCallback(
    (type: ReceiptTemplateType) => {
      return dispatch(fetchDefaultTemplate(type)).unwrap();
    },
    [dispatch]
  );
  
  /**
   * Clear current receipt
   */
  const clearReceipt = useCallback(
    () => {
      dispatch(clearCurrentReceipt());
    },
    [dispatch]
  );
  
  /**
   * Clear error
   */
  const clearErrorMessage = useCallback(
    () => {
      dispatch(clearError());
    },
    [dispatch]
  );
  
  /**
   * Set current template
   */
  const selectTemplate = useCallback(
    (template: ReceiptTemplate) => {
      dispatch(setCurrentTemplate(template));
    },
    [dispatch]
  );
  
  /**
   * Email a receipt
   */
  const emailReceipt = useCallback(
    async (
      metadata: ReceiptMetadata,
      emailAddress: string,
      subject?: string,
      message?: string,
      options?: Partial<ReceiptOptions>
    ) => {
      // Get default template if not specified
      const templateType = options?.template || ReceiptTemplateType.STANDARD;
      
      // Create default options
      const defaultOptions: ReceiptOptions = {
        template: templateType,
        format: ReceiptFormat.PDF,
        language: 'en',
        branding: { companyName: 'Global Remit Teller' },
        includeTermsAndConditions: true,
        includeSupportInfo: true
      };
      
      // Merge with provided options
      const mergedOptions: ReceiptOptions = {
        ...defaultOptions,
        ...options
      };
      
      // Create delivery options
      const delivery: ReceiptDeliveryOptions = {
        method: 'email',
        destination: emailAddress,
        subject: subject || `Receipt for Transaction ${metadata.transactionId}`,
        message: message || 'Please find your transaction receipt attached.'
      };
      
      return generateReceiptForTransaction(metadata, mergedOptions, delivery);
    },
    [generateReceiptForTransaction]
  );
  
  /**
   * SMS a receipt
   */
  const smsReceipt = useCallback(
    async (
      metadata: ReceiptMetadata,
      phoneNumber: string,
      message?: string,
      options?: Partial<ReceiptOptions>
    ) => {
      // Create default options
      const defaultOptions: ReceiptOptions = {
        template: ReceiptTemplateType.COMPACT,
        format: ReceiptFormat.PDF,
        language: 'en',
        branding: { companyName: 'Global Remit Teller' }
      };
      
      // Merge with provided options
      const mergedOptions: ReceiptOptions = {
        ...defaultOptions,
        ...options
      };
      
      // Create delivery options
      const delivery: ReceiptDeliveryOptions = {
        method: 'sms',
        destination: phoneNumber,
        message: message || `Your receipt for transaction ${metadata.transactionId} is available at: `
      };
      
      return generateReceiptForTransaction(metadata, mergedOptions, delivery);
    },
    [generateReceiptForTransaction]
  );
  
  return {
    // State
    receipts,
    currentReceipt,
    templates,
    currentTemplate,
    isLoading,
    error,
    
    // Actions
    generateReceiptForTransaction,
    generateDefaultReceipt,
    getReceiptHistory,
    getReceiptTemplates,
    getDefaultTemplate,
    clearReceipt,
    clearErrorMessage,
    selectTemplate,
    emailReceipt,
    smsReceipt
  };
}
