import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShieldCheck, Lock, User, KeyRound, Sparkles, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('baba@admin2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('baba@admin2026');
    login('admin', 'baba@admin2026');
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-[#120508] text-[#FFF8F0] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">
      
      {/* Clean Glassmorphism Container - 100% Mobile Responsive without background glow/shadow overflow */}
      <div className="w-full max-w-[94vw] sm:max-w-md bg-[#2B1217] backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-[#F4A62A]/40 shadow-xl relative text-center mx-auto my-auto box-border">
        
        {/* Sacred Trident Emblem Badge */}
        <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A1126] via-[#F4A62A] to-[#D98C1F] p-[2px] shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#500A18] mx-auto flex items-center justify-center text-[#F4A62A] text-2xl shadow-inner border border-[#F4A62A]/20">
            ॐ
          </div>
        </div>

        <h1 className="font-serif-temple text-center text-xl sm:text-2xl font-extrabold text-[#F4A62A] tracking-wide">
          Admin Security Login
        </h1>
        <p className="text-center text-[11px] sm:text-xs text-[#FFF8F0]/75 mt-1 mb-5">
          Authorized Command Center for Baidyanath Dham E-Commerce Suite
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          
          {/* Mobile Responsive Username Input */}
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">Admin Username</label>
            <div className="relative">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4A62A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full h-[46px] sm:h-[50px] pl-10 sm:pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/40 text-xs sm:text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/40 font-medium focus:outline-none focus:border-[#F4A62A] transition-all"
              />
            </div>
          </div>

          {/* Mobile Responsive Password Input */}
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">Security Passkey</label>
            <div className="relative">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4A62A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Passkey"
                className="w-full h-[46px] sm:h-[50px] pl-10 sm:pl-11 pr-10 sm:pr-11 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/40 text-xs sm:text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/40 font-medium focus:outline-none focus:border-[#F4A62A] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4A62A]/70 hover:text-[#F4A62A] transition-colors p-1 cursor-pointer"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Credentials Helper Box */}
          <div className="p-3 rounded-xl bg-[#500A18]/60 border border-dashed border-[#F4A62A]/40 text-[10.5px] sm:text-[11.5px] text-[#F4A62A]">
            <div className="font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Default Master Credentials:
            </div>
            <div className="mt-1 text-[#FFF8F0]/90 font-mono break-all">
              User: <span className="text-white font-bold bg-[#1A0B0E] px-1.5 py-0.5 rounded border border-[#F4A62A]/30">admin</span> | Pass: <span className="text-white font-bold bg-[#1A0B0E] px-1.5 py-0.5 rounded border border-[#F4A62A]/30">baba@admin2026</span>
            </div>
          </div>

          {/* Mobile Responsive Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full h-[46px] sm:h-[50px] rounded-xl bg-gradient-to-r from-[#F4A62A] via-[#D98C1F] to-[#F4A62A] text-[#2B1A16] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              <span>Login to Prasadam Admin Suite</span>
            </button>

            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full h-[46px] sm:h-[50px] rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs sm:text-sm border border-[#F4A62A]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span>One-Click Instant Auto Login</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
