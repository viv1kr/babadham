import React from 'react';
import { AudioProvider } from './context/AudioContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { MarqueeTicker } from './components/home/MarqueeTicker';
import { CategoryCards } from './components/home/CategoryCards';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { BestSellersSection } from './components/home/BestSellersSection';
import { OfferBanner } from './components/home/OfferBanner';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { Testimonials } from './components/home/Testimonials';
import { FAQSection } from './components/home/FAQSection';
import { Footer } from './components/layout/Footer';
// Removed FloatingActions import
// Removed OfferPopups import
import { ToastContainer } from './components/ui/ToastContainer';
import { SearchModal } from './components/ui/SearchModal';
import { ProductQuickViewModal } from './components/product/ProductQuickViewModal';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { DatabaseExplorerModal } from './components/db/DatabaseExplorerModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ScriptInjector } from './components/util/ScriptInjector';


export const AppContent: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2B1A16] flex flex-col font-sans selection:bg-[#7A1126] selection:text-[#F4A62A]">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <MarqueeTicker />
        <CategoryCards />
        <FeaturedProducts />
        <BestSellersSection />
        <OfferBanner />
        <WhyChooseUs />
        <Testimonials />
        <FAQSection />
      </main>

      <Footer />

      {/* Floating & Overlay Elements */}
      <ToastContainer />
      <SearchModal />

      {/* Modals & Lightboxes */}
      <ProductQuickViewModal />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <DatabaseExplorerModal />
      <AdminPortal />
      <ScriptInjector />
    </div>
  );
};

export function App() {
  return (
    <AudioProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AudioProvider>
  );
}

export default App;
