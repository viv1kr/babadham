import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, MessageCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Confetti from 'react-confetti';

export const PreBookingSuccess: React.FC = () => {
  const { setActivePage, activeOrder, brandSettings } = useStore();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [giftBoxRect, setGiftBoxRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const giftBoxRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Stable Order Data (Fixed orderId that never changes continuously)
  const [orderData] = useState<any>(() => {
    if (activeOrder && (activeOrder.orderId || activeOrder.id)) return activeOrder;
    try {
      const saved = localStorage.getItem('bbp_active_order');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      customerName: 'Devotee',
      orderId: 'BBP-PRE-782910',
      totalAmount: 251,
      paymentMethod: 'COD'
    };
  });

  const customerName = orderData?.customerName || orderData?.address?.fullName || 'Devotee';
  const orderId = orderData?.orderId || orderData?.id || 'BBP-PRE-782910';
  const helpPhone = brandSettings?.prebookHelpPhone || brandSettings?.helplineNumber || brandSettings?.whatsappNumber || '+91 98765 43210';
  const whatsappClean = helpPhone.replace(/\D/g, '');

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
      if (giftBoxRef.current && containerRef.current) {
        const giftRect = giftBoxRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setGiftBoxRect({ 
          x: giftRect.left - containerRect.left, 
          y: giftRect.top - containerRect.top, 
          w: giftRect.width, 
          h: giftRect.height 
        });
      }
    };
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center font-sans relative overflow-hidden p-4 select-none">
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 p-0 flex flex-col items-center text-center border border-[#EADBC8]/80"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
          {containerSize.width > 0 && (
            <Confetti
              width={containerSize.width}
              height={containerSize.height}
              recycle={false}
              numberOfPieces={250}
              gravity={0.15}
              initialVelocityX={5}
              initialVelocityY={20}
              confettiSource={giftBoxRect.w > 0 ? giftBoxRect : undefined}
              colors={['#7A1126', '#F4A62A', '#009688', '#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#FF5722']}
            />
          )}
        </div>

        <div className="w-full text-center px-6 py-4 border-b border-gray-100 relative z-10 bg-[#FFF8F0]">
          <h2 className="text-[#7A1126] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Prebooking Confirmed
          </h2>
        </div>

        <div className="w-full px-6 py-7 flex flex-col items-center relative z-10">
          <div ref={giftBoxRef} className="w-28 h-28 bg-[#FFF3E0] rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-[#FFE0B2] rounded-full animate-ping opacity-30" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Package className="w-14 h-14 text-[#F4A62A] drop-shadow-md" />
            </motion.div>
          </div>

          <h1 className="text-xl font-black text-gray-900 mb-2">Booking Successful</h1>
          
          <p className="text-gray-600 text-xs sm:text-sm mb-4 px-2 text-center leading-relaxed">
            Dear <strong className="text-gray-900">{customerName}</strong>, your prebooking <strong className="text-[#7A1126]">{orderId}</strong> is confirmed! Our team will contact you within 24 hours.
          </p>

          <div className="w-full bg-[#FFF8F0] rounded-2xl p-4 border border-[#EADBC8]/80 mb-5 space-y-2 text-left text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Booking ID:</span>
              <span className="font-bold text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Payment Mode:</span>
              <span className="font-bold text-emerald-700">{orderData?.paymentMethod === 'ONLINE' ? 'PAID ONLINE' : 'PAY LATER'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Devotee Name:</span>
              <span className="font-bold text-gray-900">{customerName}</span>
            </div>
          </div>

          <div className="w-full mb-6 flex flex-col items-center justify-center text-center gap-0.5">
            <span className="text-gray-400 font-normal text-[11px]">Need Help?</span>
            <a 
              href={`https://wa.me/${whatsappClean}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-1.5 cursor-pointer mt-0.5 group hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-white shrink-0" /> 
              <span className="text-xs font-medium tracking-wide animate-text-shimmer">
                Chat on WhatsApp
              </span>
            </a>
          </div>

          <button 
            type="button"
            onClick={() => setActivePage('home')}
            className="w-full bg-[#7A1126] hover:bg-[#500A18] text-white rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 transition-all shadow-lg font-extrabold text-sm cursor-pointer"
          >
            <span>Return to Temple Home</span>
            <ShoppingBag className="w-4 h-4 text-[#F4A62A]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
