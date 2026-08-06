import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  HelpCircle, 
  Phone, 
  X, 
  Home,
  Package,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';

const Hanging3DBell: React.FC = () => {
  const { playTempleBell } = useAudio();
  const { brandSettings } = useStore();
  const [isRinging, setIsRinging] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const triggerRing = () => {
    try {
      const customUrl = brandSettings?.orderRequestMediaConfig?.bellAudioUrl || (brandSettings as any)?.bellAudioUrl;
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
    setIsRinging(true);
    setShowRipple(true);
    setTimeout(() => setIsRinging(false), 1500);
    setTimeout(() => setShowRipple(false), 1100);
  };

  // Auto-ring on initial landing page load
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerRing();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchRing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerRing();
  };

  return (
    <div 
      className="absolute left-3 sm:left-12 md:left-16 top-0 z-[60] flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
      onClick={handleTouchRing}
      onTouchStart={handleTouchRing}
      title="Touch to Ring Sacred Temple Bell"
    >
      {/* Long Hanging Brass Chain (Hangs further down over lower Navigation Header Bar) */}
      <div className="w-[3.5px] h-14 sm:h-20 md:h-24 bg-gradient-to-b from-[#F4A62A] via-[#B87A18] to-[#F4A62A] shadow-xl border-x border-[#3E1A04]" />
      
      {/* Ornate Gold Connector Ring */}
      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FFE8A3] bg-[#7A1126] -mt-1 shadow-md flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#F4A62A]" />
      </div>

      {/* 3D Motion Swinging Bell */}
      <motion.div
        animate={isRinging ? {
          rotateZ: [0, -32, 28, -20, 14, -7, 0],
          rotateY: [0, 40, -35, 20, 0],
          scale: [1, 1.25, 0.92, 1.1, 1]
        } : {
          rotateZ: [0, 3.5, 0, -3.5, 0]
        }}
        transition={isRinging ? { duration: 1.5, ease: "easeOut" } : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center origin-top cursor-pointer"
        whileHover={{ scale: 1.16, rotateZ: 10 }}
      >
        {/* Divine Golden Light Ring Waves on Ringing */}
        <AnimatePresence>
          {showRipple && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full border-2 border-[#F4A62A] bg-[#F4A62A]/35 pointer-events-none shadow-[0_0_35px_#F4A62A]"
            />
          )}
        </AnimatePresence>

        {/* Brand New 3D Ornate Sacred Temple Bell SVG */}
        <svg 
          viewBox="0 0 120 140" 
          className="w-11 h-14 sm:w-14 sm:h-18 md:w-16 md:h-21 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter"
        >
          <defs>
            {/* Rich Metallic Dual-Tone Gold & Copper Gradients */}
            <linearGradient id="bellGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="20%" stopColor="#F4A62A" />
              <stop offset="45%" stopColor="#E2931D" />
              <stop offset="70%" stopColor="#B36B00" />
              <stop offset="100%" stopColor="#4A2600" />
            </linearGradient>

            <linearGradient id="bellCopper3D" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5A962" />
              <stop offset="50%" stopColor="#D96B27" />
              <stop offset="100%" stopColor="#7F2F00" />
            </linearGradient>

            <linearGradient id="bellHighlight3D" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </linearGradient>
          </defs>

          {/* Trishul / Sacred Crown Finial */}
          <path d="M60,2 L60,18 M53,8 Q60,1 67,8 M50,14 L70,14" fill="none" stroke="url(#bellGold3D)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Top Hanging Ring */}
          <circle cx="60" cy="20" r="7" fill="none" stroke="url(#bellGold3D)" strokeWidth="2.5" />

          {/* Dome Top Cap */}
          <path d="M38,28 Q60,16 82,28 L76,46 Q60,38 44,46 Z" fill="url(#bellCopper3D)" stroke="#3E1A04" strokeWidth="1.5" />

          {/* Main Bell Body 3D Flare */}
          <path d="M44,46 Q60,40 76,46 L84,94 Q104,112 110,118 Q60,132 10,118 Q16,112 36,94 Z" fill="url(#bellGold3D)" stroke="#3E1A04" strokeWidth="2" />
          
          {/* Metallic 3D Gloss Highlight Overlay */}
          <path d="M52,44 Q60,42 68,44 L74,96 Q88,110 92,116 Q60,124 28,116 Q32,110 46,96 Z" fill="url(#bellHighlight3D)" opacity="0.45" />

          {/* Sacred Lotus Petals Relief */}
          <path d="M40,65 Q60,55 80,65" fill="none" stroke="#7F2F00" strokeWidth="2.5" />
          <path d="M30,85 Q60,74 90,85" fill="none" stroke="#FFF2B2" strokeWidth="2" />

          {/* Sacred Om Symbol Relief Emblem */}
          <circle cx="60" cy="76" r="13" fill="#500A18" stroke="url(#bellGold3D)" strokeWidth="1.5" />
          <text x="60" y="82" textAnchor="middle" fill="#F4A62A" fontSize="16" fontWeight="extrabold" fontFamily="serif">ॐ</text>

          {/* Bottom Heavy Flared Lip Ring */}
          <ellipse cx="60" cy="118" rx="50" ry="12" fill="url(#bellGold3D)" stroke="#3E1A04" strokeWidth="2.5" />

          {/* Inner Mouth Shadow */}
          <ellipse cx="60" cy="119" rx="44" ry="8" fill="#1A0B0E" />

          {/* Golden Swinging Clapper */}
          <motion.circle 
            cx="60" 
            cy="128" 
            r="8" 
            fill="url(#bellGold3D)" 
            stroke="#3E1A04" 
            strokeWidth="2"
            animate={isRinging ? { cx: [60, 42, 78, 46, 74, 60] } : { cx: 60 }}
            transition={{ duration: 1.5 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    selectedCategory,
    setSelectedCategory,
    brandSettings,
    activePage,
    setActivePage
  } = useStore();

  const { playTempleBell } = useAudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOrderCount, setShowOrderCount] = useState(false);
  const [showBadgeNumberOnly, setShowBadgeNumberOnly] = useState(true);

  useEffect(() => {
    const badgeInterval = setInterval(() => {
      setShowBadgeNumberOnly(prev => !prev);
    }, 2400);
    return () => clearInterval(badgeInterval);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      const interval = setInterval(() => {
        setShowOrderCount(prev => !prev);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`w-full font-sans select-none overflow-visible ${
        activePage === 'order-request' ? 'sticky top-0 z-[999] backdrop-blur-md shadow-2xl' : 'relative z-40'
      }`}>
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#500A18] text-[#FFF8F0] text-[10px] sm:text-xs py-[1px] sm:py-0.5 px-2.5 sm:px-6 border-b border-[#F4A62A]/30 leading-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 overflow-hidden text-[11px] sm:text-xs">
            <span className="truncate text-[#FFF8F0]/90 font-medium">
              {brandSettings?.topBarSacredText || 'ॐ हर हर महादेव ॐ - Direct Deoghar Temple Mahaprasad'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[9.5px] sm:text-xs font-semibold">
            <button
              onClick={() => {
                const text = encodeURIComponent('Jai Bhole! Need help regarding Baba Baidyanath Prasad.');
                window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
              }}
              className="flex items-center gap-0.5 text-[#F4A62A] hover:text-white transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{brandSettings?.needHelpText || 'Need Help?'}</span>
            </button>

            <a
              href={`tel:${brandSettings?.helplineNumber || '+91 98765 43210'}`}
              className="flex items-center gap-0.5 text-[#FFF8F0] hover:text-[#F4A62A] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F4A62A]" />
              <span>{brandSettings?.helplineNumber || '+91 98765 43210'}</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. UPPER LOGO HEADER SECTION */}
      <div 
        className="w-full bg-gradient-to-r from-[#500A18] via-[#7A1126] to-[#500A18] py-1.5 sm:py-2 border-b border-[#F4A62A]/30 flex items-center justify-center shadow-md bg-cover bg-center overflow-visible relative z-30"
      >
        {/* Custom Header Background Image Layers */}
        {brandSettings?.headerBgImageUrl && (
          <div 
            className={`absolute inset-0 bg-cover bg-center ${brandSettings?.mobileHeaderBgImageUrl ? 'hidden sm:block' : 'block'} pointer-events-none`}
            style={{ backgroundImage: `url(${brandSettings.headerBgImageUrl})` }}
          />
        )}
        {brandSettings?.mobileHeaderBgImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center block sm:hidden pointer-events-none"
            style={{ backgroundImage: `url(${brandSettings.mobileHeaderBgImageUrl})` }}
          />
        )}

        <a href="#" className="flex items-center justify-center group relative z-10" aria-label="Company Logo Home">
          <img 
            src={brandSettings?.logoImageUrl || (typeof window !== 'undefined' ? localStorage.getItem('babadham_logo_image') : '') || '/assets/logo.svg'} 
            alt={brandSettings?.brandName || "Company Logo"} 
            className="max-h-13 sm:max-h-17 max-w-[260px] sm:max-w-[340px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl" 
          />
        </a>

        {/* 3D Interactive Hanging Temple Bell (Shown Only on Order Request Page) */}
        {activePage === 'order-request' && <Hanging3DBell />}
      </div>
      </header>

      {/* 3. LOWER HEADER NAVIGATION BAR (Sticky on Main Homepage & Store Pages) */}
      {activePage !== 'order-request' && (
        <nav className={`w-full font-sans transition-all duration-300 sticky top-0 z-[999] ${
          isScrolled 
            ? 'bg-[#FFF8F0]/95 backdrop-blur-md shadow-xl border-b border-[#F4A62A]/30 py-2' 
            : 'bg-[#FFF8F0] border-b border-[#7A1126]/10 py-2.5 sm:py-3'
        }`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between lg:justify-center relative">
            
            {/* Mobile Hamburger Toggle & Scrolled Mobile Company Logo */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="shrink-0 bg-transparent border-none focus:outline-none p-1 flex flex-col items-start justify-center gap-1.5 transition-all duration-300 active:scale-95 group cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <span className="w-5.5 h-[2.5px] bg-[#7A1126] group-hover:bg-[#F4A62A] rounded-full transition-all duration-300 group-hover:w-6" />
                <span className="w-3.5 h-[2.5px] bg-[#F4A62A] group-hover:bg-[#7A1126] rounded-full transition-all duration-300 group-hover:w-5" />
                <span className="w-4.5 h-[2.5px] bg-[#7A1126] group-hover:bg-[#F4A62A] rounded-full transition-all duration-300 group-hover:w-6" />
              </button>

              {/* Mobile Company Logo (Shown on scroll at the right side of Hamburger Icon) */}
              {isScrolled && (
                <div 
                  onClick={() => { setSelectedCategory('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-1.5 cursor-pointer shrink-0 transition-all duration-300"
                >
                  {brandSettings?.logoImageUrl ? (
                    <img 
                      src={brandSettings.logoImageUrl} 
                      alt={brandSettings.brandName || "Company Logo"} 
                      className="h-9 sm:h-10 w-auto object-contain max-w-[150px] sm:max-w-[170px] drop-shadow-sm"
                    />
                  ) : (
                    <span className="font-serif-temple font-extrabold text-sm sm:text-base text-[#7A1126] truncate max-w-[150px]">
                      {brandSettings?.brandName || 'BAIDYANATH'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Unified Group: Navigation Links + User Account + Cart Icons Side-by-Side */}
            <div className="flex items-center gap-4 sm:gap-7">
              
              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#2B1A16]">
                {/* 1. Home */}
                <button
                  onClick={() => { setSelectedCategory('all'); setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`py-1 relative transition-colors ${
                    selectedCategory === 'all' && activePage === 'home'
                      ? 'text-[#7A1126] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#7A1126]' 
                      : 'hover:text-[#7A1126]'
                  }`}
                >
                  Home
                </button>

                {/* 2. Prasadam with Premium Shining Badge */}
                <button
                  onClick={() => { setSelectedCategory('prasad'); playTempleBell(); }}
                  className={`py-1 inline-flex items-center gap-1.5 transition-colors group cursor-pointer ${
                    selectedCategory === 'prasad' ? 'text-[#7A1126] font-bold' : 'hover:text-[#7A1126]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">Prasadam</span>

                  <div className="relative overflow-hidden px-2 py-0.5 text-[9px] font-black text-[#2B1A16] bg-gradient-to-r from-[#F4A62A] via-[#FFF1B8] to-[#F4A62A] rounded-full border border-[#F4A62A]/60 flex items-center justify-center uppercase tracking-wider scale-95 group-hover:scale-105 transition-transform duration-300">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shine pointer-events-none" />
                    <div className="relative z-10 h-3 w-12 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        {showBadgeNumberOnly ? (
                          <motion.span
                            key="number"
                            initial={{ opacity: 0, scale: 0.75, filter: 'blur(2px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.25, filter: 'blur(2px)' }}
                            transition={{ duration: 0.25 }}
                            className="absolute font-black tracking-wider text-[#2B1A16]"
                          >
                            {brandSettings?.todayTotalBookingsCount || '1,420+'}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="text"
                            initial={{ opacity: 0, scale: 0.75, filter: 'blur(2px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.25, filter: 'blur(2px)' }}
                            transition={{ duration: 0.25 }}
                            className="absolute font-black tracking-widest text-[#7A1126] uppercase"
                          >
                            BOOKED
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>

                {/* 3. Products */}
                <button
                  onClick={() => { setSelectedCategory('all'); setActivePage('home'); playTempleBell(); }}
                  className={`py-1 transition-colors ${
                    selectedCategory === 'all' && activePage === 'home' ? 'text-[#7A1126] font-bold' : 'hover:text-[#7A1126]'
                  }`}
                >
                  Products
                </button>

                {/* 4. Gallery */}
                <button 
                  onClick={() => {
                    const el = document.getElementById('testimonials-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1 hover:text-[#7A1126] transition-colors"
                >
                  Devotees
                </button>

                {/* 5. About Us */}
                <button 
                  onClick={() => {
                    const el = document.getElementById('why-choose-us');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1 hover:text-[#7A1126] transition-colors"
                >
                  Sanctity
                </button>

                {/* 6. Contact Us */}
                <button 
                  onClick={() => {
                    const el = document.getElementById('footer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1 hover:text-[#7A1126] transition-colors"
                >
                  Help
                </button>
              </div>

              {/* Shopping Cart Icon */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#7A1126] hover:text-[#F4A62A] transition-colors group cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#7A1126] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FFF8F0] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </nav>
      )}

      {/* ULTRA-CLEAN PREMIUM MOBILE NAVIGATION SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[999999] flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#1A0B0E]/60 backdrop-blur-sm"
            />
            
            {/* Sidebar (70% width) */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative w-[70%] max-w-[320px] h-[100dvh] bg-[#FFF8F0] text-[#2B1A16] flex flex-col overflow-hidden shadow-2xl z-10"
            >
            {/* Sidebar Header with Centered Logo, Brand Name & Tagline */}
            <div className="p-4 bg-gradient-to-b from-[#500A18] to-[#7A1126] text-[#FFF8F0] relative flex flex-col items-center justify-center border-b-[3px] border-[#F4A62A] shrink-0 pb-6">
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full text-white hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#FFF8F0] text-[#F4A62A] flex items-center justify-center mb-2 overflow-hidden shadow-xl border-2 border-[#F4A62A]">
                {brandSettings?.logoImageUrl ? (
                  <img src={brandSettings.logoImageUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold">{brandSettings?.logoIcon || 'ॐ'}</span>
                )}
              </div>

              <div className="text-center mt-1">
                <h3 className="font-serif-temple font-extrabold text-lg text-[#F4A62A] tracking-wider leading-tight drop-shadow-md">
                  {brandSettings?.brandName || 'BABA Baidyanath'}
                </h3>
                <p className="text-[10px] text-[#FFF8F0]/90 font-medium tracking-widest lowercase uppercase mt-0.5">
                  {brandSettings?.tagline || 'aastha | seva | samarpan'}
                </p>
              </div>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
              <button
                onClick={() => { setSelectedCategory('all'); setActivePage('home'); setMobileMenuOpen(false); }}
                className="group w-full py-3 px-3.5 flex items-center text-left text-[#2B1A16] hover:text-[#7A1126] transition-all rounded-xl hover:bg-[#7A1126]/5 active:bg-[#7A1126]/10"
              >
                <div className="w-8 h-8 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center group-hover:bg-[#7A1126] group-hover:text-white transition-all shadow-xs shrink-0">
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-[1px] h-4 bg-[#7A1126]/30 mx-3 rounded-full shrink-0" />
                <span className="text-[13px] font-medium tracking-wide group-hover:translate-x-1 transition-transform">Home</span>
              </button>


              
              <button
                onClick={() => { setSelectedCategory('prasad'); setMobileMenuOpen(false); playTempleBell(); }}
                className="group w-full py-3 px-3.5 flex items-center justify-between text-left text-[#2B1A16] hover:text-[#7A1126] transition-all rounded-xl hover:bg-[#7A1126]/5 active:bg-[#7A1126]/10"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center group-hover:bg-[#7A1126] group-hover:text-white transition-all shadow-xs shrink-0">
                    <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="w-[1px] h-4 bg-[#7A1126]/30 mx-3 rounded-full shrink-0" />
                  <span className="text-[13px] font-medium tracking-wide group-hover:translate-x-1 transition-transform">Prasadam</span>
                </div>

                {/* Ultra-Premium Iconless Shining Badge with Blink Transition */}
                <div className="relative overflow-hidden px-2 py-0.5 text-[9px] font-black text-[#2B1A16] bg-gradient-to-r from-[#F4A62A] via-[#FFF1B8] to-[#F4A62A] rounded-full border border-[#F4A62A]/60 flex items-center justify-center uppercase tracking-wider">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shine pointer-events-none" />

                  <div className="relative z-10 h-3 w-12 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      {showBadgeNumberOnly ? (
                        <motion.span
                          key="number"
                          initial={{ opacity: 0, scale: 0.75, filter: 'blur(2px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 1.25, filter: 'blur(2px)' }}
                          transition={{ duration: 0.25 }}
                          className="absolute font-black tracking-wider text-[#2B1A16]"
                        >
                          {brandSettings?.todayTotalBookingsCount || '1,420+'}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, scale: 0.75, filter: 'blur(2px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 1.25, filter: 'blur(2px)' }}
                          transition={{ duration: 0.25 }}
                          className="absolute font-black tracking-widest text-[#7A1126] uppercase"
                        >
                          BOOKED
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => { setSelectedCategory('all'); setActivePage('home'); setMobileMenuOpen(false); playTempleBell(); }}
                className="group w-full py-3 px-3.5 flex items-center text-left text-[#2B1A16] hover:text-[#7A1126] transition-all rounded-xl hover:bg-[#7A1126]/5 active:bg-[#7A1126]/10"
              >
                <div className="w-8 h-8 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center group-hover:bg-[#7A1126] group-hover:text-white transition-all shadow-xs shrink-0">
                  <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-[1px] h-4 bg-[#7A1126]/30 mx-3 rounded-full shrink-0" />
                <span className="text-[13px] font-medium tracking-wide group-hover:translate-x-1 transition-transform">Products</span>
              </button>
              
              <a
                href="#featured-products"
                onClick={() => setMobileMenuOpen(false)}
                className="group w-full py-3 px-3.5 flex items-center text-left text-[#2B1A16] hover:text-[#7A1126] transition-all rounded-xl hover:bg-[#7A1126]/5 active:bg-[#7A1126]/10"
              >
                <div className="w-8 h-8 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center group-hover:bg-[#7A1126] group-hover:text-white transition-all shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-[1px] h-4 bg-[#7A1126]/30 mx-3 rounded-full shrink-0" />
                <span className="text-[13px] font-medium tracking-wide group-hover:translate-x-1 transition-transform">Gallery</span>
              </a>
              
              <a
                href="#categories-section"
                onClick={() => setMobileMenuOpen(false)}
                className="group w-full py-3 px-3.5 flex items-center text-left text-[#2B1A16] hover:text-[#7A1126] transition-all rounded-xl hover:bg-[#7A1126]/5 active:bg-[#7A1126]/10"
              >
                <div className="w-8 h-8 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center group-hover:bg-[#7A1126] group-hover:text-white transition-all shadow-xs shrink-0">
                  <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-[1px] h-4 bg-[#7A1126]/30 mx-3 rounded-full shrink-0" />
                <span className="text-[13px] font-medium tracking-wide group-hover:translate-x-1 transition-transform">About Us</span>
              </a>
              
              <a
                href="#footer-section"
                onClick={() => setMobileMenuOpen(false)}
                className="group w-full py-3 px-3.5 flex items-center text-left text-[#2B1A16] hover:text-[#7A1126] transition-all rounded-xl hover:bg-[#7A1126]/5 active:bg-[#7A1126]/10"
              >
                <div className="w-8 h-8 rounded-full bg-[#7A1126]/10 text-[#7A1126] flex items-center justify-center group-hover:bg-[#7A1126] group-hover:text-white transition-all shadow-xs shrink-0">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-[1px] h-4 bg-[#7A1126]/30 mx-3 rounded-full shrink-0" />
                <span className="text-[13px] font-medium tracking-wide group-hover:translate-x-1 transition-transform">Contact Us</span>
              </a>

              {/* Direct Order WhatsApp Button */}
              <div className="pt-2 pb-1">
                <a 
                  href={`https://wa.me/${brandSettings?.whatsappNumber?.replace(/[^0-9]/g, '') || '919508585440'}?text=${encodeURIComponent('Om Namah Shivay! I would like to place a direct order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    const newCount = directOrderClicks + 1;
                    setDirectOrderClicks(newCount);
                    localStorage.setItem('directOrderClicks', newCount.toString());
                  }}
                  className="relative overflow-hidden w-full py-3 rounded-md bg-[#7A1126] text-[#FFF8F0] flex items-center justify-center gap-2 ring-inset ring-[3px] ring-white/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                  {/* Shining Animation */}
                  <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
                  
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current z-10 relative">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  
                  <div className="relative z-10 overflow-hidden h-5 w-[140px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {showOrderCount ? (
                        <motion.span
                          key="count"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.2 }}
                          className="absolute text-[13px] font-bold tracking-wide flex gap-1 items-center"
                        >
                          <span className="text-[#F4A62A]">{directOrderClicks.toLocaleString()}+</span> Purchased
                        </motion.span>
                      ) : (
                        <motion.span
                          key="order"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.2 }}
                          className="absolute text-[14px] font-bold tracking-wide"
                        >
                          Order Now
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center border-t-2 border-[#7A1126]/10 text-[10px] font-bold text-[#2B1A16]/50 bg-[#FFF8F0] shrink-0 uppercase tracking-widest">
              © {new Date().getFullYear()} {brandSettings?.brandName || 'BABA BAIDYANATH'}
            </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
};
