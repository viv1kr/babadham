import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../db/mysqlSim';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  LogOut, 
  X, 
  Plus, 
  Trash2, 
  TrendingUp,
  Users,
  IndianRupee,
  ShieldCheck,
  Palette,
  Save,
  Upload
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const { 
    isAdminDashboardOpen, 
    setIsAdminDashboardOpen, 
    adminLogout,
    adminAddCategory,
    adminDeleteCategory,
    brandSettings,
    updateBrandSettings,
    products,
    categories
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'branding' | 'categories'>('analytics');

  // Brand Settings Form State
  const [bName, setBName] = useState(brandSettings?.brandName || 'BABA BAIDYANATH PRASADAM');
  const [bTagline, setBTagline] = useState(brandSettings?.tagline || 'aastha | seva | samarpan');
  const [bSacredText, setBSacredText] = useState(brandSettings?.topBarSacredText || 'ॐ हर हर महादेव ॐ');
  const [bPhone, setBPhone] = useState(brandSettings?.helplineNumber || '+91 98765 43210');
  const [bNeedHelp, setBNeedHelp] = useState(brandSettings?.needHelpText || 'Need Help?');
  const [bFeat1, setBFeat1] = useState(brandSettings?.feature1 || '100% Authentic');
  const [bFeat2, setBFeat2] = useState(brandSettings?.feature2 || 'Temple Blessed');
  const [bFeat3, setBFeat3] = useState(brandSettings?.feature3 || 'Secure Packaging');
  const [bFeat4, setBFeat4] = useState(brandSettings?.feature4 || 'Pan India Delivery');

  // Hero Slide Form State
  const [slidesList, setSlidesList] = useState<any[]>(brandSettings?.heroSlides || []);
  const [slideType, setSlideType] = useState<'image' | 'video'>('image');
  const [slideMediaUrl, setSlideMediaUrl] = useState('');
  const [slideMobileMediaUrl, setSlideMobileMediaUrl] = useState('');
  const [slideEnableGradient, setSlideEnableGradient] = useState<boolean>(true);
  const [slideHeading, setSlideHeading] = useState('');
  const [slideDesc, setSlideDesc] = useState('');
  const [slideBtnText, setSlideBtnText] = useState('');
  const [slideBtnLink, setSlideBtnLink] = useState('');

  const handleImageCompress = (file: File, isMobile: boolean, setter: (val: string) => void) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (file.type.startsWith('video/')) {
        setter(evt.target?.result as string);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxW = isMobile ? 800 : 1600;
        const maxH = isMobile ? 1200 : 900;
        
        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
        if (height > maxH) {
          width = Math.round((width * maxH) / height);
          height = maxH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setter(canvas.toDataURL('image/webp', 0.6));
        } else {
          setter(evt.target?.result as string);
        }
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isAdminDashboardOpen) return null;

  const orders = db.getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#2B1A16]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A] overflow-hidden my-6 flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="bg-[#7A1126] px-6 py-4 text-[#FFF8F0] border-b border-[#F4A62A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4A62A] text-[#2B1A16] flex items-center justify-center font-bold text-xl">
                🔱
              </div>
              <div>
                <h2 className="font-serif-temple font-extrabold text-2xl text-[#F4A62A] leading-tight">
                  Baba Baidyanath Admin Portal
                </h2>
                <p className="text-xs text-[#FFF8F0]/80">
                  Deoghar Dham Inventory & Devotee Orders Command Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={adminLogout}
                className="px-3.5 py-2 rounded-xl bg-[#500A18] text-[#F4A62A] hover:bg-white hover:text-[#7A1126] font-bold text-xs transition-colors flex items-center gap-1.5 border border-[#F4A62A]/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              <button
                onClick={() => setIsAdminDashboardOpen(false)}
                className="p-2 text-[#FFF8F0] hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="bg-[#FFF8F0] border-b border-[#7A1126]/10 px-6 py-2 flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#7A1126]/70 hover:bg-[#7A1126]/10'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Analytics Overview</span>
            </button>



            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === 'branding' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#7A1126]/70 hover:bg-[#7A1126]/10'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === 'categories' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#7A1126]/70 hover:bg-[#7A1126]/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Tab 1: Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#F4A62A]/40 shadow-sm space-y-1">
                    <div className="text-xs text-[#2B1A16]/60 font-semibold flex items-center justify-between">
                      <span>Total Revenue</span>
                      <IndianRupee className="w-4 h-4 text-[#7A1126]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#7A1126]">₹{totalRevenue}</div>
                    <div className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +24% vs last festival
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#F4A62A]/40 shadow-sm space-y-1">
                    <div className="text-xs text-[#2B1A16]/60 font-semibold flex items-center justify-between">
                      <span>Orders Handled</span>
                      <ShoppingBag className="w-4 h-4 text-[#7A1126]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#7A1126]">{orders.length}</div>
                    <div className="text-[10px] text-[#D98C1F] font-bold">100% Express Dispatched</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#F4A62A]/40 shadow-sm space-y-1">
                    <div className="text-xs text-[#2B1A16]/60 font-semibold flex items-center justify-between">
                      <span>Active Devotees</span>
                      <Users className="w-4 h-4 text-[#7A1126]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#7A1126]">1,840+</div>
                    <div className="text-[10px] text-green-700 font-bold">98.5% Positive Feedback</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#F4A62A]/40 shadow-sm space-y-1">
                    <div className="text-xs text-[#2B1A16]/60 font-semibold flex items-center justify-between">
                      <span>Live Catalog Items</span>
                      <Package className="w-4 h-4 text-[#7A1126]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#7A1126]">{products.length}</div>
                    <div className="text-[10px] text-[#7A1126] font-bold">In Stock & Verified</div>
                  </div>
                </div>

                {/* Shinghasan Temple Sevak Activity Banner */}
                <div className="p-6 rounded-3xl bg-[#7A1126] text-[#FFF8F0] border border-[#F4A62A] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F4A62A] text-[#2B1A16] text-[10px] font-extrabold uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" /> Garbhagriha Command Status
                    </div>
                    <h3 className="font-serif-temple font-bold text-2xl text-[#F4A62A]">
                      Deoghar Daily Sandhya Aarti Bhog Ready
                    </h3>
                    <p className="text-xs text-[#FFF8F0]/80">
                      All new orders are automatically queued for Chief Pujari touch blessing before express air shipment.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white border border-[#F4A62A]/40 shadow-sm space-y-5">
                  <div>
                    <h3 className="font-serif-temple font-bold text-xl text-[#7A1126]">
                      Branding & Header Elements Editor
                    </h3>
                    <p className="text-xs text-[#2B1A16]/70 mt-1">
                      Customize top bar text, phone number, brand name, tagline, and top feature badges in real time.
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateBrandSettings({
                        brandName: bName,
                        tagline: bTagline,
                        topBarSacredText: bSacredText,
                        helplineNumber: bPhone,
                        needHelpText: bNeedHelp,
                        feature1: bFeat1,
                        feature2: bFeat2,
                        feature3: bFeat3,
                        feature4: bFeat4,
                        heroSlides: slidesList
                      });
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={bName}
                          onChange={e => setBName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border font-bold text-[#7A1126]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Tagline *</label>
                        <input
                          type="text"
                          required
                          value={bTagline}
                          onChange={e => setBTagline(e.target.value)}
                          className="w-full p-2.5 rounded-xl border font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Top Bar Sacred Text</label>
                        <input
                          type="text"
                          value={bSacredText}
                          onChange={e => setBSacredText(e.target.value)}
                          className="w-full p-2.5 rounded-xl border"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Helpline Phone Number</label>
                        <input
                          type="text"
                          value={bPhone}
                          onChange={e => setBPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Need Help Text</label>
                        <input
                          type="text"
                          value={bNeedHelp}
                          onChange={e => setBNeedHelp(e.target.value)}
                          className="w-full p-2.5 rounded-xl border"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <label className="block font-bold mb-2 text-[#7A1126]">Top Bar 4 Feature Badges</label>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Feature 1</label>
                          <input
                            type="text"
                            value={bFeat1}
                            onChange={e => setBFeat1(e.target.value)}
                            className="w-full p-2 rounded-xl border"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Feature 2</label>
                          <input
                            type="text"
                            value={bFeat2}
                            onChange={e => setBFeat2(e.target.value)}
                            className="w-full p-2 rounded-xl border"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Feature 3</label>
                          <input
                            type="text"
                            value={bFeat3}
                            onChange={e => setBFeat3(e.target.value)}
                            className="w-full p-2 rounded-xl border"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Feature 4</label>
                          <input
                            type="text"
                            value={bFeat4}
                            onChange={e => setBFeat4(e.target.value)}
                            className="w-full p-2 rounded-xl border"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Section Carousel Manager */}
                    <div className="border-t pt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif-temple font-bold text-base text-[#7A1126]">
                            Hero Section Sliding Banner & Video Manager
                          </h4>
                          <p className="text-[11px] text-[#2B1A16]/70">
                            Add sliding images or videos. Heading, description, button text, and links are completely optional!
                          </p>
                        </div>
                      </div>

                      {/* Add New Slide Subform */}
                      <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#7A1126]/20 space-y-3">
                        <div className="font-bold text-xs text-[#7A1126]">Add New Hero Slide</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Media Type *</label>
                            <select
                              value={slideType}
                              onChange={(e: any) => setSlideType(e.target.value)}
                              className="w-full p-2 rounded-lg border text-xs bg-white font-bold"
                            >
                              <option value="image">Image Slide</option>
                              <option value="video">Video Slide (.mp4)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Desktop Media Banner *</label>
                            <input
                              type="text"
                              required
                              value={slideMediaUrl}
                              onChange={e => setSlideMediaUrl(e.target.value)}
                              placeholder={slideType === 'video' ? 'Desktop video URL...' : 'Desktop image URL...'}
                              className="w-full p-2 rounded-lg border text-xs"
                            />
                            <label className="mt-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#7A1126]/10 text-[#7A1126] font-bold text-[10px] cursor-pointer hover:bg-[#7A1126] hover:text-white transition-colors border border-[#7A1126]/20">
                              <Upload className="w-3 h-3" /> Upload Desktop File
                              <input 
                                type="file" 
                                accept={slideType === 'video' ? 'video/*' : 'image/*'}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageCompress(file, false, setSlideMediaUrl);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Mobile Media Banner (Optional)</label>
                            <input
                              type="text"
                              value={slideMobileMediaUrl}
                              onChange={e => setSlideMobileMediaUrl(e.target.value)}
                              placeholder="Optional mobile image/video..."
                              className="w-full p-2 rounded-lg border text-xs"
                            />
                            <label className="mt-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#F4A62A]/20 text-[#7A1126] font-bold text-[10px] cursor-pointer hover:bg-[#F4A62A] transition-colors border border-[#F4A62A]/40">
                              <Upload className="w-3 h-3" /> Upload Mobile File
                              <input 
                                type="file" 
                                accept={slideType === 'video' ? 'video/*' : 'image/*'}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageCompress(file, true, setSlideMobileMediaUrl);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Dark Gradient Overlay *</label>
                            <select
                              value={slideEnableGradient ? 'yes' : 'no'}
                              onChange={(e) => setSlideEnableGradient(e.target.value === 'yes')}
                              className="w-full p-2 rounded-lg border text-xs bg-white font-bold"
                            >
                              <option value="yes">Yes - Dark Gradient Overlay (High Text Contrast)</option>
                              <option value="no">No Overlay (Raw Pure Media)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Heading (Optional)</label>
                            <input
                              type="text"
                              value={slideHeading}
                              onChange={e => setSlideHeading(e.target.value)}
                              placeholder="e.g. Authentic Deoghar Temple Prasad"
                              className="w-full p-2 rounded-lg border text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Description (Optional)</label>
                            <input
                              type="text"
                              value={slideDesc}
                              onChange={e => setSlideDesc(e.target.value)}
                              placeholder="e.g. Delivered directly from Baba Baidyanath Dham"
                              className="w-full p-2 rounded-lg border text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Button Text (Optional)</label>
                            <input
                              type="text"
                              value={slideBtnText}
                              onChange={e => setSlideBtnText(e.target.value)}
                              placeholder="e.g. Explore Offerings"
                              className="w-full p-2 rounded-lg border text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold mb-1">Button Link (Optional)</label>
                            <input
                              type="text"
                              value={slideBtnLink}
                              onChange={e => setSlideBtnLink(e.target.value)}
                              placeholder="e.g. #featured-products or live-darshan"
                              className="w-full p-2 rounded-lg border text-xs"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (slideMediaUrl.trim()) {
                              const newSlide = {
                                id: `slide-${Date.now()}`,
                                type: slideType,
                                mediaUrl: slideMediaUrl,
                                mobileMediaUrl: slideMobileMediaUrl.trim() || undefined,
                                enableGradient: slideEnableGradient,
                                heading: slideHeading || undefined,
                                description: slideDesc || undefined,
                                buttonText: slideBtnText || undefined,
                                buttonLink: slideBtnLink || undefined
                              };
                              const updated = [...slidesList, newSlide];
                              setSlidesList(updated);
                              updateBrandSettings({ heroSlides: updated });
                              setSlideMediaUrl('');
                              setSlideMobileMediaUrl('');
                              setSlideEnableGradient(true);
                              setSlideHeading('');
                              setSlideDesc('');
                              setSlideBtnText('');
                              setSlideBtnLink('');
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-[#7A1126] text-[#F4A62A] font-bold text-xs hover:bg-[#500A18] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Slide to Carousel</span>
                        </button>
                      </div>

                      {/* Current Hero Slides List */}
                      {slidesList.length > 0 && (
                        <div className="space-y-2">
                          <div className="font-bold text-xs text-[#7A1126]">Active Hero Slides ({slidesList.length})</div>
                          <div className="grid grid-cols-1 gap-2">
                            {slidesList.map((slide, idx) => (
                              <div key={slide.id || idx} className="p-3 rounded-xl bg-white border border-[#7A1126]/20 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  {slide.type === 'video' ? (
                                    <div className="w-12 h-12 rounded-lg bg-black text-[#F4A62A] flex items-center justify-center font-bold text-[10px]">
                                      VIDEO
                                    </div>
                                  ) : (
                                    <img src={slide.mediaUrl} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                                  )}
                                  <div>
                                    <div className="font-bold text-[#7A1126] flex items-center gap-2">
                                      <span>{slide.heading || 'No Heading (Media Only)'}</span>
                                      {slide.mobileMediaUrl && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">📱 Custom Mobile Banner</span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-[#2B1A16]/60 line-clamp-1">{slide.description || slide.mediaUrl}</div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = slidesList.filter((_, i) => i !== idx);
                                    setSlidesList(updated);
                                    updateBrandSettings({ heroSlides: updated });
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Remove Slide"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t">
                      <button
                        type="submit"
                        className="px-6 py-3 min-h-[46px] rounded-lg bg-[#7A1126] text-[#F4A62A] font-bold text-xs hover:bg-[#500A18] flex items-center gap-2 shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Header, Hero Slider & Branding Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 6: Categories Management */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="bg-white border border-[#7A1126]/10 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-black text-[#7A1126] mb-4">Add New Category</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newCategory = {
                      id: formData.get('id') as string,
                      name: formData.get('name') as string,
                      hindiName: formData.get('hindiName') as string,
                      slug: formData.get('id') as string,
                      iconName: 'package',
                      itemCount: 0,
                      tagline: formData.get('tagline') as string,
                      image: formData.get('image') as string,
                    };
                    adminAddCategory(newCategory);
                    e.currentTarget.reset();
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="id" required placeholder="Category ID (e.g. books)" className="px-4 py-2 border rounded-xl" />
                    <input name="name" required placeholder="Name (e.g. Sacred Books)" className="px-4 py-2 border rounded-xl" />
                    <input name="hindiName" required placeholder="Hindi Name (e.g. पवित्र पुस्तकें)" className="px-4 py-2 border rounded-xl" />
                    <input name="tagline" required placeholder="Tagline" className="px-4 py-2 border rounded-xl" />
                    
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-[#7A1126]">Category Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        required
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7A1126]/10 file:text-[#7A1126] hover:file:bg-[#7A1126]/20 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageCompress(file, false, (base64) => {
                              const hiddenInput = document.createElement('input');
                              hiddenInput.type = 'hidden';
                              hiddenInput.name = 'image';
                              hiddenInput.value = base64;
                              e.target.parentElement?.appendChild(hiddenInput);
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-[#7A1126] text-[#F4A62A] px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#500A18] transition-colors">
                        <Plus className="w-5 h-5" /> Add Category
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white border border-[#7A1126]/10 rounded-2xl p-6 shadow-sm overflow-hidden">
                  <h3 className="text-xl font-black text-[#7A1126] mb-4">Existing Categories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat: any) => (
                      <div key={cat.id} className="border border-[#7A1126]/10 rounded-xl overflow-hidden flex flex-col relative group">
                        <img src={cat.image || 'https://via.placeholder.com/300x150?text=No+Image'} alt={cat.name} className="w-full h-32 object-cover" />
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-[#7A1126]">{cat.name}</h4>
                              <p className="text-xs text-gray-500">{cat.hindiName}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-4 line-clamp-2">{cat.tagline}</p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className="text-[10px] bg-[#7A1126]/10 text-[#7A1126] px-2 py-1 rounded-full">{cat.itemCount} Items</span>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Delete category ${cat.name}?`)) {
                                  adminDeleteCategory(cat.id);
                                }
                              }}
                              className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
