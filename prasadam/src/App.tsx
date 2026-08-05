import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminHeader } from './components/layout/AdminHeader';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminFooter } from './components/layout/AdminFooter';
import { AdminLogin } from './components/auth/AdminLogin';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { ProductsView, ProductSubTab } from './components/products/ProductsView';
import { CouponsView } from './components/coupons/CouponsView';
import { BrandingView } from './components/branding/BrandingView';
import { DevoteeDirectoryView } from './components/devotees/DevoteeDirectoryView';
import { ContentView } from './components/content/ContentView';
import { DatabaseView } from './components/database/DatabaseView';
import { CustomScriptsView } from './components/scripts/CustomScriptsView';
import { UserProfileView } from './components/user/UserProfileView';
import { PoliciesView, PolicySubTab } from './components/policies/PoliciesView';
import { ToastContainer } from './components/ui/ToastContainer';

export const AdminContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useAdmin();
  const [selectedPolicySubTab, setSelectedPolicySubTab] = useState<PolicySubTab>('refund');
  const [selectedProductSubTab, setSelectedProductSubTab] = useState<ProductSubTab>('products');

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const isPolicyTab = activeTab.startsWith('policy') || activeTab === 'policies';
  const currentSubTab: PolicySubTab = activeTab.startsWith('policy-') 
    ? (activeTab.replace('policy-', '') as PolicySubTab)
    : selectedPolicySubTab;

  const isProductTab = activeTab.startsWith('product') || activeTab === 'products';
  const currentProductSubTab: ProductSubTab = activeTab.startsWith('product-')
    ? (activeTab.replace('product-', '') as ProductSubTab)
    : selectedProductSubTab;

  return (
    <div className="h-screen w-screen bg-[#120508] text-[#FFF8F0] flex flex-col font-sans overflow-hidden">
      
      {/* Header */}
      <AdminHeader />

      {/* Main Workplace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <AdminSidebar 
          currentPolicySubTab={currentSubTab}
          onSelectPolicySubTab={(subTab) => setSelectedPolicySubTab(subTab)}
          currentProductSubTab={currentProductSubTab}
          onSelectProductSubTab={(subTab) => setSelectedProductSubTab(subTab)}
        />

        {/* Dynamic Workplace Tab View */}
        <main className={`flex-1 bg-[#120508] ${activeTab === 'branding' || isPolicyTab || isProductTab ? 'p-0' : 'p-4 sm:p-6'} overflow-y-auto`}>
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'content' && <ContentView />}
          {isProductTab && <ProductsView key={currentProductSubTab} initialSubTab={currentProductSubTab} />}
          {activeTab === 'coupons' && <CouponsView />}
          {activeTab === 'branding' && <BrandingView />}
          {activeTab === 'devotees' && <DevoteeDirectoryView />}
          {isPolicyTab && <PoliciesView key={currentSubTab} initialSubTab={currentSubTab} />}
          {activeTab === 'userProfile' && <UserProfileView />}
          {activeTab === 'scripts' && <CustomScriptsView />}
          {activeTab === 'database' && <DatabaseView />}
        </main>

      </div>

      {/* Footer */}
      <AdminFooter />

      {/* Admin Toast Feedback */}
      <ToastContainer />

    </div>
  );
};

export function App() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}

export default App;
