import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../../services/cartService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartService.getCart();
      return res.data; // { id, items, appliedCoupon, subtotal, discount, total, currency }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch cart');
    }
  },
  {
    condition: (force, { getState }) => {
      const { cart } = getState();
      if (force === true) return true;
      if (cart.isLoading) return false;
      if (cart.isInitialized) return false;
      return true;
    },
  }
);

export const addToCart = createAsyncThunk('cart/addToCart', async (courseId, { rejectWithValue }) => {
  try {
    await cartService.addItem(courseId);
    const res = await cartService.getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to add item');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (courseId, { rejectWithValue }) => {
  try {
    await cartService.removeItem(courseId);
    const res = await cartService.getCart();
    return res.data;
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

const loadCachedCart = () => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('msn_cart_cache') : null;
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};
const cachedCart = loadCachedCart();

const initialState = {
  id: cachedCart?.id ?? null,
  items: cachedCart?.items ?? [],
  appliedCoupon: cachedCart?.appliedCoupon ?? null,
  subtotal: cachedCart?.subtotal ?? 0,
  discount: cachedCart?.discount ?? 0,
  total: cachedCart?.total ?? 0,
  currency: cachedCart?.currency ?? 'PKR',
  isLoading: false,
  isInitialized: !!cachedCart,
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
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('msn_cart_cache');
        }
      } catch (e) {}
    },
  },
  extraReducers: (builder) => {
    const syncCartState = (state, data) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.id = data?.id ?? null;
      state.items = data?.items ?? [];
      state.appliedCoupon = data?.appliedCoupon ?? null;
      state.subtotal = data?.subtotal ?? 0;
      state.discount = data?.discount ?? 0;
      state.total = data?.total ?? 0;
      state.currency = data?.currency ?? 'PKR';
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'msn_cart_cache',
            JSON.stringify({
              id: state.id,
              items: state.items,
              appliedCoupon: state.appliedCoupon,
              subtotal: state.subtotal,
              discount: state.discount,
              total: state.total,
              currency: state.currency,
            })
          );
        }
      } catch (e) {}
    };

    // fetchCart — load full server cart
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        syncCartState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload;
      });

    // addToCart — add item & sync full cart
    builder
      .addCase(addToCart.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => {
        syncCartState(state, action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // removeFromCart — remove item & sync full cart
    builder
      .addCase(removeFromCart.pending, (state) => { state.isLoading = true; })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        syncCartState(state, action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
