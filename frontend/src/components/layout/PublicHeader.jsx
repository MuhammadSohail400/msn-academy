import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import MobileNavDrawer from './MobileNavDrawer';
import MsnLogo from '../ui/MsnLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Tech Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  const user = useSelector((state) => state.auth?.user);

  return (
    <header className="bg-[#0e1e45] text-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo Branding */}
        <Link aria-label="MSN Academy Home" className="flex items-center group shrink-0" to="/">
          <MsnLogo className="h-9 group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6.5">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-normal transition-all relative py-1 ${isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#c41230] after:rounded-full'
                  : 'text-slate-200 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            to="/checkout"
            aria-label="Cart"
            className="text-slate-200 hover:text-white transition-colors relative p-0.5"
          >
            <ShoppingCart className="w-5.5 h-5.5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#c41230] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Student Login CTA */}
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex text-xs font-medium text-white border border-slate-400/50 hover:border-white px-3.5 py-2 rounded-lg transition-colors"
            >
              {user?.fullName ? user.fullName.split(' ')[0] : 'Dashboard'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs font-medium text-white border border-slate-400/50 hover:border-white px-3.5 py-2 rounded-lg transition-colors"
            >
              Student Login
            </Link>
          )}

          {/* Header CTA Button */}
          <Link
            to="/courses"
            className="bg-[#c41230] hover:bg-[#a00e26] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Explore Courses
          </Link>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle navigation menu"
            className="p-1 text-slate-200 hover:text-white lg:hidden rounded-lg"
          >
            {drawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}