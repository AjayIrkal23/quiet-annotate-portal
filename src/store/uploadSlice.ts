import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchImageStats } from "./thunks/imageStatsThunk";
import { uploadZipThunk } from "./thunks/uploadZipThunk";
import { fetchPaginatedImages } from "./thunks/fetchPaginatedImages";

export interface UploadedImage {
  _id?: string;
  imagePath: string;
  imageName: string;
  violationDetails:
    | {
        name: string;
        description: string;
        severity: "high" | "medium" | "low";
      }[]
    | null;
}

interface UploadState {
  uploadedImages: UploadedImage[];
  currentPage: number;
  imagesPerPage: number;
  totalZipFiles: number;
  imageCount: number;
  isUploading: boolean;
}

const initialState: UploadState = {
  uploadedImages: [],
  currentPage: 1,
  imagesPerPage: 30,
  totalZipFiles: 0,
  imageCount: 0,
  isUploading: false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setUploadedImages: (state, action: PayloadAction<UploadedImage[]>) => {
      state.uploadedImages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload thunk
      .addCase(uploadZipThunk.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadZipThunk.fulfilled, (state, action) => {
        state.uploadedImages.push(...action.payload);
        state.isUploading = false;
        // Don't increment zip file count here anymore
      })
      .addCase(uploadZipThunk.rejected, (state) => {
        state.isUploading = false;
      })

      // Stats fetch thunk
      .addCase(fetchImageStats.fulfilled, (state, action) => {
        state.totalZipFiles = action.payload.zipFileCount;

        state.imageCount = action.payload.imageCount;
      })
      .addCase(fetchImageStats.rejected, (state) => {
        state.totalZipFiles = 0;
        state.imageCount = 0;
      })
      .addCase(fetchPaginatedImages.fulfilled, (state, action) => {
        state.uploadedImages = action.payload.images;
        state.imageCount = action.payload.total; // Keep this in sync with server count
      })
      .addCase(fetchPaginatedImages.rejected, (state) => {
        state.uploadedImages = [];
      });
  },
});

export const {
  setUploadedImages,
  setCurrentPage,
  setIsUploading,
} = uploadSlice.actions;

export default uploadSlice.reducer;
