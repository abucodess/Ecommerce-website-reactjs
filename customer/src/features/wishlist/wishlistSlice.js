import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

const initialState = {
  items: [],
  wishlistId: null,
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `wishlists?userId=${userId}`
      );

      if (response.data.length === 0) {
        const newWishlist = await api.post("wishlists", {
          userId,
          products: [],
        });

        return newWishlist.data;
      }
      return response.data[0];

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addWishlist = createAsyncThunk(
  "wishlist/addWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`wishlists?userId=${userId}`);

      const wishlist = response.data[0];
      if (wishlist) {
        if (wishlist.products.includes(String(productId))) {
          return wishlist;
        }

        const updatedProducts = [
          ...wishlist.products,
          String(productId),
        ];

        const updateResponse = await api.patch(
          `wishlists/${wishlist.id}`,
          {
            products: updatedProducts,
          }
        );

        return updateResponse.data;
      }

      const createResponse = await api.post("wishlists", {
        userId,
        products: [String(productId)],
      });

      return createResponse.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async ({ wishlistId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`wishlists/${wishlistId}`);

      const wishlist = response.data;

      const updatedProducts = wishlist.products.filter(
        (id) => String(id) !== String(productId)
      );

      const updateResponse = await api.patch(
        `wishlists/${wishlistId}`,
        {
          products: updatedProducts,
        }
      );

      return updateResponse.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.wishlistId = action.payload.id;
        state.items = action.payload.products;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.wishlistId = action.payload.id;
        state.items = action.payload.products;
      })

      .addCase(addWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.wishlistId = action.payload.id;
        state.items = action.payload.products;
      })

      .addCase(removeWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;

