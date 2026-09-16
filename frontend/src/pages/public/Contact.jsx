import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react';
import ContactForm from '../../components/public/ContactForm';
import Badge from '../../components/ui/Badge';

export default function Contact() {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Hero Header */}
      <section className="bg-brand-navy text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Get In Touch
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
            Contact MSN Academy Support
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-base text-gray-300">
            Have a question about our tech programs, admissions, or corporate training partnerships? We are here to help.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Contact Details & WhatsApp Card (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact Details Box */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="font-display text-lg font-bold text-brand-navy border-b border-gray-100 pb-3">
                Office Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-brand-navy">Headquarters</div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Main Boulevard, Gulberg III, Lahore, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-brand-navy">Phone Support</div>
                    <a href="tel:+923000000000" className="text-xs text-gray-600 hover:text-brand-crimson">
                      +92 300 0000000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-brand-navy">Email Support</div>
                    <a href="mailto:support@msnacademy.pk" className="text-xs text-gray-600 hover:text-brand-crimson">
                      support@msnacademy.pk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-brand-navy">Office Hours</div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Mon – Sat: 9:00 AM – 7:00 PM PKT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Card */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-emerald-950">
                    Instant WhatsApp Assistance
                  </h4>
                  <Badge variant="success" className="text-[10px] mt-0.5">
                    Fast Response
                  </Badge>
                </div>
              </div>
              <p className="mt-3 text-xs text-emerald-800 leading-relaxed">
                Chat directly with our admission counseling team on WhatsApp for instant course details and fee payment guidance.
              </p>
              <a
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" /> Start WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Contact Form Component (8 columns) */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
