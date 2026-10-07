import { configureStore } from "@reduxjs/toolkit"

import authreducer from '../features/auth/authSlice'
import orderreducer from '../features/orders/orderSlice'
 let store = configureStore({
    reducer : {
        auth : authreducer,
        orders : orderreducer
    }

})
export default store