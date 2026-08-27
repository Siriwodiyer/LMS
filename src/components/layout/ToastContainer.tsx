import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const bgColors = {
          success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100',
          info: 'bg-blue-950/90 border-blue-500/40 text-blue-100',
          warning: 'bg-amber-950/90 border-amber-500/40 text-amber-100',
          error: 'bg-rose-950/90 border-rose-500/40 text-rose-100',
        };

        const icons = {
          success: <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />,
          info: <Info size={18} className="text-blue-400 flex-shrink-0" />,
          warning: <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />,
          error: <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl glass-panel shadow-2xl border flex items-start gap-3 transition-all transform duration-300 ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-xs font-medium leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
