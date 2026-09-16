import React from 'react';
import { Link } from 'react-router-dom';
import MsnLogo from '../ui/MsnLogo';

export default function PublicFooter() {
  return (
    <footer className="bg-[#0f1e45] text-slate-300 pt-12 pb-8 px-4 border-t border-blue-900/40 text-xs">
      <div className="max-w-md md:max-w-6xl mx-auto space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-8">
        {/* Brand & Mission */}
        <div>
          <div className="mb-3">
            <MsnLogo className="h-10" />
          </div>
          <p className="text-slate-300/80 leading-relaxed mb-4 text-[11px]">
            Gain in-demand tech skills with practical training, real projects, and industry-focused learning.
          </p>
          {/* Social Icons Row */}
          <div className="flex items-center gap-3 text-slate-300">
            <a aria-label="Website" className="w-7 h-7 rounded bg-[#162858] flex items-center justify-center hover:text-white border border-blue-900/50 transition-colors" href="/">🌐</a>
            <a aria-label="Share" className="w-7 h-7 rounded bg-[#162858] flex items-center justify-center hover:text-white border border-blue-900/50 transition-colors" href="/courses">🔗</a>
            <a aria-label="Contact" className="w-7 h-7 rounded bg-[#162858] flex items-center justify-center hover:text-white border border-blue-900/50 transition-colors" href="/contact">✉️</a>
            <a aria-label="RSS" className="w-7 h-7 rounded bg-[#162858] flex items-center justify-center hover:text-white border border-blue-900/50 transition-colors" href="/faq">📡</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4 md:pt-0 border-t border-blue-900/40 md:border-t-0">
          <h5 className="text-white font-bold text-[11px] uppercase tracking-wider mb-3">Quick Links</h5>
          <ul className="space-y-2 text-[11px]">
            <li><Link className="hover:text-white transition-colors" to="/">Home</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/about">About Us</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/courses">All Courses</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/faq">Tech Blog</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/faq">FAQ</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Courses */}
        <div className="pt-4 md:pt-0 border-t border-blue-900/40 md:border-t-0">
          <h5 className="text-white font-bold text-[11px] uppercase tracking-wider mb-3">Courses</h5>
          <ul className="space-y-2 text-[11px]">
            <li><Link className="hover:text-white transition-colors" to="/courses?category=Data%20Science">Data Analytics</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/courses?category=Artificial%20Intelligence">AI Automation</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/courses?category=Design">UI/UX Design</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/courses?category=Web%20Development">Frontend Development</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/courses?category=Marketing">Digital Marketing</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/courses">MS Office & Productivity</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="pt-4 md:pt-0 border-t border-blue-900/40 md:border-t-0">
          <h5 className="text-white font-bold text-[11px] uppercase tracking-wider mb-3">Contact</h5>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span>✉</span>
              <span>info@msnacademy.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>+92 XXX XXX XXXX</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>Pakistan</span>
            </div>
            <div className="pt-1">
              <Link className="text-brand-red hover:underline font-semibold flex items-center gap-1" to="/verify">
                <span>Verify a Certificate</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal */}
      <div className="max-w-md md:max-w-6xl mx-auto pt-6 mt-8 border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
        <div>© 2026 MSN Academy. All rights reserved.</div>
        <div className="flex gap-4">
          <Link className="hover:text-slate-300" to="/privacy">Privacy Policy</Link>
          <Link className="hover:text-slate-300" to="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}


