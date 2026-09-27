import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Check,
  Mail,
  Phone,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import adminService from '../../services/adminService';

const STATUS_OPTIONS = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Manage Lead Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [targetStatus, setTargetStatus] = useState('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await adminService.getAdminInquiries(params);
      if (res.success) {
        // API returns array directly in res.data (no nested .inquiries key)
        setInquiries(Array.isArray(res.data) ? res.data : res.data?.inquiries || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load inquiries CRM');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleOpenModal = (iq) => {
    setSelectedInquiry(iq);
    setTargetStatus(iq.status || 'NEW');
    setAdminNotes(iq.adminNotes || '');
    setActionError(null);
    setActionSuccess(null);
  };

  const handleCloseModal = () => {
    setSelectedInquiry(null);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setIsUpdating(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const payload = {
        status: targetStatus,
        adminNotes: adminNotes.trim(),
      };
      const inquiryId = selectedInquiry.id || selectedInquiry._id;
      const res = await adminService.updateInquiryStatus(inquiryId, payload);
      if (res.success) {
        setActionSuccess('Inquiry updated successfully!');
        setInquiries((prev) =>
          prev.map((item) =>
            (item.id || item._id) === inquiryId
              ? { ...item, status: targetStatus, adminNotes: adminNotes.trim() }
              : item
          )
        );
        setTimeout(() => {
          handleCloseModal();
        }, 1200);
      } else {
        setActionError(res.message || 'Failed to update inquiry');
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || 'Failed to update inquiry workflow'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredInquiries = inquiries.filter((iq) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    // API returns fullName, but fallback to name for safety
    const name = (iq.fullName || iq.name || '').toLowerCase();
    const email = iq.email?.toLowerCase() || '';
    const subject = iq.subject?.toLowerCase() || '';
    const message = iq.message?.toLowerCase() || '';
    return name.includes(term) || email.includes(term) || subject.includes(term) || message.includes(term);
  });

  const newCount = inquiries.filter((i) => i.status === 'NEW').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = inquiries.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Contact Leads CRM</h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/20">
              Student Inquiries
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Consultation queries, admission questions, and support tickets from public contact form.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload CRM</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">New Leads</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{newCount}</span>
            <span className="text-xs text-amber-400 font-semibold">Requires follow-up</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">In Progress</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400">{inProgressCount}</span>
            <span className="text-xs text-blue-400 font-semibold">Staff communicating</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Resolved / Closed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{resolvedCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">Successfully handled</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {st === 'ALL'
                ? 'All Leads'
                : st === 'NEW'
                ? 'New Unread'
                : st === 'IN_PROGRESS'
                ? 'In Progress'
                : st === 'RESOLVED'
                ? 'Resolved'
                : 'Closed'}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads, email, topic..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Leads List / Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Showing {filteredInquiries.length} Inquiries
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading consultation leads...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No inquiries found matching current filters.
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredInquiries.map((iq) => {
              const status = iq.status || 'NEW';
              return (
                <div
                  key={iq.id || iq._id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{iq.fullName || iq.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({iq.email})</span>
                      {iq.phone && (
                        <span className="text-xs text-amber-400/90 font-mono">
                          • {iq.phone}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-amber-400">
                      Subject: {iq.subject}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      "{iq.message}"
                    </p>

                    {iq.adminNotes && (
                      <div className="mt-2 text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="font-semibold text-slate-300">Staff Notes: </span>
                        {iq.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        status === 'RESOLVED' || status === 'CLOSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : status === 'IN_PROGRESS'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {status === 'RESOLVED' && <CheckCircle2 className="h-3 w-3" />}
                      {status === 'IN_PROGRESS' && <Clock className="h-3 w-3" />}
                      {status === 'NEW' && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      {status}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      {iq.createdAt ? new Date(iq.createdAt).toLocaleDateString() : '—'}
                    </span>

                    <button
                      onClick={() => handleOpenModal(iq)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/40 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <span>Manage Lead</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inquiry Resolution Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Student Lead Management</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update lead workflow status and record internal consultation notes.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionError && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Student Info & Direct Shortcuts */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{selectedInquiry.name}</span>
                <span className="text-amber-400 font-semibold">{selectedInquiry.subject}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-slate-400">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{selectedInquiry.email}</span>
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{selectedInquiry.phone}</span>
                  </a>
                )}
              </div>

              {/* Message */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Student Message:
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Update Lead Workflow Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STATUS_OPTIONS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetStatus(st)}
                      className={`rounded-xl py-2 px-2 text-xs font-semibold transition-all border ${
                        targetStatus === st
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Notes Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Staff Consultation Notes (Internal):
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record call summary, student interest in specific courses, follow-up dates..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isUpdating}
                  className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{isUpdating ? 'Saving...' : 'Save Lead Status'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
