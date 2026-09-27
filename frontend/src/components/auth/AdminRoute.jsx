import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * AdminRoute
 * Enforces role-based access control (RBAC) on the frontend.
 * Only authenticated users with role === 'ADMIN' can access nested routes.
 */
export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isInitialAuthChecked, isLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (!isInitialAuthChecked || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Verifying administrative credentials...</p>
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

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-800/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-5">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The Admin Portal requires administrator privileges. Your current account (<span className="text-slate-200 font-medium">{user?.email}</span>) is registered as a student.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}

AdminRoute.propTypes = {
  children: PropTypes.node,
};
