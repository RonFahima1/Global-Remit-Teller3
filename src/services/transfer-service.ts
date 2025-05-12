import { Sender, Receiver } from '@/context/transfer-context';

/**
 * Interface for recent recipients with transfer details
 */
export interface RecentRecipient {
  id: string;
  receiver: Receiver;
  lastTransferDate: string;
  transferCount: number;
  lastAmount: number;
  lastCurrency: string;
}

/**
 * Fetches the list of senders for the current user
 */
export async function getSenders(): Promise<Sender[]> {
  const response = await fetch('/api/senders');
  if (!response.ok) {
    throw new Error('Failed to fetch senders');
  }
  return response.json();
}

/**
 * Fetches the list of recent recipients for quick transfers
 */
export async function getRecentRecipients(): Promise<RecentRecipient[]> {
  // This would be an API call in a real application
  // For now, we'll return mock data based on the mock transfer history
  
  // In a real app, this would be fetched from the API
  return mockRecentRecipients;
}

/**
 * Fetches the list of receivers for a specific sender
 */
export async function getReceivers(senderId: string): Promise<Receiver[]> {
  const response = await fetch(`/api/receivers?senderId=${senderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch receivers');
  }
  return response.json();
}

/**
 * Gets the current exchange rate between two currencies
 */
export async function getExchangeRate(sourceCurrency: string, targetCurrency: string): Promise<number> {
  const response = await fetch(`/api/exchange-rates?from=${sourceCurrency}&to=${targetCurrency}`);
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate');
  }
  const data = await response.json();
  return data.rate;
}

/**
 * Calculates the transfer fee based on amount and currencies
 */
export async function calculateFee(amount: number, sourceCurrency: string, targetCurrency: string): Promise<number> {
  const response = await fetch('/api/calculate-fee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      sourceCurrency,
      targetCurrency,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to calculate fee');
  }
  
  const data = await response.json();
  return data.fee;
}

export interface TransferData {
  senderId: string;
  receiverId: string;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  fee: number;
  totalAmount: number;
  purpose: string;
  reference: string;
}

/**
 * Submits a money transfer transaction
 */
export async function submitTransfer(transferData: TransferData): Promise<{ id: string; status: string }> {
  const response = await fetch('/api/transfers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transferData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit transfer');
  }
  
  return response.json();
}

/**
 * Validates if a transfer can be processed
 */
export async function validateTransfer(transferData: Partial<TransferData>): Promise<{ valid: boolean; errors?: string[] }> {
  const response = await fetch('/api/transfers/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transferData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to validate transfer');
  }
  
  return response.json();
}

/**
 * Gets the transaction receipt for a completed transfer
 */
export async function getTransferReceipt(transferId: string): Promise<Blob> {
  const response = await fetch(`/api/transfers/${transferId}/receipt`, {
    method: 'GET',
    headers: {
      'Accept': 'application/pdf',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate receipt');
  }
  
  return response.blob();
}

// Mock data for recent recipients
const mockRecentRecipients: RecentRecipient[] = [
  {
    id: 'RR-001',
    receiver: {
      id: 'RCV-001',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+34 612 345 678',
      country: 'Spain'
    },
    lastTransferDate: '2024-05-10T14:30:00',
    transferCount: 5,
    lastAmount: 500,
    lastCurrency: 'USD'
  },
  {
    id: 'RR-002',
    receiver: {
      id: 'RCV-002',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      phone: '+20 100 123 4567',
      country: 'Egypt'
    },
    lastTransferDate: '2024-05-11T09:15:00',
    transferCount: 3,
    lastAmount: 1000,
    lastCurrency: 'USD'
  },
  {
    id: 'RR-003',
    receiver: {
      id: 'RCV-003',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98765 43210',
      country: 'India'
    },
    lastTransferDate: '2024-05-12T10:45:00',
    transferCount: 2,
    lastAmount: 300,
    lastCurrency: 'USD'
  }
];
