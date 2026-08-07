import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Palette, Save, Phone, Mail, MapPin, FileText, ShieldCheck, Plus, Trash2, Globe, Image as ImageIcon, Upload, MessageCircle, Bookmark, LayoutGrid, Tv, Link as LinkIcon, MoveUp, MoveDown, Sparkles } from 'lucide-react';
import type { CustomDetail, HeroSlide, HeroBannerItem } from '../../types/ecommerce';
import { compressImage, setPersistentMedia, getPersistentMedia } from '../../utils/mediaDB';
import { db } from '../../db/mysqlSim';

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

  // Dedicated Hero Banner Table State
  const [heroBanners, setHeroBanners] = useState<HeroBannerItem[]>(() => {
    return db.getHeroBanners();
  });

  useEffect(() => {
    if (brandSettings?.heroBanners && Array.isArray(brandSettings.heroBanners)) {
      setHeroBanners(brandSettings.heroBanners);
    } else {
      const active = db.getHeroBanners();
      if (active && Array.isArray(active)) {
        setHeroBanners(active);
      }
    }
  }, [brandSettings?.heroBanners]);

  const handleAddHeroBanner = () => {
    const newBanner: HeroBannerItem = {
      id: Date.now().toString(),
      title: `Hero Banner ${heroBanners.length + 1}`,
      mediaType: 'image',
      desktopUrl: '',
      mobileUrl: '',
      displayOrder: heroBanners.length,
      createdAt: new Date().toISOString()
    };
    const updated = [...heroBanners, newBanner];
    setHeroBanners(updated);
    db.saveHeroBanners(updated);
    try { localStorage.setItem('babadham_hero_banners', JSON.stringify(updated)); } catch(e) {}
    saveBrandSettings({ heroBanners: updated });
    syncToStorefront(undefined, undefined, { ...brandSettings, heroBanners: updated });
  };

  const handleUpdateHeroBanner = (id: string, updates: Partial<HeroBannerItem>) => {
    const updated = heroBanners.map(b => b.id === id ? { ...b, ...updates } : b);
    setHeroBanners(updated);
    db.saveHeroBanners(updated);
    try { localStorage.setItem('babadham_hero_banners', JSON.stringify(updated)); } catch(e) {}
    saveBrandSettings({ heroBanners: updated });
    syncToStorefront(undefined, undefined, { ...brandSettings, heroBanners: updated });
  };

  const handleRemoveHeroBanner = (id: string) => {
    const updated = heroBanners.filter(b => b.id !== id);
    setHeroBanners(updated);
    db.saveHeroBanners(updated);
    try { localStorage.setItem('babadham_hero_banners', JSON.stringify(updated)); } catch(e) {}
    saveBrandSettings({ heroBanners: updated });
    syncToStorefront(undefined, undefined, { ...brandSettings, heroBanners: updated });
  };

  const handleMoveHeroBanner = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...heroBanners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBanners.length) {
      const temp = newBanners[index];
      newBanners[index] = newBanners[targetIndex];
      newBanners[targetIndex] = temp;
      setHeroBanners(newBanners);
      db.saveHeroBanners(newBanners);
      try { localStorage.setItem('babadham_hero_banners', JSON.stringify(newBanners)); } catch(e) {}
      saveBrandSettings({ heroBanners: newBanners });
      syncToStorefront(undefined, undefined, { ...brandSettings, heroBanners: newBanners });
    }
  };

  const handleClearAllHeroBanners = () => {
    setHeroBanners([]);
    db.saveHeroBanners([]);
    try {
      localStorage.setItem('babadham_hero_banners', JSON.stringify([]));
    } catch(e) {}
    saveBrandSettings({ heroBanners: [] });
    syncToStorefront(undefined, undefined, { ...brandSettings, heroBanners: [] });
  };

  const handleHeroBannerMediaUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let payloadData: string;
      const isVideo = file.type.startsWith('video');
      if (isVideo) {
        payloadData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else {
        payloadData = await compressImage(file);
      }

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: payloadData,
          type: 'hero-banner'
        })
      });
      const data = await res.json();
      if (data.success && data.path) {
        const freshUrl = `${data.path}?t=${Date.now()}`;
        if (isMobile) {
          handleUpdateHeroBanner(id, { mobileUrl: freshUrl, ...(isVideo ? { mediaType: 'video' } : {}) });
        } else {
          handleUpdateHeroBanner(id, { desktopUrl: freshUrl, ...(isVideo ? { mediaType: 'video' } : {}) });
        }
      }
    } catch (err) {
      console.warn('Upload error', err);
    }
  };

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
    // Broadcast hero banners update
    try {
      const channel = new BroadcastChannel('bbp_brand_sync');
      const banners = settings?.heroBanners !== undefined ? settings.heroBanners : heroBanners;
      channel.postMessage({ type: 'HERO_BANNERS_UPDATED', banners });
      channel.close();
    } catch(e) {}

    // Broadcast brand settings update (logo, favicon, etc.)
    try {
      const settingsToSync = settings !== undefined ? settings : db.getBrandSettings();
      if (logo !== undefined) settingsToSync.logoImageUrl = logo;
      if (favicon !== undefined) settingsToSync.faviconUrl = favicon;
      const channel2 = new BroadcastChannel('bbp_brand_sync');
      channel2.postMessage({ type: 'BRAND_SETTINGS_UPDATED', settings: settingsToSync });
      channel2.close();
    } catch(e) {}

    window.dispatchEvent(new Event('bbp_db_updated'));

    const frame = document.getElementById('babadham-sync-frame') as HTMLIFrameElement;
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({
        type: 'SYNC_BRANDING_CROSS_ORIGIN',
        logo: logo !== undefined ? logo : localStorage.getItem('babadham_logo_image'),
        favicon: favicon !== undefined ? favicon : localStorage.getItem('babadham_favicon_image'),
        settings: settings !== undefined ? JSON.stringify(settings) : localStorage.getItem('babadham_brand_settings')
      }, '*');
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
                  // Directly write to server DB so polling doesn't overwrite
                  fetch('/api/db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ brandSettings: { logoImageUrl: freshUrl } })
                  }).catch(() => {});
                } else if (key === 'babadham_favicon_image') {
                  saveBrandSettings({ faviconUrl: freshUrl });
                  syncToStorefront(undefined, freshUrl, undefined);
                  // Directly write to server DB so polling doesn't overwrite
                  fetch('/api/db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ brandSettings: { faviconUrl: freshUrl } })
                  }).catch(() => {});
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

  const handleSave = async (e: React.FormEvent) => {
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
      heroBanners: heroBanners
    };

    db.saveHeroBanners(heroBanners);
    db.saveBrandSettings(newSettings);

    try {
      localStorage.setItem('babadham_hero_banners', JSON.stringify(heroBanners));
      localStorage.setItem('babadham_brand_settings', JSON.stringify(newSettings));
    } catch (err) {}

    saveBrandSettings(newSettings);
    syncToStorefront(undefined, undefined, newSettings);
  };

  // Sub-Navigation Desk Items (Second Sidebar) - Clean, Minimalist & Badge-Free
  const deskNavItems = [
    { id: 'all', label: 'ALL CONFIGURATIONS', icon: LayoutGrid },
    { id: 'hero-banner', label: 'HERO BANNER MANAGER', icon: Tv },
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

          {/* Dedicated Hero Banner Table Manager */}
          {(activeSubTab === 'all' || activeSubTab === 'hero-banner') && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-6 shadow-lg w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4A62A]/20 pb-4">
                <div>
                  <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <Tv className="w-5 h-5" /> Dedicated Hero Banner Table Manager ({heroBanners.length})
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/60 mt-0.5">
                    Upload separate photo or video hero banners for desktop and mobile screens.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {heroBanners.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllHeroBanners}
                      className="h-10 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-4 h-4" /> Delete All Banners
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddHeroBanner}
                    className="h-10 px-4 rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add New Hero Banner
                  </button>
                </div>
              </div>

              {/* Banners List */}
              <div className="space-y-6">
                {heroBanners.map((banner, index) => (
                  <div 
                    key={banner.id}
                    className="p-5 rounded-2xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-4 relative shadow-md"
                  >
                    {/* Banner Card Header */}
                    <div className="flex items-center justify-between border-b border-[#F4A62A]/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#7A1126] text-[#F4A62A] font-bold text-xs flex items-center justify-center border border-[#F4A62A]/30">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={banner.title || ''}
                          onChange={(e) => handleUpdateHeroBanner(banner.id, { title: e.target.value })}
                          placeholder="Banner Title / Reference Name"
                          className="bg-[#120508] border border-[#F4A62A]/30 rounded-lg px-3 py-1 text-xs font-bold text-white focus:outline-none focus:border-[#F4A62A] w-48 sm:w-64"
                        />
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          banner.mediaType === 'video' ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {banner.mediaType}
                        </span>
                      </div>

                      {/* Reorder & Remove Controls */}
                      <div className="flex items-center gap-1.5">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveHeroBanner(index, 'up')}
                            className="p-1.5 text-[#F4A62A] hover:bg-[#2B1217] rounded-lg transition-colors cursor-pointer"
                            title="Move Banner Up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                        )}
                        {index < heroBanners.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveHeroBanner(index, 'down')}
                            className="p-1.5 text-[#F4A62A] hover:bg-[#2B1217] rounded-lg transition-colors cursor-pointer"
                            title="Move Banner Down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveHeroBanner(banner.id)}
                          className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer ml-1"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Media Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      
                      {/* Desktop Media Column */}
                      <div className="space-y-3 p-4 rounded-xl bg-[#120508] border border-[#F4A62A]/20">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#F4A62A] flex items-center gap-1.5">
                            🖥️ Desktop Media (Wide Screen)
                          </label>
                          <div className="flex items-center gap-1 bg-[#1A0B0E] p-1 rounded-lg border border-[#F4A62A]/20">
                            <button
                              type="button"
                              onClick={() => handleUpdateHeroBanner(banner.id, { mediaType: 'image' })}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                banner.mediaType === 'image' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#FFF8F0]/60 hover:text-white'
                              }`}
                            >
                              Image
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateHeroBanner(banner.id, { mediaType: 'video' })}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                banner.mediaType === 'video' ? 'bg-purple-900 text-purple-200' : 'text-[#FFF8F0]/60 hover:text-white'
                              }`}
                            >
                              Video
                            </button>
                          </div>
                        </div>

                        {/* Desktop Preview */}
                        <div className="w-full h-36 rounded-xl bg-[#2B1217]/60 border border-[#F4A62A]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                          {banner.desktopUrl ? (
                            banner.mediaType === 'video' ? (
                              <video src={banner.desktopUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                            ) : (
                              <img src={banner.desktopUrl} alt="Desktop Preview" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <span className="text-[11px] text-[#FFF8F0]/40 font-medium text-center px-4">
                              {banner.mediaType === 'video' ? 'No Desktop Video Uploaded' : 'No Desktop Image Uploaded'}
                            </span>
                          )}
                        </div>

                        {/* Upload & Delete Buttons */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer text-center shadow-md">
                            <Upload className="w-3.5 h-3.5" /> {banner.desktopUrl ? 'Replace' : 'Upload'} Desktop {banner.mediaType === 'video' ? 'Video' : 'Image'}
                            <input 
                              type="file" 
                              accept={banner.mediaType === 'video' ? 'video/*' : 'image/*'} 
                              onChange={(e) => handleHeroBannerMediaUpload(banner.id, e, false)} 
                              className="hidden" 
                            />
                          </label>
                          {banner.desktopUrl && (
                            <button
                              type="button"
                              onClick={() => handleUpdateHeroBanner(banner.id, { desktopUrl: '' })}
                              className="px-3 h-10 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-500/40 transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-md"
                              title="Delete Desktop Media"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Desktop
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mobile Media Column */}
                      <div className="space-y-3 p-4 rounded-xl bg-[#120508] border border-[#F4A62A]/20">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#F4A62A] flex items-center gap-1.5">
                            📱 Mobile Media (Phone Screen) <span className="text-[#F4A62A]/60 font-normal">(Optional)</span>
                          </label>
                        </div>

                        {/* Mobile Preview */}
                        <div className="w-full h-36 rounded-xl bg-[#2B1217]/60 border border-[#F4A62A]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                          {banner.mobileUrl ? (
                            banner.mediaType === 'video' ? (
                              <video src={banner.mobileUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                            ) : (
                              <img src={banner.mobileUrl} alt="Mobile Preview" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <span className="text-[11px] text-[#FFF8F0]/40 font-medium text-center px-4">
                              {banner.mediaType === 'video' ? 'Uses Desktop Video on Mobile' : 'Uses Desktop Image on Mobile'}
                            </span>
                          )}
                        </div>

                        {/* Upload & Delete Buttons */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#2B1217] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer text-center shadow-md">
                            <Upload className="w-3.5 h-3.5" /> {banner.mobileUrl ? 'Replace' : 'Upload'} Mobile {banner.mediaType === 'video' ? 'Video' : 'Image'}
                            <input 
                              type="file" 
                              accept={banner.mediaType === 'video' ? 'video/*' : 'image/*'} 
                              onChange={(e) => handleHeroBannerMediaUpload(banner.id, e, true)} 
                              className="hidden" 
                            />
                          </label>
                          {banner.mobileUrl && (
                            <button
                              type="button"
                              onClick={() => handleUpdateHeroBanner(banner.id, { mobileUrl: '' })}
                              className="px-3 h-10 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-500/40 transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-md"
                              title="Delete Mobile Media"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Mobile
                            </button>
                          )}
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

                {/* 3. Marquee Announcement Text & Timing Settings with ON/OFF Toggle Switch */}
                <div className="lg:col-span-2 border-t border-[#F4A62A]/20 pt-5 mt-4 space-y-4">
                  <div className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 space-y-4">
                    
                    {/* Header Row with Toggle Switch */}
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#F4A62A]/15 pb-3">
                      <div>
                        <h4 className="font-bold text-[#F4A62A] text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#F4A62A]" /> Marquee Announcement Ticker & Scroll Timing
                        </h4>
                        <p className="text-xs text-[#FFF8F0]/60 mt-0.5">
                          Turn the top homepage scrolling marquee bar ON or OFF, and customize text and scroll speed.
                        </p>
                      </div>

                      {/* Prominent ON/OFF Toggle Button */}
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
                          bEnableTicker 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {bEnableTicker ? 'STATUS: TICKER ON 🟢' : 'STATUS: TICKER OFF 🔴'}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = !bEnableTicker;
                            setBEnableTicker(newStatus);
                            const updated = {
                              ...brandSettings,
                              enableTicker: newStatus,
                              tickerAnnouncementText: bTickerAnnouncement,
                              tickerSpeedSeconds: bTickerSpeed
                            };
                            saveBrandSettings(updated);
                            syncToStorefront(undefined, undefined, updated);
                          }}
                          className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            bEnableTicker ? 'bg-emerald-600' : 'bg-red-950 border-red-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              bEnableTicker ? 'translate-x-7 bg-white' : 'translate-x-0 bg-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Announcement Inputs (Active when Ticker is ON) */}
                    {bEnableTicker ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
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
                            className="w-full h-11 px-4 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]"
                          />
                        </div>

                        {/* Scroll Timing / Speed */}
                        <div>
                          <label className="block text-xs font-bold text-[#F4A62A] mb-1">
                            Marquee Scroll Speed (Seconds)
                          </label>
                          <input
                            type="number"
                            min={10}
                            max={120}
                            value={bTickerSpeed}
                            onChange={(e) => setBTickerSpeed(Number(e.target.value) || 30)}
                            placeholder="e.g. 30"
                            className="w-full h-11 px-4 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/30 text-xs text-red-200/80 flex items-center justify-between">
                        <span>
                          🚫 <strong>Marquee Ticker is turned OFF.</strong> It is currently hidden from the website homepage.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setBEnableTicker(true);
                            const updated = { ...brandSettings, enableTicker: true };
                            saveBrandSettings(updated);
                            syncToStorefront(undefined, undefined, updated);
                          }}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-md text-[11px] transition-all cursor-pointer shadow"
                        >
                          Turn ON Ticker
                        </button>
                      </div>
                    )}

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
