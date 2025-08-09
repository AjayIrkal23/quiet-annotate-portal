// userSlice.ts (updated)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
} from "./thunks/userThunks";

export interface ValidatedImage {
  _id: string;
  imagePath: string;
  employeeId: string;
  imageName: string;
  details: {
    violationName: string;
    description: string;
    isValid: boolean | null;
  }[];
}

export interface UserState {
  profile: {
    name: string;
    employeeId: string;
    email: string;
    role: string | null;
    imagesValidated: number;
    validatedCorrect: number;
    validatedWrong: number;
    department: string;
    isAdmin: boolean;
    isActive: boolean;
    verificationCode: string;
    jwtoken: string;
  } | null;
  validatedImagesCorrect: ValidatedImage[];
  validatedImagesWrong: ValidatedImage[];
  validatedImagesPending: ValidatedImage[];
  loading: boolean; // Added for async state management
  error: string | null; // Added for error handling
}

const initialState: UserState = {
  profile: null,
  validatedImagesCorrect: [],
  validatedImagesWrong: [],
  validatedImagesPending: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (
      state,
      action: PayloadAction<Partial<NonNullable<UserState["profile"]>>>
    ) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      } else {
        state.profile = { ...initialState.profile!, ...action.payload }; // Assuming initial is object, but since null, perhaps set new
      }
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.role = action.payload;
      }
    },
    addValidatedImage: (
      state,
      action: PayloadAction<{ image: ValidatedImage; isCorrect: boolean }>
    ) => {
      if (action.payload.isCorrect) {
        state.validatedImagesCorrect.push(action.payload.image);
        if (state.profile) state.profile.validatedCorrect += 1;
      } else {
        state.validatedImagesWrong.push(action.payload.image);
        if (state.profile) state.profile.validatedWrong += 1;
      }
      if (state.profile) state.profile.imagesValidated += 1;
    },
    setPendingValidatedImages: (
      state,
      action: PayloadAction<ValidatedImage[]>
    ) => {
      state.validatedImagesPending = action.payload;
    },
    setCorrectValidatedImages: (
      state,
      action: PayloadAction<ValidatedImage[]>
    ) => {
      state.validatedImagesCorrect = action.payload;
    },
    setWrongValidatedImages: (
      state,
      action: PayloadAction<ValidatedImage[]>
    ) => {
      state.validatedImagesWrong = action.payload;
    },
    setValidationStats: (
      state,
      action: PayloadAction<{
        validatedCorrect: number;
        validatedWrong: number;
      }>
    ) => {
      if (state.profile) {
        state.profile.validatedCorrect = action.payload.validatedCorrect;
        state.profile.validatedWrong = action.payload.validatedWrong;
        state.profile.imagesValidated =
          action.payload.validatedCorrect + action.payload.validatedWrong;
      }
    },
    removePendingImage: (state, action: PayloadAction<string>) => {
      state.validatedImagesPending = state.validatedImagesPending.filter(
        (img) => img.imageName !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        // Do not set profile fields since profile may be null
        // The server handles activation, and login will fetch updated profile
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...(state.profile || {}),
          ...action.payload.user,
          jwtoken: action.payload.token,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        if (state.profile) {
          state.profile.jwtoken = "";
          state.profile = null;
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...(state.profile || {}), ...action.payload };
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...(state.profile || {}), ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateProfile,
  addValidatedImage,
  setUserRole,
  setPendingValidatedImages,
  setCorrectValidatedImages,
  setWrongValidatedImages,
  setValidationStats,
  removePendingImage,
} = userSlice.actions;

export default userSlice.reducer;
