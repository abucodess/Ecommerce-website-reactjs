
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "@/services/api";

const initialState = {
  items: [],
  cartId: null,
  loading: false,
  error: null,
};
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `carts?userId=${userId}`
      );

      if (response.data.length === 0) {
        const newCart = await api.post("carts", {
          userId,
          items: [],
        });

        return newCart.data;
      }

      return response.data[0];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, product, size },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `carts?userId=${userId}`
      );

      let cart = response.data[0];

      if (!cart) {
        const newCart = await api.post("carts", {
          userId,
          items: [
            {
              productId: Number(product.id),
              size,
              quantity: 1,
            },
          ],
        });

        return newCart.data;
      }

      const existingItem = cart.items.find(
        (item) =>
          Number(item.productId) === Number(product.id) &&
          Number(item.size) === Number(size)
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = cart.items.map((item) =>
          Number(item.productId) === Number(product.id) &&
          Number(item.size) === Number(size)
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        updatedItems = [
          ...cart.items,
          {
            productId: Number(product.id),
            size,
            quantity: 1,
          },
        ];
      }

      const updatedCart = await api.patch(
        `carts/${cart.id}`,
        {
          items: updatedItems,
        }
      );

      return updatedCart.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const buyNow = createAsyncThunk(
  "cart/buyNow",
  async ({ userId, product, size }, { rejectWithValue }) => {
    try {
      const response = await api.get(`carts?userId=${userId}`);
      let cart = response.data[0];

      const newItem = {
        productId: Number(product.id),
        size,
        quantity: 1,
      };

      if (!cart) {
        const newCart = await api.post("carts", {
          userId,
          items: [newItem],
        });

        return newCart.data;
      }

      if (response.data.length > 1) {
        for (let i = 1; i < response.data.length; i++) {
          try {
            await api.delete(`carts/${response.data[i].id}`);
          } catch {
            // ignore
          }
        }
      }

      const updatedCart = await api.patch(`carts/${cart.id}`, {
        items: [newItem],
      });

      return updatedCart.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (
    { cartId, productId, size },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `carts/${cartId}`
      );

      const cart = response.data;

      const updatedItems = cart.items.map((item) =>
        Number(item.productId) === Number(productId) &&
        Number(item.size) === Number(size)
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      const updatedCart = await api.patch(
        `carts/${cartId}`,
        {
          items: updatedItems,
        }
      );

      return updatedCart.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (
    { cartId, productId, size },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `carts/${cartId}`
      );

      const cart = response.data;

      const updatedItems = cart.items.map((item) =>
        Number(item.productId) === Number(productId) &&
        Number(item.size) === Number(size) &&
        item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      );

      const updatedCart = await api.patch(
        `carts/${cartId}`,
        {
          items: updatedItems,
        }
      );

      return updatedCart.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { cartId, productId, size },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `carts/${cartId}`
      );

      const cart = response.data;

      const updatedItems = cart.items.filter(
        (item) =>
          !(
            Number(item.productId) === Number(productId) &&
            Number(item.size) === Number(size)
          )
      );

      const updatedCart = await api.patch(
        `carts/${cartId}`,
        {
          items: updatedItems,
        }
      );

      return updatedCart.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (cartId, { rejectWithValue }) => {
    try {
      const updatedCart = await api.patch(
        `carts/${cartId}`,
        {
          items: [],
        }
      );

      return updatedCart.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(buyNow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(buyNow.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      })

      .addCase(buyNow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      })

      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartId = action.payload.id;
        state.items = action.payload.items;
      });
  },
});

export default cartSlice.reducer;

