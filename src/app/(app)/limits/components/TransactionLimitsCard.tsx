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

interface TransactionLimitsCardProps {
  clientId?: string;
  isAdmin?: boolean;
}

export function TransactionLimitsCard({ clientId, isAdmin = false }: TransactionLimitsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  
  // Mock transaction limits data
  const [limits, setLimits] = useState({
    daily: {
      enabled: true,
      amount: 5000,
      currency: 'USD',
    },
    weekly: {
      enabled: true,
      amount: 20000,
      currency: 'USD',
    },
    monthly: {
      enabled: true,
      amount: 50000,
      currency: 'USD',
    },
    perTransaction: {
      enabled: true,
      amount: 2000,
      currency: 'USD',
    }
  });
  
  // Mock usage data
  const usage = {
    daily: {
      used: 1250,
      remaining: limits.daily.enabled ? limits.daily.amount - 1250 : null,
      percentage: limits.daily.enabled ? (1250 / limits.daily.amount) * 100 : 0,
    },
    weekly: {
      used: 4500,
      remaining: limits.weekly.enabled ? limits.weekly.amount - 4500 : null,
      percentage: limits.weekly.enabled ? (4500 / limits.weekly.amount) * 100 : 0,
    },
    monthly: {
      used: 12000,
      remaining: limits.monthly.enabled ? limits.monthly.amount - 12000 : null,
      percentage: limits.monthly.enabled ? (12000 / limits.monthly.amount) * 100 : 0,
    },
    perTransaction: {
      used: 0,
      remaining: limits.perTransaction.enabled ? limits.perTransaction.amount : null,
      percentage: 0,
    }
  };
  
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'JPY'];
  
  const handleLimitChange = (period: keyof typeof limits, field: string, value: any) => {
    setLimits(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        [field]: field === 'amount' ? parseFloat(value) || 0 : value
      }
    }));
  };
  
  const handleSave = () => {
    // Validate limits
    if (limits.daily.enabled && limits.daily.amount <= 0) {
      setError('Daily limit amount must be greater than 0');
      return;
    }
    
    if (limits.weekly.enabled && limits.weekly.amount <= 0) {
      setError('Weekly limit amount must be greater than 0');
      return;
    }
    
    if (limits.monthly.enabled && limits.monthly.amount <= 0) {
      setError('Monthly limit amount must be greater than 0');
      return;
    }
    
    if (limits.perTransaction.enabled && limits.perTransaction.amount <= 0) {
      setError('Per transaction limit amount must be greater than 0');
      return;
    }
    
    // In a real app, this would be an API call to save the limits
    console.log('Saving limits:', limits);
    setError('');
    setIsEditing(false);
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
          <CardTitle className="text-h3 font-h3 text-card-foreground">Transaction Limits</CardTitle>
          <CardDescription className="text-muted-foreground">
            {clientId 
              ? 'Transaction limits for this client' 
              : 'System-wide transaction limits'}
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
        
        {/* Daily Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="daily-limit" className="text-sm font-medium">Daily Limit</Label>
            {isAdmin && isEditing && (
              <Switch 
                checked={limits.daily.enabled} 
                onCheckedChange={(checked) => handleLimitChange('daily', 'enabled', checked)} 
              />
            )}
          </div>
          
          {isEditing && isAdmin ? (
            <div className="flex space-x-2">
              <Input
                id="daily-limit"
                type="number"
                value={limits.daily.amount}
                onChange={(e) => handleLimitChange('daily', 'amount', e.target.value)}
                disabled={!limits.daily.enabled}
                className="flex-1"
              />
              <Select
                value={limits.daily.currency}
                onValueChange={(value) => handleLimitChange('daily', 'currency', value)}
                disabled={!limits.daily.enabled}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {limits.daily.enabled 
                    ? formatCurrency(limits.daily.amount, limits.daily.currency)
                    : 'No limit'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {limits.daily.enabled && usage.daily.remaining !== null
                    ? `${formatCurrency(usage.daily.used, limits.daily.currency)} used`
                    : ''}
                </p>
              </div>
              
              {limits.daily.enabled && (
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(usage.daily.percentage)}`} 
                    style={{ width: getProgressWidth(usage.daily.percentage) }}
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Weekly Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="weekly-limit" className="text-sm font-medium">Weekly Limit</Label>
            {isAdmin && isEditing && (
              <Switch 
                checked={limits.weekly.enabled} 
                onCheckedChange={(checked) => handleLimitChange('weekly', 'enabled', checked)} 
              />
            )}
          </div>
          
          {isEditing && isAdmin ? (
            <div className="flex space-x-2">
              <Input
                id="weekly-limit"
                type="number"
                value={limits.weekly.amount}
                onChange={(e) => handleLimitChange('weekly', 'amount', e.target.value)}
                disabled={!limits.weekly.enabled}
                className="flex-1"
              />
              <Select
                value={limits.weekly.currency}
                onValueChange={(value) => handleLimitChange('weekly', 'currency', value)}
                disabled={!limits.weekly.enabled}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {limits.weekly.enabled 
                    ? formatCurrency(limits.weekly.amount, limits.weekly.currency)
                    : 'No limit'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {limits.weekly.enabled && usage.weekly.remaining !== null
                    ? `${formatCurrency(usage.weekly.used, limits.weekly.currency)} used`
                    : ''}
                </p>
              </div>
              
              {limits.weekly.enabled && (
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(usage.weekly.percentage)}`} 
                    style={{ width: getProgressWidth(usage.weekly.percentage) }}
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Monthly Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="monthly-limit" className="text-sm font-medium">Monthly Limit</Label>
            {isAdmin && isEditing && (
              <Switch 
                checked={limits.monthly.enabled} 
                onCheckedChange={(checked) => handleLimitChange('monthly', 'enabled', checked)} 
              />
            )}
          </div>
          
          {isEditing && isAdmin ? (
            <div className="flex space-x-2">
              <Input
                id="monthly-limit"
                type="number"
                value={limits.monthly.amount}
                onChange={(e) => handleLimitChange('monthly', 'amount', e.target.value)}
                disabled={!limits.monthly.enabled}
                className="flex-1"
              />
              <Select
                value={limits.monthly.currency}
                onValueChange={(value) => handleLimitChange('monthly', 'currency', value)}
                disabled={!limits.monthly.enabled}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {limits.monthly.enabled 
                    ? formatCurrency(limits.monthly.amount, limits.monthly.currency)
                    : 'No limit'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {limits.monthly.enabled && usage.monthly.remaining !== null
                    ? `${formatCurrency(usage.monthly.used, limits.monthly.currency)} used`
                    : ''}
                </p>
              </div>
              
              {limits.monthly.enabled && (
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(usage.monthly.percentage)}`} 
                    style={{ width: getProgressWidth(usage.monthly.percentage) }}
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Per Transaction Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="per-transaction-limit" className="text-sm font-medium">Per Transaction Limit</Label>
            {isAdmin && isEditing && (
              <Switch 
                checked={limits.perTransaction.enabled} 
                onCheckedChange={(checked) => handleLimitChange('perTransaction', 'enabled', checked)} 
              />
            )}
          </div>
          
          {isEditing && isAdmin ? (
            <div className="flex space-x-2">
              <Input
                id="per-transaction-limit"
                type="number"
                value={limits.perTransaction.amount}
                onChange={(e) => handleLimitChange('perTransaction', 'amount', e.target.value)}
                disabled={!limits.perTransaction.enabled}
                className="flex-1"
              />
              <Select
                value={limits.perTransaction.currency}
                onValueChange={(value) => handleLimitChange('perTransaction', 'currency', value)}
                disabled={!limits.perTransaction.enabled}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="font-medium">
              {limits.perTransaction.enabled 
                ? formatCurrency(limits.perTransaction.amount, limits.perTransaction.currency)
                : 'No limit'}
            </p>
          )}
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
