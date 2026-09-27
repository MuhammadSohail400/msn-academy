import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  GraduationCap,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to load statistics');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to connect to admin backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Administrative Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time academy performance, operational counters, and pending approvals.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Net Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white">
              PKR {isLoading ? '...' : (stats?.overview?.totalRevenue || 0).toLocaleString()}
            </span>
            <span className="block text-[11px] text-emerald-400 mt-1 font-medium">
              Verified completed orders
            </span>
          </div>
        </div>

        {/* Active Students */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Registered Students</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white">
              {isLoading ? '...' : (stats?.overview?.totalStudents || 0).toLocaleString()}
            </span>
            <span className="block text-[11px] text-slate-400 mt-1">
              Active learning profiles
            </span>
          </div>
        </div>

        {/* Pending Bank Verifications */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Payments</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {isLoading ? '...' : (stats?.overview?.pendingPayments || 0)}
            </span>
            <Link
              to="/admin/payments"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              Review Desk <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <span className="block text-[11px] text-amber-400/90 mt-1 font-medium">
            Requires manual slip verification
          </span>
        </div>

        {/* Open Inquiries */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Open Inquiries</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {isLoading ? '...' : (stats?.overview?.openInquiries || 0)}
            </span>
            <Link
              to="/admin/inquiries"
              className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
            >
              View CRM <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <span className="block text-[11px] text-purple-400/90 mt-1 font-medium">
            Student consultation leads
          </span>
        </div>
      </div>

      {/* Quick Launchpad Navigation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6">
        <h2 className="text-base font-semibold text-white mb-4">Operations Control Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/courses"
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-500/40 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
              Course Catalog
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Create new cohorts, edit curriculum, manage prices & certificates.
            </p>
          </Link>

          <Link
            to="/admin/payments"
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-500/40 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
              Payment Verification Desk
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Inspect bank deposit slips and approve student enrollments in 1-click.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-500/40 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
              User & Role Management
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Search student directory and grant administrator privileges.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
