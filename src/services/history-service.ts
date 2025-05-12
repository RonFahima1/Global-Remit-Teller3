import { Sender, Receiver } from '@/context/transfer-context';

export interface TransferHistory {
  id: string;
  date: string;
  senderId: string;
  sender: Sender;
  receiverId: string;
  receiver: Receiver;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  fee: number;
  totalAmount: number;
  receiveAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference?: string;
  purpose?: string;
  estimatedDelivery?: string;
}

/**
 * Fetches the transfer history for the current user
 */
export async function getTransferHistory(): Promise<TransferHistory[]> {
  // This would be an API call in a real application
  // For now, we'll return mock data
  return mockTransferHistory;
}

/**
 * Fetches a specific transfer by ID
 */
export async function getTransferById(id: string): Promise<TransferHistory | null> {
  // This would be an API call in a real application
  const transfer = mockTransferHistory.find(t => t.id === id);
  return transfer || null;
}

/**
 * Cancels a pending transfer
 */
export async function cancelTransfer(id: string): Promise<{ success: boolean; message: string }> {
  // This would be an API call in a real application
  const transfer = mockTransferHistory.find(t => t.id === id);
  
  if (!transfer) {
    return { success: false, message: 'Transfer not found' };
  }
  
  if (transfer.status !== 'pending') {
    return { success: false, message: 'Only pending transfers can be cancelled' };
  }
  
  // In a real app, we would make an API call here
  // For now, we'll just return success
  return { success: true, message: 'Transfer cancelled successfully' };
}

// Mock data for transfer history
const mockTransferHistory: TransferHistory[] = [
  {
    id: 'TRF-1001',
    date: '2024-05-10T14:30:00',
    senderId: 'SND-001',
    sender: {
      id: 'SND-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      country: 'United States'
    },
    receiverId: 'RCV-001',
    receiver: {
      id: 'RCV-001',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+34 612 345 678',
      country: 'Spain'
    },
    amount: 500,
    sourceCurrency: 'USD',
    targetCurrency: 'EUR',
    exchangeRate: 0.92,
    fee: 4.99,
    totalAmount: 504.99,
    receiveAmount: 460,
    status: 'completed',
    reference: 'Family support',
    purpose: 'Family Support',
    estimatedDelivery: '2024-05-10T18:30:00'
  },
  {
    id: 'TRF-1002',
    date: '2024-05-11T09:15:00',
    senderId: 'SND-001',
    sender: {
      id: 'SND-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      country: 'United States'
    },
    receiverId: 'RCV-002',
    receiver: {
      id: 'RCV-002',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      phone: '+20 100 123 4567',
      country: 'Egypt'
    },
    amount: 1000,
    sourceCurrency: 'USD',
    targetCurrency: 'EGP',
    exchangeRate: 31.15,
    fee: 7.99,
    totalAmount: 1007.99,
    receiveAmount: 31150,
    status: 'processing',
    reference: 'Business payment',
    purpose: 'Business',
    estimatedDelivery: '2024-05-12T09:15:00'
  },
  {
    id: 'TRF-1003',
    date: '2024-05-12T10:45:00',
    senderId: 'SND-001',
    sender: {
      id: 'SND-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      country: 'United States'
    },
    receiverId: 'RCV-003',
    receiver: {
      id: 'RCV-003',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98765 43210',
      country: 'India'
    },
    amount: 300,
    sourceCurrency: 'USD',
    targetCurrency: 'INR',
    exchangeRate: 83.27,
    fee: 3.99,
    totalAmount: 303.99,
    receiveAmount: 24981,
    status: 'pending',
    reference: 'Gift',
    purpose: 'Gift',
    estimatedDelivery: '2024-05-13T10:45:00'
  },
  {
    id: 'TRF-1004',
    date: '2024-05-09T16:20:00',
    senderId: 'SND-001',
    sender: {
      id: 'SND-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      country: 'United States'
    },
    receiverId: 'RCV-004',
    receiver: {
      id: 'RCV-004',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@example.com',
      phone: '+52 55 1234 5678',
      country: 'Mexico'
    },
    amount: 750,
    sourceCurrency: 'USD',
    targetCurrency: 'MXN',
    exchangeRate: 16.85,
    fee: 5.99,
    totalAmount: 755.99,
    receiveAmount: 12637.5,
    status: 'failed',
    reference: 'Rent payment',
    purpose: 'Housing',
    estimatedDelivery: '2024-05-09T20:20:00'
  }
];
