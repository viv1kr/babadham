import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import type { HeroBannerItem } from '../../types/ecommerce';
import { db } from '../../db/mysqlSim';

export const HeroSection: React.FC = () => {
  const { brandSettings } = useStore();
  const [banners, setBanners] = useState<HeroBannerItem[]>(() => {
    return db.getHeroBanners();
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync banners with Database & StoreContext
  useEffect(() => {
    const refreshBanners = () => {
      const active = db.getHeroBanners();
      if (active && Array.isArray(active)) {
        setBanners(active);
      } else if (brandSettings?.heroBanners && Array.isArray(brandSettings.heroBanners)) {
        setBanners(brandSettings.heroBanners);
      } else {
        setBanners([]);
      }
    };

    refreshBanners();

    window.addEventListener('bbp_db_updated', refreshBanners);
    window.addEventListener('storage', refreshBanners);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('bbp_brand_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'HERO_BANNERS_UPDATED' || event.data?.type === 'BRAND_SETTINGS_UPDATED') {
          refreshBanners();
        }
      };
    } catch (e) {}

    const handleMsg = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_BRANDING_CROSS_ORIGIN' || event.data?.type === 'HERO_BANNERS_UPDATED') {
        refreshBanners();
      }
    };
    window.addEventListener('message', handleMsg);

    return () => {
      window.removeEventListener('bbp_db_updated', refreshBanners);
      window.removeEventListener('storage', refreshBanners);
      window.removeEventListener('message', handleMsg);
      if (channel) channel.close();
    };
  }, [brandSettings]);

  // Auto slide timer
  useEffect(() => {
    if (banners.length <= 1 || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length, isPlaying]);

  // When all banners are deleted by user, return null (render NOTHING)
  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex] || banners[0];
  if (!currentBanner) return null;

  const hasDesktop = Boolean(currentBanner.desktopUrl && currentBanner.desktopUrl.trim() !== '');
  const hasMobile = Boolean(currentBanner.mobileUrl && currentBanner.mobileUrl.trim() !== '');

  // If banner has neither desktop nor mobile media uploaded, render nothing
  if (!hasDesktop && !hasMobile) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative w-full h-[40vh] min-h-[280px] sm:h-[50vh] sm:min-h-[380px] max-h-[550px] bg-black overflow-hidden select-none">
      
      {/* Dynamic Animated Media Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Desktop Media - Strictly rendered ONLY on Desktop screens (sm:block = min-width 640px) */}
          {hasDesktop && (
            <div className="w-full h-full hidden sm:block">
              {currentBanner.mediaType === 'video' ? (
                <video
                  key={`desk-vid-${currentBanner.id}-${currentBanner.desktopUrl}`}
                  src={currentBanner.desktopUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  key={`desk-img-${currentBanner.id}-${currentBanner.desktopUrl}`}
                  src={currentBanner.desktopUrl}
                  alt={currentBanner.title || 'Desktop Hero Banner'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Mobile Media - Strictly rendered ONLY on Mobile screens (block sm:hidden = max-width 639px) */}
          {hasMobile ? (
            <div className="w-full h-full block sm:hidden">
              {currentBanner.mediaType === 'video' ? (
                <video
                  key={`mob-vid-${currentBanner.id}-${currentBanner.mobileUrl}`}
                  src={currentBanner.mobileUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  key={`mob-img-${currentBanner.id}-${currentBanner.mobileUrl}`}
                  src={currentBanner.mobileUrl}
                  alt={currentBanner.title || 'Mobile Hero Banner'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            /* Fallback to desktop media on mobile ONLY if no separate mobile media was uploaded */
            hasDesktop && (
              <div className="w-full h-full block sm:hidden">
                {currentBanner.mediaType === 'video' ? (
                  <video
                    key={`mob-fallback-vid-${currentBanner.id}-${currentBanner.desktopUrl}`}
                    src={currentBanner.desktopUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    key={`mob-fallback-img-${currentBanner.id}-${currentBanner.desktopUrl}`}
                    src={currentBanner.desktopUrl}
                    alt={currentBanner.title || 'Mobile Hero Banner'}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dot Pagination — bottom center */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              role="button"
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                display: 'inline-block',
                borderRadius: '50%',
                width: idx === currentIndex ? '10px' : '7px',
                height: idx === currentIndex ? '10px' : '7px',
                backgroundColor: idx === currentIndex ? '#F4A62A' : 'rgba(255,255,255,0.5)',
                boxShadow: idx === currentIndex ? '0 0 6px 2px rgba(244,166,42,0.5)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Play / Pause — bottom right corner (Premium Glassmorphic Golden Pill/Circle) */}
      {banners.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '20px',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            maxWidth: '44px',
            maxHeight: '44px',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            backgroundColor: 'rgba(18, 5, 8, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(244, 166, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
            padding: 0,
            margin: 0,
            outline: 'none',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(244, 166, 42, 0.15)',
            boxSizing: 'border-box'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(122, 17, 38, 0.9)';
            e.currentTarget.style.borderColor = '#F4A62A';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(18, 5, 8, 0.75)';
            e.currentTarget.style.borderColor = 'rgba(244, 166, 42, 0.5)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-[#F4A62A]" fill="#F4A62A" />
          ) : (
            <Play className="w-5 h-5 text-[#F4A62A] ml-0.5" fill="#F4A62A" />
          )}
        </button>
      )}
    </section>
  );
};

export default HeroSection;
