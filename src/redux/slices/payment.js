import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../axios"

export const fetchPayment = createAsyncThunk(
  "payment/fetchPayment",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("payment", params)
      return data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// Initial state for services
const initialState = {
  status: "idle",
  data: [],
  error: null,
}

// Services slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

// Selectors
export const selectPayment = (state) => state.payment.data
export const selectPaymentStatus = (state) => state.payment.status
export const selectPaymentError = (state) => state.payment.error

// Export reducer
export default paymentSlice.reducer
