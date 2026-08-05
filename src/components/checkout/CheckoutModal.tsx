import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  QrCode, 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  Zap
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    discountAmount, 
    freeShippingThreshold,
    placeOrder 
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');

  if (!isCheckoutOpen) return null;

  const shippingCost = cartSubtotal >= freeShippingThreshold ? 0 : 70;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleAutoFill = () => {
    setFullName('Rajesh Kumar Sharma');
    setPhone('9876543210');
    setEmail('rajesh.sharma@example.com');
    setAddressLine('Flat 402, Shiv Shakti Enclave, Mandir Marg');
    setLandmark('Near Hanuman Temple');
    setCity('New Delhi');
    setState('Delhi');
    setPincode('110001');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city || !pincode) {
      alert('Please fill out all required address fields.');
      return;
    }

    placeOrder({
      fullName,
      phone,
      email,
      addressLine,
      landmark,
      city,
      state,
      pincode
    }, paymentMethod);

    setIsCheckoutOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2B1A16]/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A] overflow-hidden my-6"
        >
          {/* Close button */}
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#7A1126] text-[#F4A62A] hover:bg-[#D98C1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Bar */}
          <div className="bg-[#7A1126] p-6 text-[#FFF8F0] flex items-center justify-between border-b border-[#F4A62A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4A62A] text-[#2B1A16] flex items-center justify-center font-bold text-xl">
                🔱
              </div>
              <div>
                <h2 className="font-serif-temple font-extrabold text-2xl text-[#F4A62A] leading-tight">
                  Express Devotional Checkout
                </h2>
                <p className="text-xs text-[#FFF8F0]/80">
                  Baba Baidyanath Dham Sanctum Sanctorum Direct Dispatch
                </p>
              </div>
            </div>

            <button
              onClick={handleAutoFill}
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-extrabold text-xs hover:bg-[#FFF8F0] transition-colors shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Fast Fill Test Address</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
            
            {/* Left Col: Address & Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-temple font-bold text-lg text-[#7A1126] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#F4A62A]" />
                  <span>Devotee Shipping Address</span>
                </h3>
                <button
                  onClick={handleAutoFill}
                  type="button"
                  className="sm:hidden text-xs font-bold text-[#D98C1F] underline"
                >
                  Auto-fill Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B1A16] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-sm focus:outline-none focus:border-[#7A1126] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B1A16] mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-sm focus:outline-none focus:border-[#7A1126] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B1A16] mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  placeholder="House/Flat No., Building Name, Street"
                  className="w-full h-[50px] px-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-sm focus:outline-none focus:border-[#7A1126] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B1A16] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-sm focus:outline-none focus:border-[#7A1126] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B1A16] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-sm focus:outline-none focus:border-[#7A1126] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B1A16] mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 text-sm focus:outline-none focus:border-[#7A1126] font-medium"
                  />
                </div>
              </div>

              {/* Payment Methods selector */}
              <div className="pt-2">
                <h4 className="font-serif-temple font-bold text-base text-[#7A1126] mb-3">
                  Select Sacred Payment Mode
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'UPI' 
                        ? 'border-2 border-[#7A1126] bg-[#7A1126]/10 text-[#7A1126] font-bold' 
                        : 'border-[#7A1126]/20 bg-white text-[#2B1A16]/70'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#F4A62A]" />
                    <span className="text-xs">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'CARD' 
                        ? 'border-2 border-[#7A1126] bg-[#7A1126]/10 text-[#7A1126] font-bold' 
                        : 'border-[#7A1126]/20 bg-white text-[#2B1A16]/70'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#F4A62A]" />
                    <span className="text-xs">Razorpay / Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'COD' 
                        ? 'border-2 border-[#7A1126] bg-[#7A1126]/10 text-[#7A1126] font-bold' 
                        : 'border-[#7A1126]/20 bg-white text-[#2B1A16]/70'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#F4A62A]" />
                    <span className="text-xs">Cash on Delivery</span>
                  </button>
                </div>

                {/* Simulated UPI QR code when UPI selected */}
                {paymentMethod === 'UPI' && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#FFF8F0] border border-[#F4A62A] flex items-center gap-4">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl border border-gray-300 flex items-center justify-center shrink-0">
                      <QrCode className="w-16 h-16 text-[#7A1126]" />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-[#7A1126]">Scan QR or pay to UPI ID</div>
                      <div className="font-mono text-xs text-[#D98C1F] font-bold bg-[#7A1126]/10 px-2 py-0.5 rounded">
                        baidyanath.prasadam@upi
                      </div>
                      <p className="text-[10px] text-[#2B1A16]/60">Supports GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Order Summary */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#7A1126]/5 p-6 rounded-3xl border border-[#7A1126]/15">
              <div>
                <h3 className="font-serif-temple font-bold text-lg text-[#7A1126] mb-3">
                  Sacred Order Items ({cart.length})
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <div className="font-bold text-[#7A1126] truncate max-w-[140px]">{item.product.name}</div>
                          <div className="text-[10px] text-[#2B1A16]/60">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-[#7A1126]">₹{item.product.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation */}
                <div className="mt-4 pt-4 border-t border-[#7A1126]/20 space-y-2 text-xs text-[#2B1A16]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{cartSubtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Air Delivery</span>
                    <span className="font-bold">
                      {shippingCost === 0 ? <span className="text-green-700 font-extrabold uppercase">FREE</span> : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-[#7A1126] pt-2 border-t border-[#7A1126]/20">
                    <span>Total Amount Payable</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-[50px] rounded-2xl bg-[#7A1126] text-[#FFF8F0] font-extrabold text-sm hover:bg-[#D98C1F] hover:text-[#2B1A16] transition-all shadow-xl gold-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-[#F4A62A]" />
                <span>Confirm & Place Sacred Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
