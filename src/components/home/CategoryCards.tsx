import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAudio } from '../../context/AudioContext';

export const CategoryCards: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();
  const { playTempleBell } = useAudio();

  return (
    <section id="categories-section" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(isSelected ? 'all' : cat.id);
                playTempleBell();
                const el = document.getElementById('divine-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-4 rounded-2xl bg-[#FFF4E8] hover:bg-[#F7E6D4] border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm group ${
                isSelected 
                  ? 'border-2 border-[#500A18] shadow-md ring-2 ring-[#500A18]/20 bg-[#F7E6D4]' 
                  : 'border-[#F0E2D2] hover:border-[#C27D23]'
              }`}
            >
              {/* Category Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2 shadow-sm bg-white p-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="font-serif-temple font-bold text-xs sm:text-sm text-[#380812] group-hover:text-[#500A18] transition-colors leading-tight">
                {cat.name.replace('Baba Baidyanath ', '').replace(' Prasad', '').replace(' Collection', '')}
              </h3>

              {/* Gold Trident Icon Accent */}
              <span className="text-xs text-[#C27D23] mt-1 font-bold">🔱</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
