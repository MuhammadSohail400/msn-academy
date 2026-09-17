import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Clock,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  User,
  CreditCard,
  Hash,
  Link2,
} from 'lucide-react';
import paymentService from '../../services/paymentService';

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

// Timeline step
function Step({ label, active, done }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
          done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : active
            ? 'border-brand-crimson bg-brand-crimson text-white'
            : 'border-slate-300 bg-white text-slate-400'
        }`}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : null}
      </div>
      <span className={`text-[10px] font-semibold ${active ? 'text-brand-crimson' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function OrderPending() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // state comes from Checkout.jsx navigate call
  const orderNumber  = state?.orderNumber   || '';
  const paymentId    = state?.paymentId     || null;
  const paymentDetails = state?.paymentDetails || null; // { bankName, accountTitle, accountNumber, iban }

  const [txRef, setTxRef] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!txRef.trim() || txRef.trim().length < 5) {
      newErrors.txRef = 'Transaction reference must be at least 5 characters';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!paymentId) {
      setGlobalError('Payment record not found. Please contact support.');
      return;
    }

    setGlobalError('');
    setErrors({});
    setSubmitting(true);
    try {
      await paymentService.submitProof(paymentId, {
        transactionReference: txRef.trim(),
        receiptScreenshotUrl: receiptUrl.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err.errors?.length > 0) {
        const mapped = {};
        err.errors.forEach((e) => { if (e.field) mapped[e.field === 'transactionReference' ? 'txRef' : e.field] = e.message; });
        setErrors(mapped);
      } else {
        setGlobalError(err.message || 'Failed to submit proof. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start px-4 py-10">
      {/* Logo */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy shadow-lg shrink-0">
        <span className="text-white font-display text-xs font-bold leading-none text-center">MSN<br/>Acad.</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        {/* Top — Status icon + heading */}
        <div className="p-8 text-center space-y-4 border-b border-slate-100">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Clock className="h-10 w-10 text-amber-500" strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-extrabold text-brand-navy">Payment Pending</h1>
            <p className="text-sm font-semibold text-brand-crimson">
              Your payment is awaiting verification.
            </p>
            {orderNumber && (
              <p className="text-xs text-slate-400 font-mono">{orderNumber}</p>
            )}
          </div>

          {/* Timeline stepper */}
          <div className="flex items-start justify-between pt-2 px-2">
            <Step label="Order Placed" done />
            <div className="flex-1 mt-3 h-0.5 bg-brand-crimson mx-1" />
            <Step label="Proof Submitted" active={submitted} done={submitted} />
            <div className="flex-1 mt-3 h-0.5 bg-slate-200 mx-1" />
            <Step label="Under Review" />
            <div className="flex-1 mt-3 h-0.5 bg-slate-200 mx-1" />
            <Step label="Access Granted" />
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Bank Account Details */}
          {paymentDetails && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Transfer Payment To
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-400 w-20 shrink-0">Bank</span>
                  <span className="font-semibold text-slate-900">{paymentDetails.bankName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-400 w-20 shrink-0">Account</span>
                  <span className="font-semibold text-slate-900">{paymentDetails.accountTitle}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-400 w-20 shrink-0">Acc No.</span>
                  <span className="font-mono font-semibold text-slate-900">{paymentDetails.accountNumber}</span>
                </div>
                {paymentDetails.iban && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Hash className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-400 w-20 shrink-0">IBAN</span>
                    <span className="font-mono text-xs font-semibold text-slate-900 break-all">{paymentDetails.iban}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info message */}
          <p className="text-xs text-slate-500 leading-relaxed text-center">
            Manual payments may take up to 24 hours to verify. Submit your transaction
            reference below to speed up the process.
          </p>

          {/* Submitted success */}
          {submitted ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-emerald-800">Proof Submitted!</p>
              <p className="text-xs text-emerald-600">
                Your payment is now under review. You'll receive an email once verified.
              </p>
              <Link
                to="/orders"
                className="mt-2 inline-block text-xs font-semibold text-brand-crimson hover:underline"
              >
                View Order History →
              </Link>
            </div>
          ) : (
            /* Proof submission form */
            <form onSubmit={handleSubmitProof} className="space-y-4" noValidate>
              <h3 className="text-sm font-bold text-slate-800">Submit Payment Proof</h3>

              {globalError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{globalError}</span>
                </div>
              )}

              {/* Transaction Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Transaction Reference <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={txRef}
                  onChange={(e) => { setTxRef(e.target.value); setErrors((p) => ({...p, txRef: ''})); }}
                  placeholder="e.g. TXN-MEEZAN-98472910"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                    errors.txRef
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-400'
                      : 'border-slate-200 bg-white focus:border-brand-crimson focus:ring-brand-crimson'
                  }`}
                />
                <FieldError message={errors.txRef} />
              </div>

              {/* Receipt URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Receipt Screenshot URL{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={receiptUrl}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{submitting ? 'Submitting…' : 'Submit Proof'}</span>
              </button>
            </form>
          )}

          {/* Return to Dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </button>

          {/* Preview state switcher */}
          <div className="pt-1 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 mb-1.5">Preview payment states:</p>
            <div className="flex items-center justify-center gap-3 text-xs font-semibold">
              <Link to="/order/success" className="text-emerald-600 hover:underline">Success</Link>
              <span className="text-slate-300">·</span>
              <Link to="/order/failed" className="text-rose-500 hover:underline">Failed</Link>
              <span className="text-slate-300">·</span>
              <span className="text-amber-500">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
