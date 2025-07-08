import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UploadedImage } from "../uploadSlice";
import { BASEURL } from "@/lib/utils";

interface UploadZipResponse {
  success: boolean;
  message: string;
  data: UploadedImage[];
}

export const uploadZipThunk = createAsyncThunk<
  UploadedImage[], // return type
  File, // argument type
  { rejectValue: string }
>("upload/uploadZip", async (zipFile, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", zipFile);

    const response = await axios.post<UploadZipResponse>(
      `${BASEURL}/images/upload-zip`, // change if your backend route is different
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      return rejectWithValue(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    return rejectWithValue(error?.message || "Unexpected error");
  }
});
