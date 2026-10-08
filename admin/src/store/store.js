import { configureStore } from "@reduxjs/toolkit";

import authreducer from '../features/auth/authSlice';
import orderreducer from '../features/orders/orderSlice';
import productreducer from '../features/products/productSlice';
import brandreducer from '../features/inventory/brandSlice';
import categoryreducer from '../features/inventory/categorySlice';
import customerreducer from '../features/customers/customerSlice';
import reviewreducer from '../features/reviews/reviewSlice';
import couponreducer from '../features/coupons/couponSlice';
import bannerreducer from '../features/banners/bannerSlice';

let store = configureStore({
  reducer: {
    auth: authreducer,
    orders: orderreducer,
    products: productreducer,
    brands: brandreducer,
    categories: categoryreducer,
    customers: customerreducer,
    reviews: reviewreducer,
    coupons: couponreducer,
    banners: bannerreducer
  }
});

export default store;