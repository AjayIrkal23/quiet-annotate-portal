
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ValidatedImage {
  imagePath: string;
  employeeId: string;
  imageName: string;
  violationDetails: {
    name: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    isValid: boolean;
  }[];
}

interface UserState {
  profile: {
    name: string;
    employeeId: string;
    imagesValidated: number;
    validatedCorrect: number;
    validatedWrong: number;
    leaderboardPosition: number;
  };
  validatedImagesCorrect: ValidatedImage[];
  validatedImagesWrong: ValidatedImage[];
}

const initialState: UserState = {
  profile: {
    name: "John Doe",
    employeeId: "EMP001",
    imagesValidated: 45,
    validatedCorrect: 38,
    validatedWrong: 7,
    leaderboardPosition: 3,
  },
  validatedImagesCorrect: [
    {
      imagePath: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
      employeeId: "EMP001",
      imageName: "WhatsApp Image 2025-06-15 at 1.06.38 PM.jpeg",
      violationDetails: [
        {
          name: "Working at Height Without Fall Protection",
          description: "An individual is standing on top of a truck without any visible fall protection equipment.",
          severity: "high",
          isValid: true
        },
        {
          name: "Lack of Personal Protective Equipment (PPE)",
          description: "Individuals are not wearing any visible personal protective equipment such as helmets or reflective clothing.",
          severity: "high",
          isValid: true
        }
      ]
    },
    {
      imagePath: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
      employeeId: "EMP001",
      imageName: "Construction Site Image 2.jpeg",
      violationDetails: [
        {
          name: "Uneven Flooring and Obstructions",
          description: "The floor appears to be uneven with a metal strip protruding.",
          severity: "high",
          isValid: true
        }
      ]
    }
  ],
  validatedImagesWrong: [
    {
      imagePath: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
      employeeId: "EMP001",
      imageName: "WhatsApp Image 2025-06-15 at 1.06.39 PM.jpeg",
      violationDetails: [
        {
          name: "Damaged or unsecured ladder",
          description: "The ladder attached to the structure does not appear to be secured.",
          severity: "high",
          isValid: false
        },
        {
          name: "Accumulated dust or debris",
          description: "There is visible accumulated dust or debris on the ground.",
          severity: "medium",
          isValid: true
        }
      ]
    }
  ]
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<typeof state.profile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    addValidatedImage: (state, action: PayloadAction<{ image: ValidatedImage; isCorrect: boolean }>) => {
      if (action.payload.isCorrect) {
        state.validatedImagesCorrect.push(action.payload.image);
        state.profile.validatedCorrect += 1;
      } else {
        state.validatedImagesWrong.push(action.payload.image);
        state.profile.validatedWrong += 1;
      }
      state.profile.imagesValidated += 1;
    },
  },
});

export const { updateProfile, addValidatedImage } = userSlice.actions;
export default userSlice.reducer;
