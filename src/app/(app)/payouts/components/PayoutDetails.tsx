/**
 * Payout Details Component
 * Displays detailed information about a payout and allows status updates
 */

'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  DollarSign, 
  Truck, 
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { usePayouts } from '@/hooks/usePayouts';
import { Payout, PayoutMethod, PayoutStatus, PayoutUpdate } from '@/types/payout';
import { format } from 'date-fns';
import { toast } from 'sonner';

/**
 * Payout Details Props
 */
interface PayoutDetailsProps {
  payout: Payout | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Payout Details Component
 */
export function PayoutDetails({ payout, isOpen, onClose }: PayoutDetailsProps) {
  const { updatePayoutStatus, isLoading, error } = usePayouts();
  
  // State for status update
  const [newStatus, setNewStatus] = useState<PayoutStatus | ''>('');
  const [statusDetails, setStatusDetails] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle status update
  const handleStatusUpdate = async () => {
    if (!payout || !newStatus) return;
    
    setIsUpdating(true);
    
    try {
      // In a real app, we would get the user ID from authentication
      const userId = 'current-user';
      
      const updateData: PayoutUpdate = {
        status: newStatus as PayoutStatus,
        statusDetails: statusDetails || undefined
      };
      
      // If status is completed, set actual delivery date
      if (newStatus === PayoutStatus.COMPLETED) {
        updateData.actualDeliveryDate = new Date().toISOString();
      }
      
      await updatePayoutStatus(payout.id, updateData, userId);
      
      toast.success('Payout status updated successfully');
      setNewStatus('');
      setStatusDetails('');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update payout status');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PayoutStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case PayoutStatus.PROCESSING:
        return 'bg-amber-100 text-amber-800';
      case PayoutStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PayoutStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get method display name
  const getMethodDisplayName = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.BANK_TRANSFER:
        return 'Bank Transfer';
      case PayoutMethod.CASH_PICKUP:
        return 'Cash Pickup';
      case PayoutMethod.MOBILE_WALLET:
        return 'Mobile Wallet';
      case PayoutMethod.HOME_DELIVERY:
        return 'Home Delivery';
      case PayoutMethod.DEBIT_CARD:
        return 'Debit Card';
      default:
        return method;
    }
  };
  
  // Render metadata
  const renderMetadata = (metadata: Record<string, any> | undefined) => {
    if (!metadata) return null;
    
    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="col-span-2 md:col-span-1">
            <span className="text-muted-foreground">{key}: </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {!payout ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No payout selected</h3>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Payout Details: {payout.transactionId}</span>
                <Badge className={getStatusBadgeColor(payout.status)}>
                  {payout.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {payout.partnerReference && (
                  <span>Partner Reference: {payout.partnerReference}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender & Receiver */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Sender</h3>
                  </div>
                  <div className="text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {payout.senderName}</p>
                    <p><span className="text-muted-foreground">ID:</span> {payout.senderId}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Receiver</h3>
                  </div>
                  <div className="text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {payout.receiverName}</p>
                    <p><span className="text-muted-foreground">ID:</span> {payout.receiverId}</p>
                  </div>
                </div>
              </div>
              
              {/* Partner & Amount */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Partner</h3>
                  </div>
                  <div className="text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {payout.partnerName}</p>
                    <p><span className="text-muted-foreground">ID:</span> {payout.partnerId}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Amount</h3>
                  </div>
                  <div className="text-sm">
                    <p className="text-lg font-bold">{payout.amount.toLocaleString()} {payout.currency}</p>
                    <p><span className="text-muted-foreground">Fee:</span> {payout.fee.toLocaleString()} {payout.currency}</p>
                    {payout.exchangeRate && (
                      <p><span className="text-muted-foreground">Exchange Rate:</span> {payout.exchangeRate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Delivery Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Method</h3>
                  </div>
                  <p className="text-sm">{getMethodDisplayName(payout.method)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Expected Delivery</h3>
                  </div>
                  <p className="text-sm">{formatDate(payout.expectedDeliveryDate)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Actual Delivery</h3>
                  </div>
                  <p className="text-sm">{formatDate(payout.actualDeliveryDate)}</p>
                </div>
              </div>
            </div>
            
            {/* Status Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Status Details</h3>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Details</h3>
                </div>
                <p className="text-sm">{payout.statusDetails || 'No status details available'}</p>
              </div>
              
              {payout.notes && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Notes</h3>
                  </div>
                  <p className="text-sm">{payout.notes}</p>
                </div>
              )}
            </div>
            
            {/* Metadata */}
            {payout.metadata && Object.keys(payout.metadata).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Additional Information</h3>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  {renderMetadata(payout.metadata)}
                </div>
              </div>
            )}
            
            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
              <div>
                <span>Created: </span>
                <span>{formatDate(payout.createdAt)}</span>
              </div>
              <div>
                <span>Last Updated: </span>
                <span>{formatDate(payout.updatedAt)}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Status Update */}
            <div className="space-y-4">
              <h3 className="font-medium">Update Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PayoutStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={PayoutStatus.PROCESSING}>Processing</SelectItem>
                      <SelectItem value={PayoutStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={PayoutStatus.FAILED}>Failed</SelectItem>
                      <SelectItem value={PayoutStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Textarea 
                    placeholder="Status details (optional)" 
                    value={statusDetails}
                    onChange={(e) => setStatusDetails(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={!newStatus || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
