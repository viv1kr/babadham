import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Palette, Save, Phone, Mail, MapPin, FileText, ShieldCheck, Plus, Trash2, Globe, Image as ImageIcon, Upload, MessageCircle, Bookmark, LayoutGrid, Tv, Link as LinkIcon, MoveUp, MoveDown, Sparkles } from 'lucide-react';
import type { CustomDetail, HeroSlide } from '../../types/ecommerce';

export const BrandingView: React.FC = () => {
  const { brandSettings, saveBrandSettings } = useAdmin();

  // Active Sub Tab for Secondary Sidebar
  const [activeSubTab, setActiveSubTab] = useState<string>('all');

  // State
  const [bName, setBName] = useState(brandSettings?.brandName || 'BABA BAIDYANATH PRASADAM');
  const [bTagline, setBTagline] = useState(brandSettings?.tagline || 'aastha | seva | samarpan');
  const [bSacredText, setBSacredText] = useState(brandSettings?.topBarSacredText || 'ॐ हर हर महादेव ॐ');
  const [bPhone, setBPhone] = useState(brandSettings?.helplineNumber || '+91 98765 43210');
  const [bWhatsapp, setBWhatsapp] = useState(brandSettings?.whatsappNumber || '+91 98765 43211');
  const [bFacebook, setBFacebook] = useState(brandSettings?.facebookUrl || 'https://facebook.com');
  const [bInstagram, setBInstagram] = useState(brandSettings?.instagramUrl || 'https://instagram.com');
  const [bEmail, setBEmail] = useState(brandSettings?.supportEmail || 'support@babadham.org');
  const [bAddress, setBAddress] = useState(brandSettings?.address || 'Baidyanath Temple Complex, Main Gate Road, Deoghar, Jharkhand - 814112');
  const [bPdfUrl, setBPdfUrl] = useState(brandSettings?.cataloguePdfUrl || 'https://babadham.org/catalogue.pdf');
  const [bFssai, setBFssai] = useState(brandSettings?.fssaiLicenseNumber || '11124999000123');
  const [bLogoImageUrl, setBLogoImageUrl] = useState(brandSettings?.logoImageUrl || '');
  const [bFaviconUrl, setBFaviconUrl] = useState(brandSettings?.faviconUrl || '');
  const [bHeaderBgImageUrl, setBHeaderBgImageUrl] = useState(brandSettings?.headerBgImageUrl || '');
  const [bMobileHeaderBgImageUrl, setBMobileHeaderBgImageUrl] = useState(brandSettings?.mobileHeaderBgImageUrl || '');

  // Marquee Announcement Ticker State
  const [bEnableTicker, setBEnableTicker] = useState(brandSettings?.enableTicker !== false);
  const [bTickerAnnouncement, setBTickerAnnouncement] = useState(brandSettings?.tickerAnnouncementText || '✨ Direct Garbhagriha Bhog Prasad Blessed at Baidyanath Jyotirlinga Temple & Express 24-Hour Dispatch across India! 🚩 Order Online or on WhatsApp 🔱');
  const [bTickerSpeed, setBTickerSpeed] = useState<number>(brandSettings?.tickerSpeedSeconds || 30);

  // Hero Slides List State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    brandSettings?.heroSlides && brandSettings.heroSlides.length > 0 ? brandSettings.heroSlides : [
      {
        id: 'slide-1',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1600&q=80',
        heading: 'Direct Garbhagriha Bhog Prasad Delivery',
        description: 'Touch-offered directly at Baidyanath Jyotirlinga & delivered home with express 24-hour dispatch.',
        buttonText: 'Order Bhog Prasad on WhatsApp',
        buttonLink: 'https://wa.me/919876543211'
      },
      {
        id: 'slide-2',
        type: 'video',
        mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-temple-bell-ringing-in-a-sacred-ritual-41566-large.mp4',
        heading: 'Deoghar Dham Divine Darshan & Peda',
        description: 'Pure Desi Ghee Peda Prasad, 5-Mukhi Rudraksh & Uttarvahini Ganga Jal.',
        buttonText: 'Explore Sacred Store',
        buttonLink: '#products'
      }
    ]
  );

  // Custom Details List State
  const [customDetails, setCustomDetails] = useState<CustomDetail[]>(
    brandSettings?.customDetails || [
      { id: '1', label: 'GSTIN Registration', value: '20AAAAA0000A1Z5' },
      { id: '2', label: 'Temple Board Reg No', value: 'DEO-TEMPLE-2024-88' }
    ]
  );

  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const syncToStorefront = (logo?: string, favicon?: string, settings?: any) => {
    const frame = document.getElementById('babadham-sync-frame') as HTMLIFrameElement;
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({
        type: 'SYNC_BRANDING_CROSS_ORIGIN',
        logo: logo !== undefined ? logo : localStorage.getItem('babadham_logo_image'),
        favicon: favicon !== undefined ? favicon : localStorage.getItem('babadham_favicon_image'),
        settings: settings !== undefined ? JSON.stringify(settings) : localStorage.getItem('babadham_brand_settings')
      }, 'http://localhost:5173');
    }
  };

  useEffect(() => {
    // Attempt to sync existing settings to storefront iframe on mount
    const timer = setTimeout(() => {
      syncToStorefront();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const compressAndSaveImage = (file: File, maxWidth: number, maxHeight: number, key: string, callback: (res: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/webp', 0.6);
          
          fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              image: compressed, 
              type: key 
            })
          }).then(res => res.json()).then(data => {
            if (data.success) {
              const freshUrl = `${data.path}?t=${Date.now()}`;
              callback(freshUrl);
              try {
                localStorage.setItem(key, freshUrl);
                if (key === 'babadham_logo_image') {
                  saveBrandSettings({ logoImageUrl: freshUrl });
                  syncToStorefront(freshUrl, undefined, undefined);
                } else if (key === 'babadham_favicon_image') {
                  saveBrandSettings({ faviconUrl: freshUrl });
                  syncToStorefront(undefined, freshUrl, undefined);
                }
              } catch (err) {
                console.warn('Instant save error', err);
              }
            }
          }).catch(err => {
            console.error('File upload failed, falling back to local storage', err);
            callback(compressed);
            try {
              localStorage.setItem(key, compressed);
              if (key === 'babadham_logo_image') {
                saveBrandSettings({ logoImageUrl: compressed });
                syncToStorefront(compressed, undefined, undefined);
              } else if (key === 'babadham_favicon_image') {
                saveBrandSettings({ faviconUrl: compressed });
                syncToStorefront(undefined, compressed, undefined);
              }
            } catch (err) {
              console.warn('Instant save error', err);
            }
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndSaveImage(file, 400, 400, 'babadham_logo_image', setBLogoImageUrl);
    }
  };

  const handleFaviconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndSaveImage(file, 128, 128, 'babadham_favicon_image', setBFaviconUrl);
    }
  };

  const handleHeaderBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxW = isMobile ? 800 : 1920;
    const maxH = isMobile ? 600 : 400;
    const key = isMobile ? 'babadham_mobile_header_bg' : 'babadham_header_bg';
    const setter = isMobile ? setBMobileHeaderBgImageUrl : setBHeaderBgImageUrl;

    compressAndSaveImage(file, maxW, maxH, key, (resUrl) => {
      setter(resUrl);
      const partial = isMobile ? { mobileHeaderBgImageUrl: resUrl } : { headerBgImageUrl: resUrl };
      saveBrandSettings(partial);
    });
  };

  // Hero Slides Handlers
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      type: 'image',
      mediaUrl: '',
      heading: '',
      description: '',
      buttonText: '',
      buttonLink: ''
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleUpdateSlide = (id: string, updatedFields: Partial<HeroSlide>) => {
    const updated = heroSlides.map(slide => slide.id === id ? { ...slide, ...updatedFields } : slide);
    setHeroSlides(updated);
    saveBrandSettings({ heroSlides: updated });
    syncToStorefront(undefined, undefined, { ...brandSettings, heroSlides: updated });
  };

  const handleRemoveSlide = (id: string) => {
    const updated = heroSlides.filter(slide => slide.id !== id);
    setHeroSlides(updated);
    saveBrandSettings({ heroSlides: updated });
    syncToStorefront(undefined, undefined, { ...brandSettings, heroSlides: updated });
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSlides.length) {
      const temp = newSlides[index];
      newSlides[index] = newSlides[targetIndex];
      newSlides[targetIndex] = temp;
      setHeroSlides(newSlides);
      saveBrandSettings({ heroSlides: newSlides });
      syncToStorefront(undefined, undefined, { ...brandSettings, heroSlides: newSlides });
    }
  };

  const handleSlideMediaUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>, isVideo: boolean = false, isMobile: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fieldKey = isMobile ? 'mobileMediaUrl' : 'mediaUrl';

    if (isVideo) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const resUrl = evt.target?.result as string;
        handleUpdateSlide(id, { [fieldKey]: resUrl, type: 'video' });
      };
      reader.readAsDataURL(file);
    } else {
      const maxW = isMobile ? 800 : 1600;
      const maxH = isMobile ? 1200 : 900;
      compressAndSaveImage(file, maxW, maxH, `babadham_hero_${id}_${isMobile ? 'mob' : 'desk'}`, (resUrl) => {
        handleUpdateSlide(id, { [fieldKey]: resUrl, type: 'image' });
      });
    }
  };

  const handleAddCustomDetail = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    setCustomDetails([
      ...customDetails,
      { id: Date.now().toString(), label: newLabel.trim(), value: newValue.trim() }
    ]);
    setNewLabel('');
    setNewValue('');
  };

  const handleRemoveCustomDetail = (id: string) => {
    setCustomDetails(customDetails.filter(item => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings = {
      ...brandSettings,
      brandName: bName,
      tagline: bTagline,
      topBarSacredText: bSacredText,
      helplineNumber: bPhone,
      whatsappNumber: bWhatsapp,
      facebookUrl: bFacebook,
      instagramUrl: bInstagram,
      supportEmail: bEmail,
      address: bAddress,
      cataloguePdfUrl: bPdfUrl,
      fssaiLicenseNumber: bFssai,
      logoImageUrl: bLogoImageUrl,
      faviconUrl: bFaviconUrl,
      headerBgImageUrl: bHeaderBgImageUrl,
      mobileHeaderBgImageUrl: bMobileHeaderBgImageUrl,
      enableTicker: bEnableTicker,
      tickerAnnouncementText: bTickerAnnouncement,
      tickerSpeedSeconds: bTickerSpeed,
      customDetails: customDetails,
      heroSlides: heroSlides
    };
    saveBrandSettings(newSettings);
    syncToStorefront(undefined, undefined, newSettings);
  };

  // Sub-Navigation Desk Items (Second Sidebar) - Clean, Minimalist & Badge-Free
  const deskNavItems = [
    { id: 'all', label: 'ALL CONFIGURATIONS', icon: LayoutGrid },
    { id: 'hero', label: 'HERO SLIDER & MEDIA', icon: Tv },
    { id: 'logo', label: 'LOGO & FAVICON', icon: ImageIcon },
    { id: 'identity', label: 'BRAND IDENTITY', icon: Palette },
    { id: 'contact', label: 'CONTACT & SUPPORT', icon: Phone },
    { id: 'compliance', label: 'FSSAI & CATALOGUE', icon: ShieldCheck },
    { id: 'custom', label: 'CUSTOM DETAILS', icon: Globe }
  ];

  return (
    <form onSubmit={handleSave} className="w-full min-h-full flex flex-col text-xs sm:text-sm">
      <div className="flex flex-col lg:flex-row gap-0 w-full min-h-full items-stretch">
        
        {/* Second Sidebar (Sub-Navigation Desk) - Sticky top-0, stays in place while scrolling */}
        <div className="w-full lg:w-72 bg-[#1A0B0E] border-r border-[#F4A62A]/20 py-5 px-0 shrink-0 space-y-5 shadow-xl sticky top-0 self-start z-30">
          
          {/* Header Title Desk */}
          <div className="flex items-center gap-2.5 px-5 pb-4 border-b border-[#F4A62A]/20 text-[#F4A62A]">
            <Bookmark className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">BRAND DESK</h3>
          </div>

          {/* Sub Navigation List */}
          <nav className="space-y-1">
            {deskNavItems.map(item => {
              const isActive = activeSubTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full h-12 flex items-center gap-3 px-5 transition-all text-left text-xs sm:text-[13px] font-medium tracking-wide cursor-pointer relative ${
                    isActive 
                      ? 'bg-[#2B1217] text-[#F4A62A] border-l-4 border-[#F4A62A] shadow-md font-semibold' 
                      : 'text-[#FFF8F0]/70 hover:bg-[#2B1217]/60 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/50'}`} />
                  <span className="uppercase tracking-wider truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Save Settings Button placed DIRECTLY BELOW the nav menu */}
          <div className="px-5 pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#F4A62A] hover:bg-white text-[#2B1A16] font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#F4A62A]/40"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

        </div>

        {/* Main Content Sections Column */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 w-full bg-[#120508]">

          {/* 0. Hero Banner Slides & Video Media Manager */}
          {(activeSubTab === 'all' || activeSubTab === 'hero') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-6 shadow-lg w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4A62A]/20 pb-4">
                <div>
                  <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <Tv className="w-5 h-5" /> Storefront Hero Banner & Video Slides ({heroSlides.length})
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/60 mt-0.5">
                    Add photos or promotional videos with custom headings, descriptions, and direct order buttons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="h-10 px-4 rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New Hero Slide
                </button>
              </div>

              {/* Slides Grid / List */}
              <div className="space-y-6">
                {heroSlides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className="p-5 rounded-2xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-4 relative shadow-md"
                  >
                    {/* Slide Top Header Bar */}
                    <div className="flex items-center justify-between border-b border-[#F4A62A]/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#7A1126] text-[#F4A62A] font-bold text-xs flex items-center justify-center border border-[#F4A62A]/30">
                          #{index + 1}
                        </span>
                        <span className="font-bold text-sm text-[#FFF8F0]">
                          {slide.type === 'video' ? '🎬 Video Slide Banner' : '🖼️ Photo Slide Banner'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          slide.type === 'video' ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {slide.type}
                        </span>
                      </div>

                      {/* Reorder & Remove Slide Controls */}
                      <div className="flex items-center gap-1.5">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveSlide(index, 'up')}
                            className="p-1.5 text-[#F4A62A] hover:bg-[#2B1217] rounded-lg transition-colors cursor-pointer"
                            title="Move Slide Up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                        )}
                        {index < heroSlides.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveSlide(index, 'down')}
                            className="p-1.5 text-[#F4A62A] hover:bg-[#2B1217] rounded-lg transition-colors cursor-pointer"
                            title="Move Slide Down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(slide.id)}
                          className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer ml-1"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      
                      {/* Top Row: Desktop & Mobile Media Uploaders */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        
                        {/* 1. Desktop Media Column */}
                        <div className="space-y-3 p-4 rounded-xl bg-[#120508] border border-[#F4A62A]/20">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#F4A62A] flex items-center gap-1.5">
                              🖥️ Desktop Media (Wide Screen)
                            </label>
                            <div className="flex items-center gap-1 bg-[#1A0B0E] p-1 rounded-lg border border-[#F4A62A]/20">
                              <button
                                type="button"
                                onClick={() => handleUpdateSlide(slide.id, { type: 'image' })}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                  slide.type === 'image' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#FFF8F0]/60 hover:text-white'
                                }`}
                              >
                                Photo
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateSlide(slide.id, { type: 'video' })}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                  slide.type === 'video' ? 'bg-purple-900 text-purple-200' : 'text-[#FFF8F0]/60 hover:text-white'
                                }`}
                              >
                                Video
                              </button>
                            </div>
                          </div>

                          {/* Desktop Preview Box */}
                          <div className="w-full h-36 rounded-xl bg-[#2B1217]/60 border border-[#F4A62A]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                            {slide.mediaUrl ? (
                              slide.type === 'video' ? (
                                <video src={slide.mediaUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                              ) : (
                                <img src={slide.mediaUrl} alt="Desktop Preview" className="w-full h-full object-cover" />
                              )
                            ) : (
                              <span className="text-[11px] text-[#FFF8F0]/40 font-medium text-center px-4">
                                {slide.type === 'video' ? 'No Desktop Video Uploaded' : 'No Desktop Photo Uploaded'}
                              </span>
                            )}
                          </div>

                          {/* Desktop File Upload Button */}
                          <label className="flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
                            <Upload className="w-3.5 h-3.5" /> Upload Desktop {slide.type === 'video' ? 'Video' : 'Photo'}
                            <input 
                              type="file" 
                              accept={slide.type === 'video' ? 'video/*' : 'image/*'} 
                              onChange={(e) => handleSlideMediaUpload(slide.id, e, slide.type === 'video', false)} 
                              className="hidden" 
                            />
                          </label>

                          {/* Desktop URL Input */}
                          <input
                            type="text"
                            placeholder={slide.type === 'video' ? 'Or paste Desktop video URL...' : 'Or paste Desktop image URL...'}
                            value={slide.mediaUrl || ''}
                            onChange={(e) => handleUpdateSlide(slide.id, { mediaUrl: e.target.value })}
                            className="w-full bg-[#1A0B0E] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                          />
                        </div>

                        {/* 2. Mobile Media Column (Optional) */}
                        <div className="space-y-3 p-4 rounded-xl bg-[#120508] border border-[#F4A62A]/20">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#F4A62A] flex items-center gap-1.5">
                              📱 Mobile Media (Phone Screen) <span className="text-[#F4A62A]/60 font-normal">(Optional)</span>
                            </label>
                          </div>

                          {/* Mobile Preview Box */}
                          <div className="w-full h-36 rounded-xl bg-[#2B1217]/60 border border-[#F4A62A]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                            {slide.mobileMediaUrl ? (
                              slide.type === 'video' ? (
                                <video src={slide.mobileMediaUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                              ) : (
                                <img src={slide.mobileMediaUrl} alt="Mobile Preview" className="w-full h-full object-cover" />
                              )
                            ) : (
                              <span className="text-[11px] text-[#FFF8F0]/40 font-medium text-center px-4">
                                {slide.type === 'video' ? 'Uses Desktop Video on Mobile' : 'Uses Desktop Photo on Mobile'}
                              </span>
                            )}
                          </div>

                          {/* Mobile File Upload Button */}
                          <label className="flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#2B1217] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
                            <Upload className="w-3.5 h-3.5" /> Upload Mobile {slide.type === 'video' ? 'Video' : 'Photo'}
                            <input 
                              type="file" 
                              accept={slide.type === 'video' ? 'video/*' : 'image/*'} 
                              onChange={(e) => handleSlideMediaUpload(slide.id, e, slide.type === 'video', true)} 
                              className="hidden" 
                            />
                          </label>

                          {/* Mobile URL Input */}
                          <input
                            type="text"
                            placeholder={slide.type === 'video' ? 'Or paste Mobile video URL...' : 'Or paste Mobile image URL...'}
                            value={slide.mobileMediaUrl || ''}
                            onChange={(e) => handleUpdateSlide(slide.id, { mobileMediaUrl: e.target.value })}
                            className="w-full bg-[#1A0B0E] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                          />
                        </div>

                      </div>

                      {/* Bottom Row: Slide Text Contents & CTA Links */}
                      <div className="space-y-4 p-4 rounded-xl bg-[#120508] border border-[#F4A62A]/20">
                        
                        {/* Heading */}
                        <div>
                          <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">
                            Slide Main Heading <span className="text-[#F4A62A]/60 font-normal ml-1">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={slide.heading || ''}
                            onChange={(e) => handleUpdateSlide(slide.id, { heading: e.target.value })}
                            placeholder="e.g. Direct Garbhagriha Bhog Prasad (leave empty for simple photo/video banner)"
                            className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">
                            Slide Subtitle / Devotional Description <span className="text-[#F4A62A]/60 font-normal ml-1">(Optional)</span>
                          </label>
                          <textarea
                            rows={2}
                            value={slide.description || ''}
                            onChange={(e) => handleUpdateSlide(slide.id, { description: e.target.value })}
                            placeholder="e.g. Blessed at Baidyanath Temple & delivered home with express 24-hour dispatch (or leave empty)"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-[#F4A62A]"
                          />
                        </div>

                        {/* Button Text & Button Link */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#F4A62A] mb-1">
                              Order Button Text <span className="text-[#F4A62A]/60 font-normal ml-1">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={slide.buttonText || ''}
                              onChange={(e) => handleUpdateSlide(slide.id, { buttonText: e.target.value })}
                              placeholder="e.g. Order Prasad on WhatsApp (or leave empty)"
                              className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs font-medium focus:outline-none focus:border-[#F4A62A]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#F4A62A] mb-1 flex items-center gap-1">
                              <LinkIcon className="w-3.5 h-3.5" /> Order Button Link <span className="text-[#F4A62A]/60 font-normal ml-1">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={slide.buttonLink || ''}
                              onChange={(e) => handleUpdateSlide(slide.id, { buttonLink: e.target.value })}
                              placeholder="e.g. https://wa.me/919876543211 or #products"
                              className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs font-medium focus:outline-none focus:border-[#F4A62A]"
                            />
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1. Logo & Favicon Section */}
          {(activeSubTab === 'all' || activeSubTab === 'logo') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3">
                <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Official Company Logo & Browser Favicon
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Header Logo Upload */}
                <div className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F4A62A] text-sm">Header Logo Image</span>
                    {bLogoImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setBLogoImageUrl('');
                          localStorage.removeItem('babadham_logo_image');
                        }}
                        className="text-xs text-red-400 hover:text-red-200 cursor-pointer font-semibold"
                      >
                        Clear Logo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 h-20 rounded-xl bg-[#2B1217] border-2 border-dashed border-[#F4A62A]/40 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-inner">
                      {bLogoImageUrl ? (
                        <img src={bLogoImageUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-[#FFF8F0]/40 text-center font-medium">No Logo</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="flex items-center justify-center gap-2 px-4 h-[48px] rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs sm:text-sm border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
                        <Upload className="w-4 h-4" /> Upload PNG / JPG Logo File
                        <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                      </label>
                      <div className="text-center">
                        {bLogoImageUrl ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                            ✓ Custom Logo File Loaded
                          </span>
                        ) : (
                          <span className="text-xs text-[#FFF8F0]/50">
                            Click button above to select PNG or JPG logo file
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F4A62A] text-sm">Browser Favicon Icon</span>
                    {bFaviconUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setBFaviconUrl('');
                          localStorage.removeItem('babadham_favicon_image');
                        }}
                        className="text-xs text-red-400 hover:text-red-200 cursor-pointer font-semibold"
                      >
                        Clear Favicon
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 h-20 rounded-xl bg-[#2B1217] border-2 border-dashed border-[#F4A62A]/40 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-inner">
                      {bFaviconUrl ? (
                        <img src={bFaviconUrl} alt="Favicon" className="w-10 h-10 object-contain rounded-md" />
                      ) : (
                        <span className="text-xs text-[#FFF8F0]/40 text-center font-medium">No Favicon</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="flex items-center justify-center gap-2 px-4 h-[48px] rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs sm:text-sm border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
                        <Upload className="w-4 h-4" /> Upload Favicon File (.png, .ico)
                        <input type="file" accept="image/*,.ico" onChange={handleFaviconFileUpload} className="hidden" />
                      </label>
                      <div className="text-center">
                        {bFaviconUrl ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                            ✓ Custom Favicon File Loaded
                          </span>
                        ) : (
                          <span className="text-xs text-[#FFF8F0]/50">
                            Click button above to select PNG or ICO favicon file
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Background Image Manager (Desktop & Mobile) */}
                <div className="lg:col-span-2 border-t border-[#F4A62A]/20 pt-4 mt-2 space-y-4">
                  <h4 className="font-bold text-[#F4A62A] text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Logo Header Background Image Manager (Desktop & Mobile)
                  </h4>
                  <p className="text-xs text-[#FFF8F0]/60">
                    Upload a custom background photo for the top logo header bar. You can upload separate background images for desktop and mobile devices.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* Desktop Header Background */}
                    <div className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F4A62A] text-xs">🖥️ Desktop Header Background</span>
                        {bHeaderBgImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setBHeaderBgImageUrl('');
                              saveBrandSettings({ headerBgImageUrl: '' });
                            }}
                            className="text-xs text-red-400 hover:text-red-200 cursor-pointer font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Desktop Preview Box */}
                      <div className="w-full h-24 rounded-xl bg-[#2B1217] border border-[#F4A62A]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                        {bHeaderBgImageUrl ? (
                          <img src={bHeaderBgImageUrl} alt="Desktop Header BG" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#FFF8F0]/40 text-center font-medium">Default Gradient Header</span>
                        )}
                      </div>

                      <label className="flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
                        <Upload className="w-3.5 h-3.5" /> Upload Desktop Header BG Image
                        <input type="file" accept="image/*" onChange={(e) => handleHeaderBgFileUpload(e, false)} className="hidden" />
                      </label>

                      <input
                        type="text"
                        placeholder="Or paste Desktop Header BG image URL..."
                        value={bHeaderBgImageUrl || ''}
                        onChange={(e) => setBHeaderBgImageUrl(e.target.value)}
                        className="w-full bg-[#120508] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                      />
                    </div>

                    {/* Mobile Header Background (Optional) */}
                    <div className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F4A62A] text-xs">📱 Mobile Header Background <span className="text-[#F4A62A]/60 font-normal">(Optional)</span></span>
                        {bMobileHeaderBgImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setBMobileHeaderBgImageUrl('');
                              saveBrandSettings({ mobileHeaderBgImageUrl: '' });
                            }}
                            className="text-xs text-red-400 hover:text-red-200 cursor-pointer font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Mobile Preview Box */}
                      <div className="w-full h-24 rounded-xl bg-[#2B1217] border border-[#F4A62A]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                        {bMobileHeaderBgImageUrl ? (
                          <img src={bMobileHeaderBgImageUrl} alt="Mobile Header BG" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#FFF8F0]/40 text-center font-medium">Uses Desktop Header BG on Mobile</span>
                        )}
                      </div>

                      <label className="flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#2B1217] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
                        <Upload className="w-3.5 h-3.5" /> Upload Mobile Header BG Image
                        <input type="file" accept="image/*" onChange={(e) => handleHeaderBgFileUpload(e, true)} className="hidden" />
                      </label>

                      <input
                        type="text"
                        placeholder="Or paste Mobile Header BG image URL..."
                        value={bMobileHeaderBgImageUrl || ''}
                        onChange={(e) => setBMobileHeaderBgImageUrl(e.target.value)}
                        className="w-full bg-[#120508] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Marquee Announcement Text & Timing Settings */}
                <div className="lg:col-span-2 border-t border-[#F4A62A]/20 pt-5 mt-4 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-bold text-[#F4A62A] text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F4A62A]" /> Marquee Ticker Text & Timing Settings
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer bg-[#1A0B0E] px-3 py-1 rounded-lg border border-[#F4A62A]/20">
                      <span className="text-xs font-semibold text-[#FFF8F0]/80">Enable Marquee Ticker:</span>
                      <input
                        type="checkbox"
                        checked={bEnableTicker}
                        onChange={(e) => setBEnableTicker(e.target.checked)}
                        className="w-4 h-4 accent-[#F4A62A] cursor-pointer"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-[#FFF8F0]/60">
                    Manage the live scrolling announcement text and scroll timing (speed in seconds) displayed directly below the Hero Slider on the main homepage.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Announcement Banner Text */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#F4A62A] mb-1">
                        Marquee Announcement Text
                      </label>
                      <input
                        type="text"
                        value={bTickerAnnouncement}
                        onChange={(e) => setBTickerAnnouncement(e.target.value)}
                        placeholder="e.g. ✨ Direct Garbhagriha Bhog Prasad Blessed at Baidyanath Jyotirlinga Temple..."
                        className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>

                    {/* Scroll Timing / Speed */}
                    <div>
                      <label className="block text-xs font-bold text-[#F4A62A] mb-1">
                        Marquee Scroll Timing / Speed (Seconds)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={bTickerSpeed}
                        onChange={(e) => setBTickerSpeed(Number(e.target.value) || 30)}
                        placeholder="e.g. 30"
                        className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 2. Brand Identity Section */}
          {(activeSubTab === 'all' || activeSubTab === 'identity') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <Palette className="w-5 h-5" /> Brand Identity & Slogan Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">Company / Brand Name</label>
                  <input
                    type="text"
                    value={bName}
                    onChange={e => setBName(e.target.value)}
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">Brand Tagline / Motto</label>
                  <input
                    type="text"
                    value={bTagline}
                    onChange={e => setBTagline(e.target.value)}
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold font-sans">Top Header Sacred Banner Text</label>
                  <input
                    type="text"
                    value={bSacredText}
                    onChange={e => setBSacredText(e.target.value)}
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Contact & Support Section */}
          {(activeSubTab === 'all' || activeSubTab === 'contact') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-5 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <Phone className="w-5 h-5" /> Contact Numbers, Social Handles & Official Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">Helpline Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#F4A62A] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bPhone}
                      onChange={e => setBPhone(e.target.value)}
                      className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-400 mb-1.5 font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Support Number
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bWhatsapp}
                      onChange={e => setBWhatsapp(e.target.value)}
                      placeholder="e.g. +91 98765 43211"
                      className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-emerald-500/50 text-emerald-300 text-sm font-medium focus:outline-none focus:border-emerald-400 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">Customer Support Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#F4A62A] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={bEmail}
                      onChange={e => setBEmail(e.target.value)}
                      className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links (Facebook & Instagram) */}
              <div className="border-t border-[#F4A62A]/20 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                <div>
                  <label className="block text-[#F4A62A] mb-1.5 font-bold flex items-center gap-2">
                    📘 Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={bFacebook}
                    onChange={e => setBFacebook(e.target.value)}
                    placeholder="https://facebook.com/your-page"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                  />
                  <p className="text-[11px] text-[#FFF8F0]/50 mt-1">Updates the Facebook icon link in storefront footer live.</p>
                </div>

                <div>
                  <label className="block text-[#F4A62A] mb-1.5 font-bold flex items-center gap-2">
                    📸 Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={bInstagram}
                    onChange={e => setBInstagram(e.target.value)}
                    placeholder="https://instagram.com/your-handle"
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                  />
                  <p className="text-[11px] text-[#FFF8F0]/50 mt-1">Updates the Instagram icon link in storefront footer live.</p>
                </div>
              </div>

              <div>
                <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">Company Registered Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#F4A62A] absolute left-4 top-4" />
                  <textarea
                    rows={2}
                    value={bAddress}
                    onChange={e => setBAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Compliance & Catalogue Section */}
          {(activeSubTab === 'all' || activeSubTab === 'compliance') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <ShieldCheck className="w-5 h-5" /> FSSAI Compliance & Catalogue Link
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">FSSAI Food License Number</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bFssai}
                      onChange={e => setBFssai(e.target.value)}
                      placeholder="e.g. 11124999000123"
                      className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                    />
                  </div>
                  <p className="text-xs text-emerald-400/80 mt-1">Verified FSSAI Food Safety Compliance Certification</p>
                </div>

                <div>
                  <label className="block text-[#FFF8F0]/90 mb-1.5 font-bold">Company Catalogue PDF Link / File</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#F4A62A] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bPdfUrl}
                      onChange={e => setBPdfUrl(e.target.value)}
                      placeholder="e.g. https://babadham.org/catalogue.pdf"
                      className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm font-medium focus:outline-none focus:border-[#F4A62A] shadow-inner"
                    />
                  </div>
                  <p className="text-xs text-[#FFF8F0]/60 mt-1">URL link to downloadable product catalogue PDF</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Custom Details Section */}
          {(activeSubTab === 'all' || activeSubTab === 'custom') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <Globe className="w-5 h-5" /> Additional Custom Company Details (GSTIN, Reg No, etc.)
              </h3>

              {customDetails.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {customDetails.map(detail => (
                    <div 
                      key={detail.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 shadow-sm"
                    >
                      <div className="truncate text-sm">
                        <span className="font-bold text-[#F4A62A]">{detail.label}:</span>{' '}
                        <span className="text-[#FFF8F0] font-mono font-medium">{detail.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomDetail(detail.id)}
                        className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-950/60 rounded-lg transition-colors ml-3 cursor-pointer"
                        title="Remove detail"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 w-full">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Detail Title (e.g. GSTIN Registration)"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Detail Value (e.g. 20AAAAA0000A1Z5)"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    className="w-full h-[50px] px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-sm focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddCustomDetail}
                    className="w-full h-[50px] rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs sm:text-sm border border-[#F4A62A]/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Detail
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Full Width Submit Button */}
          <div className="pt-2 text-right w-full">
            <button
              type="submit"
              className="h-[52px] px-10 rounded-xl bg-[#F4A62A] hover:bg-white text-[#2B1A16] font-extrabold text-sm transition-all shadow-xl flex items-center gap-2 ml-auto cursor-pointer"
            >
              <Save className="w-5 h-5" /> Save Complete Brand Settings
            </button>
          </div>

        </div>

      </div>
      
      {/* Invisible iframe for Cross-Origin LocalStorage Synchronization */}
      <iframe id="babadham-sync-frame" src="http://localhost:5173" style={{ display: 'none' }} />
    </form>
  );
};
