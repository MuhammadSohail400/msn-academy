import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from '../features/auth/slice/authSlice';
import cartReducer from '../features/cart/slice/cartSlice';

// Add each new feature slice here as members build them out
// (courses, orders, learning, assessments, certificates, profile)
const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  cart: cartReducer,
});

export default rootReducer;
