import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`orders`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`orders/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// We define cancelOrder in a way that handles inventory restoration on the frontend
// since json-server does not support backend transaction triggers.
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (order, { rejectWithValue }) => {
    try {
      // 1. Mark order as cancelled
      const response = await api.patch(`orders/${order.id}`, { status: 'cancelled' });
      
      // 2. Restore inventory for each item
      for (const item of order.items) {
        try {
          // Fetch current product state
          const productResponse = await api.get(`products/${item.productId}`);
          const product = productResponse.data;
          
          if (product && Array.isArray(product.sizes)) {
            // Restore stock for the specific size
            const updatedSizes = product.sizes.map(s => {
              const sizeVal = typeof s === 'object' && s !== null ? s.size : s;
              const currentStock = typeof s === 'object' && s !== null ? (s.stock || 0) : 0;
              
              if (String(sizeVal) === String(item.size)) {
                return { size: sizeVal, stock: currentStock + item.quantity };
              }
              // Convert legacy strings to object if we are updating this product
              return typeof s === 'object' && s !== null ? s : { size: s, stock: 0 };
            });
            
            await api.patch(`products/${product.id}`, { sizes: updatedSizes });
          }
        } catch (err) {
          console.error(`Failed to restore inventory for product ${item.productId}`, err);
          // Continue with other items even if one fails
        }
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
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
      // Update Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
