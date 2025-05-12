/**
 * Payout Slice
 * Redux slice for managing payouts and payout partners
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Payout, 
  PayoutPartner, 
  PayoutRequest, 
  PayoutUpdate, 
  PayoutFilter,
  PayoutPartnerFilter,
  PayoutStatusUpdate,
  PayoutReconciliation
} from '@/types/payout';
import { payoutService } from '@/services/payout-service';
import { RootState } from '../store';

/**
 * Payout State Interface
 */
interface PayoutState {
  payouts: Payout[];
  currentPayout: Payout | null;
  partners: PayoutPartner[];
  currentPartner: PayoutPartner | null;
  reconciliations: PayoutReconciliation[];
  currentReconciliation: PayoutReconciliation | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Initial State
 */
const initialState: PayoutState = {
  payouts: [],
  currentPayout: null,
  partners: [],
  currentPartner: null,
  reconciliations: [],
  currentReconciliation: null,
  isLoading: false,
  error: null,
  lastUpdated: null
};

/**
 * Async Thunks
 */

// Fetch all payout partners
export const fetchAllPartners = createAsyncThunk(
  'payout/fetchAllPartners',
  async (_, { rejectWithValue }) => {
    try {
      return await payoutService.getAllPartners();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch payout partners');
    }
  }
);

// Fetch payout partners by filter
export const fetchPartnersByFilter = createAsyncThunk(
  'payout/fetchPartnersByFilter',
  async (filter: PayoutPartnerFilter, { rejectWithValue }) => {
    try {
      return await payoutService.getPartnersByFilter(filter);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch payout partners');
    }
  }
);

// Fetch payout partner by ID
export const fetchPartnerById = createAsyncThunk(
  'payout/fetchPartnerById',
  async (partnerId: string, { rejectWithValue }) => {
    try {
      const partner = await payoutService.getPartnerById(partnerId);
      if (!partner) {
        return rejectWithValue(`Payout partner not found with ID: ${partnerId}`);
      }
      return partner;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch payout partner');
    }
  }
);

// Fetch all payouts
export const fetchAllPayouts = createAsyncThunk(
  'payout/fetchAllPayouts',
  async (_, { rejectWithValue }) => {
    try {
      return await payoutService.getAllPayouts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch payouts');
    }
  }
);

// Fetch payouts by filter
export const fetchPayoutsByFilter = createAsyncThunk(
  'payout/fetchPayoutsByFilter',
  async (filter: PayoutFilter, { rejectWithValue }) => {
    try {
      return await payoutService.getPayoutsByFilter(filter);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch payouts');
    }
  }
);

// Fetch payout by ID
export const fetchPayoutById = createAsyncThunk(
  'payout/fetchPayoutById',
  async (payoutId: string, { rejectWithValue }) => {
    try {
      const payout = await payoutService.getPayoutById(payoutId);
      if (!payout) {
        return rejectWithValue(`Payout not found with ID: ${payoutId}`);
      }
      return payout;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch payout');
    }
  }
);

// Create payout
export const createPayout = createAsyncThunk(
  'payout/create',
  async ({ payoutRequest, userId }: { payoutRequest: PayoutRequest; userId: string }, { rejectWithValue }) => {
    try {
      return await payoutService.createPayout(payoutRequest, userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create payout');
    }
  }
);

// Update payout
export const updatePayout = createAsyncThunk(
  'payout/update',
  async (
    { payoutId, payoutUpdate, userId }: { payoutId: string; payoutUpdate: PayoutUpdate; userId: string }, 
    { rejectWithValue }
  ) => {
    try {
      return await payoutService.updatePayout(payoutId, payoutUpdate, userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update payout');
    }
  }
);

// Process status update
export const processStatusUpdate = createAsyncThunk(
  'payout/processStatusUpdate',
  async (statusUpdate: PayoutStatusUpdate, { rejectWithValue }) => {
    try {
      const payout = await payoutService.processStatusUpdate(statusUpdate);
      if (!payout) {
        return rejectWithValue(`Payout not found with partner reference: ${statusUpdate.partnerReference}`);
      }
      return payout;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to process status update');
    }
  }
);

// Create reconciliation
export const createReconciliation = createAsyncThunk(
  'payout/createReconciliation',
  async (
    { partnerId, startDate, endDate, userId }: 
    { partnerId: string; startDate: string; endDate: string; userId: string }, 
    { rejectWithValue }
  ) => {
    try {
      return await payoutService.createReconciliation(partnerId, startDate, endDate, userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create reconciliation');
    }
  }
);

// Complete reconciliation
export const completeReconciliation = createAsyncThunk(
  'payout/completeReconciliation',
  async (
    { reconciliationId, userId, discrepancyAmount, discrepancyNotes }: 
    { reconciliationId: string; userId: string; discrepancyAmount?: number; discrepancyNotes?: string }, 
    { rejectWithValue }
  ) => {
    try {
      return await payoutService.completeReconciliation(
        reconciliationId, 
        userId, 
        discrepancyAmount, 
        discrepancyNotes
      );
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to complete reconciliation');
    }
  }
);

/**
 * Payout Slice
 */
const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    clearCurrentPayout: (state) => {
      state.currentPayout = null;
    },
    clearCurrentPartner: (state) => {
      state.currentPartner = null;
    },
    clearCurrentReconciliation: (state) => {
      state.currentReconciliation = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all partners
      .addCase(fetchAllPartners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPartners.fulfilled, (state, action: PayloadAction<PayoutPartner[]>) => {
        state.isLoading = false;
        state.partners = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllPartners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch partners by filter
      .addCase(fetchPartnersByFilter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnersByFilter.fulfilled, (state, action: PayloadAction<PayoutPartner[]>) => {
        state.isLoading = false;
        state.partners = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPartnersByFilter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch partner by ID
      .addCase(fetchPartnerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action: PayloadAction<PayoutPartner>) => {
        state.isLoading = false;
        state.currentPartner = action.payload;
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch all payouts
      .addCase(fetchAllPayouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPayouts.fulfilled, (state, action: PayloadAction<Payout[]>) => {
        state.isLoading = false;
        state.payouts = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllPayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch payouts by filter
      .addCase(fetchPayoutsByFilter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayoutsByFilter.fulfilled, (state, action: PayloadAction<Payout[]>) => {
        state.isLoading = false;
        state.payouts = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPayoutsByFilter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch payout by ID
      .addCase(fetchPayoutById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayoutById.fulfilled, (state, action: PayloadAction<Payout>) => {
        state.isLoading = false;
        state.currentPayout = action.payload;
      })
      .addCase(fetchPayoutById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create payout
      .addCase(createPayout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPayout.fulfilled, (state, action: PayloadAction<Payout>) => {
        state.isLoading = false;
        state.payouts.push(action.payload);
        state.currentPayout = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createPayout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update payout
      .addCase(updatePayout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePayout.fulfilled, (state, action: PayloadAction<Payout>) => {
        state.isLoading = false;
        const index = state.payouts.findIndex(payout => payout.id === action.payload.id);
        if (index !== -1) {
          state.payouts[index] = action.payload;
        }
        state.currentPayout = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePayout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Process status update
      .addCase(processStatusUpdate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processStatusUpdate.fulfilled, (state, action: PayloadAction<Payout>) => {
        state.isLoading = false;
        const index = state.payouts.findIndex(payout => payout.id === action.payload.id);
        if (index !== -1) {
          state.payouts[index] = action.payload;
        }
        state.currentPayout = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(processStatusUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create reconciliation
      .addCase(createReconciliation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReconciliation.fulfilled, (state, action: PayloadAction<PayoutReconciliation>) => {
        state.isLoading = false;
        state.reconciliations.push(action.payload);
        state.currentReconciliation = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createReconciliation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Complete reconciliation
      .addCase(completeReconciliation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeReconciliation.fulfilled, (state, action: PayloadAction<PayoutReconciliation>) => {
        state.isLoading = false;
        const index = state.reconciliations.findIndex(rec => rec.id === action.payload.id);
        if (index !== -1) {
          state.reconciliations[index] = action.payload;
        }
        state.currentReconciliation = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(completeReconciliation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

/**
 * Actions
 */
export const { 
  clearCurrentPayout, 
  clearCurrentPartner, 
  clearCurrentReconciliation, 
  clearError 
} = payoutSlice.actions;

/**
 * Selectors
 */
export const selectAllPayouts = (state: RootState) => state.payout.payouts;
export const selectCurrentPayout = (state: RootState) => state.payout.currentPayout;
export const selectAllPartners = (state: RootState) => state.payout.partners;
export const selectCurrentPartner = (state: RootState) => state.payout.currentPartner;
export const selectAllReconciliations = (state: RootState) => state.payout.reconciliations;
export const selectCurrentReconciliation = (state: RootState) => state.payout.currentReconciliation;
export const selectPayoutLoading = (state: RootState) => state.payout.isLoading;
export const selectPayoutError = (state: RootState) => state.payout.error;
export const selectLastUpdated = (state: RootState) => state.payout.lastUpdated;

/**
 * Reducer
 */
export default payoutSlice.reducer;
