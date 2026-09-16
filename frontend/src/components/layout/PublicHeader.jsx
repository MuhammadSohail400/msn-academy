import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import MobileNavDrawer from './MobileNavDrawer';
import MsnLogo from '../ui/MsnLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  const user = useSelector((state) => state.auth?.user);

  return (
    <header className="bg-[#0f1e45] border-b border-blue-900/40 relative z-50">      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
      {/* Logo Branding using picture logo SVG */}
      <Link aria-label="MSN Academy Home" className="flex items-center group" to="/">
        <MsnLogo className="h-11 group-hover:scale-105 transition-transform" />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-xs font-medium transition-colors hover:text-white ${isActive ? 'text-white font-bold border-b-2 border-brand-red pb-1' : 'text-slate-300'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right Action Items */}
      <div className="flex items-center gap-2">
        {/* Cart Icon Button */}
        <Link
          to="/checkout"
          aria-label="Cart"
          className="p-2 text-slate-300 hover:text-white relative rounded-full hover:bg-slate-800/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full ring-2 ring-[#0f1e45]" />
        </Link>

        {/* Compact Student Login CTA */}
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
          >
            {user?.fullName ? user.fullName.split(' ')[0] : 'Dashboard'}
          </Link>
        ) : (
          <Link
            to="/login"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
          >
            Student Login
          </Link>
        )}

        {/* Header CTA Button */}
        <Link
          to="/courses"
          className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-3.5 py-2 rounded-md transition-all shadow-sm flex items-center gap-1"
        >
          <span>Explore</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Mobile Drawer Trigger */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle navigation menu"
          className="p-1.5 text-slate-300 hover:text-white md:hidden rounded-lg hover:bg-slate-800/50"
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


