
import { createSlice } from '@reduxjs/toolkit';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  objectsVerified: number;
  imagesVerified: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
}

const initialState: LeaderboardState = {
  entries: [
    {
      id: '1',
      username: 'ajayirkl',
      score: 120,
      objectsVerified: 75,
      imagesVerified: 30,
    },
    {
      id: '2',
      username: 'tech_guru',
      score: 100,
      objectsVerified: 68,
      imagesVerified: 25,
    },
    {
      id: '3',
      username: 'safety_expert',
      score: 95,
      objectsVerified: 62,
      imagesVerified: 22,
    },
    {
      id: '4',
      username: 'inspector_pro',
      score: 88,
      objectsVerified: 55,
      imagesVerified: 20,
    },
    {
      id: '5',
      username: 'quality_check',
      score: 82,
      objectsVerified: 48,
      imagesVerified: 18,
    },
    {
      id: '6',
      username: 'vision_ai',
      score: 75,
      objectsVerified: 42,
      imagesVerified: 15,
    },
  ],
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
});

export default leaderboardSlice.reducer;
