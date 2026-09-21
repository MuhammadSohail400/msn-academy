import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { removeToast } from '../../store/slices/uiSlice';

// Global floating notification toasts — reads from store.ui.toasts
// Dispatch showToast({ message, type }) from anywhere to trigger one.
export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-brand-emerald" />,
    error: <XCircle className="h-5 w-5 text-brand-crimson" />,
    info: <Info className="h-5 w-5 text-brand-blue" />,
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-modal ring-1 ring-black/5 min-w-[280px]"
        >
          {icons[toast.type] || icons.info}
          <p className="flex-1 text-sm text-gray-800">{toast.message}</p>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            aria-label="Dismiss notification"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
