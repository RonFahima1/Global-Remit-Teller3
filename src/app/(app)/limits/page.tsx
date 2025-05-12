
'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, User, Building, AlertTriangle } from "lucide-react";
import { TransactionLimitsCard } from "./components/TransactionLimitsCard";
import { AccountLimitsCard } from "./components/AccountLimitsCard";
import { ClientTypeLimitsCard } from "./components/ClientTypeLimitsCard";
import { LimitExceptionsCard } from "./components/LimitExceptionsCard";
import { RequestLimitExceptionForm } from "./components/RequestLimitExceptionForm";

export default function LimitsPage() {
  const [activeTab, setActiveTab] = useState('client-limits');
  
  // Mock user role - in a real app, this would come from auth context
  const isAdmin = true;
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-h1 font-h1 text-foreground">Limits Management</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="client-limits" className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Client Limits</span>
          </TabsTrigger>
          <TabsTrigger value="system-limits" className="flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System Limits</span>
          </TabsTrigger>
          <TabsTrigger value="exceptions" className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Exceptions</span>
          </TabsTrigger>
          <TabsTrigger value="request" className="flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Request Exception</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Client Limits Tab */}
        <TabsContent value="client-limits" className="space-y-6">
          <TransactionLimitsCard isAdmin={isAdmin} />
          <AccountLimitsCard isAdmin={isAdmin} />
        </TabsContent>
        
        {/* System Limits Tab */}
        <TabsContent value="system-limits" className="space-y-6">
          <ClientTypeLimitsCard isAdmin={isAdmin} />
        </TabsContent>
        
        {/* Exceptions Tab */}
        <TabsContent value="exceptions" className="space-y-6">
          <LimitExceptionsCard isAdmin={isAdmin} />
        </TabsContent>
        
        {/* Request Exception Tab */}
        <TabsContent value="request" className="space-y-6">
          <RequestLimitExceptionForm 
            onSuccess={() => setActiveTab('exceptions')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
