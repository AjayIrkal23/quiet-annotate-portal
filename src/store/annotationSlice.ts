
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoundingBox, AnnotationSubmission } from '@/types/annotationTypes';

interface AnnotationState {
  annotations: {
    [imageId: string]: BoundingBox[];
  };
  submissions: AnnotationSubmission[];
}

const initialState: AnnotationState = {
  annotations: {},
  submissions: [],
};

const annotationSlice = createSlice({
  name: 'annotation',
  initialState,
  reducers: {
    saveAnnotationForImage: (
      state,
      action: PayloadAction<{ imageId: string; boxes: BoundingBox[] }>
    ) => {
      state.annotations[action.payload.imageId] = action.payload.boxes;
    },
    submitAnnotations: (state, action: PayloadAction<AnnotationSubmission>) => {
      state.submissions.push(action.payload);
      // Optionally clear the annotations for this image after submission
      delete state.annotations[action.payload.imageId];
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
  submitAnnotations,
  clearAnnotationsForImage,
  clearAllAnnotations,
} = annotationSlice.actions;

export default annotationSlice.reducer;
