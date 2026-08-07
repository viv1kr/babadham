import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import type { HeroBannerItem } from "../../types/ecommerce";
import { db } from "../../db/mysqlSim";

export const PrebookingHeroSection: React.FC = () => {
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640);

  // Responsive breakpoint tracker
  useEffect(() => {
    const onResize = () => setIsMobileView(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const refresh = useCallback(() => {
    const active = db.getPrebookingHeroBanners();
    setBanners(Array.isArray(active) ? active : []);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("bbp_db_updated", refresh);
    window.addEventListener("storage", refresh);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("bbp_brand_sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "PREBOOKING_HERO_BANNERS_UPDATED") {
          const b = event.data.banners;
          if (Array.isArray(b)) {
            setBanners(b);
            try { localStorage.setItem("babadham_prebooking_hero_banners", JSON.stringify(b)); } catch(e) {}
          }
        }
      };
    } catch (e) {}
    return () => {
      window.removeEventListener("bbp_db_updated", refresh);
      window.removeEventListener("storage", refresh);
      if (channel) channel.close();
    };
  }, [refresh]);

  // Auto-advance
  useEffect(() => {
    if (banners.length <= 1 || !isPlaying) return;
    const t = setInterval(() => setCurrentIndex(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length, isPlaying]);

  useEffect(() => { setCurrentIndex(0); }, [banners.length]);

  // Filter only banners that have at least one media URL
  const validBanners = banners.filter(b => (b.desktopUrl?.trim() || b.mobileUrl?.trim()));
  if (validBanners.length === 0) return null;

  const current = validBanners[currentIndex] || validBanners[0];
  if (!current) return null;

  // Pick best URL: prefer device-appropriate, fall back to other
  const desktopUrl = current.desktopUrl?.trim();
  const mobileUrl = current.mobileUrl?.trim();
  const mediaUrl = isMobileView ? (mobileUrl || desktopUrl) : (desktopUrl || mobileUrl);
  if (!mediaUrl) return null;

  return (
    <section
      style={{ position: "relative", width: "100%", overflow: "hidden", background: "#000", userSelect: "none" }}
      className="h-[62vw] min-h-[280px] max-h-[420px] sm:h-[58vh] sm:min-h-[440px] sm:max-h-[700px]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {current.mediaType === "video" ? (
            <video
              key={`vid-${current.id}`}
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              key={`img-${current.id}`}
              src={mediaUrl}
              alt={current.title || "Prebooking Banner"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dot pagination */}
      {validBanners.length > 1 && (
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "8px", zIndex: 20 }}>
          {validBanners.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              role="button"
              aria-label={`Slide ${idx + 1}`}
              style={{
                display: "inline-block",
                borderRadius: "50%",
                width: idx === currentIndex ? "10px" : "7px",
                height: idx === currentIndex ? "10px" : "7px",
                backgroundColor: idx === currentIndex ? "#F4A62A" : "rgba(255,255,255,0.5)",
                boxShadow: idx === currentIndex ? "0 0 6px 2px rgba(244,166,42,0.5)" : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Play/Pause */}
      {validBanners.length > 1 && (
        <button
          onClick={() => setIsPlaying(p => !p)}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            position: "absolute", bottom: "16px", right: "20px",
            width: "44px", height: "44px", minWidth: "44px", minHeight: "44px",
            maxWidth: "44px", maxHeight: "44px", aspectRatio: "1/1",
            borderRadius: "50%",
            backgroundColor: "rgba(18,5,8,0.75)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(244,166,42,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 20,
            padding: 0, margin: 0, outline: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            boxSizing: "border-box",
            transition: "all 0.3s ease",
          }}
        >
          {isPlaying
            ? <Pause style={{ width: "18px", height: "18px", color: "#F4A62A", fill: "#F4A62A" }} />
            : <Play style={{ width: "18px", height: "18px", color: "#F4A62A", fill: "#F4A62A", marginLeft: "2px" }} />
          }
        </button>
      )}
    </section>
  );
};

export default PrebookingHeroSection;
