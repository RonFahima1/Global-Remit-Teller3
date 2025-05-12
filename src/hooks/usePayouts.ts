/**
 * Payout Hook
 * Custom hook for accessing payout functionality
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectAllPayouts,
  selectCurrentPayout,
  selectAllPartners,
  selectCurrentPartner,
  selectAllReconciliations,
  selectCurrentReconciliation,
  selectPayoutLoading,
  selectPayoutError,
  selectLastUpdated,
  fetchAllPartners,
  fetchPartnersByFilter,
  fetchPartnerById,
  fetchAllPayouts,
  fetchPayoutsByFilter,
  fetchPayoutById,
  createPayout,
  updatePayout,
  processStatusUpdate,
  createReconciliation,
  completeReconciliation,
  clearCurrentPayout,
  clearCurrentPartner,
  clearCurrentReconciliation,
  clearError
} from '@/lib/redux/slices/payout-slice';
import { 
  PayoutPartnerFilter, 
  PayoutFilter, 
  PayoutRequest, 
  PayoutUpdate,
  PayoutStatusUpdate
} from '@/types/payout';
import { payoutService } from '@/services/payout-service';

/**
 * Custom hook for payouts
 */
export function usePayouts() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const payouts = useAppSelector(selectAllPayouts);
  const currentPayout = useAppSelector(selectCurrentPayout);
  const partners = useAppSelector(selectAllPartners);
  const currentPartner = useAppSelector(selectCurrentPartner);
  const reconciliations = useAppSelector(selectAllReconciliations);
  const currentReconciliation = useAppSelector(selectCurrentReconciliation);
  const isLoading = useAppSelector(selectPayoutLoading);
  const error = useAppSelector(selectPayoutError);
  const lastUpdated = useAppSelector(selectLastUpdated);
  
  // Partner actions
  const loadAllPartners = useCallback(() => {
    return dispatch(fetchAllPartners());
  }, [dispatch]);
  
  const loadPartnersByFilter = useCallback((filter: PayoutPartnerFilter) => {
    return dispatch(fetchPartnersByFilter(filter));
  }, [dispatch]);
  
  const loadPartnerById = useCallback((partnerId: string) => {
    return dispatch(fetchPartnerById(partnerId));
  }, [dispatch]);
  
  // Payout actions
  const loadAllPayouts = useCallback(() => {
    return dispatch(fetchAllPayouts());
  }, [dispatch]);
  
  const loadPayoutsByFilter = useCallback((filter: PayoutFilter) => {
    return dispatch(fetchPayoutsByFilter(filter));
  }, [dispatch]);
  
  const loadPayoutById = useCallback((payoutId: string) => {
    return dispatch(fetchPayoutById(payoutId));
  }, [dispatch]);
  
  const initiatePayoutRequest = useCallback((payoutRequest: PayoutRequest, userId: string) => {
    return dispatch(createPayout({ payoutRequest, userId }));
  }, [dispatch]);
  
  const updatePayoutStatus = useCallback((payoutId: string, payoutUpdate: PayoutUpdate, userId: string) => {
    return dispatch(updatePayout({ payoutId, payoutUpdate, userId }));
  }, [dispatch]);
  
  const handleStatusUpdate = useCallback((statusUpdate: PayoutStatusUpdate) => {
    return dispatch(processStatusUpdate(statusUpdate));
  }, [dispatch]);
  
  // Reconciliation actions
  const initiateReconciliation = useCallback((
    partnerId: string, 
    startDate: string, 
    endDate: string, 
    userId: string
  ) => {
    return dispatch(createReconciliation({ partnerId, startDate, endDate, userId }));
  }, [dispatch]);
  
  const finalizeReconciliation = useCallback((
    reconciliationId: string, 
    userId: string, 
    discrepancyAmount?: number, 
    discrepancyNotes?: string
  ) => {
    return dispatch(completeReconciliation({ 
      reconciliationId, 
      userId, 
      discrepancyAmount, 
      discrepancyNotes 
    }));
  }, [dispatch]);
  
  // Fee calculation
  const calculateFee = useCallback(async (
    amount: number, 
    currency: string, 
    partnerId: string
  ) => {
    try {
      return await payoutService.calculatePayoutFee(amount, currency, partnerId);
    } catch (error) {
      throw error;
    }
  }, []);
  
  // Clear actions
  const resetCurrentPayout = useCallback(() => {
    dispatch(clearCurrentPayout());
  }, [dispatch]);
  
  const resetCurrentPartner = useCallback(() => {
    dispatch(clearCurrentPartner());
  }, [dispatch]);
  
  const resetCurrentReconciliation = useCallback(() => {
    dispatch(clearCurrentReconciliation());
  }, [dispatch]);
  
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  return {
    // State
    payouts,
    currentPayout,
    partners,
    currentPartner,
    reconciliations,
    currentReconciliation,
    isLoading,
    error,
    lastUpdated,
    
    // Partner actions
    loadAllPartners,
    loadPartnersByFilter,
    loadPartnerById,
    
    // Payout actions
    loadAllPayouts,
    loadPayoutsByFilter,
    loadPayoutById,
    initiatePayoutRequest,
    updatePayoutStatus,
    handleStatusUpdate,
    
    // Reconciliation actions
    initiateReconciliation,
    finalizeReconciliation,
    
    // Fee calculation
    calculateFee,
    
    // Clear actions
    resetCurrentPayout,
    resetCurrentPartner,
    resetCurrentReconciliation,
    resetError
  };
}
