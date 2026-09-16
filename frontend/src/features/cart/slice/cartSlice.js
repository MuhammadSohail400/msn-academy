import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../../services/cartService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data; // { id, items, appliedCoupon, subtotal, discount, total, currency }
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (courseId, { rejectWithValue }) => {
  try {
    const res = await cartService.addItem(courseId);
    return res.data; // { totalItems, subtotal, total }
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to add item');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (courseId, { rejectWithValue }) => {
  try {
    const res = await cartService.removeItem(courseId);
    return { courseId, summary: res.data };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to remove item');
  }
});

export const emptyCart = createAsyncThunk('cart/emptyCart', async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
    return null;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to clear cart');
  }
});

export const applyPromoCode = createAsyncThunk('cart/applyPromoCode', async (code, { rejectWithValue }) => {
  try {
    const res = await cartService.applyPromo(code);
    return res.data; // { code, discountPercentage, discountAmount, newTotal }
  } catch (err) {
    return rejectWithValue(err.message || 'Invalid promo code');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  id: null,
  items: [],            // [{ courseId, title, slug, thumbnail, price, originalPrice }]
  appliedCoupon: null,  // { code, discountPercentage, discountAmount }
  subtotal: 0,
  discount: 0,
  total: 0,
  currency: 'PKR',
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Optimistic local actions (kept for legacy compatibility)
    addItem(state, action) {
      const existing = state.items.find((i) => i.courseId === action.payload.courseId);
      if (!existing) state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.courseId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.appliedCoupon = null;
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // fetchCart — load full server cart
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;
        state.id = data?.id ?? null;
        state.items = data?.items ?? [];
        state.appliedCoupon = data?.appliedCoupon ?? null;
        state.subtotal = data?.subtotal ?? 0;
        state.discount = data?.discount ?? 0;
        state.total = data?.total ?? 0;
        state.currency = data?.currency ?? 'PKR';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // removeFromCart — optimistically remove then sync
    builder
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.courseId !== action.payload.courseId);
      });

    // emptyCart
    builder
      .addCase(emptyCart.fulfilled, (state) => {
        state.items = [];
        state.appliedCoupon = null;
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
      });

    // applyPromoCode
    builder
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        const data = action.payload;
        state.appliedCoupon = {
          code: data.code,
          discountPercentage: data.discountPercentage,
          discountAmount: data.discountAmount,
        };
        state.total = data.newTotal;
        state.discount = data.discountAmount;
      });
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
