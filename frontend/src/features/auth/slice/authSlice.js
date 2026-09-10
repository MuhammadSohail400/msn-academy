import { createSlice } from '@reduxjs/toolkit';

// Skeleton owned by M1 (Auth, Profile & Dashboard) — see docs/03-Frontend-Architecture.md
// Extend with async thunks (loginUser, registerUser, logoutUser, fetchProfile) as needed.

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
