import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productSlice";
import {persistStore,persistReducer} from "redux-persist";
import localStorage from "redux-persist/lib/storage";
let storage = localStorage.default
const persistConfig = {
  key: "root",
  storage
,
};

const persistedProductsReducer = persistReducer(
  persistConfig,
  productsReducer
);

const store = configureStore({
  reducer: {
    products: persistedProductsReducer,
  },
});

export const persistor = persistStore(store);

export default store;