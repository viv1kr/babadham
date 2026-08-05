import React from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl glass-maroon text-[#FFF8F0] shadow-2xl border border-[#F4A62A]/40 gold-glow-sm"
          >
            <div className="p-2 rounded-full bg-[#F4A62A]/20 text-[#F4A62A]">
              {toast.type === 'success' && <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
