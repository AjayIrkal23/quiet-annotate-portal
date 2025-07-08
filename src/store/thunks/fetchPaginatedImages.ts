import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UploadedImage } from "../uploadSlice";
import { BASEURL } from "@/lib/utils";

interface PaginatedImageResponse {
  success: boolean;
  data: UploadedImage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const fetchPaginatedImages = createAsyncThunk<
  { images: UploadedImage[]; total: number },
  { page: number; limit: number },
  { rejectValue: string }
>(
  "upload/fetchPaginatedImages",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await axios.get<PaginatedImageResponse>(
        `${BASEURL}/images/paginated-images?page=${page}&limit=${limit}`
      );

      if (res.data.success) {
        return {
          images: res.data.data,
          total: res.data.pagination.total,
        };
      } else {
        return rejectWithValue("Failed to fetch images");
      }
    } catch (err) {
      return rejectWithValue(err.message || "Fetch error");
    }
  }
);
