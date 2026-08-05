import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Bell, X, ArrowRight, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { playTempleBell } = useAudio();
  const [showNewsletter, setShowNewsletter] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Jai Bhole! I have an inquiry regarding Baba Baidyanath Prasad & Peda Delivery.');
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    playTempleBell();
  };

  return (
    <>
      {/* 1. LEFT BOTTOM FLOATING NEWSLETTER OFFER POPUP */}
      {showNewsletter && (
        <div className="fixed bottom-6 left-6 z-40 w-80 bg-[#FFFDF9] rounded-2xl p-5 border border-[#EADBC8] shadow-2xl space-y-3">
          <button
            onClick={() => setShowNewsletter(false)}
            className="absolute top-3 right-3 text-[#A08875] hover:text-[#500A18] p-1 rounded-full hover:bg-[#FAF4EE]"
            aria-label="Close Popup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF4EE] text-[#C27D23] flex items-center justify-center text-sm font-bold border border-[#EADBC8]">
              🔔
            </div>
            <div>
              <h4 className="font-serif-temple font-bold text-xs text-[#380812] leading-snug">
                Get Exclusive Blessings & Special Offers
              </h4>
            </div>
          </div>

          <p className="text-[11px] text-[#735A47]">
            Subscribe now and get <strong className="text-[#500A18]">10% OFF</strong> on your first order
          </p>

          {subscribed ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
              ✓ Subscribed! Check your email for coupon code.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-[38px] px-3 rounded-xl bg-[#FAF4EE] border border-[#EADBC8] text-xs text-[#380812] focus:outline-none focus:border-[#500A18]"
              />
              <button
                type="submit"
                className="w-full h-[38px] rounded-xl bg-[#500A18] text-white font-bold text-xs hover:bg-[#C27D23] transition-colors shadow cursor-pointer"
              >
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. RIGHT BOTTOM FLOATING WHATSAPP BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={handleWhatsApp}
          className="h-12 px-4 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs flex items-center gap-2 border-2 border-white shadow-xl hover:scale-105 transition-transform cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="hidden sm:inline">Need Help? Chat on WhatsApp</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Temple Bell Sound Trigger */}
        <button
          onClick={() => playTempleBell()}
          className="w-12 h-12 rounded-full bg-[#500A18] text-[#F4A62A] border-2 border-[#C27D23] flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
          title="Ring Sacred Temple Bell"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};
