import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import ToastContainer from './components/feedback/ToastContainer';
import { fetchMe } from './features/auth/slice/authSlice';
import './index.css';

// Attempt to hydrate auth session from the server only if an existing session or token exists in localStorage
// This prevents unnecessary 401 Unauthorized noise in the browser console for unauthenticated guest visitors.
const hasLocalAuth = typeof window !== 'undefined' && (localStorage.getItem('auth_token') || localStorage.getItem('user'));
if (hasLocalAuth) {
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
