import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  X
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { activeOrder, setActiveOrder } = useStore();

  useEffect(() => {
    if (activeOrder) {
      // Trigger golden confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7A1126', '#F4A62A', '#D98C1F', '#FFF8F0']
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [activeOrder]);

  if (!activeOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#2B1A16]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-3xl bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A] overflow-hidden my-6 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveOrder(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#7A1126] text-[#F4A62A] hover:bg-[#D98C1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Banner */}
          <div className="text-center space-y-3 border-b border-[#7A1126]/10 pb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#7A1126] to-[#500A18] text-[#F4A62A] flex items-center justify-center text-3xl shadow-xl gold-glow animate-bounce" style={{ animationDuration: '2.5s' }}>
              🔱
            </div>
            <span className="px-3 py-1 rounded-full bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold tracking-widest uppercase">
              ORDER CONFIRMED • JAI BHOLE!
            </span>
            <h2 className="font-serif-temple font-extrabold text-3xl sm:text-4xl text-[#7A1126]">
              Order #{activeOrder.id}
            </h2>
            <p className="text-xs text-[#2B1A16]/80 max-w-md mx-auto">
              Your sacred order has been received at Deoghar Sanctum. It will be touch-offered during the Sandhya Aarti before express dispatch.
            </p>
          </div>

          {/* Live Order Tracker Timeline */}
          <div className="py-6 border-b border-[#7A1126]/10">
            <h3 className="font-serif-temple font-bold text-lg text-[#7A1126] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4A62A]" /> Live Deoghar Temple Tracker
            </h3>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
              {activeOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="flex md:flex-col items-center gap-3 text-left md:text-center relative z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                    step.completed 
                      ? 'bg-[#7A1126] text-[#F4A62A] border-2 border-[#F4A62A] gold-glow-sm' 
                      : step.active 
                        ? 'bg-[#F4A62A] text-[#2B1A16] animate-pulse ring-4 ring-[#7A1126]/20' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <div className="font-serif-temple font-bold text-xs text-[#7A1126]">{step.title}</div>
                    <div className="text-[10px] text-[#2B1A16]/60">{step.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Info */}
          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-[#7A1126]/10">
            <div>
              <div className="font-bold text-[#7A1126] uppercase tracking-wider mb-2">Delivery Address</div>
              <div className="font-bold text-sm text-[#2B1A16]">{activeOrder.address.fullName}</div>
              <div className="text-[#2B1A16]/80 mt-1">{activeOrder.address.addressLine}</div>
              <div className="text-[#2B1A16]/80">{activeOrder.address.city}, {activeOrder.address.state} - {activeOrder.address.pincode}</div>
              <div className="text-[#2B1A16]/70 mt-1">Phone: {activeOrder.address.phone}</div>
            </div>

            <div>
              <div className="font-bold text-[#7A1126] uppercase tracking-wider mb-2">Payment Receipt Summary</div>
              <div className="space-y-1 text-[#2B1A16]/80">
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-[#7A1126]">{activeOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{activeOrder.subtotal}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount:</span>
                    <span>-₹{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Air Courier Shipping:</span>
                  <span>{activeOrder.shipping === 0 ? 'FREE' : `₹${activeOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#7A1126] pt-2 border-t">
                  <span>Total Amount Paid:</span>
                  <span>₹{activeOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#7A1126]/10 text-[#7A1126] hover:bg-[#7A1126]/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sacred Receipt</span>
            </button>

            <button
              onClick={() => setActiveOrder(null)}
              className="px-6 py-3 rounded-2xl bg-[#7A1126] text-[#FFF8F0] hover:bg-[#D98C1F] hover:text-[#2B1A16] font-bold text-xs transition-all shadow-lg gold-glow-sm"
            >
              Continue Devotional Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
