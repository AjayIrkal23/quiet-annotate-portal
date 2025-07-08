import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface UserState {
  profile: {
    name: string;
    employeeId: string;
    role: string | null;
    imagesValidated: number;
    validatedCorrect: number;
    validatedWrong: number;
    leaderboardPosition: number;
  };
  validatedImagesCorrect: ValidatedImage[];
  validatedImagesWrong: ValidatedImage[];
  validatedImagesPending: ValidatedImage[]; // ✅ New field
}

const initialState: UserState = {
  profile: {
    name: "Ajay Irkal",
    employeeId: "AjayIrkal",
    role: "admin",
    imagesValidated: 45,
    validatedCorrect: 38,
    validatedWrong: 7,
    leaderboardPosition: 1,
  },
  validatedImagesCorrect: [],
  validatedImagesWrong: [],
  validatedImagesPending: [], // ✅ Init pending
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (
      state,
      action: PayloadAction<Partial<typeof state.profile>>
    ) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.profile.role = action.payload;
    },
    addValidatedImage: (
      state,
      action: PayloadAction<{ image: ValidatedImage; isCorrect: boolean }>
    ) => {
      if (action.payload.isCorrect) {
        state.validatedImagesCorrect.push(action.payload.image);
        state.profile.validatedCorrect += 1;
      } else {
        state.validatedImagesWrong.push(action.payload.image);
        state.profile.validatedWrong += 1;
      }
      state.profile.imagesValidated += 1;
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
      state.profile.validatedCorrect = action.payload.validatedCorrect;
      state.profile.validatedWrong = action.payload.validatedWrong;
      state.profile.imagesValidated =
        action.payload.validatedCorrect + action.payload.validatedWrong;
    },
    removePendingImage: (state, action: PayloadAction<string>) => {
      state.validatedImagesPending = state.validatedImagesPending.filter(
        (img) => img.imageName !== action.payload
      );
    },
  },
});

export const {
  updateProfile,
  addValidatedImage,
  setUserRole,
  setPendingValidatedImages,
  setCorrectValidatedImages, // ✅ now exported
  setWrongValidatedImages, // ✅ now exported
  setValidationStats, // ✅ include here
  removePendingImage,
} = userSlice.actions;

export default userSlice.reducer;
