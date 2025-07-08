// store/thunks/fetchUniqueImages.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ImageData } from "../imageSlice"; // path to your slice
import { BASEURL } from "@/lib/utils"; // or define your backend URL

export const fetchUniqueImages = createAsyncThunk<
  ImageData[],
  string,
  { rejectValue: string }
>("image/fetchUniqueImages", async (employeeId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASEURL}/startAnotate`, {
      params: { employeeId },
    });

    if (res.data.success) {
      return res.data.data as ImageData[];
    } else {
      return rejectWithValue(res.data.message || "Failed to fetch images");
    }
  } catch (err) {
    return rejectWithValue(err.message || "Request failed");
  }
});
