'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RefreshCw, ArrowUpDown, BarChart3, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { CashRegisterProvider, useCashRegister } from '@/context/CashRegisterContext';
import Link from 'next/link';
import {
  AddCashModal,
  RemoveCashModal,
  ReconcileCashModal,
  TransactionList,
  CashBalanceCards
} from './components';

// Wrapper component to use context
function CashRegisterContent() {
  const [addCashModalOpen, setAddCashModalOpen] = useState(false);
  const [removeCashModalOpen, setRemoveCashModalOpen] = useState(false);
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const { state } = useCashRegister();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash on Hand Overview */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="card-ios">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold">Cash Register</CardTitle>
                <div className="flex items-center gap-2">
                  <Link href="/cash-register/drawer">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Cash Drawer
                    </Button>
                  </Link>
                  <Link href="/cash-register/reports">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Reports
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <CashBalanceCards />

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button 
                    className="flex-1 h-12" 
                    variant="outline"
                    onClick={() => setAddCashModalOpen(true)}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Cash
                  </Button>
                  <Button 
                    className="flex-1 h-12" 
                    variant="outline"
                    onClick={() => setRemoveCashModalOpen(true)}
                  >
                    <Minus className="h-5 w-5 mr-2" />
                    Remove Cash
                  </Button>
                  <Button 
                    className="flex-1 h-12" 
                    variant="outline"
                    onClick={() => setReconcileModalOpen(true)}
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Reconcile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Cash Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Cash Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Stats and Summary */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Cash Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Cash (All Currencies)</span>
                  <span className="font-semibold">
                    ${state.balances.reduce((sum, balance) => sum + balance.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Transactions Today</span>
                  <span className="font-semibold">
                    {state.transactions.filter(txn => {
                      const today = new Date();
                      const txnDate = new Date(txn.date);
                      return (
                        txnDate.getDate() === today.getDate() &&
                        txnDate.getMonth() === today.getMonth() &&
                        txnDate.getFullYear() === today.getFullYear()
                      );
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Last Reconciliation</span>
                  <span className="font-semibold">
                    {state.transactions.find(txn => txn.description.includes('Reconciliation')) 
                      ? new Date(state.transactions.find(txn => 
                          txn.description.includes('Reconciliation')
                        )!.date).toLocaleDateString() 
                      : 'Never'}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Currency Breakdown</h3>
                <div className="space-y-2">
                  {state.balances.map(balance => (
                    <div key={balance.currency} className="flex justify-between items-center">
                      <span className="text-gray-500">{balance.currency}</span>
                      <span className="font-semibold">{balance.amount.toLocaleString()} {balance.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.transactions.slice(0, 5).map((txn, index) => (
                  <div key={txn.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${txn.type === 'add' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm">{txn.description}</p>
                      <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <AddCashModal isOpen={addCashModalOpen} onClose={() => setAddCashModalOpen(false)} />
      <RemoveCashModal isOpen={removeCashModalOpen} onClose={() => setRemoveCashModalOpen(false)} />
      <ReconcileCashModal isOpen={reconcileModalOpen} onClose={() => setReconcileModalOpen(false)} />
    </div>
  );
}

// Main page component with provider
export default function CashRegisterPage() {
  return (
    <CashRegisterProvider>
      <CashRegisterContent />
    </CashRegisterProvider>
  );
}