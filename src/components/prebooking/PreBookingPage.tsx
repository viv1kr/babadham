import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, MapPin, Phone, User, Landmark, Building, Navigation, Zap, CreditCard, Banknote, Sparkles, Truck, Star, Gift } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { PrebookingHeroSection } from './PrebookingHeroSection';

export const PreBookingPage: React.FC = () => {
  const { setActivePage, preBookingProduct, brandSettings, addOrder } = useStore();
  const { playTempleBell } = useAudio();
  
  const [step, setStep] = useState<'FORM' | 'PAYMENT'>('FORM');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [fetchingPincode, setFetchingPincode] = useState(false);

  // Auto-fetch city & state when 6-digit pincode is typed
  useEffect(() => {
    if (pincode.length === 6) {
      setFetchingPincode(true);
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            setCity(po.District || po.Block || po.Name || '');
            setState(po.State || '');
          }
        })
        .catch(err => console.warn('Pincode fetch error:', err))
        .finally(() => setFetchingPincode(false));
    }
  }, [pincode]);

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your Full Name');
      return;
    }
    if (!whatsapp.trim() || whatsapp.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp phone number');
      return;
    }
    if (!pincode.trim() || pincode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit Pincode');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your Street Address');
      return;
    }

    setErrorMsg('');
    setStep('PAYMENT');
  };

  const processOrder = (paymentMethod: 'ONLINE' | 'COD') => {
    setLoading(true);
    const prebookAmount = brandSettings?.prebookAmount || 251;
    const finalAmount = prebookAmount;
    
    // Stable order ID format: BBP-PRE-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const generatedOrderId = `BBP-PRE-${randomSuffix}`;

    const orderData = {
      id: generatedOrderId,
      orderId: generatedOrderId,
      date: new Date().toISOString(),
      bookingTime: new Date().toISOString(),
      customerName: name,
      customerPhone: whatsapp,
      shippingAddress: `${address}${landmark ? ', Near ' + landmark : ''}, ${city}, ${state} - ${pincode}`,
      addressDetails: {
        fullName: name,
        phone: whatsapp,
        street: address,
        landmark,
        city,
        state,
        pincode
      },
      totalAmount: finalAmount,
      prebookAmount: prebookAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PAY_LATER',
      leadStatus: 'PENDING',
      orderStatus: 'ORDER_PLACED'
    };

    addOrder(orderData);
    playTempleBell();
    setActivePage('success');
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch(e) {}
  };

  const handlePayNow = () => {
    processOrder('ONLINE');
  };

  const handlePayLater = () => {
    processOrder('COD');
  };

  const prebookAmount = brandSettings?.prebookAmount || 251;
  const convenienceFee = 0;
  const totalAmount = prebookAmount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Premium Theme Header */}
      <div className="bg-[#FFF8F0] border-b border-[#EADBC8]/80 shadow-xs px-4 py-3 sm:py-3.5 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-0.5">
          {brandSettings?.logoImageUrl ? (
            <img src={brandSettings.logoImageUrl} alt="Baidyanath Logo" className="h-10 sm:h-12 md:h-14 object-contain drop-shadow-xs" />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#7A1126] text-[#F4A62A] flex items-center justify-center text-lg font-bold border border-[#F4A62A]/40 shadow-sm">
              🔱
            </div>
          )}
          
          <h1 
            className="font-serif-temple font-bold text-xs sm:text-sm text-[#7A1126] uppercase leading-tight pt-0.5"
            style={{ letterSpacing: '0.5px' }}
          >
            BABA BAIDYANATH PRASADAM
          </h1>
          
          <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#C85A28] uppercase">
            AASTHA | SEVA | SAMARPAN
          </p>
        </div>
      </div>

      {/* Prebooking Hero Banner — Separate from main site hero banner */}
      <PrebookingHeroSection />

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <AnimatePresence mode="wait">
          {step === 'FORM' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Baba's Prasad For You Trust Card Banner */}
              <div className="bg-[#FFF9EE] border border-[#F5E6CA] rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3 relative overflow-hidden">
                {/* Left Section: Gift Icon Circle + Text */}
                <div className="flex items-center gap-3 min-w-0 z-10">
                  {/* Circle Icon */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E59218] flex items-center justify-center shrink-0 shadow-xs">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#5E0C1E]" />
                  </div>

                  {/* Text */}
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#3B1017] tracking-tight">
                      Baba's Prasad For You
                    </h3>
                    <p className="text-xs text-[#7A6652] font-medium leading-snug">
                      Get Baba's blessings with every order
                    </p>
                  </div>
                </div>

                {/* Right Stamp Seal Badge (100% शुद्ध प्रामाणिक) */}
                <div className="relative shrink-0 flex items-center justify-center z-10 pr-0.5">
                  <div 
                    className="w-15 h-15 sm:w-16 sm:h-16 bg-[#6B0F24] text-[#F4A62A] rounded-full flex flex-col items-center justify-center text-center p-1 border border-dashed border-[#F4A62A]/80 shadow-md relative transition-transform"
                    style={{
                      clipPath: 'polygon(50% 0%, 61% 10%, 75% 4%, 79% 18%, 93% 18%, 91% 32%, 100% 43%, 93% 54%, 98% 68%, 86% 75%, 86% 90%, 72% 90%, 65% 100%, 50% 94%, 35% 100%, 28% 90%, 14% 90%, 14% 75%, 2% 68%, 7% 54%, 0% 43%, 9% 32%, 7% 18%, 21% 18%, 25% 4%, 39% 10%)'
                    }}
                  >
                    <span className="text-[10px] sm:text-[11px] font-black leading-tight text-[#F4A62A] tracking-wider">
                      100% शुद्ध
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight text-[#F4A62A]">
                      प्रामाणिक
                    </span>
                  </div>
                </div>
              </div>

              {/* Devotee Form Card */}
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Devotee Details</h1>
                <p className="text-sm text-gray-500">Please provide your details for the sacred prebooking.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleBookNow} className="space-y-4 sm:space-y-5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F4A62A]" /> Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                  />
                </div>

                {/* Inline WhatsApp Number & Pincode on Mobile */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  {/* WhatsApp Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 truncate">
                      <Phone className="w-3 h-3 text-[#F4A62A] shrink-0" /> WhatsApp *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-xs">+91</span>
                      <input 
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className="w-full pl-9 sm:pl-11 pr-2 sm:pr-3 py-2.5 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#F4A62A] shrink-0" /> Pincode *
                    </label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="814112"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Address Header & City/State Inline */}
                <div className="pt-3 border-t border-gray-100 space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F4A62A]" /> Delivery Address Details
                  </h3>

                  {/* Inline City & State on Mobile */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">City *</label>
                      <input 
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                        readOnly={fetchingPincode}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">State *</label>
                      <input 
                        type="text"
                        required
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="State"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                        readOnly={fetchingPincode}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#F4A62A]" /> House / Flat / Street Address *
                      </label>
                      <input 
                        type="text"
                        required
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="e.g. Flat 101, Omkar Apartments, Main Road"
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#F4A62A]" /> Landmark (Optional)
                      </label>
                      <input 
                        type="text"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        placeholder="e.g. Near Shiv Temple"
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-3.5 sm:py-4 bg-[#7A1126] hover:bg-[#500A18] text-white rounded-xl font-extrabold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Proceed to Book Now</span>
                    <Zap className="w-5 h-5 text-[#F4A62A] group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'PAYMENT' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Bill Summary */}
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Charges</h2>
                
                <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Prebooking Amount</span>
                    <span className="font-bold text-gray-900">₹{prebookAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Convenience Fee</span>
                    <span className="font-bold text-gray-900">
                      {convenienceFee === 0 ? <span className="text-green-600">FREE</span> : `₹${convenienceFee}`}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-orange-200/50 flex justify-between items-center">
                    <span className="font-extrabold text-gray-900">Total Payable</span>
                    <span className="text-2xl font-black text-[#7A1126]">₹{totalAmount}</span>
                  </div>

                  {/* Animated Free Shipping & Discount Offer Banner (Smooth English <-> Hindi Cycle) */}
                  <div className="pt-3 border-t border-orange-200/60 overflow-hidden">
                    <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200/80 shadow-2xs space-y-1.5">
                      {/* Rounded Star Badge ABOVE Description */}
                      <div className="flex items-center gap-1.5 text-left">
                        <span style={{ borderRadius: '9999px' }} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs shadow-2xs uppercase tracking-wide shrink-0">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" /> ₹200 OFF
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Limited Offer
                        </span>
                      </div>

                      {/* Animated Text Description */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={offerLang}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="flex items-center justify-start gap-2 text-left"
                        >
                          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <p className="text-xs sm:text-sm font-bold text-emerald-900 tracking-wide text-left">
                            {offerLang === 'EN' 
                              ? "Pay online now & get FREE Shipping + ₹200 to ₹250 instant discount!" 
                              : "अभी ऑनलाइन भुगतान करें और पाएं मुफ़्त डिलीवरी + ₹200 से ₹250 की भारी छूट!"
                            }
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
                
                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Pay Now (Online) Card */}
                  <div 
                    onClick={() => setSelectedPaymentMethod('ONLINE')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      selectedPaymentMethod === 'ONLINE'
                        ? 'border-[#7A1126] bg-[#7A1126]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div 
                        style={{ borderRadius: '50%' }}
                        className={`w-12 h-12 shrink-0 aspect-square shadow-xs flex items-center justify-center ${
                          selectedPaymentMethod === 'ONLINE' ? 'bg-[#7A1126] text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg">Pay Now (Online)</h3>
                        <p className="text-xs text-gray-500 mt-1">UPI, QR Code, Cards, NetBanking via Razorpay</p>
                      </div>
                    </div>
                    <div 
                      style={{ borderRadius: '50%' }}
                      className={`w-6 h-6 shrink-0 aspect-square border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'ONLINE' ? 'border-[#7A1126]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPaymentMethod === 'ONLINE' && (
                        <div style={{ borderRadius: '50%' }} className="w-3 h-3 shrink-0 aspect-square bg-[#7A1126]" />
                      )}
                    </div>
                  </div>

                  {/* Pay Later Card */}
                  <div 
                    onClick={() => setSelectedPaymentMethod('COD')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      selectedPaymentMethod === 'COD'
                        ? 'border-[#7A1126] bg-[#7A1126]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div 
                        style={{ borderRadius: '50%' }}
                        className={`w-12 h-12 shrink-0 aspect-square flex items-center justify-center ${
                          selectedPaymentMethod === 'COD' ? 'bg-[#7A1126] text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Banknote className="w-6 h-6" />
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg">Pay Later</h3>
                        <p className="text-xs text-gray-500 mt-1">Cash on Delivery / Pay at Temple</p>
                      </div>
                    </div>
                    <div 
                      style={{ borderRadius: '50%' }}
                      className={`w-6 h-6 shrink-0 aspect-square border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'COD' ? 'border-[#7A1126]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPaymentMethod === 'COD' && (
                        <div style={{ borderRadius: '50%' }} className="w-3 h-3 shrink-0 aspect-square bg-[#7A1126]" />
                      )}
                    </div>
                  </div>

                  {/* Premium Single-Line Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (selectedPaymentMethod === 'ONLINE') {
                          handlePayNow();
                        } else {
                          handlePayLater();
                        }
                      }}
                      className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#7A1126] via-[#9B1635] to-[#7A1126] hover:from-[#500A18] hover:to-[#500A18] text-[#FFF8F0] rounded-2xl font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-lg hover:shadow-2xl border border-[#F4A62A]/40 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-3 whitespace-nowrap"
                    >
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4A62A] group-hover:scale-110 transition-transform shrink-0" />
                      <span className="truncate">
                        {selectedPaymentMethod === 'ONLINE' 
                          ? `Pay Online Now • ₹${totalAmount}` 
                          : `Confirm & Pay Later • ₹${totalAmount}`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
