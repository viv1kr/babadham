import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { detailProduct, setDetailProduct, addToCart, setIsCartOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'desc' | 'cert' | 'ingredients'>('desc');
  const [activeImg, setActiveImg] = useState<string>('');

  if (!detailProduct) return null;

  const product = detailProduct;
  const mainImage = activeImg || product.image;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setDetailProduct(null);
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2B1A16]/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="relative w-full max-w-5xl bg-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A] overflow-hidden my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setDetailProduct(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#7A1126] text-[#F4A62A] hover:bg-[#D98C1F] transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10">
            
            {/* Gallery Left */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-[#F4A62A]/30">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold tracking-widest uppercase border border-[#F4A62A] shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(img)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        mainImage === img ? 'border-[#7A1126] scale-105 gold-glow-sm' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Authenticity Guarantee Card */}
              <div className="p-4 rounded-2xl bg-[#7A1126]/5 border border-[#7A1126]/15 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#7A1126]">
                  <ShieldCheck className="w-4 h-4 text-[#F4A62A]" />
                  <span>100% Deoghar Garbhagriha Certified</span>
                </div>
                <p className="text-[11px] text-[#2B1A16]/80 leading-relaxed">
                  Offered directly at Bholenath Shinghasan and dispatched in clean air-tight containers via priority air cargo.
                </p>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#F4A62A] bg-[#7A1126] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product.categoryName}
                  </span>
                  <div className="flex items-center text-xs text-[#F4A62A]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold text-[#2B1A16]">{product.rating}</span>
                    <span className="ml-1 text-[#2B1A16]/50">({product.reviewCount} Reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif-temple font-extrabold text-3xl text-[#7A1126] mt-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#D98C1F] font-bold mt-0.5">{product.hindiName}</p>

                {/* Price Display */}
                <div className="my-4 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-[#7A1126]">₹{product.price}</span>
                  <span className="text-base line-through text-[#2B1A16]/40">₹{product.originalPrice}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F4A62A] text-[#2B1A16] text-xs font-bold">
                    Save {product.discountPercentage}%
                  </span>
                </div>

                {/* Tabs Header */}
                <div className="flex border-b border-[#7A1126]/15 gap-6 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-2 transition-colors ${activeTab === 'desc' ? 'text-[#7A1126] border-b-2 border-[#7A1126]' : 'text-[#2B1A16]/50'}`}
                  >
                    Product Description
                  </button>
                  <button
                    onClick={() => setActiveTab('cert')}
                    className={`pb-2 transition-colors ${activeTab === 'cert' ? 'text-[#7A1126] border-b-2 border-[#7A1126]' : 'text-[#2B1A16]/50'}`}
                  >
                    Temple Certificate
                  </button>
                  {product.sacredIngredients && (
                    <button
                      onClick={() => setActiveTab('ingredients')}
                      className={`pb-2 transition-colors ${activeTab === 'ingredients' ? 'text-[#7A1126] border-b-2 border-[#7A1126]' : 'text-[#2B1A16]/50'}`}
                    >
                      Sacred Ingredients
                    </button>
                  )}
                </div>

                {/* Tab Body */}
                <div className="py-4 text-xs text-[#2B1A16]/80 leading-relaxed min-h-[100px]">
                  {activeTab === 'desc' && (
                    <div className="space-y-2">
                      <p>{product.fullDesc}</p>
                      <div className="flex items-center gap-2 text-[#7A1126] font-semibold pt-2">
                        <MapPin className="w-4 h-4 text-[#F4A62A]" />
                        <span>Origin: {product.origin}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'cert' && (
                    <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#F4A62A] space-y-2">
                      <div className="font-serif-temple font-bold text-sm text-[#7A1126] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F4A62A]" /> Sanctum Sanctorum Blessing Details
                      </div>
                      <p className="italic">"{product.templeBlessing}"</p>
                      <div className="text-[10px] text-[#2B1A16]/60 pt-1">
                        Purity Grade: <span className="font-bold text-[#7A1126]">{product.purityGrade}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ingredients' && product.sacredIngredients && (
                    <ul className="grid grid-cols-2 gap-2">
                      {product.sacredIngredients.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-medium text-[#7A1126]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F4A62A]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Sticky CTAs */}
              <div className="space-y-3 pt-4 border-t border-[#7A1126]/15">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="py-4 rounded-2xl bg-[#7A1126]/10 text-[#7A1126] hover:bg-[#7A1126]/20 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Sacred Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="py-4 rounded-2xl bg-[#7A1126] text-[#FFF8F0] hover:bg-[#D98C1F] hover:text-[#2B1A16] font-bold text-xs sm:text-sm transition-all shadow-xl gold-glow flex items-center justify-center gap-2"
                  >
                    <span>Instant Express Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
