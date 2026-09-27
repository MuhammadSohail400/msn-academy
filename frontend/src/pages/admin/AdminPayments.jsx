import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  X,
  Check,
  ShieldCheck,
  ExternalLink,
  FileText,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Slip Inspection Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { limit: 50 }; // Backend schema cap is 50
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await adminService.getAdminPayments(params);
      if (res.success) {
        setPayments(res.data?.payments || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load payments ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setActionError(null);
    setActionSuccess(null);
    setRejectionReason('');
    setShowRejectInput(false);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleVerify = async (status) => {
    if (!selectedPayment) return;
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      setActionError('Please provide a reason for rejecting this deposit slip.');
      return;
    }

    setIsVerifying(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const payload = {
        status,
        ...(status === 'REJECTED' && { rejectionReason: rejectionReason.trim() }),
      };

      const paymentId = selectedPayment.paymentId || selectedPayment._id || selectedPayment.id;
      const res = await adminService.verifyPayment(paymentId, payload);
      if (res.success) {
        setActionSuccess(
          status === 'VERIFIED'
            ? 'Payment verified! Student enrollment has been automatically provisioned.'
            : 'Payment has been rejected.'
        );

        // Update local list state
        setPayments((prev) =>
          prev.map((item) => {
            const itemId = item.paymentId || item._id || item.id;
            return itemId === paymentId ? { ...item, status } : item;
          })
        );

        setTimeout(() => {
          handleCloseModal();
          fetchPayments();
        }, 1500);
      } else {
        setActionError(res.message || 'Verification action failed');
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || 'Failed to update payment status'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    // API returns student nested under .student (not .userId)
    const studentName = (p.student?.fullName || p.userId?.fullName || '').toLowerCase();
    const studentEmail = (p.student?.email || p.userId?.email || '').toLowerCase();
    const ref = (p.transactionReference || p.bankReference || '').toLowerCase();
    return studentName.includes(term) || studentEmail.includes(term) || ref.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header & Reload */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Payment Verification Desk</h1>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
              Manual Bank Auditing
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Audit manual bank deposit slips, verify transactions, and provision immediate LMS access.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Ledger</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'].map((st) => (
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
                ? 'All Payments'
                : st === 'PENDING'
                ? 'Pending'
                : st === 'UNDER_REVIEW'
                ? 'Under Review'
                : st === 'VERIFIED'
                ? 'Verified & Enrolled'
                : 'Rejected'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or ref #..."
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

      {/* Payments Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Showing {filteredPayments.length} Payments
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading payment records...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No payments found matching the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Bank Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPayments.map((p) => {
                  const status = p.status?.toUpperCase() || 'PENDING';
                  const isPending = status === 'SUBMITTED' || status === 'PENDING';

                  return (
                    <tr
                      key={p.paymentId || p._id || p.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isPending ? 'bg-amber-500/[0.02]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {p.student?.fullName || p.userId?.fullName || 'Student'}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.student?.email || p.userId?.email || 'N/A'}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-400 text-sm">
                        PKR {(p.amount || 0).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {p.method || 'BANK'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                        {p.transactionReference || p.bankReference || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            status === 'VERIFIED' || status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {status === 'VERIFIED' && <CheckCircle2 className="h-3 w-3" />}
                          {isPending && <Clock className="h-3 w-3" />}
                          {status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                          {status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            isPending
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm shadow-amber-500/20'
                              : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{isPending ? 'Inspect & Verify' : 'View Details'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slip Inspection & Verification Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Bank Deposit Slip Verification</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect student payment proof and approve immediate course enrollment.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notification messages */}
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

            {/* Payment Details Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-semibold text-white">
                  {selectedPayment.userId?.fullName || 'Student'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Student Email:</span>
                <span className="text-slate-300">{selectedPayment.userId?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Amount to Verify:</span>
                <span className="font-bold text-amber-400 text-sm">
                  PKR {(selectedPayment.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Bank Reference / TxID:</span>
                <span className="font-mono text-white font-semibold">
                  {selectedPayment.transactionReference || selectedPayment.bankReference || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    selectedPayment.status === 'VERIFIED'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : selectedPayment.status === 'REJECTED'
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {selectedPayment.status}
                </span>
              </div>
            </div>

            {/* Proof Slip Image Display if exists */}
            {(selectedPayment.proofUrl || selectedPayment.slipUrl || selectedPayment.receiptUrl) ? (
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-300">Uploaded Slip Proof:</span>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden flex items-center justify-center max-h-56">
                  <img
                    src={selectedPayment.proofUrl || selectedPayment.slipUrl || selectedPayment.receiptUrl}
                    alt="Deposit Receipt"
                    className="max-h-52 object-contain rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-center text-slate-400 text-xs">
                <FileText className="h-6 w-6 mx-auto mb-1 text-slate-500" />
                <span>Deposit slip proof provided via Bank Reference ID</span>
              </div>
            )}

            {/* Rejection input box if triggered */}
            {showRejectInput && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-xs font-semibold text-rose-400">
                  Reason for Rejection:
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Unclear slip photo, transaction reference not found in bank statement..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                  rows={2}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isVerifying}
                className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>

              {/* Show Rejection Actions */}
              {!showRejectInput ? (
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  disabled={isVerifying || selectedPayment.status === 'REJECTED'}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                >
                  Reject Payment
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleVerify('REJECTED')}
                  disabled={isVerifying}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              )}

              {/* Approve & Enroll Button */}
              <button
                type="button"
                onClick={() => handleVerify('VERIFIED')}
                disabled={isVerifying || selectedPayment.status === 'VERIFIED'}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                <Check className="h-4 w-4" />
                <span>{isVerifying ? 'Verifying...' : 'Approve & Enroll Student'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
