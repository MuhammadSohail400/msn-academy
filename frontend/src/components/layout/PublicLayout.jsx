import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import CartDrawer from '../cart/CartDrawer';

// Sticky Public Header, Slide-over Cart Drawer, Global Footer — wraps M2 & M3's public-facing pages
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      {/* Slide-over Cart Drawer owned by M3 */}
      <CartDrawer />
    </div>
  );
}
