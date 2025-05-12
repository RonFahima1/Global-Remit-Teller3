/**
 * Cash Balance Component (Redux Version)
 * Displays current cash balances by currency using Redux state
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Euro, 
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { useCashRegister } from '@/lib/redux/hooks';
import { CashOperationType } from '@/lib/redux/slices/cash-register-slice';
import { formatCurrency } from '@/lib/utils';

/**
 * Cash Balance Component
 */
export function CashBalanceRedux() {
  const { balances, recentOperations, isOpen } = useCashRegister();
  
  // Calculate today's transactions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get operations for today
  const todayOperations = recentOperations.filter(op => 
    new Date(op.timestamp) >= today
  );
  
  // Calculate totals by currency and type
  const calculateTotals = (operations: typeof recentOperations) => {
    const totals: Record<string, { 
      deposits: number, 
      withdrawals: number, 
      adjustments: number,
      net: number
    }> = {};
    
    operations.forEach(op => {
      if (!totals[op.currency]) {
        totals[op.currency] = { 
          deposits: 0, 
          withdrawals: 0, 
          adjustments: 0,
          net: 0
        };
      }
      
      if (op.type === CashOperationType.DEPOSIT) {
        totals[op.currency].deposits += op.amount;
        totals[op.currency].net += op.amount;
      } else if (op.type === CashOperationType.WITHDRAWAL) {
        totals[op.currency].withdrawals += op.amount;
        totals[op.currency].net -= op.amount;
      } else if (op.type === CashOperationType.ADJUSTMENT) {
        // For adjustments, we need to calculate the difference
        // This is simplified - in a real app, you'd track the previous balance
        totals[op.currency].adjustments += op.amount;
      }
    });
    
    return totals;
  };
  
  const todayTotals = calculateTotals(todayOperations);
  
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cash Balances</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="balances" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balances">Current Balances</TabsTrigger>
            <TabsTrigger value="today">Today's Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balances" className="space-y-4 pt-4">
            {balances.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No balances available {!isOpen && '(Cash drawer is closed)'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {balances.map((balance) => (
                  <Card key={balance.currency} className="bg-card/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCurrencyIcon(balance.currency)}
                          <span className="font-medium">{balance.currency}</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(balance.amount, balance.currency)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last updated: {new Date(balance.lastUpdated).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="today" className="space-y-4 pt-4">
            {Object.keys(todayTotals).length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No transactions today
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(todayTotals).map(([currency, totals]) => (
                  <Card key={currency} className="bg-card/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCurrencyIcon(currency)}
                          <span className="font-medium">{currency}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="mr-1 h-4 w-4" />
                            <span>Deposits</span>
                          </div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(totals.deposits, currency)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-red-600">
                            <TrendingDown className="mr-1 h-4 w-4" />
                            <span>Withdrawals</span>
                          </div>
                          <div className="font-medium text-red-600">
                            {formatCurrency(totals.withdrawals, currency)}
                          </div>
                        </div>
                        
                        {totals.adjustments > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-blue-600">
                              <BarChart3 className="mr-1 h-4 w-4" />
                              <span>Adjustments</span>
                            </div>
                            <div className="font-medium text-blue-600">
                              {formatCurrency(totals.adjustments, currency)}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between font-bold">
                            <span>Net Change</span>
                            <span className={totals.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
