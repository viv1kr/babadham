import type { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, Eye, ShoppingBag, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    openPreBooking,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    setDetailProduct,
    addRecentlyViewed
  } = useStore();
  const wishlisted = isWishlisted(product.id);

  const handleCardClick = () => {
    addRecentlyViewed(product);
    setDetailProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-3xl bg-[#FFF8F0] border border-[#F4A62A]/30 hover:border-[#F4A62A] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1A16]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="px-3 py-1 rounded-full bg-[#7A1126] text-[#F4A62A] text-[10px] font-extrabold tracking-widest uppercase shadow-md border border-[#F4A62A]/30">
              {product.badge}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#7A1126]/80 text-[#FFF8F0] text-[10px] font-bold uppercase backdrop-blur-md">
              {product.categoryName}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all shadow-md ${wishlisted
                ? 'bg-[#7A1126] text-[#F4A62A]'
                : 'bg-[#FFF8F0]/80 text-[#7A1126] hover:bg-[#7A1126] hover:text-[#FFF8F0]'
              }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button
            onClick={e => {
              e.stopPropagation();
              addRecentlyViewed(product);
              setQuickViewProduct(product);
            }}
            className="pointer-events-auto px-4 py-2.5 rounded-2xl bg-[#FFF8F0] text-[#7A1126] hover:bg-[#7A1126] hover:text-[#FFF8F0] text-xs font-bold shadow-xl transition-all flex items-center gap-1.5 border border-[#F4A62A]"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Discount Badge bottom right */}
        {product.discountPercentage > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-[#F4A62A] text-[#2B1A16] font-extrabold text-[10px]">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center text-[#F4A62A]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-bold text-[#2B1A16]">{product.rating}</span>
            </div>
            <span className="text-[#2B1A16]/50">({product.reviewCount} reviews)</span>
          </div>

          {/* Title */}
          <h3 className="font-serif-temple font-bold text-lg text-[#7A1126] group-hover:text-[#D98C1F] transition-colors leading-snug mt-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#D98C1F] font-semibold">{product.hindiName}</p>

          <p className="text-xs text-[#2B1A16]/70 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Add to Cart / Pre-Book Footer */}
        <div className="pt-3 border-t border-[#7A1126]/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-[#2B1A16]/50">{product.weight}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#7A1126]">₹{product.price}</span>
              <span className="text-xs line-through text-[#2B1A16]/40">₹{product.originalPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={e => {
                e.stopPropagation();
                openPreBooking(product);
              }}
              className="px-2.5 py-2.5 min-h-[44px] rounded-lg bg-gradient-to-r from-[#F4A62A] to-[#D98C1F] text-[#2B1A16] hover:bg-white text-xs font-black transition-all shadow-md flex items-center gap-1 border border-amber-300"
              title="Instant VIP Pre-Booking"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-[#7A1126]" />
              <span>Pre-Book</span>
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="px-3 py-2.5 min-h-[44px] rounded-lg bg-[#7A1126] text-[#FFF8F0] hover:bg-[#500A18] text-xs font-bold transition-all shadow-md flex items-center gap-1"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
