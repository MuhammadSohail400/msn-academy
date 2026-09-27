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
  Eye,
  ExternalLink,
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

  const overview = stats?.overview || {};
  const recentOrders = stats?.recentActivity?.orders || [];
  const recentPayments = stats?.recentActivity?.payments || [];
  const pendingPayments = recentPayments.filter(
    (p) => p.status === 'SUBMITTED' || p.status === 'PENDING'
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Administrative Overview</h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              Live System
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time academy performance, operational counters, and pending approvals.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur-sm group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Net Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white tracking-tight">
              PKR {isLoading ? '...' : (overview.totalRevenue || 0).toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-medium">
                Verified bank & online transactions
              </span>
            </div>
          </div>
        </div>

        {/* Registered Students */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur-sm group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Enrolled Students</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tracking-tight">
              {isLoading ? '...' : (overview.totalStudents || 0).toLocaleString()}
            </span>
            <Link
              to="/admin/users"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              Directory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[11px] text-slate-400">
              Active student accounts
            </span>
          </div>
        </div>

        {/* Pending Bank Verifications */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur-sm group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Deposit Slips</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tracking-tight">
              {isLoading ? '...' : (overview.pendingPayments || 0)}
            </span>
            <Link
              to="/admin/payments"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              Review Desk <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                (overview.pendingPayments || 0) > 0 ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span className="text-[11px] text-amber-400 font-medium">
              {(overview.pendingPayments || 0) > 0
                ? 'Action required for student access'
                : 'All clear! No slips pending'}
            </span>
          </div>
        </div>

        {/* Open Inquiries */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur-sm group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Open Inquiries</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tracking-tight">
              {isLoading ? '...' : (overview.openInquiries || 0)}
            </span>
            <Link
              to="/admin/inquiries"
              className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
            >
              View Leads <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[11px] text-purple-400 font-medium">
              Student consultation requests
            </span>
          </div>
        </div>
      </div>

      {/* Dual Activity & Action Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Orders Activity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Recent Student Orders</h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              All Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No orders recorded yet.</div>
            ) : (
              recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {order.userId?.fullName || 'Student'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        #{order.orderNumber || order._id.slice(-6)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[220px]">
                      {order.userId?.email || 'N/A'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 block">
                      PKR {(order.totalAmount || 0).toLocaleString()}
                    </span>
                    <span
                      className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                        order.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : order.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pending Bank Slips Verification Queue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Bank Slips Verification Desk</h2>
            </div>
            <Link
              to="/admin/payments"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              Open Desk <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">Checking pending receipts...</div>
            ) : recentPayments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No payment records found.</div>
            ) : (
              recentPayments.slice(0, 5).map((pay) => {
                const isPending = pay.status === 'SUBMITTED' || pay.status === 'PENDING';
                return (
                  <div
                    key={pay._id}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                      isPending
                        ? 'border-amber-500/30 bg-amber-500/5'
                        : 'border-slate-800/80 bg-slate-950/40'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">
                          {pay.userId?.fullName || 'Student'}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 rounded bg-slate-800 text-slate-300">
                          {pay.method || 'BANK'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Ref: {pay.transactionReference || 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">
                          PKR {(pay.amount || 0).toLocaleString()}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            pay.status === 'VERIFIED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {pay.status}
                        </span>
                      </div>

                      <Link
                        to="/admin/payments"
                        className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                        title="Review Slip"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Operational Launchpad Links */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Administrative Short-Cuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin/courses"
            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all"
          >
            <span>Manage Courses & Cohorts</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all"
          >
            <span>Promote Students to Admin</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
          <Link
            to="/admin/inquiries"
            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all"
          >
            <span>Manage Admission Leads</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
