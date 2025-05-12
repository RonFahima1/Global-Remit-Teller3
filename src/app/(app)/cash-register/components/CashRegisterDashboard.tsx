/**
 * Cash Register Dashboard Component
 * Provides a comprehensive dashboard for cash register operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  MinusCircle, 
  Calculator, 
  RefreshCw,
  BarChart4,
  Wallet,
  DollarSign,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useCashRegisterService } from '@/hooks/useCashRegisterService';
import { CashDrawerRedux } from './CashDrawerRedux';
import { CashBalanceSummary } from './CashBalanceSummary';
import { CashOperationsHistory } from './CashOperationsHistory';
import { AddCashModalRedux } from './AddCashModalRedux';
import { RemoveCashModalRedux } from './RemoveCashModalRedux';
import { ReconcileCashModalRedux } from './ReconcileCashModalRedux';
import { toast } from 'sonner';
import { format } from 'date-fns';

/**
 * Cash Register Dashboard Component
 */
export function CashRegisterDashboard() {
  const { 
    isOpen, 
    balances, 
    openedAt, 
    openedBy,
    isLoading, 
    error,
    openCashRegister,
    closeCashRegister
  } = useCashRegisterService();
  
  const [isAddCashModalOpen, setIsAddCashModalOpen] = useState(false);
  const [isRemoveCashModalOpen, setIsRemoveCashModalOpen] = useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle opening the cash drawer
  const handleOpenDrawer = async () => {
    try {
      // In a real app, we would get the user ID from authentication
      const userId = 'current-user';
      
      // Initial balances - in a real app, this would come from a form
      const initialBalances = [
        { currency: 'USD', amount: 1000, lastUpdated: new Date().toISOString() },
        { currency: 'EUR', amount: 500, lastUpdated: new Date().toISOString() },
        { currency: 'ILS', amount: 2000, lastUpdated: new Date().toISOString() }
      ];
      
      await openCashRegister(userId, initialBalances);
      toast.success('Cash drawer opened successfully');
    } catch (error) {
      toast.error('Failed to open cash drawer');
      console.error(error);
    }
  };
  
  // Handle closing the cash drawer
  const handleCloseDrawer = async () => {
    try {
      // In a real app, we would get the user ID from authentication
      const userId = 'current-user';
      
      await closeCashRegister(userId);
      toast.success('Cash drawer closed successfully');
    } catch (error) {
      toast.error('Failed to close cash drawer');
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
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
            disabled={!isOpen || isLoading}
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
            disabled={!isOpen || isLoading}
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
            disabled={!isOpen || isLoading}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Reconcile
          </Button>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="card-ios">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cash Drawer Status */}
              <div className={`p-6 rounded-xl ${isOpen ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className={`h-5 w-5 ${isOpen ? 'text-green-600' : 'text-red-600'}`} />
                  <h3 className={`font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    Cash Drawer
                  </h3>
                </div>
                <div className="text-lg font-bold mb-2">
                  {isOpen ? 'Open' : 'Closed'}
                </div>
                <div className="text-sm mb-4">
                  {isOpen 
                    ? "The cash drawer is currently open. You can add, remove, or reconcile cash."
                    : "The cash drawer is currently closed. Open it to start processing cash transactions."}
                </div>
                <Button 
                  className="w-full" 
                  variant={isOpen ? "destructive" : "default"}
                  onClick={isOpen ? handleCloseDrawer : handleOpenDrawer}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isOpen ? "Close Drawer" : "Open Drawer"}
                    </>
                  )}
                </Button>
              </div>
              
              {/* Drawer Details */}
              <div className="p-6 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-600">
                    Drawer Details
                  </h3>
                </div>
                {isOpen && openedAt ? (
                  <>
                    <div className="text-sm mb-1">
                      <span className="text-gray-500">Opened At:</span>
                    </div>
                    <div className="text-lg font-bold mb-3">
                      {format(new Date(openedAt), 'MMM d, yyyy HH:mm')}
                    </div>
                    <div className="text-sm mb-1">
                      <span className="text-gray-500">Opened By:</span>
                    </div>
                    <div className="text-base font-medium">
                      {openedBy || 'Unknown User'}
                    </div>
                  </>
                ) : (
                  <div className="text-base">
                    No active session
                  </div>
                )}
              </div>
              
              {/* Balance Summary */}
              <div className="p-6 rounded-xl bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-600">
                    Balance Summary
                  </h3>
                </div>
                <div className="text-sm mb-1">
                  <span className="text-gray-500">Total Cash:</span>
                </div>
                <div className="text-lg font-bold mb-3">
                  ${balances.reduce((total, balance) => total + balance.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm mb-1">
                  <span className="text-gray-500">Currencies:</span>
                </div>
                <div className="text-base">
                  {balances.length > 0 
                    ? balances.map(b => b.currency).join(', ')
                    : 'No currencies available'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">
            <Wallet className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="drawer">
            <Calculator className="mr-2 h-4 w-4" />
            Cash Drawer
          </TabsTrigger>
          <TabsTrigger value="operations">
            <RefreshCw className="mr-2 h-4 w-4" />
            Operations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CashOperationsHistory />
            </div>
            <div className="md:col-span-1">
              <CashBalanceSummary />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="drawer" className="space-y-6">
          <CashDrawerRedux />
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-6">
          <CashOperationsHistory />
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
