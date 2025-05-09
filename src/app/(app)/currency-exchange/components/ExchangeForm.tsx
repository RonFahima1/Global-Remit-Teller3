import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IOSCard } from '@/components/ui/IOSCard';
import { IOSSectionHeader } from '@/components/ui/IOSSectionHeader';
import { CurrencySelector } from './CurrencySelector';
import { AmountInput } from './AmountInput';
import { Currency, ExchangeData } from '../hooks/useCurrencyExchange';

interface ExchangeFormProps {
  currencies: Currency[];
  exchangeData: ExchangeData;
  handleFromAmountChange: (value: string) => void;
  handleToAmountChange: (value: string) => void;
  handleFromCurrencyChange: (value: string) => void;
  handleToCurrencyChange: (value: string) => void;
  swapCurrencies: () => void;
  toggleFavorite: (currency: string) => void;
  processExchange: () => void;
  favorites: string[];
  errors: Record<string, string>;
  isLoading: boolean;
  isFlipping: boolean;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  calculateFee: (amount: number) => number;
  calculateTotalAmount: (amount: number) => number;
}

export const ExchangeForm: React.FC<ExchangeFormProps> = ({
  currencies,
  exchangeData,
  handleFromAmountChange,
  handleToAmountChange,
  handleFromCurrencyChange,
  handleToCurrencyChange,
  swapCurrencies,
  toggleFavorite,
  processExchange,
  favorites,
  errors,
  isLoading,
  isFlipping,
  handleCheckboxChange,
  calculateFee,
  calculateTotalAmount
}) => {
  const fromCurrency = currencies.find(c => c.code === exchangeData.fromCurrency) || currencies[0];
  const toCurrency = currencies.find(c => c.code === exchangeData.toCurrency) || currencies[1];
  
  const fee = calculateFee(parseFloat(exchangeData.fromAmount) || 0);
  const totalAmount = calculateTotalAmount(parseFloat(exchangeData.fromAmount) || 0);
  
  return (
    <div className="space-y-8">
      <IOSSectionHeader 
        title="Currency Exchange"
        subtitle="Convert between currencies with real-time rates"
        centered={true}
      />
      
      <div className="max-w-xl mx-auto">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* From Currency */}
          <div className="space-y-4">
            <CurrencySelector
              label="From Currency"
              value={exchangeData.fromCurrency}
              onValueChange={handleFromCurrencyChange}
              currencies={currencies}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isFlipping={isFlipping}
              side="from"
            />
            
            <AmountInput
              label="You Send"
              value={exchangeData.fromAmount}
              onChange={handleFromAmountChange}
              currency={exchangeData.fromCurrency}
              currencies={currencies}
              error={errors.fromAmount}
              isFlipping={isFlipping}
              side="from"
            />
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={swapCurrencies}
              className="p-4 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
              disabled={isFlipping}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ArrowDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </motion.button>
          </div>
          
          {/* To Currency */}
          <div className="space-y-4">
            <CurrencySelector
              label="To Currency"
              value={exchangeData.toCurrency}
              onValueChange={handleToCurrencyChange}
              currencies={currencies}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isFlipping={isFlipping}
              side="to"
            />
            
            <AmountInput
              label="You Receive"
              value={exchangeData.toAmount}
              onChange={handleToAmountChange}
              currency={exchangeData.toCurrency}
              currencies={currencies}
              isFlipping={isFlipping}
              side="to"
            />
          </div>
          
          {/* Exchange Rate Info */}
          <IOSCard
            variant="inset"
            padding="medium"
            className="bg-gray-50 dark:bg-gray-800/30"
          >
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    1 {fromCurrency.code} = {exchangeData.rate.toFixed(4)} {toCurrency.code}
                  </span>
                </div>
              </div>
              
              {exchangeData.fromAmount && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Fee</span>
                    <span className="text-sm font-medium">
                      {fromCurrency.symbol}{fee.toFixed(2)} {fromCurrency.code}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
                    <span className="text-sm font-bold">
                      {fromCurrency.symbol}{totalAmount.toFixed(2)} {fromCurrency.code}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </IOSCard>
          
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={exchangeData.termsAccepted}
              onCheckedChange={(checked) => 
                handleCheckboxChange('termsAccepted', checked === true)
              }
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the terms and conditions
              </label>
              {errors.terms && (
                <p className="text-sm text-red-500">{errors.terms}</p>
              )}
            </div>
          </div>
          
          {/* Exchange Button */}
          <Button
            onClick={processExchange}
            disabled={isLoading || !exchangeData.fromAmount}
            className="w-full h-12 text-base font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Exchange Now</span>
            )}
          </Button>
          
          {/* Disclaimer */}
          <div className="flex items-start space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Exchange rates are updated in real-time. The final rate will be locked in when you confirm the exchange.
              Fees may apply based on the amount and currencies selected.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
