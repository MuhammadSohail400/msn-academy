import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  toasts: [], // { id, message, type: 'success' | 'error' | 'info' }
  isGlobalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare(message, type = 'info') {
        return { payload: { id: nanoid(), message, type } };
      },
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setGlobalLoading(state, action) {
      state.isGlobalLoading = action.payload;
    },
  },
});

export const { showToast, removeToast, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
