'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ReportFilters } from './components/ReportFilters';
import { KpiCards } from './components/KpiCards';
import { TransactionVolumeChart } from './components/TransactionVolumeChart';
import { TransactionDistributionChart } from './components/TransactionDistributionChart';
import { TransactionTable, Transaction } from './components/TransactionTable';
import { ReportsDashboard } from './components/ReportsDashboard';
import { ClientAnalytics } from './components/ClientAnalytics';
import { ComplianceReportingMain } from './components/ComplianceReportingMain';
import { Download } from 'lucide-react';
import { 
  generateMockTransactions,
  calculateKpiData,
  generateVolumeChartData,
  generateDistributionChartData,
  filterTransactions,
  exportTransactionsToCSV,
  downloadCSV
} from '@/utils/mock-report-data';
import { generateTransactionPDF, downloadPDF } from '@/utils/pdf-export';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    // Get tab from URL query parameter if available
    const tabParam = searchParams.get('tab');
    return tabParam || 'dashboard';
  });
  
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Generate mock data
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [previousPeriodTransactions, setPreviousPeriodTransactions] = useState<Transaction[]>([]);
  
  // Filters state
  const [filters, setFilters] = useState({
    dateFrom: subDays(new Date(), 30),
    dateTo: new Date(),
    type: 'all',
    clientId: '',
    clientName: '',
    status: 'all',
    currency: 'all',
    minAmount: '',
    maxAmount: '',
    tellerName: '',
  });
  
  // Filtered transactions
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Load mock data on component mount
  useEffect(() => {
    // Generate transactions for current period (last 30 days)
    const currentTransactions = generateMockTransactions(30);
    setAllTransactions(currentTransactions);
    
    // Generate transactions for previous period (30-60 days ago)
    const previousTransactions = generateMockTransactions(30);
    setPreviousPeriodTransactions(previousTransactions);
    
    // Apply initial filters
    setFilteredTransactions(filterTransactions(currentTransactions, filters));
    
    setIsLoading(false);
  }, []);
  
  // Apply filters to transactions
  const handleApplyFilters = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = filterTransactions(allTransactions, filters);
      setFilteredTransactions(filtered);
      setIsLoading(false);
      
      toast({
        title: 'Filters Applied',
        description: `Found ${filtered.length} transactions matching your criteria.`,
      });
    }, 500);
  };
  
  // Reset filters to default values
  const handleResetFilters = () => {
    setFilters({
      dateFrom: subDays(new Date(), 30),
      dateTo: new Date(),
      type: 'all',
      clientId: '',
      clientName: '',
      status: 'all',
      currency: 'all',
      minAmount: '',
      maxAmount: '',
      tellerName: '',
    });
    
    // Apply reset filters
    handleApplyFilters();
  };
  
  // Handle transaction export
  const exportTransactionReport = async (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = exportTransactionsToCSV(filteredTransactions);
      downloadCSV(csvContent, `transaction-report-${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: 'Export Complete',
        description: 'Transaction report has been downloaded as CSV.',
      });
    } else {
      // Generate PDF report
      setIsLoading(true);
      try {
        const pdfBlob = await generateTransactionPDF(
          filteredTransactions,
          'Transaction Report',
          { ...filters }
        );
        
        downloadPDF(pdfBlob, `transaction-report-${new Date().toISOString().split('T')[0]}.pdf`);
        
        toast({
          title: 'Export Complete',
          description: 'Transaction report has been downloaded as PDF.',
        });
      } catch (error) {
        console.error('PDF generation error:', error);
        toast({
          title: 'Export Failed',
          description: 'There was an error generating the PDF report.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Export compliance report
  const exportComplianceReport = async (format: 'csv' | 'pdf') => {
    toast({
      title: 'Export Initiated',
      description: `Compliance report will be downloaded as ${format.toUpperCase()}.`,
    });
    
    // Implementation would be similar to exportTransactionReport
    // but with compliance data
  };
  
  // Handle viewing transaction details
  const handleViewTransactionDetails = (transactionId: string) => {
    const transaction = filteredTransactions.find(tx => tx.id === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowTransactionDetails(true);
    }
  };
  
  // Handle creating custom report
  const handleCreateCustomReport = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Custom report builder will be available in a future update.',
    });
  };
  
  // Handle viewing custom report
  const handleViewCustomReport = (reportId: string) => {
    toast({
      title: 'Report Viewer',
      description: `Viewing ${reportId} report. This feature is under development.`,
    });
  };
  
  // Calculate KPI data
  const kpis = calculateKpiData(filteredTransactions, previousPeriodTransactions);
  
  // Generate chart data
  const chartData = generateVolumeChartData(filteredTransactions);
  const distributionData = generateDistributionChartData(filteredTransactions);
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full md:w-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <ReportsDashboard 
            period={period} 
            onPeriodChange={setPeriod} 
          />
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Transaction Reports</h2>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant={period === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={period === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={period === 'quarter' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('quarter')}
                >
                  Quarter
                </Button>
                <Button 
                  variant={period === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('year')}
                >
                  Year
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportTransactionReport('csv')}
                  className="flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportTransactionReport('pdf')}
                  className="flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionVolumeChart data={chartData} />
            <TransactionDistributionChart data={distributionData} />
          </div>
          
          <TransactionTable 
            transactions={filteredTransactions} 
            onViewDetails={handleViewTransactionDetails} 
          />
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant={period === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={period === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={period === 'quarter' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('quarter')}
                >
                  Quarter
                </Button>
                <Button 
                  variant={period === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('year')}
                >
                  Year
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCards kpis={kpis} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionVolumeChart data={chartData} />
            <TransactionDistributionChart data={distributionData} />
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <ClientAnalytics 
            period={period} 
            onPeriodChange={setPeriod} 
          />
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <ComplianceReportingMain 
            period={period} 
            onPeriodChange={setPeriod} 
            onExport={exportComplianceReport}
          />
        </TabsContent>
        
        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Custom Reports</h2>
            
            <Button onClick={handleCreateCustomReport}>
              Create New Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-ios">
              <CardHeader>
                <CardTitle>Monthly Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Summary of all transactions with volume and fee analysis
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleViewCustomReport('monthly-transactions')}>
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-ios">
              <CardHeader>
                <CardTitle>Client Acquisition Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analysis of new client registrations and conversion rates
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleViewCustomReport('client-acquisition')}>
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-ios">
              <CardHeader>
                <CardTitle>Regulatory Compliance Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive audit report for regulatory compliance
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleViewCustomReport('compliance-audit')}>
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedTransaction.date).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{selectedTransaction.type}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedTransaction.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client ID</p>
                  <p className="font-medium">{selectedTransaction.clientId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedTransaction.status}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Processed By</p>
                <p className="font-medium">{selectedTransaction.tellerName}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
