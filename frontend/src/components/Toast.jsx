import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

let toastId = 0;

/**
 * Global function to trigger a toast message.
 * Can be called anywhere: in components, event handlers, or context providers.
 */
export function toast(message, type = 'success', duration = 3500) {
  const event = new CustomEvent('app-toast', { 
    detail: { id: ++toastId, message, type, duration } 
  });
  window.dispatchEvent(event);
}

// Convenient shorthand properties
toast.success = (msg, dur) => toast(msg, 'success', dur);
toast.error = (msg, dur) => toast(msg, 'error', dur);

/**
 * Toast Container component placed at the App root to render toasts.
 */
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { id, message, type, duration } = e.detail;
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('app-toast', handleToastEvent);
    return () => {
      window.removeEventListener('app-toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            className={`p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start gap-3 pointer-events-auto w-full ${
              t.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                : 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'error' ? (
                <AlertCircle size={18} className="text-red-500" />
              ) : (
                <CheckCircle size={18} className="text-green-500" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 break-words leading-relaxed">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="mt-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
