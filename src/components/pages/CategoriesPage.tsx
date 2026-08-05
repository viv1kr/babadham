import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, ChevronRight, Sparkles } from 'lucide-react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export const CategoriesPage: React.FC = () => {
  const { categories, brandSettings, setActivePage, setSelectedCategory } = useStore();

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans selection:bg-[#F4A62A]/30 flex flex-col">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-mandala-pattern mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-noise-pattern" />

      <Navbar />

      <main className="flex-grow pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#F4A62A]/10 rounded-full blur-3xl" />
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3B0610]/5 border border-[#3B0610]/10 mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 text-[#F4A62A]" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#3B0610] uppercase">
                {brandSettings?.brandName || "Divine Collection"}
              </span>
              <Sparkles className="w-4 h-4 text-[#F4A62A]" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#3B0610] mb-4 tracking-tight drop-shadow-sm font-display">
              Sacred <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A62A] to-[#E59519]">Categories</span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#3B0610]/70 max-w-2xl mx-auto font-medium">
              Explore our curated selection of divine offerings, authentic prasadam, and sacred items straight from the heart of Baba Baidyanath Dham.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id as any);
                  setActivePage('home');
                  setTimeout(() => {
                    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#3B0610]/5 cursor-pointer transform hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-56 sm:h-64 overflow-hidden w-full bg-[#3B0610]/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B0610]/80 via-[#3B0610]/20 to-transparent z-10" />
                  
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#3B0610]/5 group-hover:scale-105 transition-transform duration-700">
                      <Package className="w-16 h-16 text-[#3B0610]/20" />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                    <span className="text-[#3B0610] font-black text-xs uppercase tracking-wider">
                      {category.itemCount} Items
                    </span>
                  </div>

                  {/* Hindi Name Overlay */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-white/90 font-black text-xl sm:text-2xl drop-shadow-md">
                      {category.hindiName}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow bg-gradient-to-b from-white to-[#FFF8F0]/30 relative z-20">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#3B0610] tracking-tight group-hover:text-[#F4A62A] transition-colors">
                      {category.name}
                    </h2>
                    <div className="w-10 h-10 rounded-full bg-[#3B0610]/5 flex items-center justify-center group-hover:bg-[#F4A62A] group-hover:text-white transition-colors flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-[#3B0610] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  
                  <p className="text-[#3B0610]/70 text-sm sm:text-base font-medium leading-relaxed mb-6">
                    {category.tagline}
                  </p>

                  <div className="mt-auto pt-6 border-t border-[#3B0610]/5">
                    <span className="text-[#F4A62A] font-bold text-sm uppercase tracking-widest group-hover:text-[#3B0610] transition-colors flex items-center gap-2">
                      Explore Collection 
                      <span className="block w-8 h-[2px] bg-current transform origin-left group-hover:scale-x-150 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
