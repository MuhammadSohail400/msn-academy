import React from 'react';
import { BookOpen, Users, Award, Star } from 'lucide-react';

export default function StatsBar() {
  return (
    <div className="bg-brand-navy-dark border-t border-b border-white/10 py-6 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop & Tablet 4-column layout matching Home.png */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
          <div className="flex items-center justify-center gap-3 sm:px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-crimson">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-display text-xl font-bold sm:text-2xl">10+</div>
              <div className="text-xs text-gray-400">Courses</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-crimson">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-display text-xl font-bold sm:text-2xl">1000+</div>
              <div className="text-xs text-gray-400">Students</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-crimson">
              <Award className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-display text-xl font-bold sm:text-2xl">34+</div>
              <div className="text-xs text-gray-400">Certificates Issued</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-amber-400">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <div className="text-left">
              <div className="font-display text-xl font-bold sm:text-2xl">4.9/5</div>
              <div className="text-xs text-gray-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
