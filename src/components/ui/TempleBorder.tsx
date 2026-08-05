import React from 'react';

export const TempleBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center gap-4 my-6 opacity-80 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F4A62A]/40 to-[#7A1126]" />
      <div className="flex items-center gap-2 text-[#7A1126]">
        <span className="text-xs text-[#F4A62A]">🔱</span>
        <span className="font-serif-temple font-bold text-sm tracking-widest text-[#7A1126]">ॐ नमः शिवाय</span>
        <span className="text-xs text-[#F4A62A]">🔱</span>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F4A62A]/40 to-[#7A1126]" />
    </div>
  );
};
