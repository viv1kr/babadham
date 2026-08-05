import React from 'react';
import { useAdmin } from '../../context/AdminContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="bg-[#1A0B0E] border-2 border-[#F4A62A] text-white px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(244,166,42,0.15)] flex items-center gap-4 min-w-[320px] max-w-[400px] animate-slide-up relative overflow-hidden pointer-events-auto">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#F4A62A] to-[#D98C1F]" />
          <p className="font-semibold text-sm drop-shadow-md">{t.message}</p>
        </div>
      ))}
    </div>
  );
};
