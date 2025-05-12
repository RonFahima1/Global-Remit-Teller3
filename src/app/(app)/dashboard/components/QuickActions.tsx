/**
 * Quick Actions Component
 * Provides shortcuts to common operations on the dashboard
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  SendHorizontal, 
  Download, 
  Upload, 
  RefreshCw, 
  UserPlus,
  Search,
  Calculator,
  FileText
} from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
}

/**
 * Quick Actions Component
 */
export function QuickActions() {
  const router = useRouter();
  
  // Define quick actions
  const quickActions: QuickAction[] = [
    {
      icon: <SendHorizontal className="h-5 w-5" />,
      label: 'Send Money',
      description: 'Start a new money transfer',
      href: '/transfer',
      color: 'bg-blue-500 text-white'
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: 'Deposit',
      description: 'Process a deposit',
      href: '/deposit',
      color: 'bg-green-500 text-white'
    },
    {
      icon: <Upload className="h-5 w-5" />,
      label: 'Withdrawal',
      description: 'Process a withdrawal',
      href: '/withdrawal',
      color: 'bg-red-500 text-white'
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      label: 'Exchange',
      description: 'Currency exchange',
      href: '/currency-exchange',
      color: 'bg-purple-500 text-white'
    },
    {
      icon: <UserPlus className="h-5 w-5" />,
      label: 'New Client',
      description: 'Register a new client',
      href: '/clients/new',
      color: 'bg-orange-500 text-white'
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: 'Find Client',
      description: 'Search for a client',
      href: '/clients',
      color: 'bg-indigo-500 text-white'
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      label: 'Cash Register',
      description: 'Manage cash drawer',
      href: '/cash-register',
      color: 'bg-emerald-500 text-white'
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Reports',
      description: 'Generate reports',
      href: '/reports',
      color: 'bg-gray-700 text-white'
    }
  ];
  
  // Handle action click
  const handleActionClick = (href: string) => {
    router.push(href);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Shortcuts to common operations</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2 hover:bg-muted"
              onClick={() => handleActionClick(action.href)}
            >
              <div className={`p-2 rounded-full ${action.color}`}>
                {action.icon}
              </div>
              <span className="font-medium text-sm">{action.label}</span>
              <span className="text-xs text-muted-foreground text-center">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
