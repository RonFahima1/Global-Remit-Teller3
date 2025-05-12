'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { Loader2 } from 'lucide-react';

// Types
interface ClientData {
  id: string;
  name: string;
  transactions: number;
  volume: number;
  firstTransactionDate: string;
  lastTransactionDate: string;
  preferredCurrency: string;
  country: string;
  segment: string;
}

interface ClientSegment {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface ClientCountry {
  name: string;
  value: number;
  count: number;
}

interface ClientRetention {
  month: string;
  active: number;
  new: number;
  returning: number;
  churned: number;
}

interface ClientAnalyticsProps {
  period?: 'week' | 'month' | 'quarter' | 'year';
  onPeriodChange?: (period: 'week' | 'month' | 'quarter' | 'year') => void;
}

// Mock data
const mockClientSegments: ClientSegment[] = [
  { name: 'Regular', value: 120000, count: 450, color: '#2563eb' },
  { name: 'Premium', value: 85000, count: 120, color: '#8b5cf6' },
  { name: 'Business', value: 210000, count: 75, color: '#10b981' },
  { name: 'New', value: 35000, count: 180, color: '#f59e0b' },
  { name: 'Inactive', value: 5000, count: 95, color: '#6b7280' },
];

const mockClientCountries: ClientCountry[] = [
  { name: 'United States', value: 180000, count: 320 },
  { name: 'United Kingdom', value: 95000, count: 180 },
  { name: 'Germany', value: 75000, count: 120 },
  { name: 'France', value: 60000, count: 90 },
  { name: 'Spain', value: 45000, count: 70 },
  { name: 'Italy', value: 40000, count: 65 },
  { name: 'Other', value: 85000, count: 150 },
];

const mockClientRetention: ClientRetention[] = [
  { month: 'Jan', active: 800, new: 120, returning: 680, churned: 45 },
  { month: 'Feb', active: 830, new: 90, returning: 740, churned: 60 },
  { month: 'Mar', active: 860, new: 110, returning: 750, churned: 40 },
  { month: 'Apr', active: 890, new: 100, returning: 790, churned: 70 },
  { month: 'May', active: 920, new: 130, returning: 790, churned: 50 },
  { month: 'Jun', active: 960, new: 140, returning: 820, churned: 55 },
];

const mockClientActivity = [
  { name: '0-1', value: 250 },
  { name: '2-5', value: 320 },
  { name: '6-10', value: 180 },
  { name: '11-20', value: 120 },
  { name: '21+', value: 80 },
];

// Custom tooltip components
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('volume') || entry.name === 'value' 
              ? formatCurrency(entry.value as number, 'USD')
              : entry.value
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieCustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          Volume: <span className="font-medium">{formatCurrency(data.value, 'USD')}</span>
        </p>
        <p className="text-sm">
          Count: <span className="font-medium">{data.count}</span> clients
        </p>
        <p className="text-sm">
          Percentage: <span className="font-medium">{payload[0].percent ? (payload[0].percent * 100).toFixed(1) : 0}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ClientAnalytics({ period = 'month', onPeriodChange }: ClientAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('segments');
  const [isLoading, setIsLoading] = useState(true);
  const [segmentData, setSegmentData] = useState<ClientSegment[]>([]);
  const [countryData, setCountryData] = useState<ClientCountry[]>([]);
  const [retentionData, setRetentionData] = useState<ClientRetention[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  
  // Load data based on selected period
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // In a real app, this would fetch data from an API based on the period
      setSegmentData(mockClientSegments);
      setCountryData(mockClientCountries);
      setRetentionData(mockClientRetention);
      setActivityData(mockClientActivity);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [period]);
  
  // Handle period change
  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'quarter' | 'year') => {
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };
  
  // Calculate total values for percentages
  const totalVolume = segmentData.reduce((sum, segment) => sum + segment.value, 0);
  const totalClients = segmentData.reduce((sum, segment) => sum + segment.count, 0);
  
