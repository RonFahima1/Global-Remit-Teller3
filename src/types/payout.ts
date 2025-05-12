/**
 * Payout Types
 * Defines types for payout processing system
 */

/**
 * Payout Status
 * Represents the status of a payout
 */
export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * Payout Method
 * Represents the method of payout
 */
export enum PayoutMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_PICKUP = 'CASH_PICKUP',
  MOBILE_WALLET = 'MOBILE_WALLET',
  HOME_DELIVERY = 'HOME_DELIVERY',
  DEBIT_CARD = 'DEBIT_CARD'
}

/**
 * Payout Partner
 * Represents a payout partner
 */
export interface PayoutPartner {
  id: string;
  name: string;
  code: string;
  description?: string;
  logo?: string;
  supportedCountries: string[];
  supportedCurrencies: string[];
  supportedMethods: PayoutMethod[];
  apiCredentials: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl: string;
    username?: string;
    password?: string;
  };
  isActive: boolean;
  feeStructure: {
    fixedFee?: number;
    percentageFee?: number;
    minimumFee?: number;
    maximumFee?: number;
    currency: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
    contactPerson?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Payout
 * Represents a payout transaction
 */
export interface Payout {
  id: string;
  transactionId: string;
  partnerId: string;
  partnerName: string;
  partnerReference?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  status: PayoutStatus;
  statusDetails?: string;
  payoutDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  fee: number;
  exchangeRate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Payout Request
 * Represents a request to create a payout
 */
export interface PayoutRequest {
  transactionId: string;
  partnerId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Payout Update
 * Represents an update to a payout
 */
export interface PayoutUpdate {
  status?: PayoutStatus;
  statusDetails?: string;
  partnerReference?: string;
  payoutDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Payout Filter
 * Represents filters for querying payouts
 */
export interface PayoutFilter {
  transactionId?: string;
  partnerId?: string;
  senderId?: string;
  receiverId?: string;
  status?: PayoutStatus;
  method?: PayoutMethod;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
}

/**
 * Payout Partner Filter
 * Represents filters for querying payout partners
 */
export interface PayoutPartnerFilter {
  country?: string;
  currency?: string;
  method?: PayoutMethod;
  isActive?: boolean;
}

/**
 * Payout Status Update
 * Represents a status update from a payout partner
 */
export interface PayoutStatusUpdate {
  partnerReference: string;
  status: PayoutStatus;
  statusDetails?: string;
  actualDeliveryDate?: string;
  metadata?: Record<string, any>;
}

/**
 * Payout Reconciliation
 * Represents a reconciliation record for payouts
 */
export interface PayoutReconciliation {
  id: string;
  partnerId: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  totalPayouts: number;
  successfulPayouts: number;
  failedPayouts: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'DISCREPANCY';
  discrepancyAmount?: number;
  discrepancyNotes?: string;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  completedBy?: string;
}

/**
 * Payout Fee Calculation
 * Represents the result of a fee calculation
 */
export interface PayoutFeeCalculation {
  amount: number;
  fee: number;
  totalAmount: number;
  currency: string;
  exchangeRate?: number;
  partnerId: string;
  partnerName: string;
}
