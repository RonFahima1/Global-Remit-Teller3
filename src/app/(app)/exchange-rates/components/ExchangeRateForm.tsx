/**
 * Exchange Rate Form Component
 * Form for creating and editing exchange rates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ExchangeRate, ExchangeRateSource } from '@/types/exchange-rate';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { toast } from 'sonner';

/**
 * Form Schema
 */
const formSchema = z.object({
  baseCurrency: z.string().min(3, 'Base currency is required'),
  targetCurrency: z.string().min(3, 'Target currency is required'),
  rate: z.coerce.number().positive('Rate must be positive'),
  marginPercentage: z.coerce.number().min(0, 'Margin must be non-negative').max(20, 'Margin cannot exceed 20%'),
  effectiveDate: z.string().optional(),
  expirationDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  source: z.nativeEnum(ExchangeRateSource).default(ExchangeRateSource.MANUAL)
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Exchange Rate Form Props
 */
interface ExchangeRateFormProps {
  isOpen: boolean;
  onClose: () => void;
  rateToEdit?: ExchangeRate;
}

/**
 * Exchange Rate Form Component
 */
export function ExchangeRateForm({ isOpen, onClose, rateToEdit }: ExchangeRateFormProps) {
  const { createRate, updateRate, isLoading, error, resetError } = useExchangeRates();
  const [currencies] = useState<string[]>([
    'USD', 'EUR', 'ILS', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR'
  ]);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseCurrency: '',
      targetCurrency: '',
      rate: 1,
      marginPercentage: 2.5,
      effectiveDate: new Date().toISOString().split('T')[0],
      expirationDate: null,
      isActive: true,
      source: ExchangeRateSource.MANUAL
    }
  });
  
  // Update form when editing an existing rate
  useEffect(() => {
    if (rateToEdit) {
      form.reset({
        baseCurrency: rateToEdit.baseCurrency,
        targetCurrency: rateToEdit.targetCurrency,
        rate: rateToEdit.rate,
        marginPercentage: rateToEdit.marginPercentage,
        effectiveDate: rateToEdit.effectiveDate.split('T')[0],
        expirationDate: rateToEdit.expirationDate ? rateToEdit.expirationDate.split('T')[0] : null,
        isActive: rateToEdit.isActive,
        source: rateToEdit.source
      });
    } else {
      form.reset({
        baseCurrency: '',
        targetCurrency: '',
        rate: 1,
        marginPercentage: 2.5,
        effectiveDate: new Date().toISOString().split('T')[0],
        expirationDate: null,
        isActive: true,
        source: ExchangeRateSource.MANUAL
      });
    }
  }, [rateToEdit, form]);
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      // In a real app, we would get the user ID from authentication
      const userId = 'current-user';
      
      if (rateToEdit) {
        // Update existing rate
        await updateRate(rateToEdit.id, values, userId);
        toast.success('Exchange rate updated successfully');
      } else {
        // Create new rate
        await createRate(values, userId);
        toast.success('Exchange rate created successfully');
      }
      
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  // Handle dialog close
  const handleClose = () => {
    resetError();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {rateToEdit ? 'Edit Exchange Rate' : 'Create Exchange Rate'}
          </DialogTitle>
          <DialogDescription>
            {rateToEdit 
              ? 'Update the exchange rate details below.' 
              : 'Enter the details for the new exchange rate.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading || (!!rateToEdit)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The currency you're converting from
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading || (!!rateToEdit)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The currency you're converting to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Rate</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.0001"
                        min="0.0001"
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Rate for 1 unit of base currency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="marginPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        max="20"
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Profit margin percentage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      When this rate becomes active
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ''} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      When this rate expires
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ExchangeRateSource.MANUAL}>Manual</SelectItem>
                        <SelectItem value={ExchangeRateSource.API}>API</SelectItem>
                        <SelectItem value={ExchangeRateSource.PARTNER}>Partner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Source of the exchange rate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Is this exchange rate active?
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    {rateToEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  rateToEdit ? 'Update Rate' : 'Create Rate'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
