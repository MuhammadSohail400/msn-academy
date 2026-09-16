import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="hidden px-7 pt-8 md:block">
        <Link
          to="/"
          className="text-sm text-[#A8B1C0] transition hover:text-brand-navy"
        >
           &nbsp;Back to Website
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}