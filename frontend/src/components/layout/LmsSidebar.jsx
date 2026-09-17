import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
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
  { to: '/dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/my-courses',  label: 'My Courses',    icon: BookOpen },
  { to: '/certificate', label: 'Certificates',  icon: Award },
  { to: '/orders',      label: 'Orders History', icon: ShoppingBag },
  { to: '/profile',     label: 'Profile',       icon: UserCircle },
];

export default function LmsSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-crimson text-white'
        : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="hidden w-60 shrink-0 bg-brand-navy md:flex md:flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 shrink-0">
          <span className="text-white text-[10px] font-bold leading-none text-center">MSN</span>
        </div>
        <span className="font-display text-sm font-bold text-white">MSN Academy</span>
      </div>

      {/* Main nav links */}
      <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Back to Website + Sign Out */}
      <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span>Back to Website</span>
        </NavLink>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
