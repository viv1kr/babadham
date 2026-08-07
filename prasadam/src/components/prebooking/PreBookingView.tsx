import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { 
  Save, 
  Bookmark, 
  LayoutGrid, 
  Tv, 
  CreditCard, 
  FileText, 
  Phone, 
  Plus, 
  Trash2, 
  Upload, 
  MoveUp, 
  MoveDown,
  Users,
  RefreshCw,
  Search,
  MessageCircle,
  CheckCircle,
  XCircle,
  Zap,
  Eye,
  X,
  MapPin,
  Calendar
} from "lucide-react";
import type { HeroBannerItem } from "../../types/ecommerce";
import { compressImage } from "../../utils/mediaDB";
import { db } from "../../db/mysqlSim";

export const PreBookingView: React.FC = () => {
  const { brandSettings, saveBrandSettings } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<string>("all");
  const [prebookTitle, setPrebookTitle] = useState(brandSettings?.prebookTitle || "Sacred Baidyanath Bhog Prasad Pre-Booking");
  const [prebookSubtitle, setPrebookSubtitle] = useState(brandSettings?.prebookSubtitle || "Secure direct Garbhagriha offered Prasad with advance booking.");
  const [prebookAmount, setPrebookAmount] = useState<number>(brandSettings?.prebookAmount || 251);
  const [prebookHelpPhone, setPrebookHelpPhone] = useState(brandSettings?.prebookHelpPhone || "+91 98765 43210");
  const [prebookingBanners, setPrebookingBanners] = useState<HeroBannerItem[]>(() => db.getPrebookingHeroBanners());

  // Real-time Prebooking Leads / Orders State
  const [orders, setOrders] = useState<any[]>(() => db.getOrders());
  const [leadSearch, setLeadSearch] = useState("");
  const [selectedLeadModal, setSelectedLeadModal] = useState<any | null>(null);

  const refreshOrders = () => {
    setOrders(db.getOrders());
  };

  useEffect(() => {
    refreshOrders();
    window.addEventListener("bbp_db_updated", refreshOrders);
    window.addEventListener("storage", refreshOrders);
    const interval = setInterval(refreshOrders, 3000);
    return () => {
      window.removeEventListener("bbp_db_updated", refreshOrders);
      window.removeEventListener("storage", refreshOrders);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const updated = db.updateOrderLeadStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedLeadModal && (selectedLeadModal.orderId === orderId || selectedLeadModal.id === orderId)) {
      setSelectedLeadModal({ ...selectedLeadModal, leadStatus: newStatus });
    }
  };

  const handleDeleteLead = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this prebooking lead?")) {
      const updated = db.deleteOrder(orderId);
      setOrders(updated);
      if (selectedLeadModal && (selectedLeadModal.orderId === orderId || selectedLeadModal.id === orderId)) {
        setSelectedLeadModal(null);
      }
    }
  };

  const getWhatsAppMessage = (lead: any) => {
    const name = lead.customerName || lead.address?.fullName || "Devotee";
    const leadId = lead.orderId || lead.id || "BBP-PRE-BOOKING";
    const msg = `Namaste ${name} Ji 🙏,\n\nYour sacred prebooking (${leadId}) for Baba Baidyanath Bhog Prasad has been APPROVED! 🔱\n\nYour Garbhagriha offered Prasad is being dispatched. Track updates at http://localhost:5173/prebooking\n\nHar Har Mahadev! 🚩`;
    return encodeURIComponent(msg);
  };

  const saveBanners = (updated: HeroBannerItem[]) => {
    setPrebookingBanners(updated);
    db.savePrebookingHeroBanners(updated);
    try { localStorage.setItem("babadham_prebooking_hero_banners", JSON.stringify(updated)); } catch(e) {}
  };

  const handleAddBanner = () => saveBanners([...prebookingBanners, { id: `pb-${Date.now()}`, title: `Banner ${prebookingBanners.length + 1}`, mediaType: "image", desktopUrl: "", mobileUrl: "", displayOrder: prebookingBanners.length, createdAt: new Date().toISOString() }]);
  const handleUpdate = (id: string, upd: Partial<HeroBannerItem>) => saveBanners(prebookingBanners.map(b => b.id === id ? { ...b, ...upd } : b));
  const handleRemove = (id: string) => saveBanners(prebookingBanners.filter(b => b.id !== id));
  const handleMove = (idx: number, dir: "up" | "down") => {
    const arr = [...prebookingBanners];
    const t = dir === "up" ? idx - 1 : idx + 1;
    if (t >= 0 && t < arr.length) { [arr[idx], arr[t]] = [arr[t], arr[idx]]; saveBanners(arr); }
  };
  const handleUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const isVideo = file.type.startsWith("video");
      let payload: string;
      if (isVideo) { payload = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); }); }
      else { payload = await compressImage(file); }
      const resp = await fetch("/api/upload-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: payload, type: "prebooking-banner" }) });
      const data = await resp.json();
      if (data.success && data.path) {
        const url = `${data.path}?t=${Date.now()}`;
        handleUpdate(id, isMobile ? { mobileUrl: url, ...(isVideo ? { mediaType: "video" } : {}) } : { desktopUrl: url, ...(isVideo ? { mediaType: "video" } : {}) });
      }
    } catch(err) { console.warn(err); }
  };

  const deskNavItems = [
    { id: "all", label: "ALL CONFIGURATIONS", icon: LayoutGrid },
    { id: "leads", label: "PREBOOKING LEADS", icon: Users },
    { id: "pricing", label: "ADVANCE DEPOSIT FEE", icon: CreditCard },
    { id: "content", label: "PAGE TEXT & TITLES", icon: FileText },
    { id: "contact", label: "SUPPORT & HELPLINE", icon: Phone },
    { id: "banner", label: "PAGE HERO BANNER", icon: Tv },
  ];

  const syncToStorefront = (settings: any) => {
    const frame = document.getElementById("babadham-sync-frame") as HTMLIFrameElement;
    if (frame?.contentWindow) frame.contentWindow.postMessage({ type: "SYNC_BRANDING_CROSS_ORIGIN", settings: JSON.stringify(settings) }, "http://localhost:5173");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const upd = { ...brandSettings, prebookTitle, prebookSubtitle, prebookAmount, prebookHelpPhone };
    saveBrandSettings(upd);
    try { const ch = new BroadcastChannel("bbp_brand_sync"); ch.postMessage({ type: "BRAND_SETTINGS_UPDATED", settings: upd }); ch.close(); } catch(e) {}
    window.dispatchEvent(new Event("bbp_db_updated"));
    syncToStorefront(upd);
  };

  const filteredOrders = orders.filter(o => {
    if (!leadSearch.trim()) return true;
    const q = leadSearch.toLowerCase();
    const name = (o.customerName || o.address?.fullName || "").toLowerCase();
    const phone = (o.customerPhone || o.address?.phone || "").toLowerCase();
    const id = (o.orderId || o.id || "").toLowerCase();
    const addr = (o.shippingAddress || "").toLowerCase();
    const city = (o.addressDetails?.city || "").toLowerCase();
    const state = (o.addressDetails?.state || "").toLowerCase();
    return name.includes(q) || phone.includes(q) || id.includes(q) || addr.includes(q) || city.includes(q) || state.includes(q);
  });

  return (
    <form onSubmit={handleSave} className="w-full min-h-full flex flex-col text-xs sm:text-sm select-none">
      <div className="flex flex-col lg:flex-row gap-0 w-full min-h-full items-stretch">
        
        {/* Secondary Sidebar */}
        <div className="w-full lg:w-72 bg-[#1A0B0E] border-r border-[#F4A62A]/20 py-5 px-0 shrink-0 space-y-5 shadow-xl sticky top-0 self-start z-30">
          <div className="flex items-center gap-2.5 px-5 pb-4 border-b border-[#F4A62A]/20 text-[#F4A62A]">
            <Bookmark className="w-4 h-4" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">PREBOOKING DESK</h3>
          </div>

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
                    isActive ? "bg-[#2B1217] text-[#F4A62A] border-l-4 border-[#F4A62A] shadow-md font-semibold" : "text-[#FFF8F0]/70 hover:bg-[#2B1217]/60 hover:text-white border-l-4 border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#F4A62A]" : "text-[#FFF8F0]/50"}`} />
                  <span className="uppercase tracking-wider truncate">{item.label}</span>
                  {item.id === "leads" && orders.length > 0 && (
                    <span className="ml-auto bg-[#F4A62A] text-[#1A0B0E] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="px-5 pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#F4A62A] hover:bg-white text-[#2B1A16] font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#F4A62A]/40"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 w-full bg-[#120508]">

          {/* ── PREBOOKING LEADS & SUBMITTED ORDERS SECTION ── */}
          {(activeSubTab === "all" || activeSubTab === "leads") && (
            <div className="bg-[#1A0B0E] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/40 space-y-4 shadow-xl w-full">
              <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3 flex-wrap gap-3">
                <div className="space-y-1">
                  <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <Users className="w-5 h-5" /> Submitted Prebooking Leads ({orders.length})
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/60">Real-time devotee prebooking submissions, city & state, payment status and controls.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={refreshOrders}
                    className="px-3 py-1.5 rounded-xl bg-[#2B1217] hover:bg-[#3A1520] text-[#F4A62A] text-xs font-bold border border-[#F4A62A]/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Leads
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              {orders.length > 0 && (
                <div className="relative">
                  <Search className="w-4 h-4 text-[#F4A62A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={e => setLeadSearch(e.target.value)}
                    placeholder="Search by devotee name, phone, order ID, city or state..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#2B1217] border border-[#F4A62A]/20 text-white text-xs sm:text-sm outline-none focus:border-[#F4A62A]"
                  />
                </div>
              )}

              {/* Leads Table */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-[#FFF8F0]/40 text-sm bg-[#2B1217]/50 rounded-xl border border-[#F4A62A]/10">
                  {orders.length === 0 
                    ? "No prebooking leads submitted yet. New submissions from devotees will appear here automatically!"
                    : "No leads match your search criteria."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#F4A62A]/20">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2B1217] text-[#F4A62A] border-b border-[#F4A62A]/20 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Booking Time & ID</th>
                        <th className="py-3.5 px-4">Devotee Details</th>
                        <th className="py-3.5 px-4">City & State</th>
                        <th className="py-3.5 px-4">Payment Status</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-center">Action Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4A62A]/10 text-xs text-[#FFF8F0]/90">
                      {filteredOrders.map((lead, idx) => {
                        const leadId = lead.orderId || lead.id || `BBP-PRE-${idx + 1}`;
                        const name = lead.customerName || lead.address?.fullName || "Devotee";
                        const phone = lead.customerPhone || lead.address?.phone || "";
                        const cleanPhone = phone.replace(/\D/g, "");
                        const isOnline = lead.paymentMethod === "ONLINE";
                        
                        // Time formatting
                        const rawTime = lead.bookingTime || lead.date;
                        const dateFormatted = rawTime 
                          ? new Date(rawTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) 
                          : "Just now";

                        // Address extraction (City & State only as requested)
                        const city = lead.addressDetails?.city || "";
                        const state = lead.addressDetails?.state || "";
                        const cityStateStr = [city, state].filter(Boolean).join(", ");

                        // Status
                        const status = lead.leadStatus || "PENDING";
                        const isApproved = status === "APPROVED";
                        const isRejected = status === "REJECTED";
                        const isConverted = status === "CONVERTED";

                        return (
                          <tr key={leadId + idx} className="hover:bg-[#2B1217]/60 transition-colors">
                            
                            {/* 1. Booking Time & ID */}
                            <td className="py-3.5 px-4 align-top">
                              <span className="font-mono font-bold text-[#F4A62A] block text-xs">{leadId}</span>
                              <span className="text-[10px] text-[#FFF8F0]/60 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-[#F4A62A]/60 shrink-0" />
                                {dateFormatted}
                              </span>
                            </td>

                            {/* 2. Devotee Details */}
                            <td className="py-3.5 px-4 align-top">
                              <span className="font-bold text-white block text-xs">{name}</span>
                              {phone && (
                                <a 
                                  href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#25D366] hover:underline font-mono text-[11px] mt-1"
                                >
                                  <MessageCircle className="w-3 h-3 fill-[#25D366] text-[#1A0B0E]" />
                                  +91 {phone}
                                </a>
                              )}
                            </td>

                            {/* 3. City & State Only */}
                            <td className="py-3.5 px-4 align-top">
                              <span className="font-bold text-[#F4A62A] text-xs flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#F4A62A] shrink-0" />
                                {cityStateStr || lead.shippingAddress || "N/A"}
                              </span>
                            </td>

                            {/* 4. Payment Status Only (Paid Online / Pay Later - No Amount Shown) */}
                            <td className="py-3.5 px-4 align-top">
                              <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                                isOnline 
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                                  : "bg-amber-950/80 text-amber-300 border-amber-500/30"
                              }`}>
                                {isOnline ? "Paid Online" : "Pay Later"}
                              </span>
                            </td>

                            {/* 5. Status Badge */}
                            <td className="py-3.5 px-4 align-top">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                isApproved 
                                  ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                                  : isRejected
                                  ? "bg-red-950 text-red-300 border-red-500/40"
                                  : isConverted
                                  ? "bg-purple-950 text-purple-300 border-purple-500/40"
                                  : "bg-amber-950 text-amber-300 border-amber-500/40"
                              }`}>
                                {status}
                              </span>
                            </td>

                            {/* 6. Action Buttons */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="flex flex-col gap-1.5 items-center justify-center">

                                {/* If APPROVED: show Send WhatsApp Confirmation, See Details, and option to Change to Reject */}
                                {isApproved && (
                                  <>
                                    <a
                                      href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${getWhatsAppMessage(lead)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1.2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#1A0B0E] font-black text-[10px] flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                      title="Send Confirmation Details on WhatsApp"
                                    >
                                      <MessageCircle className="w-3 h-3 fill-[#1A0B0E] text-[#25D366]" />
                                      WhatsApp Confirm
                                    </a>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedLeadModal(lead)}
                                        className="px-2 py-1 rounded-lg bg-[#2B1217] hover:bg-[#3A1520] text-[#F4A62A] text-[10px] font-bold border border-[#F4A62A]/30 flex items-center gap-1 cursor-pointer transition-all"
                                      >
                                        <Eye className="w-3 h-3" /> See Details
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(leadId, "REJECTED")}
                                        className="px-2 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 text-[10px] font-bold border border-red-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                        title="Change Status to Reject"
                                      >
                                        <XCircle className="w-3 h-3" /> Reject
                                      </button>
                                    </div>
                                  </>
                                )}

                                {/* If PENDING, REJECTED, or CONVERTED */}
                                {!isApproved && (
                                  <div className="flex flex-wrap items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateStatus(leadId, "APPROVED")}
                                      className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                      title="Approve Lead"
                                    >
                                      <CheckCircle className="w-3 h-3" /> Approve
                                    </button>

                                    {!isRejected && (
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(leadId, "REJECTED")}
                                        className="px-2 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 text-[10px] font-bold border border-red-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                        title="Reject Lead"
                                      >
                                        <XCircle className="w-3 h-3" /> Reject
                                      </button>
                                    )}

                                    {!isConverted && (
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(leadId, "CONVERTED")}
                                        className="px-2 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                        title="Convert Lead"
                                      >
                                        <Zap className="w-3 h-3" /> Convert
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => setSelectedLeadModal(lead)}
                                      className="px-2 py-1 rounded-lg bg-[#2B1217] hover:bg-[#3A1520] text-[#F4A62A] text-[10px] font-bold border border-[#F4A62A]/30 flex items-center gap-1 cursor-pointer transition-all"
                                      title="See Details"
                                    >
                                      <Eye className="w-3 h-3" /> Details
                                    </button>
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Advance Deposit & Pricing */}
          {(activeSubTab === "all" || activeSubTab === "pricing") && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <CreditCard className="w-5 h-5" /> Pre-Booking Advance Amount & Deposit Fee
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#F4A62A] mb-1">Advance Booking Deposit Amount (Rs.)</label>
                  <input type="number" value={prebookAmount} onChange={e => setPrebookAmount(Number(e.target.value) || 251)} placeholder="251" className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]" />
                  <p className="text-[11px] text-[#FFF8F0]/50 mt-1">Amount charged online to confirm advance pre-booking slot.</p>
                </div>
              </div>
            </div>
          )}

          {/* Page Text & Content */}
          {(activeSubTab === "all" || activeSubTab === "content") && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <FileText className="w-5 h-5" /> Pre-Booking Page Titles & Descriptions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#F4A62A] mb-1">Page Main Title</label>
                  <input type="text" value={prebookTitle} onChange={e => setPrebookTitle(e.target.value)} placeholder="Sacred Baidyanath Bhog Prasad Pre-Booking" className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#F4A62A] mb-1">Page Devotional Subtitle</label>
                  <textarea rows={2} value={prebookSubtitle} onChange={e => setPrebookSubtitle(e.target.value)} placeholder="Secure direct Garbhagriha offered Prasad with advance booking." className="w-full p-3 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-[#F4A62A]" />
                </div>
              </div>
            </div>
          )}

          {/* Support & Helpline */}
          {(activeSubTab === "all" || activeSubTab === "contact") && (
            <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg w-full">
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 border-b border-[#F4A62A]/20 pb-3">
                <Phone className="w-5 h-5" /> Pre-Booking Help & Support Contact
              </h3>
              <div>
                <label className="block text-xs font-bold text-[#F4A62A] mb-1">Pre-Booking Helpline Number / WhatsApp Contact</label>
                <input type="text" value={prebookHelpPhone} onChange={e => setPrebookHelpPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full h-11 px-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F4A62A]" />
              </div>
            </div>
          )}

          {/* Page Hero Banner Manager */}
          {(activeSubTab === "all" || activeSubTab === "banner") && (
            <div className="bg-[#1A0B0E] p-5 sm:p-6 rounded-2xl border border-[#7A1126]/60 space-y-4 shadow-lg w-full">
              <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3 flex-wrap gap-2">
                <div className="space-y-1">
                  <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                    <Tv className="w-5 h-5" /> Prebooking Page Hero Banner ({prebookingBanners.length})
                  </h3>
                  <p className="text-xs text-[#FFF8F0]/50">Shown on the /prebooking page only. Completely independent from the main homepage hero banner.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {prebookingBanners.length > 0 && (
                    <button type="button" onClick={() => saveBanners([])} className="px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-red-300 text-xs font-bold border border-red-500/40 flex items-center gap-1 cursor-pointer transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                  <button type="button" onClick={handleAddBanner} className="px-4 py-1.5 rounded-xl bg-[#7A1126] hover:bg-[#9B1635] text-[#F4A62A] text-xs font-bold border border-[#F4A62A]/40 flex items-center gap-1.5 cursor-pointer transition-all shadow-md">
                    <Plus className="w-4 h-4" /> Add Banner
                  </button>
                </div>
              </div>
              {prebookingBanners.length === 0 && (
                <div className="text-center py-10 text-[#FFF8F0]/30 text-sm">
                  No banners yet. Click <strong className="text-[#F4A62A]">Add Banner</strong> to get started.
                </div>
              )}
              {prebookingBanners.map((banner, index) => (
                <div key={banner.id} className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/20 p-4 space-y-4 shadow-md">
                  <div className="flex items-center gap-3 flex-wrap">
                    <input type="text" value={banner.title || ""} placeholder="Banner Title (optional)" onChange={e => handleUpdate(banner.id, { title: e.target.value })} className="flex-1 min-w-0 bg-[#1A0B0E] border border-[#F4A62A]/20 rounded-xl px-3 py-2 text-sm text-[#FFF8F0] outline-none focus:border-[#F4A62A]/50 transition-colors" />
                    <div className="flex items-center gap-1.5 shrink-0">
                      {index > 0 && (<button type="button" onClick={() => handleMove(index, "up")} title="Move Up" className="w-8 h-8 rounded-lg bg-[#1A0B0E] border border-[#F4A62A]/20 text-[#F4A62A] flex items-center justify-center hover:bg-[#3A1520] cursor-pointer transition-all"><MoveUp className="w-4 h-4" /></button>)}
                      {index < prebookingBanners.length - 1 && (<button type="button" onClick={() => handleMove(index, "down")} title="Move Down" className="w-8 h-8 rounded-lg bg-[#1A0B0E] border border-[#F4A62A]/20 text-[#F4A62A] flex items-center justify-center hover:bg-[#3A1520] cursor-pointer transition-all"><MoveDown className="w-4 h-4" /></button>)}
                      <button type="button" onClick={() => handleRemove(banner.id)} title="Delete" className="w-8 h-8 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 flex items-center justify-center border border-red-500/30 cursor-pointer transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(["image", "video"] as const).map(type => (<button key={type} type="button" onClick={() => handleUpdate(banner.id, { mediaType: type })} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${banner.mediaType === type ? "bg-[#F4A62A] text-[#1A0B0E] border-[#F4A62A]" : "bg-[#1A0B0E] text-[#FFF8F0]/60 border-[#F4A62A]/20 hover:border-[#F4A62A]/40"}`}>{type === "image" ? "Photo" : "Video"}</button>))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#F4A62A]/80 uppercase tracking-wider flex items-center gap-1"><Tv className="w-3.5 h-3.5" /> Desktop</label>
                      {banner.desktopUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-[#F4A62A]/20 bg-[#1A0B0E] h-24">
                          {banner.mediaType === "video" ? <video src={banner.desktopUrl} muted className="w-full h-full object-cover" /> : <img src={banner.desktopUrl} alt="Desktop" className="w-full h-full object-cover" />}
                          <button type="button" onClick={() => handleUpdate(banner.id, { desktopUrl: "" })} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-900 text-red-200 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#F4A62A]/30 rounded-xl py-6 cursor-pointer hover:border-[#F4A62A]/60 transition-colors bg-[#1A0B0E]">
                          <Upload className="w-6 h-6 text-[#F4A62A]/50" /><span className="text-xs text-[#FFF8F0]/50 text-center">Upload Desktop {banner.mediaType === "video" ? "Video" : "Image"}</span>
                          <input type="file" accept={banner.mediaType === "video" ? "video/*" : "image/*"} className="hidden" onChange={e => handleUpload(banner.id, e, false)} />
                        </label>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#F4A62A]/80 uppercase tracking-wider flex items-center gap-1"><LayoutGrid className="w-3.5 h-3.5" /> Mobile (optional)</label>
                      {banner.mobileUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-[#F4A62A]/20 bg-[#1A0B0E] h-24">
                          {banner.mediaType === "video" ? <video src={banner.mobileUrl} muted className="w-full h-full object-cover" /> : <img src={banner.mobileUrl} alt="Mobile" className="w-full h-full object-cover" />}
                          <button type="button" onClick={() => handleUpdate(banner.id, { mobileUrl: "" })} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-900 text-red-200 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#F4A62A]/30 rounded-xl py-6 cursor-pointer hover:border-[#F4A62A]/60 transition-colors bg-[#1A0B0E]">
                          <Upload className="w-6 h-6 text-[#F4A62A]/50" /><span className="text-xs text-[#FFF8F0]/50 text-center">Upload Mobile {banner.mediaType === "video" ? "Video" : "Image"}</span>
                          <input type="file" accept={banner.mediaType === "video" ? "video/*" : "image/*"} className="hidden" onChange={e => handleUpload(banner.id, e, true)} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── SEE DETAILS MODAL ── */}
      {selectedLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A0B0E] border border-[#F4A62A]/40 rounded-2xl w-full max-w-xl p-6 text-white space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedLeadModal(null)}
              className="absolute top-4 right-4 text-[#FFF8F0]/60 hover:text-white bg-[#2B1217] p-1.5 rounded-full border border-[#F4A62A]/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-[#F4A62A]/20 pb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-[#F4A62A] flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#F4A62A]" /> Prebooking Lead Breakdown
                </h3>
                <p className="text-xs text-[#FFF8F0]/60 font-mono mt-0.5">
                  ID: {selectedLeadModal.orderId || selectedLeadModal.id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                selectedLeadModal.leadStatus === "APPROVED"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                  : selectedLeadModal.leadStatus === "REJECTED"
                  ? "bg-red-950 text-red-300 border-red-500/40"
                  : selectedLeadModal.leadStatus === "CONVERTED"
                  ? "bg-purple-950 text-purple-300 border-purple-500/40"
                  : "bg-amber-950 text-amber-300 border-amber-500/40"
              }`}>
                {selectedLeadModal.leadStatus || "PENDING"}
              </span>
            </div>

            {/* Devotee & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#2B1217] p-3.5 rounded-xl border border-[#F4A62A]/20 space-y-2">
                <h4 className="font-bold text-[#F4A62A] flex items-center gap-1.5 uppercase text-[11px]">
                  <Users className="w-3.5 h-3.5 text-[#F4A62A]" /> Devotee Info
                </h4>
                <p className="text-white font-bold">{selectedLeadModal.customerName || selectedLeadModal.address?.fullName || "Devotee"}</p>
                <p className="text-[#FFF8F0]/70 font-mono">WhatsApp: +91 {(selectedLeadModal.customerPhone || selectedLeadModal.address?.phone || "N/A").replace(/\D/g, '')}</p>
                <p className="text-[#FFF8F0]/60 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#F4A62A]/60" />
                  Booking Time: {new Date(selectedLeadModal.bookingTime || selectedLeadModal.date || Date.now()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              <div className="bg-[#2B1217] p-3.5 rounded-xl border border-[#F4A62A]/20 space-y-2">
                <h4 className="font-bold text-[#F4A62A] flex items-center gap-1.5 uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#F4A62A]" /> Delivery Location
                </h4>
                <p className="text-white font-semibold">
                  City: <span className="text-[#F4A62A]">{selectedLeadModal.addressDetails?.city || "N/A"}</span>
                </p>
                <p className="text-white font-semibold">
                  State: <span className="text-[#F4A62A]">{selectedLeadModal.addressDetails?.state || "N/A"}</span>
                </p>
                <p className="text-[#FFF8F0]/70 text-[11px]">
                  Pincode: {selectedLeadModal.addressDetails?.pincode || "N/A"}
                </p>
                {selectedLeadModal.addressDetails?.landmark && (
                  <p className="text-[#FFF8F0]/70 text-[11px]">
                    Landmark: {selectedLeadModal.addressDetails?.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Full Shipping Address */}
            <div className="bg-[#2B1217] p-3.5 rounded-xl border border-[#F4A62A]/20 space-y-1 text-xs">
              <h4 className="font-bold text-[#F4A62A] uppercase text-[11px]">Full Shipping Address</h4>
              <p className="text-white/90 leading-relaxed">{selectedLeadModal.shippingAddress || "N/A"}</p>
            </div>

            {/* Payment Status Only (No amount shown) */}
            <div className="bg-[#2B1217] p-3.5 rounded-xl border border-[#F4A62A]/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#FFF8F0]/60 block text-[11px]">Payment Status</span>
                <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-md border mt-1 ${
                  selectedLeadModal.paymentMethod === 'ONLINE'
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-950 text-amber-300 border-amber-500/30"
                }`}>
                  {selectedLeadModal.paymentMethod === 'ONLINE' ? 'Paid Online' : 'Pay Later'}
                </span>
              </div>
            </div>

            {/* Modal Action Controls */}
            <div className="pt-3 flex flex-wrap gap-2 justify-end border-t border-[#F4A62A]/20">
              <a
                href={`https://wa.me/${(selectedLeadModal.customerPhone || '').replace(/\D/g, '')}?text=${getWhatsAppMessage(selectedLeadModal)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#1A0B0E] font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-[#1A0B0E] text-[#25D366]" />
                WhatsApp Confirm
              </a>

              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedLeadModal.orderId || selectedLeadModal.id, "APPROVED")}
                className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedLeadModal.orderId || selectedLeadModal.id, "REJECTED")}
                className="px-3 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedLeadModal.orderId || selectedLeadModal.id, "CONVERTED")}
                className="px-3 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" /> Convert
              </button>

              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLeadModal.orderId || selectedLeadModal.id)}
                className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-xs border border-red-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
