
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnnotationState {
  annotations: {
    [imageId: string]: any[]; // array of bounding boxes, keyed by imageIndex or URL
  };
}

const initialState: AnnotationState = {
  annotations: {},
};

const annotationSlice = createSlice({
  name: 'annotation',
  initialState,
  reducers: {
    saveAnnotationForImage: (
      state,
      action: PayloadAction<{ imageId: string; boxes: any[] }>
    ) => {
      state.annotations[action.payload.imageId] = action.payload.boxes;
    },
    clearAnnotationsForImage: (state, action: PayloadAction<{ imageId: string }>) => {
      state.annotations[action.payload.imageId] = [];
    },
    clearAllAnnotations: (state) => {
      state.annotations = {};
    },
  },
});

export const {
  saveAnnotationForImage,
  clearAnnotationsForImage,
  clearAllAnnotations,
} = annotationSlice.actions;

export default annotationSlice.reducer;
