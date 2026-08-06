import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Package, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen,
  ChevronRight,
  CreditCard,
  SmartphoneNfc,
  HeartHandshake
} from 'lucide-react';
import { PolicyModal, type StorefrontPolicyType } from '../modals/PolicyModal';

export const Footer: React.FC = () => {
  const { brandSettings } = useStore();
  const [activePolicyModal, setActivePolicyModal] = useState<StorefrontPolicyType>(null);

  const collections = [
    { label: 'Deoghar Prashadi', href: '#featured-products' },
    { label: 'Peda', href: '#featured-products' },
    { label: 'Rudraksh', href: '#featured-products' },
    { label: 'Kada', href: '#featured-products' },
    { label: 'Gangajal', href: '#featured-products' },
    { label: 'Combo', href: '#featured-products' },
  ];

  const policies = [
    { type: 'refund' as const, label: 'Refund and Cancellation Policy' },
    { type: 'privacy' as const, label: 'Privacy Policy' },
    { type: 'terms' as const, label: 'Terms & Conditions of Services' },
    { type: 'manufacturing' as const, label: 'Manufacturing Details' },
    { type: 'shipping' as const, label: 'Shipping Policy' },
  ];

  const facebookLink = brandSettings?.facebookUrl || 'https://facebook.com';
  const instagramLink = brandSettings?.instagramUrl || 'https://instagram.com';
  const rawWhatsapp = brandSettings?.whatsappNumber || '+91 98765 43210';
  const whatsappLink = rawWhatsapp.startsWith('http') 
    ? rawWhatsapp 
    : `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman & Nicobar", "Chandigarh", 
    "Dadra & Nagar Haveli", "Daman & Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

  return (
    <footer id="footer-section" className="w-full bg-gradient-to-b from-[#6A0E20] via-[#500A18] to-[#3B0610] text-[#FFF8F0] relative overflow-hidden border-t-4 border-[#F4A62A]">
      {/* Background Line Art Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-cream-pattern" />

      {/* Trust Badges Strip */}
      <div className="w-full py-8 border-b border-[#F4A62A]/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y lg:divide-y-0 divide-[#F4A62A]/10 lg:divide-x lg:divide-[#F4A62A]/20">
          
          <div className="flex items-center justify-center gap-4 lg:px-4 pt-4 lg:pt-0 first:pt-0 first:border-0">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#F4A62A] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm sm:text-base leading-tight">100% Authentic</span>
              <span className="text-[#F4A62A]/90 text-xs sm:text-sm mt-0.5 font-medium">प्रामाणिक प्रसाद</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 lg:px-4 pt-4 lg:pt-0">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#F4A62A] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm sm:text-base leading-tight">Secure Packaging</span>
              <span className="text-[#F4A62A]/90 text-xs sm:text-sm mt-0.5 font-medium">सुरक्षित पैकिंग</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 lg:px-4 pt-4 lg:pt-0">
            <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-[#F4A62A] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm sm:text-base leading-tight">Pan India Delivery</span>
              <span className="text-[#F4A62A]/90 text-xs sm:text-sm mt-0.5 font-medium">संपूर्ण भारत में डिलीवरी</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 lg:px-4 pt-4 lg:pt-0">
            <HeartHandshake className="w-8 h-8 sm:w-10 sm:h-10 text-[#F4A62A] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm sm:text-base leading-tight">Baba's Blessings</span>
              <span className="text-[#F4A62A]/90 text-xs sm:text-sm mt-0.5 font-medium">बाबा का आशीर्वाद</span>
            </div>
          </div>

        </div>
      </div>


      {/* Main Footer Links (4 Column Grid with 100% Identical DOM Structure for We Are Offering & Our Policies) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: Brand Info & Social Media Handles */}
        <div className="space-y-4">
          <div>
            <img 
              src={brandSettings?.logoImageUrl || (typeof window !== 'undefined' ? localStorage.getItem('babadham_logo_image') : '') || '/assets/logo.svg'} 
              alt="Company Logo" 
              className="max-h-12 max-w-[220px] object-contain drop-shadow-md" 
            />
          </div>

          <p className="text-xs sm:text-[13px] text-[#FFF8F0]/85 leading-relaxed font-sans">
            Official digital prasadam portal connecting devotees across the globe to the divine blessings of Shree Baidyanath Jyotirlinga, Deoghar.
          </p>

          {/* OFFICIAL DYNAMIC SOCIAL MEDIA HANDLES */}
          <div className="pt-1">
            <span className="text-xs font-bold text-[#F4A62A] uppercase tracking-wider block mb-2">
              Connect With Us
            </span>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A0B0E] border border-[#F4A62A]/40 text-[#F4A62A] hover:bg-[#F4A62A] hover:text-[#2B1A16] hover:scale-115 transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer"
                title="Official Facebook Page"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A0B0E] border border-[#F4A62A]/40 text-[#F4A62A] hover:bg-[#F4A62A] hover:text-[#2B1A16] hover:scale-115 transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer"
                title="Official Instagram Handle"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A0B0E] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:scale-115 transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer"
                title="Devotee WhatsApp Helpline"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: We Are Offering (Identical Structure) */}
        <div className="space-y-3">
          <h4 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 uppercase tracking-wide h-6">
            <Sparkles className="w-4.5 h-4.5 text-[#F4A62A] shrink-0" /> We Are Offering
          </h4>

          <ul className="space-y-2 text-xs sm:text-[13px] font-medium">
            {collections.map((item, idx) => {
              return (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    className="group flex items-center gap-2 py-0.5 text-[#FFF8F0]/90 hover:text-[#F4A62A] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#F4A62A] shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 3: Our Policies (Identical Structure as We Are Offering) */}
        <div className="space-y-3">
          <h4 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 uppercase tracking-wide h-6">
            <BookOpen className="w-4.5 h-4.5 text-[#F4A62A] shrink-0" /> Our Policies
          </h4>

          <ul className="space-y-2 text-xs sm:text-[13px] font-medium">
            {policies.map((item, idx) => {
              return (
                <li key={idx}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePolicyModal(item.type);
                    }}
                    className="group flex items-center gap-2 py-0.5 text-[#FFF8F0]/90 hover:text-[#F4A62A] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#F4A62A] shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 4 (VERY LAST): Official Shrine Address */}
        <div className="space-y-3">
          <h4 className="font-serif-temple text-base sm:text-lg font-bold text-[#F4A62A] flex items-center gap-2 uppercase tracking-wide h-6">
            <MapPin className="w-4.5 h-4.5 text-[#F4A62A] shrink-0" /> Official Shrine Address
          </h4>

          <ul className="space-y-2 text-xs sm:text-[13px] text-[#FFF8F0]/85">
            <li className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#F4A62A] shrink-0 mt-0.5" />
              <span>{brandSettings?.address || 'Baidyanath Dham Temple Complex Road, Deoghar, Jharkhand - 814112'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#F4A62A] shrink-0" />
              <span>Helpline: {brandSettings?.helplineNumber || '+91 98765 43210'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#F4A62A] shrink-0" />
              <span>{brandSettings?.supportEmail || 'seva@baidyanathprasadam.com'}</span>
            </li>
            {brandSettings?.fssaiLicenseNumber && (
              <li className="flex items-center gap-2.5 text-emerald-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>FSSAI Lic: {brandSettings.fssaiLicenseNumber}</span>
              </li>
            )}
          </ul>
        </div>

      </div>

      {/* We Deliver To Section */}
      <div className="border-b border-[#F4A62A]/20 bg-[#3B0610]/60 backdrop-blur-sm px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-start text-left">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4A62A]" />
            <h3 className="text-[#F4A62A] text-sm sm:text-base font-black tracking-widest uppercase">We Deliver To All Over India</h3>
          </div>
          <div className="flex flex-wrap justify-start items-center gap-x-1.5 sm:gap-x-2.5 gap-y-1 sm:gap-y-1.5 leading-tight w-full">
            {indianStates.map((state, index) => (
              <React.Fragment key={state}>
                <span className="text-[11px] sm:text-xs text-[#FFF8F0]/45 font-normal whitespace-nowrap hover:text-[#F4A62A] transition-colors cursor-default tracking-wide">{state}</span>
                {index < indianStates.length - 1 && (
                  <span className="text-[#F4A62A]/25 text-[9px] sm:text-[10px]">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="block bg-[#3B0610] py-4 text-center text-xs text-[#FFF8F0]/70 border-t border-[#F4A62A]/15 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2.5">
          <div className="mb-2 sm:mb-0">
            © {new Date().getFullYear()} {brandSettings?.brandName || 'BABA BAIDYANATH PRASADAM'}. All rights reserved.
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <span className="text-[#F4A62A]/60 text-[10px] uppercase tracking-widest font-black">100% Secure Payments</span>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <span className="text-white font-bold text-xs sm:text-sm tracking-wide">GPay</span>
              <span className="text-white font-bold text-xs sm:text-sm tracking-wide">PhonePe</span>
              <div className="flex items-center gap-1.5">
                <SmartphoneNfc className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4A62A]" />
                <span className="text-white font-bold text-xs sm:text-sm tracking-wide">NetBanking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4A62A]" />
                <span className="text-white font-bold text-xs sm:text-sm tracking-wide">Cards</span>
              </div>
            </div>
            <a href="/sitemap.xml" className="text-[#F4A62A] hover:underline cursor-pointer text-[10px] mt-2 lg:mt-0 lg:ml-3">Sitemap</a>
          </div>
        </div>
      </div>

      {/* Interactive Policy View Modal */}
      <PolicyModal 
        policyType={activePolicyModal} 
        onClose={() => setActivePolicyModal(null)} 
      />

    </footer>
  );
};