  // Custom legend renderer for pie chart
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / totalVolume) * 100).toFixed(1);
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client Analytics</h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={period === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('week')}
          >
            Week
          </Button>
          <Button 
            variant={period === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('month')}
          >
            Month
          </Button>
          <Button 
            variant={period === 'quarter' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('quarter')}
          >
            Quarter
          </Button>
          <Button 
            variant={period === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('year')}
          >
            Year
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        {/* Client Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segment Distribution Pie Chart */}
            <Card className="card-ios">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Client Segments by Volume</CardTitle>
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
                          data={segmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {segmentData.map((entry, index) => (
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
            
            {/* Segment Count Bar Chart */}
            <Card className="card-ios">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Client Count by Segment</CardTitle>
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
                        data={segmentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Clients" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Segment Metrics */}
          <Card className="card-ios">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Segment Metrics</CardTitle>
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
                        <th className="text-left py-3 px-4">Segment</th>
                        <th className="text-right py-3 px-4">Clients</th>
                        <th className="text-right py-3 px-4">% of Total</th>
                        <th className="text-right py-3 px-4">Volume</th>
                        <th className="text-right py-3 px-4">% of Volume</th>
                        <th className="text-right py-3 px-4">Avg. per Client</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentData.map((segment) => (
                        <tr key={segment.name} className="border-b">
                          <td className="py-3 px-4 font-medium">{segment.name}</td>
                          <td className="text-right py-3 px-4">{segment.count.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">
                            {((segment.count / totalClients) * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-3 px-4">{formatCurrency(segment.value, 'USD')}</td>
                          <td className="text-right py-3 px-4">
                            {((segment.value / totalVolume) * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatCurrency(segment.value / segment.count, 'USD')}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/50 font-medium">
                        <td className="py-3 px-4">Total</td>
                        <td className="text-right py-3 px-4">{totalClients.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">100%</td>
                        <td className="text-right py-3 px-4">{formatCurrency(totalVolume, 'USD')}</td>
                        <td className="text-right py-3 px-4">100%</td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(totalVolume / totalClients, 'USD')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Volume Bar Chart */}
            <Card className="card-ios">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Transaction Volume by Country</CardTitle>
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
                        data={countryData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Volume" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Country Client Count */}
            <Card className="card-ios">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Client Count by Country</CardTitle>
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
                        data={countryData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Clients" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <Card className="card-ios">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Client Retention</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={retentionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="active" name="Active Clients" stroke="#2563eb" strokeWidth={2} />
                      <Line type="monotone" dataKey="new" name="New Clients" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="returning" name="Returning Clients" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="churned" name="Churned Clients" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Retention Metrics */}
          <Card className="card-ios">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Retention Metrics</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[100px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Client Retention Rate</p>
                    <p className="text-2xl font-semibold mt-1">92.5%</p>
                    <p className="text-xs text-green-600 mt-1">+2.3% vs previous period</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Client Lifespan</p>
                    <p className="text-2xl font-semibold mt-1">3.2 years</p>
                    <p className="text-xs text-green-600 mt-1">+0.3 years vs previous period</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Client Acquisition Cost</p>
                    <p className="text-2xl font-semibold mt-1">$125.40</p>
                    <p className="text-xs text-red-600 mt-1">+$12.30 vs previous period</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Frequency */}
            <Card className="card-ios">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Transaction Frequency</CardTitle>
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
                        data={activityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" label={{ value: 'Transactions per Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Number of Clients', angle: -90, position: 'insideLeft' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Clients" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Activity Metrics */}
            <Card className="card-ios">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Activity Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Average Transactions per Client</p>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span>0</span>
                        <span className="font-medium">4.8 per month</span>
                        <span>10</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Average Transaction Value</p>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span>$0</span>
                        <span className="font-medium">$420</span>
                        <span>$1,000+</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Days Since Last Transaction</p>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span>0</span>
                        <span className="font-medium">15 days</span>
                        <span>60+</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="font-medium mb-2">Key Insights</p>
                      <ul className="text-sm space-y-1">
                        <li>• 65% of clients transact at least once a week</li>
                        <li>• Premium clients average 7.2 transactions per month</li>
                        <li>• Business clients have the highest average transaction value</li>
                        <li>• 82% of clients have transacted in the last 30 days</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
