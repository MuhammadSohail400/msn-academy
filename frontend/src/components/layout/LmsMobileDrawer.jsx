import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  LayoutDashboard,
  BookOpen,
  Award,
  ShoppingBag,
  UserCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { logoutUser } from '../../features/auth/slice/authSlice';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/certificate', label: 'Certificates', icon: Award },
  { to: '/orders', label: 'Orders History', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function LmsMobileDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    onClose();
    await dispatch(logoutUser());
    navigate('/login?signedOut=true');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-crimson text-white shadow-sm font-semibold'
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'pointer-events-none invisible'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer panel (slides from left) */}
      <div
        className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-brand-navy border-r border-white/10 text-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Top bar with Logo & Close button */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 shrink-0 font-display text-[10px] font-bold text-white leading-none">
                MSN
              </div>
              <span className="font-display text-sm font-bold text-white tracking-wide">
                MSN Academy
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Student Profile snippet */}
          <div className="px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-crimson text-sm font-bold text-white shrink-0 shadow-sm">
                {(user?.fullName || 'S')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.fullName || 'Student'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || 'student@msnacademy.pk'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 p-4">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={onClose} className={linkClass}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions: Back to Website & Sign Out */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-brand-navy">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>Back to Website</span>
          </NavLink>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

LmsMobileDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
