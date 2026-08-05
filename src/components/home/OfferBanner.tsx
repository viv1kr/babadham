import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';

export const OfferBanner: React.FC = () => {
  const { applyCoupon, setIsCartOpen } = useStore();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#7A1126] via-[#500A18] to-[#7A1126] p-8 sm:p-12 text-[#FFF8F0] overflow-hidden border-2 border-[#F4A62A] shadow-2xl gold-glow">
        
        {/* Background Line art */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none bg-cream-pattern" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4A62A] text-[#2B1A16] text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Special Mahashivratri Seva
            </span>

            <h2 className="font-serif-temple font-extrabold text-3xl sm:text-5xl text-[#FFF8F0] leading-tight">
              Shravani Mela Divine Combo Box <br />
              <span className="text-[#F4A62A] italic">Flat 20% Off + Free Gangajal Bottle</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#FFF8F0]/80 max-w-xl leading-relaxed">
              Includes 1kg Pure Ghee Peda, 5-Mukhi Nepal Rudraksh Bracelet, Sultanganj Uttarvahini Gangajal, Pure Bhasma, and Brass Trishul Idol.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
            <div className="p-4 rounded-2xl bg-[#FFF8F0]/10 backdrop-blur-md border border-[#F4A62A]/40 text-center w-full max-w-xs">
              <div className="text-xs text-[#F4A62A] font-semibold uppercase">Use Special Coupon Code</div>
              <div className="text-2xl font-mono font-extrabold text-[#FFF8F0] mt-1 tracking-wider">MAHADEV20</div>
            </div>

            <button
              onClick={() => {
                applyCoupon('MAHADEV20');
                setIsCartOpen(true);
              }}
              className="w-full max-w-xs py-4 rounded-2xl bg-[#F4A62A] text-[#2B1A16] font-extrabold text-sm hover:bg-[#FFF8F0] transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              <span>Apply Code & Claim Box</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
