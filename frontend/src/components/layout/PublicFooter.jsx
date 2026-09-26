import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  MessageSquare, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Column 1: Brand Info & Community */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 font-display text-sm font-bold text-white shadow-inner group-hover:border-white/40 transition-colors">
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
              Empowering the next generation of Pakistani technologists with practical, industry-aligned training, real-world portfolio projects, and accredited credentials.
            </p>

            {/* Quick Action Badges / Social Channels */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                aria-label="WhatsApp Support"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <Link
                to="/courses"
                title="Browse Catalog"
                aria-label="Browse Catalog"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                title="Student LMS Portal"
                aria-label="Student LMS Portal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
              </Link>
              <Link
                to="/verify"
                title="Verify Certificate"
                aria-label="Verify Certificate"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>
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
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-slate-400 hover:text-white transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Admissions
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-brand-crimson hover:underline font-medium transition-colors">
                  Student Sign In →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Course Programs (Direct Category Links) */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Programs & Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link 
                  to="/courses?category=Web+Development" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Web Development</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-crimson" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Data+Science" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Data Analytics & Power BI</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-crimson" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Artificial+Intelligence" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Generative AI & Prompts</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-crimson" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Design" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>UI/UX & Product Design</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-crimson" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Marketing" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Digital Marketing & SEO</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-crimson" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Productivity" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Freelancing & Career Hub</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-crimson" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Verification */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Admissions & Support
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-crimson shrink-0" />
                <a href="mailto:admissions@msnacademy.pk" className="hover:text-white transition-colors">
                  admissions@msnacademy.pk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-crimson shrink-0" />
                <a href="tel:+923000000000" className="hover:text-white transition-colors">
                  +92 300 000 0000
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-crimson shrink-0" />
                <span>Islamabad, Pakistan</span>
              </div>
            </div>

            {/* Quick Verification Card */}
            <div className="pt-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-brand-crimson" />
                  <span>Credential Verification</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Verify authentic digital credentials and certificates issued by MSN Academy.
                </p>
                <Link
                  to="/verify"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-crimson hover:underline"
                >
                  <span>Verify Certificate ID</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line with real Legal Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MSN Academy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Use
            </Link>
            <Link to="/faq" className="hover:text-slate-300 transition-colors">
              FAQ & Help
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
