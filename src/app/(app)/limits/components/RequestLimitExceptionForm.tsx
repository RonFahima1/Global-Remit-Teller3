'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/utils/format';

interface RequestLimitExceptionFormProps {
  clientId?: string;
  clientName?: string;
  onSuccess?: () => void;
}

export function RequestLimitExceptionForm({ 
  clientId, 
  clientName,
  onSuccess 
}: RequestLimitExceptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    limitType: '',
    currency: 'USD',
    requestedAmount: '',
    reason: '',
    duration: '1',
  });
  
  // Mock current limits
  const currentLimits = {
    'daily': { amount: 3000, currency: 'USD' },
    'weekly': { amount: 10000, currency: 'USD' },
    'monthly': { amount: 30000, currency: 'USD' },
    'perTransaction': { amount: 1500, currency: 'USD' },
  };
  
  const limitTypeOptions = [
    { value: 'daily', label: 'Daily Limit' },
    { value: 'weekly', label: 'Weekly Limit' },
    { value: 'monthly', label: 'Monthly Limit' },
    { value: 'perTransaction', label: 'Per Transaction Limit' },
  ];
  
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'JPY'];
  
  const durationOptions = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
  ];
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear any previous errors
    setError('');
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.limitType) {
      setError('Please select a limit type');
      return;
    }
    
    if (!formData.requestedAmount || parseFloat(formData.requestedAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!formData.reason.trim()) {
      setError('Please provide a reason for this exception request');
      return;
    }
    
    // Start submission
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to submit the exception request
    setTimeout(() => {
      console.log('Submitting exception request:', {
        clientId,
        clientName,
        ...formData,
        requestedAmount: parseFloat(formData.requestedAmount),
      });
      
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          limitType: '',
          currency: 'USD',
          requestedAmount: '',
          reason: '',
          duration: '1',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }, 3000);
    }, 1500);
  };
  
  // Get current limit for the selected limit type
  const getCurrentLimit = () => {
    if (!formData.limitType || !currentLimits[formData.limitType as keyof typeof currentLimits]) {
      return null;
    }
    
    return currentLimits[formData.limitType as keyof typeof currentLimits];
  };
  
  const currentLimit = getCurrentLimit();

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3 text-card-foreground">Request Limit Exception</CardTitle>
        <CardDescription className="text-muted-foreground">
          {clientName 
            ? `Request a temporary limit increase for ${clientName}` 
            : 'Request a temporary limit increase for a client'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Exception request submitted successfully. A manager will review your request shortly.
            </AlertDescription>
          </Alert>
        )}
        
        {!success && (
          <div className="space-y-4">
            {/* Client selection would go here if clientId is not provided */}
            {!clientId && (
              <div className="space-y-2">
                <Label htmlFor="client-search">Client</Label>
                <Input
                  id="client-search"
                  placeholder="Search for a client..."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Please select a client before requesting a limit exception
                </p>
              </div>
            )}
            
            {/* Limit Type */}
            <div className="space-y-2">
              <Label htmlFor="limit-type">Limit Type</Label>
              <Select
                value={formData.limitType}
                onValueChange={(value) => handleChange('limitType', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="limit-type">
                  <SelectValue placeholder="Select limit type" />
                </SelectTrigger>
                <SelectContent>
                  {limitTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {currentLimit && (
                <p className="text-xs text-muted-foreground">
                  Current limit: {formatCurrency(currentLimit.amount, currentLimit.currency)}
                </p>
              )}
            </div>
            
            {/* Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="requested-amount">Requested Amount</Label>
                <Input
                  id="requested-amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.requestedAmount}
                  onChange={(e) => handleChange('requestedAmount', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleChange('currency', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="currency">
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
            </div>
            
            {/* Duration */}
            <div className="space-y-2">
              <Label>Exception Duration</Label>
              <RadioGroup
                value={formData.duration}
                onValueChange={(value) => handleChange('duration', value)}
                className="flex flex-wrap gap-2"
              >
                {durationOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`duration-${option.value}`} />
                    <Label htmlFor={`duration-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Exception</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for this limit exception request..."
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                disabled={isSubmitting}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Please provide specific details to help managers review your request quickly.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {!success && (
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !clientId}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
