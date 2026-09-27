import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  ShoppingBag,
  Users,
  MessageSquare,
  ArrowUpRight,
  Shield,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Overview',
    to: '/admin',
    end: true,
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Courses',
    to: '/admin/courses',
    icon: GraduationCap,
    badge: null,
  },
  {
    name: 'Payment Desk',
    to: '/admin/payments',
    icon: CreditCard,
    badge: 'Verifications',
    badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  },
  {
    name: 'Orders Ledger',
    to: '/admin/orders',
    icon: ShoppingBag,
    badge: null,
  },
  {
    name: 'Users Directory',
    to: '/admin/users',
    icon: Users,
    badge: null,
  },
  {
    name: 'Inquiries CRM',
    to: '/admin/inquiries',
    icon: MessageSquare,
    badge: null,
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-slate-950 border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-bold group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white block text-sm leading-tight">
                MSN Academy
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 block">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Administrative Suite
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? 'text-slate-950'
                            : 'text-slate-400 group-hover:text-amber-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950 font-bold'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Switch to Student LMS */}
        <div className="border-t border-slate-800/80 p-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-3 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-semibold text-slate-200 group-hover:text-white">
                  Student Portal
                </span>
                <span className="block text-[10px] text-slate-500">
                  Switch to LMS view
                </span>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </div>
      </aside>
    </>
  );
}

AdminSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
