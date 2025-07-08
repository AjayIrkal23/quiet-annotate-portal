import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "@/lib/utils";

interface ImageStatsResponse {
  success: boolean;
  zipFileCount: number;
  imageCount: number;
  zipFolders: string[];
}

export const fetchImageStats = createAsyncThunk<
  ImageStatsResponse,
  void,
  { rejectValue: string }
>("upload/fetchImageStats", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASEURL}/images/stats`);

    if (res.data.success) {
      return res.data;
    } else {
      return rejectWithValue("Failed to fetch stats");
    }
  } catch (err) {
    console.error("Stats fetch error:", err);
    return rejectWithValue(err?.message || "Unknown error");
  }
});
