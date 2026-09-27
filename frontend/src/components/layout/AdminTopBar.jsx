import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, ChevronRight, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/slice/authSlice';

export default function AdminTopBar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const segments = location.pathname
    .split('/')
    .filter((s) => s && s !== 'admin');

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    navigate('/login?signedOut=true');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile trigger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 truncate">
          <Link to="/admin" className="font-semibold text-slate-300 hover:text-amber-400 transition-colors shrink-0">
            Admin
          </Link>
          {segments.length === 0 ? (
            <span className="flex items-center gap-1.5 shrink-0">
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-amber-400 font-medium">Overview</span>
            </span>
          ) : (
            segments.map((segment, i) => {
              const isLast = i === segments.length - 1;
              const formatted = segment.replace(/-/g, ' ');
              return (
                <span key={i} className="flex items-center gap-1.5 shrink-0">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                  <span
                    className={`capitalize ${
                      isLast ? 'text-amber-400 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {formatted}
                  </span>
                </span>
              );
            })
          )}
        </nav>
      </div>

      {/* Right: User Pill, Live Preview Link & Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Visit Academy Frontend */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Public Website in new tab"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
        </Link>

        {/* User Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-2.5 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs">
            {(user?.fullName || 'A')[0].toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white leading-none">
                {user?.fullName || 'Super Admin'}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                <ShieldCheck className="h-2.5 w-2.5" />
                ADMIN
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 truncate max-w-[140px]">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

AdminTopBar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
