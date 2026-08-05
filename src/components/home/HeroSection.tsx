import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';
import type { HeroSlide } from '../../types/ecommerce';

export const HeroSection: React.FC = () => {
  const { brandSettings, openPreBooking } = useStore();
  const { playTempleBell } = useAudio();

  const slides: HeroSlide[] = brandSettings?.heroSlides || [
    {
      id: 'default-1',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1600&q=80',
      mobileMediaUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80',
      enableGradient: true,
      heading: 'Authentic Deoghar Baidyanath Temple Prasad',
      description: 'Delivered directly to your doorstep from Baba Baidyanath Dham, Deoghar.',
      buttonText: 'Explore Sacred Offerings',
      buttonLink: '#featured-products'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto slide interval
  useEffect(() => {
    if (slides.length <= 1 || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];
  const hasTextContent = Boolean(currentSlide.heading?.trim() || currentSlide.description?.trim() || currentSlide.buttonText?.trim());

  return (
    <section className="relative w-full h-[40vh] min-h-[280px] sm:h-[50vh] sm:min-h-[380px] max-h-[550px] bg-black overflow-hidden select-none">

      {/* Responsive Slide Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Render Mobile Media for Mobile View & Desktop Media for Desktop View */}
          {currentSlide.type === 'video' ? (
            <>
              {/* Mobile Video Banner */}
              <video
                src={(currentSlide.mobileMediaUrl && currentSlide.mobileMediaUrl.trim() !== '') ? currentSlide.mobileMediaUrl : currentSlide.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover block sm:hidden"
              />
              {/* Desktop Video Banner */}
              <video
                src={currentSlide.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover hidden sm:block"
              />
            </>
          ) : (
            <>
              {/* Mobile Image Banner */}
              <img
                src={(currentSlide.mobileMediaUrl && currentSlide.mobileMediaUrl.trim() !== '') ? currentSlide.mobileMediaUrl : currentSlide.mediaUrl}
                alt={currentSlide.heading || 'Mobile Hero Banner'}
                className="w-full h-full object-cover block sm:hidden"
              />
              {/* Desktop Image Banner */}
              <img
                src={currentSlide.mediaUrl}
                alt={currentSlide.heading || 'Desktop Hero Banner'}
                className="w-full h-full object-cover hidden sm:block"
              />
            </>
          )}

          {/* Optional Dark Gradient Overlay (Only applied if slide contains heading/description text) */}
          {currentSlide.enableGradient !== false && hasTextContent && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-20 lg:px-24 flex flex-col justify-center items-start text-[#FFF8F0]">
        <div className="max-w-3xl space-y-2 sm:space-y-4">

          {/* Prominent Heading */}
          {currentSlide.heading && (
            <motion.h1
              key={`h-${currentIndex}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-poppins font-extrabold text-xl sm:text-3xl lg:text-5xl text-[#F4A62A] leading-tight drop-shadow-xl tracking-tight"
            >
              {currentSlide.heading}
            </motion.h1>
          )}

          {/* Prominent Clear Description */}
          {currentSlide.description && (
            <motion.p
              key={`d-${currentIndex}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-open-sans text-xs sm:text-base lg:text-lg text-[#FFF8F0] font-normal leading-relaxed max-w-2xl drop-shadow-md line-clamp-2 sm:line-clamp-none"
            >
              {currentSlide.description}
            </motion.p>
          )}

          {/* Action Button */}
          {currentSlide.buttonText && (
            <motion.div
              key={`b-${currentIndex}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-1.5 sm:pt-3"
            >
              <button
                onClick={() => {
                  playTempleBell();
                  if (currentSlide.buttonLink === '#prebook' || currentSlide.buttonLink === '#prasad-booking') {
                    openPreBooking();
                  } else if (currentSlide.buttonLink?.startsWith('#')) {
                    const el = document.querySelector(currentSlide.buttonLink);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (currentSlide.buttonLink) {
                    window.location.href = currentSlide.buttonLink;
                  }
                }}
                className="px-5 py-2.5 min-h-[42px] sm:min-h-[48px] rounded-lg bg-[#7A1126] text-[#FFF8F0] hover:bg-[#F4A62A] hover:text-[#2B1A16] font-bold text-xs sm:text-sm transition-all duration-300 shadow-2xl flex items-center gap-2 border border-[#F4A62A]/40 cursor-pointer"
              >
                <span>{currentSlide.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

        </div>
      </div>

      {/* Manual Side Left Slide Button (Hidden on Mobile, Visible on Desktop sm+) */}
      {slides.length > 1 && (
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full shrink-0 aspect-square bg-white text-[#7A1126] hover:bg-[#F4A62A] hover:text-[#2B1A16] border-none items-center justify-center shadow-xl transition-all duration-200 p-0 focus:outline-none"
          aria-label="Previous Slide"
          title="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Manual Side Right Slide Button (Hidden on Mobile, Visible on Desktop sm+) */}
      {slides.length > 1 && (
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full shrink-0 aspect-square bg-white text-[#7A1126] hover:bg-[#F4A62A] hover:text-[#2B1A16] border-none items-center justify-center shadow-xl transition-all duration-200 p-0 focus:outline-none"
          aria-label="Next Slide"
          title="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* 100% PERFECT CIRCULAR BALL SLIDE DOTS */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((s, idx) => {
            const isCurrent = idx === currentIndex;
            const sizePx = isCurrent ? 12 : 9;
            return (
              <button
                key={s.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 transition-all duration-300 p-0 border-none outline-none cursor-pointer ${isCurrent
                    ? 'bg-[#F4A62A] shadow-md ring-2 ring-[#7A1126]'
                    : 'bg-white/70 hover:bg-white'
                  }`}
                style={{
                  width: `${sizePx}px`,
                  height: `${sizePx}px`,
                  minWidth: `${sizePx}px`,
                  minHeight: `${sizePx}px`,
                  maxWidth: `${sizePx}px`,
                  maxHeight: `${sizePx}px`,
                  borderRadius: '50%',
                  display: 'block',
                  padding: 0,
                  boxSizing: 'border-box'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}

      {/* Play & Pause Autoplay Control Button (Bottom Right) */}
      {slides.length > 1 && (
        <div className="absolute bottom-2.5 right-3 sm:bottom-6 sm:right-6 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] sm:w-12 sm:h-12 sm:min-w-[48px] sm:min-h-[48px] rounded-full shrink-0 aspect-square bg-white text-[#7A1126] hover:bg-[#F4A62A] hover:text-[#2B1A16] border-none flex items-center justify-center shadow-xl transition-all duration-200 p-0 focus:outline-none"
            title={isPlaying ? 'Pause Slideshow to Read' : 'Resume Slideshow'}
            aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      )}

    </section>
  );
};
