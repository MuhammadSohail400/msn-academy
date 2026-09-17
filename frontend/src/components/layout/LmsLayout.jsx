import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LmsSidebar from './LmsSidebar';
import LmsTopBar from './LmsTopBar';

// Authenticated LMS shell — Dashboard, My Courses, Learning, Orders, Certificates, Profile
// Redirects unauthenticated users to /login?redirect=<intended-path>
export default function LmsLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

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
