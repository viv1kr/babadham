import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Megaphone } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const { brandSettings } = useStore();

  if (brandSettings?.enableTicker === false) {
    return null;
  }

  const announcement = brandSettings?.tickerAnnouncementText || '✨ Direct Garbhagriha Bhog Prasad Blessed at Baidyanath Jyotirlinga Temple & Express 24-Hour Dispatch across India! 🚩 Order Online or on WhatsApp 🔱';
  const speed = brandSettings?.tickerSpeedSeconds || 30;

  return (
    <div className="w-full bg-[#500A18] border-y border-[#F4A62A]/40 relative overflow-hidden select-none shadow-md z-20 flex items-stretch h-11">

      {/* Full-Height Docked Left Icon Block (Touches top & bottom, theme color, icon only) */}
      <div className="shrink-0 bg-[#7A1126] px-3 sm:px-4 flex items-center justify-center gap-2 border-r border-[#F4A62A]/40 shadow-md z-20">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4A62A] opacity-80"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F4A62A]"></span>
        </span>
        <Megaphone className="w-4 h-4 text-[#F4A62A] drop-shadow" />
      </div>

      {/* Marquee Motion Track Area */}
      <div className="flex-1 overflow-hidden relative flex items-center group">

        {/* Left & Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#500A18] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#500A18] to-transparent z-10 pointer-events-none" />

        {/* Marquee Motion Track */}
        <div
          className="flex items-center gap-12 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] px-4"
          style={{ animationDuration: `${speed}s` }}
        >
          {/* Loop Set 1 */}
          <div className="flex items-center gap-12 shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-[#FFF8F0] tracking-wide flex items-center gap-3">
              {announcement}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#FFF8F0] tracking-wide flex items-center gap-3">
              {announcement}
            </span>
          </div>

          {/* Loop Set 2 (Exact duplicate for seamless looping) */}
          <div className="flex items-center gap-12 shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-[#FFF8F0] tracking-wide flex items-center gap-3">
              {announcement}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#FFF8F0] tracking-wide flex items-center gap-3">
              {announcement}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
