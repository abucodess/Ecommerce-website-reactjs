import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  selectedAddressId: null,
  paymentMethod: "cod",
};

const checkoutSlice = createSlice({
  name: "checkout",

  initialState,

  reducers: {
    addAddress: (state, action) => {
      const newAddress = {
        ...action.payload,
        id: Date.now().toString(),
      };

      state.addresses.push(newAddress);

      // Automatically select the newly added address
      state.selectedAddressId = newAddress.id;
    },

    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );

      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId =
          state.addresses.length > 0
            ? state.addresses[0].id
            : null;
      }
    },

    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(
        (address) => address.id === action.payload.id
      );

      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
});

export const {
  addAddress,
  selectAddress,
  deleteAddress,
  updateAddress,
  setPaymentMethod,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;