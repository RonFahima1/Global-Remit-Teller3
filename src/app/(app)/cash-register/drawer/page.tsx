'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CashRegisterProvider } from '@/context/CashRegisterContext';
import { CashDrawer } from '../components/CashDrawer';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

function CashDrawerContent() {
  // Mock data for last counts and alerts
  const lastCounts = [
    { date: new Date(2025, 4, 11, 9, 0), user: 'John Doe', result: 'match', difference: 0, currency: 'USD' },
    { date: new Date(2025, 4, 10, 17, 30), user: 'Jane Smith', result: 'over', difference: 50, currency: 'USD' },
    { date: new Date(2025, 4, 9, 12, 15), user: 'John Doe', result: 'under', difference: -25, currency: 'USD' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/cash-register">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Cash Drawer Management</h1>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Cash Drawer Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CashDrawer />
          </motion.div>
          
          {/* Last Counts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Counts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lastCounts.map((count, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          count.result === 'match' 
                            ? 'bg-green-100 text-green-600' 
                            : count.result === 'over'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-red-100 text-red-600'
                        }`}>
                          {count.result === 'match' 
                            ? <CheckCircle2 className="h-4 w-4" /> 
                            : count.result === 'over'
                              ? <AlertTriangle className="h-4 w-4" />
                              : <AlertTriangle className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">
                            {count.result === 'match' 
                              ? 'Drawer Balanced' 
                              : count.result === 'over'
                                ? 'Drawer Over'
                                : 'Drawer Under'
                            }
                          </p>
                          <div className="flex gap-2 text-xs text-gray-500">
                            <span>{count.user}</span>
                            <span>•</span>
                            <span>{format(count.date, 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        count.result === 'match' 
                          ? 'text-green-600' 
                          : count.result === 'over'
                            ? 'text-blue-600'
                            : 'text-red-600'
                      }`}>
                        {count.result === 'match' 
                          ? 'Balanced' 
                          : count.difference > 0
                            ? `+${count.difference} ${count.currency}`
                            : `${count.difference} ${count.currency}`
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Right Column - Info and Guidelines */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Drawer Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                <Clock className="h-5 w-5" />
                <div>
                  <p className="font-medium">Next scheduled count</p>
                  <p className="text-sm">Today at 5:00 PM</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Count Schedule</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Morning Count</span>
                    <span className="text-gray-500">9:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Afternoon Count</span>
                    <span className="text-gray-500">1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evening Count</span>
                    <span className="text-gray-500">5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Closing Count</span>
                    <span className="text-gray-500">8:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Drawer Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>Follow these guidelines when counting your cash drawer:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Count all bills and coins separately</li>
                  <li>Organize bills by denomination</li>
                  <li>Double-check your counts for accuracy</li>
                  <li>Report any discrepancies immediately</li>
                  <li>Sign off on the count when complete</li>
                </ul>
                <p className="text-gray-500 mt-3">
                  If you have any questions about the cash drawer procedures, please contact your supervisor.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function CashDrawerPage() {
  return (
    <CashRegisterProvider>
      <CashDrawerContent />
    </CashRegisterProvider>
  );
}
