import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { X, GraduationCap, LogIn, UserPlus, Phone, Mail, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../ui/Button';

export default function MobileNavDrawer({ isOpen, onClose, links }) {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-brand-navy-dark/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Container */}
      <div
        className={`absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-brand-navy text-white">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand-crimson" />
            <span className="font-display text-base font-bold tracking-tight">MSN Academy</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-crimson-light text-brand-crimson font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span>{link.label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/checkout"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-crimson-light text-brand-crimson font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-brand-crimson" /> Cart
            </span>
            {cartCount > 0 && (
              <span className="rounded-full bg-brand-crimson px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>

        {/* Contact Info Card */}
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-xs text-gray-600 space-y-2">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Phone className="h-3.5 w-3.5 text-brand-crimson" />
            <a href="tel:+923000000000">+92 300 0000000</a>
          </div>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Mail className="h-3.5 w-3.5 text-brand-crimson" />
            <a href="mailto:support@msnacademy.pk">support@msnacademy.pk</a>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="border-t border-gray-100 p-4 space-y-2 bg-white">
          {isAuthenticated ? (
            <Link to="/dashboard" onClick={onClose} className="block">
              <Button variant="secondary" size="md" className="w-full">
                Go to Student Dashboard
              </Button>
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={onClose}>
                <Button variant="outline" size="md" icon={LogIn} className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <Button variant="primary" size="md" icon={UserPlus} className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

MobileNavDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
