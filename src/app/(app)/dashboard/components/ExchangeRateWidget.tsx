/**
 * Exchange Rate Widget Component
 * Displays live currency exchange rates and trends for the dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ArrowRightLeft,
  ExternalLink
} from 'lucide-react';
import { useCurrencyExchangeService } from '@/components/providers/service-provider';
import { toast } from 'sonner';

// Types
interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  change: number;
  lastUpdated: string;
}

interface PopularCurrencyPair {
  fromCurrency: string;
  toCurrency: string;
  label: string;
}

/**
 * Exchange Rate Widget Component
 */
export function ExchangeRateWidget() {
  const currencyExchangeService = useCurrencyExchangeService();
  
  const [isLoading, setIsLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Available currencies
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'CAD', 'AUD', 'JPY', 'CHF'];
  
  // Popular currency pairs
  const popularPairs: PopularCurrencyPair[] = [
    { fromCurrency: 'USD', toCurrency: 'EUR', label: 'USD/EUR' },
    { fromCurrency: 'EUR', toCurrency: 'USD', label: 'EUR/USD' },
    { fromCurrency: 'USD', toCurrency: 'GBP', label: 'USD/GBP' },
    { fromCurrency: 'USD', toCurrency: 'ILS', label: 'USD/ILS' },
    { fromCurrency: 'EUR', toCurrency: 'GBP', label: 'EUR/GBP' },
  ];
  
  // Fetch exchange rates on mount and when currencies change
  useEffect(() => {
    fetchExchangeRates();
    
    // Set up interval to refresh rates every 5 minutes
    const intervalId = setInterval(fetchExchangeRates, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fromCurrency, toCurrency]);
  
  // Fetch exchange rates from service
  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      
      // Use mock data in development
      const { getMockExchangeRate } = await import('@/lib/mock-data');
      
      // Fetch selected pair
      const selectedRate = getMockExchangeRate(fromCurrency, toCurrency);
      
      // Fetch popular pairs
      const popularRates = popularPairs.map(pair => 
        getMockExchangeRate(pair.fromCurrency, pair.toCurrency)
      );
      
      // Combine rates
      const allRates = [selectedRate, ...popularRates];
      
      // Remove duplicates
      const uniqueRates = allRates.filter((rate, index, self) => 
        index === self.findIndex(r => 
          r.fromCurrency === rate.fromCurrency && r.toCurrency === rate.toCurrency
        )
      );
      
      setExchangeRates(uniqueRates);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      toast.error('Failed to fetch exchange rates');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchExchangeRates();
  };
  
  // Handle currency change
  const handleCurrencyChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      // If same currency selected, switch to a different one
      if (value === toCurrency) {
        setToCurrency(fromCurrency);
      }
      setFromCurrency(value);
    } else {
      // If same currency selected, switch to a different one
      if (value === fromCurrency) {
        setFromCurrency(toCurrency);
      }
      setToCurrency(value);
    }
  };
  
  // Format rate change
  const formatRateChange = (change: number) => {
    const isPositive = change > 0;
    const isNeutral = change === 0;
    
    const color = isNeutral
      ? 'text-gray-500'
      : isPositive
        ? 'text-green-500'
        : 'text-red-500';
    
    return (
      <div className={`flex items-center ${color}`}>
        {isNeutral ? (
          <span className="text-xs">No change</span>
        ) : isPositive ? (
          <>
            <TrendingUp className="mr-1 h-3 w-3" />
            <span className="text-xs">{change.toFixed(2)}%</span>
          </>
        ) : (
          <>
            <TrendingDown className="mr-1 h-3 w-3" />
            <span className="text-xs">{Math.abs(change).toFixed(2)}%</span>
          </>
        )}
      </div>
    );
  };
  
  // Get rate for selected currencies
  const getSelectedRate = () => {
    return exchangeRates.find(
      rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency
    );
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Exchange Rates</CardTitle>
          <CardDescription>Live currency exchange rates</CardDescription>
        </div>
        
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">From Currency</p>
            <Select value={fromCurrency} onValueChange={(value) => handleCurrencyChange('from', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={`from-${currency}`} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-center">
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">To Currency</p>
            <Select value={toCurrency} onValueChange={(value) => handleCurrencyChange('to', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={`to-${currency}`} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            {getSelectedRate() ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-1">{fromCurrency} to {toCurrency}</p>
                <p className="text-3xl font-bold">{getSelectedRate()?.rate.toFixed(4)}</p>
                <div className="flex items-center mt-1">
                  {formatRateChange(getSelectedRate()?.change || 0)}
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Popular Pairs</p>
            {lastUpdated && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {popularPairs.map((pair) => {
              const rate = exchangeRates.find(
                r => r.fromCurrency === pair.fromCurrency && r.toCurrency === pair.toCurrency
              );
              
              return (
                <Card key={pair.label}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{pair.label}</p>
                        {rate ? (
                          <p className="text-lg font-bold">{rate.rate.toFixed(4)}</p>
                        ) : (
                          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                        )}
                      </div>
                      {rate && formatRateChange(rate.change)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/currency-exchange'}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Currency Exchange
        </Button>
      </CardFooter>
    </Card>
  );
}
