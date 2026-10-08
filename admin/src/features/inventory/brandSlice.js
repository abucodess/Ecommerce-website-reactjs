import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/brands");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch brands"
      );
    }
  }
);

export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await api.post("/brands", brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add brand"
      );
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/brands/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update brand"
      );
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/brands/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete brand"
      );
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Brand
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default brandSlice.reducer;
