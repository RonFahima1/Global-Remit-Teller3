'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CashRegisterProvider } from '@/context/CashRegisterContext';
import { CashRegisterReport } from '../components/CashRegisterReport';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer, Calendar, BarChart3, PieChart } from 'lucide-react';
import Link from 'next/link';

function CashRegisterReportsContent() {
  const [activeTab, setActiveTab] = useState('daily');
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/cash-register">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cash Register Reports</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Reports tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Daily Reports
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Trends Analysis
              </TabsTrigger>
              <TabsTrigger value="reconciliation" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Reconciliation History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <CashRegisterReport />
            </TabsContent>
            
            <TabsContent value="trends">
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Trends Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-500">Trends analysis will be available in the next update.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reconciliation">
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Reconciliation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-500">Reconciliation history will be available in the next update.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default function CashRegisterReportsPage() {
  return (
    <CashRegisterProvider>
      <CashRegisterReportsContent />
    </CashRegisterProvider>
  );
}
