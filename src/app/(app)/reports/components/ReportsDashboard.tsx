'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  FileText, 
  Users, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { 
  generateMockTransactions, 
  calculateKpiData, 
  generateVolumeChartData 
} from '@/utils/mock-report-data';
import { KpiCards } from './KpiCards';
import { TransactionVolumeChart } from './TransactionVolumeChart';
import { TransactionDistributionChart } from './TransactionDistributionChart';
import { useToast } from '@/hooks/use-toast';

// Report types with their icons and descriptions
const reportTypes = [
  {
    id: 'transactions',
    title: 'Transaction Reports',
    description: 'Detailed reports on all transactions',
    icon: BarChart3,
    count: 5,
    path: '/reports?tab=transactions'
  },
  {
    id: 'clients',
    title: 'Client Reports',
    description: 'Client activity and demographics',
    icon: Users,
    count: 3,
    path: '/reports?tab=clients'
  },
  {
    id: 'compliance',
    title: 'Compliance Reports',
    description: 'KYC and regulatory compliance',
    icon: FileText,
    count: 4,
    path: '/reports?tab=compliance'
  },
  {
    id: 'performance',
    title: 'Performance Analytics',
    description: 'Business performance metrics',
    icon: LineChart,
    count: 2,
    path: '/reports?tab=performance'
  }
];

// Scheduled reports
const scheduledReports = [
  {
    id: 'daily-summary',
    title: 'Daily Transaction Summary',
    frequency: 'Daily',
    nextRun: new Date(new Date().setHours(23, 59, 0, 0)),
    recipients: ['admin@example.com'],
    status: 'active'
  },
  {
    id: 'weekly-performance',
    title: 'Weekly Performance Report',
    frequency: 'Weekly',
    nextRun: new Date(new Date().setDate(new Date().getDate() + (7 - new Date().getDay()))),
    recipients: ['manager@example.com', 'finance@example.com'],
    status: 'active'
  },
  {
    id: 'monthly-compliance',
    title: 'Monthly Compliance Report',
    frequency: 'Monthly',
    nextRun: new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1),
    recipients: ['compliance@example.com'],
    status: 'active'
  }
];

export function ReportsDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [kpiData, setKpiData] = useState<any>(null);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Generate current period data
        const currentTransactions = generateMockTransactions(30);
        
        // Generate previous period data
        const previousTransactions = generateMockTransactions(30);
        
        // Calculate KPI data
        const kpis = calculateKpiData(currentTransactions, previousTransactions);
        setKpiData(kpis);
        
        // Generate chart data
        const volumeChartData = generateVolumeChartData(currentTransactions);
        setVolumeData(volumeChartData);
        
        // Generate distribution data
        const distributionChartData = [
          { name: 'Remittance', value: 45000, count: 120, color: '#2563eb' },
          { name: 'Deposit', value: 30000, count: 85, color: '#10b981' },
          { name: 'Withdrawal', value: 25000, count: 65, color: '#f59e0b' },
          { name: 'Exchange', value: 15000, count: 40, color: '#8b5cf6' }
        ];
        setDistributionData(distributionChartData);
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading report data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading the report data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const handleRefresh = () => {
    // Reload data
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate new data
      const currentTransactions = generateMockTransactions(30);
      const previousTransactions = generateMockTransactions(30);
      const kpis = calculateKpiData(currentTransactions, previousTransactions);
      const volumeChartData = generateVolumeChartData(currentTransactions);
      
      setKpiData(kpis);
      setVolumeData(volumeChartData);
      setLastUpdated(new Date());
      setIsLoading(false);
      
      toast({
        title: 'Data refreshed',
        description: 'Report data has been updated successfully.'
      });
    }, 1000);
  };
  
  const handleNavigateToReport = (path: string) => {
    router.push(path);
  };
  
  const handleDownloadReport = (reportId: string) => {
    toast({
      title: 'Report downloaded',
      description: `The ${reportId} report has been downloaded.`
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Last updated info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* KPI Cards */}
      {kpiData && <KpiCards data={kpiData} />}
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {volumeData.length > 0 && (
              <TransactionVolumeChart 
                data={volumeData} 
                title="Transaction Volume Trend"
              />
            )}
            
            {distributionData.length > 0 && (
              <TransactionDistributionChart 
                data={distributionData} 
                title="Transaction Distribution"
              />
            )}
          </div>
          
          {/* Quick Reports */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Quick Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((report) => (
                <Card key={report.id} className="card-ios">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="rounded-full bg-blue-100 p-2">
                        <report.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {report.count} reports
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {report.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between"
                      onClick={() => handleNavigateToReport(report.path)}
                    >
                      View Reports
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Reports */}
            <Card className="card-ios">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Transaction Reports</CardTitle>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Analyze transaction data across different dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Transaction Summary</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport('daily-transaction')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transaction Volume by Type</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport('transaction-by-type')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transaction by Currency</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport('transaction-by-currency')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleNavigateToReport('/reports?tab=transactions')}
                >
                  View All Transaction Reports
                </Button>
              </CardFooter>
            </Card>
            
            {/* Client Reports */}
            <Card className="card-ios">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Client Reports</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Understand client behavior and demographics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Clients Report</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport('active-clients')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Client Acquisition Report</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport('client-acquisition')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Client Transaction History</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport('client-history')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleNavigateToReport('/reports?tab=clients')}
                >
                  View All Client Reports
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card className="card-ios">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>
                Manage your automated report schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {scheduledReports.map((report) => (
                <div key={report.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{report.title}</h4>
                    <Badge 
                      variant={report.status === 'active' ? 'outline' : 'secondary'}
                      className={report.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {report.status === 'active' ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-y-1 sm:gap-x-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{report.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Next run: {report.nextRun.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{report.recipients.join(', ')}</span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                New Schedule
              </Button>
              <Button variant="outline">
                Manage Schedules
              </Button>
            </CardFooter>
          </Card>
          
          {/* Alert for scheduled reports */}
          <Card className="card-ios border-orange-200 bg-orange-50 dark:bg-orange-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-orange-100 p-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-400">
                    Email Delivery Configuration Required
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    To enable scheduled report delivery, please configure your email settings in the administration panel.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => router.push('/admin/settings')}
                  >
                    Configure Email Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
