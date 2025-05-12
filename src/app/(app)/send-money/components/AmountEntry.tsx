'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DollarSign, RefreshCw, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useTransfer } from '@/context/transfer-context';
import { getExchangeRate, calculateFee } from '@/services/transfer-service';
import { handleApiError } from '@/utils/api-error-handler';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const AmountEntry: React.FC = () => {
  const { state, dispatch } = useTransfer();
  const { toast } = useToast();
  const [sendAmount, setSendAmount] = useState<string>(state.amount?.toString() || '');
  const [exchangeRate, setExchangeRate] = useState<number>(state.exchangeRate || 1);
  const [fee, setFee] = useState<number>(state.fee || 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']);
  
  // Initialize currencies if not set
  useEffect(() => {
    if (!state.sourceCurrency) {
      dispatch({ type: 'SET_SOURCE_CURRENCY', payload: 'USD' });
    }
    
    if (!state.targetCurrency) {
      dispatch({ type: 'SET_TARGET_CURRENCY', payload: 'EUR' });
    }
  }, []);
  
  // Update transfer state when amount changes
  useEffect(() => {
    if (sendAmount && !isNaN(parseFloat(sendAmount))) {
      const amount = parseFloat(sendAmount);
      dispatch({ type: 'SET_AMOUNT', payload: amount });
      
      // Calculate receive amount
      const receiveAmount = amount * exchangeRate;
      dispatch({ type: 'SET_RECEIVE_AMOUNT', payload: receiveAmount });
    }
  }, [sendAmount, exchangeRate, dispatch]);
  
  // Calculate fee when amount changes
  useEffect(() => {
    const calculateTransferFee = async () => {
      if (state.amount && state.amount > 0 && state.sourceCurrency && state.targetCurrency) {
        try {
          const calculatedFee = await calculateFee(
            state.amount,
            state.sourceCurrency,
            state.targetCurrency
          );
          setFee(calculatedFee);
          dispatch({ type: 'SET_FEE', payload: calculatedFee });
        } catch (error) {
          handleApiError(error, 'Failed to calculate fee');
        }
      }
    };
    
    calculateTransferFee();
  }, [state.amount, state.sourceCurrency, state.targetCurrency, dispatch]);
  
  // Fetch exchange rate when currencies change
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (state.sourceCurrency && state.targetCurrency) {
        setLoading(true);
        try {
          const rate = await getExchangeRate(
            state.sourceCurrency,
            state.targetCurrency
          );
          setExchangeRate(rate);
          dispatch({ type: 'SET_EXCHANGE_RATE', payload: rate });
          
          // Update receive amount with new exchange rate
          if (state.amount) {
            const receiveAmount = state.amount * rate;
            dispatch({ type: 'SET_RECEIVE_AMOUNT', payload: receiveAmount });
          }
        } catch (error) {
          handleApiError(error, 'Failed to fetch exchange rate');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchExchangeRate();
  }, [state.sourceCurrency, state.targetCurrency, dispatch]);
  
  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimals
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setSendAmount(sanitizedValue);
  };
  
  const handleSendCurrencyChange = (currency: string) => {
    dispatch({ type: 'SET_SOURCE_CURRENCY', payload: currency });
  };
  
  const handleReceiveCurrencyChange = (currency: string) => {
    dispatch({ type: 'SET_TARGET_CURRENCY', payload: currency });
  };
  
  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };
  
  const handleNext = () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to send.',
        variant: 'destructive'
      });
      return;
    }
    
    dispatch({ type: 'SET_STEP', payload: 4 });
  };
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2 rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-medium">Enter Amount</h2>
        </div>
        
        <Button 
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-5"
        >
          <span>Next</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {/* Amount entry */}
      <Card className="card-ios overflow-hidden border-border/50">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <motion.input
                  type="text"
                  value={sendAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "block w-full pl-10 pr-24 py-3 text-3xl font-semibold text-center rounded-[14px]",
                    "border-border/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                  )}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Select 
                    value={state.sourceCurrency || 'USD'} 
                    onValueChange={handleSendCurrencyChange}
                  >
                    <SelectTrigger className="w-20 h-10 border-0 bg-transparent">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange rate and conversion */}
      <div className="flex items-center justify-center space-x-4 bg-muted/30 py-3 rounded-[14px]">
        <div className="text-sm text-muted-foreground flex items-center">
          <span>1 {state.sourceCurrency || 'USD'} = {exchangeRate.toFixed(4)} {state.targetCurrency || 'EUR'}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exchange rates are updated in real-time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 rounded-full"
          onClick={() => {
            // Refresh exchange rate
            const fetchRate = async () => {
              if (!state.sourceCurrency || !state.targetCurrency) return;
              
              setLoading(true);
              try {
                const rate = await getExchangeRate(
                  state.sourceCurrency,
                  state.targetCurrency
                );
                setExchangeRate(rate);
                dispatch({ type: 'SET_EXCHANGE_RATE', payload: rate });
                
                toast({
                  title: 'Exchange Rate Updated',
                  description: `1 ${state.sourceCurrency} = ${rate.toFixed(4)} ${state.targetCurrency}`,
                });
              } catch (error) {
                handleApiError(error, 'Failed to update exchange rate');
              } finally {
                setLoading(false);
              }
            };
            fetchRate();
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 text-primary ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Fee and total */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-ios overflow-hidden border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Fee</p>
            <p className="text-xl font-semibold">
              {state.sourceCurrency || 'USD'} {fee.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="card-ios overflow-hidden border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">You Send</p>
            <p className="text-xl font-semibold">
              {state.sourceCurrency || 'USD'} {((parseFloat(sendAmount) || 0) + fee).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="card-ios overflow-hidden border-primary/20">
          <CardContent className="p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground mb-1">Recipient Gets</p>
            <p className="text-xl font-semibold text-primary">
              {state.targetCurrency || 'EUR'} {state.receiveAmount?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recipient currency selection */}
      <Card className="card-ios overflow-hidden border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Recipient Currency</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableCurrencies.map((currency) => (
              <div 
                key={currency}
                onClick={() => handleReceiveCurrencyChange(currency)}
                className={cn(
                  "p-3 border rounded-[14px] cursor-pointer transition-all text-center",
                  state.targetCurrency === currency 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <p className="font-medium">{currency}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery time */}
      <Card className="card-ios overflow-hidden border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Delivery Time</h3>
              <p className="text-muted-foreground">Estimated time for funds to arrive</p>
            </div>
            <div className="text-right bg-success/10 px-4 py-2 rounded-[14px]">
              <p className="text-success font-medium">Within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
