import React from 'react';
import { AudioProvider } from './context/AudioContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { MarqueeTicker } from './components/home/MarqueeTicker';
import { CollectionsSection } from './components/home/CollectionsSection';
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
import { DatabaseExplorerModal } from './components/db/DatabaseExplorerModal';
import { ScriptInjector } from './components/util/ScriptInjector';
import { PreBookingPage } from './components/prebooking/PreBookingPage';
import { PreBookingSuccess } from './components/prebooking/PreBookingSuccess';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { useStore } from './context/StoreContext';

export const AppContent: React.FC = () => {
  const { activePage, setActivePage } = useStore();

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2B1A16] flex flex-col font-sans selection:bg-[#7A1126] selection:text-[#F4A62A]">
      
      {activePage === 'prebooking' ? (
        <PreBookingPage />
      ) : activePage === 'success' ? (
        <PreBookingSuccess />
      ) : activePage === 'not-found' ? (
        <NotFoundPage />
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <HeroSection />
            <MarqueeTicker />
            <CollectionsSection />
            <FeaturedProducts />
            <BestSellersSection />
            <OfferBanner />
            <WhyChooseUs />
            <Testimonials />
            <FAQSection />
          </main>
          <Footer />
        </>
      )}

      {/* Floating & Overlay Elements */}
      <ToastContainer />
      <SearchModal />

      <ProductQuickViewModal />
      <ProductDetailModal />
      <CartDrawer />
      <DatabaseExplorerModal />
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
