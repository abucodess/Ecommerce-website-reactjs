import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`coupons`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
    }
  }
);

export const addCoupon = createAsyncThunk(
  "coupons/addCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await api.post(`coupons`, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add coupon");
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, ...couponData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update coupon");
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`coupons/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((c) => c.id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
