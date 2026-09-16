import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import ToastContainer from './components/feedback/ToastContainer';
import { fetchMe } from './features/auth/slice/authSlice';
import './index.css';

// Attempt to hydrate auth session from the server HttpOnly cookie on page load.
// fetchMe will silently fail (401) if the user is not logged in — which is fine.
store.dispatch(fetchMe());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
