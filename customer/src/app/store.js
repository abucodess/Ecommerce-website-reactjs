import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/es/storage";

import productsReducer from "../features/products/productSlice";
import cartReducer from "@/features/cart/cartSlice";
import wishlistReducer from "@/features/wishlist/wishlistSlice";
import checkoutreducer from '@/features/checkout/checkoutSlice'
import orderreducer from '@/features/orders/orderSlice'
import authreducer from "@/features/auth/authslice"
const persistConfig = {
  key: "cart",
  storage
};

const persistedproductreducer = persistReducer(
  persistConfig,
  productsReducer
);

const store = configureStore({
  reducer: {
    products: persistedproductreducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    checkout : checkoutreducer,
    orders : orderreducer,
    auth : authreducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;