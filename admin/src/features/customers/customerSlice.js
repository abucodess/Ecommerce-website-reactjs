import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch only users with role "customer"
      const response = await api.get(`users?role=customer`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

export const updateCustomerStatus = createAsyncThunk(
  "customers/updateCustomerStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`users/${id}`, { isActive });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update customer status"
      );
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  "customers/fetchCustomerOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`orders?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customer orders"
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    customerOrders: [],
    loading: false,
    ordersLoading: false,
    error: null,
  },
  reducers: {
    clearCustomerOrders: (state) => {
      state.customerOrders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Customer Status
      .addCase(updateCustomerStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Customer Orders
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.customerOrders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerOrders } = customerSlice.actions;
export default customerSlice.reducer;
