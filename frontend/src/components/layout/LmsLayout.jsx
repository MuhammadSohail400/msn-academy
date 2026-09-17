import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LmsSidebar from './LmsSidebar';
import LmsTopBar from './LmsTopBar';

// Authenticated LMS shell — Dashboard, My Courses, Learning, Orders, Certificates, Profile
// Redirects unauthenticated users to /login?redirect=<intended-path>
export default function LmsLayout() {
  const { isAuthenticated, isInitialAuthChecked, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialAuthChecked || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-crimson border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Checking authentication...</p>
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

  return (
    <div className="flex min-h-screen">
      <LmsSidebar />
      <div className="flex flex-1 flex-col">
        <LmsTopBar />
        <main className="flex-1 bg-gray-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
