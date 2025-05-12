'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, DollarSign, Repeat } from 'lucide-react';

interface KpiData {
  totalVolume: number;
  transactionCount: number;
  averageTransactionSize: number;
  activeClients: number;
  volumeChangePercent: number;
  countChangePercent: number;
  clientsChangePercent: number;
  currency: string;
}

interface KpiCardsProps {
  data: KpiData;
}

export function KpiCards({ data }: KpiCardsProps) {
  const formatPercentage = (value: number) => {
    const formattedValue = Math.abs(value).toFixed(1);
    return `${value >= 0 ? '+' : '-'}${formattedValue}%`;
  };
  
  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };
  
  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Volume */}
      <Card className="card-ios">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-blue-100 p-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              <span className={getChangeColor(data.volumeChangePercent)}>
                {formatPercentage(data.volumeChangePercent)}
              </span>
              {getChangeIcon(data.volumeChangePercent)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-2xl font-semibold mt-1">
              {formatCurrency(data.totalVolume, data.currency)}
            </p>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            vs. previous period
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Count */}
      <Card className="card-ios">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-purple-100 p-2">
              <Repeat className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex items-center gap-1">
              <span className={getChangeColor(data.countChangePercent)}>
                {formatPercentage(data.countChangePercent)}
              </span>
              {getChangeIcon(data.countChangePercent)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Transaction Count</p>
            <p className="text-2xl font-semibold mt-1">
              {data.transactionCount.toLocaleString()}
            </p>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            vs. previous period
          </div>
        </CardContent>
      </Card>
      
      {/* Average Transaction Size */}
      <Card className="card-ios">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1">
              <span className={getChangeColor(data.volumeChangePercent - data.countChangePercent)}>
                {formatPercentage(data.volumeChangePercent - data.countChangePercent)}
              </span>
              {getChangeIcon(data.volumeChangePercent - data.countChangePercent)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Average Transaction</p>
            <p className="text-2xl font-semibold mt-1">
              {formatCurrency(data.averageTransactionSize, data.currency)}
            </p>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            vs. previous period
          </div>
        </CardContent>
      </Card>
      
      {/* Active Clients */}
      <Card className="card-ios">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-orange-100 p-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex items-center gap-1">
              <span className={getChangeColor(data.clientsChangePercent)}>
                {formatPercentage(data.clientsChangePercent)}
              </span>
              {getChangeIcon(data.clientsChangePercent)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Active Clients</p>
            <p className="text-2xl font-semibold mt-1">
              {data.activeClients.toLocaleString()}
            </p>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            vs. previous period
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
