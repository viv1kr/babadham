import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Confetti from 'react-confetti';

export const PreBookingSuccess: React.FC = () => {
  const { setActivePage } = useStore();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [giftBoxRect, setGiftBoxRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const giftBoxRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
      if (giftBoxRef.current && containerRef.current) {
        const giftRect = giftBoxRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        // Calculate position relative to container
        setGiftBoxRect({ 
          x: giftRect.left - containerRect.left, 
          y: giftRect.top - containerRect.top, 
          w: giftRect.width, 
          h: giftRect.height 
        });
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Initial measurement
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center font-sans relative overflow-hidden p-4">
      {/* Main Card mimicking the UI exactly */}
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 p-0 flex flex-col items-center text-center mt-4"
      >
        {/* Confetti confined inside the container */}
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
              colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722']}
            />
          )}
        </div>

        <div className="w-full text-center px-8 py-5 border-b border-gray-100 relative z-10 bg-white">
          <h2 className="text-gray-800 font-semibold text-sm uppercase tracking-wider">Order Confirmed!</h2>
        </div>

        <div className="w-full px-8 py-8 flex flex-col items-center relative z-10">
          {/* Animated Parcel Icon */}
          <div ref={giftBoxRef} className="w-32 h-32 bg-[#FFF3E0] rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-[#FFE0B2] rounded-full animate-ping opacity-30" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Package className="w-16 h-16 text-[#F4A62A] drop-shadow-md" />
            </motion.div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          
          <p className="text-gray-600 text-sm mb-6 px-4 leading-relaxed">
            Dear <strong>Rahul Kumar</strong>, your booking <strong className="text-gray-900">BBP-PRE-{Math.floor(100000 + Math.random() * 900000)}</strong> for <strong className="text-green-600">₹501.00</strong> is confirmed. A summary has been sent to your mobile.
          </p>

          <p className="text-gray-500 text-xs mb-8">
            Need help? <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:underline flex items-center justify-center gap-1 mt-1">
              Chat on WhatsApp
            </a>
          </p>

          <button 
            onClick={() => setActivePage('home')}
            className="w-full bg-[#7A1126] hover:bg-[#5A0A19] text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 transition-colors shadow-md mt-4"
          >
            <span className="font-medium text-sm">Buy More</span>
            <ShoppingBag className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
