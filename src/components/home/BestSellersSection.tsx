import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Crown, Sparkles } from 'lucide-react';

export const BestSellersSection: React.FC = () => {
  const { products } = useStore();
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#7A1126]/5 via-[#7A1126]/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D98C1F] font-bold flex items-center gap-1">
              <Crown className="w-4 h-4 text-[#F4A62A]" /> Devotee Most Loved
            </span>
            <h2 className="font-serif-temple text-3xl sm:text-4xl font-extrabold text-[#7A1126] mt-1">
              Baidyanath Dham Bestsellers
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A1126] bg-[#FFF8F0] px-4 py-2 rounded-2xl border border-[#F4A62A]/40 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#F4A62A]" />
            <span>Over 15,000+ Sacred Orders Delivered Across India</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
