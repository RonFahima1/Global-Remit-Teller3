/**
 * Receipt Slice
 * Redux slice for managing receipt state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ReceiptGenerationRequest, 
  ReceiptGenerationResponse, 
  ReceiptHistoryItem, 
  ReceiptTemplate,
  ReceiptTemplateType
} from '@/types/receipt';
import { RootState } from '../store';
import { receiptService } from '@/services';

/**
 * Receipt state interface
 */
interface ReceiptState {
  receipts: ReceiptHistoryItem[];
  currentReceipt: ReceiptGenerationResponse | null;
  templates: ReceiptTemplate[];
  currentTemplate: ReceiptTemplate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Initial state
 */
const initialState: ReceiptState = {
  receipts: [],
  currentReceipt: null,
  templates: [],
  currentTemplate: null,
  isLoading: false,
  error: null,
  lastUpdated: null
};

/**
 * Async thunk for generating a receipt
 */
export const generateReceipt = createAsyncThunk(
  'receipt/generate',
  async (request: ReceiptGenerationRequest, { rejectWithValue }) => {
    try {
      const response = await receiptService.generateReceipt(request);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate receipt');
    }
  }
);

/**
 * Async thunk for fetching receipt history by transaction ID
 */
export const fetchReceiptHistory = createAsyncThunk(
  'receipt/fetchHistory',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await receiptService.getReceiptHistoryByTransactionId(transactionId);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch receipt history');
    }
  }
);

/**
 * Async thunk for fetching receipt templates
 */
export const fetchReceiptTemplates = createAsyncThunk(
  'receipt/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptService.getReceiptTemplates();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch receipt templates');
    }
  }
);

/**
 * Async thunk for fetching default receipt template
 */
export const fetchDefaultTemplate = createAsyncThunk(
  'receipt/fetchDefaultTemplate',
  async (type: ReceiptTemplateType, { rejectWithValue }) => {
    try {
      const response = await receiptService.getDefaultReceiptTemplate(type);
      if (!response) {
        return rejectWithValue('Default template not found');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch default template');
    }
  }
);

/**
 * Receipt slice
 */
const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {
    clearCurrentReceipt: (state) => {
      state.currentReceipt = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTemplate: (state, action: PayloadAction<ReceiptTemplate>) => {
      state.currentTemplate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate Receipt
      .addCase(generateReceipt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReceipt = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Receipt History
      .addCase(fetchReceiptHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReceiptHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.receipts = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchReceiptHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Receipt Templates
      .addCase(fetchReceiptTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReceiptTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchReceiptTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Default Template
      .addCase(fetchDefaultTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDefaultTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTemplate = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDefaultTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

/**
 * Action creators
 */
export const { clearCurrentReceipt, clearError, setCurrentTemplate } = receiptSlice.actions;

/**
 * Selectors
 */
export const selectReceipts = (state: RootState) => state.receipt.receipts;
export const selectCurrentReceipt = (state: RootState) => state.receipt.currentReceipt;
export const selectTemplates = (state: RootState) => state.receipt.templates;
export const selectCurrentTemplate = (state: RootState) => state.receipt.currentTemplate;
export const selectIsLoading = (state: RootState) => state.receipt.isLoading;
export const selectError = (state: RootState) => state.receipt.error;

/**
 * Reducer
 */
export default receiptSlice.reducer;
