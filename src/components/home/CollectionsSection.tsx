import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';
import { motion } from 'framer-motion';

export const CollectionsSection: React.FC = () => {
  const { collections, categories, products, setSelectedCategory } = useStore();
  const { playTempleBell } = useAudio();

  // Combine collections or categories to display clean items
  const items = (collections && collections.length > 0)
    ? collections.filter(c => c.title !== 'Home page' || (c.productIds && c.productIds.length > 0))
    : categories;

  const handleItemClick = (item: any) => {
    playTempleBell();
    
    const titleLower = (item.title || item.name || '').toLowerCase();
    const slugLower = (item.slug || item.id || '').toLowerCase();
    
    if (titleLower.includes('prasad') || slugLower.includes('prasad')) {
      setSelectedCategory('prasad');
    } else if (titleLower.includes('peda') || slugLower.includes('peda')) {
      setSelectedCategory('peda');
    } else if (titleLower.includes('rudraksh') || slugLower.includes('rudraksh')) {
      setSelectedCategory('rudraksh');
    } else if (titleLower.includes('kada') || slugLower.includes('kada')) {
      setSelectedCategory('kada');
    } else if (titleLower.includes('gangajal') || slugLower.includes('gangajal')) {
      setSelectedCategory('gangajal');
    } else if (titleLower.includes('combo') || slugLower.includes('combo') || titleLower.includes('kit')) {
      setSelectedCategory('combos');
    } else if (item.id && ['prasad', 'peda', 'rudraksh', 'kada', 'gangajal', 'combos'].includes(item.id)) {
      setSelectedCategory(item.id);
    } else {
      setSelectedCategory('all');
    }

    const el = document.getElementById('divine-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getItemImage = (item: any, idx: number) => {
    if (item.image && item.image.trim().length > 0) return item.image;
    
    if (item.productIds && item.productIds.length > 0) {
      const p = products.find(prod => item.productIds.includes(prod.id));
      if (p && p.image) return p.image;
    }
    
    const cat = categories[idx % categories.length];
    return cat?.image || 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80';
  };

  const getItemTitle = (item: any) => {
    const raw = item.title || item.name || 'Collection';
    return raw
      .replace('Baba Baidyanath ', '')
      .replace(' Collection', '')
      .trim();
  };

  return (
    <section id="collections-section" className="bg-white py-8 sm:py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: Clean Title Only */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight font-sans">
            We Provide Only
          </h2>
        </div>

        {/* Categories / Collections Horizontal Row */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-5 lg:gap-6 items-start justify-items-center">
          {items.slice(0, 6).map((item, idx) => {
            const imgUrl = getItemImage(item, idx);
            const title = getItemTitle(item);

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => handleItemClick(item)}
                className="flex flex-col items-center group cursor-pointer w-full max-w-[170px]"
              >
                {/* Circular Container with Exact Color: #FFF4EA */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-[#FFF4EA] flex items-center justify-center p-2 sm:p-2.5 md:p-3 transition-all duration-300 group-hover:bg-[#FFEAD5] relative overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={title}
                    className="w-full h-full max-w-[85%] max-h-[85%] object-contain object-center rounded-full transition-transform duration-300 group-hover:scale-108"
                    loading="lazy"
                  />
                </div>

                {/* Title Underneath Circle */}
                <h3 className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#7A1126] text-center tracking-tight leading-tight transition-colors">
                  {title}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
