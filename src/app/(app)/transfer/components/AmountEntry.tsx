/**
 * Amount Entry Component
 * Third step in the money transfer process
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, ChevronLeft, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { useCurrencyExchangeService } from '@/components/providers/service-provider';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

// Types
interface Sender {
  id: string;
  firstName: string;
  lastName: string;
}

interface Receiver {
  id: string;
  firstName: string;
  lastName: string;
  country?: string;
}

interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

interface TransferAmount {
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
}

interface AmountEntryProps {
  sender: Sender;
  receiver: Receiver;
  onAmountConfirmed: (amount: TransferAmount) => void;
  onBack: () => void;
}

/**
 * Amount Entry Component
 */
export function AmountEntry({ 
  sender, 
  receiver, 
  onAmountConfirmed, 
  onBack 
}: AmountEntryProps) {
  const currencyExchangeService = useCurrencyExchangeService();
  
  // State for form values
  const [sendAmount, setSendAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [sendCurrency, setSendCurrency] = useState<string>('USD');
  const [receiveCurrency, setReceiveCurrency] = useState<string>('EUR');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [fee, setFee] = useState<number>(0);
  const [calculationDirection, setCalculationDirection] = useState<'send' | 'receive'>('send');
  
  // Available currencies
  const sendCurrencies = ['USD', 'EUR', 'GBP', 'ILS', 'CAD', 'AUD'];
  const receiveCurrencies = ['USD', 'EUR', 'GBP', 'ILS', 'CAD', 'AUD'];
  
  // Fetch exchange rate when currencies change
  useEffect(() => {
    if (sendCurrency && receiveCurrency) {
      fetchExchangeRate();
    }
  }, [sendCurrency, receiveCurrency]);
  
  // Fetch exchange rate from service
  const fetchExchangeRate = async () => {
    try {
      setIsCalculating(true);
      const response = await currencyExchangeService.getExchangeRate(sendCurrency, receiveCurrency);
      setExchangeRate(response.rate);
      setLastUpdated(response.lastUpdated);
      
      // Calculate fee based on send amount and currencies
      if (sendAmount) {
        calculateFee(parseFloat(sendAmount), sendCurrency, receiveCurrency);
      }
      
      // Recalculate amounts based on new rate
      if (calculationDirection === 'send' && sendAmount) {
        calculateReceiveAmount(parseFloat(sendAmount), response.rate);
      } else if (calculationDirection === 'receive' && receiveAmount) {
        calculateSendAmount(parseFloat(receiveAmount), response.rate);
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      toast.error('Failed to fetch exchange rate');
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Calculate fee based on amount and currencies
  const calculateFee = async (amount: number, fromCurrency: string, toCurrency: string) => {
    try {
      const response = await currencyExchangeService.calculateFee(amount, fromCurrency, toCurrency);
      setFee(response.fee);
    } catch (error) {
      console.error('Error calculating fee:', error);
      toast.error('Failed to calculate fee');
    }
  };
  
  // Calculate receive amount based on send amount
  const calculateReceiveAmount = (amount: number, rate: number) => {
    if (amount && rate) {
      const calculated = amount * rate;
      setReceiveAmount(calculated.toFixed(2));
    } else {
      setReceiveAmount('');
    }
  };
  
  // Calculate send amount based on receive amount
  const calculateSendAmount = (amount: number, rate: number) => {
    if (amount && rate) {
      const calculated = amount / rate;
      setSendAmount(calculated.toFixed(2));
      
      // Recalculate fee based on new send amount
      calculateFee(calculated, sendCurrency, receiveCurrency);
    } else {
      setSendAmount('');
    }
  };
  
  // Handle send amount change
  const handleSendAmountChange = (value: string) => {
    setSendAmount(value);
    setCalculationDirection('send');
    
    const amount = parseFloat(value);
    if (!isNaN(amount) && exchangeRate) {
      calculateReceiveAmount(amount, exchangeRate);
      calculateFee(amount, sendCurrency, receiveCurrency);
    } else {
      setReceiveAmount('');
    }
  };
  
  // Handle receive amount change
  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    setCalculationDirection('receive');
    
    const amount = parseFloat(value);
    if (!isNaN(amount) && exchangeRate) {
      calculateSendAmount(amount, exchangeRate);
    } else {
      setSendAmount('');
    }
  };
  
  // Handle send currency change
  const handleSendCurrencyChange = (value: string) => {
    setSendCurrency(value);
    
    // If same currency selected, switch to a different one
    if (value === receiveCurrency) {
      // Find a different currency
      const otherCurrency = receiveCurrencies.find(c => c !== value) || 'EUR';
      setReceiveCurrency(otherCurrency);
    }
  };
  
  // Handle receive currency change
  const handleReceiveCurrencyChange = (value: string) => {
    setReceiveCurrency(value);
    
    // If same currency selected, switch to a different one
    if (value === sendCurrency) {
      // Find a different currency
      const otherCurrency = sendCurrencies.find(c => c !== value) || 'USD';
      setSendCurrency(otherCurrency);
    }
  };
  
  // Swap currencies and amounts
  const handleSwapCurrencies = () => {
    const tempCurrency = sendCurrency;
    const tempAmount = sendAmount;
    
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(tempCurrency);
    
    // Reset amounts to trigger recalculation
    setSendAmount('');
    setReceiveAmount('');
    
    // Fetch new exchange rate
    fetchExchangeRate();
  };
  
  // Handle continue button click
  const handleContinue = () => {
    const sendAmountValue = parseFloat(sendAmount);
    const receiveAmountValue = parseFloat(receiveAmount);
    
    if (isNaN(sendAmountValue) || sendAmountValue <= 0) {
      toast.error('Please enter a valid send amount');
      return;
    }
    
    if (isNaN(receiveAmountValue) || receiveAmountValue <= 0) {
      toast.error('Please enter a valid receive amount');
      return;
    }
    
    if (!exchangeRate) {
      toast.error('Exchange rate is not available');
      return;
    }
    
    // Calculate total cost (send amount + fee)
    const totalCost = sendAmountValue + fee;
    
    // Create transfer amount object
    const transferAmount: TransferAmount = {
      sendAmount: sendAmountValue,
      receiveAmount: receiveAmountValue,
      sendCurrency,
      receiveCurrency,
      exchangeRate,
      fee,
      totalCost
    };
    
    onAmountConfirmed(transferAmount);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Transfer Amount</CardTitle>
        <CardDescription>
          Specify how much {sender.firstName} {sender.lastName} will send to {receiver.firstName} {receiver.lastName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send" onClick={() => setCalculationDirection('send')}>
              Send Amount
            </TabsTrigger>
            <TabsTrigger value="receive" onClick={() => setCalculationDirection('receive')}>
              Receive Amount
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sendAmount">Send Amount</Label>
                <div className="flex">
                  <Select value={sendCurrency} onValueChange={handleSendCurrencyChange}>
                    <SelectTrigger className="w-[100px] rounded-r-none">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {sendCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="sendAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="rounded-l-none"
                    value={sendAmount}
                    onChange={(e) => handleSendAmountChange(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiveAmount">Receive Amount</Label>
                <div className="flex">
                  <Select value={receiveCurrency} onValueChange={handleReceiveCurrencyChange}>
                    <SelectTrigger className="w-[100px] rounded-r-none">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {receiveCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="receiveAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="rounded-l-none"
                    value={receiveAmount}
                    onChange={(e) => handleReceiveAmountChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center my-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full p-2" 
                onClick={handleSwapCurrencies}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exchange Rate</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    1 {sendCurrency} = {exchangeRate ? exchangeRate.toFixed(4) : '—'} {receiveCurrency}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-6 w-6 p-0" 
                    onClick={fetchExchangeRate}
                    disabled={isCalculating}
                  >
                    <RefreshCw className={`h-3 w-3 ${isCalculating ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {lastUpdated && (
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transfer Fee</span>
                <span className="text-sm font-medium">
                  {formatCurrency(fee, sendCurrency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Total Cost</span>
                <span className="text-sm font-bold">
                  {sendAmount ? formatCurrency(parseFloat(sendAmount) + fee, sendCurrency) : '—'}
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="receive" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receiveAmount2">Receive Amount</Label>
                <div className="flex">
                  <Select value={receiveCurrency} onValueChange={handleReceiveCurrencyChange}>
                    <SelectTrigger className="w-[100px] rounded-r-none">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {receiveCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="receiveAmount2"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="rounded-l-none"
                    value={receiveAmount}
                    onChange={(e) => handleReceiveAmountChange(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sendAmount2">Send Amount</Label>
                <div className="flex">
                  <Select value={sendCurrency} onValueChange={handleSendCurrencyChange}>
                    <SelectTrigger className="w-[100px] rounded-r-none">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {sendCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="sendAmount2"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="rounded-l-none"
                    value={sendAmount}
                    onChange={(e) => handleSendAmountChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center my-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full p-2" 
                onClick={handleSwapCurrencies}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exchange Rate</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    1 {sendCurrency} = {exchangeRate ? exchangeRate.toFixed(4) : '—'} {receiveCurrency}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-6 w-6 p-0" 
                    onClick={fetchExchangeRate}
                    disabled={isCalculating}
                  >
                    <RefreshCw className={`h-3 w-3 ${isCalculating ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {lastUpdated && (
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transfer Fee</span>
                <span className="text-sm font-medium">
                  {formatCurrency(fee, sendCurrency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Total Cost</span>
                <span className="text-sm font-bold">
                  {sendAmount ? formatCurrency(parseFloat(sendAmount) + fee, sendCurrency) : '—'}
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!sendAmount || !receiveAmount || !exchangeRate || isCalculating}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
