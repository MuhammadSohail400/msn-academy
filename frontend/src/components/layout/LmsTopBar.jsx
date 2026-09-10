import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

// Breadcrumbs, notifications bell, avatar menu — used inside LmsLayout
export default function LmsTopBar() {
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-brand-navy">
          Dashboard
        </Link>
        {segments
          .filter((s) => s !== 'dashboard')
          .map((segment, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="capitalize text-gray-700">{segment.replace(/-/g, ' ')}</span>
            </span>
          ))}
      </nav>

      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
            {(user?.fullName || 'S')[0].toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:inline">
            {user?.fullName || 'Student'}
          </span>
        </div>
      </div>
    </header>
  );
}
