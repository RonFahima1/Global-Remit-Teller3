'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCashRegister } from '@/context/CashRegisterContext';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Calculator } from 'lucide-react';
import { toast } from 'sonner';

// Define denomination types for different currencies
const DENOMINATIONS = {
  USD: [
    { value: 100, type: 'bill', label: '$100' },
    { value: 50, type: 'bill', label: '$50' },
    { value: 20, type: 'bill', label: '$20' },
    { value: 10, type: 'bill', label: '$10' },
    { value: 5, type: 'bill', label: '$5' },
    { value: 1, type: 'bill', label: '$1' },
    { value: 0.25, type: 'coin', label: '25¢' },
    { value: 0.1, type: 'coin', label: '10¢' },
    { value: 0.05, type: 'coin', label: '5¢' },
    { value: 0.01, type: 'coin', label: '1¢' },
  ],
  EUR: [
    { value: 500, type: 'bill', label: '€500' },
    { value: 200, type: 'bill', label: '€200' },
    { value: 100, type: 'bill', label: '€100' },
    { value: 50, type: 'bill', label: '€50' },
    { value: 20, type: 'bill', label: '€20' },
    { value: 10, type: 'bill', label: '€10' },
    { value: 5, type: 'bill', label: '€5' },
    { value: 2, type: 'coin', label: '€2' },
    { value: 1, type: 'coin', label: '€1' },
    { value: 0.5, type: 'coin', label: '50¢' },
    { value: 0.2, type: 'coin', label: '20¢' },
    { value: 0.1, type: 'coin', label: '10¢' },
    { value: 0.05, type: 'coin', label: '5¢' },
    { value: 0.02, type: 'coin', label: '2¢' },
    { value: 0.01, type: 'coin', label: '1¢' },
  ],
  ILS: [
    { value: 200, type: 'bill', label: '₪200' },
    { value: 100, type: 'bill', label: '₪100' },
    { value: 50, type: 'bill', label: '₪50' },
    { value: 20, type: 'bill', label: '₪20' },
    { value: 10, type: 'coin', label: '₪10' },
    { value: 5, type: 'coin', label: '₪5' },
    { value: 2, type: 'coin', label: '₪2' },
    { value: 1, type: 'coin', label: '₪1' },
    { value: 0.5, type: 'coin', label: '50 agorot' },
    { value: 0.1, type: 'coin', label: '10 agorot' },
  ],
};

interface DenominationCount {
  [key: string]: number;
}

export function CashDrawer() {
  const { state, reconcileCash } = useCashRegister();
  const [counts, setCounts] = useState<DenominationCount>({});
  const [total, setTotal] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Get denominations for the selected currency
  const denominations = DENOMINATIONS[state.selectedCurrency as keyof typeof DENOMINATIONS] || DENOMINATIONS.USD;

  // Handle count change
  const handleCountChange = (denomination: string, count: string) => {
    const countValue = count === '' ? 0 : parseInt(count, 10);
    if (isNaN(countValue) || countValue < 0) return;

    const newCounts = { ...counts, [denomination]: countValue };
    setCounts(newCounts);

    // Calculate total
    let newTotal = 0;
    denominations.forEach(denom => {
      const denomKey = `${denom.value}-${denom.type}`;
      const count = newCounts[denomKey] || 0;
      newTotal += denom.value * count;
    });
    setTotal(newTotal);
  };

  // Reset counts
  const resetCounts = () => {
    setCounts({});
    setTotal(0);
  };

  // Save counts and reconcile cash
  const saveCounts = () => {
    try {
      reconcileCash(total, state.selectedCurrency);
      toast.success('Cash drawer reconciled successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to reconcile cash drawer');
      console.error(error);
    }
  };

  // Get current balance for the selected currency
  const currentBalance = state.balances.find(b => b.currency === state.selectedCurrency)?.amount || 0;

  // Calculate difference
  const difference = total - currentBalance;

  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Cash Drawer</CardTitle>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={resetCounts}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={saveCounts}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Calculator className="h-4 w-4 mr-2" />
              Count Cash
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bills */}
              <div>
                <h3 className="text-sm font-medium mb-3">Bills</h3>
                <div className="space-y-3">
                  {denominations
                    .filter(d => d.type === 'bill')
                    .map(denom => {
                      const denomKey = `${denom.value}-${denom.type}`;
                      return (
                        <div key={denomKey} className="flex items-center gap-3">
                          <div className="w-16 text-sm">{denom.label}</div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              value={counts[denomKey] || ''}
                              onChange={e => handleCountChange(denomKey, e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="w-24 text-right text-sm">
                            {((counts[denomKey] || 0) * denom.value).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Coins */}
              <div>
                <h3 className="text-sm font-medium mb-3">Coins</h3>
                <div className="space-y-3">
                  {denominations
                    .filter(d => d.type === 'coin')
                    .map(denom => {
                      const denomKey = `${denom.value}-${denom.type}`;
                      return (
                        <div key={denomKey} className="flex items-center gap-3">
                          <div className="w-16 text-sm">{denom.label}</div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              value={counts[denomKey] || ''}
                              onChange={e => handleCountChange(denomKey, e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="w-24 text-right text-sm">
                            {((counts[denomKey] || 0) * denom.value).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">System Balance:</span>
                <span className="font-medium">{currentBalance.toFixed(2)} {state.selectedCurrency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Counted Total:</span>
                <span className="font-medium">{total.toFixed(2)} {state.selectedCurrency}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium">Difference:</span>
                <span className={`font-medium ${
                  difference === 0 
                    ? 'text-green-600' 
                    : difference > 0 
                      ? 'text-blue-600' 
                      : 'text-red-600'
                }`}>
                  {difference > 0 ? '+' : ''}
                  {difference.toFixed(2)} {state.selectedCurrency}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-500 mb-2">Current Cash Balance</p>
              <p className="text-2xl font-bold">{currentBalance.toFixed(2)} {state.selectedCurrency}</p>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              Click "Count Cash" to perform a cash drawer count and reconciliation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
