import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  ExternalLink,
  User,
  Sparkles
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { brandSettings, adminProfile, setActiveTab } = useAdmin();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#2B1217] border-b border-[#F4A62A]/30 px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 shadow-lg relative z-40">
      
      {/* Left: LOGO ONLY */}
      <div className="flex items-center gap-3">
        <a href="#" className="flex items-center justify-center group" aria-label="Admin Home Logo Only">
          {(brandSettings?.logoImageUrl || (typeof window !== 'undefined' ? localStorage.getItem('babadham_logo_image') : '')) ? (
            <img 
              src={brandSettings?.logoImageUrl || localStorage.getItem('babadham_logo_image') || ''} 
              alt="Company Logo" 
              className="max-h-10 max-w-[200px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" 
            />
          ) : (
            <span className="font-extrabold text-base text-[#F4A62A] font-serif-temple">
              {brandSettings?.brandName || 'ADMIN PORTAL'}
            </span>
          )}
        </a>
      </div>

      {/* Right: Clock, Live Devotee Link, Profile */}
      <div className="flex items-center gap-4">
        
        {/* Live Clock Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 text-xs font-mono text-[#F4A62A]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{time} IST</span>
        </div>

        {/* External E-Commerce Devotee Storefront Button */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A1126] hover:bg-[#F4A62A] text-[#F4A62A] hover:text-[#2B1A16] text-xs font-bold transition-all border border-[#F4A62A]/40 shadow-sm"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Admin Profile Chip / Edit Profile Button */}
        <button 
          onClick={() => setActiveTab('userProfile')}
          className="flex items-center gap-2 pl-3 border-l border-[#F4A62A]/20 hover:opacity-80 transition-opacity text-left group cursor-pointer relative"
          title="User Profile & Security Settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40 flex items-center justify-center font-bold text-xs overflow-hidden shadow-sm">
            {adminProfile?.photoUrl ? (
               <img src={adminProfile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden lg:block text-left relative">
            <div className="text-xs font-bold text-white leading-tight group-hover:text-[#F4A62A] transition-colors">
              {adminProfile?.name || 'Admin Sevak'}
            </div>
            <div className="text-[9px] text-[#F4A62A]">{adminProfile?.designation || 'Super Administrator'}</div>
          </div>
        </button>

      </div>

    </header>
  );
};
