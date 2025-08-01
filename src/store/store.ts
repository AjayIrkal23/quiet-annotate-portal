
import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from './leaderboardSlice';
import dashboardReducer from './dashboardSlice';
import annotationReducer from './annotationSlice';
import imageReducer from './imageSlice';
import uploadReducer from './uploadSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    dashboard: dashboardReducer,
    annotation: annotationReducer,
    image: imageReducer,
    upload: uploadReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
