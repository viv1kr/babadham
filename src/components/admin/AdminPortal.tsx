import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../db/mysqlSim';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  LogOut, 
  Plus, 
  Trash2, 
  TrendingUp,
  Users,
  IndianRupee,
  ShieldCheck,
  Palette,
  Save,
  Database,
  Sparkles,
  Lock,
  User,
  KeyRound,
  ArrowLeft,
  Eye,
  EyeOff,
  Menu,
  Phone,
  Mail,
  MapPin,
  FileText,
  Globe,
  Image as ImageIcon,
  Upload,
  MessageCircle
} from 'lucide-react';
import type { CustomDetail } from '../../types/ecommerce';

export const AdminPortal: React.FC = () => {
  const { 
    isAdminLoggedIn,
    isAdminDashboardOpen, 
    setIsAdminDashboardOpen, 
    adminLogin,
    adminLogout,
    brandSettings,
    updateBrandSettings,
    products,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'branding' | 'database'>('analytics');
  
  // Desktop Admin Sidebar State (Default: false = Icons Only on Desktop, click Hamburger to show text labels)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Login State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('baba@admin2026');
  const [showPassword, setShowPassword] = useState(false);

  // Brand Settings Form State
  const [bName, setBName] = useState(brandSettings?.brandName || 'BABA BAIDYANATH PRASADAM');
  const [bTagline, setBTagline] = useState(brandSettings?.tagline || 'aastha | seva | samarpan');
  const [bSacredText, setBSacredText] = useState(brandSettings?.topBarSacredText || 'ॐ हर हर महादेव ॐ');
  const [bPhone, setBPhone] = useState(brandSettings?.helplineNumber || '+91 98765 43210');
  const [bWhatsapp, setBWhatsapp] = useState(brandSettings?.whatsappNumber || '+91 98765 43211');
  const [bEmail, setBEmail] = useState(brandSettings?.supportEmail || 'support@babadham.org');
  const [bAddress, setBAddress] = useState(brandSettings?.address || 'Baidyanath Temple Complex, Main Gate Road, Deoghar, Jharkhand - 814112');
  const [bPdfUrl, setBPdfUrl] = useState(brandSettings?.cataloguePdfUrl || 'https://babadham.org/catalogue.pdf');
  const [bFssai, setBFssai] = useState(brandSettings?.fssaiLicenseNumber || '11124999000123');
  const [bLogoImageUrl, setBLogoImageUrl] = useState(brandSettings?.logoImageUrl || '');
  const [bFaviconUrl, setBFaviconUrl] = useState(brandSettings?.faviconUrl || '');

  const [customDetails, setCustomDetails] = useState<CustomDetail[]>(
    brandSettings?.customDetails || [
      { id: '1', label: 'GSTIN Registration', value: '20AAAAA0000A1Z5' },
      { id: '2', label: 'Temple Board Reg No', value: 'DEO-TEMPLE-2024-88' }
    ]
  );
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

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
          const compressed = canvas.toDataURL('image/png');
          
          fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              image: compressed, 
              type: key === 'babadham_favicon_image' ? 'favicon' : 'logo' 
            })
          }).then(res => res.json()).then(data => {
            if (data.success) {
              const freshUrl = `${data.path}?t=${Date.now()}`;
              callback(freshUrl);
              try {
                localStorage.setItem(key, freshUrl);
                updateBrandSettings(key === 'babadham_logo_image' ? { logoImageUrl: freshUrl } : { faviconUrl: freshUrl });
                window.dispatchEvent(new Event('bbp_db_updated'));
                window.dispatchEvent(new Event('storage'));
                
                const channel = new BroadcastChannel('bbp_brand_sync');
                channel.postMessage({ 
                  type: 'BRAND_SETTINGS_UPDATED', 
                  settings: key === 'babadham_logo_image' ? { ...brandSettings, logoImageUrl: freshUrl } : { ...brandSettings, faviconUrl: freshUrl } 
                });
                channel.close();
              } catch (err) {
                console.warn('Storage save error', err);
              }
            }
          }).catch(err => {
            console.error('File upload failed, falling back to local storage', err);
            callback(compressed);
            try {
              localStorage.setItem(key, compressed);
              updateBrandSettings(key === 'babadham_logo_image' ? { logoImageUrl: compressed } : { faviconUrl: compressed });
              window.dispatchEvent(new Event('bbp_db_updated'));
              window.dispatchEvent(new Event('storage'));
              
              const channel = new BroadcastChannel('bbp_brand_sync');
              channel.postMessage({ 
                type: 'BRAND_SETTINGS_UPDATED', 
                settings: key === 'babadham_logo_image' ? { ...brandSettings, logoImageUrl: compressed } : { ...brandSettings, faviconUrl: compressed } 
              });
              channel.close();
            } catch (err) {
              console.warn('Storage save error', err);
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



  // SQL Query State
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM products LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<any>(null);

  if (!isAdminDashboardOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(username, password);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('baba@admin2026');
    adminLogin('admin', 'baba@admin2026');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#120508] text-[#FFF8F0] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">
        
        {/* Clean Glassmorphism Container - 100% Mobile Responsive without background glow/shadow overflow */}
        <div className="w-full max-w-[94vw] sm:max-w-md bg-[#2B1217] backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-[#F4A62A]/40 shadow-xl relative text-center mx-auto my-auto box-border">
          
          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A0B0E] text-[#F4A62A] text-[11px] sm:text-xs font-bold border border-[#F4A62A]/30 hover:bg-[#7A1126] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Storefront
          </button>

          {/* Sacred Trident Emblem Badge */}
          <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto mb-3 mt-4 sm:mt-2 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A1126] via-[#F4A62A] to-[#D98C1F] p-[2px] shadow-md">
            <div className="w-full h-full rounded-[14px] bg-[#500A18] flex items-center justify-center text-2xl sm:text-3xl text-[#F4A62A]">
              🔱
            </div>
          </div>

          <h1 className="font-serif-temple text-center text-xl sm:text-2xl font-extrabold text-[#F4A62A] tracking-wide">
            Admin Security Login
          </h1>
          <p className="text-center text-[11px] sm:text-xs text-[#FFF8F0]/75 mt-1 mb-5">
            Command Center for Baidyanath Dham Prasad Delivery & Management
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
            
            {/* Mobile Responsive Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">Admin Username</label>
              <div className="relative">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4A62A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="w-full h-[46px] sm:h-[50px] pl-10 sm:pl-11 pr-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/40 text-xs sm:text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/40 font-medium focus:outline-none focus:border-[#F4A62A] transition-all"
                />
              </div>
            </div>

            {/* Mobile Responsive Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">Security Passkey</label>
              <div className="relative">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4A62A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Passkey"
                  className="w-full h-[46px] sm:h-[50px] pl-10 sm:pl-11 pr-10 sm:pr-11 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/40 text-xs sm:text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/40 font-medium focus:outline-none focus:border-[#F4A62A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4A62A]/70 hover:text-[#F4A62A] transition-colors p-1 cursor-pointer"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Credentials Helper Box */}
            <div className="p-3 rounded-xl bg-[#500A18]/60 border border-dashed border-[#F4A62A]/40 text-[10.5px] sm:text-[11.5px] text-[#F4A62A]">
              <div className="font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Default Master Credentials:
              </div>
              <div className="mt-1 text-[#FFF8F0]/90 font-mono break-all">
                User: <span className="text-white font-bold bg-[#1A0B0E] px-1.5 py-0.5 rounded border border-[#F4A62A]/30">admin</span> | Pass: <span className="text-white font-bold bg-[#1A0B0E] px-1.5 py-0.5 rounded border border-[#F4A62A]/30">baba@admin2026</span>
              </div>
            </div>

            {/* Mobile Responsive Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full h-[46px] sm:h-[50px] rounded-xl bg-gradient-to-r from-[#F4A62A] via-[#D98C1F] to-[#F4A62A] text-[#2B1A16] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                <span>Access Admin Portal</span>
              </button>

              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full h-[46px] sm:h-[50px] rounded-xl bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] font-bold text-xs sm:text-sm border border-[#F4A62A]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span>One-Click Instant Auto Login</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    );
  }

  const orders = db.getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);


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

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateBrandSettings({
      ...brandSettings,
      brandName: bName,
      tagline: bTagline,
      topBarSacredText: bSacredText,
      helplineNumber: bPhone,
      whatsappNumber: bWhatsapp,
      supportEmail: bEmail,
      address: bAddress,
      cataloguePdfUrl: bPdfUrl,
      fssaiLicenseNumber: bFssai,
      logoImageUrl: bLogoImageUrl,
      faviconUrl: bFaviconUrl,
      customDetails: customDetails
    });

    try {
      const channel = new BroadcastChannel('bbp_brand_sync');
      channel.postMessage({ type: 'BRAND_SETTINGS_UPDATED', settings: updated });
      channel.close();
    } catch (err) {
      console.warn('BroadcastChannel error', err);
    }

    showToast('Complete company brand settings & compliance updated!');
  };

  const handleExecuteSQL = (e: React.FormEvent) => {
    e.preventDefault();
    const result = db.executeSQL(sqlQuery);
    setSqlResult(result);
  };



  return (
    <div className="fixed inset-0 z-[999999] bg-[#120508] text-[#FFF8F0] flex flex-col font-sans overflow-hidden">
      
      {/* Top Admin Header Bar - Logo ONLY */}
      <header className="bg-[#2B1217] border-b border-[#F4A62A]/30 px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          {(brandSettings?.logoImageUrl || (typeof window !== 'undefined' ? localStorage.getItem('babadham_logo_image') : '')) ? (
            <img 
              src={brandSettings?.logoImageUrl || localStorage.getItem('babadham_logo_image') || ''} 
              alt="Company Logo" 
              className="max-h-10 max-w-[200px] object-contain drop-shadow-md" 
            />
          ) : (
            <span className="font-extrabold text-base text-[#F4A62A] font-serif-temple">
              {brandSettings?.brandName || 'ADMIN PORTAL'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Back to Customer Storefront Button */}
          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A1126] hover:bg-[#F4A62A] text-[#F4A62A] hover:text-[#2B1A16] text-xs font-bold transition-all border border-[#F4A62A]/40 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              adminLogout();
              setIsAdminDashboardOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-800 text-red-200 text-xs font-bold transition-all border border-red-500/40"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Administrative Workplace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`${isSidebarExpanded ? 'w-64' : 'w-16 sm:w-20'} bg-[#120508] border-r border-[#F4A62A]/20 flex flex-col shrink-0 transition-all duration-300 relative select-none`}>
          
          {/* Top Sidebar Header with Hamburger Toggle */}
          <div className="p-3 border-b border-[#F4A62A]/20 flex items-center justify-between">
            {isSidebarExpanded && (
              <span className="font-serif-temple font-extrabold text-xs text-[#F4A62A] tracking-wider px-2">
                COMMAND NAV
              </span>
            )}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="w-10 h-10 rounded-xl bg-transparent hover:text-[#F4A62A] text-[#FFF8F0]/70 flex items-center justify-center transition-all mx-auto cursor-pointer"
              title={isSidebarExpanded ? "Collapse to Icons Only" : "Expand to Show Menu Text"}
              aria-label="Toggle Admin Sidebar Menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div className="p-2 sm:p-3 space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center ${
                isSidebarExpanded ? 'justify-start px-2 py-2 gap-3' : 'justify-center p-1.5'
              } bg-transparent text-xs font-medium transition-all group relative cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'text-[#F4A62A] font-extrabold' 
                  : 'text-[#FFF8F0]/60 hover:text-[#F4A62A]'
              }`}
              title={!isSidebarExpanded ? "Dashboard & Stats" : undefined}
            >
              {activeTab === 'analytics' && (
                <div className="w-1 h-7 bg-[#F4A62A] rounded-r-full absolute left-0 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#F4A62A]" />
              )}

              <div 
                className={`w-10 h-10 flex items-center justify-center shrink-0 bg-transparent transition-transform group-hover:scale-110 ${
                  activeTab === 'analytics' ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'
                }`}
              >
                <LayoutDashboard className={`w-5.5 h-5.5 ${activeTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              {isSidebarExpanded && <span className="flex-1 text-left whitespace-nowrap truncate text-xs">Dashboard & Stats</span>}
              {!isSidebarExpanded && (
                <span className="absolute left-16 bg-[#2B1217] text-[#F4A62A] text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-[#F4A62A]/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Dashboard & Stats
                </span>
              )}
            </button>



            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center ${
                isSidebarExpanded ? 'justify-start px-2 py-2 gap-3' : 'justify-center p-1.5'
              } bg-transparent text-xs font-medium transition-all group relative cursor-pointer ${
                activeTab === 'branding' 
                  ? 'text-[#F4A62A] font-extrabold' 
                  : 'text-[#FFF8F0]/60 hover:text-[#F4A62A]'
              }`}
              title={!isSidebarExpanded ? "Brand Settings" : undefined}
            >
              {activeTab === 'branding' && (
                <div className="w-1 h-7 bg-[#F4A62A] rounded-r-full absolute left-0 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#F4A62A]" />
              )}

              <div 
                className={`w-10 h-10 flex items-center justify-center shrink-0 bg-transparent transition-transform group-hover:scale-110 ${
                  activeTab === 'branding' ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'
                }`}
              >
                <Palette className={`w-5.5 h-5.5 ${activeTab === 'branding' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              {isSidebarExpanded && <span className="flex-1 text-left whitespace-nowrap truncate text-xs">Brand Settings</span>}
              {!isSidebarExpanded && (
                <span className="absolute left-16 bg-[#2B1217] text-[#F4A62A] text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-[#F4A62A]/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Brand Settings
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center ${
                isSidebarExpanded ? 'justify-start px-2 py-2 gap-3' : 'justify-center p-1.5'
              } bg-transparent text-xs font-medium transition-all group relative cursor-pointer ${
                activeTab === 'database' 
                  ? 'text-[#F4A62A] font-extrabold' 
                  : 'text-[#FFF8F0]/60 hover:text-[#F4A62A]'
              }`}
              title={!isSidebarExpanded ? "SQL Query Console" : undefined}
            >
              {activeTab === 'database' && (
                <div className="w-1 h-7 bg-[#F4A62A] rounded-r-full absolute left-0 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#F4A62A]" />
              )}

              <div 
                className={`w-10 h-10 flex items-center justify-center shrink-0 bg-transparent transition-transform group-hover:scale-110 ${
                  activeTab === 'database' ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'
                }`}
              >
                <Database className={`w-5.5 h-5.5 ${activeTab === 'database' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              {isSidebarExpanded && <span className="flex-1 text-left whitespace-nowrap truncate text-xs">SQL Query Console</span>}
              {!isSidebarExpanded && (
                <span className="absolute left-16 bg-[#2B1217] text-[#F4A62A] text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-[#F4A62A]/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  SQL Query Console
                </span>
              )}
            </button>

          </div>

          <div className="p-3 border-t border-[#F4A62A]/20 bg-transparent text-[11px] text-[#FFF8F0]/70 flex items-center justify-center">
            <div className="flex items-center gap-2 text-[#F4A62A] font-bold">
              <div className="w-7 h-7 flex items-center justify-center">
                <Sparkles className="w-4 h-4 shrink-0 text-[#F4A62A]" />
              </div>
              {isSidebarExpanded && <span>Deoghar Node • Online</span>}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#120508] p-4 sm:p-6 overflow-y-auto">
          
          {/* TAB 1: ANALYTICS & OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
                  <div className="flex items-center justify-between text-[#F4A62A]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Total Revenue</span>
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last week
                  </div>
                </div>

                <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
                  <div className="flex items-center justify-between text-[#F4A62A]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Total Orders</span>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{orders.length}</div>
                  <div className="text-[11px] text-[#F4A62A] mt-1">
                    {orders.filter(o => o.orderStatus !== 'DELIVERED').length} active dispatches
                  </div>
                </div>

                <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
                  <div className="flex items-center justify-between text-[#F4A62A]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Active Products</span>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{products.length}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">100% Temple Verified</div>
                </div>

                <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
                  <div className="flex items-center justify-between text-[#F4A62A]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Registered Devotees</span>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">1,248</div>
                  <div className="text-[11px] text-[#F4A62A] mt-1">Pan India Devotees</div>
                </div>

              </div>

              {/* Recent Orders Overview */}
              <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">
                    Recent Devotee Orders & Dispatch Stream
                  </h3>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#FFF8F0]/60">
                    No orders placed yet. Test ordering from storefront!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Devotee Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F4A62A]/10">
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id} className="hover:bg-[#1A0B0E]/50">
                            <td className="p-3 font-mono font-bold text-[#F4A62A]">{order.id}</td>
                            <td className="p-3 font-medium">{order.address.fullName}</td>
                            <td className="p-3 text-[#FFF8F0]/80">{order.address.phone}</td>
                            <td className="p-3 font-bold">₹{order.totalAmount}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">{order.paymentMethod}</span></td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-[#7A1126] text-[#F4A62A] text-[10px] font-bold">
                                {order.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}



          {/* TAB 5: BRANDING SETTINGS */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6 w-full text-xs sm:text-sm">
              
              {/* 1. Full Width Logo & Favicon Uploader */}
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

                </div>
              </div>

              {/* 2. Full Width Brand Identity */}
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

              {/* 3. Full Width Contact & WhatsApp Support */}
              <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
                <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                  <Phone className="w-5 h-5" /> Contact Numbers & Official Address
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

                  {/* WhatsApp Support Number Input */}
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

              {/* 4. Full Width Compliance & Catalogue */}
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

              {/* 5. Full Width Additional Details */}
              <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
                <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                  <Globe className="w-5 h-5" /> Additional Custom Company Details (GSTIN, Reg No, etc.)
                </h3>

                {/* Existing Custom Details List */}
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

                {/* Add New Custom Detail Inputs */}
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

              {/* Full Width Submit Button */}
              <div className="pt-3 text-right w-full">
                <button
                  type="submit"
                  className="h-[52px] px-10 rounded-xl bg-[#F4A62A] hover:bg-white text-[#2B1A16] font-extrabold text-sm transition-all shadow-xl flex items-center gap-2 ml-auto cursor-pointer"
                >
                  <Save className="w-5 h-5" /> Save Complete Brand Settings
                </button>
              </div>

            </form>
          )}

          {/* TAB 6: DATABASE & SQL QUERY */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              
              <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4">
                <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                  <Database className="w-5 h-5" /> MySQL Database Console & Runner
                </h3>

                <form onSubmit={handleExecuteSQL} className="space-y-3">
                  <textarea
                    rows={4}
                    value={sqlQuery}
                    onChange={e => setSqlQuery(e.target.value)}
                    placeholder="Enter SQL Query (e.g. SELECT * FROM products;)"
                    className="w-full p-3 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 font-mono text-xs text-emerald-300 focus:outline-none focus:border-[#F4A62A]"
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-[#FFF8F0]/60">
                      Supports `SELECT * FROM products`, `SELECT * FROM orders`, etc.
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md flex items-center gap-1"
                    >
                      Execute Query
                    </button>
                  </div>
                </form>

                {sqlResult && (
                  <div className="mt-4 p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 overflow-x-auto space-y-2">
                    <div className="text-xs font-bold text-[#F4A62A]">Query Output:</div>
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#F4A62A]/30 text-[#F4A62A]">
                          {sqlResult.columns.map((c: string, idx: number) => (
                            <th key={idx} className="p-2">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.rows.map((r: any, idx: number) => (
                          <tr key={idx} className="border-b border-[#F4A62A]/10">
                            {sqlResult.columns.map((c: string, cIdx: number) => (
                              <td key={cIdx} className="p-2 text-white/90">{String(r[c] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};
