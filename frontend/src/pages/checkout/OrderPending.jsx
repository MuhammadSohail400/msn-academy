import React, { useState, useEffect } from 'react';
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
  BookOpen,
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
    <div className="flex flex-col items-center gap-1.5 text-center flex-1 min-w-0">
      <div
        className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors shrink-0 ${
          done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : active
            ? 'border-brand-crimson bg-brand-crimson text-white animate-pulse'
            : 'border-slate-300 bg-white text-slate-400'
        }`}
      >
        {done ? <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
      </div>
      <span className={`text-[9px] sm:text-[10px] font-semibold leading-tight line-clamp-2 max-w-[68px] sm:max-w-none ${active ? 'text-brand-crimson font-bold' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function OrderPending() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Try to restore previous pending payment info from sessionStorage on refresh
  const cached = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('msn_pending_payment') || '{}');
    } catch {
      return {};
    }
  })();

  const orderNumber = state?.orderNumber || cached.orderNumber || '';
  const initialPaymentId = state?.paymentId || cached.paymentId || null;
  const paymentDetails = state?.paymentDetails || cached.paymentDetails || {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'MSN Academy Pvt Ltd',
    accountNumber: '01010102938475',
    iban: 'PK45MEZN0001010102938475',
  };

  const [paymentId, setPaymentId] = useState(initialPaymentId);
  const [paymentStatus, setPaymentStatus] = useState(cached.status || 'PENDING'); // PENDING | UNDER_REVIEW | APPROVED | REJECTED
  const [txRef, setTxRef] = useState(cached.transactionReference || '');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitted, setSubmitted] = useState(
    Boolean(cached.status === 'UNDER_REVIEW' || cached.status === 'APPROVED')
  );
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  // Persist order details to sessionStorage whenever state or status changes
  useEffect(() => {
    const infoToStore = {
      orderId: state?.orderId || cached.orderId,
      orderNumber: orderNumber,
      paymentId: paymentId || state?.paymentId || cached.paymentId,
      paymentDetails,
      status: paymentStatus,
      transactionReference: txRef,
    };
    sessionStorage.setItem('msn_pending_payment', JSON.stringify(infoToStore));
  }, [state, orderNumber, paymentId, paymentDetails, paymentStatus, txRef]);

  // Fetch real payment status from backend on mount or page refresh
  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      setLoadingStatus(true);
      try {
        const idToCheck = paymentId || state?.paymentId || cached.paymentId || 'latest';
        const res = await paymentService.getPaymentStatus(idToCheck);
        if (res?.data && isMounted) {
          const { status, transactionReference, paymentId: fetchedId } = res.data;
          if (fetchedId) setPaymentId(fetchedId);
          setPaymentStatus(status);
          if (transactionReference) setTxRef(transactionReference);

          if (status === 'UNDER_REVIEW' || status === 'APPROVED') {
            setSubmitted(true);
          } else {
            setSubmitted(false);
          }

          // Sync cache
          sessionStorage.setItem(
            'msn_pending_payment',
            JSON.stringify({
              orderNumber,
              paymentId: fetchedId || idToCheck,
              paymentDetails,
              status,
              transactionReference,
            })
          );
        }
      } catch (err) {
        console.warn('Could not fetch payment status:', err);
      } finally {
        if (isMounted) setLoadingStatus(false);
      }
    }

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!txRef.trim() || txRef.trim().length < 4) {
      newErrors.txRef = 'Transaction reference must be at least 4 characters';
    }
    let cleanUrl = receiptUrl.trim().replace(/[,;]+$/, '');
    if (cleanUrl) {
      try {
        new URL(cleanUrl);
      } catch {
        newErrors.receiptUrl = 'Please enter a valid URL (e.g. https://drive.google.com/...)';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const activePaymentId = paymentId || state?.paymentId || cached.paymentId || 'latest';

    setGlobalError('');
    setErrors({});
    setSubmitting(true);
    try {
      const res = await paymentService.submitProof(activePaymentId, {
        transactionReference: txRef.trim(),
        receiptScreenshotUrl: cleanUrl || undefined,
      });
      setSubmitted(true);
      setPaymentStatus('UNDER_REVIEW');
      if (res?.data?.paymentId) setPaymentId(res.data.paymentId);

      sessionStorage.setItem(
        'msn_pending_payment',
        JSON.stringify({
          orderNumber,
          paymentId: res?.data?.paymentId || activePaymentId,
          paymentDetails,
          status: 'UNDER_REVIEW',
          transactionReference: txRef.trim(),
        })
      );
    } catch (err) {
      if (err.errors?.length > 0) {
        const mapped = {};
        err.errors.forEach((e) => {
          if (e.field) mapped[e.field === 'transactionReference' ? 'txRef' : e.field] = e.message;
        });
        setErrors(mapped);
      } else {
        setGlobalError(err.message || 'Failed to submit proof. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isProofSubmitted = submitted || paymentStatus === 'UNDER_REVIEW' || paymentStatus === 'APPROVED';
  const isUnderReview = paymentStatus === 'UNDER_REVIEW';
  const isApproved = paymentStatus === 'APPROVED';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start px-4 py-10">
      {/* Logo */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy shadow-lg shrink-0">
        <span className="text-white font-display text-xs font-bold leading-none text-center">MSN<br/>Acad.</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        {/* Top — Status icon + heading */}
        <div className="p-5 sm:p-8 text-center space-y-4 border-b border-slate-100">
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-amber-50">
            {isApproved ? (
              <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500" strokeWidth={2} />
            ) : (
              <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" strokeWidth={2} />
            )}
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-brand-navy">
              {isApproved ? 'Payment Approved!' : 'Payment Pending'}
            </h1>
            <p className={`text-xs sm:text-sm font-semibold ${isApproved ? 'text-emerald-600' : 'text-brand-crimson'}`}>
              {isApproved
                ? 'Your payment has been verified. Access granted!'
                : isUnderReview
                ? 'Proof received. Your payment is under admin review.'
                : 'Your payment is awaiting verification.'}
            </p>
            {orderNumber && (
              <p className="text-xs text-slate-400 font-mono">{orderNumber}</p>
            )}
          </div>

          {/* Timeline stepper */}
          <div className="flex items-start justify-between pt-2 px-1 sm:px-2">
            <Step label="Order Placed" done />
            <div className={`flex-1 mt-3 h-0.5 mx-0.5 sm:mx-1 transition-colors ${isProofSubmitted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <Step
              label="Proof Submitted"
              done={isProofSubmitted}
              active={!isProofSubmitted}
            />
            <div className={`flex-1 mt-3 h-0.5 mx-0.5 sm:mx-1 transition-colors ${isApproved ? 'bg-emerald-500' : isUnderReview ? 'bg-brand-crimson' : 'bg-slate-200'}`} />
            <Step
              label="Under Review"
              active={isUnderReview}
              done={isApproved}
            />
            <div className={`flex-1 mt-3 h-0.5 mx-0.5 sm:mx-1 transition-colors ${isApproved ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <Step
              label="Access Granted"
              done={isApproved}
              active={false}
            />
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Bank Account Details */}
          {!isApproved && paymentDetails && (
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

          {/* Approved State Celebration */}
          {isApproved ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-emerald-900">Enrollment Active!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your manual transfer has been approved by admin. You have full access to all lectures, materials, and assessments.
                </p>
              </div>
              <button
                onClick={() => navigate('/my-courses')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Go to My Courses →</span>
              </button>
            </div>
          ) : isUnderReview || submitted ? (
            /* Under Review / Submitted state */
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-emerald-800">Proof Submitted!</p>
              {txRef && (
                <p className="text-xs font-mono font-medium text-emerald-700">
                  Ref: <span className="font-bold">{txRef}</span>
                </p>
              )}
              <p className="text-xs text-emerald-600">
                Your payment is now under admin review. Verification typically takes up to 24 hours.
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
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Submit Payment Proof</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Manual payments take up to 24 hours to verify. Submit your transaction
                  reference below to speed up the process.
                </p>
              </div>

              {globalError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{globalError}</span>
                </div>
              )}

              {/* Transaction Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Transaction Reference / TID <span className="text-rose-500">*</span>
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
                <FieldError message={errors.receiptUrl} />
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
        </div>
      </div>
    </div>
  );
}
