
import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
  totalAccImages: number;
  totalImagesOptioned: number;
  totalImagesWaiting: number;
}

const initialState: DashboardState = {
  totalAccImages: 2847,
  totalImagesOptioned: 1923,
  totalImagesWaiting: 924,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
});

export default dashboardSlice.reducer;
