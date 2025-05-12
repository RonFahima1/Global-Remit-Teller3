'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CashTransaction } from '@/context/CashRegisterContext';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Printer, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionDetailsProps {
  transaction: CashTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetails({ transaction, isOpen, onClose }: TransactionDetailsProps) {
  const [copied, setCopied] = React.useState(false);

  // Handle copy transaction ID
  const copyTransactionId = () => {
    if (transaction) {
      navigator.clipboard.writeText(transaction.id);
      setCopied(true);
      toast.success('Transaction ID copied to clipboard');
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Transaction Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium">{transaction.description}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-sm text-gray-500">{transaction.id}</div>
                <button 
                  onClick={copyTransactionId}
                  className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
            <Badge 
              className={`${
                transaction.type === 'add' 
                  ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                  : 'bg-red-100 text-red-800 hover:bg-red-100'
              }`}
            >
              {transaction.type === 'add' ? 'Cash In' : 'Cash Out'}
            </Badge>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6"
          >
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Amount</div>
              <div className={`text-2xl font-bold ${
                transaction.type === 'add' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'add' ? '+' : '-'}
                {transaction.amount.toLocaleString()} {transaction.currency}
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Date & Time</div>
                <div className="font-medium">{formatDate(transaction.date)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div>
                  <Badge 
                    className={`${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Performed By</div>
                <div className="font-medium">{transaction.performedBy}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Reference Number</div>
                <div className="font-medium">{transaction.referenceNumber || 'N/A'}</div>
              </div>
            </div>
            
            {transaction.description && (
              <div>
                <div className="text-sm text-gray-500">Description</div>
                <div className="font-medium">{transaction.description}</div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
