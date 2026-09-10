import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

// Mobile off-canvas slide-in navigation (Screen S-27)
export default function MobileNavDrawer({ isOpen, onClose, links }) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-brand-navy-dark/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-modal transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <span className="font-display font-semibold text-brand-navy">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="rounded p-1 hover:bg-gray-100">
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
                `rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-crimson-light text-brand-crimson' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

MobileNavDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({ to: PropTypes.string, label: PropTypes.string })).isRequired,
};
