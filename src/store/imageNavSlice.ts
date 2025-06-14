
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageNavState {
  currentImageIndex: number;
}

const initialState: ImageNavState = {
  currentImageIndex: 0,
};

const imageNavSlice = createSlice({
  name: 'imageNav',
  initialState,
  reducers: {
    setCurrentImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    nextImage: (state, action: PayloadAction<{ imagesLength: number }>) => {
      if (state.currentImageIndex < action.payload.imagesLength - 1) {
        state.currentImageIndex += 1;
      }
    },
    previousImage: (state) => {
      if (state.currentImageIndex > 0) {
        state.currentImageIndex -= 1;
      }
    },
  },
});

export const { setCurrentImageIndex, nextImage, previousImage } = imageNavSlice.actions;

export default imageNavSlice.reducer;
