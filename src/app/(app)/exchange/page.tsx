'use client';

import type { Country } from '@/services/country-code';
import { getCountries } from '@/services/country-code';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, Check, Search, UserPlus, Loader2, Info, ArrowRight, RefreshCw } from 'lucide-react';
import { CustomerSearch } from '@/components/customer/CustomerSearch';
import { cn } from '@/lib/utils';
import Link from 'next/link'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import { LoadingState, LoadingCard } from '@/components/ui/loading-state';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableHeader, TableBody, TableHead, TableRow } from '@/components/ui/table';

const MOCK_RATE_USD_ILS = 3.6900; 

const exchangeSchema = z.object({
  payAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  payCurrency: z.string(),
  receiveAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  receiveCurrency: z.string(),
});

type ExchangeFormData = z.infer<typeof exchangeSchema>;

export default function ExchangePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState<'pay' | 'receive'>('pay');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showRateInfo, setShowRateInfo] = useState(false);
  const [isRateUpdating, setIsRateUpdating] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<Date>(new Date());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      payCurrency: 'USD',
      receiveCurrency: 'ILS',
    },
  });

  const payAmount = watch('payAmount');
  const receiveAmount = watch('receiveAmount');
  const payCurrency = watch('payCurrency');
  const receiveCurrency = watch('receiveCurrency');

  const [rate, setRate] = useState<number>(MOCK_RATE_USD_ILS);
  const [totalPaid, setTotalPaid] = useState<string>('0');
  const [exchangeAmountDisplay, setExchangeAmountDisplay] = useState<string>('');
  const [returnToCustomer, setReturnToCustomer] = useState<string>('');

  // Function to update exchange rate
  const updateRate = async () => {
    setIsRateUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      let calculatedRate = 1;
      if (payCurrency === 'USD' && receiveCurrency === 'ILS') {
        calculatedRate = MOCK_RATE_USD_ILS;
      } else if (payCurrency === 'ILS' && receiveCurrency === 'USD') {
        calculatedRate = 1 / MOCK_RATE_USD_ILS;
      } else if (payCurrency === receiveCurrency) {
        calculatedRate = 1;
      }
      setRate(calculatedRate);
      setLastRateUpdate(new Date());
    } catch (error) {
      console.error('Error updating rate:', error);
    } finally {
      setIsRateUpdating(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await updateRate();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [payCurrency, receiveCurrency]);

  useEffect(() => {
    if (editingField === 'pay') {
      const amount = parseFloat(payAmount);
      if (!isNaN(amount) && rate > 0) {
        setValue('receiveAmount', (amount * rate).toFixed(2));
        setExchangeAmountDisplay(amount.toFixed(2));
        setTotalPaid(amount.toFixed(2));
        setReturnToCustomer('0.00');
      } else {
        setValue('receiveAmount', '');
        setExchangeAmountDisplay('');
        setTotalPaid('0');
        setReturnToCustomer('');
      }
    }
  }, [payAmount, rate, editingField, setValue]);

  useEffect(() => {
    if (editingField === 'receive') {
      const amount = parseFloat(receiveAmount);
      if (!isNaN(amount) && rate > 0) {
        const calculatedPayAmount = (amount / rate).toFixed(2);
        setValue('payAmount', calculatedPayAmount);
        setExchangeAmountDisplay(calculatedPayAmount);
        setTotalPaid(calculatedPayAmount);
        setReturnToCustomer('0.00');
      } else {
        setValue('payAmount', '');
        setExchangeAmountDisplay('');
        setTotalPaid('0');
        setReturnToCustomer('');
      }
    }
  }, [receiveAmount, rate, editingField, setValue]);

  const handleSwapCurrencies = () => {
    const tempCurrency = payCurrency;
    setValue('payCurrency', receiveCurrency);
    setValue('receiveCurrency', tempCurrency);
    updateRate();
  };

  const handleClientSearch = (searchParams: any) => {
    console.log("Searching for client (Exchange):", searchParams);
    if (searchParams.type === 'phone' && searchParams.value === '502345678') {
      setSelectedClient({ name: 'Jane Smith', id: 'CUST002' });
    } else {
      setSelectedClient(null);
    }
  };

  const onSubmit = async (data: ExchangeFormData) => {
    try {
      setIsLoading(true);
      
      if (!selectedClient) {
        throw new Error('Please select a client first');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      alert('Exchange processed successfully!');
      
      // Reset form
      setValue('payAmount', '');
      setValue('receiveAmount', '');
      setExchangeAmountDisplay('');
      setTotalPaid('0');
      setReturnToCustomer('');
    } catch (error) {
      console.error('Error processing exchange:', error);
      alert(error instanceof Error ? error.message : 'Error processing exchange');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading exchange rates..." />;
  }

  return (
    <div className="w-full flex flex-col flex-1 px-4 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 w-full flex-1">
        {/* Main Exchange Form */}
        <div className="space-y-6 w-full flex-1">
          <Card className="border-0 shadow-lg w-full h-full flex-1 flex">
            <CardHeader className="pb-4">
              <CardTitle>Currency Exchange</CardTitle>
              <CardDescription>Convert between currencies at the best rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 w-full h-full flex-1 flex flex-col">
              {/* Exchange Form */}
              <div className="grid gap-6">
                {/* From Currency */}
                <div className="space-y-4">
                  <Label>From Currency</Label>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <div className="relative">
                      <Select
                        value={payCurrency}
                        onValueChange={(value) => {
                          setValue('payCurrency', value);
                          setEditingField('pay');
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="ILS">ILS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="Amount" 
                      className="h-11"
                      {...register('payAmount')}
                      onChange={(e) => {
                        setValue('payAmount', e.target.value);
                        setEditingField('pay');
                      }}
                    />
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full rotate-90 md:rotate-0"
                    onClick={handleSwapCurrencies}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Currency */}
                <div className="space-y-4">
                  <Label>To Currency</Label>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <div className="relative">
                      <Select
                        value={receiveCurrency}
                        onValueChange={(value) => {
                          setValue('receiveCurrency', value);
                          setEditingField('receive');
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="ILS">ILS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="Amount" 
                      className="h-11"
                      {...register('receiveAmount')}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Exchange Rate Display */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Exchange Rate</p>
                  <p className="text-2xl font-bold mt-1">{rate.toFixed(4)}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={updateRate}
                        disabled={isRateUpdating}
                        className="h-9"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {isRateUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Update Rate'
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Last updated: {lastRateUpdate.toLocaleTimeString()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Transaction Summary */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Transaction Summary</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Label className="text-sm text-muted-foreground">Total Paid</Label>
                    <p className="text-2xl font-medium mt-1">
                      {totalPaid} <span className="text-sm text-muted-foreground">{payCurrency}</span>
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Label className="text-sm text-muted-foreground">Exchange Amount</Label>
                    <p className="text-2xl font-medium mt-1">
                      {exchangeAmountDisplay} <span className="text-sm text-muted-foreground">{payCurrency}</span>
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Label className="text-sm text-muted-foreground">Return Amount</Label>
                    <p className="text-2xl font-medium mt-1">
                      {returnToCustomer} <span className="text-sm text-muted-foreground">{payCurrency}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  form="exchange-form"
                  className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!selectedClient || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Exchange Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex-1 h-11">
                  Save Quote
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exchanges */}
          <Card className="border-0 shadow-lg w-full h-full flex-1 flex">
            <CardHeader className="pb-4">
              <CardTitle>Recent Exchanges</CardTitle>
              <CardDescription>Your last 5 currency exchanges</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Add table rows here */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div>
          <Card className="border-0 shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
              <CardDescription>Search and select a customer</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSearch
                onSearch={handleClientSearch}
                defaultTab="phone"
              />

              <AnimatePresence mode="wait">
                {selectedClient && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border p-4 rounded-xl bg-muted/50 space-y-2"
                  >
                    <p className="font-medium">Selected Customer</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedClient.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {selectedClient.id}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
