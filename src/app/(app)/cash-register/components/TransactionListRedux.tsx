/**
 * Transaction List Component (Redux Version)
 * Displays cash register operations using Redux state
 */

'use client';

import React from 'react';
import { useCashRegister } from '@/lib/redux/hooks';
import { CashOperationType } from '@/lib/redux/slices/cash-register-slice';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Lock, 
  Unlock,
  Search,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Transaction List Component
 */
export function TransactionListRedux() {
  const { recentOperations } = useCashRegister();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filter operations based on search query
  const filteredOperations = searchQuery 
    ? recentOperations.filter(op => 
        op.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentOperations;

  // Get operation icon based on type
  const getOperationIcon = (type: CashOperationType) => {
    switch (type) {
      case CashOperationType.DEPOSIT:
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case CashOperationType.WITHDRAWAL:
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case CashOperationType.ADJUSTMENT:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case CashOperationType.OPEN:
        return <Unlock className="h-4 w-4 text-purple-500" />;
      case CashOperationType.CLOSE:
        return <Lock className="h-4 w-4 text-orange-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format operation amount with sign and currency
  const formatAmount = (operation: any) => {
    const { type, amount, currency } = operation;
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '';
    
    if (type === CashOperationType.DEPOSIT || type === CashOperationType.OPEN) {
      return `+${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (type === CashOperationType.WITHDRAWAL || type === CashOperationType.CLOSE) {
      return `-${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  // Get operation type label
  const getOperationTypeLabel = (type: CashOperationType) => {
    switch (type) {
      case CashOperationType.DEPOSIT:
        return 'Cash Deposit';
      case CashOperationType.WITHDRAWAL:
        return 'Cash Withdrawal';
      case CashOperationType.ADJUSTMENT:
        return 'Cash Adjustment';
      case CashOperationType.OPEN:
        return 'Drawer Opened';
      case CashOperationType.CLOSE:
        return 'Drawer Closed';
      default:
        return 'Operation';
    }
  };

  // Get operation class based on type
  const getOperationClass = (type: CashOperationType) => {
    switch (type) {
      case CashOperationType.DEPOSIT:
        return 'text-green-600';
      case CashOperationType.WITHDRAWAL:
        return 'text-red-600';
      case CashOperationType.ADJUSTMENT:
        return 'text-blue-600';
      case CashOperationType.OPEN:
        return 'text-purple-600';
      case CashOperationType.CLOSE:
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search transactions..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Transactions list */}
      <div className="space-y-2">
        {filteredOperations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No matching transactions found' : 'No transactions yet'}
          </div>
        ) : (
          filteredOperations.map((operation) => (
            <div 
              key={operation.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {getOperationIcon(operation.type)}
                </div>
                <div>
                  <div className="font-medium">{getOperationTypeLabel(operation.type)}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(operation.timestamp), 'MMM d, yyyy h:mm a')}
                    {operation.reference && ` • Ref: ${operation.reference}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`font-medium ${getOperationClass(operation.type)}`}>
                  {formatAmount(operation)}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Show more button */}
      {filteredOperations.length > 0 && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" className="w-full">
            View All Transactions
          </Button>
        </div>
      )}
    </div>
  );
}
