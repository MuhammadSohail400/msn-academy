import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../../services/authService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.message || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    return res.data; // { user, accessToken, refreshToken }
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return res.data; // { user, accessToken, refreshToken }
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await authService.logout();
  } catch {
    // Graceful offline/network logout fallback
  }
  return null;
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savedUser = getInitialUser();

const initialState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
  isInitialAuthChecked: !!savedUser,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const payload = action.payload;
      state.user = payload.user || payload;
      state.isAuthenticated = true;
      state.isInitialAuthChecked = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
        if (payload.accessToken) {
          localStorage.setItem('auth_token', payload.accessToken);
        }
      }
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialAuthChecked = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    },
    setAuthLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchMe
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialAuthChecked = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialAuthChecked = true;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
        }
      });

    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.user = payload.user || payload;
        state.isAuthenticated = true;
        state.isInitialAuthChecked = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
          if (payload.accessToken) {
            localStorage.setItem('auth_token', payload.accessToken);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.user = payload.user || payload;
        state.isAuthenticated = true;
        state.isInitialAuthChecked = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
          if (payload.accessToken) {
            localStorage.setItem('auth_token', payload.accessToken);
          }
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialAuthChecked = true;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialAuthChecked = true;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
        }
      });
  },
});

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
