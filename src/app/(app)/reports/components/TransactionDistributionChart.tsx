'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip,
  TooltipProps
} from 'recharts';
import { formatCurrency } from '@/utils/format';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TransactionDistribution {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface TransactionDistributionChartProps {
  data: TransactionDistribution[];
  title?: string;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          Volume: <span className="font-medium">{formatCurrency(data.value, 'USD')}</span>
        </p>
        <p className="text-sm">
          Count: <span className="font-medium">{data.count}</span> transactions
        </p>
        <p className="text-sm">
          Percentage: <span className="font-medium">{payload[0].percent ? (payload[0].percent * 100).toFixed(1) : 0}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function TransactionDistributionChart({ 
  data, 
  title = 'Transaction Distribution' 
}: TransactionDistributionChartProps) {
  const [displayMetric, setDisplayMetric] = useState<'value' | 'count'>('value');
  
  // Create a copy of the data with the appropriate metric
  const chartData = data.map(item => ({
    ...item,
    displayValue: displayMetric === 'value' ? item.value : item.count
  }));
  
  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.displayValue, 0);
  
  // Custom legend renderer
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.displayValue / total) * 100).toFixed(1);
          return (
            <li key={`item-${index}`} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.value}</span>
              <span className="text-muted-foreground">({percentage}%)</span>
            </li>
          );
        })}
      </ul>
    );
  };
  
  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="display-metric" className="text-sm">Show</Label>
          <Select
            value={displayMetric}
            onValueChange={(value) => setDisplayMetric(value as 'value' | 'count')}
          >
            <SelectTrigger id="display-metric" className="h-8 w-[110px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">By Volume</SelectItem>
              <SelectItem value="count">By Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                dataKey="displayValue"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
