import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MessageCircle } from 'lucide-react';

// Four-column footer with links, copyright, social — owned by M2 (Marketing & Discovery)
const COLUMNS = [
  {
    heading: 'MSN Academy',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Courses',
    links: [
      { to: '/courses', label: 'All Courses' },
      { to: '/faq', label: 'FAQs' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { to: '/verify', label: 'Verify Certificate' },
      { to: '/contact', label: 'Help Center' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-gray-100 bg-brand-navy-dark text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg font-semibold text-white">MSN Academy</p>
          <p className="mt-2 text-sm text-gray-400">
            Career-focused vocational and technology training for Pakistan.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="/contact" aria-label="Website" className="text-gray-400 hover:text-white">
              <Globe className="h-4 w-4" />
            </a>
            <a href="mailto:hello@msnacademy.pk" aria-label="Email" className="text-gray-400 hover:text-white">
              <Mail className="h-4 w-4" />
            </a>
            <a href="tel:+923000000000" aria-label="Phone" className="text-gray-400 hover:text-white">
              <Phone className="h-4 w-4" />
            </a>
            <a href="https://wa.me/923000000000" aria-label="WhatsApp" className="text-gray-400 hover:text-white">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="text-sm font-semibold text-white">{col.heading}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-gray-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} MSN Academy. All rights reserved.
      </div>
    </footer>
  );
}
