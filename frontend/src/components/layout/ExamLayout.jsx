import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Distraction-free exam container: no LMS sidebar, no public footer
export default function ExamLayout() {
  const { isAuthenticated, isInitialAuthChecked, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialAuthChecked || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-crimson border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Preparing assessment engine...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
