'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TransactionData {
  date: string;
  amount: number;
  count: number;
  type?: string;
  currency?: string;
}

interface TransactionVolumeChartProps {
  data: TransactionData[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          Volume: <span className="font-medium">{formatCurrency(payload[0].value as number, 'USD')}</span>
        </p>
        {payload[1] && (
          <p className="text-sm">
            Count: <span className="font-medium">{payload[1].value}</span> transactions
          </p>
        )}
      </div>
    );
  }

  return null;
};

export function TransactionVolumeChart({ data, title = 'Transaction Volume' }: TransactionVolumeChartProps) {
  const [chartType, setChartType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [displayMetric, setDisplayMetric] = useState<'amount' | 'count'>('amount');
  
  // Group data based on selected chart type
  const groupedData = data.reduce((acc, item) => {
    let key = item.date;
    
    if (chartType === 'weekly') {
      // Extract week number from date
      const date = new Date(item.date);
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      key = `Week ${weekNumber}`;
    } else if (chartType === 'monthly') {
      // Extract month from date
      const date = new Date(item.date);
      key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }
    
    if (!acc[key]) {
      acc[key] = {
        date: key,
        amount: 0,
        count: 0
      };
    }
    
    acc[key].amount += item.amount;
    acc[key].count += item.count;
    
    return acc;
  }, {} as Record<string, TransactionData>);
  
  const chartData = Object.values(groupedData).sort((a, b) => {
    // Sort by date
    if (chartType === 'daily') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    // For weekly and monthly, sort by the label
    return a.date.localeCompare(b.date);
  });
  
  // Calculate chart height based on data points
  const chartHeight = Math.max(300, Math.min(500, chartData.length * 40));
  
  // Format y-axis ticks for currency
  const formatYAxis = (value: number) => {
    if (displayMetric === 'amount') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value}`;
    }
    return value;
  };
  
  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="chart-type" className="text-sm">View</Label>
            <Select
              value={chartType}
              onValueChange={(value) => setChartType(value as 'daily' | 'weekly' | 'monthly')}
            >
              <SelectTrigger id="chart-type" className="h-8 w-[110px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="display-metric" className="text-sm">Metric</Label>
            <Select
              value={displayMetric}
              onValueChange={(value) => setDisplayMetric(value as 'amount' | 'count')}
            >
              <SelectTrigger id="display-metric" className="h-8 w-[110px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">Volume</SelectItem>
                <SelectItem value="count">Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end"
                height={70}
                tickMargin={20}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey={displayMetric} 
                name={displayMetric === 'amount' ? 'Volume' : 'Transaction Count'} 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
