import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import MobileNavDrawer from './MobileNavDrawer';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
];

// Top navbar, nav links, cart trigger, user button — owned by M2 (Marketing & Discovery)
export default function PublicHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-lg font-semibold text-brand-navy">
          MSN Academy
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-brand-crimson' : 'text-gray-600 hover:text-brand-navy'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/checkout" aria-label="Cart" className="relative rounded-full p-2 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-crimson text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="hidden items-center gap-1.5 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-100 sm:flex"
          >
            <User className="h-4 w-4" />
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      <MobileNavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} links={NAV_LINKS} />
    </header>
  );
}
