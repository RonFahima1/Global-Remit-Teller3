/**
 * Exchange Rates Page
 * Main page for managing exchange rates
 */

'use client';

import React, { useState } from 'react';
import { ExchangeRateTable } from './components/ExchangeRateTable';
import { ExchangeRateForm } from './components/ExchangeRateForm';
import { ExchangeRate } from '@/types/exchange-rate';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Settings, 
  History 
} from 'lucide-react';

/**
 * Exchange Rates Page Component
 */
export default function ExchangeRatesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rateToEdit, setRateToEdit] = useState<ExchangeRate | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('rates');
  
  // Handle edit rate
  const handleEditRate = (rate: ExchangeRate) => {
    setRateToEdit(rate);
    setIsFormOpen(true);
  };
  
  // Handle create rate
  const handleCreateRate = () => {
    setRateToEdit(undefined);
    setIsFormOpen(true);
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setRateToEdit(undefined);
  };
  
  return (
    <Provider store={store}>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exchange Rates</h1>
          <p className="text-muted-foreground">
            Manage currency exchange rates, margins, and providers
          </p>
        </div>
        
        <Tabs defaultValue="rates" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="rates">
              <DollarSign className="mr-2 h-4 w-4" />
              Exchange Rates
            </TabsTrigger>
            <TabsTrigger value="margins">
              <TrendingUp className="mr-2 h-4 w-4" />
              Margin Configuration
            </TabsTrigger>
            <TabsTrigger value="providers">
              <Settings className="mr-2 h-4 w-4" />
              Rate Providers
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Rate History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rates" className="space-y-4">
            <ExchangeRateTable 
              onEditRate={handleEditRate}
              onCreateRate={handleCreateRate}
            />
          </TabsContent>
          
          <TabsContent value="margins" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Margin Configuration</h2>
              <p className="text-muted-foreground mb-4">
                Configure margin percentages for different currency pairs and transaction types.
              </p>
              
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">
                  Margin configuration will be implemented in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="providers" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Rate Providers</h2>
              <p className="text-muted-foreground mb-4">
                Configure external rate providers and API integrations.
              </p>
              
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">
                  Rate provider configuration will be implemented in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Rate History</h2>
              <p className="text-muted-foreground mb-4">
                View historical exchange rates and changes over time.
              </p>
              
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">
                  Rate history will be implemented in a future update.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <ExchangeRateForm 
          isOpen={isFormOpen} 
          onClose={handleFormClose} 
          rateToEdit={rateToEdit}
        />
      </div>
    </Provider>
  );
}
