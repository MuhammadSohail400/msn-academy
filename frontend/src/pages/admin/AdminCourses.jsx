import React, { useEffect, useState } from 'react';
import { GraduationCap, Plus, Search, RefreshCw, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminCourses({ limit: 50 });
      if (res.success) {
        setCourses(res.data?.courses || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Course Catalog Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage course curriculum, pricing, syllabus, and publishing states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourses}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Courses List Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Courses ({courses.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No courses found in database.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div
                key={c._id || c.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {c.category || 'Course'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {c.level || 'All Levels'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.tagline || c.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-400">
                    PKR {(c.pricing?.amount || c.price || 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {c.lessonsCount || (c.curriculum?.length || 0)} lessons
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
