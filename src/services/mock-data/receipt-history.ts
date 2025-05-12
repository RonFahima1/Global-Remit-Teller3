/**
 * Mock Receipt History
 * Sample data for receipt history
 */

import { ReceiptHistoryItem, ReceiptFormat, ReceiptDeliveryMethod } from '@/types/receipt';
import { TransactionType } from '@/types/transaction';

/**
 * Mock receipt history data
 */
export const mockReceiptHistory: ReceiptHistoryItem[] = [
  {
    id: 'receipt-001',
    transactionId: 'TRX-2025-001',
    transactionType: TransactionType.MONEY_TRANSFER,
    createdAt: '2025-05-10T14:30:00Z',
    format: ReceiptFormat.PDF,
    deliveryMethod: ReceiptDeliveryMethod.EMAIL,
    deliveryDestination: 'customer@example.com',
    deliveryStatus: 'sent',
    downloadUrl: '/api/receipts/receipt-001/download',
    expiryDate: '2025-06-10T14:30:00Z'
  },
  {
    id: 'receipt-002',
    transactionId: 'TRX-2025-001',
    transactionType: TransactionType.MONEY_TRANSFER,
    createdAt: '2025-05-10T14:35:00Z',
    format: ReceiptFormat.PDF,
    deliveryMethod: ReceiptDeliveryMethod.PRINT,
    deliveryStatus: 'not_applicable',
    downloadUrl: '/api/receipts/receipt-002/download',
    expiryDate: '2025-06-10T14:35:00Z'
  },
  {
    id: 'receipt-003',
    transactionId: 'TRX-2025-002',
    transactionType: TransactionType.PAYOUT,
    createdAt: '2025-05-11T09:15:00Z',
    format: ReceiptFormat.PDF,
    deliveryMethod: ReceiptDeliveryMethod.SMS,
    deliveryDestination: '+1234567890',
    deliveryStatus: 'sent',
    downloadUrl: '/api/receipts/receipt-003/download',
    expiryDate: '2025-06-11T09:15:00Z'
  },
  {
    id: 'receipt-004',
    transactionId: 'TRX-2025-003',
    transactionType: TransactionType.DEPOSIT,
    createdAt: '2025-05-11T11:45:00Z',
    format: ReceiptFormat.PDF,
    deliveryMethod: ReceiptDeliveryMethod.EMAIL,
    deliveryDestination: 'customer@example.com',
    deliveryStatus: 'failed',
    downloadUrl: '/api/receipts/receipt-004/download',
    expiryDate: '2025-06-11T11:45:00Z'
  },
  {
    id: 'receipt-005',
    transactionId: 'TRX-2025-004',
    transactionType: TransactionType.WITHDRAWAL,
    createdAt: '2025-05-12T13:20:00Z',
    format: ReceiptFormat.PDF,
    deliveryMethod: ReceiptDeliveryMethod.DOWNLOAD,
    deliveryStatus: 'not_applicable',
    downloadUrl: '/api/receipts/receipt-005/download',
    expiryDate: '2025-06-12T13:20:00Z'
  },
  {
    id: 'receipt-006',
    transactionId: 'TRX-2025-005',
    transactionType: TransactionType.MONEY_TRANSFER,
    createdAt: '2025-05-12T16:05:00Z',
    format: ReceiptFormat.HTML,
    deliveryMethod: ReceiptDeliveryMethod.EMAIL,
    deliveryDestination: 'customer@example.com',
    deliveryStatus: 'sent',
    downloadUrl: '/api/receipts/receipt-006/download',
    expiryDate: '2025-06-12T16:05:00Z'
  },
  {
    id: 'receipt-007',
    transactionId: 'TRX-2025-006',
    transactionType: TransactionType.EXCHANGE,
    createdAt: '2025-05-12T17:30:00Z',
    format: ReceiptFormat.PDF,
    deliveryMethod: ReceiptDeliveryMethod.PRINT,
    deliveryStatus: 'not_applicable',
    downloadUrl: '/api/receipts/receipt-007/download',
    expiryDate: '2025-06-12T17:30:00Z'
  }
];
