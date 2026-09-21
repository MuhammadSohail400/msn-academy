import React from 'react';

export default function CourseDetailsSkeleton() {
  return (
    <div className="space-y-12 pb-24 animate-pulse">
      {/* 1. Dark Navy Hero Header */}
      <section className="bg-brand-navy py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-44 rounded bg-slate-800 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Category & Badge Pills */}
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-24 rounded-md bg-slate-800" />
                <div className="h-6 w-20 rounded-md bg-slate-800" />
              </div>

              {/* Title */}
              <div className="h-10 sm:h-12 w-4/5 max-w-2xl rounded-lg bg-slate-800" />

              {/* Subtitle */}
              <div className="space-y-2 max-w-3xl pt-1">
                <div className="h-4 w-full rounded bg-slate-800/80" />
                <div className="h-4 w-3/4 rounded bg-slate-800/70" />
              </div>

              {/* Meta Stats Row */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <div className="h-4 w-16 rounded bg-slate-800" />
                <div className="h-4 w-24 rounded bg-slate-800" />
                <div className="h-4 w-20 rounded bg-slate-800" />
                <div className="h-4 w-20 rounded bg-slate-800" />
              </div>

              {/* Instructor */}
              <div className="h-4 w-52 rounded bg-slate-800/70 pt-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* What You'll Learn Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="h-5 w-44 rounded bg-slate-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-slate-200 shrink-0" />
                    <div className="h-3.5 w-4/5 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="space-y-4">
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded bg-slate-200" />
                      <div className="h-4 w-48 rounded bg-slate-200" />
                    </div>
                    <div className="h-4 w-8 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3.5 w-48 rounded bg-slate-200" />
                <div className="h-3 w-3/4 rounded bg-slate-200" />
              </div>
            </div>
          </div>

          {/* Right Sticky Column */}
          <div className="lg:col-span-4 order-first lg:order-last lg:sticky lg:top-28">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg space-y-5">
              {/* Thumbnail Placeholder */}
              <div className="aspect-video w-full rounded-xl bg-slate-200" />
              {/* Price Row */}
              <div className="h-8 w-36 rounded bg-slate-200" />
              {/* Buttons */}
              <div className="space-y-2.5">
                <div className="h-12 w-full rounded-xl bg-slate-300" />
                <div className="h-10 w-full rounded-xl bg-slate-200" />
              </div>
              {/* Perks */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-3.5 w-3.5 rounded bg-slate-200 shrink-0" />
                    <div className="h-3 w-3/4 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
