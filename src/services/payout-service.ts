/**
 * Payout Service
 * Handles payout operations and partner integrations
 */

import { 
  Payout, 
  PayoutPartner, 
  PayoutRequest, 
  PayoutUpdate, 
  PayoutFilter,
  PayoutPartnerFilter,
  PayoutStatus,
  PayoutStatusUpdate,
  PayoutReconciliation,
  PayoutFeeCalculation
} from '@/types/payout';
import { mockPayoutPartners } from './mock-data/payout-partners';
import { mockPayouts } from './mock-data/payouts';
import { v4 as uuidv4 } from 'uuid';

/**
 * Payout Service Class
 */
class PayoutService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  /**
   * Get all payout partners
   */
  async getAllPartners(): Promise<PayoutPartner[]> {
    try {
      // In a real app, this would be an API call
      // return await fetch(`${this.apiUrl}/payout-partners`).then(res => res.json());
      
      // Using mock data for now
      return Promise.resolve(mockPayoutPartners);
    } catch (error) {
      console.error('Error fetching payout partners:', error);
      throw error;
    }
  }
  
  /**
   * Get payout partners by filter
   */
  async getPartnersByFilter(filter: PayoutPartnerFilter): Promise<PayoutPartner[]> {
    try {
      // In a real app, this would be an API call with query params
      
      // Using mock data with filtering
      const filteredPartners = mockPayoutPartners.filter(partner => {
        if (filter.country && !partner.supportedCountries.includes(filter.country)) return false;
        if (filter.currency && !partner.supportedCurrencies.includes(filter.currency)) return false;
        if (filter.method && !partner.supportedMethods.includes(filter.method)) return false;
        if (filter.isActive !== undefined && partner.isActive !== filter.isActive) return false;
        
        return true;
      });
      
      return Promise.resolve(filteredPartners);
    } catch (error) {
      console.error('Error fetching payout partners by filter:', error);
      throw error;
    }
  }
  
  /**
   * Get payout partner by ID
   */
  async getPartnerById(partnerId: string): Promise<PayoutPartner | null> {
    try {
      // In a real app, this would be an API call
      
      // Using mock data
      const partner = mockPayoutPartners.find(p => p.id === partnerId);
      
      return Promise.resolve(partner || null);
    } catch (error) {
      console.error('Error fetching payout partner by ID:', error);
      throw error;
    }
  }
  
  /**
   * Get all payouts
   */
  async getAllPayouts(): Promise<Payout[]> {
    try {
      // In a real app, this would be an API call
      // return await fetch(`${this.apiUrl}/payouts`).then(res => res.json());
      
      // Using mock data for now
      return Promise.resolve(mockPayouts);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      throw error;
    }
  }
  
  /**
   * Get payouts by filter
   */
  async getPayoutsByFilter(filter: PayoutFilter): Promise<Payout[]> {
    try {
      // In a real app, this would be an API call with query params
      
      // Using mock data with filtering
      const filteredPayouts = mockPayouts.filter(payout => {
        if (filter.transactionId && payout.transactionId !== filter.transactionId) return false;
        if (filter.partnerId && payout.partnerId !== filter.partnerId) return false;
        if (filter.senderId && payout.senderId !== filter.senderId) return false;
        if (filter.receiverId && payout.receiverId !== filter.receiverId) return false;
        if (filter.status && payout.status !== filter.status) return false;
        if (filter.method && payout.method !== filter.method) return false;
        if (filter.currency && payout.currency !== filter.currency) return false;
        
        if (filter.minAmount !== undefined && payout.amount < filter.minAmount) return false;
        if (filter.maxAmount !== undefined && payout.amount > filter.maxAmount) return false;
        
        if (filter.startDate) {
          const startDate = new Date(filter.startDate);
          const payoutDate = new Date(payout.createdAt);
          if (payoutDate < startDate) return false;
        }
        
        if (filter.endDate) {
          const endDate = new Date(filter.endDate);
          const payoutDate = new Date(payout.createdAt);
          if (payoutDate > endDate) return false;
        }
        
        return true;
      });
      
      return Promise.resolve(filteredPayouts);
    } catch (error) {
      console.error('Error fetching payouts by filter:', error);
      throw error;
    }
  }
  
  /**
   * Get payout by ID
   */
  async getPayoutById(payoutId: string): Promise<Payout | null> {
    try {
      // In a real app, this would be an API call
      
      // Using mock data
      const payout = mockPayouts.find(p => p.id === payoutId);
      
      return Promise.resolve(payout || null);
    } catch (error) {
      console.error('Error fetching payout by ID:', error);
      throw error;
    }
  }
  
  /**
   * Create a new payout
   */
  async createPayout(payoutRequest: PayoutRequest, userId: string): Promise<Payout> {
    try {
      // In a real app, this would be an API call
      
      // Get partner details
      const partner = await this.getPartnerById(payoutRequest.partnerId);
      if (!partner) {
        throw new Error(`Payout partner not found with ID: ${payoutRequest.partnerId}`);
      }
      
      // Create new payout
      const now = new Date().toISOString();
      const newPayout: Payout = {
        id: uuidv4(),
        transactionId: payoutRequest.transactionId,
        partnerId: payoutRequest.partnerId,
        partnerName: partner.name,
        partnerReference: `${partner.code}-${Math.floor(100000 + Math.random() * 900000)}`, // Mock reference
        senderId: payoutRequest.senderId,
        senderName: 'Unknown Sender', // In a real app, this would be fetched from sender data
        receiverId: payoutRequest.receiverId,
        receiverName: 'Unknown Receiver', // In a real app, this would be fetched from receiver data
        amount: payoutRequest.amount,
        currency: payoutRequest.currency,
        method: payoutRequest.method,
        status: PayoutStatus.PENDING,
        statusDetails: 'Payout created, awaiting processing',
        payoutDate: now,
        expectedDeliveryDate: this.calculateExpectedDeliveryDate(payoutRequest.method),
        fee: this.calculateFee(payoutRequest.amount, partner.feeStructure),
        notes: payoutRequest.notes || '',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        metadata: payoutRequest.metadata || {}
      };
      
      // In a real app, we would save this to the database and call the partner API
      
      return Promise.resolve(newPayout);
    } catch (error) {
      console.error('Error creating payout:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing payout
   */
  async updatePayout(payoutId: string, payoutUpdate: PayoutUpdate, userId: string): Promise<Payout> {
    try {
      // In a real app, this would be an API call
      
      // Find existing payout
      const existingPayout = mockPayouts.find(p => p.id === payoutId);
      if (!existingPayout) {
        throw new Error('Payout not found');
      }
      
      // Update payout
      const updatedPayout: Payout = {
        ...existingPayout,
        ...payoutUpdate,
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(updatedPayout);
    } catch (error) {
      console.error('Error updating payout:', error);
      throw error;
    }
  }
  
  /**
   * Process a status update from a partner
   */
  async processStatusUpdate(statusUpdate: PayoutStatusUpdate): Promise<Payout | null> {
    try {
      // In a real app, this would be an API call
      
      // Find payout by partner reference
      const payout = mockPayouts.find(p => p.partnerReference === statusUpdate.partnerReference);
      if (!payout) {
        throw new Error(`Payout not found with partner reference: ${statusUpdate.partnerReference}`);
      }
      
      // Update payout status
      const updatedPayout: Payout = {
        ...payout,
        status: statusUpdate.status,
        statusDetails: statusUpdate.statusDetails || payout.statusDetails,
        actualDeliveryDate: statusUpdate.actualDeliveryDate || payout.actualDeliveryDate,
        metadata: { ...payout.metadata, ...statusUpdate.metadata },
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(updatedPayout);
    } catch (error) {
      console.error('Error processing status update:', error);
      throw error;
    }
  }
  
  /**
   * Calculate payout fee
   */
  async calculatePayoutFee(
    amount: number, 
    currency: string, 
    partnerId: string
  ): Promise<PayoutFeeCalculation> {
    try {
      // Get partner details
      const partner = await this.getPartnerById(partnerId);
      if (!partner) {
        throw new Error(`Payout partner not found with ID: ${partnerId}`);
      }
      
      // Calculate fee
      const fee = this.calculateFee(amount, partner.feeStructure);
      
      // Calculate total amount
      const totalAmount = amount + fee;
      
      return {
        amount,
        fee,
        totalAmount,
        currency,
        partnerId,
        partnerName: partner.name
      };
    } catch (error) {
      console.error('Error calculating payout fee:', error);
      throw error;
    }
  }
  
  /**
   * Create a reconciliation record
   */
  async createReconciliation(
    partnerId: string, 
    startDate: string, 
    endDate: string, 
    userId: string
  ): Promise<PayoutReconciliation> {
    try {
      // Get partner details
      const partner = await this.getPartnerById(partnerId);
      if (!partner) {
        throw new Error(`Payout partner not found with ID: ${partnerId}`);
      }
      
      // Get payouts for the period
      const payouts = await this.getPayoutsByFilter({
        partnerId,
        startDate,
        endDate
      });
      
      // Calculate totals
      const totalPayouts = payouts.length;
      const successfulPayouts = payouts.filter(p => p.status === PayoutStatus.COMPLETED).length;
      const failedPayouts = payouts.filter(p => p.status === PayoutStatus.FAILED).length;
      const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
      
      // Create reconciliation record
      const reconciliation: PayoutReconciliation = {
        id: uuidv4(),
        partnerId,
        partnerName: partner.name,
        startDate,
        endDate,
        totalPayouts,
        successfulPayouts,
        failedPayouts,
        totalAmount,
        currency: partner.feeStructure.currency, // Using partner's default currency
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        createdBy: userId
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(reconciliation);
    } catch (error) {
      console.error('Error creating reconciliation:', error);
      throw error;
    }
  }
  
  /**
   * Complete a reconciliation
   */
  async completeReconciliation(
    reconciliationId: string, 
    userId: string, 
    discrepancyAmount?: number, 
    discrepancyNotes?: string
  ): Promise<PayoutReconciliation> {
    try {
      // In a real app, this would be an API call
      
      // Mock reconciliation
      const reconciliation: PayoutReconciliation = {
        id: reconciliationId,
        partnerId: '1',
        partnerName: 'Global Transfer Network',
        startDate: '2025-05-01T00:00:00Z',
        endDate: '2025-05-10T23:59:59Z',
        totalPayouts: 50,
        successfulPayouts: 45,
        failedPayouts: 5,
        totalAmount: 25000,
        currency: 'USD',
        status: discrepancyAmount ? 'DISCREPANCY' : 'COMPLETED',
        discrepancyAmount,
        discrepancyNotes,
        createdAt: '2025-05-11T10:00:00Z',
        createdBy: 'operator-001',
        completedAt: new Date().toISOString(),
        completedBy: userId
      };
      
      // In a real app, we would save this to the database
      
      return Promise.resolve(reconciliation);
    } catch (error) {
      console.error('Error completing reconciliation:', error);
      throw error;
    }
  }
  
  /**
   * Helper method to calculate expected delivery date
   */
  private calculateExpectedDeliveryDate(method: string): string {
    const now = new Date();
    let deliveryDate = new Date(now);
    
    // Add days based on method
    switch (method) {
      case 'BANK_TRANSFER':
        deliveryDate.setDate(now.getDate() + 1); // T+1
        break;
      case 'CASH_PICKUP':
        // Same day
        break;
      case 'MOBILE_WALLET':
        // Same day
        break;
      case 'HOME_DELIVERY':
        deliveryDate.setDate(now.getDate() + 1); // T+1
        break;
      case 'DEBIT_CARD':
        // Same day
        break;
      default:
        deliveryDate.setDate(now.getDate() + 1); // Default T+1
    }
    
    // Set to end of day
    deliveryDate.setHours(23, 59, 59, 999);
    
    return deliveryDate.toISOString();
  }
  
  /**
   * Helper method to calculate fee
   */
  private calculateFee(amount: number, feeStructure: any): number {
    let fee = 0;
    
    // Calculate percentage fee
    if (feeStructure.percentageFee) {
      fee += amount * (feeStructure.percentageFee / 100);
    }
    
    // Add fixed fee
    if (feeStructure.fixedFee) {
      fee += feeStructure.fixedFee;
    }
    
    // Apply minimum fee
    if (feeStructure.minimumFee && fee < feeStructure.minimumFee) {
      fee = feeStructure.minimumFee;
    }
    
    // Apply maximum fee
    if (feeStructure.maximumFee && fee > feeStructure.maximumFee) {
      fee = feeStructure.maximumFee;
    }
    
    // Round to 2 decimal places
    return Math.round(fee * 100) / 100;
  }
}

// Create singleton instance
export const payoutService = new PayoutService();
