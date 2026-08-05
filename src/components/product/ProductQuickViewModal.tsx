import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShieldCheck, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCartOpen, setDetailProduct } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleBuyNow = () => {
    addToCart(product, qty);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2B1A16]/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A]/40 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#7A1126] text-[#F4A62A] hover:bg-[#D98C1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Gallery */}
          <div className="md:w-1/2 p-6 bg-gray-100 flex flex-col justify-between">
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden shadow-inner">
              <img
                src={product.gallery[activeImgIdx] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold tracking-widest uppercase border border-[#F4A62A]">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.gallery.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImgIdx === i ? 'border-[#7A1126] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#F4A62A]">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-bold text-[#2B1A16]">{product.rating}</span>
                </div>
                <span className="text-[#2B1A16]/50">({product.reviewCount} reviews)</span>
              </div>

              <h2 className="font-serif-temple font-extrabold text-2xl text-[#7A1126] mt-1 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#D98C1F] font-bold">{product.hindiName}</p>

              <div className="my-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#7A1126]">₹{product.price}</span>
                <span className="text-sm line-through text-[#2B1A16]/40">₹{product.originalPrice}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#F4A62A] text-[#2B1A16] text-xs font-bold">
                  {product.discountPercentage}% OFF
                </span>
              </div>

              <p className="text-xs text-[#2B1A16]/80 leading-relaxed">
                {product.shortDesc}
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-[#7A1126]/5 border border-[#7A1126]/10 space-y-1">
                <div className="text-[11px] font-bold text-[#7A1126] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F4A62A]" /> Temple Sanctum Blessing
                </div>
                <p className="text-[11px] text-[#2B1A16]/80 italic leading-snug">
                  "{product.templeBlessing}"
                </p>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#7A1126]/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2B1A16]">Quantity:</span>
                <div className="flex items-center border border-[#7A1126]/30 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 text-[#7A1126] hover:bg-[#7A1126]/10"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-bold text-sm text-[#7A1126]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-2 text-[#7A1126] hover:bg-[#7A1126]/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, qty);
                    setQuickViewProduct(null);
                  }}
                  className="py-3 rounded-2xl bg-[#7A1126]/10 text-[#7A1126] hover:bg-[#7A1126]/20 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 rounded-2xl bg-[#7A1126] text-[#FFF8F0] hover:bg-[#D98C1F] hover:text-[#2B1A16] font-bold text-xs transition-all shadow-md gold-glow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setDetailProduct(product);
                  setQuickViewProduct(null);
                }}
                className="w-full text-center text-xs font-bold text-[#D98C1F] underline hover:text-[#7A1126]"
              >
                View Full Authenticity Certificate & Reviews →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
