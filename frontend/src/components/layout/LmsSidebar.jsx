import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Award, UserCircle } from 'lucide-react';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/certificate', label: 'Certificates', icon: Award },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

// Collapsible Navy sidebar with active route tabs — used inside LmsLayout
export default function LmsSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-brand-navy md:block">
      <div className="px-5 py-5">
        <span className="font-display text-base font-semibold text-white">MSN Academy</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-crimson text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
