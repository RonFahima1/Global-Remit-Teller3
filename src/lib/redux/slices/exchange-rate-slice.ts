/**
 * Exchange Rate Slice
 * Redux slice for managing exchange rates
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ExchangeRate, 
  ExchangeRateHistory, 
  ExchangeRateUpdate,
  ExchangeRateFilter
} from '@/types/exchange-rate';
import { exchangeRateService } from '@/services/exchange-rate-service';
import { RootState } from '../store';

/**
 * Exchange Rate State Interface
 */
interface ExchangeRateState {
  rates: ExchangeRate[];
  currentRate: ExchangeRate | null;
  rateHistory: ExchangeRateHistory[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Initial State
 */
const initialState: ExchangeRateState = {
  rates: [],
  currentRate: null,
  rateHistory: [],
  isLoading: false,
  error: null,
  lastUpdated: null
};

/**
 * Async Thunks
 */

// Fetch all exchange rates
export const fetchAllRates = createAsyncThunk(
  'exchangeRate/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await exchangeRateService.getAllRates();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exchange rates');
    }
  }
);

// Fetch exchange rates by filter
export const fetchRatesByFilter = createAsyncThunk(
  'exchangeRate/fetchByFilter',
  async (filter: ExchangeRateFilter, { rejectWithValue }) => {
    try {
      return await exchangeRateService.getRatesByFilter(filter);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exchange rates');
    }
  }
);

// Fetch exchange rate by currency pair
export const fetchRateByCurrencyPair = createAsyncThunk(
  'exchangeRate/fetchByCurrencyPair',
  async ({ baseCurrency, targetCurrency }: { baseCurrency: string; targetCurrency: string }, { rejectWithValue }) => {
    try {
      const rate = await exchangeRateService.getRateByCurrencyPair(baseCurrency, targetCurrency);
      if (!rate) {
        return rejectWithValue(`Exchange rate not found for ${baseCurrency} to ${targetCurrency}`);
      }
      return rate;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exchange rate');
    }
  }
);

// Create exchange rate
export const createExchangeRate = createAsyncThunk(
  'exchangeRate/create',
  async ({ rateData, userId }: { rateData: ExchangeRateUpdate; userId: string }, { rejectWithValue }) => {
    try {
      return await exchangeRateService.createRate(rateData, userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create exchange rate');
    }
  }
);

// Update exchange rate
export const updateExchangeRate = createAsyncThunk(
  'exchangeRate/update',
  async (
    { id, rateData, userId }: { id: string; rateData: Partial<ExchangeRateUpdate>; userId: string }, 
    { rejectWithValue }
  ) => {
    try {
      return await exchangeRateService.updateRate(id, rateData, userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update exchange rate');
    }
  }
);

// Fetch exchange rate history
export const fetchRateHistory = createAsyncThunk(
  'exchangeRate/fetchHistory',
  async (exchangeRateId: string, { rejectWithValue }) => {
    try {
      return await exchangeRateService.getRateHistory(exchangeRateId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exchange rate history');
    }
  }
);

// Refresh rates from provider
export const refreshRatesFromProvider = createAsyncThunk(
  'exchangeRate/refreshFromProvider',
  async (providerId: string, { rejectWithValue }) => {
    try {
      return await exchangeRateService.refreshRatesFromProvider(providerId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refresh exchange rates');
    }
  }
);

/**
 * Exchange Rate Slice
 */
const exchangeRateSlice = createSlice({
  name: 'exchangeRate',
  initialState,
  reducers: {
    clearCurrentRate: (state) => {
      state.currentRate = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all rates
      .addCase(fetchAllRates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllRates.fulfilled, (state, action: PayloadAction<ExchangeRate[]>) => {
        state.isLoading = false;
        state.rates = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch rates by filter
      .addCase(fetchRatesByFilter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRatesByFilter.fulfilled, (state, action: PayloadAction<ExchangeRate[]>) => {
        state.isLoading = false;
        state.rates = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRatesByFilter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch rate by currency pair
      .addCase(fetchRateByCurrencyPair.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRateByCurrencyPair.fulfilled, (state, action: PayloadAction<ExchangeRate>) => {
        state.isLoading = false;
        state.currentRate = action.payload;
      })
      .addCase(fetchRateByCurrencyPair.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create exchange rate
      .addCase(createExchangeRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExchangeRate.fulfilled, (state, action: PayloadAction<ExchangeRate>) => {
        state.isLoading = false;
        state.rates.push(action.payload);
        state.currentRate = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createExchangeRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update exchange rate
      .addCase(updateExchangeRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExchangeRate.fulfilled, (state, action: PayloadAction<ExchangeRate>) => {
        state.isLoading = false;
        const index = state.rates.findIndex(rate => rate.id === action.payload.id);
        if (index !== -1) {
          state.rates[index] = action.payload;
        }
        state.currentRate = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateExchangeRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch rate history
      .addCase(fetchRateHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRateHistory.fulfilled, (state, action: PayloadAction<ExchangeRateHistory[]>) => {
        state.isLoading = false;
        state.rateHistory = action.payload;
      })
      .addCase(fetchRateHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Refresh rates from provider
      .addCase(refreshRatesFromProvider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshRatesFromProvider.fulfilled, (state, action: PayloadAction<ExchangeRate[]>) => {
        state.isLoading = false;
        state.rates = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(refreshRatesFromProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

/**
 * Actions
 */
export const { clearCurrentRate, clearError } = exchangeRateSlice.actions;

/**
 * Selectors
 */
export const selectAllRates = (state: RootState) => state.exchangeRate.rates;
export const selectCurrentRate = (state: RootState) => state.exchangeRate.currentRate;
export const selectRateHistory = (state: RootState) => state.exchangeRate.rateHistory;
export const selectExchangeRateLoading = (state: RootState) => state.exchangeRate.isLoading;
export const selectExchangeRateError = (state: RootState) => state.exchangeRate.error;
export const selectLastUpdated = (state: RootState) => state.exchangeRate.lastUpdated;

// Select rate by currency pair
export const selectRateByCurrencyPair = (state: RootState, baseCurrency: string, targetCurrency: string) => 
  state.exchangeRate.rates.find(
    rate => rate.baseCurrency === baseCurrency && 
            rate.targetCurrency === targetCurrency &&
            rate.isActive
  );

/**
 * Reducer
 */
export default exchangeRateSlice.reducer;
