/**
 * Transaction Summary Component
 * Displays key transaction metrics and summaries for the dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Users,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useDashboardService, useTransactionService } from '@/components/providers/service-provider';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

// Types
interface TransactionMetric {
  label: string;
  value: number;
  change: number;
  currency?: string;
  isPercentage?: boolean;
  isPositiveGood?: boolean;
}

interface TransactionSummaryData {
  totalTransactions: TransactionMetric;
  totalVolume: TransactionMetric;
  averageAmount: TransactionMetric;
  newClients: TransactionMetric;
  successRate: TransactionMetric;
  topCurrencies: {
    currency: string;
    volume: number;
    transactions: number;
  }[];
  recentActivity: {
    id: string;
    type: 'send' | 'receive' | 'exchange' | 'deposit' | 'withdrawal';
    amount: number;
    currency: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'failed';
    clientName: string;
  }[];
}

/**
 * Transaction Summary Component
 */
export function TransactionSummary() {
  const dashboardService = useDashboardService();
  const transactionService = useTransactionService();
  
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [summaryData, setSummaryData] = useState<TransactionSummaryData | null>(null);
  
  // Fetch summary data when timeframe changes
  useEffect(() => {
    fetchSummaryData();
  }, [timeframe]);
  
  // Fetch summary data from service
  const fetchSummaryData = async () => {
    try {
      setIsLoading(true);
      
      // Use mock data in development
      const { getMockTransactionSummary } = await import('@/lib/mock-data');
      const response = getMockTransactionSummary(timeframe);
      setSummaryData(response);
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      toast.error('Failed to fetch transaction summary');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchSummaryData();
  };
  
  // Render change indicator
  const renderChangeIndicator = (change: number, isPositiveGood: boolean = true) => {
    const isPositive = change > 0;
    const isNeutral = change === 0;
    
    // Determine color based on whether positive is good
    const color = isNeutral
      ? 'text-gray-500'
      : isPositive
        ? isPositiveGood ? 'text-green-500' : 'text-red-500'
        : isPositiveGood ? 'text-red-500' : 'text-green-500';
    
    return (
      <div className={`flex items-center ${color}`}>
        {isNeutral ? (
          <span className="text-xs">No change</span>
        ) : isPositive ? (
          <>
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span className="text-xs">{change}%</span>
          </>
        ) : (
          <>
            <ArrowDownRight className="mr-1 h-3 w-3" />
            <span className="text-xs">{Math.abs(change)}%</span>
          </>
        )}
      </div>
    );
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'receive':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'exchange':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };
  
  if (isLoading && !summaryData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Loading transaction metrics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Overview of transaction activity</CardDescription>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
            <TabsList className="grid grid-cols-3 w-[200px]">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {summaryData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Transactions */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <p className="text-2xl font-bold">{summaryData.totalTransactions.value}</p>
                      {renderChangeIndicator(summaryData.totalTransactions.change)}
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Volume */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(summaryData.totalVolume.value, summaryData.totalVolume.currency || 'USD')}
                      </p>
                      {renderChangeIndicator(summaryData.totalVolume.change)}
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* New Clients */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">New Clients</p>
                      <p className="text-2xl font-bold">{summaryData.newClients.value}</p>
                      {renderChangeIndicator(summaryData.newClients.change)}
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Currencies */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Top Currencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summaryData.topCurrencies.map((currency) => (
                      <div key={currency.currency} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-2">
                            <span className="text-xs font-bold">{currency.currency}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{currency.currency}</p>
                            <p className="text-xs text-muted-foreground">{currency.transactions} transactions</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(currency.volume, currency.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summaryData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-2">
                            {getTransactionTypeIcon(activity.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.clientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-medium">
                            {formatCurrency(activity.amount, activity.currency)}
                          </p>
                          {getStatusBadge(activity.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Additional Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Average Amount */}
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">Average Amount</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(summaryData.averageAmount.value, summaryData.averageAmount.currency || 'USD')}
                      </p>
                      {renderChangeIndicator(summaryData.averageAmount.change)}
                    </div>
                    
                    {/* Success Rate */}
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-lg font-bold">{summaryData.successRate.value}%</p>
                      {renderChangeIndicator(summaryData.successRate.change)}
                    </div>
                    
                    {/* Time Period */}
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">Time Period</p>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {timeframe === 'daily' && 'Today'}
                          {timeframe === 'weekly' && 'This Week'}
                          {timeframe === 'monthly' && 'This Month'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/transfer-history'}>
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
}
