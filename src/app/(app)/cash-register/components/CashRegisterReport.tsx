'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCashRegister } from '@/context/CashRegisterContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Printer, RefreshCw } from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export function CashRegisterReport() {
  const { state } = useCashRegister();
  const [activeTab, setActiveTab] = useState('summary');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>(state.selectedCurrency);

  // Filter transactions based on date range and currency
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(txn => {
      // Filter by currency
      if (txn.currency !== selectedCurrency) return false;
      
      // Filter by date range
      if (dateRange?.from && dateRange?.to) {
        const txnDate = new Date(txn.date);
        return isWithinInterval(txnDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to)
        });
      }
      
      return true;
    });
  }, [state.transactions, dateRange, selectedCurrency]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const totalIn = filteredTransactions
      .filter(txn => txn.type === 'add')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    const totalOut = filteredTransactions
      .filter(txn => txn.type === 'remove')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    const netChange = totalIn - totalOut;
    
    const reconciliations = filteredTransactions
      .filter(txn => txn.description.includes('Reconciliation'))
      .length;
    
    return {
      totalIn,
      totalOut,
      netChange,
      transactionCount: filteredTransactions.length,
      reconciliations
    };
  }, [filteredTransactions]);

  // Prepare chart data for daily transactions
  const dailyChartData = useMemo(() => {
    const dailyData: Record<string, { date: string, cashIn: number, cashOut: number }> = {};
    
    if (dateRange?.from && dateRange?.to) {
      // Initialize all dates in range
      let currentDate = new Date(dateRange.from);
      while (currentDate <= dateRange.to) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        dailyData[dateKey] = {
          date: format(currentDate, 'MMM d'),
          cashIn: 0,
          cashOut: 0
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Populate with actual data
    filteredTransactions.forEach(txn => {
      const txnDate = new Date(txn.date);
      const dateKey = format(txnDate, 'yyyy-MM-dd');
      
      if (dailyData[dateKey]) {
        if (txn.type === 'add') {
          dailyData[dateKey].cashIn += txn.amount;
        } else {
          dailyData[dateKey].cashOut += txn.amount;
        }
      }
    });
    
    return Object.values(dailyData);
  }, [filteredTransactions, dateRange]);

  // Prepare pie chart data for transaction types
  const transactionTypeData = useMemo(() => {
    const typeData: { name: string; value: number; color: string }[] = [];
    
    // Count transaction types
    const typeCounts: Record<string, number> = {};
    filteredTransactions.forEach(txn => {
      const type = txn.description;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    // Convert to chart format
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    Object.entries(typeCounts).forEach(([type, count], index) => {
      typeData.push({
        name: type,
        value: count,
        color: colors[index % colors.length]
      });
    });
    
    return typeData;
  }, [filteredTransactions]);

  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Cash Register Report</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {state.balances.map(balance => (
                  <SelectItem key={balance.currency} value={balance.currency}>
                    {balance.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              align="start"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="daily">Daily Transactions</TabsTrigger>
            <TabsTrigger value="types">Transaction Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Cash In</div>
                    <div className="text-2xl font-bold text-green-600">
                      +{summaryData.totalIn.toLocaleString()} {selectedCurrency}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Cash Out</div>
                    <div className="text-2xl font-bold text-red-600">
                      -{summaryData.totalOut.toLocaleString()} {selectedCurrency}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Net Change</div>
                    <div className={`text-2xl font-bold ${
                      summaryData.netChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summaryData.netChange >= 0 ? '+' : ''}
                      {summaryData.netChange.toLocaleString()} {selectedCurrency}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Total Transactions</div>
                    <div className="text-2xl font-bold">
                      {summaryData.transactionCount}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Reconciliations</div>
                    <div className="text-2xl font-bold">
                      {summaryData.reconciliations}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium mb-3">Recent Transactions</h3>
              <div className="space-y-3">
                {filteredTransactions.slice(0, 5).map(txn => (
                  <div key={txn.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{txn.description}</div>
                      <div className="text-xs text-gray-500">{format(new Date(txn.date), 'MMM d, yyyy h:mm a')}</div>
                    </div>
                    <div className={`font-medium ${
                      txn.type === 'add' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'add' ? '+' : '-'}
                      {txn.amount.toLocaleString()} {txn.currency}
                    </div>
                  </div>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No transactions found for the selected period
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="daily">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} ${selectedCurrency}`, '']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="cashIn" name="Cash In" fill="#4ade80" />
                  <Bar dataKey="cashOut" name="Cash Out" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {dailyChartData.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No data available for the selected period
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="types">
            <div className="h-80">
              {transactionTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} transactions`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No data available for the selected period
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              {transactionTypeData.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <div className="text-sm">{type.name}: {type.value} transactions</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
