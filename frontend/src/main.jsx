import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import ToastContainer from './components/feedback/ToastContainer';
import { fetchMe } from './features/auth/slice/authSlice';
import './index.css';

// Silent background refresh: re-validate user session from server on every load.
// isInitialAuthChecked is always TRUE so this never blocks navigation or shows a spinner.
// It simply keeps role/profile data fresh in the Redux store.
const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
if (hasToken) {
  store.dispatch(fetchMe());
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
