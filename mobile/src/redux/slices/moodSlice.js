import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { moodService } from '../../services/moodService';

const initialState = {
  moods: [],
  currentMonthMoods: [],
  isLoading: false,
  error: null,
};

export const fetchMoods = createAsyncThunk(
  'moods/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await moodService.getMoods();
      return response.moods || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch moods');
    }
  }
);

export const logMood = createAsyncThunk(
  'moods/log',
  async (moodData, { rejectWithValue }) => {
    try {
      const response = await moodService.logMood(moodData);
      return response.mood || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to log mood');
    }
  }
);

export const fetchMonthMoods = createAsyncThunk(
  'moods/fetchMonth',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await moodService.getMonthMoods(year, month);
      return response.moods || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch month moods');
    }
  }
);

const moodSlice = createSlice({
  name: 'moods',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch moods
      .addCase(fetchMoods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.moods = action.payload;
      })
      .addCase(fetchMoods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Log mood
      .addCase(logMood.fulfilled, (state, action) => {
        const index = state.moods.findIndex(
          m => new Date(m.date).toDateString() === new Date(action.payload.date).toDateString()
        );
        if (index !== -1) {
          state.moods[index] = action.payload;
        } else {
          state.moods.unshift(action.payload);
        }
      })
      // Fetch month moods
      .addCase(fetchMonthMoods.fulfilled, (state, action) => {
        state.currentMonthMoods = action.payload;
      });
  },
});

export const { clearError } = moodSlice.actions;
export default moodSlice.reducer;
