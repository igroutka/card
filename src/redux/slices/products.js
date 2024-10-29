import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../axios"

// Async thunk for fetching services
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("products")
      return data
    } catch (err) {
      console.log(err)

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
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

// Selectors
export const selectProducts = (state) => state.products.data
export const selectProductsStatus = (state) => state.products.status
export const selectProductsError = (state) => state.products.error

// Export reducer
export default productsSlice.reducer
