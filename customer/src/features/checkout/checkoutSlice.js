import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@/services/api";

const initialState = {
  addresses: [],
  selectedAddressId: null,
  paymentMethod: "cod",
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  "checkout/fetchAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`addresses?userId=${userId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addAddress = createAsyncThunk(
  "checkout/addAddress",
  async ({ userId, address }, { rejectWithValue }) => {
    try {
      if (address.isDefault) {
        const existing = await api.get(`addresses?userId=${userId}`);

        await Promise.all(
          existing.data
            .filter((item) => item.isDefault)
            .map((item) =>
              api.patch(`addresses/${item.id}`, {
                isDefault: false,
              }),
            ),
        );
      }

      const response = await api.post("addresses", {
        userId,
        ...address,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateAddress = createAsyncThunk(
  "checkout/updateAddress",
  async ({ addressId, address }, { rejectWithValue }) => {
    try {
      if (address.isDefault) {
        const current = await api.get(`addresses/${addressId}`);

        const existing = await api.get(
          `addresses?userId=${current.data.userId}`,
        );

        await Promise.all(
          existing.data
            .filter(
              (item) =>
                String(item.id) !== String(addressId) &&
                item.isDefault,
            )
            .map((item) =>
              api.patch(`addresses/${item.id}`, {
                isDefault: false,
              }),
            ),
        );
      }

      const response = await api.patch(
        `addresses/${addressId}`,
        address,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "checkout/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await api.delete(`addresses/${addressId}`);

      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",

  initialState,

  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    clearCheckout: (state) => {
      state.selectedAddressId = null;
      state.paymentMethod = "cod";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder


      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;

        const defaultAddress = action.payload.find(
          (address) => address.isDefault,
        );

        state.selectedAddressId =
          defaultAddress?.id ||
          action.payload[0]?.id ||
          null;
      })

      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.isDefault) {
          state.addresses = state.addresses.map((address) => ({
            ...address,
            isDefault: false,
          }));
        }

        state.addresses.push(action.payload);

        state.selectedAddressId = action.payload.id;
      })

      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.isDefault) {
          state.addresses = state.addresses.map((address) => ({
            ...address,
            isDefault:
              String(address.id) === String(action.payload.id),
          }));
        } else {
          const index = state.addresses.findIndex(
            (address) =>
              String(address.id) ===
              String(action.payload.id),
          );

          if (index !== -1) {
            state.addresses[index] = action.payload;
          }
        }
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload;

        state.addresses = state.addresses.filter(
          (address) =>
            String(address.id) !== String(deletedId),
        );

        if (
          String(state.selectedAddressId) ===
          String(deletedId)
        ) {
          const defaultAddress = state.addresses.find(
            (address) => address.isDefault,
          );

          state.selectedAddressId =
            defaultAddress?.id ||
            state.addresses[0]?.id ||
            null;
        }
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectAddress,
  setPaymentMethod,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
