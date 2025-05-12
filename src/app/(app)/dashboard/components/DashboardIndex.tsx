/**
 * Dashboard Index Component
 * Main dashboard component that integrates all dashboard widgets
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { TransactionSummary } from './TransactionSummary';
import { ExchangeRateWidget } from './ExchangeRateWidget';
import { QuickActions } from './QuickActions';
import { ClientActivity } from './ClientActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Settings, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Dashboard Index Component
 */
export function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [notifications, setNotifications] = useState<number>(3);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle notifications click
  const handleNotificationsClick = () => {
    router.push('/notifications');
  };
  
  // Handle settings click
  const handleSettingsClick = () => {
    router.push('/settings');
  };
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header Section */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 md:px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.name || 'Teller'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your teller operations overview
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={handleNotificationsClick}
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
      
      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4 px-4 md:px-0">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground"
            onClick={() => {
              switch (activeTab) {
                case 'overview':
                  router.push('/dashboard');
                  break;
                case 'transactions':
                  router.push('/transfer-history');
                  break;
                case 'clients':
                  router.push('/clients');
                  break;
              }
            }}
          >
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <QuickActions />
          </motion.div>
          
          {/* Transaction Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <TransactionSummary />
          </motion.div>
          
          {/* Two-column layout for Exchange Rates and Client Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ExchangeRateWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <ClientActivity />
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6 mt-0">
          <TransactionSummary />
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-6 mt-0">
          <ClientActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
}
