import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "@/lib/utils";

// Types matching backend payload for validation
export interface ValidationBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ValidationAnnotationDetail {
  violationName: string;
  description: string;
  boundingBox: ValidationBoundingBox;
  isHumanAdded: boolean;
  isValid?: boolean | null;
}

export interface ValidationImage {
  _id?: string;
  employeeId: string;
  imageName: string;
  imagePath: string;
  imageSize: { width: number; height: number };
  details: ValidationAnnotationDetail[];
}

interface ValidationState {
  items: ValidationImage[];
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: ValidationState = {
  items: [],
  page: 1,
  limit: 30,
  loading: false,
  error: null,
  hasMore: true,
};

export const fetchValidationImages = createAsyncThunk<
  { data: ValidationImage[]; page: number; limit: number },
  { page?: number; limit?: number },
  { rejectValue: string }
>("validation/fetch", async ({ page = 1, limit = 30 } = {}, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASEURL}/anotations/validate`, {
      params: { page, limit },
    });
    const data: ValidationImage[] = res.data?.data || res.data || [];
    return { data, page, limit };
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch validation images");
  }
});

export const submitValidationForImage = createAsyncThunk<
  { _id?: string },
  { image: ValidationImage },
  { rejectValue: string }
>("validation/submitImage", async ({ image }, { rejectWithValue }) => {
  try {
    await axios.post(`${BASEURL}/anotations/validate`, image);
    return { _id: image._id };
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to submit validation");
  }
});

const validationSlice = createSlice({
  name: "validation",
  initialState,
  reducers: {
    resetValidation(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    removeDetailFromImage(
      state,
      action: PayloadAction<{ imageId?: string; index: number }>
    ) {
      const { imageId, index } = action.payload;
      const imgIdx = state.items.findIndex((it) => it._id === imageId);
      if (imgIdx !== -1 && state.items[imgIdx].details[index]) {
        state.items[imgIdx].details.splice(index, 1);
      }
    },
    removeImageById(state, action: PayloadAction<string | undefined>) {
      state.items = state.items.filter((it) => it._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchValidationImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchValidationImages.fulfilled, (state, action) => {
        state.loading = false;
        const { data, page, limit } = action.payload;
        if (page === 1) {
          state.items = data;
        } else {
          state.items = [...state.items, ...data];
        }
        state.page = page;
        state.limit = limit;
        state.hasMore = data.length === limit; // heuristic
      })
      .addCase(fetchValidationImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(submitValidationForImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitValidationForImage.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload._id;
        if (id) {
          state.items = state.items.filter((it) => it._id !== id);
        }
      })
      .addCase(submitValidationForImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit";
      });
  },
});

export const { resetValidation, removeDetailFromImage, removeImageById } =
  validationSlice.actions;

export default validationSlice.reducer;
