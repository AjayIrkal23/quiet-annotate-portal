import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from './leaderboardSlice';
import dashboardReducer from './dashboardSlice';
import annotationReducer from './annotationSlice';
import imageNavReducer from './imageNavSlice';

export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    dashboard: dashboardReducer,
    annotation: annotationReducer,
    imageNav: imageNavReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
