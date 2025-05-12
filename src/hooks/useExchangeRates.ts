/**
 * Exchange Rate Hook
 * Custom hook for accessing exchange rate functionality
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectAllRates,
  selectCurrentRate,
  selectRateHistory,
  selectExchangeRateLoading,
  selectExchangeRateError,
  selectLastUpdated,
  selectRateByCurrencyPair,
  fetchAllRates,
  fetchRatesByFilter,
  fetchRateByCurrencyPair,
  createExchangeRate,
  updateExchangeRate,
  fetchRateHistory,
  refreshRatesFromProvider,
  clearCurrentRate,
  clearError
} from '@/lib/redux/slices/exchange-rate-slice';
import { ExchangeRateFilter, ExchangeRateUpdate } from '@/types/exchange-rate';

/**
 * Custom hook for exchange rates
 */
export function useExchangeRates() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const rates = useAppSelector(selectAllRates);
  const currentRate = useAppSelector(selectCurrentRate);
  const rateHistory = useAppSelector(selectRateHistory);
  const isLoading = useAppSelector(selectExchangeRateLoading);
  const error = useAppSelector(selectExchangeRateError);
  const lastUpdated = useAppSelector(selectLastUpdated);
  
  // Get rate by currency pair
  const getRateByCurrencyPair = useCallback((baseCurrency: string, targetCurrency: string) => {
    return useAppSelector(state => selectRateByCurrencyPair(state, baseCurrency, targetCurrency));
  }, []);
  
  // Load all rates
  const loadAllRates = useCallback(() => {
    return dispatch(fetchAllRates());
  }, [dispatch]);
  
  // Load rates by filter
  const loadRatesByFilter = useCallback((filter: ExchangeRateFilter) => {
    return dispatch(fetchRatesByFilter(filter));
  }, [dispatch]);
  
  // Load rate by currency pair
  const loadRateByCurrencyPair = useCallback((baseCurrency: string, targetCurrency: string) => {
    return dispatch(fetchRateByCurrencyPair({ baseCurrency, targetCurrency }));
  }, [dispatch]);
  
  // Create new rate
  const createRate = useCallback((rateData: ExchangeRateUpdate, userId: string) => {
    return dispatch(createExchangeRate({ rateData, userId }));
  }, [dispatch]);
  
  // Update existing rate
  const updateRate = useCallback((id: string, rateData: Partial<ExchangeRateUpdate>, userId: string) => {
    return dispatch(updateExchangeRate({ id, rateData, userId }));
  }, [dispatch]);
  
  // Load rate history
  const loadRateHistory = useCallback((exchangeRateId: string) => {
    return dispatch(fetchRateHistory(exchangeRateId));
  }, [dispatch]);
  
  // Refresh rates from provider
  const refreshRates = useCallback((providerId: string) => {
    return dispatch(refreshRatesFromProvider(providerId));
  }, [dispatch]);
  
  // Clear current rate
  const resetCurrentRate = useCallback(() => {
    dispatch(clearCurrentRate());
  }, [dispatch]);
  
  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // Calculate conversion
  const calculateConversion = useCallback((amount: number, fromCurrency: string, toCurrency: string) => {
    const rate = getRateByCurrencyPair(fromCurrency, toCurrency);
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }
    
    const convertedAmount = amount * rate.rate;
    
    // Calculate fee (in a real app, this would be based on fee configuration)
    const fee = amount * 0.03; // 3% fee
    
    // Calculate total cost
    const totalCost = amount + fee;
    
    return {
      amount: convertedAmount,
      rate: rate.rate,
      fee,
      totalCost
    };
  }, [getRateByCurrencyPair]);
  
  return {
    // State
    rates,
    currentRate,
    rateHistory,
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    loadAllRates,
    loadRatesByFilter,
    loadRateByCurrencyPair,
    createRate,
    updateRate,
    loadRateHistory,
    refreshRates,
    resetCurrentRate,
    resetError,
    
    // Helpers
    getRateByCurrencyPair,
    calculateConversion
  };
}
