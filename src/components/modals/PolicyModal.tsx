import React from 'react';
import { ShieldCheck, FileText, RefreshCw, Truck, Factory, X, BookOpen } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export type StorefrontPolicyType = 'refund' | 'privacy' | 'terms' | 'manufacturing' | 'shipping' | null;

interface PolicyModalProps {
  policyType: StorefrontPolicyType;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  const { brandSettings } = useStore();

  if (!policyType) return null;

  const policyConfig = {
    refund: {
      title: 'Refund & Cancellation Policy',
      icon: RefreshCw,
      color: 'text-[#F4A62A]',
      content: brandSettings?.refundPolicy || DEFAULT_TEMPLATES.refund
    },
    privacy: {
      title: 'Privacy & Devotee Protection Policy',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      content: brandSettings?.privacyPolicy || DEFAULT_TEMPLATES.privacy
    },
    terms: {
      title: 'Terms & Conditions of Service',
      icon: FileText,
      color: 'text-blue-400',
      content: brandSettings?.termsConditionPolicy || DEFAULT_TEMPLATES.terms
    },
    manufacturing: {
      title: 'Product Manufacturing & Consecration Details',
      icon: Factory,
      color: 'text-purple-400',
      content: brandSettings?.manufacturingDetailsPolicy || DEFAULT_TEMPLATES.manufacturing
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: Truck,
      color: 'text-orange-400',
      content: brandSettings?.shippingPolicy || DEFAULT_TEMPLATES.shipping
    }
  }[policyType];

  if (!policyConfig) return null;

  const IconComp = policyConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C080C] border-2 border-[#F4A62A] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#2B1217] border-b border-[#F4A62A]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 flex items-center justify-center">
              <IconComp className={`w-5 h-5 ${policyConfig.color}`} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#F4A62A] tracking-widest block">
                Baidyanath Dham Official Policy
              </span>
              <h3 className="font-serif-temple text-base sm:text-lg font-bold text-[#FFF8F0]">
                {policyConfig.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A0B0E] border border-[#F4A62A]/30 text-[#FFF8F0]/70 hover:text-[#F4A62A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#FFF8F0]/90 leading-relaxed font-sans whitespace-pre-line">
          {policyConfig.content}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#2B1217] border-t border-[#F4A62A]/20 flex items-center justify-between text-xs text-[#F4A62A]">
          <span className="flex items-center gap-1.5 font-semibold">
            <BookOpen className="w-4 h-4" /> Official Temple Prasadam Seva
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-colors cursor-pointer"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};

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
