
import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from './leaderboardSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
