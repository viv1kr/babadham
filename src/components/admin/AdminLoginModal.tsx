import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, User, KeyRound, X, Sparkles } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, adminLogin } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('baba@admin2026');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(username, password);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('baba@admin2026');
    adminLogin('admin', 'baba@admin2026');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#2B1A16]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A] overflow-hidden p-6 sm:p-8 text-center"
        >
          <button
            onClick={() => setIsAdminLoginOpen(false)}
            className="absolute top-4 right-4 p-2 text-[#7A1126] hover:bg-[#7A1126]/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#7A1126] to-[#500A18] text-[#F4A62A] flex items-center justify-center text-3xl shadow-xl border border-[#F4A62A] mb-4">
            🔱
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Deoghar Temple Sevak Portal
          </span>

          <h2 className="font-serif-temple font-extrabold text-2xl text-[#7A1126]">
            Admin Security Login
          </h2>

          <p className="text-xs text-[#2B1A16]/70 mt-1">
            Access inventory management, order dispatch, and live devotee analytics.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#2B1A16] mb-1">Admin Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7A1126] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-xs text-[#2B1A16] font-medium focus:outline-none focus:border-[#7A1126]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B1A16] mb-1">Passkey</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A1126] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-xs text-[#2B1A16] font-medium focus:outline-none focus:border-[#7A1126]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#7A1126]/5 border border-dashed border-[#7A1126]/30 text-[11px] text-[#7A1126] space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#F4A62A]" /> Demo Credentials:
              </div>
              <div>User: <span className="font-mono font-bold">admin</span> | Pass: <span className="font-mono font-bold">baba@admin2026</span></div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#7A1126] text-[#FFF8F0] font-bold text-xs hover:bg-[#D98C1F] hover:text-[#2B1A16] transition-all shadow-lg gold-glow flex items-center justify-center gap-2"
              >
                <span>Login to Admin Dashboard</span>
              </button>

              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full py-2.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-[#FFF8F0] border border-[#7A1126]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#7A1126]" />
                <span>One-Click Auto Login</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
