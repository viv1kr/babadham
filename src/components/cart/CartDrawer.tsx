import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    setIsCheckoutOpen
  } = useStore();

  const { playTempleBell } = useAudio();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) setCouponCode('');
  };

  const shippingCost = cartSubtotal >= freeShippingThreshold ? 0 : (cart.length > 0 ? 70 : 0);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end bg-[#2B1A16]/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#FFF8F0] h-full shadow-2xl border-l-2 border-[#F4A62A] flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#7A1126]/10 flex items-center justify-between bg-[#FFF8F0]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#7A1126] text-[#F4A62A] flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-temple font-bold text-xl text-[#7A1126] leading-none">
                  Sacred Prasad Cart
                </h3>
                <span className="text-[10px] text-[#D98C1F] font-semibold">Garbhagriha Direct Blessing</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#7A1126] hover:bg-[#7A1126]/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#7A1126]/5 border-b border-[#7A1126]/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#7A1126]">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#F4A62A]" /> Express Delivery Threshold
              </span>
              <span>
                {remainingForFreeShip === 0 ? (
                  <span className="text-[#25D366] font-bold">FREE Delivery Unlocked!</span>
                ) : (
                  `Add ₹${remainingForFreeShip} for Free Shipping`
                )}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7A1126] to-[#F4A62A] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center text-3xl">
                  🕉️
                </div>
                <h4 className="font-serif-temple font-bold text-lg text-[#7A1126]">Your Sacred Cart is Empty</h4>
                <p className="text-xs text-[#2B1A16]/60">
                  Select authentic Prasad, Pure Milk Peda, or Rudraksh Mala from our collection.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#7A1126] text-[#FFF8F0] font-bold text-xs shadow-md gold-glow-sm"
                >
                  Explore Offerings
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl bg-[#FFF8F0] border border-[#F4A62A]/30 flex items-center gap-3 shadow-sm hover:border-[#F4A62A] transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-[#F4A62A]/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif-temple font-bold text-sm text-[#7A1126] truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-[10px] text-[#D98C1F] font-semibold">{item.product.hindiName}</div>
                    <div className="text-xs font-bold text-[#7A1126] mt-1">₹{item.product.price}</div>
                  </div>

                  {/* Qty controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-[#7A1126]/20 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-1.5 py-1 text-[#7A1126] hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-xs text-[#7A1126]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-1.5 py-1 text-[#7A1126] hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#7A1126]/60 hover:text-[#7A1126]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Area with Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#7A1126]/10 bg-[#FFF8F0] space-y-3">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-[#7A1126]/10 border border-[#7A1126]/30 flex items-center justify-between text-xs font-bold text-[#7A1126]">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#F4A62A]" />
                    <span>Coupon {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-700 underline text-[11px]">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. MAHADEV20)"
                    className="flex-1 px-4 py-3 min-h-[46px] rounded-lg bg-[#7A1126]/5 border border-[#7A1126]/20 text-xs text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#7A1126] uppercase font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 min-h-[46px] rounded-lg bg-[#7A1126] text-[#F4A62A] font-bold text-xs hover:bg-[#500A18]"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <div className={`text-[11px] font-semibold ${couponMsg.success ? 'text-green-700' : 'text-red-600'}`}>
                  {couponMsg.text}
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-[#2B1A16]/80 pt-2 border-t border-[#7A1126]/10">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-[#2B1A16]">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Air Shipping</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? <span className="text-green-700 uppercase font-bold">FREE</span> : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#7A1126] pt-2 border-t border-[#7A1126]/10">
                  <span>Grand Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                  playTempleBell();
                }}
                className="w-full py-3.5 min-h-[48px] rounded-lg bg-[#7A1126] text-[#FFF8F0] font-extrabold text-sm hover:bg-[#D98C1F] hover:text-[#2B1A16] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-[#F4A62A]" />
                <span>Proceed to Sacred Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
