import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface OrderRequestFloatingButtonProps {
  onClick: () => void;
}

export const OrderRequestFloatingButton: React.FC<OrderRequestFloatingButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Animated Glowing Rounded Circle Button */}
      <button
        type="button"
        onClick={onClick}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#500A18] via-[#7A1126] to-[#500A18] border-2 border-[#F4A62A] text-[#F4A62A] shadow-[0_0_20px_rgba(244,166,42,0.6)] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300"
        title="Custom Order Request | विशेष प्रसाद अनुरोध"
        aria-label="Open Order Request Form"
      >
        {/* Continuous Pulsing Aura Ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4A62A] opacity-30 pointer-events-none"></span>

        {/* Inner Icon */}
        <div className="relative flex items-center justify-center">
          <FileText className="w-6 h-6 stroke-[2.2] group-hover:rotate-12 transition-transform duration-300" />
          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
        </div>

        {/* Tooltip Label on Hover (Floats to the right side) */}
        <span className="absolute left-16 bg-[#2B1217] border border-[#F4A62A]/50 text-[#F4A62A] font-bold text-xs px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 backdrop-blur-md flex items-center gap-1.5">
          <span>Order Request</span>
          <span className="text-[10px] text-[#FFF8F0]/70 font-serif-temple">| विशेष अनुरोध</span>
        </span>
      </button>
    </div>
  );
};
