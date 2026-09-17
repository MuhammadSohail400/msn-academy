import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MobileNavDrawer from './MobileNavDrawer';
import { openCartDrawer } from '../../store/slices/uiSlice';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicHeader() {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 2);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 font-display text-sm font-bold tracking-wider text-white shadow-inner">
            MSN
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-white leading-tight">
              MSN
            </span>
            <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase leading-none">
              Academy
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-all relative py-1 ${
                  isActive
                    ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-crimson'
                    : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {/* Tech Blog item as in Figma */}
          <span className="text-sm font-medium text-slate-400 cursor-not-allowed hover:text-slate-300">
            Tech Blog
          </span>
        </nav>

        {/* Right Desktop Actions */}
        <div className="flex items-center gap-3.5">
          {/* Shopping Cart Trigger — Opens M3 CartDrawer */}
          <button
            type="button"
            onClick={() => dispatch(openCartDrawer())}
            aria-label="Open shopping cart"
            className="relative rounded-lg p-2 text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-brand-crimson text-[10px] font-bold text-white shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Student Login Button */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="hidden sm:inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            {isAuthenticated ? 'Dashboard' : 'Student Login'}
          </Link>

          {/* Explore Courses Red Button */}
          <Link
            to="/courses"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-brand-crimson px-4.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
          >
            Explore Courses
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-200 hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={NAV_LINKS}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
}
