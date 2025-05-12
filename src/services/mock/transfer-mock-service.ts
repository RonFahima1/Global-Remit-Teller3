/**
 * Transfer Mock Service
 * Provides mock data for transfer-related components during development
 */

import { v4 as uuidv4 } from 'uuid';

// Types
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  kycStatus?: 'verified' | 'pending' | 'rejected' | 'not_started';
  riskLevel?: 'low' | 'medium' | 'high';
  avatarUrl?: string;
}

interface TransferAmount {
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
}

interface TransferDetailsData {
  purpose: string;
  sourceOfFunds: string;
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
  referenceNumber?: string;
  termsAccepted: boolean;
}

interface TransferData {
  senderId: string;
  receiverId: string;
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  purpose: string;
  sourceOfFunds: string;
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
  referenceNumber?: string;
}

interface TransferResponse {
  transactionId: string;
  trackingNumber: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

interface TransferHistory {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: string;
  trackingNumber: string;
  purpose: string;
  paymentMethod: string;
  deliveryMethod: string;
}

/**
 * Create a mock transfer
 */
export const createMockTransfer = (data: TransferData): Promise<TransferResponse> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate transaction ID and tracking number
      const transactionId = `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      const trackingNumber = `TR-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Store in local storage for history
      const transferHistory: TransferHistory[] = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      
      // Add to history
      transferHistory.push({
        id: transactionId,
        senderId: data.senderId,
        senderName: mockClients.find(c => c.id === data.senderId)?.firstName + ' ' + mockClients.find(c => c.id === data.senderId)?.lastName || 'Unknown',
        receiverId: data.receiverId,
        receiverName: mockClients.find(c => c.id === data.receiverId)?.firstName + ' ' + mockClients.find(c => c.id === data.receiverId)?.lastName || 'Unknown',
        sendAmount: data.sendAmount,
        receiveAmount: data.receiveAmount,
        sendCurrency: data.sendCurrency,
        receiveCurrency: data.receiveCurrency,
        status: 'completed',
        date: new Date().toISOString(),
        trackingNumber,
        purpose: data.purpose,
        paymentMethod: data.paymentMethod,
        deliveryMethod: data.deliveryMethod
      });
      
      // Save to local storage
      localStorage.setItem('transferHistory', JSON.stringify(transferHistory));
      
      // Return response
      resolve({
        transactionId,
        trackingNumber,
        status: 'completed',
        timestamp: new Date().toISOString()
      });
    }, 1500); // Simulate 1.5s delay
  });
};

/**
 * Get transfer history
 */
export const getMockTransferHistory = (): Promise<TransferHistory[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Get from local storage or use mock data
      const transferHistory: TransferHistory[] = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      
      // If no history, use mock data
      if (transferHistory.length === 0) {
        resolve(mockTransferHistory);
      } else {
        resolve(transferHistory);
      }
    }, 800); // Simulate 800ms delay
  });
};

/**
 * Get transfer by ID
 */
export const getMockTransferById = (id: string): Promise<TransferHistory | null> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Get from local storage or use mock data
      const transferHistory: TransferHistory[] = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      
      // Find transfer
      const transfer = transferHistory.find(t => t.id === id) || 
                       mockTransferHistory.find(t => t.id === id) || 
                       null;
      
      resolve(transfer);
    }, 500); // Simulate 500ms delay
  });
};

/**
 * Get transfer by tracking number
 */
export const getMockTransferByTrackingNumber = (trackingNumber: string): Promise<TransferHistory | null> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Get from local storage or use mock data
      const transferHistory: TransferHistory[] = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      
      // Find transfer
      const transfer = transferHistory.find(t => t.trackingNumber === trackingNumber) || 
                       mockTransferHistory.find(t => t.trackingNumber === trackingNumber) || 
                       null;
      
      resolve(transfer);
    }, 500); // Simulate 500ms delay
  });
};

