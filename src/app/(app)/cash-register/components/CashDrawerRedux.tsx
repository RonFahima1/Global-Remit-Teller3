/**
 * Cash Drawer Component (Redux Version)
 * Manages cash drawer operations using Redux state
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  DollarSign, 
  Euro, 
  CircleDollarSign, 
  BadgeDollarSign,
  Lock, 
  Unlock
} from 'lucide-react';
import { 
  useCashRegister 
} from '@/lib/redux/hooks';
import { 
  openCashRegister,
  closeCashRegister,
  addCashOperation,
  CashOperationType
} from '@/lib/redux/slices/cash-register-slice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useFinancialOperationsService } from '@/components/providers/service-provider';
import { toast } from 'sonner';

/**
 * Cash Drawer Component
 */
export function CashDrawerRedux() {
  const dispatch = useAppDispatch();
  const { 
    isOpen, 
    balances, 
    openedAt, 
    openedBy, 
    getBalance, 
    isLoading, 
    error 
  } = useCashRegister();
  const financialOperationsService = useFinancialOperationsService();
  
  const [activeTab, setActiveTab] = useState('usd');
  const [countedAmounts, setCountedAmounts] = useState<Record<string, Record<string, number>>>({
    usd: {
      '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '1': 0,
      'quarter': 0, 'dime': 0, 'nickel': 0, 'penny': 0
    },
    eur: {
      '500': 0, '200': 0, '100': 0, '50': 0, '20': 0, '10': 0, '5': 0,
      '2': 0, '1': 0, '0.5': 0, '0.2': 0, '0.1': 0, '0.05': 0, '0.02': 0, '0.01': 0
    },
    ils: {
      '200': 0, '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '2': 0, '1': 0, '0.5': 0, '0.1': 0
    }
  });

  // Calculate total for a specific currency based on counted amounts
  const calculateTotal = (currency: string) => {
    const denominations = countedAmounts[currency.toLowerCase()];
    let total = 0;
    
    if (denominations) {
      Object.entries(denominations).forEach(([denom, count]) => {
        total += parseFloat(denom) * count;
      });
    }
    
    return total;
  };

  // Handle opening the cash drawer
  const handleOpenDrawer = async () => {
    try {
      // Get initial balances for each currency
      const initialBalances = [
        { currency: 'USD', amount: calculateTotal('usd'), lastUpdated: new Date().toISOString() },
        { currency: 'EUR', amount: calculateTotal('eur'), lastUpdated: new Date().toISOString() },
        { currency: 'ILS', amount: calculateTotal('ils'), lastUpdated: new Date().toISOString() }
      ];
      
      // Only include currencies with non-zero amounts
      const filteredBalances = initialBalances.filter(balance => balance.amount > 0);
      
      if (filteredBalances.length === 0) {
        toast.error('Please enter at least one currency amount');
        return;
      }
      
      // Open cash register in Redux
      dispatch(openCashRegister({
        userId: 'current-user', // In a real app, get from auth
        timestamp: new Date().toISOString(),
        initialBalances: filteredBalances
      }));
      
      // Call service to open cash register
      await financialOperationsService.openCashRegister({
        amount: filteredBalances.reduce((total, balance) => total + balance.amount, 0),
        currency: filteredBalances[0].currency, // Primary currency
        description: 'Cash drawer opened with initial count'
      });
      
      toast.success('Cash drawer opened successfully');
    } catch (error) {
      toast.error('Failed to open cash drawer');
      console.error(error);
    }
  };

  // Handle closing the cash drawer
  const handleCloseDrawer = async () => {
    try {
      // Get final balances for each currency
      const finalBalances = [
        { currency: 'USD', amount: calculateTotal('usd'), lastUpdated: new Date().toISOString() },
        { currency: 'EUR', amount: calculateTotal('eur'), lastUpdated: new Date().toISOString() },
        { currency: 'ILS', amount: calculateTotal('ils'), lastUpdated: new Date().toISOString() }
      ];
      
      // Only include currencies with non-zero amounts
      const filteredBalances = finalBalances.filter(balance => balance.amount > 0);
      
      if (filteredBalances.length === 0) {
        toast.error('Please enter at least one currency amount');
        return;
      }
      
      // Close cash register in Redux
      dispatch(closeCashRegister());
      
      // Call service to close cash register
      await financialOperationsService.closeCashRegister({
        amount: filteredBalances.reduce((total, balance) => total + balance.amount, 0),
        currency: filteredBalances[0].currency, // Primary currency
        description: 'Cash drawer closed with final count'
      });
      
      toast.success('Cash drawer closed successfully');
    } catch (error) {
      toast.error('Failed to close cash drawer');
      console.error(error);
    }
  };

  // Handle reconciliation (adjustment)
  const handleReconcile = async () => {
    try {
      const currency = activeTab.toUpperCase();
      const countedAmount = calculateTotal(activeTab);
      const currentAmount = getBalance(currency);
      
      if (countedAmount === currentAmount) {
        toast.success(`${currency} drawer is balanced`);
        return;
      }
      
      // Create adjustment operation
      const adjustmentOperation = {
        id: `op-${Date.now()}`,
        type: CashOperationType.ADJUSTMENT,
        amount: countedAmount,
        currency,
        timestamp: new Date().toISOString(),
        userId: 'current-user', // In a real app, get from auth
        notes: `Reconciliation adjustment from ${currentAmount} to ${countedAmount}`,
        reference: `RECON-${Date.now()}`
      };
      
      // Update Redux state
      dispatch(addCashOperation(adjustmentOperation));
      
      toast.success(`${currency} drawer reconciled successfully`);
    } catch (error) {
      toast.error('Failed to reconcile cash drawer');
      console.error(error);
    }
  };

  // Handle denomination count change
  const handleCountChange = (currency: string, denomination: string, count: number) => {
    setCountedAmounts(prev => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [denomination]: count
      }
    }));
  };

  // Render denomination input for a specific currency
  const renderDenominationInputs = (currency: string) => {
    const denominations = countedAmounts[currency];
    const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : '₪';
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(denominations).map(([denom, count]) => (
          <div key={`${currency}-${denom}`} className="flex flex-col space-y-1">
            <label className="text-sm font-medium">{currencySymbol}{denom}</label>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                value={count}
                onChange={(e) => handleCountChange(currency, denom, parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-md"
              />
              <span className="ml-2 text-sm text-gray-500">
                {parseFloat(denom) * count > 0 && `${currencySymbol}${(parseFloat(denom) * count).toFixed(2)}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Cash Drawer</CardTitle>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <Button 
              variant="destructive" 
              onClick={handleCloseDrawer}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Close Drawer
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleOpenDrawer}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Unlock className="h-4 w-4" />
              Open Drawer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drawer Status */}
        <div className={`p-4 rounded-lg ${isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex items-center gap-2">
            {isOpen ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            <span className="font-medium">
              {isOpen ? 'Drawer is open' : 'Drawer is closed'}
            </span>
          </div>
          {isOpen && openedAt && (
            <div className="text-sm mt-1">
              Opened at: {new Date(openedAt).toLocaleString()}
            </div>
          )}
        </div>

        {/* Currency Tabs */}
        <Tabs defaultValue="usd" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="usd" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>USD</span>
            </TabsTrigger>
            <TabsTrigger value="eur" className="flex items-center gap-1">
              <Euro className="h-4 w-4" />
              <span>EUR</span>
            </TabsTrigger>
            <TabsTrigger value="ils" className="flex items-center gap-1">
              <CircleDollarSign className="h-4 w-4" />
              <span>ILS</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="usd" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Count USD</h3>
              <div className="text-lg font-semibold">${calculateTotal('usd').toFixed(2)}</div>
            </div>
            {renderDenominationInputs('usd')}
          </TabsContent>
          
          <TabsContent value="eur" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Count EUR</h3>
              <div className="text-lg font-semibold">€{calculateTotal('eur').toFixed(2)}</div>
            </div>
            {renderDenominationInputs('eur')}
          </TabsContent>
          
          <TabsContent value="ils" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Count ILS</h3>
              <div className="text-lg font-semibold">₪{calculateTotal('ils').toFixed(2)}</div>
            </div>
            {renderDenominationInputs('ils')}
          </TabsContent>
        </Tabs>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Button 
            className="flex-1 h-12" 
            variant="outline"
            onClick={handleReconcile}
            disabled={!isOpen || isLoading}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Reconcile
          </Button>
          <Button 
            className="flex-1 h-12" 
            variant="outline"
            onClick={() => {
              // Reset counted amounts to match current balances
              const usdBalance = getBalance('USD');
              const eurBalance = getBalance('EUR');
              const ilsBalance = getBalance('ILS');
              
              toast.info('Count reset to current balances');
              
              // This is a simplified reset - in a real app, you'd distribute
              // the amounts across denominations more intelligently
              setCountedAmounts({
                usd: { ...countedAmounts.usd, '100': Math.floor(usdBalance / 100) },
                eur: { ...countedAmounts.eur, '100': Math.floor(eurBalance / 100) },
                ils: { ...countedAmounts.ils, '100': Math.floor(ilsBalance / 100) }
              });
            }}
            disabled={!isOpen || isLoading}
          >
            <BadgeDollarSign className="h-5 w-5 mr-2" />
            Reset Count
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
