import React from 'react';
import { Outlet } from 'react-router-dom';
import LmsSidebar from './LmsSidebar';
import LmsTopBar from './LmsTopBar';

// Sidebar + TopBar shell — wraps M1's dashboard and M4's my-courses/learning pages
// NOTE: real route guarding (redirect to /login if not authenticated) will be added
// by M1 once authSlice is fully built out.
export default function LmsLayout() {
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
