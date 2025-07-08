import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "@/lib/utils";
import {
  ValidatedImage,
  setPendingValidatedImages,
  setCorrectValidatedImages,
  setWrongValidatedImages,
  setValidationStats,
} from "../userSlice";

interface FetchPayload {
  employeeId: string;
}

export const fetchAllValidatedImages = createAsyncThunk<
  void,
  FetchPayload,
  { rejectValue: string }
>(
  "user/fetchAllValidatedImages",
  async ({ employeeId }, { dispatch, rejectWithValue }) => {
    try {
      let validatedCorrect = 0;
      let validatedWrong = 0;

      // Fetch correct images
      const correctRes = await axios.get(
        `${BASEURL}/annotatedImages/by-validation`,
        {
          params: { isValid: "true", employeeId },
        }
      );

      if (!correctRes.data.success) {
        throw new Error("Failed to fetch validated correct images");
      }

      dispatch(setCorrectValidatedImages(correctRes.data.data));
      validatedCorrect =
        correctRes.data.validatedCorrect || correctRes.data.count || 0;

      // Fetch wrong images
      const wrongRes = await axios.get(
        `${BASEURL}/annotatedImages/by-validation`,
        {
          params: { isValid: "false", employeeId },
        }
      );

      if (!wrongRes.data.success) {
        throw new Error("Failed to fetch validated wrong images");
      }

      dispatch(setWrongValidatedImages(wrongRes.data.data));
      validatedWrong = wrongRes.data.validatedWrong || wrongRes.data.count || 0;

      // Fetch pending images
      const pendingRes = await axios.get(
        `${BASEURL}/annotatedImages/by-validation`,
        {
          params: { isValid: "null", employeeId },
        }
      );

      if (!pendingRes.data.success) {
        throw new Error("Failed to fetch pending images");
      }

      dispatch(setPendingValidatedImages(pendingRes.data.data));

      // Update profile stats
      dispatch(setValidationStats({ validatedCorrect, validatedWrong }));
    } catch (err) {
      console.error("❌ Error in fetchAllValidatedImages:", err);
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);
