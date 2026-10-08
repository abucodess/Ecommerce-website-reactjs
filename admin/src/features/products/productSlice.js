import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


// =========================
// Fetch Products
// =========================
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// =========================
// Fetch Single Product
// =========================
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// =========================
// Add Product
// =========================
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await api.post("/products", product);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// =========================
// Update Product
// =========================
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// =========================
// Delete Product (Soft Delete)
// =========================
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/products/${id}`, { isDeleted: true });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// =========================
// Product Slice
// =========================
const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    selectedProduct: null,

    loading: false,
    error: null,

    filters: {
      search: "",
      brand: "all",
      category: "all",
      stock: "all",
    },
  },

  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },

    setBrandFilter: (state, action) => {
      state.filters.brand = action.payload;
    },

    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },

    setStockFilter: (state, action) => {
      state.filters.stock = action.payload;
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // Fetch Products
      // =========================
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // Fetch Single Product
      // =========================
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // Add Product
      // =========================
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // Update Product
      // =========================
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }

        state.selectedProduct = action.payload;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // Delete Product
      // =========================
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );

        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setBrandFilter,
  setCategoryFilter,
  setStockFilter,
  setSelectedProduct,
  clearSelectedProduct,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;