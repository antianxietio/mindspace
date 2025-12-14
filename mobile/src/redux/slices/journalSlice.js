import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { journalService } from '../../services/journalService';

const initialState = {
  journals: [],
  syncQueue: [], // For offline journals waiting to sync
  isLoading: false,
  isSyncing: false,
  error: null,
};

export const fetchJournals = createAsyncThunk(
  'journals/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await journalService.getJournals();
      return response.journals || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch journals');
    }
  }
);

export const createJournal = createAsyncThunk(
  'journals/create',
  async (journalData, { rejectWithValue }) => {
    try {
      const response = await journalService.createJournal(journalData);
      return response.journal || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create journal');
    }
  }
);

export const updateJournal = createAsyncThunk(
  'journals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await journalService.updateJournal(id, data);
      return response.journal || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update journal');
    }
  }
);

export const deleteJournal = createAsyncThunk(
  'journals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await journalService.deleteJournal(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete journal');
    }
  }
);

export const syncOfflineJournals = createAsyncThunk(
  'journals/syncOffline',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { syncQueue } = getState().journals;
      const synced = [];

      for (const journal of syncQueue) {
        const result = await journalService.createJournal(journal);
        synced.push(result);
      }

      return synced;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sync failed');
    }
  }
);

const journalSlice = createSlice({
  name: 'journals',
  initialState,
  reducers: {
    addOfflineJournal: (state, action) => {
      state.syncQueue.push({
        ...action.payload,
        tempId: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    },
    clearSyncQueue: (state) => {
      state.syncQueue = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch journals
      .addCase(fetchJournals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.journals = action.payload;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create journal
      .addCase(createJournal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.journals.unshift(action.payload);
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update journal
      .addCase(updateJournal.fulfilled, (state, action) => {
        const index = state.journals.findIndex(j => j._id === action.payload._id);
        if (index !== -1) {
          state.journals[index] = action.payload;
        }
      })
      // Delete journal
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.journals = state.journals.filter(j => j._id !== action.payload);
      })
      // Sync offline journals
      .addCase(syncOfflineJournals.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncOfflineJournals.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.journals = [...action.payload, ...state.journals];
        state.syncQueue = [];
      })
      .addCase(syncOfflineJournals.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload;
      });
  },
});

export const { addOfflineJournal, clearSyncQueue, clearError } = journalSlice.actions;
export default journalSlice.reducer;
