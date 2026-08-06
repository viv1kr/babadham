import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Package,
  Award,
  Clock,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Tv,
  ExternalLink,
  X
} from 'lucide-react';

export const OrderRequestPage: React.FC = () => {
  const { setActivePage, showToast, brandSettings } = useStore();
  const { playTempleBell } = useAudio();

  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [requestType, setRequestType] = useState('Special Mahaprasad Box');
  const [details, setDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReqNo, setSubmittedReqNo] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sliding Hero Banners State
  const defaultSlides = [
    {
      id: 'req-slide-1',
      title: 'Direct Garbhagriha Bhog Prasad',
      subtitle: 'Touch-blessed at Baidyanath Jyotirlinga & delivered directly to your doorstep.',
      imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'req-slide-2',
      title: 'Bulk Prasad & Devotee Seva',
      subtitle: 'Special Shravani Mela, Marriage & Family Anushthan Custom Prasad Boxes.',
      imageUrl: 'https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'req-slide-3',
      title: 'Pure Desi Ghee Deoghar Peda',
      subtitle: 'Authentic 100% Pure Cow Milk Peda prepared by Traditional Temple Halwais.',
      imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSettings = (() => {
    try {
      const localStr = localStorage.getItem('babadham_brand_settings');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        return { ...brandSettings, ...parsed };
      }
    } catch (e) {}
    return brandSettings;
  })();

  const rawSlides = (activeSettings?.orderRequestHeroSlides && activeSettings.orderRequestHeroSlides.length > 0)
    ? activeSettings.orderRequestHeroSlides
    : (activeSettings?.heroSlides && activeSettings.heroSlides.length > 0)
      ? activeSettings.heroSlides
      : null;

  const slides = rawSlides
    ? rawSlides.map((s: any, idx: number) => ({
        id: s.id || `slide-${idx}`,
        title: s.heading !== undefined ? s.heading : defaultSlides[idx % defaultSlides.length].title,
        subtitle: s.description !== undefined ? s.description : defaultSlides[idx % defaultSlides.length].subtitle,
        imageUrl: (isMobile && s.mobileMediaUrl) ? s.mobileMediaUrl : (s.mediaUrl || defaultSlides[idx % defaultSlides.length].imageUrl),
        type: s.type || 'image'
      }))
    : defaultSlides;

  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoDismissed, setIsVideoDismissed] = useState(false);
  const currentSlide = slides[slideIndex] || slides[0];
  const hasText = Boolean(currentSlide?.title || currentSlide?.subtitle);



  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  useEffect(() => {
    setActivePage('order-request');
    try {
      if (!window.location.pathname.endsWith('/order-request')) {
        window.history.pushState({}, '', '/order-request');
      }
    } catch (e) {}

    const timer = setTimeout(() => {
      try {
        const customUrl = activeSettings?.orderRequestMediaConfig?.bellAudioUrl || (activeSettings as any)?.bellAudioUrl;
        if (customUrl && customUrl.trim().length > 0) {
          const audio = new Audio(customUrl);
          audio.volume = 0.85;
          audio.play().catch(() => playTempleBell());
        } else {
          playTempleBell();
        }
      } catch (e) {
        playTempleBell();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyFunnelLink = () => {
    const funnelUrl = `${window.location.origin}/order-request`;
    navigator.clipboard.writeText(funnelUrl).then(() => {
      setCopiedLink(true);
      showToast('Order Request Funnel Link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      showToast(`Funnel Link: ${funnelUrl}`, 'info');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName || !phone) {
      showToast('Please enter your Name and Mobile Number', 'warning');
      return;
    }

    playTempleBell();
    const reqNo = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq = {
      id: `req-${Date.now()}`,
      reqNo: reqNo,
      devoteeName,
      phone,
      email: email || 'devotee@babadham.org',
      address: address || 'Deoghar Dham',
      requestType,
      details: details || requestType,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      estimatedAmount: parseFloat(estimatedAmount) || 1500,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const STORAGE_KEY = 'babadham_order_requests';
      const existingStr = localStorage.getItem(STORAGE_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newReq, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Trigger cross-tab & server database sync
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bbp_db_updated'));
      try {
        const channel = new BroadcastChannel('bbp_db_sync');
        channel.postMessage({ type: 'DB_UPDATED' });
        channel.close();
      } catch (err) {}

      fetch('/api/db', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'babadham_sec_token_882910',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ babadham_order_requests: updated })
      }).catch(() => {});

    } catch (err) {}

    setSubmittedReqNo(reqNo);
    setIsSubmitted(true);
    showToast('Your Custom Order Request has been submitted!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      
      {/* HERO SLIDING IMAGE CAROUSEL SECTION */}
      <div className="relative w-full h-[32vh] min-h-[220px] sm:h-[42vh] max-h-[460px] bg-[#120508] overflow-hidden select-none border-b-2 border-[#F4A62A]/40 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide?.id || slideIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
          >
            {currentSlide?.type === 'video' ? (
              <video 
                src={currentSlide.imageUrl} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className={`w-full h-full object-cover transition-all ${hasText ? 'brightness-[0.85]' : 'brightness-100'}`} 
              />
            ) : (
              <img 
                src={currentSlide?.imageUrl} 
                alt={currentSlide?.title || 'Order Request Banner'} 
                className={`w-full h-full object-cover transition-all ${hasText ? 'brightness-[0.85]' : 'brightness-100'}`}
              />
            )}

            {/* Minimal Overlay Gradient */}
            <div className={`absolute inset-0 transition-opacity ${
              hasText 
                ? 'bg-gradient-to-t from-[#2B1217]/80 via-[#2B1217]/40 to-transparent' 
                : 'bg-gradient-to-t from-[#2B1217]/30 via-transparent to-transparent'
            }`} />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,166,42,0.08),transparent_70%)] pointer-events-none" />

            {hasText && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="max-w-3xl space-y-2 sm:space-y-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A0B0E]/80 border border-[#F4A62A]/50 text-[#F4A62A] text-[10px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" /> Baidyanath Seva Kendra • Custom Order Funnel
                  </span>
                  {currentSlide?.title && (
                    <h2 className="font-serif-temple text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFF8F0] drop-shadow-lg leading-tight">
                      {currentSlide.title}
                    </h2>
                  )}
                  {currentSlide?.subtitle && (
                    <p className="text-xs sm:text-base text-[#F4A62A] font-medium max-w-xl mx-auto drop-shadow-md">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Play / Pause Toggle Icon Button Only */}
        {slides.length > 1 && (
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full aspect-square flex-shrink-0 bg-white/20 hover:bg-white/40 text-white border border-white/50 flex items-center justify-center shadow-lg backdrop-blur-md transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-0 sm:px-6 pt-0 space-y-8">
        {/* Main Request Form or Confirmation Card */}
        <div className="bg-[#2B1217] rounded-none sm:rounded-3xl border-y-2 sm:border-2 border-[#F4A62A]/40 p-4 sm:p-8 shadow-2xl space-y-6 text-[#FFF8F0]">
          
          {isSubmitted ? (
            <div className="text-center space-y-6 py-6 animate-in fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h2 className="font-serif-temple text-2xl sm:text-3xl font-extrabold text-[#F4A62A]">
                  अनुरोध दर्ज कर लिया गया है!
                </h2>
                <p className="text-xs sm:text-sm text-[#FFF8F0]/80 mt-1">
                  Har Har Mahadev! Your custom order request has been submitted to the Deoghar Seva Kendra.
                </p>
                <div className="mt-4 inline-block px-6 py-3 rounded-2xl bg-[#1A0B0E] border border-[#F4A62A]/60 text-[#F4A62A] font-mono font-extrabold text-xl shadow-inner">
                  Request Ref: {submittedReqNo}
                </div>
              </div>

              <div className="bg-[#1A0B0E] p-5 rounded-2xl border border-[#F4A62A]/20 text-xs sm:text-sm text-[#FFF8F0]/90 text-left max-w-lg mx-auto space-y-2">
                <div className="font-bold text-[#F4A62A] text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Next Steps:
                </div>
                <p>1. Our temple prasad coordinator will review your custom specifications.</p>
                <p>2. You will receive a direct phone call or WhatsApp message on <strong>{phone}</strong> to confirm pricing and dispatch details.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href={`https://wa.me/919876543211?text=Jai%20Baba%20Baidyanath!%20I%20have%20submitted%20Custom%20Order%20Request%20${submittedReqNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Connect with Seva Team on WhatsApp
                </a>
                <button
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#500A18] text-[#F4A62A] font-bold text-xs hover:bg-[#7A1126] transition-all border border-[#F4A62A]/40 cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b border-[#F4A62A]/20 pb-4 mb-6">
                <h3 className="font-serif-temple text-lg sm:text-xl font-bold text-[#F4A62A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F4A62A]" /> Devotee Details & Request Specifications
                </h3>
                <p className="text-xs text-[#FFF8F0]/70 mt-0.5">
                  Please fill out the form below. Required fields are marked with an asterisk (*).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F4A62A] font-bold mb-1.5">
                      Devotee Name (पूरा नाम) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#F4A62A]/70 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={devoteeName}
                        onChange={e => setDevoteeName(e.target.value)}
                        placeholder="e.g. Rameshwar Nath Sharma"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#F4A62A] font-bold mb-1.5">
                      Mobile Number (मोबाइल नंबर) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#F4A62A]/70 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F4A62A] font-bold mb-1.5">
                      Email Address (optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#F4A62A]/70 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="devotee@example.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#F4A62A] font-bold mb-1.5">
                      Service / Prasad Category *
                    </label>
                    <select
                      value={requestType}
                      onChange={e => setRequestType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                    >
                      <option value="Special Mahaprasad Box">Special Mahaprasad Box (महाप्रसाद)</option>
                      <option value="Bulk Pure Milk Peda Prasad">Bulk Pure Milk Peda Prasad (5kg+)</option>
                      <option value="Garbhagriha Touch Blessing">Garbhagriha Touch Blessing Prasad</option>
                      <option value="Sultanganj Sacred Gangajal Jars">Sultanganj Sacred Gangajal Jars</option>
                      <option value="Sphatik Shivalinga & Rudraksha Mala">Sphatik Shivalinga & Rudraksha Mala</option>
                      <option value="Special Somvar Rudrabhishek Bhog">Special Somvar Rudrabhishek Bhog</option>
                      <option value="Other Custom Prasad / Ritual">Other Custom Prasad / Ritual Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1.5">
                    Delivery Address & City (पूरा पता) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#F4A62A]/70 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="House No, Street, Landmark, City & Pincode"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1.5">
                    Detailed Requirements & Specifications (विशेष आवश्यकताएं)
                  </label>
                  <textarea
                    rows={4}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="Provide details about exact peda quantity, packaging preference, devotee gotra/name for puja blessing..."
                    className="w-full p-3 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F4A62A] font-bold mb-1.5">
                      Preferred Date (इच्छित तिथि)
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#F4A62A]/70 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#F4A62A] font-bold mb-1.5">
                      Estimated Budget (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-[#F4A62A]/70 absolute left-3.5 top-3" />
                      <input
                        type="number"
                        value={estimatedAmount}
                        onChange={e => setEstimatedAmount(e.target.value)}
                        placeholder="e.g. 2500"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#F4A62A]/20">
                  <button
                    type="button"
                    onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-5 py-3 rounded-xl bg-[#1A0B0E] text-[#FFF8F0]/70 font-bold hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#F4A62A] via-[#E59210] to-[#F4A62A] text-[#2B1A16] font-extrabold hover:bg-white transition-all cursor-pointer shadow-xl flex items-center gap-2 text-sm"
                  >
                    <Sparkles className="w-4 h-4" /> Submit Order Request
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
