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
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [hasAskedLocation, setHasAskedLocation] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 14, minutes: 22, seconds: 45 });
  const [blinkingTextIndex, setBlinkingTextIndex] = useState(0);

  const [bookingAmount, setBookingAmount] = useState(251);
  const [bookingDiscountPercent, setBookingDiscountPercent] = useState(12);
  const [slotPeriodText, setSlotPeriodText] = useState('5 August to 19 August');
  const [totalSlotLimit, setTotalSlotLimit] = useState(500);
  const [sessionConfirmedBookings, setSessionConfirmedBookings] = useState(0);

  const [realDevoteeNames, setRealDevoteeNames] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };
  const [liveDevoteeIndex, setLiveDevoteeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDevoteeIndex(prev => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const dynamicJoinedCount = 155 + sessionConfirmedBookings;

  const calculateLiveConfirmedBookings = () => {
    try {
      const namesList: string[] = [];

      const stored = localStorage.getItem('babadham_order_requests');
      if (stored) {
        const requests = JSON.parse(stored);
        if (Array.isArray(requests)) {
          requests.forEach((r: any) => {
            const n = r.name || r.devoteeName || r.customerName;
            if (n && typeof n === 'string' && n.trim() && !namesList.includes(n.trim())) {
              namesList.push(n.trim());
            }
          });

          const count = requests.filter((r: any) => 
            r.requestType && r.requestType.includes('Confirmed Booking')
          ).length;
          setSessionConfirmedBookings(count);
        }
      }

      const dbStr = localStorage.getItem('babadham_mysql_db_v1');
      if (dbStr) {
        const parsedDb = JSON.parse(dbStr);
        if (Array.isArray(parsedDb.orderRequests)) {
          parsedDb.orderRequests.forEach((r: any) => {
            const n = r.name || r.devoteeName || r.customerName;
            if (n && typeof n === 'string' && n.trim() && !namesList.includes(n.trim())) {
              namesList.push(n.trim());
            }
          });
        }
      }

      if (namesList.length > 0) {
        setRealDevoteeNames(namesList);
      }
    } catch(e) {}
  };

  // STRICTLY 100% REAL LIVE DATA - NO DUMMY OR FAKE NAMES
  const activeLatestName = devoteeName 
    ? devoteeName 
    : (realDevoteeNames.length > 0 
        ? realDevoteeNames[liveDevoteeIndex % realDevoteeNames.length] 
        : (lang === 'hi' ? 'बाबा प्रसाद भक्त' : 'Baba Prasad Devotee'));

  const rawThreeNames = [
    activeLatestName,
    realDevoteeNames.length > 1 ? realDevoteeNames[(liveDevoteeIndex + 1) % realDevoteeNames.length] : (lang === 'hi' ? 'भक्त' : 'Devotee'),
    realDevoteeNames.length > 2 ? realDevoteeNames[(liveDevoteeIndex + 2) % realDevoteeNames.length] : (lang === 'hi' ? 'भक्त' : 'Devotee')
  ];

  const recentThreeInitials = rawThreeNames.map(n => 
    n ? n.trim().charAt(0).toUpperCase() : 'B'
  );

  const renderTrustBanner = () => (
    <div className="bg-[#FFF8F0] border border-[#F4E1A1] rounded-[20px] p-3 sm:p-3.5 mb-4 flex items-center gap-3.5 shadow-sm select-none">
      {/* 3 Overlapping User Profile Icons with Golden Rings */}
      <div className="flex -space-x-3 overflow-hidden shrink-0">
        {recentThreeInitials.map((initial, idx) => (
          <div 
            key={idx} 
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-white border-2 border-[#F4A62A] shadow-md transition-all ${
              idx === 0 
                ? 'bg-gradient-to-br from-[#7A1323] via-[#9E1B32] to-[#C16200] z-20' 
                : idx === 1 
                ? 'bg-gradient-to-br from-[#5A0D18] to-[#7A1323] z-10' 
                : 'bg-gradient-to-br from-[#3B060E] to-[#5A0D18] z-0'
            }`}
          >
            {initial}
          </div>
        ))}
      </div>

      {/* Dynamic Animated Booking Devotee Name on Top */}
      <div className="min-w-0 flex-1 overflow-hidden h-9 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.h4
            key={activeLatestName}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="font-extrabold text-[#500A18] text-xs sm:text-sm leading-tight truncate"
          >
            {activeLatestName}
          </motion.h4>
        </AnimatePresence>
        <p className="text-[11px] sm:text-xs text-[#C16200] font-bold mt-0.5 truncate">
          {lang === 'hi' ? 'भक्त जुड़े (आप भी जुड़ें बाबा के आशीर्वाद से)' : 'Devotees joined with Baba\'s blessings'}
        </p>
      </div>
    </div>
  );

  const loadBookingConfig = () => {
    try {
      let config = null;

      // 1. Check brandSettings from StoreContext
      if (brandSettings?.bookingSlotsConfig) {
        config = brandSettings.bookingSlotsConfig;
      }

      // 2. Check localStorage babadham_brand_settings
      if (!config) {
        const brandStr = localStorage.getItem('babadham_brand_settings');
        if (brandStr) {
          const parsed = JSON.parse(brandStr);
          if (parsed.bookingSlotsConfig) config = parsed.bookingSlotsConfig;
        }
      }

      // 3. Check localStorage babadham_mysql_db_v1
      if (!config) {
        const dbStr = localStorage.getItem('babadham_mysql_db_v1');
        if (dbStr) {
          const parsedDb = JSON.parse(dbStr);
          if (parsedDb.brandSettings?.bookingSlotsConfig) {
            config = parsedDb.brandSettings.bookingSlotsConfig;
          }
        }
      }

      // 4. Fallback to standalone key
      if (!config) {
        const stored = localStorage.getItem('babadham_booking_slots_config');
        if (stored) config = JSON.parse(stored);
      }

      if (config) {
        if (config.confirmBookingAmount !== undefined && config.confirmBookingAmount !== '') {
          setBookingAmount(Number(config.confirmBookingAmount));
        }
        if (config.confirmBookingDiscount !== undefined && config.confirmBookingDiscount !== '') {
          setBookingDiscountPercent(Number(config.confirmBookingDiscount));
        }
        if (config.slotPeriodText !== undefined && config.slotPeriodText !== '') {
          setSlotPeriodText(config.slotPeriodText);
        }
        if (config.availableSlotsCount !== undefined && config.availableSlotsCount !== '') {
          // Note: AvailableSlotsCount logic needs definition in state if used
        }
        if (config.totalSlotLimit !== undefined && config.totalSlotLimit !== '') {
          setTotalSlotLimit(Number(config.totalSlotLimit));
        }
      }
    } catch(e) {}
  };

  useEffect(() => {
    loadBookingConfig();
    calculateLiveConfirmedBookings();

    const handleUpdate = () => {
      loadBookingConfig();
      calculateLiveConfirmedBookings();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('bbp_booking_config_updated', handleUpdate as any);
    window.addEventListener('bbp_db_updated', handleUpdate as any);

    const pollInterval = setInterval(handleUpdate, 1000);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('bbp_booking_config_updated', handleUpdate as any);
      window.removeEventListener('bbp_db_updated', handleUpdate as any);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    loadBookingConfig();
    calculateLiveConfirmedBookings();
  }, [brandSettings]);

  const finalBookingAmount = Math.max(0, Math.round(bookingAmount - (bookingAmount * (bookingDiscountPercent / 100))));
  const liveTotalBookedSlots = Math.min(totalSlotLimit, sessionConfirmedBookings);

  const blinkingTexts = [
    'BOOK NOW',
    'FAST BOOKING',
    'जल्दी बुक करें'
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setBlinkingTextIndex((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(textInterval);
  }, []);


  const [showLiveBooking, setShowLiveBooking] = useState(false);
  const [liveBookingIndex, setLiveBookingIndex] = useState(0);
  
  const [liveBookings, setLiveBookings] = useState([
    { name: 'Ramesh K.', state: 'Bihar', intent: 'booking', time: 'Just now' },
    { name: 'Suresh M.', state: 'Jharkhand', intent: 'prasadi', time: '1 min ago' },
    { name: 'Priya S.', state: 'Delhi', intent: 'booking', time: '2 mins ago' },
    { name: 'Amit V.', state: 'Maharashtra', intent: 'booking', time: '5 mins ago' },
    { name: 'Neha G.', state: 'Uttar Pradesh', intent: 'prasadi', time: '6 mins ago' },
  ]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;
    let nextIndexTimeoutId: NodeJS.Timeout;

    const scheduleNextBooking = () => {
      // Random delay between 20 and 30 seconds for previous/dummy bookings
      const randomDelay = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
      
      timeoutId = setTimeout(() => {
        playTempleBell();
        setShowLiveBooking(true);
        
        // Hide after 6 seconds
        hideTimeoutId = setTimeout(() => {
          setShowLiveBooking(false);
          // Wait for fast exit animation to finish before swapping index
          nextIndexTimeoutId = setTimeout(() => {
            setLiveBookingIndex((prev) => (prev + 1) % liveBookings.length);
            scheduleNextBooking();
          }, 800);
        }, 6000);
      }, randomDelay);
    };

    scheduleNextBooking();
    
    // Listen for instant real bookings
    const handleNewBooking = (e: any) => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
      clearTimeout(nextIndexTimeoutId);
      
      const newBooking = e.detail;
      setLiveBookings(prev => [newBooking, ...prev]);
      setLiveBookingIndex(0);
      playTempleBell();
      setShowLiveBooking(true);
      
      hideTimeoutId = setTimeout(() => {
        setShowLiveBooking(false);
        nextIndexTimeoutId = setTimeout(() => {
          setLiveBookingIndex((prev) => (prev + 1) % (liveBookings.length + 1));
          scheduleNextBooking();
        }, 800);
      }, 6000);
    };

    window.addEventListener('new_live_booking', handleNewBooking as any);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
      clearTimeout(nextIndexTimeoutId);
      window.removeEventListener('new_live_booking', handleNewBooking as any);
    };
  }, [playTempleBell, liveBookings.length]);

  useEffect(() => {
    const targetDate = new Date(new Date().getFullYear(), 7, 25, 23, 59, 59).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
          const data = await res.json();
          if (data && data.address) {
            if (data.address.postcode) {
              setPincode(data.address.postcode);
            }
            if (data.display_name) {
              setStreetAddress(data.display_name);
            }
            showToast(lang === 'hi' ? 'स्थान सफलतापूर्वक पता चला!' : 'Location detected successfully!', 'success');
          }
        } catch (err) {
          showToast(lang === 'hi' ? 'स्थान का पता लगाने में विफल' : 'Failed to detect location', 'error');
        }
      }, () => {
        showToast(lang === 'hi' ? 'स्थान की अनुमति अस्वीकृत' : 'Location permission denied', 'error');
      });
    } else {
      showToast(lang === 'hi' ? 'स्थान समर्थित नहीं है' : 'Geolocation is not supported', 'error');
    }
  };

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
      requestType: intent === 'booking' ? `Confirmed Booking (₹${finalBookingAmount})` : 'Prasadi Request',
      details: `Visited: ${hasVisited}, Age: ${age}`,
      preferredDate: new Date().toISOString().split('T')[0],
      estimatedAmount: intent === 'booking' ? finalBookingAmount : 0,
      status: intent === 'booking' ? 'Payment Pending' : 'Pending',
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
    
    if (intent === 'booking') {
      window.location.href = '/checkout';
    } else {
      setIsSubmitted(true);
      showToast('Your Custom Order Request has been submitted!', 'success');
    }
    
    // Dispatch instant real booking event
    window.dispatchEvent(new CustomEvent('new_live_booking', { 
      detail: { 
        name: name || 'A Devotee', 
        state: stateName || 'India', 
        intent: intent === 'booking' ? 'booking' : 'prasadi', 
        time: 'Just now' 
      } 
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      
      {/* Live Booking Toast Notification */}
      <AnimatePresence>
        {showLiveBooking && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 120, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-[#F4E1D2] shadow-2xl rounded-[20px] p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C16200] to-[#E59210] flex items-center justify-center shrink-0 shadow-inner text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#500A18] leading-tight truncate">
                  {liveBookings[liveBookingIndex].name} 
                  <span className="text-gray-500 font-medium text-xs ml-1">from {liveBookings[liveBookingIndex].state}</span>
                </p>
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 
                  {liveBookings[liveBookingIndex].intent === 'booking' ? 'Confirmed Booking' : 'Requested Prasadi'}
                </p>
              </div>
              <div className="text-[10px] text-gray-500 font-bold whitespace-nowrap self-start mt-1 bg-gray-100 px-2 py-0.5 rounded-full">
                {liveBookings[liveBookingIndex].time}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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


      </div>

      <div className="w-full px-2 sm:px-4 md:px-8 relative z-10 -mt-6 sm:-mt-10">
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
              <div className="relative overflow-hidden rounded-t-[22px] -mx-4 sm:-mx-8 -mt-4 sm:-mt-8 mb-6 bg-gradient-to-br from-[#500A18] via-[#7A1323] to-[#4A0815] p-6 sm:p-8 flex flex-col items-center text-center shadow-inner">
                {/* Background Pattern / Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C16200]/50 via-transparent to-transparent opacity-90 mix-blend-screen" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-overlay" 
                  style={{ backgroundImage: `url(${slides?.[0]?.imageUrl || '/assets/babadham_hero_slide-1785849874982_desk.webp'})` }} 
                />
                
                {/* Book Now Blinking Badge */}
                <div className="relative z-10 flex items-center gap-2 bg-red-600/90 backdrop-blur-md border border-red-400/50 rounded-full px-4 py-1.5 mb-5 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" />
                  <div className="overflow-hidden relative h-5 sm:h-6 w-32 sm:w-40 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={blinkingTextIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-white text-xs sm:text-sm font-black tracking-widest uppercase drop-shadow-md absolute text-center w-full"
                      >
                        {blinkingTexts[blinkingTextIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                
                {/* Minimal Countdown Timer */}
                <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-10 mb-6 mt-2">
                  <div className="flex flex-col items-start">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-wide">
                      {lang === 'hi' ? 'श्रावण' : 'Shravan'}
                    </span>
                    <span className="text-base sm:text-lg text-white/90 leading-tight">
                      {lang === 'hi' ? 'समाप्त' : 'Ending'}
                    </span>
                  </div>
                  <div className="w-[1px] h-12 sm:h-14 bg-white/30 rounded-full" />
                  <div className="flex flex-col items-start">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-wide">
                      {timeLeft.days} {lang === 'hi' ? 'दिन' : 'Days'}
                    </span>
                    <span className="text-base sm:text-lg text-white/90 leading-tight flex items-end gap-1.5">
                      <span>{timeLeft.hours}{lang === 'hi' ? 'घंटे' : 'Hrs'}</span>
                      <span>{timeLeft.minutes}{lang === 'hi' ? 'मिनट' : 'm'}</span>
                      <span className="text-xs sm:text-sm text-[#F5B642] mb-0.5 animate-pulse tabular-nums font-bold">
                        {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </span>
                  </div>
                </div>
                
                {/* Booking Slots Bar */}
                <div className="relative z-10 w-full max-w-md mt-4 select-none">
                  <div className="w-full bg-gradient-to-r from-[#4A0812] via-[#6B0D1B] to-[#3B060E] rounded-xl p-3 sm:p-3.5 border border-red-900/60 shadow-lg">
                    <div className="flex items-center justify-between gap-2 mb-2 px-1">
                      <span className="text-xs sm:text-sm font-medium text-white/90 shrink-0">
                        {lang === 'hi' ? 'उपलब्ध स्लॉट:' : 'Available Slots:'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white tracking-wide text-center drop-shadow px-1">
                        {slotPeriodText || '1St Week'}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#F4A62A] shrink-0">
                        {liveTotalBookedSlots} / {totalSlotLimit}
                      </span>
                    </div>
                    <div className="w-full bg-black/50 h-2 sm:h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,166,42,0.8)]"
                        style={{ 
                          width: `${Math.min(100, Math.max(2, (Number(liveTotalBookedSlots) / Number(totalSlotLimit)) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-white/60 text-[10px] sm:text-xs mt-2.5 tracking-wide font-medium flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F5B642]" /> 
                    {lang === 'hi' ? 'स्लॉट बहुत तेजी से भर रहे हैं, जल्द बुक करें' : 'Slots are filling up fast, book soon'}
                  </p>
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
                  {/* Spinning Background */}
                  <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
                    {/* Create a scalloped/jagged edge effect using rotated squares */}
                    <div className="absolute inset-0 bg-[#6E1120] rotate-0 rounded-sm" />
                    <div className="absolute inset-0 bg-[#6E1120] rotate-[30deg] rounded-sm" />
                    <div className="absolute inset-0 bg-[#6E1120] rotate-[60deg] rounded-sm" />
                    <div className="absolute inset-0 bg-[#6E1120] rounded-full scale-[1.05]" />
                    
                    {/* Inner dashed circle */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-[#F5B642] opacity-80" />
                  </div>
                  
                  {/* Badge Content (Static) */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-[#F5B642] px-1">
                     <span className="text-[10px] font-black leading-tight text-center tracking-wide">
                       100% शुद्ध<br/>प्रामाणिक
                     </span>
                  </div>
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
                  {/* Language Selector */}
                  <div className="flex items-center gap-1 mb-6 ml-2 border-b-2 border-gray-400 pb-0.5 w-fit">
                    <button 
                      type="button"
                      onClick={() => setLang('hi')}
                      className={`text-[15px] ${lang === 'hi' ? 'font-bold text-black' : 'font-medium text-black hover:text-gray-700'}`}
                    >
                      Hindi
                    </button>
                    <span className="text-gray-400 font-medium mx-1">|</span>
                    <button 
                      type="button"
                      onClick={() => setLang('en')}
                      className={`text-[15px] ${lang === 'en' ? 'font-bold text-black' : 'font-medium text-black hover:text-gray-700'}`}
                    >
                      English
                    </button>
                  </div>

                  <div className="bg-[#FFF4F4] p-4 sm:p-5 rounded-[24px] border border-[#F2D6D6] shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#FDF1D9] to-[#F3E5C8] flex items-center justify-center shrink-0 shadow-inner">
                        <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-[#C16200]" />
                      </div>
                      <label className="flex-1 text-lg sm:text-xl font-extrabold text-[#500A18] block leading-tight">
                        {lang === 'hi' ? 'क्या आपने कभी बाबा धाम (देवघर) की यात्रा की है?' : 'Have you ever visited Baba Dham (Deoghar)?'} <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <hr className="my-4 border-[#E8E1D5]" />
                    <div className="flex flex-row gap-2 sm:gap-3 w-full">
                        <button type="button" onClick={() => setHasVisited('yes')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all ${hasVisited === 'yes' ? 'border-green-500 bg-green-100 text-green-800 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                          {hasVisited === 'yes' ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300" />} 
                          {lang === 'hi' ? 'हाँ, गया हूँ' : 'Yes, I have'}
                        </button>
                        <button type="button" onClick={() => setHasVisited('no')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all ${hasVisited === 'no' ? 'border-red-500 bg-red-100 text-red-800 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                          {hasVisited === 'no' ? <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" /> : <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300" />} 
                          {lang === 'hi' ? 'नहीं, कभी नहीं गया' : 'No, never visited'}
                        </button>
                      </div>
                  </div>



                  <div className="bg-[#F4F9F4] p-4 sm:p-5 rounded-[24px] border border-[#DCECDC] shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#FDF1D9] to-[#F3E5C8] flex items-center justify-center shrink-0 shadow-inner">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#C16200]" />
                      </div>
                      <label className="flex-1 text-lg sm:text-xl font-extrabold text-[#500A18] block leading-tight">
                        {lang === 'hi' ? 'आपका उद्देश्य क्या है?' : 'What is your intent?'} <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <hr className="my-4 border-[#E8E1D5]" />
                    <div className="flex flex-row gap-2 sm:gap-3 w-full">
                        <button type="button" onClick={() => setIntent('prasadi')} className={`flex-1 py-2 sm:py-3 rounded-xl border flex items-center justify-center text-center px-1 gap-1.5 font-bold text-[11px] sm:text-sm transition-all ${intent === 'prasadi' ? 'border-[#C16200] bg-[#FFF8F0] text-[#C16200] shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                          {intent === 'prasadi' ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C16200]" /> : <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300" />}
                          {lang === 'hi' ? 'केवल प्रसादी अनुरोध' : 'Prasadi Request Only'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIntent('booking');
                            triggerCelebration();
                          }} 
                          className={`relative flex-1 py-2.5 sm:py-3.5 rounded-xl border flex items-center justify-center text-center px-2 gap-1.5 font-extrabold text-xs sm:text-sm transition-all duration-300 ${
                            intent === 'booking' 
                              ? 'border-emerald-600 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]' 
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {/* Celebration Pop-up Banner & Particle Explosion */}
                          <AnimatePresence>
                            {showCelebration && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap"
                              >
                                <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white px-3.5 py-1.5 rounded-full font-black text-xs shadow-2xl border border-emerald-300 flex items-center gap-1.5 animate-bounce">
                                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                                  <span>🎉 {lang === 'hi' ? `बधाई हो! ${bookingDiscountPercent}% छूट मिली!` : `Congrats! You got ${bookingDiscountPercent}% OFF!`}</span>
                                </div>

                                {/* Particle Explosion */}
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                    animate={{
                                      opacity: 0,
                                      x: (Math.random() - 0.5) * 160,
                                      y: -40 - Math.random() * 60,
                                      scale: Math.random() * 0.8 + 0.5,
                                      rotate: Math.random() * 360
                                    }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute top-2 left-1/2 text-sm"
                                  >
                                    {['🎉', '✨', '🌟', '💫', '🎊', '⭐'][i % 6]}
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Floating Rounded Star Badge */}
                          {bookingDiscountPercent > 0 && (
                            <div className="absolute -top-3 right-2 sm:-top-4 sm:right-4 z-20 animate-bounce drop-shadow-md">
                              <div className="relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9">
                                <div className="absolute inset-0 bg-red-500 rotate-45 rounded-[4px] sm:rounded-[6px] animate-spin" style={{ animationDuration: '4s' }} />
                                <div className="absolute inset-0 bg-red-500 rounded-[4px] sm:rounded-[6px] animate-spin" style={{ animationDuration: '4s' }} />
                                <div className="relative text-white font-black text-[7px] sm:text-[8px] leading-tight text-center z-10 drop-shadow-sm">
                                  {bookingDiscountPercent}%<br/>OFF
                                </div>
                              </div>
                            </div>
                          )}
                          <span className="flex items-center gap-1.5 relative z-10">
                            {intent === 'booking' ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" /> : <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300 shrink-0" />}
                            {lang === 'hi' ? `बुकिंग की पुष्टि (₹${finalBookingAmount})` : 'Confirm Booking'}
                          </span>
                        </button>
                      </div>
                  </div>

                  <AnimatePresence>
                    {intent === 'booking' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="bg-[#FFF8F0] border border-[#F4E1D2] rounded-[16px] p-3 flex items-center justify-between shadow-sm overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FDF1D9] flex items-center justify-center shrink-0 border border-[#F3E5C8]">
                            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#C16200]" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-bold text-[#500A18] leading-tight">{lang === 'hi' ? 'प्री-बुकिंग शुल्क' : 'Pre-booking Charge'}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{lang === 'hi' ? 'बुकिंग कन्फर्म करने के लिए' : 'To confirm your booking'}</p>
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-[#500A18] text-right drop-shadow-sm">
                          {bookingDiscountPercent > 0 && (
                            <span className="line-through text-gray-400 text-xs sm:text-sm mr-1.5 font-medium">
                              ₹{bookingAmount}
                            </span>
                          )}
                          ₹{finalBookingAmount}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4">
                    {/* Live Devotee Trust Banner */}
                    {renderTrustBanner()}

                    <button
                      type="submit"
                      disabled={!intent}
                      className="w-full py-4 sm:py-5 rounded-[24px] bg-gradient-to-b from-[#7A1323] to-[#5A0D18] text-white font-bold text-lg hover:from-[#8B1528] hover:to-[#6E1120] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-2 relative z-10">
                        <span>{lang === 'hi' ? 'अगला' : 'Next Step'}</span>
                        <ChevronRight className="w-5 h-5 -mt-0.5" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-normal opacity-80 mt-0.5 tracking-wide relative z-10">
                        {lang === 'hi' ? 'अगले चरण पर जाएँ' : 'Proceed to next step'}
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
                  {/* Personal Details Block */}
                  <div className="bg-[#F4F9F4] p-4 sm:p-5 rounded-[24px] border border-[#DCECDC] shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#E5F2E5] to-[#DCECDC] flex items-center justify-center shrink-0 shadow-inner">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E7D32]" />
                      </div>
                      <h3 className="font-extrabold text-[#500A18] text-base sm:text-lg">
                        {lang === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                      <div className="relative group mt-2">
                        <User className="w-4 h-4 text-[#500A18]/60 group-focus-within:text-[#500A18] transition-colors absolute left-3.5 top-3.5 z-10" />
                        <input
                          type="text"
                          required
                          value={devoteeName}
                          onChange={e => setDevoteeName(e.target.value)}
                          className="peer w-full pl-10 pr-3 py-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-transparent focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                          placeholder={lang === 'hi' ? 'पूरा नाम *' : 'Devotee Name *'}
                        />
                        <label className={`absolute transition-all duration-200 pointer-events-none rounded-sm bg-white px-1
                          ${devoteeName ? '-top-2.5 left-3 text-[11px] font-bold text-[#500A18]' : 'top-3.5 left-10 text-sm text-[#2B1A16]/50 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-[#500A18]'}`}>
                          {lang === 'hi' ? 'पूरा नाम *' : 'Devotee Name *'}
                        </label>
                      </div>

                      <div className="relative group mt-2">
                        <Phone className="w-4 h-4 text-[#500A18]/60 group-focus-within:text-[#500A18] transition-colors absolute left-3.5 top-3.5 z-10" />
                        <input
                          type="tel"
                          required
                          value={whatsappNumber}
                          onChange={e => setWhatsappNumber(e.target.value)}
                          className="peer w-full pl-10 pr-3 py-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-transparent focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                          placeholder={lang === 'hi' ? 'व्हाट्सएप नंबर *' : 'WhatsApp Number *'}
                        />
                        <label className={`absolute transition-all duration-200 pointer-events-none rounded-sm bg-white px-1
                          ${whatsappNumber ? '-top-2.5 left-3 text-[11px] font-bold text-[#500A18]' : 'top-3.5 left-10 text-sm text-[#2B1A16]/50 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-[#500A18]'}`}>
                          {lang === 'hi' ? 'व्हाट्सएप नंबर *' : 'WhatsApp Number *'}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Block */}
                  <div className="bg-[#FFF4F4] p-4 sm:p-5 rounded-[24px] border border-[#F2D6D6] shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FDF1D9] to-[#F3E5C8] flex items-center justify-center shrink-0 shadow-inner">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C16200]" />
                      </div>
                      <h3 className="font-extrabold text-[#500A18] text-base sm:text-lg">
                        {lang === 'hi' ? 'वितरण का पता' : 'Delivery Address'}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2 mb-5">
                      <div className="relative group mt-2">
                        <MapPin className="w-4 h-4 text-[#500A18]/60 group-focus-within:text-[#500A18] transition-colors absolute left-3.5 top-3.5 z-10" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                          onClick={() => {
                            if (!hasAskedLocation && !pincode) {
                              setShowLocationPopup(true);
                              setHasAskedLocation(true);
                            }
                          }}
                          className="peer w-full pl-10 pr-3 py-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-transparent focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                          placeholder={lang === 'hi' ? 'पिनकोड *' : 'Pincode *'}
                        />
                        <label className={`absolute transition-all duration-200 pointer-events-none rounded-sm bg-white px-1
                          ${pincode ? '-top-2.5 left-3 text-[11px] font-bold text-[#500A18]' : 'top-3.5 left-10 text-sm text-[#2B1A16]/50 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-[#500A18]'}`}>
                          {lang === 'hi' ? 'पिनकोड *' : 'Pincode *'}
                        </label>
                        {isFetchingPin && <Loader2 className="w-4 h-4 text-[#500A18] absolute right-3.5 top-3.5 animate-spin" />}
                      </div>
                      
                      <div className="relative group mt-2">
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          className="peer w-full px-3 py-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-transparent focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                          placeholder={lang === 'hi' ? 'शहर / ज़िला' : 'City / District'}
                        />
                        <label className={`absolute transition-all duration-200 pointer-events-none rounded-sm bg-white px-1
                          ${city ? '-top-2.5 left-3 text-[11px] font-bold text-[#500A18]' : 'top-3.5 left-3 text-sm text-[#2B1A16]/50 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-[#500A18]'}`}>
                          {lang === 'hi' ? 'शहर / ज़िला' : 'City / District'}
                        </label>
                      </div>

                      <div className="relative group mt-2">
                        <input
                          type="text"
                          value={stateName}
                          onChange={e => setStateName(e.target.value)}
                          className="peer w-full px-3 py-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-transparent focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all shadow-none"
                          placeholder={lang === 'hi' ? 'राज्य' : 'State'}
                        />
                        <label className={`absolute transition-all duration-200 pointer-events-none rounded-sm bg-white px-1
                          ${stateName ? '-top-2.5 left-3 text-[11px] font-bold text-[#500A18]' : 'top-3.5 left-3 text-sm text-[#2B1A16]/50 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-[#500A18]'}`}>
                          {lang === 'hi' ? 'राज्य' : 'State'}
                        </label>
                      </div>
                    </div>

                    <div className="relative group mt-2">
                      <textarea
                        rows={3}
                        required
                        value={streetAddress}
                        onChange={e => setStreetAddress(e.target.value)}
                        className="peer w-full p-3 rounded-xl bg-white border-2 border-[#500A18]/20 text-[#2B1A16] placeholder-transparent focus:outline-none focus:border-[#500A18] hover:border-[#500A18]/50 transition-all leading-relaxed shadow-none"
                        placeholder={lang === 'hi' ? 'सड़क का पता / लैंडमार्क *' : 'Street Address / Landmark *'}
                      />
                      <label className={`absolute transition-all duration-200 pointer-events-none rounded-sm bg-white px-1
                        ${streetAddress ? '-top-2.5 left-3 text-[11px] font-bold text-[#500A18]' : 'top-3.5 left-3 text-sm text-[#2B1A16]/50 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-[#500A18]'}`}>
                        {lang === 'hi' ? 'सड़क का पता / लैंडमार्क *' : 'Street Address / Landmark *'}
                      </label>
                    </div>
                  </div>

                  {/* Special Message Box (Moved to Step 2) */}
                  <div className="bg-[#FCF1ED] p-4 sm:p-5 rounded-[24px] border border-[#F6DFD7] shadow-sm mt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FDF1D9] flex items-center justify-center shrink-0 shadow-inner">
                        <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-[#500A18]" />
                      </div>
                      <label className="text-base sm:text-lg font-extrabold text-[#500A18] block">
                        {lang === 'hi' ? 'विशेष अनुरोध (वैकल्पिक)' : 'Special Request (Optional)'}
                      </label>
                    </div>
                    
                    <div className="border-t border-[#F6DFD7] pt-4">
                      <textarea
                        rows={3}
                        value={specialRequest}
                        onChange={e => setSpecialRequest(e.target.value)}
                        placeholder={lang === 'hi' ? 'अगर आपका कोई विशेष अनुरोध है तो यहाँ लिखें...' : 'Write any special requests...'}
                        className="w-full bg-white border border-[#F6DFD7] focus:border-[#500A18]/50 focus:ring-2 focus:ring-[#500A18]/10 text-sm sm:text-base text-[#2B1A16] placeholder-[#500A18]/40 focus:outline-none px-4 py-3.5 rounded-xl transition-all shadow-sm resize-y min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#500A18]/10">
                    {/* Live Devotee Trust Banner */}
                    {renderTrustBanner()}

                    <div className="flex items-center justify-between gap-4 mt-2">
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
                        <Sparkles className="w-4 h-4" /> 
                        {intent === 'booking' 
                          ? (lang === 'hi' ? `अभी भुगतान करें (₹${finalBookingAmount})` : `Pay Now (₹${finalBookingAmount})`)
                          : (lang === 'hi' ? 'अनुरोध भेजें' : 'Submit Order Request')}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>

      <AnimatePresence>
        {showLocationPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C16200] to-[#E59400]" />
              <div className="w-16 h-16 bg-[#FDF1D9] rounded-full mx-auto flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#C16200]" />
              </div>
              <h2 className="text-xl font-extrabold text-[#500A18] mb-2">
                {lang === 'hi' ? 'स्वतः पता भरें?' : 'Auto-fill Address?'}
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                {lang === 'hi' 
                  ? 'अपना पूरा पता, लैंडमार्क और पिनकोड तुरंत भरने के लिए अपने वर्तमान स्थान का उपयोग करें।' 
                  : 'Use your current location to instantly fill your complete address, landmark, and pincode.'}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowLocationPopup(false);
                    handleDetectLocation();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#500A18] to-[#7A1126] text-white font-bold hover:shadow-lg transition-all active:scale-95"
                >
                  {lang === 'hi' ? 'हाँ, अनुमति दें' : 'Yes, Allow Location'}
                </button>
                <button
                  onClick={() => setShowLocationPopup(false)}
                  className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  {lang === 'hi' ? 'नहीं, मैं टाइप करूँगा' : 'No, I will type'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
