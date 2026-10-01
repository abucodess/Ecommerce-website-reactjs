import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
       let  existingitem = state.items.find(item=>item.id ==action.payload.id && item.size == action.payload.size)
         if (existingitem) {
    existingitem.quantity += 1;
     toast.success("Added to Cart ❤️")
  } else {
    state.items.push({
      ...action.payload,
      quantity: 1,
    });
    toast.success("Added to Cart ❤️")
  }

    },
     increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.id == action.payload.id &&
          item.size == action.payload.size
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.id == action.payload.id &&
          item.size == action.payload.size
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id == action.payload.id &&
            item.size == action.payload.size
          )
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart, } = cartSlice.actions;
let cartreducer = cartSlice.reducer
export default cartreducer;