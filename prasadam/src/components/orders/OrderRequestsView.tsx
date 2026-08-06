import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Eye, 
  Sparkles,
  MessageSquare,
  Send,
  Image as ImageIcon,
  ShieldCheck,
  Tv,
  Save,
  Upload,
  Trash2,
  MoveUp,
  MoveDown,
  Award,
  Video,
  Link as LinkIcon,
  HelpCircle,
  Share2,
  Bookmark,
  Volume2,
  Bell
} from 'lucide-react';
import type { HeroSlide, OrderRequestTrustBadge, OrderRequestMediaConfig } from '../../types/ecommerce';
import { BookingSlotsView } from '../bookings/BookingSlotsView';

export interface OrderRequest {
  id: string;
  reqNo: string;
  devoteeName: string;
  phone: string;
  email: string;
  address: string;
  requestType: string;
  details: string;
  visited?: string;
  age?: string;
  specialRequest?: string;
  preferredDate: string;
  estimatedAmount: number;
  status: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
  createdAt: string;
  notes?: string;
}

const INITIAL_REQUESTS: OrderRequest[] = [
  {
    id: 'req-1',
    reqNo: 'REQ-2026-901',
    devoteeName: 'Rameshwar Nath Prasad',
    phone: '+91 94311 88210',
    email: 'rameshwar.prasad@gmail.com',
    address: 'Bari Bazaar, Deoghar, Jharkhand - 814112',
    requestType: 'Special Mahaprasad & Rudrabhishek Bhog',
    details: '5kg Pure Cow Milk Peda, 2 Litres Sacred Gangajal & Fresh Belpatra Garland for Somvar Special Puja.',
    visited: 'Yes',
    age: '45',
    specialRequest: 'Morning garbhagriha touch blessing requested.',
    preferredDate: '2026-08-10',
    estimatedAmount: 3500,
    status: 'Pending',
    createdAt: '2026-08-06T09:30:00Z',
    notes: 'Devotee requested morning garbhagriha touch blessing.'
  },
  {
    id: 'req-2',
    reqNo: 'REQ-2026-902',
    devoteeName: 'Sunita Devi Singhania',
    phone: '+91 98351 44520',
    email: 'sunita.singhania@yahoo.com',
    address: 'Kankurgachi, Kolkata, West Bengal - 700054',
    requestType: 'Bulk Peda Prasad for Family Anushthan',
    details: '15kg Special Peda Prasad packed in 250g tamper-proof sacred gift tins.',
    visited: 'Yes',
    age: '52',
    specialRequest: 'Pack in sacred red gift tins.',
    preferredDate: '2026-08-15',
    estimatedAmount: 9600,
    status: 'Approved',
    createdAt: '2026-08-05T14:15:00Z',
    notes: 'Payment confirmed via UPI. Dispatch on Aug 12 via Speed Post.'
  },
  {
    id: 'req-3',
    reqNo: 'REQ-2026-903',
    devoteeName: 'Vikramaditya Roy',
    phone: '+91 88772 11099',
    email: 'v.roy@techmail.com',
    address: 'Boring Road, Patna, Bihar - 800001',
    requestType: 'Authentic Sphatik & Silver Shivalinga Pack',
    details: '108 Bead Original Haridwar Sphatik Mala + Baidyanath Jyotirlinga Silver Idol for Griha Pravesh.',
    visited: 'No',
    age: '38',
    specialRequest: 'Include energized bilva leaf.',
    preferredDate: '2026-08-12',
    estimatedAmount: 5400,
    status: 'Processing',
    createdAt: '2026-08-04T11:00:00Z'
  },
  {
    id: 'req-4',
    reqNo: 'REQ-2026-904',
    devoteeName: 'Prof. Anil Kumar Jha',
    phone: '+91 91223 99411',
    email: 'akjha.deoghar@univ.ac.in',
    address: 'VVIP Guest House Road, Deoghar, Jharkhand - 814112',
    requestType: 'Chandi Path Prasad Box',
    details: '2kg Kesar Peda, Silver Coin & Blessed Chunri.',
    visited: 'Yes',
    age: '61',
    specialRequest: 'Direct pickup from temple desk.',
    preferredDate: '2026-08-08',
    estimatedAmount: 2800,
    status: 'Completed',
    createdAt: '2026-08-02T16:45:00Z'
  }
];

