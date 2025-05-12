/**
 * Cash Balance Cards Component (Redux Version)
 * Displays cash balances using Redux state
 */

'use client';

import React from 'react';
import { useCashRegister } from '@/lib/redux/hooks';
import { DollarSign, Euro, CircleDollarSign, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Cash Balance Cards Component
 */
export function CashBalanceCardsRedux() {
  const { balances, isOpen } = useCashRegister();

  // Get specific currency balance
  const getBalance = (currency: string) => {
    const balance = balances.find(b => b.currency === currency);
    return balance ? balance.amount : 0;
  };

  // Format currency with symbol
  const formatCurrency = (amount: number, currency: string) => {
    switch (currency) {
      case 'USD':
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'EUR':
        return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'ILS':
        return `₪${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
    }
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* USD Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="font-medium">USD</span>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            US Dollar
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">
          {formatCurrency(getBalance('USD'), 'USD')}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isOpen ? 'Drawer open' : 'Drawer closed'}
        </div>
      </div>

      {/* EUR Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Euro className="h-5 w-5" />
            </div>
            <span className="font-medium">EUR</span>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            Euro
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">
          {formatCurrency(getBalance('EUR'), 'EUR')}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isOpen ? 'Drawer open' : 'Drawer closed'}
        </div>
      </div>

      {/* ILS Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <span className="font-medium">ILS</span>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
            Israeli Shekel
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">
          {formatCurrency(getBalance('ILS'), 'ILS')}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isOpen ? 'Drawer open' : 'Drawer closed'}
        </div>
      </div>
    </div>
  );
}
