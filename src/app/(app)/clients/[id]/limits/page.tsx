'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { TransactionLimitsCard } from "@/app/(app)/limits/components/TransactionLimitsCard";
import { AccountLimitsCard } from "@/app/(app)/limits/components/AccountLimitsCard";
import { LimitExceptionsCard } from "@/app/(app)/limits/components/LimitExceptionsCard";
import { RequestLimitExceptionForm } from "@/app/(app)/limits/components/RequestLimitExceptionForm";

interface ClientLimitsPageProps {
  params: {
    id: string;
  };
}

export default function ClientLimitsPage({ params }: ClientLimitsPageProps) {
  const [activeTab, setActiveTab] = useState('limits');
  
  // Mock client data - in a real app, this would be fetched from API
  const client = {
    id: params.id,
    name: "John Smith",
    type: "individual",
    status: "active",
  };
  
  // Mock user role - in a real app, this would come from auth context
  const isAdmin = true;
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href={`/clients/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-h1 font-h1 text-foreground">Client Limits</h1>
            <p className="text-sm text-muted-foreground">
              Managing limits for {client.name}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="limits">
            Transaction & Account Limits
          </TabsTrigger>
          <TabsTrigger value="exceptions" className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Exception History</span>
          </TabsTrigger>
          <TabsTrigger value="request" className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Request Exception</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Limits Tab */}
        <TabsContent value="limits" className="space-y-6">
          <TransactionLimitsCard clientId={params.id} isAdmin={isAdmin} />
          <AccountLimitsCard clientId={params.id} isAdmin={isAdmin} />
        </TabsContent>
        
        {/* Exceptions Tab */}
        <TabsContent value="exceptions" className="space-y-6">
          <LimitExceptionsCard clientId={params.id} isAdmin={isAdmin} />
        </TabsContent>
        
        {/* Request Exception Tab */}
        <TabsContent value="request" className="space-y-6">
          <RequestLimitExceptionForm 
            clientId={params.id}
            clientName={client.name}
            onSuccess={() => setActiveTab('exceptions')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
