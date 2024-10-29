import { configureStore } from "@reduxjs/toolkit"

// Reducers
import productsReducer from "./slices/products"
import paymentReducer from "./slices/payment"

const store = configureStore({
  reducer: {
    products: productsReducer,
    payment: paymentReducer,
  },
})

export default store
