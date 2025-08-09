import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "@/lib/utils";
import { toast } from "sonner";

interface WeeklyData {
  name: string;
  annotated: number;
  valid: number;
  wrong: number;
}

interface MonthlyData {
  month: string;
  annotated: number;
  valid: number;
  wrong: number;
}

interface CurrentMonthData {
  date: string;
  annotated: number;
  valid: number;
  invalid: number;
}

interface DashboardState {
  imagesUploaded: number;
  violationsFound: number;
  usersAnnotated: number;
  totalValid: number;
  totalInvalid: number;
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  currentMonthData: CurrentMonthData[];
  weeklyLoading: boolean;
  monthlyLoading: boolean;
  currentMonthLoading: boolean;
  weeklyError: string | null;
  monthlyError: string | null;
  currentMonthError: string | null;
  summaryLoading: boolean;
  summaryError: string | null;
}

const initialState: DashboardState = {
  imagesUploaded: 0,
  violationsFound: 0,
  usersAnnotated: 0,
  totalValid: 0,
  totalInvalid: 0,
  weeklyData: [],
  monthlyData: [],
  currentMonthData: [],
  weeklyLoading: false,
  monthlyLoading: false,
  currentMonthLoading: false,
  weeklyError: null,
  monthlyError: null,
  currentMonthError: null,
  summaryLoading: false,
  summaryError: null,
};

// Async thunk to fetch summary metrics
export const fetchSummaryMetrics = createAsyncThunk(
  "dashboard/fetchSummaryMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/analytics/summary`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch summary metrics");
    }
  }
);

// Async thunk to fetch weekly analytics data
export const fetchWeeklyAnalytics = createAsyncThunk(
  "dashboard/fetchWeeklyAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/analytics/weekly`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch weekly analytics data");
    }
  }
);

// Async thunk to fetch monthly analytics data
export const fetchMonthlyAnalytics = createAsyncThunk(
  "dashboard/fetchMonthlyAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/analytics/monthly`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch monthly analytics data");
    }
  }
);

// Async thunk to fetch current month daily analytics data
export const fetchCurrentMonthAnalytics = createAsyncThunk(
  "dashboard/fetchCurrentMonthAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/analytics/current-month`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch current month analytics data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummaryMetrics.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchSummaryMetrics.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.imagesUploaded = action.payload.imagesUploaded;
        state.violationsFound = action.payload.violationsFound;
        state.usersAnnotated = action.payload.usersAnnotated;
        state.totalValid = action.payload.totalValid;
        state.totalInvalid = action.payload.totalInvalid;
      })
      .addCase(fetchSummaryMetrics.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload as string;
        toast.error(state.summaryError, {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        });
      })
      .addCase(fetchWeeklyAnalytics.pending, (state) => {
        state.weeklyLoading = true;
        state.weeklyError = null;
      })
      .addCase(fetchWeeklyAnalytics.fulfilled, (state, action) => {
        state.weeklyLoading = false;
        state.weeklyData = action.payload;
      })
      .addCase(fetchWeeklyAnalytics.rejected, (state, action) => {
        state.weeklyLoading = false;
        state.weeklyError = action.payload as string;
        toast.error(state.weeklyError, {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        });
      })
      .addCase(fetchMonthlyAnalytics.pending, (state) => {
        state.monthlyLoading = true;
        state.monthlyError = null;
      })
      .addCase(fetchMonthlyAnalytics.fulfilled, (state, action) => {
        state.monthlyLoading = false;
        state.monthlyData = action.payload;
      })
      .addCase(fetchMonthlyAnalytics.rejected, (state, action) => {
        state.monthlyLoading = false;
        state.monthlyError = action.payload as string;
        toast.error(state.monthlyError, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        });
      })
      .addCase(fetchCurrentMonthAnalytics.pending, (state) => {
        state.currentMonthLoading = true;
        state.currentMonthError = null;
      })
      .addCase(fetchCurrentMonthAnalytics.fulfilled, (state, action) => {
        state.currentMonthLoading = false;
        state.currentMonthData = action.payload;
      })
      .addCase(fetchCurrentMonthAnalytics.rejected, (state, action) => {
        state.currentMonthLoading = false;
        state.currentMonthError = action.payload as string;
        toast.error(state.currentMonthError, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        });
      });
  },
});

export default dashboardSlice.reducer;
