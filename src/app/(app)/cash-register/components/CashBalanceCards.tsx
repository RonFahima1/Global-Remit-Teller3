'use client';

import React from 'react';
import { useCashRegister } from '@/context/CashRegisterContext';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export function CashBalanceCards() {
  const { state, selectCurrency } = useCashRegister();

  // Format the last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {state.balances.map((balance, index) => (
        <motion.div
          key={balance.currency}
          className={cn(
            'rounded-2xl p-6 bg-white/80 dark:bg-white/10 shadow flex flex-col items-center gap-2 border border-white/40 dark:border-white/10 cursor-pointer transition-all',
            state.selectedCurrency === balance.currency && 'ring-2 ring-blue-400'
          )}
          onClick={() => selectCurrency(balance.currency)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: index * 0.1 }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
          <div className="text-lg font-semibold">{balance.currency}</div>
          <div className="text-2xl font-bold">{balance.amount.toLocaleString()} {balance.currency}</div>
          <div className="text-xs text-gray-400">Cash on Hand</div>
          <div className="text-xs text-gray-400 mt-2">
            Last updated: {formatLastUpdated(balance.lastUpdated)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
