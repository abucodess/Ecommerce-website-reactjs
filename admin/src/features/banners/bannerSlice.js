import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`banners`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
  }
);

export const addBanner = createAsyncThunk(
  "banners/addBanner",
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await api.post(`banners`, bannerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add banner");
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async ({ id, ...bannerData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`banners/${id}`, bannerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update banner");
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`banners/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete banner");
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        const index = state.banners.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b.id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;
