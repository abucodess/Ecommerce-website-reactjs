import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

let initialState = {
  products: [],
  isloading: false,
  error: null,
  searchTerm: "",
  selectedBrand: "all",
  selectedCategory: "all",
  sortBy: "featured",
};
export let fetchproducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      let res = await api.get("products");
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
let productslice = createSlice({
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
        state.isloading = false ;
        state.products = action.payload;
      })
      .addCase(fetchproducts.rejected, (state, action) => {
        state.isloading = false ;
        state.error = action.payload;
      });
  },
});
export let {setSearchTerm,setSelectedBrand,setSelectedCategory,setSortBy} = productslice.actions
let productsreducer = productslice.reducer;
export default productsreducer;
