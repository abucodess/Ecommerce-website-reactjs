import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

const initialState = {
  orders: [],
  loading: true,
  placingOrder: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`orders?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async ({ userId, shippingAddress }, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const cartItems = state.cart.items;
      const products = state.products.products;
      const cartId = state.cart.cartId;

      if (!cartItems.length) {
        return rejectWithValue("Your cart is empty.");
      }

      if (!cartId) {
        return rejectWithValue("Cart not found.");
      }

      const orderItems = cartItems.map((cartItem) => {
        const product = products.find(
          (product) => String(product.id) === String(cartItem.productId),
        );

        if (!product) {
          throw new Error(`Product ${cartItem.productId} was not found.`);
        }

        return {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          size: cartItem.size,
          quantity: cartItem.quantity,
        };
      });

      const subtotal = orderItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0,
      );

      const delivery = subtotal >= 2000 ? 0 : 100;
      const total = subtotal + delivery;

      const orderData = {
        userId,
        items: orderItems,
        shippingAddress,
        subtotal,
        delivery,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const orderResponse = await api.post("orders", orderData);

      await api.patch(`carts/${cartId}`, {
        items: [],
      });

      return orderResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ orderId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`orders/${orderId}`);

      const order = response.data;

      if (order.userId !== userId) {
        return rejectWithValue("You cannot cancel this order.");
      }

      if (order.status !== "pending") {
        return rejectWithValue("This order can no longer be cancelled.");
      }

      const updatedResponse = await api.patch(`orders/${orderId}`, {
        status: "cancelled",
      });

      return updatedResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
