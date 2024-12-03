import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBag, getTotalItems } from "../services/bagService";

export const fetchTotalItems = createAsyncThunk(
  "cart/fetchTotalItems",
  async (userId) => {
    const response = await getTotalItems(userId);
    return response;
  }
);

export const fetchBag = createAsyncThunk("cart/fetchBag", async (userId) => {
  const response = await getBag(userId);
  return response;
});

const initialState = {
  cart: [],
  invalidItems: [],
  totalPriceWithoutDiscount: 0,
  totalPrice: 0,
  totalItems: 0,
  totalQuantity: 0,
  status: "idle",
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      state.discountPrice = 0;
      state.totalPriceWithoutDiscount = 0;
      state.totalItems = 0;
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalItems = action.payload.data;
      })
      .addCase(fetchTotalItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(fetchBag.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBag.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.cart = action.payload.data?.filter(
          (bagItem) => bagItem?.details?.stock > 0
        );
        const invalidItems = action.payload.data?.filter(
          (bagItem) => bagItem?.details?.stock === 0
        );
        state.invalidItems = invalidItems;
        const totalQuantity = action.payload.data?.reduce(
          (acc, item) =>
            item?.is_selected && item?.details?.stock > 0
              ? acc + item.amount
              : acc,
          0
        );
        state.totalQuantity = totalQuantity;
        const totalPrice = action.payload.data?.reduce(
          (acc, item) =>
            item?.is_selected && item?.details?.stock > 0
              ? acc + item.amount * item.details.finalPrice
              : acc,
          0
        );
        const totalPriceWithoutDiscount = action.payload.data?.reduce(
          (acc, item) =>
            item?.is_selected && item?.details?.stock > 0
              ? acc + item.amount * item.details.price
              : acc,
          0
        );
        state.totalPriceWithoutDiscount = totalPriceWithoutDiscount;
        state.totalPrice = totalPrice;
        const discountPrice = action.payload.data?.reduce(
          (acc, item) =>
            item?.is_selected && item?.details?.stock > 0
              ? acc +
                item.amount * (item.details.price - item.details.finalPrice)
              : acc,
          0
        );
        state.discountPrice = discountPrice;
      })
      .addCase(fetchBag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
