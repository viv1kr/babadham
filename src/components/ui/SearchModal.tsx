import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, products, setDetailProduct, addToCart } = useStore();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(q) || 
           p.hindiName.includes(q) || 
           p.categoryName.toLowerCase().includes(q) ||
           p.shortDesc.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isSearchModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 px-4 bg-[#2B1A16]/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          className="w-full max-w-2xl bg-[#FFF8F0] rounded-3xl shadow-2xl border border-[#F4A62A]/40 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center px-6 py-4 border-b border-[#7A1126]/10 bg-[#FFF8F0]">
            <Search className="w-6 h-6 text-[#7A1126] mr-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Sacred Prasad, Peda, Rudraksh, Gangajal..."
              className="flex-1 bg-transparent text-[#2B1A16] placeholder-[#2B1A16]/50 text-lg focus:outline-none font-medium"
              autoFocus
            />
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="p-2 text-[#7A1126] hover:bg-[#7A1126]/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Recommendations */}
          {!query.trim() && (
            <div className="p-6">
              <h4 className="text-xs uppercase tracking-widest text-[#7A1126] font-bold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F4A62A]" /> Devotee Frequent Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Maha Shravani Prasad', 'Pure Deoghar Peda', 'Nepal 5-Mukhi Rudraksh', 'Panchdhatu Kada', 'Sultanganj Gangajal'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 rounded-xl bg-[#7A1126]/5 hover:bg-[#7A1126] hover:text-[#FFF8F0] text-xs font-semibold text-[#7A1126] border border-[#7A1126]/15 transition-all flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim() && (
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-[#2B1A16]/60">
                  <p className="text-base font-semibold">No sacred items found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching for 'Peda', 'Rudraksh', or 'Prasad'</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[#FFF8F0] hover:bg-[#7A1126]/5 border border-transparent hover:border-[#F4A62A]/40 transition-all cursor-pointer group"
                    onClick={() => {
                      setDetailProduct(product);
                      setIsSearchModalOpen(false);
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-[#F4A62A]/30 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#F4A62A] bg-[#7A1126] px-2 py-0.5 rounded-full">
                          {product.categoryName}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-bold text-[#7A1126] flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-[#F4A62A]" /> {product.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif-temple text-base font-bold text-[#2B1A16] group-hover:text-[#7A1126] transition-colors leading-tight mt-0.5">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#2B1A16]/70 line-clamp-1">{product.hindiName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-[#7A1126]">₹{product.price}</div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="mt-1 px-3 py-1 bg-[#7A1126] text-[#FFF8F0] hover:bg-[#F4A62A] hover:text-[#2B1A16] text-xs font-semibold rounded-lg transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
