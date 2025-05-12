/**
 * Receipt Generator
 * Generates PDF receipts for money transfers
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './utils';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Receipt data interface
export interface ReceiptData {
  transactionId: string;
  trackingNumber: string;
  date: string;
  sender: {
    name: string;
    id: string;
    country?: string;
  };
  receiver: {
    name: string;
    id: string;
    country?: string;
  };
  amount: {
    sendAmount: number;
    receiveAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    exchangeRate: number;
    fee: number;
    totalCost: number;
  };
  details: {
    purpose: string;
    sourceOfFunds: string;
    paymentMethod: string;
    deliveryMethod: string;
    notes?: string;
    referenceNumber?: string;
  };
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
}

/**
 * Generate a PDF receipt for a money transfer
 */
export const generateReceipt = (data: ReceiptData): Blob => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Set font
  doc.setFont('helvetica');
  
  // Add company logo and header
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 204);
  doc.text('Global Remit Teller', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Money Transfer Receipt', 105, 28, { align: 'center' });
  
  // Add receipt details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Add status badge
  doc.setFillColor(data.status === 'completed' ? 0 : 255, data.status === 'completed' ? 150 : 0, 0);
  doc.roundedRect(150, 35, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(data.status.toUpperCase(), 165, 40, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  // Add transaction details
  doc.text('Transaction ID:', 20, 45);
  doc.text(data.transactionId, 70, 45);
  
  doc.text('Tracking Number:', 20, 52);
  doc.text(data.trackingNumber, 70, 52);
  
  doc.text('Date & Time:', 20, 59);
  doc.text(data.date, 70, 59);
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, 190, 65);
  
  // Add sender and receiver details
  doc.setFontSize(12);
  doc.text('Sender', 20, 75);
  doc.text('Receiver', 105, 75);
  
  doc.setFontSize(10);
  doc.text('Name:', 20, 82);
  doc.text(data.sender.name, 40, 82);
  
  doc.text('ID:', 20, 89);
  doc.text(data.sender.id, 40, 89);
  
  if (data.sender.country) {
    doc.text('Country:', 20, 96);
    doc.text(data.sender.country, 40, 96);
  }
  
  doc.text('Name:', 105, 82);
  doc.text(data.receiver.name, 125, 82);
  
  doc.text('ID:', 105, 89);
  doc.text(data.receiver.id, 125, 89);
  
  if (data.receiver.country) {
    doc.text('Country:', 105, 96);
    doc.text(data.receiver.country, 125, 96);
  }
  
  // Add separator line
  doc.line(20, 105, 190, 105);
  
  // Add transaction amount details
  doc.setFontSize(12);
  doc.text('Transaction Details', 20, 115);
  
  doc.setFontSize(10);
  doc.text('Send Amount:', 20, 125);
  doc.text(formatCurrency(data.amount.sendAmount, data.amount.sendCurrency), 80, 125);
  
  doc.text('Receive Amount:', 20, 132);
  doc.text(formatCurrency(data.amount.receiveAmount, data.amount.receiveCurrency), 80, 132);
  
  doc.text('Exchange Rate:', 20, 139);
  doc.text(`1 ${data.amount.sendCurrency} = ${data.amount.exchangeRate.toFixed(4)} ${data.amount.receiveCurrency}`, 80, 139);
  
  doc.text('Fee:', 20, 146);
  doc.text(formatCurrency(data.amount.fee, data.amount.sendCurrency), 80, 146);
  
  doc.text('Total Cost:', 20, 153);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.amount.totalCost, data.amount.sendCurrency), 80, 153);
  doc.setFont('helvetica', 'normal');
  
  // Add separator line
  doc.line(20, 160, 190, 160);
  
  // Add transfer details
  doc.setFontSize(12);
  doc.text('Transfer Details', 20, 170);
  
  doc.setFontSize(10);
  doc.text('Purpose:', 20, 180);
  doc.text(data.details.purpose, 80, 180);
  
  doc.text('Source of Funds:', 20, 187);
  doc.text(data.details.sourceOfFunds, 80, 187);
  
  doc.text('Payment Method:', 20, 194);
  doc.text(data.details.paymentMethod, 80, 194);
  
  doc.text('Delivery Method:', 20, 201);
  doc.text(data.details.deliveryMethod, 80, 201);
  
  if (data.details.referenceNumber) {
    doc.text('Reference Number:', 20, 208);
    doc.text(data.details.referenceNumber, 80, 208);
  }
  
  if (data.details.notes) {
    doc.text('Notes:', 20, 215);
    doc.text(data.details.notes, 80, 215, { maxWidth: 100 });
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This receipt is an official record of your transaction with Global Remit Teller.', 105, 270, { align: 'center' });
  doc.text('For any inquiries, please contact customer support at support@globalremitteller.com', 105, 275, { align: 'center' });
  doc.text(`Receipt generated on ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });
  
  // Return the PDF as a blob
  return doc.output('blob');
};

/**
 * Generate a receipt and trigger download
 */
export const generateAndDownloadReceipt = (data: ReceiptData): void => {
  const pdfBlob = generateReceipt(data);
  const url = URL.createObjectURL(pdfBlob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${data.trackingNumber}.pdf`;
  
  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};
