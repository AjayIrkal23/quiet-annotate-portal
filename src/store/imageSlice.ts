import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUniqueImages } from "./thunks/fetchUniqueImages";
import { uploadZipThunk } from "./thunks/uploadZipThunk";

export interface ViolationDetail {
  name: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface ImageData {
  _id?: string;
  imagePath: string;
  imageName: string;
  violationDetails: ViolationDetail[] | null;
  isIssueGenerated: boolean;
}

interface ImageState {
  images: ImageData[];
  currentImageIndex: number;
  loading: boolean;
  error: string | null;
}

// ===================
// Slice
// ===================
const initialState: ImageState = {
  images: [],
  currentImageIndex: 0,
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<ImageData[]>) => {
      state.images = action.payload;
    },
    setCurrentImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    nextImage: (state) => {
      if (state.currentImageIndex < state.images.length - 1) {
        state.currentImageIndex += 1;
      }
    },
    previousImage: (state) => {
      if (state.currentImageIndex > 0) {
        state.currentImageIndex -= 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadZipThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadZipThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadZipThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      })
      .addCase(fetchUniqueImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
        state.currentImageIndex = 0;
      })
      .addCase(fetchUniqueImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch images";
      });
  },
});

export const {
  setImages,
  setCurrentImageIndex,
  nextImage,
  previousImage,
  setLoading,
  setError,
} = imageSlice.actions;

export default imageSlice.reducer;
