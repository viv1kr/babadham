import React from 'react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-[#1A0B0E] border-t border-[#F4A62A]/20 px-4 sm:px-8 py-3 text-center sm:text-left text-[11px] text-[#FFF8F0]/60 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 relative z-50">
      <div className="tracking-wide">
        © {new Date().getFullYear()} <span className="text-[#F4A62A] font-bold">PRASADAM ADMIN SUITE</span>. All Rights Reserved. Har Har Mahadev!
      </div>
      <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 md:gap-4 text-[#F4A62A] opacity-80">
        <span>Server Engine: MySQL Sim v2.5</span>
        <span className="hidden sm:inline">•</span>
        <span>Portal Path: <code className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded">/prasadam</code></span>
        <span className="hidden sm:inline">•</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          System Normal
        </span>
      </div>
    </footer>
  );
};
