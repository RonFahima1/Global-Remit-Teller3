'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatPercentage } from '@/utils/format';
import { KycVerificationTab } from './KycVerificationTab';
import { RiskAnalysisTab } from './RiskAnalysisTab';

// Types
interface ComplianceMetrics {
  kycCompletionRate: number;
  kycPendingRate: number;
  kycRejectionRate: number;
  avgVerificationTime: number;
  highRiskTransactions: number;
  totalTransactions: number;
  suspiciousActivityReports: number;
  complianceScore: number;
}

interface KycStatusData {
  name: string;
  value: number;
  color: string;
}

interface ComplianceReportingMainProps {
  period?: 'week' | 'month' | 'quarter' | 'year';
  onPeriodChange?: (period: 'week' | 'month' | 'quarter' | 'year') => void;
  onExport?: (format: 'csv' | 'pdf') => void;
}

// Mock data
const mockKycStatusData: KycStatusData[] = [
  { name: 'Verified', value: 720, color: '#10b981' },
  { name: 'Pending', value: 180, color: '#f59e0b' },
  { name: 'Rejected', value: 45, color: '#ef4444' },
  { name: 'Expired', value: 30, color: '#6b7280' },
  { name: 'Not Started', value: 95, color: '#d1d5db' },
];

const mockComplianceMetrics: ComplianceMetrics = {
  kycCompletionRate: 67.3,
  kycPendingRate: 16.8,
  kycRejectionRate: 4.2,
  avgVerificationTime: 28.5, // hours
  highRiskTransactions: 35,
  totalTransactions: 1250,
  suspiciousActivityReports: 8,
  complianceScore: 92.5,
};

const mockRiskCategoryData = [
  { name: 'Low Risk', value: 850 },
  { name: 'Medium Risk', value: 320 },
  { name: 'High Risk', value: 80 },
];

const mockMonthlyVerificationData = [
  { month: 'Jan', completed: 65, pending: 25, rejected: 5 },
  { month: 'Feb', completed: 70, pending: 20, rejected: 4 },
  { month: 'Mar', completed: 75, pending: 18, rejected: 6 },
  { month: 'Apr', completed: 80, pending: 15, rejected: 3 },
  { month: 'May', completed: 85, pending: 12, rejected: 4 },
  { month: 'Jun', completed: 90, pending: 10, rejected: 3 },
];

export function ComplianceReportingMain({ 
  period = 'month', 
  onPeriodChange,
  onExport
}: ComplianceReportingMainProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [kycStatusData, setKycStatusData] = useState<KycStatusData[]>([]);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics | null>(null);
  const [riskCategoryData, setRiskCategoryData] = useState<any[]>([]);
  const [monthlyVerificationData, setMonthlyVerificationData] = useState<any[]>([]);
  
  // Load data based on selected period
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // In a real app, this would fetch data from an API based on the period
      setKycStatusData(mockKycStatusData);
      setComplianceMetrics(mockComplianceMetrics);
      setRiskCategoryData(mockRiskCategoryData);
      setMonthlyVerificationData(mockMonthlyVerificationData);
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
  
  // Handle export
  const handleExport = (format: 'csv' | 'pdf') => {
    if (onExport) {
      onExport(format);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Compliance Reporting</h2>
        
        <div className="flex flex-wrap items-center gap-2">
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
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Score Card */}
          {complianceMetrics && (
            <Card className="card-ios">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-lg font-medium mb-2">Compliance Score</h3>
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">{complianceMetrics.complianceScore}%</div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={complianceMetrics.complianceScore > 90 ? "#10b981" : 
                               complianceMetrics.complianceScore > 75 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="3"
                        strokeDasharray={`${complianceMetrics.complianceScore}, 100`}
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {complianceMetrics.complianceScore > 90 
                      ? "Excellent compliance status" 
                      : complianceMetrics.complianceScore > 75 
                      ? "Good compliance status, some areas need attention" 
                      : "Compliance issues detected, immediate action required"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Compliance Metrics */}
          {complianceMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-ios">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {formatPercentage(complianceMetrics.kycCompletionRate, 1)}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">KYC Completion Rate</p>
                    <p className="text-2xl font-semibold mt-1">
                      {complianceMetrics.kycCompletionRate}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-ios">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      {complianceMetrics.avgVerificationTime} hours
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Avg. Verification Time</p>
                    <p className="text-2xl font-semibold mt-1">
                      {complianceMetrics.avgVerificationTime} hours
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
                      {complianceMetrics.highRiskTransactions}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">High Risk Transactions</p>
                    <p className="text-2xl font-semibold mt-1">
                      {complianceMetrics.highRiskTransactions}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((complianceMetrics.highRiskTransactions / complianceMetrics.totalTransactions) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* KYC Verification Tab */}
        <TabsContent value="kyc" className="space-y-6">
          <KycVerificationTab 
            isLoading={isLoading}
            kycStatusData={kycStatusData}
            monthlyVerificationData={monthlyVerificationData}
          />
        </TabsContent>
        
        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <RiskAnalysisTab 
            isLoading={isLoading}
            riskCategoryData={riskCategoryData}
            suspiciousActivityCount={complianceMetrics?.suspiciousActivityReports || 0}
            totalTransactions={complianceMetrics?.totalTransactions || 0}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
