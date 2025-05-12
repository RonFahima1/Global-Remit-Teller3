'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { formatCurrency } from '@/utils/format';
import { Loader2, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

// Types
interface RiskCategoryData {
  name: string;
  value: number;
  color?: string;
}

interface RiskFactorData {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

interface RiskAnalysisTabProps {
  isLoading: boolean;
  riskCategoryData: RiskCategoryData[];
  suspiciousActivityCount: number;
  totalTransactions: number;
}

// Mock data for risk factors
const riskFactors: RiskFactorData[] = [
  { 
    name: 'Transaction Patterns', 
    score: 85, 
    maxScore: 100,
    description: 'Analysis of transaction frequency, amounts, and timing'
  },
  { 
    name: 'Client Verification', 
    score: 92, 
    maxScore: 100,
    description: 'Strength of identity verification and KYC processes'
  },
  { 
    name: 'Geographic Risk', 
    score: 78, 
    maxScore: 100,
    description: 'Risk based on countries and regions involved in transactions'
  },
  { 
    name: 'Suspicious Activity', 
    score: 88, 
    maxScore: 100,
    description: 'Detection and handling of potentially suspicious transactions'
  },
  { 
    name: 'Regulatory Compliance', 
    score: 95, 
    maxScore: 100,
    description: 'Adherence to relevant financial regulations and requirements'
  }
];

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
          Count: <span className="font-medium">{data.value}</span> transactions
        </p>
        <p className="text-sm">
          Percentage: <span className="font-medium">{percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function RiskAnalysisTab({ 
  isLoading, 
  riskCategoryData,
  suspiciousActivityCount,
  totalTransactions
}: RiskAnalysisTabProps) {
  // Add colors to risk category data if not provided
  const riskDataWithColors = riskCategoryData.map(item => ({
    ...item,
    color: item.color || (
      item.name === 'Low Risk' ? '#10b981' :
      item.name === 'Medium Risk' ? '#f59e0b' :
      '#ef4444'
    ),
    total: riskCategoryData.reduce((sum, item) => sum + item.value, 0)
  }));
  
  // Calculate total for percentage
  const total = riskDataWithColors.reduce((sum, item) => sum + item.value, 0);
  
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
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-ios">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-green-100 p-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <Badge 
                variant="outline" 
                className="bg-green-50 text-green-700 border-green-200"
              >
                {riskDataWithColors.find(item => item.name === 'Low Risk')?.value || 0}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Low Risk Transactions</p>
              <p className="text-2xl font-semibold mt-1">
                {((riskDataWithColors.find(item => item.name === 'Low Risk')?.value || 0) / total * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-ios">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-yellow-100 p-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <Badge 
                variant="outline" 
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                {riskDataWithColors.find(item => item.name === 'Medium Risk')?.value || 0}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Medium Risk Transactions</p>
              <p className="text-2xl font-semibold mt-1">
                {((riskDataWithColors.find(item => item.name === 'Medium Risk')?.value || 0) / total * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-ios">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-red-100 p-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <Badge 
                variant="outline" 
                className="bg-red-50 text-red-700 border-red-200"
              >
                {riskDataWithColors.find(item => item.name === 'High Risk')?.value || 0}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">High Risk Transactions</p>
              <p className="text-2xl font-semibold mt-1">
                {((riskDataWithColors.find(item => item.name === 'High Risk')?.value || 0) / total * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card className="card-ios">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Transaction Risk Distribution</CardTitle>
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
                      data={riskDataWithColors}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDataWithColors.map((entry, index) => (
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
        
        {/* Risk Factors */}
        <Card className="card-ios">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Risk Factor Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {riskFactors.map((factor) => (
                  <div key={factor.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{factor.name}</p>
                        <p className="text-xs text-muted-foreground">{factor.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          factor.score > 90 ? "bg-green-50 text-green-700 border-green-200" :
                          factor.score > 75 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {factor.score}/{factor.maxScore}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={
                          factor.score > 90 ? "h-full bg-green-500 rounded-full" :
                          factor.score > 75 ? "h-full bg-yellow-500 rounded-full" :
                          "h-full bg-red-500 rounded-full"
                        } 
                        style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Suspicious Activity */}
      <Card className="card-ios">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Suspicious Activity Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[100px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Suspicious Activity Reports</p>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {suspiciousActivityCount}
                  </Badge>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${(suspiciousActivityCount / totalTransactions) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span>0%</span>
                  <span className="font-medium">
                    {((suspiciousActivityCount / totalTransactions) * 100).toFixed(2)}%
                  </span>
                  <span>5%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Key Risk Indicators</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span>
                      {suspiciousActivityCount} suspicious activity reports filed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>
                      {riskDataWithColors.find(item => item.name === 'High Risk')?.value || 0} high-risk transactions identified
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>
                      {((riskDataWithColors.find(item => item.name === 'Low Risk')?.value || 0) / total * 100).toFixed(1)}% of transactions classified as low-risk
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
