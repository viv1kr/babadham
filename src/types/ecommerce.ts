export type ProductCategory = string;

export interface HeroBannerItem {
  id: string;
  title?: string;
  mediaType: 'image' | 'video';
  desktopUrl: string;
  mobileUrl?: string;
  displayOrder: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  badge?: string;
  shortDesc: string;
  fullDesc: string;
  templeBlessing: string;
  weight: string;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  purityGrade: string;
  origin: string; // e.g. "Direct Baba Baidyanath Temple Complex, Deoghar"
  sacredIngredients?: string[];
  usageGuidelines?: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  hindiName: string;
  slug: string;
  iconName: string;
  itemCount: number;
  image: string;
  tagline: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string | null;
  productsCount: number;
  conditions: string;
  salesChannels: number;
  themeTemplate: string;
  productIds: string[];
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend: number;
  maxDiscount: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export interface TrackingStep {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
  iconName: string;
}

export interface Order {
  id: string;
  createdAt: string;
  address: OrderAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'CARD' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  orderStatus: 'ORDER_PLACED' | 'TEMPLE_BLESSING' | 'PACKED' | 'IN_TRANSIT' | 'DELIVERED';
  trackingSteps: TrackingStep[];
}

export interface DevoteeReview {
  id: string;
  devoteeName: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  blessingTag: string;
}

export interface DBTableInfo {
  tableName: string;
  rowCount: number;
  columns: string[];
  sampleData: Record<string, any>[];
}

export interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  mobileMediaUrl?: string;
  enableGradient?: boolean;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}
