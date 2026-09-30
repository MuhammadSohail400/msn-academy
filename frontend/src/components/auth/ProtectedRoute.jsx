import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute
 * Wraps any Route that requires authentication.
 * If the user is not logged in, redirects to /login with the intended path
 * preserved in ?redirect= so they can be sent back after logging in.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialAuthChecked, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Only block on cold-start (no cached session yet).
  // Background token refreshes don't show a spinner.
  if (!isInitialAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}
