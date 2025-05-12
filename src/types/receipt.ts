/**
 * Receipt Types
 * Type definitions for the receipt generation system
 */

import { TransactionType } from './transaction';

/**
 * Receipt template type
 */
export enum ReceiptTemplateType {
  STANDARD = 'standard',
  COMPACT = 'compact',
  DETAILED = 'detailed',
  CUSTOM = 'custom'
}

/**
 * Receipt delivery method
 */
export enum ReceiptDeliveryMethod {
  EMAIL = 'email',
  SMS = 'sms',
  PRINT = 'print',
  DOWNLOAD = 'download'
}

/**
 * Receipt format
 */
export enum ReceiptFormat {
  PDF = 'pdf',
  HTML = 'html',
  IMAGE = 'image'
}

/**
 * Receipt language
 */
export type ReceiptLanguage = 'en' | 'es' | 'fr' | 'ar' | 'zh' | string;

/**
 * Receipt branding options
 */
export interface ReceiptBranding {
  logoUrl?: string;
  companyName: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  showWatermark?: boolean;
  footerText?: string;
  customCss?: string;
}

/**
 * Receipt metadata
 */
export interface ReceiptMetadata {
  transactionId: string;
  transactionType: TransactionType;
  transactionDate: string;
  senderName: string;
  senderPhone?: string;
  senderEmail?: string;
  receiverName: string;
  receiverPhone?: string;
  receiverEmail?: string;
  amount: number;
  fee: number;
  totalAmount: number;
  sourceCurrency: string;
  destinationCurrency: string;
  exchangeRate?: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: string;
  notes?: string;
  agentName?: string;
  agentId?: string;
  locationName?: string;
  locationId?: string;
  referenceNumber?: string;
  customFields?: Record<string, string>;
}

/**
 * Receipt generation options
 */
export interface ReceiptOptions {
  template: ReceiptTemplateType;
  format: ReceiptFormat;
  language: ReceiptLanguage;
  branding: ReceiptBranding;
  includeBarcode?: boolean;
  includeQrCode?: boolean;
  includeTermsAndConditions?: boolean;
  includeSupportInfo?: boolean;
  includeMap?: boolean;
  password?: string;
  expiryDays?: number;
}

/**
 * Receipt delivery options
 */
export interface ReceiptDeliveryOptions {
  method: ReceiptDeliveryMethod;
  destination: string; // email address, phone number, etc.
  subject?: string;
  message?: string;
  cc?: string[];
  bcc?: string[];
  sendCopy?: boolean;
  scheduleTime?: string;
}

/**
 * Receipt generation request
 */
export interface ReceiptGenerationRequest {
  metadata: ReceiptMetadata;
  options: ReceiptOptions;
  delivery?: ReceiptDeliveryOptions;
}

/**
 * Receipt generation response
 */
export interface ReceiptGenerationResponse {
  receiptId: string;
  downloadUrl?: string;
  previewUrl?: string;
  expiryDate?: string;
  status: 'success' | 'error' | 'pending';
  deliveryStatus?: 'sent' | 'failed' | 'pending' | 'not_applicable';
  errorMessage?: string;
}

/**
 * Receipt history item
 */
export interface ReceiptHistoryItem {
  id: string;
  transactionId: string;
  transactionType: TransactionType;
  createdAt: string;
  format: ReceiptFormat;
  deliveryMethod: ReceiptDeliveryMethod;
  deliveryDestination?: string;
  deliveryStatus?: 'sent' | 'failed' | 'pending' | 'not_applicable';
  downloadUrl?: string;
  expiryDate?: string;
}

/**
 * Receipt template
 */
export interface ReceiptTemplate {
  id: string;
  name: string;
  type: ReceiptTemplateType;
  isDefault: boolean;
  htmlTemplate: string;
  cssTemplate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  supportedLanguages: ReceiptLanguage[];
}
