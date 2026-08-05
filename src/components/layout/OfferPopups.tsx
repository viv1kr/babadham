import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Gift, Check, Tag } from 'lucide-react';

export const OfferPopups: React.FC = () => {
  const { applyCoupon } = useStore();
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show offer popup after 4 seconds on initial visit
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('bbp_offer_dismissed');
      if (!dismissed) {
        setShowPopup(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowPopup(false);
    sessionStorage.setItem('bbp_offer_dismissed', 'true');
  };

  const handleClaim = () => {
    applyCoupon('MAHADEV20');
    setCopied(true);
    setTimeout(() => {
      handleDismiss();
    }, 1500);
  };

  if (!showPopup) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#2B1A16]/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A] overflow-hidden p-6 text-center"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-[#7A1126] hover:bg-[#7A1126]/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative Temple Icon */}
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#7A1126] to-[#500A18] text-[#F4A62A] flex items-center justify-center text-3xl shadow-xl border border-[#F4A62A] mb-4 animate-float">
            🔱
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Mahashivratri Divine Special
          </span>

          <h3 className="font-serif-temple font-extrabold text-2xl text-[#7A1126] leading-tight">
            20% Off Divine Prasad Box
          </h3>

          <p className="text-xs text-[#2B1A16]/80 mt-2 leading-relaxed">
            Get instant 20% discount on all Garbhagriha blessed Prasad & Pure Milk Peda orders with Free Express Air Delivery.
          </p>

          <div className="my-5 p-3 rounded-2xl bg-[#7A1126]/5 border border-dashed border-[#7A1126]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#7A1126]" />
              <span className="font-mono text-sm font-extrabold text-[#7A1126] tracking-wider">MAHADEV20</span>
            </div>
            <span className="text-[10px] font-bold text-[#F4A62A] bg-[#7A1126] px-2.5 py-1 rounded-lg">
              Save Up to ₹500
            </span>
          </div>

          <button
            onClick={handleClaim}
            className="w-full py-3.5 rounded-2xl bg-[#7A1126] text-[#FFF8F0] font-bold text-sm hover:bg-[#D98C1F] hover:text-[#2B1A16] transition-all shadow-xl gold-glow flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-[#F4A62A]" />
                <span>Coupon Applied to Cart!</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5 text-[#F4A62A]" />
                <span>Claim 20% Off Coupon Now</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
