import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  Truck, 
  Factory, 
  CheckCircle2, 
  Save, 
  Eye, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

export type PolicySubTab = 'refund' | 'privacy' | 'terms' | 'manufacturing' | 'shipping';

interface PoliciesViewProps {
  initialSubTab?: PolicySubTab;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ initialSubTab = 'refund' }) => {
  const { brandSettings, saveBrandSettings } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<PolicySubTab>(initialSubTab);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Policy Form State
  const [refundPolicy, setRefundPolicy] = useState<string>(
    brandSettings?.refundPolicy || DEFAULT_TEMPLATES.refund
  );
  const [privacyPolicy, setPrivacyPolicy] = useState<string>(
    brandSettings?.privacyPolicy || DEFAULT_TEMPLATES.privacy
  );
  const [termsConditionPolicy, setTermsConditionPolicy] = useState<string>(
    brandSettings?.termsConditionPolicy || DEFAULT_TEMPLATES.terms
  );
  const [manufacturingDetailsPolicy, setManufacturingDetailsPolicy] = useState<string>(
    brandSettings?.manufacturingDetailsPolicy || DEFAULT_TEMPLATES.manufacturing
  );
  const [shippingPolicy, setShippingPolicy] = useState<string>(
    brandSettings?.shippingPolicy || DEFAULT_TEMPLATES.shipping
  );

  const policyTabs = [
    { id: 'refund', label: 'Refund & Cancellation Policy', icon: RefreshCw, color: 'text-amber-400' },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, color: 'text-blue-400' },
    { id: 'manufacturing', label: 'Product Manufacturing Details', icon: Factory, color: 'text-purple-400' },
    { id: 'shipping', label: 'Shipping & Delivery Policy', icon: Truck, color: 'text-orange-400' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      ...brandSettings,
      refundPolicy,
      privacyPolicy,
      termsConditionPolicy,
      manufacturingDetailsPolicy,
      shippingPolicy
    };
    saveBrandSettings(updatedSettings);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToTemplate = (tabId: PolicySubTab) => {
    if (window.confirm('Reset policy content to official sacred template?')) {
      if (tabId === 'refund') setRefundPolicy(DEFAULT_TEMPLATES.refund);
      if (tabId === 'privacy') setPrivacyPolicy(DEFAULT_TEMPLATES.privacy);
      if (tabId === 'terms') setTermsConditionPolicy(DEFAULT_TEMPLATES.terms);
      if (tabId === 'manufacturing') setManufacturingDetailsPolicy(DEFAULT_TEMPLATES.manufacturing);
      if (tabId === 'shipping') setShippingPolicy(DEFAULT_TEMPLATES.shipping);
    }
  };

  const getCurrentPolicyContent = () => {
    switch (activeSubTab) {
      case 'refund': return refundPolicy;
      case 'privacy': return privacyPolicy;
      case 'terms': return termsConditionPolicy;
      case 'manufacturing': return manufacturingDetailsPolicy;
      case 'shipping': return shippingPolicy;
      default: return '';
    }
  };

  const setCurrentPolicyContent = (val: string) => {
    switch (activeSubTab) {
      case 'refund': setRefundPolicy(val); break;
      case 'privacy': setPrivacyPolicy(val); break;
      case 'terms': setTermsConditionPolicy(val); break;
      case 'manufacturing': setManufacturingDetailsPolicy(val); break;
      case 'shipping': setShippingPolicy(val); break;
    }
  };

  const activeTabMeta = policyTabs.find(t => t.id === activeSubTab) || policyTabs[0];

  return (
    <form onSubmit={handleSave} className="w-full min-h-full flex flex-col text-xs sm:text-sm">
      <div className="flex flex-col lg:flex-row gap-0 w-full min-h-full items-stretch">
        
        {/* Second Sidebar (Sub-Navigation Desk) - Sticky top-0, stays in place while scrolling */}
        <div className="w-full lg:w-72 bg-[#1A0B0E] border-r border-[#F4A62A]/20 py-5 px-0 shrink-0 space-y-5 shadow-xl sticky top-0 self-start z-30">
          
          {/* Header Title Desk */}
          <div className="flex items-center gap-2.5 px-5 pb-4 border-b border-[#F4A62A]/20 text-[#F4A62A]">
            <BookOpen className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">POLICY DESK</h3>
          </div>

          {/* Sub Navigation List */}
          <nav className="space-y-1">
            {policyTabs.map(item => {
              const isActive = activeSubTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSubTab(item.id as PolicySubTab)}
                  className={`w-full h-9 sm:h-10 flex items-center gap-3 px-5 transition-all text-left text-xs sm:text-[13px] font-medium tracking-wide cursor-pointer relative ${
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

          {/* Save Policy Changes Button placed DIRECTLY BELOW the nav menu */}
          <div className="px-5 pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#F4A62A] hover:bg-white text-[#2B1A16] font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#F4A62A]/40"
            >
              <Save className="w-4 h-4" /> Save Policy Changes
            </button>
          </div>

        </div>

        {/* Main Content Sections Column (Full Width Workplace) */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 w-full bg-[#120508]">

          {/* Top Info Banner Card */}
          <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#F4A62A] mb-1">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Policy Management Portal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-temple font-extrabold text-[#FFF8F0]">
                Legal, Operations & Sacred Guarantee Policies
              </h2>
              <p className="text-xs text-[#FFF8F0]/70 mt-1 max-w-2xl">
                Configure and manage all official policy pages displayed to devotees across your Baidyanath temple prasad storefront.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  previewMode 
                    ? 'bg-[#F4A62A] text-[#120508] border-[#F4A62A]' 
                    : 'bg-[#1A0B0E] text-[#FFF8F0] border-[#F4A62A]/30 hover:border-[#F4A62A]'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Live Preview'}
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl flex items-center justify-between text-emerald-200 text-xs font-bold animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Policies updated successfully and synced to live storefront!</span>
              </div>
            </div>
          )}

          {/* Policy Editor Card */}
          <div className="bg-[#2B1217] p-6 sm:p-8 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 flex items-center justify-center">
                  <activeTabMeta.icon className={`w-5 h-5 ${activeTabMeta.color}`} />
                </div>
                <div>
                  <h3 className="font-serif-temple font-bold text-lg text-[#F4A62A]">
                    {activeTabMeta.label}
                  </h3>
                  <span className="text-[11px] text-[#FFF8F0]/60">
                    Displayed on main footer & checkout legal review
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleResetToTemplate(activeSubTab)}
                className="flex items-center gap-1.5 text-xs text-[#F4A62A] hover:text-[#FFF8F0] bg-[#1A0B0E] px-3 py-1.5 rounded-xl border border-[#F4A62A]/30 cursor-pointer transition-colors"
                title="Reset to official sacred template"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Template
              </button>
            </div>

            {previewMode ? (
              /* Live Preview Card */
              <div className="bg-[#120508] p-6 rounded-xl border border-[#F4A62A]/20 min-h-[400px] text-xs sm:text-sm leading-relaxed text-[#FFF8F0]/90 whitespace-pre-line space-y-3 font-sans">
                <div className="border-b border-[#F4A62A]/20 pb-3 mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4A62A]">STOREFRONT DEVOTEE PREVIEW</span>
                  <span className="text-[10px] text-[#FFF8F0]/40">Verified Sacred Policy</span>
                </div>
                {getCurrentPolicyContent()}
              </div>
            ) : (
              /* Rich Editor Field */
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#F4A62A]">
                  Policy Content (Markdown / Formatted Plain Text)
                </label>
                <textarea
                  rows={20}
                  value={getCurrentPolicyContent()}
                  onChange={(e) => setCurrentPolicyContent(e.target.value)}
                  placeholder={`Write or edit content for ${activeTabMeta.label}...`}
                  className="w-full bg-[#120508] text-xs sm:text-sm text-[#FFF8F0] p-4 rounded-xl border border-[#F4A62A]/30 focus:border-[#F4A62A] focus:outline-none font-mono leading-relaxed resize-y"
                />
                <p className="text-[11px] text-[#FFF8F0]/50 italic">
                  💡 Tip: You can use headers, bullet points, and numbered lists. All changes will reflect live on your temple storefront immediately upon saving.
                </p>
              </div>
            )}

            {/* Bottom Save Action */}
            <div className="flex items-center justify-end pt-4 border-t border-[#F4A62A]/20">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#F4A62A] hover:bg-white text-[#2B1A16] font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer text-xs sm:text-sm border border-[#F4A62A]/40"
              >
                <Save className="w-4 h-4" /> Save {activeTabMeta.label}
              </button>
            </div>

          </div>

        </div>

      </div>
    </form>
  );
};

// Default Sacred & Professional Policy Templates
const DEFAULT_TEMPLATES = {
  refund: `🚩 REFUND & CANCELLATION POLICY - BABA BAIDYANATH PRASADAM SERVICE

1. SACRED PRASAD NATURE & COMMITMENT
All Bhog Prasad items offered on our platform are prepared, consecrated, and blessed directly at the Garbhagriha of Shree Baidyanath Jyotirlinga Temple, Deoghar. Due to the perishable and sacred religious nature of consecrated Mahaprasad, orders once dispatched cannot be returned.

2. CANCELLATION BEFORE DISPATCH
- Orders may be cancelled within 2 hours of placement if the prasad has not yet entered the temple consecration cycle or dispatch stage.
- Full refunds for eligible cancellations will be processed to the original payment method within 3-5 business days.

3. DAMAGE IN TRANSIT OR WRONG ITEM RECEIVED
- In the rare event that your sacred parcel arrives damaged, unsealed, or an incorrect item was delivered, please contact our helpline within 24 hours of delivery.
- WhatsApp us at +91 98765 43210 with photos/videos of the package.
- We will immediately arrange a fresh re-dispatch of blessed Prasad free of charge or issue a full 100% refund.

4. NON-REFUNDABLE CASES
- Incorrect or incomplete delivery address provided by the devotee.
- Unavailability of recipient at the time of delivery attempt by courier.

🔱 Har Har Mahadev! Jai Baba Baidyanath!`,

  privacy: `🔒 PRIVACY & DEVOTEE DATA PROTECTION POLICY

1. INFORMATION WE COLLECT
We respect the privacy of every devotee. When you book Prasad or Puja items online, we collect:
- Full Name & Devotee Sankalp Details
- Delivery Address & Pin Code
- Phone Number & WhatsApp Number for Tracking Updates
- Email Address for Order Receipts

2. USE OF DEVOTEE INFORMATION
- To consecrate Sankalp Prasad accurately in the devotee's name.
- To dispatch parcels via express logistics partners.
- To send SMS / WhatsApp tracking links and holy festival updates.
- We NEVER sell, rent, or trade your personal data to third parties.

3. SECURE PAYMENTS
All transactions are encrypted via 256-bit SSL technology. We do not store credit card, debit card, or UPI PIN numbers on our servers.

4. YOUR RIGHTS
You may request deletion or modification of your account details at any time by emailing support@babadhamprasadam.com.`,

  terms: `📜 TERMS & CONDITIONS OF SERVICE

1. ACCEPTANCE OF TERMS
By accessing or ordering from our official Baidyanath Prasadam portal, you agree to comply with and be bound by these terms.

2. AUTHENTICITY GUARANTEE
We guarantee that all Bhog Prasad, Uttarvahini Ganga Jal, and Rudraksha Malas are 100% genuine and sourced directly from the Baidyanath Dham Temple precinct in Deoghar, Jharkhand.

3. DELIVERY TIMELINES
- Express 24-48 hour dispatch across major metros in India.
- Standard transit time is 2-4 business days depending on pincode accessibility.

4. JURISDICTION
Any legal claims or disputes shall be subject to the exclusive jurisdiction of the courts in Deoghar, Jharkhand, India.`,

  manufacturing: `🕉️ PRODUCT MANUFACTURING, SOURCING & CONSECRATION DETAILS

1. PURE DESI GHEE PEDA PRASAD PREPARATION
- Sourced from pure cow milk and traditional Khoya prepared under hygienic conditions in Deoghar.
- Prepared daily using 100% pure Shuddh Desi Ghee without any chemical preservatives or artificial colors.
- Consecrated at the Garbhagriha altar before hermetic vacuum packaging.

2. HOLY UTTARVAHINI GANGA JAL
- Collected directly from the sacred Uttarvahini Ganga River at Sultanganj.
- Filtered through food-grade brass and copper strainers preserving natural mineral purity.
- Packaged in sealed, leak-proof tamper-evident holy containers.

3. 5-MUKHI TEMPLE BLESSED RUDRAKSHA MALAS
- Sourced directly from authentic Himalayan trees.
- Laboratory certified for natural origin, density, and 5 clear mukhi grooves.
- Sanctified through Vedic Abhishekam ritual at Baba Baidyanath Temple.

4. PACKAGING STANDARDS
- Vacuum sealed in food-grade 5-layer moisture barrier foil to guarantee fresh taste and aroma for up to 30 days.`,

  shipping: `🚚 SHIPPING & EXPRESS DISPATCH POLICY

1. DISPATCH TIMELINES
- Orders placed before 2:00 PM are processed and consecrated for same-day or next-morning dispatch.
- Tracking numbers are sent via SMS & WhatsApp immediately upon courier pickup.

2. SHIPPING CHARGES
- Free Express Shipping on orders above ₹499 across India.
- Nominal ₹49 shipping fee on orders below ₹499.

3. PACKAGING SECURITY
Parcels are packed in durable heavy-duty corrugated boxes with bubble cushion protection and sacred tamper-evident seals to ensure damage-free transit.

4. OVERSEAS / INTERNATIONAL DISPATCH
International shipping to USA, UK, Canada, Australia, and UAE is available via DHL / FedEx Express (3-7 business days).`
};
