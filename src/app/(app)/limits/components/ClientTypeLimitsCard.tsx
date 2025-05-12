'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit2, Save, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/format';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClientTypeLimitsCardProps {
  isAdmin?: boolean;
}

type ClientType = 'individual' | 'business' | 'vip';

interface LimitSettings {
  daily: {
    enabled: boolean;
    amount: number;
  };
  weekly: {
    enabled: boolean;
    amount: number;
  };
  monthly: {
    enabled: boolean;
    amount: number;
  };
  perTransaction: {
    enabled: boolean;
    amount: number;
  };
  maxBalance: {
    enabled: boolean;
    amount: number;
  };
}

export function ClientTypeLimitsCard({ isAdmin = false }: ClientTypeLimitsCardProps) {
  const [activeTab, setActiveTab] = useState<ClientType>('individual');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  // Mock client type limits data
  const [clientTypeLimits, setClientTypeLimits] = useState<Record<ClientType, LimitSettings>>({
    individual: {
      daily: {
        enabled: true,
        amount: 3000,
      },
      weekly: {
        enabled: true,
        amount: 10000,
      },
      monthly: {
        enabled: true,
        amount: 30000,
      },
      perTransaction: {
        enabled: true,
        amount: 1500,
      },
      maxBalance: {
        enabled: true,
        amount: 20000,
      },
    },
    business: {
      daily: {
        enabled: true,
        amount: 10000,
      },
      weekly: {
        enabled: true,
        amount: 50000,
      },
      monthly: {
        enabled: true,
        amount: 150000,
      },
      perTransaction: {
        enabled: true,
        amount: 5000,
      },
      maxBalance: {
        enabled: true,
        amount: 100000,
      },
    },
    vip: {
      daily: {
        enabled: true,
        amount: 25000,
      },
      weekly: {
        enabled: true,
        amount: 100000,
      },
      monthly: {
        enabled: true,
        amount: 300000,
      },
      perTransaction: {
        enabled: true,
        amount: 15000,
      },
      maxBalance: {
        enabled: true,
        amount: 250000,
      },
    },
  });
  
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'JPY'];
  
  const clientTypeLabels: Record<ClientType, string> = {
    individual: 'Individual',
    business: 'Business',
    vip: 'VIP Client',
  };
  
  const limitLabels: Record<keyof LimitSettings, string> = {
    daily: 'Daily Limit',
    weekly: 'Weekly Limit',
    monthly: 'Monthly Limit',
    perTransaction: 'Per Transaction',
    maxBalance: 'Maximum Balance',
  };
  
  const handleLimitChange = (limitType: keyof LimitSettings, field: string, value: any) => {
    setClientTypeLimits(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [limitType]: {
          ...prev[activeTab][limitType],
          [field]: field === 'amount' ? parseFloat(value) || 0 : value
        }
      }
    }));
  };
  
  const handleSave = () => {
    // Validate limits
    const currentLimits = clientTypeLimits[activeTab];
    let hasError = false;
    
    Object.keys(currentLimits).forEach((limitType) => {
      const limit = currentLimits[limitType as keyof LimitSettings];
      if (limit.enabled && limit.amount <= 0) {
        setError(`${limitLabels[limitType as keyof LimitSettings]} must be greater than 0`);
        hasError = true;
      }
    });
    
    if (hasError) return;
    
    // In a real app, this would be an API call to save the limits
    console.log('Saving client type limits:', { clientType: activeTab, limits: currentLimits, currency });
    setError('');
    setIsEditing(false);
  };

  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Client Type Limits</CardTitle>
          <CardDescription className="text-muted-foreground">
            Default transaction limits by client type
          </CardDescription>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Select value={currency} onValueChange={setCurrency} disabled={isEditing}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ClientType)}>
          <TabsList className="grid grid-cols-3 mb-4">
            {Object.keys(clientTypeLimits).map((type) => (
              <TabsTrigger key={type} value={type}>
                {clientTypeLabels[type as ClientType]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(clientTypeLimits).map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {isEditing ? (
                // Edit mode
                <div className="space-y-4">
                  {Object.keys(clientTypeLimits[type as ClientType]).map((limitType) => (
                    <div key={limitType} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`${type}-${limitType}`} className="text-sm font-medium">
                          {limitLabels[limitType as keyof LimitSettings]}
                        </Label>
                        <Switch 
                          checked={clientTypeLimits[type as ClientType][limitType as keyof LimitSettings].enabled} 
                          onCheckedChange={(checked) => handleLimitChange(limitType as keyof LimitSettings, 'enabled', checked)} 
                        />
                      </div>
                      
                      <Input
                        id={`${type}-${limitType}`}
                        type="number"
                        value={clientTypeLimits[type as ClientType][limitType as keyof LimitSettings].amount}
                        onChange={(e) => handleLimitChange(limitType as keyof LimitSettings, 'amount', e.target.value)}
                        disabled={!clientTypeLimits[type as ClientType][limitType as keyof LimitSettings].enabled}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // View mode
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Limit Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(clientTypeLimits[type as ClientType]).map((limitType) => {
                      const limit = clientTypeLimits[type as ClientType][limitType as keyof LimitSettings];
                      return (
                        <TableRow key={limitType}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {limitLabels[limitType as keyof LimitSettings]}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                                      <Info className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {limitType === 'daily' && 'Maximum amount allowed in a 24-hour period'}
                                      {limitType === 'weekly' && 'Maximum amount allowed in a 7-day period'}
                                      {limitType === 'monthly' && 'Maximum amount allowed in a 30-day period'}
                                      {limitType === 'perTransaction' && 'Maximum amount allowed per single transaction'}
                                      {limitType === 'maxBalance' && 'Maximum account balance allowed'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${limit.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {limit.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {limit.enabled ? formatCurrency(limit.amount, currency) : 'No limit'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {type === 'individual' && 'These limits apply to all standard individual clients by default.'}
                  {type === 'business' && 'These limits apply to all business clients by default.'}
                  {type === 'vip' && 'These limits apply to high-value clients with VIP status.'}
                </AlertDescription>
              </Alert>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      {isAdmin && isEditing && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
