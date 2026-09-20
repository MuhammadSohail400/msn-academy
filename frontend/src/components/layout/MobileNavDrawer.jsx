import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { X, LogIn, Compass } from 'lucide-react';

export default function MobileNavDrawer({ isOpen, onClose, links, isAuthenticated }) {
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'pointer-events-none invisible'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-brand-navy border-l border-white/10 text-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 font-display text-xs font-bold text-white">
                MSN
              </div>
              <span className="font-display font-bold text-white">MSN Academy</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-crimson text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <span className="rounded-xl px-4 py-3 text-sm font-medium text-slate-500">
              Tech Blog (Coming Soon)
            </span>
          </nav>
        </div>

        <div className="p-5 border-t border-white/10 space-y-3">
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>{isAuthenticated ? 'My Dashboard' : 'Student Login'}</span>
          </Link>
          <Link
            to="/courses"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3 text-sm font-semibold text-white shadow hover:bg-brand-crimson-hover transition-colors"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

MobileNavDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({ to: PropTypes.string, label: PropTypes.string })).isRequired,
  isAuthenticated: PropTypes.bool,
};
