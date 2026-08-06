import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  LayoutDashboard, 
  Tag, 
  Palette, 
  Database,
  Users,
  Sparkles,
  Code,
  LogOut,
  User,
  ShoppingBag,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldCheck,
  FileText,
  RefreshCw,
  Truck,
  Factory,
  Zap,
  FolderOpen,
  Calendar
} from 'lucide-react';
import { PolicySubTab } from '../policies/PoliciesView';
import { ProductSubTab } from '../products/ProductsView';

export interface AdminSidebarProps {
  onSelectPolicySubTab?: (subTab: PolicySubTab) => void;
  currentPolicySubTab?: PolicySubTab;
  onSelectProductSubTab?: (subTab: ProductSubTab) => void;
  currentProductSubTab?: ProductSubTab;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  onSelectPolicySubTab,
  currentPolicySubTab = 'refund',
  onSelectProductSubTab,
  currentProductSubTab = 'products'
}) => {
  const { activeTab, setActiveTab, logout } = useAdmin();
  
  // Desktop Admin Sidebar State (Default: true so text labels & accordion submenus are easily visible)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isProductAccordionOpen, setIsProductAccordionOpen] = useState(false);
  const [isPolicyAccordionOpen, setIsPolicyAccordionOpen] = useState(false);
  const [isSettingsAccordionOpen, setIsSettingsAccordionOpen] = useState(false);

  const menuItems: { id: string; label: string; icon: any; count?: number }[] = [
    { id: 'analytics', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'order-requests', label: 'Order Requests', icon: FileText },
    { id: 'content', label: 'Content & Media Library', icon: FolderOpen },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'booking-slots', label: 'Booking Slots Management', icon: Calendar },
    { id: 'branding', label: 'Brand & Header Editor', icon: Palette },
  ];

  const productSubItems: { id: ProductSubTab; label: string }[] = [
    { id: 'collections', label: 'Collections' },
    { id: 'products', label: 'Products' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'vendors', label: 'Vendors' },
  ];

  const policySubItems: { id: PolicySubTab; label: string; icon: any }[] = [
    { id: 'refund', label: 'Refund Policy', icon: RefreshCw },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'manufacturing', label: 'Product Manufacturing Details', icon: Factory },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
  ];

  const secondaryMenuItems = [
    { id: 'userProfile', label: 'User Profile & Security', icon: User },
    { id: 'scripts', label: 'Custom Scripts & Tags', icon: Code },
    { id: 'database', label: 'MySQL Database Console', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isPolicyActive = activeTab.startsWith('policy');
  const isProductActive = activeTab.startsWith('product') || activeTab === 'inventory' || activeTab === 'products';

  const handlePolicySubItemClick = (subTab: PolicySubTab) => {
    setActiveTab(`policy-${subTab}`);
    if (onSelectPolicySubTab) {
      onSelectPolicySubTab(subTab);
    }
  };

  const handleProductSubItemClick = (subTab: ProductSubTab) => {
    setActiveTab(`product-${subTab}`);
    if (onSelectProductSubTab) {
      onSelectProductSubTab(subTab);
    }
  };

  return (
    <aside 
      className={`${
        isSidebarExpanded ? 'w-72 sm:w-80' : 'w-16 sm:w-20'
      } bg-gradient-to-b from-[#1C080C] via-[#120508] to-[#17060A] border-r border-[#F4A62A]/25 flex flex-col shrink-0 transition-all duration-300 relative select-none z-40 shadow-[4px_0_24px_rgba(0,0,0,0.6)]`}
    >
      {/* ------------------------------------------------------------- */}
      {/* UNIQUE FLOATING EDGE SLIDER TOGGLE BUTTON (z-[100] so never cut off) */}
      {/* ------------------------------------------------------------- */}
      <button
        type="button"
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="absolute -right-3.5 top-5 w-7 h-7 rounded-full bg-[#500A18] border border-[#F4A62A] text-[#F4A62A] shadow-[0_0_15px_rgba(244,166,42,0.6)] flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-[#7A1126] active:scale-95 transition-all z-[100]"
        title={isSidebarExpanded ? "Collapse Sidebar (Icons Only)" : "Expand Sidebar (Full Nav)"}
        aria-label="Toggle Admin Sidebar Width"
      >
        {isSidebarExpanded ? (
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        ) : (
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        )}
      </button>
      {/* ------------------------------------------------------------- */}

      {/* Top Sidebar Header with Sacred Command Badge */}
      <div className="p-3.5 border-b border-[#F4A62A]/20 flex items-center justify-between min-h-[58px]">
        {isSidebarExpanded ? (
          <div className="flex items-center gap-2 px-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-serif-temple font-extrabold text-xs text-[#F4A62A] tracking-wider flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A62A]" /> COMMAND PORTAL
            </span>
          </div>
        ) : (
          <div className="mx-auto text-[#F4A62A]" title="Baidyanath Admin Portal">
            <Zap className="w-5 h-5 fill-[#F4A62A]/20" />
          </div>
        )}
      </div>

      {/* Navigation Tabs Container with Micro-Slim Golden Scrollbar */}
      <div className="pt-3 pb-24 px-2 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        
        {/* Standard Menu Items */}
        {menuItems.map(item => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all group relative cursor-pointer ${
                  isActive 
                    ? 'text-[#F4A62A] font-extrabold bg-transparent border-none' 
                    : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] bg-transparent border-none'
                }`}
                title={!isSidebarExpanded ? item.label : undefined}
              >
                {/* Active Golden Left Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-[#F4A62A] to-[#D98C1F] rounded-r-full shadow-[0_0_10px_#F4A62A]" />
                )}

                {/* Icon Frame */}
                <div 
                  className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-lg transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>

                {/* Text Label & Badge */}
                {isSidebarExpanded && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="text-left whitespace-nowrap truncate text-xs sm:text-[13px] tracking-wide">
                      {item.label}
                    </span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#F4A62A]/30 shadow-inner shrink-0 ml-2">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}

                {/* Hover Tooltip when Collapsed */}
                {!isSidebarExpanded && (
                  <span className="absolute left-16 bg-[#2B1217] text-[#F4A62A] text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-[#F4A62A]/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label} {item.count !== undefined && item.count > 0 ? `(${item.count})` : ''}
                  </span>
                )}
              </button>

              {/* PRODUCTS COLLAPSIBLE ACCORDION RIGHT UNDER ORDERS */}
              {item.id === 'orders' && (
                <div className="pt-1 pb-1 relative group/product">
                  {/* Parent Header Card: "Products" */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSidebarExpanded) {
                        setIsSidebarExpanded(true);
                        setIsProductAccordionOpen(true);
                      } else {
                        setIsProductAccordionOpen(!isProductAccordionOpen);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group relative ${
                      isProductActive 
                        ? 'text-[#F4A62A] font-extrabold bg-transparent border-none' 
                        : 'text-[#FFF8F0]/90 hover:text-[#F4A62A] bg-transparent border-none'
                    }`}
                  >
                    {isProductActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-[#F4A62A] to-[#D98C1F] rounded-r-full shadow-[0_0_10px_#F4A62A]" />
                    )}

                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center shrink-0">
                        <Tag className={`w-5 h-5 ${isProductActive ? 'text-[#F4A62A] stroke-[2.5]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'}`} />
                      </div>
                      {isSidebarExpanded && (
                        <span className="text-xs sm:text-[13px] tracking-wide text-left truncate font-semibold">
                          Products
                        </span>
                      )}
                    </div>

                    {isSidebarExpanded && (
                      <div className={`shrink-0 ${isProductActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'}`}>
                        {isProductAccordionOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* HOVER FLYOUT POPUP SUBMENU (When Sidebar is Collapsed) */}
                  {!isSidebarExpanded && (
                    <div className="absolute left-16 top-0 ml-2 w-64 bg-[#1A0B0E] border border-[#F4A62A]/40 rounded-2xl shadow-2xl p-4 opacity-0 pointer-events-none group-hover/product:opacity-100 group-hover/product:pointer-events-auto transition-all duration-300 z-50">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-[#F4A62A]/20 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-transparent flex items-center justify-center">
                          <Tag className="w-4 h-4 text-[#F4A62A]" />
                        </div>
                        <span className="font-extrabold text-xs text-[#F4A62A] tracking-wider uppercase">
                          Products
                        </span>
                      </div>

                      <div className="ml-3 pl-3 border-l border-[#F4A62A]/40 space-y-2 relative">
                        {productSubItems.map((subItem) => {
                          const isSubActive = activeTab === `product-${subItem.id}` || (currentProductSubTab === subItem.id && isProductActive);

                          return (
                            <button
                              key={subItem.id}
                              type="button"
                              onClick={() => handleProductSubItemClick(subItem.id)}
                              className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs font-medium cursor-pointer relative group/item ${
                                isSubActive 
                                  ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                                  : 'text-[#FFF8F0]/80 hover:text-[#F4A62A] bg-transparent'
                              }`}
                            >
                              <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                                isSubActive ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                              }`} />
                              <span className="truncate">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Connected Submenu Tree List (In Expanded Sidebar Mode) */}
                  {isSidebarExpanded && isProductAccordionOpen && (
                    <div className="ml-5 mt-2 pl-3 border-l border-[#F4A62A]/40 space-y-2 relative">
                      {productSubItems.map((subItem) => {
                        const isSubActive = activeTab === `product-${subItem.id}` || (currentProductSubTab === subItem.id && isProductActive);

                        return (
                          <button
                            key={subItem.id}
                            type="button"
                            onClick={() => handleProductSubItemClick(subItem.id)}
                            className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs cursor-pointer relative group/item ${
                              isSubActive 
                                ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                                : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] bg-transparent'
                            }`}
                          >
                            <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                              isSubActive ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                            }`} />
                            <span className="truncate">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* ------------------------------------------------------------- */}
        {/* UNIQUE COLLAPSIBLE ACCORDION & HOVER FLYOUT POLICY MANAGER */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-1 pb-1 relative group/policy">
          
          {/* Parent Header Card: "Manage Policies" */}
          <button
            type="button"
            onClick={() => {
              if (!isSidebarExpanded) {
                setIsSidebarExpanded(true);
                setIsPolicyAccordionOpen(true);
              } else {
                setIsPolicyAccordionOpen(!isPolicyAccordionOpen);
              }
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group relative ${
              isPolicyActive 
                ? 'text-[#F4A62A] font-extrabold bg-transparent border-none' 
                : 'text-[#FFF8F0]/90 hover:text-[#F4A62A] bg-transparent border-none'
            }`}
          >
            {isPolicyActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-[#F4A62A] to-[#D98C1F] rounded-r-full shadow-[0_0_10px_#F4A62A]" />
            )}

            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center shrink-0">
                <Info className={`w-5 h-5 ${isPolicyActive ? 'text-[#F4A62A] stroke-[2.5]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'}`} />
              </div>
              {isSidebarExpanded && (
                <span className="text-xs sm:text-[13px] tracking-wide text-left truncate">
                  Manage Policies
                </span>
              )}
            </div>

            {isSidebarExpanded && (
              <div className={`shrink-0 ${isPolicyActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'}`}>
                {isPolicyAccordionOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            )}
          </button>

          {/* HOVER FLYOUT POPUP SUBMENU (When Sidebar is Collapsed) */}
          {!isSidebarExpanded && (
            <div className="absolute left-16 top-0 ml-2 w-64 bg-[#1A0B0E] border border-[#F4A62A]/40 rounded-2xl shadow-2xl p-4 opacity-0 pointer-events-none group-hover/policy:opacity-100 group-hover/policy:pointer-events-auto transition-all duration-300 z-50">
              
              {/* Flyout Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#F4A62A]/20 mb-3">
                <div className="w-7 h-7 rounded-lg bg-transparent flex items-center justify-center">
                  <Info className="w-4 h-4 text-[#F4A62A]" />
                </div>
                <span className="font-extrabold text-xs text-[#F4A62A] tracking-wider uppercase">
                  Manage Policies
                </span>
              </div>

              {/* Flyout Submenu List with Bullet Node Dots */}
              <div className="ml-3 pl-3 border-l border-[#F4A62A]/40 space-y-2 relative">
                {policySubItems.map((subItem) => {
                  const isSubActive = activeTab === `policy-${subItem.id}` || (activeTab === 'policies' && currentPolicySubTab === subItem.id);

                  return (
                    <button
                      key={subItem.id}
                      type="button"
                      onClick={() => handlePolicySubItemClick(subItem.id)}
                      className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs font-medium cursor-pointer relative group/item ${
                        isSubActive 
                          ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                          : 'text-[#FFF8F0]/80 hover:text-[#F4A62A] bg-transparent'
                      }`}
                    >
                      <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                        isSubActive ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                      }`} />
                      <span className="truncate">{subItem.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* Connected Submenu Tree List (In Expanded Sidebar Mode) */}
          {isSidebarExpanded && isPolicyAccordionOpen && (
            <div className="ml-5 mt-2 pl-3 border-l border-[#F4A62A]/40 space-y-2 relative">
              {policySubItems.map((subItem) => {
                const isSubActive = activeTab === `policy-${subItem.id}` || (activeTab === 'policies' && currentPolicySubTab === subItem.id);

                return (
                  <button
                    key={subItem.id}
                    type="button"
                    onClick={() => handlePolicySubItemClick(subItem.id)}
                    className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs cursor-pointer relative group/item ${
                      isSubActive 
                        ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                        : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] bg-transparent'
                    }`}
                  >
                    {/* Node Bullet Dot on the Vertical Line */}
                    <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                      isSubActive ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                    }`} />
                    <span className="truncate">{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          )}

        </div>
        {/* ------------------------------------------------------------- */}

        {/* Secondary Menu Items */}
        {secondaryMenuItems.map(item => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
            <button
              onClick={() => {
                if (item.id === 'settings') {
                  if (!isSidebarExpanded) {
                    setIsSidebarExpanded(true);
                    setIsSettingsAccordionOpen(true);
                  } else {
                    setIsSettingsAccordionOpen(!isSettingsAccordionOpen);
                  }
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group relative cursor-pointer ${
                isActive 
                  ? 'text-[#F4A62A] font-extrabold bg-transparent border-none' 
                  : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] bg-transparent border-none'
              }`}
              title={!isSidebarExpanded ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-[#F4A62A] to-[#D98C1F] rounded-r-full shadow-[0_0_10px_#F4A62A]" />
              )}

              <div className="flex items-center gap-3 overflow-hidden">
                <div 
                  className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-lg transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>

                {isSidebarExpanded && (
                  <span className="text-left whitespace-nowrap truncate text-xs sm:text-[13px] tracking-wide">
                    {item.label}
                  </span>
                )}
              </div>

              {isSidebarExpanded && item.id === 'settings' && (
                <div className={`shrink-0 ${isActive ? 'text-[#F4A62A]' : 'text-[#FFF8F0]/60 group-hover:text-[#F4A62A]'}`}>
                  {isSettingsAccordionOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              )}

              {!isSidebarExpanded && (
                <span className="absolute left-16 bg-[#2B1217] text-[#F4A62A] text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-[#F4A62A]/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
            
            {/* SETTINGS ACCORDION RIGHT UNDER SETTINGS MENU */}
            {item.id === 'settings' && (
              <div className="pt-1 pb-1 relative group/settings">
                {/* Connected Submenu Tree List (In Expanded Sidebar Mode) */}
                {isSidebarExpanded && isSettingsAccordionOpen && (
                  <div className="ml-5 mt-1 pl-3 border-l border-[#F4A62A]/40 space-y-1 relative">
                    <button
                      type="button"
                      onClick={() => setActiveTab('payments')}
                      className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs cursor-pointer relative group/item ${
                        activeTab === 'payments' 
                          ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                          : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] bg-transparent'
                      }`}
                    >
                      <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                        activeTab === 'payments' ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                      }`} />
                      <span className="truncate">Payments & Shipping</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('email-whatsapp')}
                      className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs cursor-pointer relative group/item ${
                        activeTab === 'email-whatsapp' 
                          ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                          : 'text-[#FFF8F0]/70 hover:text-[#F4A62A] bg-transparent'
                      }`}
                    >
                      <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                        activeTab === 'email-whatsapp' ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                      }`} />
                      <span className="truncate">Email & WhatsApp API Integration</span>
                    </button>
                  </div>
                )}
                
                {/* HOVER FLYOUT POPUP SUBMENU (When Sidebar is Collapsed) */}
                {!isSidebarExpanded && (
                  <div className="absolute left-16 top-0 ml-2 w-64 bg-[#1A0B0E] border border-[#F4A62A]/40 rounded-2xl shadow-2xl p-4 opacity-0 pointer-events-none group-hover/settings:opacity-100 group-hover/settings:pointer-events-auto transition-all duration-300 z-50">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[#F4A62A]/20 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-transparent flex items-center justify-center">
                        <Settings className="w-4 h-4 text-[#F4A62A]" />
                      </div>
                      <span className="font-serif-temple font-bold text-[#F4A62A] text-sm">Settings</span>
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs font-medium cursor-pointer relative group/item ${
                          activeTab === 'payments' 
                            ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                            : 'text-[#FFF8F0]/80 hover:text-[#F4A62A] bg-transparent'
                        }`}
                      >
                        <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                          activeTab === 'payments' ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                        }`} />
                        <span className="truncate">Payments & Shipping</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('email-whatsapp')}
                        className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-lg text-left transition-all text-xs font-medium cursor-pointer relative group/item ${
                          activeTab === 'email-whatsapp' 
                            ? 'text-[#F4A62A] font-extrabold bg-transparent' 
                            : 'text-[#FFF8F0]/80 hover:text-[#F4A62A] bg-transparent'
                        }`}
                      >
                        <span className={`absolute -left-[16.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#F4A62A] transition-colors ${
                          activeTab === 'email-whatsapp' ? 'bg-[#F4A62A] shadow-[0_0_8px_#F4A62A]' : 'bg-[#120508] group-hover/item:bg-[#F4A62A]'
                        }`} />
                        <span className="truncate">Email & WhatsApp API Integration</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            </React.Fragment>
          );
        })}

      </div>

      {/* LOGOUT FOOTER */}
      <div className="p-3 border-t border-[#F4A62A]/20 bg-[#17060A]/80">
        <button
          onClick={logout}
          className={`relative flex items-center ${isSidebarExpanded ? 'justify-start gap-3 px-4' : 'justify-center'} py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/80 text-red-400 hover:text-red-200 text-xs sm:text-sm font-bold transition-all border border-red-900/40 group cursor-pointer w-full`}
          title="Logout"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {isSidebarExpanded && <span>Logout</span>}
          
          {!isSidebarExpanded && (
            <span className="absolute left-16 bg-red-900 text-red-100 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-red-500/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>

    </aside>
  );
};
