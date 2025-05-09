'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RefreshCw, ChevronRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for cash balances and transactions
const cashBalances = [
  { currency: 'USD', amount: 3200.00 },
  { currency: 'EUR', amount: 1800.50 },
  { currency: 'ILS', amount: 9500.00 },
];

const cashTransactions = [
  {
    id: 'CASH1001',
    date: '2024-03-15T09:00:00',
    type: 'add',
    amount: 1000.00,
    currency: 'USD',
    description: 'Cash Deposit',
  },
  {
    id: 'CASH1002',
    date: '2024-03-14T16:30:00',
    type: 'remove',
    amount: 500.00,
    currency: 'EUR',
    description: 'Cash Withdrawal',
  },
  {
    id: 'CASH1003',
    date: '2024-03-13T11:15:00',
    type: 'add',
    amount: 2000.00,
    currency: 'ILS',
    description: 'Cash Adjustment',
  },
];

export default function CashRegisterPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash on Hand Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Cash Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cashBalances.map((cb) => (
                  <div
                    key={cb.currency}
                    className={cn(
                      'rounded-2xl p-6 bg-white/80 dark:bg-white/10 shadow flex flex-col items-center gap-2 border border-white/40 dark:border-white/10',
                      selectedCurrency === cb.currency && 'ring-2 ring-blue-400'
                    )}
                    onClick={() => setSelectedCurrency(cb.currency)}
                    style={{ cursor: 'pointer' }}
                  >
                    <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-lg font-semibold">{cb.currency}</div>
                    <div className="text-2xl font-bold">{cb.amount.toLocaleString()} {cb.currency}</div>
                    <div className="text-xs text-gray-400">Cash on Hand</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4 pt-2">
                <Button className="flex-1 h-12" variant="outline">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Cash
                </Button>
                <Button className="flex-1 h-12" variant="outline">
                  <Minus className="h-5 w-5 mr-2" />
                  Remove Cash
                </Button>
                <Button className="flex-1 h-12" variant="outline">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reconcile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Cash Transactions */}
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Cash Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashTransactions
                  .filter(txn => txn.currency === selectedCurrency)
                  .map((txn) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(txn.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={cn(
                          'font-medium',
                          txn.type === 'add' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {txn.type === 'add' ? '+' : '-'}
                          {txn.amount.toLocaleString()} {txn.currency}
                        </p>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                {cashTransactions.filter(txn => txn.currency === selectedCurrency).length === 0 && (
                  <div className="text-center text-gray-400 py-8">No transactions for this currency.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 