const STORAGE_KEY = 'babadham_order_requests';

export const OrderRequestsView: React.FC = () => {
  const { brandSettings, saveBrandSettings, showToast } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'hero' | 'trust' | 'media' | 'manage-slots'>('leads');

  const [requests, setRequests] = useState<OrderRequest[]>([]);

  const loadOrderRequests = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRequests(parsed);
          return;
        }
      }

      const dbStr = localStorage.getItem('babadham_mysql_db_v1');
      if (dbStr) {
        const parsedDb = JSON.parse(dbStr);
        if (Array.isArray(parsedDb.orderRequests) && parsedDb.orderRequests.length > 0) {
          setRequests(parsedDb.orderRequests);
          return;
        }
      }

      setRequests(INITIAL_REQUESTS);
    } catch (e) {
      setRequests(INITIAL_REQUESTS);
    }
  };

  useEffect(() => {
    loadOrderRequests();

    const handleSync = () => {
      loadOrderRequests();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('bbp_db_updated', handleSync);
    window.addEventListener('bbp_requests_updated', handleSync);

    const interval = setInterval(handleSync, 1000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('bbp_db_updated', handleSync);
      window.removeEventListener('bbp_requests_updated', handleSync);
      clearInterval(interval);
    };
  }, []);

  const persistRequests = (updatedRequests: OrderRequest[]) => {
    try {
      setRequests(updatedRequests);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));

      const dbStr = localStorage.getItem('babadham_mysql_db_v1');
      if (dbStr) {
        const parsedDb = JSON.parse(dbStr);
        parsedDb.orderRequests = updatedRequests;
        localStorage.setItem('babadham_mysql_db_v1', JSON.stringify(parsedDb));
      }

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bbp_db_updated'));
    } catch (err) {}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRequest, setSelectedRequest] = useState<OrderRequest | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [newDevoteeName, setNewDevoteeName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newRequestType, setNewRequestType] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newPreferredDate, setNewPreferredDate] = useState('');
  const [newEstimatedAmount, setNewEstimatedAmount] = useState('');

  // Hero Slider Subtab State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    brandSettings?.orderRequestHeroSlides && brandSettings.orderRequestHeroSlides.length > 0 ? brandSettings.orderRequestHeroSlides : [
      {
        id: 'slide-1',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1600&q=80',
        heading: 'Direct Garbhagriha Bhog Prasad',
        description: 'Touch-blessed at Baidyanath Jyotirlinga & delivered directly to your doorstep.',
        buttonText: 'Order Bhog Prasad',
        buttonLink: '#order-request'
      },
      {
        id: 'slide-2',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&w=1600&q=80',
        heading: 'Bulk Prasad & Devotee Seva',
        description: 'Special Shravani Mela, Marriage & Family Anushthan Custom Prasad Boxes.',
        buttonText: 'Submit Custom Request',
        buttonLink: '#order-request'
      }
    ]
  );

  // Trust Badges Subtab State
  const [trustBadges, setTrustBadges] = useState<OrderRequestTrustBadge[]>(
    brandSettings?.orderRequestTrustBadges || [
      { id: 'tb-1', iconName: 'Award', title: '100% Authentic Prasad', subtitle: 'Pure Cow Milk Peda from Deoghar' },
      { id: 'tb-2', iconName: 'ShieldCheck', title: 'Garbhagriha Touch Blessed', subtitle: 'Offered at Shinghasan before dispatch' },
      { id: 'tb-3', iconName: 'Clock', title: 'Quick Callback & Advice', subtitle: 'Seva team connects within 1 hour' }
    ]
  );

  // Video & Media Subtab State
  const [mediaConfig, setMediaConfig] = useState<OrderRequestMediaConfig>(
    brandSettings?.orderRequestMediaConfig || {
      videoUrl: '',
      videoTitle: '',
      videoSubtitle: '',
      bannerBgImageUrl: ''
    }
  );

  const syncToStorefront = (updatedSettings: any) => {
    try {
      localStorage.setItem('babadham_brand_settings', JSON.stringify(updatedSettings));
    } catch {}

    try {
      const channel = new BroadcastChannel('bbp_brand_sync');
      channel.postMessage({ type: 'BRAND_SETTINGS_UPDATED', settings: updatedSettings });
      channel.close();
    } catch (e) {}

    try {
      const dbChannel = new BroadcastChannel('bbp_db_sync');
      dbChannel.postMessage({ type: 'DB_UPDATED' });
      dbChannel.close();
    } catch (e) {}

    const frame = document.getElementById('babadham-sync-frame') as HTMLIFrameElement;
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({
        type: 'SYNC_BRANDING_CROSS_ORIGIN',
        settings: JSON.stringify(updatedSettings)
      }, '*');
    }
  };

  // Lead Status Updater
  const updateStatus = (id: string, newStatus: OrderRequest['status']) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Order Request ${id} status updated to ${newStatus}`);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevoteeName || !newPhone || !newRequestType) return;

    const newReq: OrderRequest = {
      id: `req-${Date.now()}`,
      reqNo: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      devoteeName: newDevoteeName,
      phone: newPhone,
      email: newEmail || 'devotee@babadham.org',
      address: newAddress || 'Deoghar Dham',
      requestType: newRequestType,
      details: newDetails || newRequestType,
      preferredDate: newPreferredDate || new Date().toISOString().split('T')[0],
      estimatedAmount: parseFloat(newEstimatedAmount) || 1000,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    persistRequests([newReq, ...requests]);
    setIsCreateModalOpen(false);
    showToast('New Custom Order Request logged!');

    setNewDevoteeName('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewRequestType('');
    setNewDetails('');
    setNewPreferredDate('');
    setNewEstimatedAmount('');
  };

  // Hero Slide Operations
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
        ctx?.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.85);

        fetch('/api/upload.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: compressed, type: key })
        }).then(res => res.json()).then(data => {
          if (data.success) {
            callback(`${data.path}?t=${Date.now()}`);
          } else {
            callback(compressed);
          }
        }).catch(() => {
          callback(compressed);
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
      compressAndSaveImage(file, maxW, maxH, `babadham_req_hero_${id}_${isMobile ? 'mob' : 'desk'}`, (resUrl) => {
        handleUpdateSlide(id, { [fieldKey]: resUrl, type: 'image' });
      });
    }
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      type: 'image',
      mediaUrl: '',
      mobileMediaUrl: '',
      heading: '',
      description: '',
      buttonText: '',
      buttonLink: ''
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleUpdateSlide = (id: string, updatedFields: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(slide => slide.id === id ? { ...slide, ...updatedFields } : slide));
  };

  const handleRemoveSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(slide => slide.id !== id));
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSlides.length) {
      const temp = newSlides[index];
      newSlides[index] = newSlides[targetIndex];
      newSlides[targetIndex] = temp;
      setHeroSlides(newSlides);
    }
  };

  const handleSaveHeroSlides = () => {
    const updated = { ...brandSettings, orderRequestHeroSlides: heroSlides };
    saveBrandSettings({ orderRequestHeroSlides: heroSlides });
    syncToStorefront(updated);
    showToast('Order Request Hero Slider Banners updated successfully!');
  };

  const handleSaveTrustBadges = () => {
    const updated = { ...brandSettings, orderRequestTrustBadges: trustBadges };
    saveBrandSettings({ orderRequestTrustBadges: trustBadges });
    syncToStorefront(updated);
    showToast('Trust Badges updated successfully!');
  };

  const handleSaveMediaConfig = () => {
    const updated = { ...brandSettings, orderRequestMediaConfig: mediaConfig };
    saveBrandSettings({ orderRequestMediaConfig: mediaConfig });
    syncToStorefront(updated);
    showToast('Video & Media Branding settings saved!');
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.reqNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.requestType.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderRequest['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40"><Sparkles className="w-3 h-3" /> Processing</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950/80 text-red-300 border border-red-500/40"><XCircle className="w-3 h-3" /> Rejected</span>;
    }
  };

  const deskNavItems = [
    { id: 'leads', label: 'LEADS & SUBMISSIONS', icon: FileText, badge: requests.length },
    { id: 'manage-slots', label: 'MANAGE BOOKING SLOT', icon: Calendar },
    { id: 'hero', label: 'HERO SLIDER BANNERS', icon: ImageIcon, badge: heroSlides.length },
    { id: 'trust', label: 'TRUST BADGES', icon: ShieldCheck },
    { id: 'media', label: 'TEMPLE BELL AUDIO SOUND', icon: Bell }
  ];

  return (
    <div className="w-full min-h-full flex flex-col text-xs sm:text-sm">
      <div className="flex flex-col lg:flex-row gap-0 w-full min-h-full items-stretch">
        
        {/* Second Sidebar (Sub-Navigation Desk) - Touched directly to primary sidebar */}
        <div className="w-full lg:w-72 bg-[#1A0B0E] border-r border-[#F4A62A]/20 py-5 px-0 shrink-0 space-y-5 shadow-xl sticky top-0 self-start z-30 min-h-full">
          
          {/* Header Title Desk */}
          <div className="flex items-center gap-2.5 px-5 pb-4 border-b border-[#F4A62A]/20 text-[#F4A62A]">
            <Bookmark className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">ORDER REQUEST DESK</h3>
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
                  onClick={() => setActiveSubTab(item.id as any)}
                  className={`w-full h-12 flex items-center gap-3 px-5 transition-all text-left text-xs sm:text-[13px] font-medium tracking-wide cursor-pointer relative ${
                    isActive 
                      ? 'bg-[#2B1217] text-[#F4A62A] border-l-4 border-[#F4A62A] shadow-md font-semibold' 
                      : 'text-[#FFF8F0]/70 hover:bg-[#2B1217]/60 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/50'}`} />
                  <span className="uppercase tracking-wider truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-[#1A0B0E] text-[10px] font-extrabold text-[#F4A62A]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Copy Direct Funnel Link Button */}
          <div className="px-5 pt-2">
            <button
              type="button"
              onClick={() => {
                const link = `${window.location.protocol}//${window.location.hostname}:5173/order-request`;
                navigator.clipboard.writeText(link);
                showToast('Order Request Funnel Link copied!');
              }}
              className="w-full h-11 rounded-xl bg-[#500A18] hover:bg-[#7A1126] text-[#F4A62A] font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#F4A62A]/30"
            >
              <Share2 className="w-4 h-4" /> Copy Funnel Link
            </button>
          </div>

        </div>

        {/* Main Content Sections Column */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 w-full bg-[#120508]">
          
          {/* TAB 1: LEADS & SUBMISSIONS */}
          {activeSubTab === 'leads' && (
            <div className="space-y-6">
              
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#2B1217] p-4 rounded-xl border border-[#F4A62A]/20 shadow-md">
                  <div className="text-xs text-[#FFF8F0]/60">Total Requests</div>
                  <div className="text-xl font-bold text-[#F4A62A] mt-1">{requests.length}</div>
                </div>
                <div className="bg-[#2B1217] p-4 rounded-xl border border-amber-500/30 shadow-md">
                  <div className="text-xs text-amber-300">Pending Approval</div>
                  <div className="text-xl font-bold text-amber-300 mt-1">
                    {requests.filter(r => r.status === 'Pending').length}
                  </div>
                </div>
                <div className="bg-[#2B1217] p-4 rounded-xl border border-blue-500/30 shadow-md">
                  <div className="text-xs text-blue-300">Approved / Processing</div>
                  <div className="text-xl font-bold text-blue-300 mt-1">
                    {requests.filter(r => r.status === 'Approved' || r.status === 'Processing').length}
                  </div>
                </div>
                <div className="bg-[#2B1217] p-4 rounded-xl border border-emerald-500/30 shadow-md">
                  <div className="text-xs text-emerald-300">Completed</div>
                  <div className="text-xl font-bold text-emerald-300 mt-1">
                    {requests.filter(r => r.status === 'Completed').length}
                  </div>
                </div>
              </div>

              {/* Main Requests Table */}
              <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4A62A]/20 pb-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {['All', 'Pending', 'Approved', 'Processing', 'Completed', 'Rejected'].map(st => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          statusFilter === st
                            ? 'bg-[#500A18] text-[#F4A62A] border-[#F4A62A]/50 shadow-md'
                            : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] hover:bg-[#1A0B0E] border-transparent'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-[#F4A62A] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search request #, devotee..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-xs text-[#FFF8F0] placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>

                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add Lead
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20 select-none">
                      <tr>
                        <th className="p-3">Req ID</th>
                        <th className="p-3">Devotee Name</th>
                        <th className="p-3">Request Type</th>
                        <th className="p-3">Preferred Date</th>
                        <th className="p-3">Est. Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4A62A]/10">
                      {filteredRequests.map(req => (
                        <tr key={req.id} className="hover:bg-[#1A0B0E]/60 transition-colors">
                          <td className="p-3 font-mono font-bold text-[#F4A62A]">
                            {req.reqNo}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[#F4A62A]" /> {req.devoteeName}
                            </div>
                            <div className="text-[11px] text-[#FFF8F0]/60 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-[#F4A62A]/70" /> {req.phone}
                            </div>
                          </td>
                          <td className="p-3 text-[#FFF8F0]/90 font-medium">
                            <div className="line-clamp-1">{req.requestType}</div>
                          </td>
                          <td className="p-3 text-[#FFF8F0]/80 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#F4A62A]" /> {req.preferredDate}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-[#F4A62A] whitespace-nowrap">
                            ₹{req.estimatedAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            {getStatusBadge(req.status)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#500A18] text-[#F4A62A] hover:bg-[#7A1126] border border-[#F4A62A]/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> Details
                              </button>

                              {req.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => updateStatus(req.id, 'Approved')}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-bold cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => updateStatus(req.id, 'Rejected')}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-950 text-red-300 hover:bg-red-900 border border-red-500/40 text-xs font-bold cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {req.status === 'Approved' && (
                                <button
                                  onClick={() => updateStatus(req.id, 'Completed')}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-950 text-blue-300 hover:bg-blue-900 border border-blue-500/40 text-xs font-bold cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredRequests.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#FFF8F0]/50 font-medium">
                            No order requests found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO BANNER SLIDER */}
          {activeSubTab === 'hero' && (
            <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4">
                <div>
                  <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#F4A62A]" /> Order Request Hero Banner Slider
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/70 mt-1">
                    Manage sliding banner photos, videos, headings, and order buttons for your Order Request funnel page.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="px-3.5 py-2 rounded-xl bg-[#500A18] text-[#F4A62A] hover:bg-[#7A1126] border border-[#F4A62A]/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Slide
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveHeroSlides}
                    className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-extrabold text-xs hover:bg-white transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Slider Banners
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {heroSlides.map((slide, index) => (
                  <div key={slide.id} className="p-5 rounded-2xl bg-[#1A0B0E] border border-[#F4A62A]/30 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#7A1126] text-[#F4A62A] font-bold text-xs flex items-center justify-center border border-[#F4A62A]/40">
                          {index + 1}
                        </span>
                        <span className="font-bold text-xs text-[#FFF8F0]">Hero Slide #{index + 1}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveSlide(index, 'up')}
                            className="p-1.5 text-[#F4A62A] hover:bg-[#2B1217] rounded-lg transition-colors cursor-pointer"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                        )}
                        {index < heroSlides.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveSlide(index, 'down')}
                            className="p-1.5 text-[#F4A62A] hover:bg-[#2B1217] rounded-lg transition-colors cursor-pointer"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(slide.id)}
                          className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
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
                                {slide.type === 'video' ? 'Uses Desktop Video by default' : 'Uses Desktop Photo by default'}
                              </span>
                            )}
                          </div>

                          {/* Mobile File Upload Button */}
                          <label className="flex items-center justify-center gap-2 px-3 h-10 rounded-xl bg-[#500A18] hover:bg-[#7A1126] text-[#F4A62A] font-bold text-xs border border-[#F4A62A]/40 transition-all cursor-pointer w-full text-center shadow-md">
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

                      {/* Headings & Subtitles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">Main Heading</label>
                          <input
                            type="text"
                            value={slide.heading || ''}
                            onChange={e => handleUpdateSlide(slide.id, { heading: e.target.value })}
                            placeholder="e.g. Direct Garbhagriha Bhog Prasad"
                            className="w-full bg-[#120508] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/20 focus:outline-none focus:border-[#F4A62A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#FFF8F0]/90 mb-1">Subtitle / Description</label>
                          <input
                            type="text"
                            value={slide.description || ''}
                            onChange={e => handleUpdateSlide(slide.id, { description: e.target.value })}
                            placeholder="e.g. Blessed at Baidyanath Jyotirlinga & delivered home..."
                            className="w-full bg-[#120508] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/20 focus:outline-none focus:border-[#F4A62A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRUST BADGES & GUARANTEES */}
          {activeSubTab === 'trust' && (
            <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4">
                <div>
                  <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#F4A62A]" /> Trust Badges & Devotional Guarantees
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/70 mt-1">
                    Customize the 3 trust guarantee cards displayed prominently on the Order Request page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveTrustBadges}
                  className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-extrabold text-xs hover:bg-white transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Trust Badges
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trustBadges.map((badge, idx) => (
                  <div key={badge.id} className="p-4 rounded-2xl bg-[#1A0B0E] border border-[#F4A62A]/30 space-y-3">
                    <div className="text-xs font-bold text-[#F4A62A]">Badge #{idx + 1}</div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-[#FFF8F0]/80 mb-1">Title</label>
                      <input
                        type="text"
                        value={badge.title}
                        onChange={e => {
                          const val = e.target.value;
                          setTrustBadges(prev => prev.map(b => b.id === badge.id ? { ...b, title: val } : b));
                        }}
                        className="w-full bg-[#120508] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:border-[#F4A62A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#FFF8F0]/80 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={badge.subtitle}
                        onChange={e => {
                          const val = e.target.value;
                          setTrustBadges(prev => prev.map(b => b.id === badge.id ? { ...b, subtitle: val } : b));
                        }}
                        className="w-full bg-[#120508] text-xs text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:border-[#F4A62A] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLE BELL AUDIO SOUND */}
          {activeSubTab === 'media' && (
            <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4">
                <div>
                  <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#F4A62A]" /> Temple Bell Audio Sound Settings
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/70 mt-1">
                    Upload your custom MP3 / WAV temple bell ring sound for storefront landing & hanging 3D bells.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveMediaConfig}
                  className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-extrabold text-xs hover:bg-white transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Sound Settings
                </button>
              </div>

              {/* Temple Bell Ring Sound Audio Config */}
              <div className="bg-[#120508] p-5 rounded-xl border border-[#F4A62A]/30 space-y-4">
                <label className="block text-xs font-bold text-[#F4A62A] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm"><Bell className="w-4 h-4 text-[#F4A62A]" /> Landing & Header Temple Bell Audio Sound (MP3 / WAV)</span>
                  {mediaConfig.bellAudioUrl && (
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">✓ Custom Audio Active</span>
                  )}
                </label>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="text"
                    value={mediaConfig.bellAudioUrl || ''}
                    onChange={e => setMediaConfig({ ...mediaConfig, bellAudioUrl: e.target.value })}
                    placeholder="Upload MP3 file or enter Audio URL..."
                    className="flex-1 bg-[#1A0B0E] text-xs text-[#FFF8F0] px-3.5 py-2.5 rounded-xl border border-[#F4A62A]/30 focus:border-[#F4A62A] focus:outline-none"
                  />
                  
                  <label className="px-4 py-2.5 bg-[#7A1126] hover:bg-[#500A18] text-[#F4A62A] border border-[#F4A62A]/40 rounded-xl cursor-pointer text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-md">
                    <Upload className="w-4 h-4" /> Upload Bell Audio File
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            const updatedMedia = { ...mediaConfig, bellAudioUrl: dataUrl };
                            setMediaConfig(updatedMedia);
                            const updatedSettings = { ...brandSettings, orderRequestMediaConfig: updatedMedia, bellAudioUrl: dataUrl };
                            saveBrandSettings({ orderRequestMediaConfig: updatedMedia, bellAudioUrl: dataUrl });
                            syncToStorefront(updatedSettings);
                            showToast('Temple Bell Audio sound uploaded & saved successfully!', 'success');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {mediaConfig.bellAudioUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          const audio = new Audio(mediaConfig.bellAudioUrl);
                          audio.play();
                          showToast('Playing custom bell sound preview...', 'info');
                        } catch (err) {
                          showToast('Unable to play custom sound', 'warning');
                        }
                      }}
                      className="px-3.5 py-2.5 bg-[#F4A62A] hover:bg-white text-[#2B1A16] rounded-xl text-xs font-extrabold shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Test Sound
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-[#FFF8F0]/65 leading-relaxed">
                  Upload your custom MP3/WAV temple bell sound. It will automatically ring when devotees land on the Order Request page and when touching the hanging 3D bell!
                </p>
              </div>
            </div>
          )}

          {activeSubTab === 'manage-slots' && (
            <div className="pt-2">
              <BookingSlotsView />
            </div>
          )}

        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2B1217] border border-[#F4A62A]/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#F4A62A]">{selectedRequest.reqNo}</span>
                <h3 className="font-serif-temple font-bold text-lg text-white mt-0.5">Order Request Lead Details</h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-[#FFF8F0]/60 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Devotee Info Box */}
              <div className="bg-[#1A0B0E] p-3.5 rounded-xl border border-[#F4A62A]/20 space-y-2">
                <div className="font-bold text-[#F4A62A] flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#F4A62A]" /> {selectedRequest.devoteeName}
                  </div>
                  <a
                    href={`https://wa.me/91${selectedRequest.phone.replace(/\D/g, '')}?text=Har%20Har%20Mahadev%20${encodeURIComponent(selectedRequest.devoteeName)}!%20We%20received%20your%20Baidyanath%20Prasad%20Request%20${selectedRequest.reqNo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3 fill-current" /> WhatsApp
                  </a>
                </div>

                <div className="text-[#FFF8F0]/80 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#F4A62A]" /> {selectedRequest.phone} {selectedRequest.email ? `| ${selectedRequest.email}` : ''}
                </div>

                <div className="text-[#FFF8F0]/80 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F4A62A] shrink-0 mt-0.5" /> {selectedRequest.address || 'Address not provided'}
                </div>
              </div>

              {/* Devotee Answers & Lead Specifics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-[#1A0B0E] p-2.5 rounded-xl border border-[#F4A62A]/20">
                  <div className="text-[#FFF8F0]/60 text-[10px]">Visited Temple?</div>
                  <div className="font-bold text-white mt-0.5 text-xs">{selectedRequest.visited || 'N/A'}</div>
                </div>
                <div className="bg-[#1A0B0E] p-2.5 rounded-xl border border-[#F4A62A]/20">
                  <div className="text-[#FFF8F0]/60 text-[10px]">Age</div>
                  <div className="font-bold text-white mt-0.5 text-xs">{selectedRequest.age || 'N/A'}</div>
                </div>
                <div className="bg-[#1A0B0E] p-2.5 rounded-xl border border-[#F4A62A]/20 col-span-2 sm:col-span-1">
                  <div className="text-[#FFF8F0]/60 text-[10px]">Est. Amount</div>
                  <div className="font-bold text-[#F4A62A] mt-0.5 text-xs">₹{selectedRequest.estimatedAmount ? selectedRequest.estimatedAmount.toLocaleString('en-IN') : '0'}</div>
                </div>
              </div>

              {/* Request Type & Summary */}
              <div className="space-y-1.5">
                <div className="font-bold text-[#F4A62A]">Request Category:</div>
                <div className="bg-[#1A0B0E] p-3 rounded-xl border border-[#F4A62A]/20 text-[#FFF8F0]/90 font-bold text-xs">
                  {selectedRequest.requestType}
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div className="space-y-1.5">
                <div className="font-bold text-[#F4A62A]">Special Request & Details:</div>
                <div className="bg-[#1A0B0E] p-3 rounded-xl border border-[#F4A62A]/20 text-[#FFF8F0]/90 leading-relaxed text-xs">
                  {selectedRequest.specialRequest || selectedRequest.details || 'No special instructions recorded.'}
                </div>
              </div>

              <div className="text-[10px] text-[#FFF8F0]/50 text-right">
                Submitted on: {new Date(selectedRequest.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="border-t border-[#F4A62A]/20 pt-4 flex items-center justify-between gap-2">
              <div>{getStatusBadge(selectedRequest.status)}</div>
              <div className="flex items-center gap-2">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'Approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40 font-bold cursor-pointer text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'Rejected')}
                      className="px-3 py-1.5 rounded-xl bg-red-950 text-red-300 hover:bg-red-900 border border-red-500/40 font-bold cursor-pointer text-xs"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedRequest.status === 'Approved' && (
                  <button
                    onClick={() => updateStatus(selectedRequest.id, 'Completed')}
                    className="px-3 py-1.5 rounded-xl bg-blue-950 text-blue-300 hover:bg-blue-900 border border-blue-500/40 font-bold cursor-pointer text-xs"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2B1217] border border-[#F4A62A]/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3">
              <h3 className="font-serif-temple font-bold text-lg text-white">Create New Order Request</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#FFF8F0]/60 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#F4A62A] font-bold mb-1">Devotee Full Name *</label>
                <input
                  type="text"
                  required
                  value={newDevoteeName}
                  onChange={e => setNewDevoteeName(e.target.value)}
                  placeholder="Enter devotee name..."
                  className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="devotee@gmail.com"
                    className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F4A62A] font-bold mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  placeholder="Full delivery address..."
                  className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-[#F4A62A] font-bold mb-1">Request Type *</label>
                <input
                  type="text"
                  required
                  value={newRequestType}
                  onChange={e => setNewRequestType(e.target.value)}
                  placeholder="e.g. Special Mahaprasad Box"
                  className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-[#F4A62A] font-bold mb-1">Request Details</label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={e => setNewDetails(e.target.value)}
                  placeholder="Specific items, quantities, puja requirements..."
                  className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={newPreferredDate}
                    onChange={e => setNewPreferredDate(e.target.value)}
                    className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">Est. Amount (₹)</label>
                  <input
                    type="number"
                    value={newEstimatedAmount}
                    onChange={e => setNewEstimatedAmount(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-[#1A0B0E] text-[#FFF8F0] px-3 py-2 rounded-xl border border-[#F4A62A]/30 focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#F4A62A]/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A0B0E] text-[#FFF8F0]/70 hover:text-white border border-[#F4A62A]/20 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] hover:bg-white font-extrabold shadow-lg cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invisible iframe for Cross-Origin LocalStorage Synchronization */}
      <iframe id="babadham-sync-frame" src="http://localhost:5173" style={{ display: 'none' }} />
    </div>
  );
};
