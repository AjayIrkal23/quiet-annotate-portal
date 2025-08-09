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
  loading: boolean;
  error: string | null;
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
        // Update localStorage with new profile data
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
      } else {
        state.profile = { ...initialState.profile!, ...action.payload };
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
      }
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.role = action.payload;
        // Update localStorage with new role
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
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
      if (state.profile) {
        state.profile.imagesValidated += 1;
        // Update localStorage with updated profile stats
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
      }
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
        // Update localStorage with updated stats
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
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
        // Persist user profile and token in localStorage
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
        localStorage.setItem("isLoggedIn", "true");
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
        state.profile = null;
        state.validatedImagesCorrect = [];
        state.validatedImagesWrong = [];
        state.validatedImagesPending = [];
        // Clear localStorage on logout
        localStorage.removeItem("userProfile");
        localStorage.removeItem("isLoggedIn");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Clear localStorage even on logout failure to ensure clean state
        localStorage.removeItem("userProfile");
        localStorage.removeItem("isLoggedIn");
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...(state.profile || {}), ...action.payload };
        // Update localStorage with fetched user data
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
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
        // Update localStorage with updated user data
        localStorage.setItem("userProfile", JSON.stringify(state.profile));
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
