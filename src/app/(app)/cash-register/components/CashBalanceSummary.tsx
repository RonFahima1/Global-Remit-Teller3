/**
 * Cash Balance Summary Component
 * Displays a summary of cash balances by currency with visual indicators
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Euro, 
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCashRegister } from '@/lib/redux/hooks';
import { format } from 'date-fns';

/**
 * Cash Balance Summary Component
 */
export function CashBalanceSummary() {
  const { balances, isOpen } = useCashRegister();
  
  // Format amount with currency
  const formatAmount = (amount: number, currency: string) => {
    return amount.toLocaleString(undefined, { 
      style: 'currency', 
      currency, 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };
  
  // Get currency icon
  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD':
        return <DollarSign className="h-5 w-5" />;
      case 'EUR':
        return <Euro className="h-5 w-5" />;
      case 'ILS':
        return <CircleDollarSign className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };
  
  // Get trend icon based on amount change
  const getTrendIcon = (amount: number, prevAmount: number = 0) => {
    if (amount > prevAmount) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (amount < prevAmount) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Calculate total balance across all currencies
  const totalBalance = balances.reduce((total, balance) => {
    // This is a simplistic approach - in a real app, you'd convert to a base currency
    return total + balance.amount;
  }, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Balance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Balance */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Cash (All Currencies)</div>
          <div className="text-2xl font-bold mt-1">
            {formatAmount(totalBalance, 'USD')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isOpen ? 'Cash Register is Open' : 'Cash Register is Closed'}
          </div>
        </div>
        
        {/* Currency Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Currency Breakdown</h3>
          
          {balances.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No cash balances available
            </div>
          ) : (
            <div className="grid gap-4">
              {balances.map((balance, index) => (
                <motion.div
                  key={balance.currency}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getCurrencyIcon(balance.currency)}
                      <span className="font-medium">{balance.currency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(balance.amount)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-semibold">
                      {formatAmount(balance.amount, balance.currency)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last updated: {format(new Date(balance.lastUpdated), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-xs text-blue-600 dark:text-blue-400">Currencies</div>
            <div className="text-lg font-semibold mt-1">{balances.length}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-xs text-green-600 dark:text-green-400">Status</div>
            <div className="text-lg font-semibold mt-1">
              {isOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
