/**
 * Receipt History Component
 * Displays the history of receipts for a transaction
 */

'use client';

import React, { useEffect } from 'react';
import { useReceipts } from '@/hooks/useReceipts';
import { ReceiptHistoryItem, ReceiptDeliveryMethod, ReceiptFormat } from '@/types/receipt';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Download, 
  Mail, 
  Phone, 
  Printer,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Receipt History Props
 */
interface ReceiptHistoryProps {
  transactionId: string;
  onSelectReceipt?: (receipt: ReceiptHistoryItem) => void;
}

/**
 * Receipt History Component
 */
export function ReceiptHistory({ 
  transactionId,
  onSelectReceipt
}: ReceiptHistoryProps) {
  // Hooks
  const { 
    getReceiptHistory, 
    receipts, 
    isLoading, 
    error 
  } = useReceipts();
  
  // Load receipt history on mount
  useEffect(() => {
    if (transactionId) {
      getReceiptHistory(transactionId);
    }
  }, [transactionId, getReceiptHistory]);
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  // Get delivery method icon
  const getDeliveryMethodIcon = (method: ReceiptDeliveryMethod) => {
    switch (method) {
      case ReceiptDeliveryMethod.EMAIL:
        return <Mail className="h-4 w-4" />;
      case ReceiptDeliveryMethod.SMS:
        return <Phone className="h-4 w-4" />;
      case ReceiptDeliveryMethod.PRINT:
        return <Printer className="h-4 w-4" />;
      case ReceiptDeliveryMethod.DOWNLOAD:
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get delivery method name
  const getDeliveryMethodName = (method: ReceiptDeliveryMethod) => {
    switch (method) {
      case ReceiptDeliveryMethod.EMAIL:
        return 'Email';
      case ReceiptDeliveryMethod.SMS:
        return 'SMS';
      case ReceiptDeliveryMethod.PRINT:
        return 'Print';
      case ReceiptDeliveryMethod.DOWNLOAD:
        return 'Download';
      default:
        return method;
    }
  };
  
  // Get format name
  const getFormatName = (format: ReceiptFormat) => {
    switch (format) {
      case ReceiptFormat.PDF:
        return 'PDF';
      case ReceiptFormat.HTML:
        return 'HTML';
      case ReceiptFormat.IMAGE:
        return 'Image';
      default:
        return format;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status || status === 'not_applicable') {
      return null;
    }
    
    switch (status) {
      case 'sent':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };
  
  // Handle download
  const handleDownload = (receipt: ReceiptHistoryItem) => {
    if (!receipt.downloadUrl) {
      toast.error('Download URL not available');
      return;
    }
    
    // In a real app, this would navigate to the download URL
    // For now, we'll just show a toast
    toast.success(`Downloading receipt ${receipt.id}`);
    
    // If there's a select handler, call it
    if (onSelectReceipt) {
      onSelectReceipt(receipt);
    }
  };
  
  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Error loading receipt history: {error}</p>
        </div>
      </div>
    );
  }
  
  // If no receipts, show empty state
  if (!receipts || receipts.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No receipts found</h3>
        <p className="text-gray-500 mt-2">
          No receipts have been generated for this transaction yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Receipt History</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>
                {formatDate(receipt.createdAt)}
              </TableCell>
              <TableCell>
                {getFormatName(receipt.format)}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getDeliveryMethodIcon(receipt.deliveryMethod)}
                  <span className="ml-2">{getDeliveryMethodName(receipt.deliveryMethod)}</span>
                  {receipt.deliveryDestination && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({receipt.deliveryDestination})
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(receipt.deliveryStatus)}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDownload(receipt)}
                  disabled={!receipt.downloadUrl}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {receipts.length > 0 && (
        <p className="text-xs text-gray-500">
          Receipts are available for download for 30 days after generation.
        </p>
      )}
    </div>
  );
}
