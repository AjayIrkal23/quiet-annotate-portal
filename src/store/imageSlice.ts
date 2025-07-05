
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageData } from '@/types/annotationTypes';

interface ImageState {
  images: ImageData[];
  currentImageIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [
    {
      "_id": {
        "$oid": "68690639d912ec5777b86bc6"
      },
      "imagePath": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
      "imageName": "WhatsApp Image 2025-06-15 at 1.06.38 PM.jpeg",
      "violationDetails": [
        {
          "name": "Working at Height Without Fall Protection",
          "description": "An individual is standing on top of a truck without any visible fall protection equipment.",
          "severity": "high"
        },
        {
          "name": "Lack of Personal Protective Equipment (PPE)",
          "description": "Individuals are not wearing any visible personal protective equipment such as helmets or reflective clothing.",
          "severity": "high"
        }
      ],
      "createdAt": {
        "$date": "2025-07-05T11:02:17.553Z"
      },
      "updatedAt": {
        "$date": "2025-07-05T11:03:53.498Z"
      },
      "__v": 1
    },
    {
      "_id": {
        "$oid": "68690639d912ec5777b86bc8"
      },
      "imagePath": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
      "imageName": "WhatsApp Image 2025-06-15 at 1.06.39 PM (1).jpeg",
      "violationDetails": [
        {
          "name": "Uneven Flooring and Obstructions",
          "description": "The floor appears to be uneven with a metal strip protruding, which could cause trips and falls. Additionally, there is a plastic bottle lying on the floor, adding to the risk of tripping.",
          "severity": "high"
        },
        {
          "name": "Accumulated Debris",
          "description": "There is a significant accumulation of dust and debris, which could pose respiratory hazards and increase the risk of slips, trips, and falls.",
          "severity": "high"
        },
        {
          "name": "Poor Lighting",
          "description": "The area appears to be poorly lit, which can contribute to accidents and make it difficult to identify other hazards.",
          "severity": "medium"
        }
      ],
      "createdAt": {
        "$date": "2025-07-05T11:02:17.561Z"
      },
      "updatedAt": {
        "$date": "2025-07-05T11:04:03.040Z"
      },
      "__v": 1
    },
    {
      "_id": {
        "$oid": "68690639d912ec5777b86bca"
      },
      "imagePath": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
      "imageName": "WhatsApp Image 2025-06-15 at 1.06.39 PM (2).jpeg",
      "violationDetails": [
        {
          "name": "Damaged or unsecured ladder",
          "description": "The ladder attached to the structure does not appear to be secured, which poses a risk of collapse or falling, especially when in use.",
          "severity": "high"
        },
        {
          "name": "Accumulated dust or debris",
          "description": "There is visible accumulated dust or debris on the ground, which can cause respiratory issues or become a slip hazard.",
          "severity": "medium"
        }
      ],
      "createdAt": {
        "$date": "2025-07-05T11:02:17.563Z"
      },
      "updatedAt": {
        "$date": "2025-07-05T11:04:14.853Z"
      },
      "__v": 1
    }
  ],
  currentImageIndex: 0,
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: 'image',
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