// Mock clients data
export const mockClients: Client[] = [
  {
    id: 'client-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 555-123-4567',
    country: 'United States',
    city: 'New York',
    kycStatus: 'verified',
    riskLevel: 'low'
  },
  {
    id: 'client-2',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@example.com',
    phone: '+34 612 345 678',
    country: 'Spain',
    city: 'Madrid',
    kycStatus: 'verified',
    riskLevel: 'low'
  },
  {
    id: 'client-3',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+20 100 123 4567',
    country: 'Egypt',
    city: 'Cairo',
    kycStatus: 'verified',
    riskLevel: 'low'
  },
  {
    id: 'client-4',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Mumbai',
    kycStatus: 'pending',
    riskLevel: 'medium'
  },
  {
    id: 'client-5',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@example.com',
    phone: '+86 138 1234 5678',
    country: 'China',
    city: 'Shanghai',
    kycStatus: 'verified',
    riskLevel: 'low'
  }
];

// Mock transfer history data
export const mockTransferHistory: TransferHistory[] = [
  {
    id: 'TXN-123456',
    senderId: 'client-1',
    senderName: 'John Smith',
    receiverId: 'client-2',
    receiverName: 'Maria Rodriguez',
    sendAmount: 500,
    receiveAmount: 460,
    sendCurrency: 'USD',
    receiveCurrency: 'EUR',
    status: 'completed',
    date: '2025-05-10T14:30:00Z',
    trackingNumber: 'TR-123456',
    purpose: 'family_support',
    paymentMethod: 'cash',
    deliveryMethod: 'cash'
  },
  {
    id: 'TXN-234567',
    senderId: 'client-1',
    senderName: 'John Smith',
    receiverId: 'client-3',
    receiverName: 'Ahmed Hassan',
    sendAmount: 1000,
    receiveAmount: 3752,
    sendCurrency: 'USD',
    receiveCurrency: 'ILS',
    status: 'completed',
    date: '2025-05-08T10:15:00Z',
    trackingNumber: 'TR-234567',
    purpose: 'business',
    paymentMethod: 'debit_card',
    deliveryMethod: 'bank_deposit'
  },
  {
    id: 'TXN-345678',
    senderId: 'client-3',
    senderName: 'Ahmed Hassan',
    receiverId: 'client-4',
    receiverName: 'Priya Patel',
    sendAmount: 300,
    receiveAmount: 25000,
    sendCurrency: 'USD',
    receiveCurrency: 'INR',
    status: 'pending',
    date: '2025-05-11T09:45:00Z',
    trackingNumber: 'TR-345678',
    purpose: 'education',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'mobile_wallet'
  },
  {
    id: 'TXN-456789',
    senderId: 'client-5',
    senderName: 'David Chen',
    receiverId: 'client-1',
    receiverName: 'John Smith',
    sendAmount: 750,
    receiveAmount: 750,
    sendCurrency: 'USD',
    receiveCurrency: 'USD',
    status: 'completed',
    date: '2025-05-09T16:20:00Z',
    trackingNumber: 'TR-456789',
    purpose: 'gift',
    paymentMethod: 'credit_card',
    deliveryMethod: 'cash'
  },
  {
    id: 'TXN-567890',
    senderId: 'client-2',
    senderName: 'Maria Rodriguez',
    receiverId: 'client-5',
    receiverName: 'David Chen',
    sendAmount: 200,
    receiveAmount: 1500,
    sendCurrency: 'EUR',
    receiveCurrency: 'CNY',
    status: 'failed',
    date: '2025-05-07T11:30:00Z',
    trackingNumber: 'TR-567890',
    purpose: 'other',
    paymentMethod: 'cash',
    deliveryMethod: 'cash'
  }
];

// Export all mock functions
export const transferMockService = {
  createTransfer: createMockTransfer,
  getTransferHistory: getMockTransferHistory,
  getTransferById: getMockTransferById,
  getTransferByTrackingNumber: getMockTransferByTrackingNumber,
  mockClients,
  mockTransferHistory
};

export default transferMockService;
