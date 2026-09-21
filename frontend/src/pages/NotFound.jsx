import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-brand-navy">404</p>
      <p className="mt-2 text-gray-600">This page doesn't exist.</p>
      <Link to="/">
        <Button variant="primary" className="mt-6">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
