import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, MapPin, Phone, User, Landmark, Building, Navigation, Zap, CreditCard, Banknote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { PrebookingHeroSection } from './PrebookingHeroSection';

export const PreBookingPage: React.FC = () => {
  const { setActivePage, preBookingProduct, brandSettings, addOrder } = useStore();
  const { playTempleBell } = useAudio();
  
  const [step, setStep] = useState<'FORM' | 'PAYMENT'>('FORM');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');

  // Form State
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [fetchingPincode, setFetchingPincode] = useState(false);

  // Financials
  const prebookAmount = preBookingProduct ? Math.floor(preBookingProduct.price * 0.1) || 251 : 251;
  const convenienceFee = 0;
  const totalAmount = prebookAmount + convenienceFee;

  // Fetch City/State from Pincode
  useEffect(() => {
    if (pincode.length === 6) {
      fetchPincodeDetails(pincode);
    }
  }, [pincode]);

  const fetchPincodeDetails = async (pin: string) => {
    setFetchingPincode(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setCity(postOffice.District);
        setState(postOffice.State);
      }
    } catch (err) {
      console.warn("Pincode API failed, falling back to manual.");
    } finally {
      setFetchingPincode(false);
    }
  };

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !pincode || !city || !state || !address) {
      setErrorMsg('Please fill all required fields');
      return;
    }
    setErrorMsg('');
    setStep('PAYMENT');
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    setLoading(true);
    const res = await loadRazorpay();
    if (!res) {
      setErrorMsg('Failed to load payment gateway. Please check your internet connection.');
      setLoading(false);
      return;
    }

    const options = {
      key: 'rzp_live_XXXXXXXXXXXXXX', // LIVE KEY REQUIRED HERE
      amount: (totalAmount * 100).toString(),
      currency: 'INR',
      name: brandSettings?.brandName || 'BABA BAIDYANATH PRASADAM',
      description: preBookingProduct ? `Prebooking: ${preBookingProduct.name}` : 'Sacred Prebooking',
      image: brandSettings?.logoImageUrl || 'https://babadham.vercel.app/logo.png',
      handler: function (response: any) {
        processOrder('ONLINE', response.razorpay_payment_id);
      },
      prefill: {
        name: name,
        contact: whatsapp,
      },
      theme: {
        color: '#7A1126'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      setErrorMsg('Payment Failed. Please try again.');
    });
    rzp.open();
    setLoading(false);
  };

  const handlePayLater = () => {
    processOrder('COD');
  };

  const processOrder = (method: 'ONLINE' | 'COD', transactionId?: string) => {
    const orderData = {
      orderId: `BBP-PRE-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending' as const,
      customerName: name,
      customerPhone: whatsapp,
      shippingAddress: `${address}, ${landmark ? landmark + ', ' : ''}${city}, ${state} - ${pincode}`,
      totalAmount: totalAmount,
      items: preBookingProduct ? [{ product: preBookingProduct, quantity: 1 }] : [],
      paymentMethod: method,
      transactionId: transactionId || '',
      date: new Date().toISOString()
    };

    addOrder(orderData);
    playTempleBell();
    setActivePage('success');
  };

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
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Devotee Details</h1>
                <p className="text-sm text-gray-500">Please provide your details for the sacred prebooking.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleBookNow} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#F4A62A]" /> Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#F4A62A]" /> WhatsApp Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                      <input 
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F4A62A]" /> Delivery Address
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pincode *</label>
                      <input 
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">City *</label>
                      <input 
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                        readOnly={fetchingPincode}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">State *</label>
                      <input 
                        type="text"
                        required
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="State"
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                        readOnly={fetchingPincode}
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#F4A62A]" /> House / Flat / Street Address *
                      </label>
                      <input 
                        type="text"
                        required
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="e.g. Flat 101, Omkar Apartments, Main Road"
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#F4A62A]" /> Landmark (Optional)
                      </label>
                      <input 
                        type="text"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        placeholder="e.g. Near Shiv Temple"
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#7A1126] focus:ring-2 focus:ring-[#7A1126]/20 transition-all font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#7A1126] hover:bg-[#500A18] text-white rounded-xl font-extrabold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
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
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full shadow-xs flex items-center justify-center ${
                        selectedPaymentMethod === 'ONLINE' ? 'bg-[#7A1126] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">Pay Now (Online)</h3>
                        <p className="text-xs text-gray-500 mt-1">UPI, QR Code, Cards, NetBanking via Razorpay</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'ONLINE' ? 'border-[#7A1126]' : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'ONLINE' && (
                        <div className="w-3 h-3 rounded-full bg-[#7A1126]" />
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
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedPaymentMethod === 'COD' ? 'bg-[#7A1126] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Banknote className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">Pay Later</h3>
                        <p className="text-xs text-gray-500 mt-1">Cash on Delivery / Pay at Temple</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'COD' ? 'border-[#7A1126]' : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'COD' && (
                        <div className="w-3 h-3 rounded-full bg-[#7A1126]" />
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
