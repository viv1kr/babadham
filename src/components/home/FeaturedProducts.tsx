import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, categories } = useStore();
  const { playTempleBell } = useAudio();

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="divine-collection" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="font-serif-temple text-2xl sm:text-3xl font-extrabold text-[#500A18] flex items-center justify-center gap-2">
          <span>⚜</span> Our Divine Collection <span>⚜</span>
        </h2>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 mb-8 border-b border-[#EADBC8] pb-3 text-xs sm:text-sm font-semibold text-[#735A47]">
        <button
          onClick={() => {
            setSelectedCategory('all');
            playTempleBell();
          }}
          className={`pb-3 relative transition-colors ${
            selectedCategory === 'all'
              ? 'text-[#500A18] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#500A18]'
              : 'hover:text-[#500A18]'
          }`}
        >
          Best Sellers
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              playTempleBell();
            }}
            className={`pb-3 relative transition-colors ${
              selectedCategory === cat.id
                ? 'text-[#500A18] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#500A18]'
                : 'hover:text-[#500A18]'
            }`}
          >
            {cat.name.replace('Baba Baidyanath ', '').replace(' Prasad', '').replace(' Collection', '')}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Products CTA */}
      <div className="text-center mt-10">
        <button
          onClick={() => {
            setSelectedCategory('all');
            playTempleBell();
          }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#500A18] text-white font-bold text-xs hover:bg-[#C27D23] transition-all shadow-md cursor-pointer"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
