'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Loader2 } from 'lucide-react';

// Types
interface KycStatusData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyVerificationData {
  month: string;
  completed: number;
  pending: number;
  rejected: number;
}

interface KycVerificationTabProps {
  isLoading: boolean;
  kycStatusData: KycStatusData[];
  monthlyVerificationData: MonthlyVerificationData[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const PieCustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total || 1;
    const percentage = ((data.value / total) * 100).toFixed(1);
    
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          Count: <span className="font-medium">{data.value}</span> clients
        </p>
        <p className="text-sm">
          Percentage: <span className="font-medium">{percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function KycVerificationTab({ 
  isLoading, 
  kycStatusData, 
  monthlyVerificationData 
}: KycVerificationTabProps) {
  // Calculate total for percentage
  const total = kycStatusData.reduce((sum, item) => sum + item.value, 0);
  
  // Add total to each item for percentage calculation in tooltip
  const kycDataWithTotal = kycStatusData.map(item => ({
    ...item,
    total
  }));
  
  // Custom legend renderer for pie chart
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Status Pie Chart */}
        <Card className="card-ios">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">KYC Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kycDataWithTotal}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {kycDataWithTotal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieCustomTooltip />} />
                    <Legend content={renderLegend} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Monthly Verification Trend */}
        <Card className="card-ios">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Verification Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyVerificationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" />
                    <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* KYC Metrics Table */}
      <Card className="card-ios">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">KYC Verification Metrics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[100px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Count</th>
                    <th className="text-right py-3 px-4">Percentage</th>
                    <th className="text-right py-3 px-4">Change (vs. prev. period)</th>
                  </tr>
                </thead>
                <tbody>
                  {kycStatusData.map((status) => (
                    <tr key={status.name} className="border-b">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: status.color }}
                          />
                          {status.name}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">{status.value.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        {((status.value / total) * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className={
                          status.name === 'Verified' ? 'text-green-600' : 
                          status.name === 'Rejected' ? 'text-red-600' : 
                          'text-yellow-600'
                        }>
                          {status.name === 'Verified' ? '+5.2%' : 
                           status.name === 'Pending' ? '-2.1%' : 
                           status.name === 'Rejected' ? '+0.8%' : 
                           status.name === 'Expired' ? '-0.5%' : 
                           '+1.2%'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="text-right py-3 px-4">{total.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">100%</td>
                    <td className="text-right py-3 px-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
