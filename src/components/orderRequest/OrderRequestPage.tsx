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
  X,
  Globe,
  Loader2,
  XCircle,
  Landmark,
  Gift,
  Send,
  ChevronDown,
  Truck,
  HeartHandshake
} from 'lucide-react';

export const OrderRequestPage: React.FC = () => {
  const { setActivePage, showToast, brandSettings } = useStore();
  const { playTempleBell } = useAudio();

  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<'en'|'hi'>('en');
  const [hasVisited, setHasVisited] = useState<'yes' | 'no' | ''>('');
  const [age, setAge] = useState('');
  const [intent, setIntent] = useState<'prasadi' | 'booking' | ''>('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [isFetchingPin, setIsFetchingPin] = useState(false);

  useEffect(() => {
    if (pincode.length === 6) {
      setIsFetchingPin(true);
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setCity(postOffice.District || postOffice.Block || '');
            setStateName(postOffice.State || '');
          } else {
            showToast(lang === 'hi' ? 'अमान्य पिनकोड' : 'Invalid Pincode', 'error');
            setCity('');
            setStateName('');
          }
        })
        .catch(() => {
           showToast(lang === 'hi' ? 'पिनकोड जाँचना विफल रहा' : 'Failed to fetch pincode', 'error');
        })
        .finally(() => setIsFetchingPin(false));
    } else {
      setCity('');
      setStateName('');
    }
  }, [pincode, lang]);
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
    if (!devoteeName || !whatsappNumber) {
      showToast(lang === 'hi' ? 'कृपया अपना नाम और व्हाट्सएप नंबर दर्ज करें' : 'Please enter your Name and WhatsApp Number', 'warning');
      return;
    }

    playTempleBell();
    const reqNo = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq = {
      id: `req-${Date.now()}`,
      reqNo: reqNo,
      devoteeName,
      phone: whatsappNumber,
      email: 'devotee@babadham.org',
      address: `${streetAddress ? streetAddress + ', ' : ''}${city ? city + ', ' : ''}${stateName ? stateName + ', ' : ''}${pincode}`,
      requestType: intent === 'booking' ? 'Confirmed Booking (₹151)' : 'Prasadi Request',
      details: `Visited: ${hasVisited}, Age: ${age}`,
      preferredDate: new Date().toISOString().split('T')[0],
      estimatedAmount: intent === 'booking' ? 151 : 0,
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 -mt-12 sm:-mt-20">
        {/* Main Request Form or Confirmation Card */}
        <div className="bg-[#FDFBF7] rounded-3xl border border-[#E8E1D5] p-4 sm:p-8 space-y-6 text-[#2B1A16] shadow-xl">
          
          {isSubmitted ? (
            <div className="text-center space-y-6 py-6 animate-in fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h2 className="font-serif-temple text-2xl sm:text-3xl font-extrabold text-[#500A18]">
                  अनुरोध दर्ज कर लिया गया है!
                </h2>
                <p className="text-xs sm:text-sm text-[#2B1A16]/80 mt-1">
                  Har Har Mahadev! Your custom order request has been submitted to the Deoghar Seva Kendra.
                </p>
                <div className="mt-4 inline-block px-6 py-3 rounded-2xl bg-white border border-[#F4A62A]/60 text-[#E59210] font-mono font-extrabold text-xl shadow-inner">
                  Request Ref: {submittedReqNo}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#F4A62A]/20 text-xs sm:text-sm text-[#2B1A16]/90 text-left max-w-lg mx-auto space-y-2 shadow-sm">
                <div className="font-bold text-[#E59210] text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Next Steps:
                </div>
                <p>1. Our temple prasad coordinator will review your custom specifications.</p>
                <p>2. You will receive a direct phone call or WhatsApp message on <strong>{whatsappNumber}</strong> to confirm pricing and dispatch details.</p>
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
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-[#500A18] font-bold text-xs hover:bg-[#FDF4E3] transition-all border border-[#500A18]/40 cursor-pointer shadow-sm"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center text-center mb-6 gap-3">
                <div className="flex items-center justify-center gap-3">
                   <span className="text-3xl text-[#D4AF37] leading-none drop-shadow-sm">🔱</span>
                   <h3 className="font-serif-temple text-2xl sm:text-3xl font-bold text-[#500A18] leading-tight">
                     {lang === 'hi' ? 'भक्त विवरण और अनुरोध' : 'Devotee Details & Request'}
                   </h3>
                   <span className="text-3xl text-[#D4AF37] leading-none drop-shadow-sm">🔱</span>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {lang === 'hi' ? 'कृपया अपनी जानकारी भरें, हमारी टीम आपसे संपर्क करेगी।' : 'Please fill in your details, our team will contact you.'}
                </p>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 text-[#D4AF37] opacity-90 mt-2">
                  <div className="flex gap-2">
                    {[1,2,3,4].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full bg-[#D4AF37] ${i === 1 ? 'opacity-40' : i === 2 ? 'opacity-60' : i === 3 ? 'opacity-80' : 'opacity-100'}`} />)}
                  </div>
                  <Landmark className="w-7 h-7 mx-1 text-[#D4AF37]" />
                  <div className="flex gap-2">
                    {[1,2,3,4].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full bg-[#D4AF37] ${i === 4 ? 'opacity-40' : i === 3 ? 'opacity-60' : i === 2 ? 'opacity-80' : 'opacity-100'}`} />)}
                  </div>
                </div>
              </div>

              {/* Promotional Banner */}
              <div className="bg-gradient-to-r from-[#FFF4D9] to-[#FFF9EB] border border-[#F4E1A1] rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-sm mb-8 mx-auto max-w-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F5B642] to-[#E59210] flex items-center justify-center shrink-0 shadow-inner">
                    <Gift className="w-7 h-7 text-[#6E1120]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2B1A16] text-sm sm:text-base">
                      {lang === 'hi' ? 'बाबा का प्रसाद आपके लिए' : 'Baba\'s Prasad For You'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {lang === 'hi' ? 'हर ऑर्डर के साथ पाएं बाबा का आशीर्वाद' : 'Get Baba\'s blessings with every order'}
                    </p>
                  </div>
                </div>
                
                {/* Scalopped Seal Badge */}
                <div className="w-[72px] h-[72px] shrink-0 relative flex items-center justify-center drop-shadow-md">
                  {/* Create a scalloped/jagged edge effect using rotated squares */}
                  <div className="absolute inset-0 bg-[#6E1120] rotate-0 rounded-sm" />
                  <div className="absolute inset-0 bg-[#6E1120] rotate-[30deg] rounded-sm" />
                  <div className="absolute inset-0 bg-[#6E1120] rotate-[60deg] rounded-sm" />
                  <div className="absolute inset-0 bg-[#6E1120] rounded-full scale-[1.05]" />
                  
                  {/* Inner dashed circle */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#F5B642] opacity-80" />
                  
                  {/* Badge Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-[#F5B642] px-1">
                     <span className="text-[10px] font-black leading-tight text-center tracking-wide">
                       100% शुद्ध<br/>प्रामाणिक
                     </span>
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="mb-8 space-y-3 max-w-2xl mx-auto">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Globe className="w-4 h-4 text-gray-600" />
                  भाषा चुनें / Select Language
                </label>
                <div className="flex flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setLang('hi')}
                    className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                      lang === 'hi' 
                        ? 'bg-[#6E1120] text-white border-[#6E1120] shadow-md scale-[1.02]' 
                        : 'bg-white text-gray-800 border-[#E8E1D5] hover:border-gray-400'
                    }`}
                  >
                    हिंदी
                    {lang === 'hi' && <div className="bg-white rounded-full p-0.5 ml-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#6E1120]" /></div>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                      lang === 'en' 
                        ? 'bg-[#6E1120] text-white border-[#6E1120] shadow-md scale-[1.02]' 
                        : 'bg-white text-gray-800 border-[#E8E1D5] hover:border-gray-400'
                    }`}
                  >
                    English
                    {lang === 'en' && <div className="bg-white rounded-full p-0.5 ml-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#6E1120]" /></div>}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => { e.preventDefault(); setStep(2); }} 
                  className="space-y-4"
                >
                  <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-[24px] border border-[#E8E1D5] space-y-0 flex gap-4 shadow-sm items-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FDF1D9] to-[#F3E5C8] flex items-center justify-center shrink-0 shadow-inner">
                      <Landmark className="w-8 h-8 sm:w-10 sm:h-10 text-[#C16200]" />
                    </div>
                    <div className="flex-1 space-y-3 pt-1">
                      <label className="text-sm sm:text-base font-bold text-gray-800 block">
                        {lang === 'hi' ? 'क्या आपने कभी बाबा धाम (देवघर) की यात्रा की है?' : 'Have you ever visited Baba Dham (Deoghar)?'} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button type="button" onClick={() => setHasVisited('yes')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${hasVisited === 'yes' ? 'border-green-500 bg-green-100 text-green-800 shadow-sm' : 'border-green-200 bg-[#F1F8EE] text-green-700 hover:bg-green-100'}`}>
                          <CheckCircle2 className="w-5 h-5 text-green-700" /> {lang === 'hi' ? 'हाँ, गया हूँ' : 'Yes, I have'}
                        </button>
                        <button type="button" onClick={() => setHasVisited('no')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${hasVisited === 'no' ? 'border-red-500 bg-red-100 text-red-800 shadow-sm' : 'border-red-200 bg-[#FCF3F3] text-red-700 hover:bg-red-100'}`}>
                          <XCircle className="w-5 h-5 text-red-600" /> {lang === 'hi' ? 'नहीं, कभी नहीं गया' : 'No, never visited'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-[24px] border border-[#E8E1D5] space-y-0 flex gap-4 shadow-sm items-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FDF1D9] to-[#F3E5C8] flex items-center justify-center shrink-0 shadow-inner">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#C16200]" />
                    </div>
                    <div className="flex-1 space-y-3 pt-1">
                      <label className="text-sm sm:text-base font-bold text-gray-800 block">
                        {lang === 'hi' ? 'आपकी आयु क्या है?' : 'What is your age?'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          placeholder={lang === 'hi' ? 'उदाहरण: 25' : 'Example: 25'}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C16200] transition-colors pr-10"
                        />
                        <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-[24px] border border-[#E8E1D5] space-y-0 flex gap-4 shadow-sm items-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FDF1D9] to-[#F3E5C8] flex items-center justify-center shrink-0 shadow-inner">
                      <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#C16200]" />
                    </div>
                    <div className="flex-1 space-y-3 pt-1">
                      <label className="text-sm sm:text-base font-bold text-gray-800 block">
                        {lang === 'hi' ? 'आपका उद्देश्य क्या है?' : 'What is your intent?'} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button type="button" onClick={() => setIntent('prasadi')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center text-center px-2 gap-2 font-bold text-xs sm:text-sm transition-all ${intent === 'prasadi' ? 'border-[#C16200] bg-[#FFF8F0] text-[#C16200] shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                          {lang === 'hi' ? 'केवल प्रसादी अनुरोध' : 'Prasadi Request Only'}
                        </button>
                        <button type="button" onClick={() => setIntent('booking')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center text-center px-2 gap-2 font-bold text-xs sm:text-sm transition-all ${intent === 'booking' ? 'border-[#C16200] bg-[#FFF8F0] text-[#C16200] shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                          {lang === 'hi' ? 'बुकिंग की पुष्टि (₹151)' : 'Confirm Booking'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!hasVisited || !age || !intent}
                      className="w-full py-4 sm:py-5 rounded-[24px] bg-gradient-to-b from-[#7A1323] to-[#5A0D18] text-white font-bold text-lg hover:from-[#8B1528] hover:to-[#6E1120] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-2 relative z-10">
                        <Send className="w-5 h-5 -mt-0.5" />
                        <span>{lang === 'hi' ? 'अनुरोध भेजें' : 'Send Request'}</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-normal opacity-80 mt-0.5 tracking-wide relative z-10">
                        {lang === 'hi' ? 'आपका जानकारी सीधे हमारे टीम तक पहुंचेगा' : 'Your information directly reaches our team'}
                      </span>
                    </button>
                    <div className="text-center mt-4 text-xs text-gray-500 flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> {lang === 'hi' ? 'आपकी जानकारी सुरक्षित है। हम आपकी गोपनीयता का सम्मान करते हैं।' : 'Your data is safe. We respect your privacy.'}
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#500A18] font-bold mb-1.5">
                        {lang === 'hi' ? 'पूरा नाम *' : 'Devotee Name *'}
                      </label>
                      <div className="relative group">
                        <User className="w-4 h-4 text-[#500A18]/60 group-focus-within:text-[#500A18] transition-colors absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={devoteeName}
                          onChange={e => setDevoteeName(e.target.value)}
                          placeholder={lang === 'hi' ? 'उदा. रामेश्वर नाथ शर्मा' : 'e.g. Rameshwar Nath Sharma'}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#500A18] font-bold mb-1.5">
                        {lang === 'hi' ? 'व्हाट्सएप नंबर *' : 'WhatsApp Number *'}
                      </label>
                      <div className="relative group">
                        <Phone className="w-4 h-4 text-[#500A18]/60 group-focus-within:text-[#500A18] transition-colors absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={whatsappNumber}
                          onChange={e => setWhatsappNumber(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#500A18] font-bold mb-1.5">
                        {lang === 'hi' ? 'पिनकोड *' : 'Pincode *'}
                      </label>
                      <div className="relative group">
                        <MapPin className="w-4 h-4 text-[#500A18]/60 group-focus-within:text-[#500A18] transition-colors absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 814112"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                        />
                        {isFetchingPin && <Loader2 className="w-4 h-4 text-[#500A18] absolute right-3.5 top-3 animate-spin" />}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[#500A18] font-bold mb-1.5">
                        {lang === 'hi' ? 'शहर / ज़िला' : 'City / District'}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder={lang === 'hi' ? 'शहर दर्ज करें' : 'Enter City'}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#500A18] font-bold mb-1.5">
                        {lang === 'hi' ? 'राज्य' : 'State'}
                      </label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={e => setStateName(e.target.value)}
                        placeholder={lang === 'hi' ? 'राज्य दर्ज करें' : 'Enter State'}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#500A18] font-bold mb-1.5">
                      {lang === 'hi' ? 'सड़क का पता / लैंडमार्क *' : 'Street Address / Landmark *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={streetAddress}
                      onChange={e => setStreetAddress(e.target.value)}
                      placeholder={lang === 'hi' ? 'घर का नंबर, गली, या कोई पहचान...' : 'House No, Street, or Landmark...'}
                      className="w-full p-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-[#2B1A16]/40 focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all leading-relaxed shadow-none"
                    />
                  </div>

                  {/* Special Message Box (Moved to Step 2) */}
                  <div className="bg-[#FCF1ED] p-4 sm:p-5 rounded-[24px] border border-[#F6DFD7] flex gap-4 shadow-sm items-center mt-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F6DFD7] flex items-center justify-center shrink-0 shadow-inner">
                      <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-[#6E1120]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-sm sm:text-base font-bold text-[#6E1120] block">
                        {lang === 'hi' ? 'विशेष अनुरोध या संदेश (वैकल्पिक)' : 'Special Request (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={specialRequest}
                        onChange={e => setSpecialRequest(e.target.value)}
                        placeholder={lang === 'hi' ? 'अगर आपका कोई विशेष अनुरोध है तो यहाँ लिखें...' : 'Write any special requests...'}
                        className="w-full bg-transparent border-none text-xs sm:text-sm text-[#6E1120]/80 placeholder-[#6E1120]/50 focus:outline-none p-0 m-0 focus:ring-0 shadow-none"
                      />
                    </div>
                    <div className="shrink-0 pl-1 pr-2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF4B4B] fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#500A18]/10 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#500A18] font-bold hover:bg-[#FDF4E3] hover:border-[#500A18]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-none flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> {lang === 'hi' ? 'पीछे' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#500A18] to-[#7A1126] text-white font-extrabold hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" /> {lang === 'hi' ? 'अनुरोध भेजें' : 'Submit Order Request'}
                    </button>
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
