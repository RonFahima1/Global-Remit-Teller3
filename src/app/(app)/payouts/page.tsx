/**
 * Payouts Page
 * Main page for managing payout operations
 */

'use client';

import React, { useState } from 'react';
import { PayoutPartnersList } from './components/PayoutPartnersList';
import { PayoutTransactionsList } from './components/PayoutTransactionsList';
import { PayoutDetails } from './components/PayoutDetails';
import { Payout, PayoutPartner } from '@/types/payout';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  FileText, 
  BarChart4, 
  RefreshCw 
} from 'lucide-react';

/**
 * Payouts Page Component
 */
export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isPayoutDetailsOpen, setIsPayoutDetailsOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PayoutPartner | null>(null);
  
  // Handle view payout
  const handleViewPayout = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsPayoutDetailsOpen(true);
  };
  
  // Handle select partner
  const handleSelectPartner = (partner: PayoutPartner) => {
    setSelectedPartner(partner);
    setActiveTab('transactions');
  };
  
  // Handle close payout details
  const handleClosePayoutDetails = () => {
    setIsPayoutDetailsOpen(false);
  };
  
  return (
    <Provider store={store}>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
          <p className="text-muted-foreground">
            Manage payout operations, partners, and reconciliation
          </p>
        </div>
        
        <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="transactions">
              <FileText className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Building className="mr-2 h-4 w-4" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="reconciliation">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reconciliation
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart4 className="mr-2 h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <PayoutTransactionsList onViewPayout={handleViewPayout} />
          </TabsContent>
          
          <TabsContent value="partners" className="space-y-4">
            <PayoutPartnersList onSelectPartner={handleSelectPartner} />
          </TabsContent>
          
          <TabsContent value="reconciliation" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payout Reconciliation</h2>
              <p className="text-muted-foreground mb-4">
                Reconcile payout transactions with partner reports to identify and resolve discrepancies.
              </p>
              
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">
                  Reconciliation functionality will be implemented in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payout Reports</h2>
              <p className="text-muted-foreground mb-4">
                Generate and view reports on payout operations, performance, and trends.
              </p>
              
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">
                  Reporting functionality will be implemented in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <PayoutDetails 
          payout={selectedPayout} 
          isOpen={isPayoutDetailsOpen} 
          onClose={handleClosePayoutDetails} 
        />
      </div>
    </Provider>
  );
}
