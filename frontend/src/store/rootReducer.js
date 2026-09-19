import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from '../features/auth/slice/authSlice';
import cartReducer from '../features/cart/slice/cartSlice';
import learningReducer from '../features/learning/learningSlice';
import assessmentReducer from '../features/assessments/assessmentSlice';

// Combined root reducer with Member 4 learning & assessment state
const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  cart: cartReducer,
  learning: learningReducer,
  assessments: assessmentReducer,
});

export default rootReducer;
