import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { cartCount, wishlist, setIsCartOpen, setIsSearchModalOpen, setSelectedCategory } = useStore();
  const { playTempleBell } = useAudio();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-lg border-t border-[#F4A62A]/30 py-2 px-4 shadow-[0_-5px_20px_rgba(122,17,38,0.1)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={() => {
            setSelectedCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-[#7A1126] font-medium text-[10px]"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('categories-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-[#7A1126] font-medium text-[10px]"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex flex-col items-center text-[#7A1126] font-medium text-[10px]"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </button>

        <a
          href="#wishlist-section"
          className="flex flex-col items-center text-[#7A1126] font-medium text-[10px] relative"
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-[#7A1126] text-[#F4A62A] text-[9px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </a>

        <button
          onClick={() => {
            setIsCartOpen(true);
            playTempleBell();
          }}
          className="flex flex-col items-center text-[#7A1126] font-bold text-[10px] relative px-3 py-1 bg-[#7A1126] text-[#FFF8F0] rounded-xl shadow-md"
        >
          <ShoppingBag className="w-4 h-4 mb-0.5 text-[#F4A62A]" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#F4A62A] text-[#2B1A16] text-[9px] font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
