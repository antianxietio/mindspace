import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointmentService';

const initialState = {
  appointments: [],
  counsellors: [],
  timeSlots: [],
  selectedDate: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCounsellors = createAsyncThunk(
  'appointments/fetchCounsellors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getCounsellors();
      return response.counsellors || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch counsellors');
    }
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'appointments/fetchTimeSlots',
  async (counsellorId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getTimeSlots(counsellorId);
      return response.slots || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch time slots');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.bookAppointment(appointmentData);
      return response.appointment || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getMyAppointments();
      return response.appointments || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (appointmentId, { rejectWithValue }) => {
    try {
      return await appointmentService.cancelAppointment(appointmentId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/reschedule',
  async ({ appointmentId, newData }, { rejectWithValue }) => {
    try {
      return await appointmentService.rescheduleAppointment(appointmentId, newData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch counsellors
      .addCase(fetchCounsellors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCounsellors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.counsellors = action.payload;
      })
      .addCase(fetchCounsellors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch time slots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timeSlots = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch my appointments
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      // Cancel appointment
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      // Reschedule appointment
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const { setSelectedDate, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
