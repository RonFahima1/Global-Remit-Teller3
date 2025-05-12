/**
 * Cash Register Page (Redux Version)
 * Manages cash register operations using Redux state management
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  MinusCircle, 
  Calculator, 
  RefreshCw,
  BarChart4,
  Wallet
} from 'lucide-react';
import { 
  CashDrawerRedux, 
  CashBalanceRedux, 
  CashOperationsListRedux,
  AddCashModalRedux,
  RemoveCashModalRedux,
  ReconcileCashModalRedux
} from '../cash-register/components';
import { useCashRegister } from '@/lib/redux/hooks';
import { toast } from 'sonner';

/**
 * Cash Register Page Component
 */
export default function CashRegisterReduxPage() {
  const { isOpen } = useCashRegister();
  
  const [isAddCashModalOpen, setIsAddCashModalOpen] = useState(false);
  const [isRemoveCashModalOpen, setIsRemoveCashModalOpen] = useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cash Register</h1>
          <p className="text-muted-foreground">
            Manage cash drawer, deposits, withdrawals, and reconciliation
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isOpen) {
                toast.error('Cash drawer is closed. Please open it first.');
                return;
              }
              setIsAddCashModalOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cash
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isOpen) {
                toast.error('Cash drawer is closed. Please open it first.');
                return;
              }
              setIsRemoveCashModalOpen(true);
            }}
          >
            <MinusCircle className="mr-2 h-4 w-4" />
            Remove Cash
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isOpen) {
                toast.error('Cash drawer is closed. Please open it first.');
                return;
              }
              setIsReconcileModalOpen(true);
            }}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Reconcile
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CashBalanceRedux />
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Cash Drawer</h2>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">
                Status: <span className={isOpen ? "text-green-600" : "text-red-600"}>
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>
              
              {isOpen && (
                <div className="text-xs text-muted-foreground">
                  Opened at: {new Date().toLocaleString()}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isOpen 
                  ? "The cash drawer is currently open. You can add, remove, or reconcile cash."
                  : "The cash drawer is currently closed. Open it to start processing cash transactions."}
              </p>
              
              <Button 
                className="w-full" 
                variant={isOpen ? "destructive" : "default"}
              >
                {isOpen ? "Close Drawer" : "Open Drawer"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="drawer" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="drawer">
            <Wallet className="mr-2 h-4 w-4" />
            Cash Drawer
          </TabsTrigger>
          <TabsTrigger value="operations">
            <RefreshCw className="mr-2 h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart4 className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="drawer" className="space-y-4">
          <CashDrawerRedux />
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          <CashOperationsListRedux />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Cash Register Reports</h2>
            <p className="text-muted-foreground mb-4">
              Generate reports for cash register operations, balances, and reconciliation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                <BarChart4 className="mr-2 h-4 w-4" />
                Daily Summary
              </Button>
              
              <Button variant="outline" className="w-full">
                <BarChart4 className="mr-2 h-4 w-4" />
                Weekly Report
              </Button>
              
              <Button variant="outline" className="w-full">
                <BarChart4 className="mr-2 h-4 w-4" />
                Monthly Report
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <AddCashModalRedux 
        isOpen={isAddCashModalOpen} 
        onClose={() => setIsAddCashModalOpen(false)} 
      />
      
      <RemoveCashModalRedux 
        isOpen={isRemoveCashModalOpen} 
        onClose={() => setIsRemoveCashModalOpen(false)} 
      />
      
      <ReconcileCashModalRedux 
        isOpen={isReconcileModalOpen} 
        onClose={() => setIsReconcileModalOpen(false)} 
      />
    </div>
  );
}
