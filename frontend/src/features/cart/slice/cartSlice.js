import { createSlice } from '@reduxjs/toolkit';

// Skeleton owned by M3 (Cart, Checkout, Orders & Certificates)
// Extend with addItem, removeItem, applyCoupon, syncGuestCart thunks as needed.

const initialState = {
  items: [], // { courseId, title, price, thumbnail }
  couponCode: null,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.courseId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
