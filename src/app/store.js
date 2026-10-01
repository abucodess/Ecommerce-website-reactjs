import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/es/storage";

import productsReducer from "../features/products/productSlice";
import cartReducer from "@/features/cart/cartSlice";
import wishlistReducer from "@/features/wishlist/wishlistSlice";
import checkoutreducer from '@/features/checkout/checkoutSlice'


const persistConfig = {
  key: "cart",
  storage,
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
    checkout : checkoutreducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;