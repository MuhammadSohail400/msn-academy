import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, ExternalLink, Rss, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 font-display text-sm font-bold text-white shadow-inner">
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

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Gain in-demand tech skills with practical training, real projects, and industry-focused learning.
            </p>

            {/* Social / Link Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Website"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Share"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Community"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="RSS Feed"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Rss className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Tech Blog</span>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Courses
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  AI Automation
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  Frontend Development
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  MS Office & Productivity
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-3.5">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-crimson shrink-0" />
                <a href="mailto:info@msnacademy.com" className="hover:text-white transition-colors">
                  info@msnacademy.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-crimson shrink-0" />
                <span>+92 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-crimson shrink-0" />
                <span>Pakistan</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/verify"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-crimson hover:underline"
              >
                <span>Verify a Certificate</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MSN Academy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
