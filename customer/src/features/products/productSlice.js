import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  products: [],
  isloading: true,
  error: null,
  searchTerm: "",
  selectedBrand: "all",
  selectedCategory: "all",
  sortBy: "featured",
};

export const fetchproducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("products");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

const productslice = createSlice({
  name: "products",
  initialState,

  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchproducts.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })

      .addCase(fetchproducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.products = action.payload;
      })

      .addCase(fetchproducts.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setSelectedBrand,
  setSelectedCategory,
  setSortBy,
} = productslice.actions;

export default productslice.reducer;