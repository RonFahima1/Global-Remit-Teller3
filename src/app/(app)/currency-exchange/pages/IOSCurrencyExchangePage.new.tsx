'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';
import { useCurrencyExchange } from '../hooks/useCurrencyExchange';
import { IOSPageHeader } from '../components/IOS/IOSPageHeader';
import { IOSExchangeForm } from '../components/IOS/IOSExchangeForm';
import { RatesTableView } from '../components/IOS/RatesTableView';
import { TransactionHistoryView } from '../components/IOS/TransactionHistoryView';
import { ArrowDownFromLine, RefreshCcw, LineChart, History, Wallet } from 'lucide-react';

export default function IOSCurrencyExchangePage() {
  const {
    currencies,
    exchangeData,
    isLoading,
    showSuccessMessage,
    activeTab,
    errors,
    favorites,
    lastUpdated,
    isFlipping,
    recentTransactions,
    getCurrency,
    handleFromAmountChange,
    handleToAmountChange,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    swapCurrencies,
    toggleFavorite,
    refreshRates,
    processExchange,
    resetSuccess,
    setActiveTab,
    handleCheckboxChange,
    calculateFee,
    calculateTotalAmount
  } = useCurrencyExchange();

  const fromCurrency = getCurrency(exchangeData.fromCurrency);
  const toCurrency = getCurrency(exchangeData.toCurrency);
  
  // Track device type and orientation for responsive design
  const [deviceInfo, setDeviceInfo] = React.useState({
    isPhone: false,
    isTablet: false,
    isLaptop: false,
    orientation: 'portrait' as 'portrait' | 'landscape'
  });
  
  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        isPhone: width < 640,
        isTablet: width >= 640 && width < 1024,
        isLaptop: width >= 1024,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };
    
    // Initial check
    updateDeviceInfo();
    
    // Add listeners
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* iOS-style Header */}
      <div className="sticky top-0 z-50">
        <IOSPageHeader 
          title="Currency Exchange"
          subtitle="Convert at competitive rates"
          icon={<Wallet className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          onRefresh={refreshRates}
        />
      </div>
      
      {/* Tabs Navigation + Content */}
      <div className="flex flex-col min-h-[calc(100vh-40px)]">
        <Tabs 
          defaultValue="exchange" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full flex-1 flex flex-col"
        >
          {/* iOS-style Segmented Control */}
          <div className="sticky top-10 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-1.5 px-4">
            <TabsList className="flex w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-0.5">
              <TabsTrigger 
                value="exchange" 
                className="flex-1 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm py-1 px-2 text-xs font-medium flex items-center justify-center gap-1"
              >
                <ArrowDownFromLine size={10} />
                <span className="text-xs">Exchange</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rates" 
                className="flex-1 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm py-1 px-2 text-xs font-medium flex items-center justify-center gap-1"
              >
                <LineChart size={10} />
                <span className="text-xs">Rates</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex-1 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm py-1 px-2 text-xs font-medium flex items-center justify-center gap-1"
              >
                <History size={10} />
                <span className="text-xs">History</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Tab Content Area */}
          <div className="flex-1 px-4 py-4 md:py-6 flex justify-center">
            <div className="w-full max-w-md">
              {/* Exchange Tab */}
              <TabsContent value="exchange" className="mt-0">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="exchange"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IOSExchangeForm
                        currencies={currencies}
                        exchangeData={exchangeData}
                        handleFromAmountChange={handleFromAmountChange}
                        handleToAmountChange={handleToAmountChange}
                        handleFromCurrencyChange={handleFromCurrencyChange}
                        handleToCurrencyChange={handleToCurrencyChange}
                        swapCurrencies={swapCurrencies}
                        toggleFavorite={toggleFavorite}
                        processExchange={processExchange}
                        favorites={favorites}
                        errors={errors}
                        isLoading={isLoading}
                        isFlipping={isFlipping}
                        handleCheckboxChange={handleCheckboxChange}
                        calculateFee={calculateFee}
                        calculateTotalAmount={calculateTotalAmount}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </TabsContent>

              {/* Rates Tab */}
              <TabsContent value="rates" className="mt-0">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="rates"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Currency Rates</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                        </div>
                        <motion.button
                          onClick={refreshRates}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                          whileTap={{ scale: 0.95 }}
                        >
                          <RefreshCcw size={16} className="text-gray-600 dark:text-gray-400" />
                        </motion.button>
                      </div>
                      <RatesTableView 
                        currencies={currencies} 
                        baseCurrency={exchangeData.fromCurrency} 
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Your recent transactions</p>
                        </div>
                      </div>
                      <TransactionHistoryView 
                        transactions={recentTransactions}
                        getCurrency={getCurrency}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <ConfettiSuccess
          title="Exchange Complete!"
          description={`You have successfully exchanged ${exchangeData.fromAmount} ${fromCurrency.code} to ${exchangeData.toAmount} ${toCurrency.code}`}
          onDismiss={resetSuccess}
          amount={exchangeData.toAmount}
          currency={toCurrency.symbol}
          senderName={`${fromCurrency.code} Account`}
          receiverName={`${toCurrency.code} Account`}
          fee={calculateFee(parseFloat(exchangeData.fromAmount) || 0).toFixed(2)}
          referenceId={Math.random().toString(36).substring(2, 10).toUpperCase()}
        />
      )}
    </div>
  );
}
