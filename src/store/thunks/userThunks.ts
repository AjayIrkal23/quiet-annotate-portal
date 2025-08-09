// userThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserState } from "../userSlice";
import { BASEURL } from "@/lib/utils";

const API_URL = `${BASEURL}/users/`;

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    userData: {
      name: string;
      employeeId: string;
      email: string;
      password: string;
      department: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyUser = createAsyncThunk(
  "user/verify",
  async ({ email, code }: { email: string; code: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}verify`, { email, code });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { employeeId, password }: { employeeId: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${API_URL}login`, {
        employeeId,
        password,
      });
      // Assuming the response includes token and user details
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (employeeId: string, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}logout`, { employeeId });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (employeeId: string, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}${employeeId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (
    {
      employeeId,
      updates,
    }: { employeeId: string; updates: Partial<UserState["profile"]> },
    thunkAPI
  ) => {
    try {
      const response = await axios.patch(`${API_URL}${employeeId}`, updates);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
