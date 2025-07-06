
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UploadedImage {
  _id: {
    $oid: string;
  };
  imagePath: string;
  imageName: string;
  violationDetails: {
    name: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
}

interface UploadState {
  uploadedImages: UploadedImage[];
  currentPage: number;
  imagesPerPage: number;
  totalZipFiles: number;
  isUploading: boolean;
}

const initialState: UploadState = {
  uploadedImages: [
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
  currentPage: 1,
  imagesPerPage: 30,
  totalZipFiles: 0,
  isUploading: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadedImages: (state, action: PayloadAction<UploadedImage[]>) => {
      state.uploadedImages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalZipFiles: (state, action: PayloadAction<number>) => {
      state.totalZipFiles = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
  },
});

export const {
  setUploadedImages,
  setCurrentPage,
  setTotalZipFiles,
  setIsUploading,
} = uploadSlice.actions;

export default uploadSlice.reducer;
