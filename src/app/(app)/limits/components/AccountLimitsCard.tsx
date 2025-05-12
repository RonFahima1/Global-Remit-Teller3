'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit2, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/format';

interface AccountLimitsCardProps {
  clientId?: string;
  isAdmin?: boolean;
}

export function AccountLimitsCard({ clientId, isAdmin = false }: AccountLimitsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  
  // Mock account limits data
  const [limits, setLimits] = useState({
    maxBalance: {
      USD: {
        enabled: true,
        amount: 50000,
      },
      EUR: {
        enabled: true,
        amount: 45000,
      },
      ILS: {
        enabled: true,
        amount: 175000,
      },
      GBP: {
        enabled: false,
        amount: 0,
      },
      JPY: {
        enabled: false,
        amount: 0,
      },
    },
    inactivityPeriod: {
      enabled: true,
      days: 90,
    },
  });
  
  // Mock current balances
  const currentBalances = {
    USD: 12500,
    EUR: 8750,
    ILS: 42000,
    GBP: 0,
    JPY: 0,
  };
  
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'JPY'];
  
  const handleMaxBalanceChange = (currency: string, field: string, value: any) => {
    setLimits(prev => ({
      ...prev,
      maxBalance: {
        ...prev.maxBalance,
        [currency]: {
          ...prev.maxBalance[currency as keyof typeof prev.maxBalance],
          [field]: field === 'amount' ? parseFloat(value) || 0 : value
        }
      }
    }));
  };
  
  const handleInactivityChange = (field: string, value: any) => {
    setLimits(prev => ({
      ...prev,
      inactivityPeriod: {
        ...prev.inactivityPeriod,
        [field]: field === 'days' ? parseInt(value) || 0 : value
      }
    }));
  };
  
  const handleSave = () => {
    // Validate limits
    let hasError = false;
    
    currencies.forEach(currency => {
      if (limits.maxBalance[currency as keyof typeof limits.maxBalance].enabled && 
          limits.maxBalance[currency as keyof typeof limits.maxBalance].amount <= 0) {
        setError(`Maximum balance for ${currency} must be greater than 0`);
        hasError = true;
      }
    });
    
    if (limits.inactivityPeriod.enabled && limits.inactivityPeriod.days <= 0) {
      setError('Inactivity period must be greater than 0 days');
      hasError = true;
    }
    
    if (hasError) return;
    
    // In a real app, this would be an API call to save the limits
    console.log('Saving account limits:', limits);
    setError('');
    setIsEditing(false);
  };
  
  // Calculate usage percentage
  const getBalancePercentage = (currency: string) => {
    const limit = limits.maxBalance[currency as keyof typeof limits.maxBalance];
    if (!limit.enabled || limit.amount === 0) return 0;
    
    const balance = currentBalances[currency as keyof typeof currentBalances] || 0;
    return (balance / limit.amount) * 100;
  };
  
  // Calculate progress bar width
  const getProgressWidth = (percentage: number) => {
    return `${Math.min(percentage, 100)}%`;
  };
  
  // Get color based on usage percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Account Limits</CardTitle>
          <CardDescription className="text-muted-foreground">
            {clientId 
              ? 'Account balance limits for this client' 
              : 'System-wide account balance limits'}
          </CardDescription>
        </div>
        {isAdmin && (
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
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Maximum Balance Limits */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Maximum Balance Limits</h3>
          
          {currencies.map(currency => (
            <div key={currency} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`max-balance-${currency}`} className="text-sm">{currency}</Label>
                {isAdmin && isEditing && (
                  <Switch 
                    checked={limits.maxBalance[currency as keyof typeof limits.maxBalance].enabled} 
                    onCheckedChange={(checked) => handleMaxBalanceChange(currency, 'enabled', checked)} 
                  />
                )}
              </div>
              
              {isEditing && isAdmin ? (
                <Input
                  id={`max-balance-${currency}`}
                  type="number"
                  value={limits.maxBalance[currency as keyof typeof limits.maxBalance].amount}
                  onChange={(e) => handleMaxBalanceChange(currency, 'amount', e.target.value)}
                  disabled={!limits.maxBalance[currency as keyof typeof limits.maxBalance].enabled}
                  className="w-full"
                />
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      {limits.maxBalance[currency as keyof typeof limits.maxBalance].enabled 
                        ? formatCurrency(limits.maxBalance[currency as keyof typeof limits.maxBalance].amount, currency)
                        : 'No limit'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {limits.maxBalance[currency as keyof typeof limits.maxBalance].enabled
                        ? `${formatCurrency(currentBalances[currency as keyof typeof currentBalances] || 0, currency)} current`
                        : ''}
                    </p>
                  </div>
                  
                  {limits.maxBalance[currency as keyof typeof limits.maxBalance].enabled && (
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(getBalancePercentage(currency))}`} 
                        style={{ width: getProgressWidth(getBalancePercentage(currency)) }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Inactivity Period */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label htmlFor="inactivity-period" className="text-sm font-medium">Account Inactivity Period</Label>
            {isAdmin && isEditing && (
              <Switch 
                checked={limits.inactivityPeriod.enabled} 
                onCheckedChange={(checked) => handleInactivityChange('enabled', checked)} 
              />
            )}
          </div>
          
          {isEditing && isAdmin ? (
            <div className="flex items-center space-x-2">
              <Input
                id="inactivity-period"
                type="number"
                value={limits.inactivityPeriod.days}
                onChange={(e) => handleInactivityChange('days', e.target.value)}
                disabled={!limits.inactivityPeriod.enabled}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          ) : (
            <p className="font-medium">
              {limits.inactivityPeriod.enabled 
                ? `${limits.inactivityPeriod.days} days`
                : 'No limit'}
            </p>
          )}
          
          <p className="text-xs text-muted-foreground">
            {limits.inactivityPeriod.enabled 
              ? 'Account will be flagged for review after this period of inactivity'
              : ''}
          </p>
        </div>
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
