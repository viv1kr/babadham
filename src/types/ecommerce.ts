export type ProductCategory = string;

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

export interface CustomDetail {
  id: string;
  label: string;
  value: string;
}

export interface PrasadiRequestItem {
  id: string;
  devoteeName: string;
  location: string;
  prasadItem: string;
  timeAgo: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  topBarSacredText: string;
  helplineNumber: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  supportEmail?: string;
  address?: string;
  cataloguePdfUrl?: string;
  fssaiLicenseNumber?: string;
  needHelpText: string;
  logoIcon: string;
  logoImageUrl?: string;
  faviconUrl?: string;
  headerBgImageUrl?: string;
  mobileHeaderBgImageUrl?: string;
  enableTicker?: boolean;
  tickerSpeedSeconds?: number;
  todayTotalBookingsCount?: string;
  tickerAnnouncementText?: string;
  livePrasadiRequests?: PrasadiRequestItem[];
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  heroSlides?: HeroSlide[];
  customDetails?: CustomDetail[];
  headerScripts?: string;
  bodyScripts?: string;
  footerScripts?: string;
  refundPolicy?: string;
  privacyPolicy?: string;
  termsConditionPolicy?: string;
  shippingPolicy?: string;
  orderRequestTrustBadges?: OrderRequestTrustBadge[];
  orderRequestMediaConfig?: OrderRequestMediaConfig;
  orderRequestHeroSlides?: HeroSlide[];
}

export interface OrderRequestTrustBadge {
  id: string;
  iconName: string;
  title: string;
  subtitle: string;
}

export interface OrderRequestMediaConfig {
  videoUrl?: string;
  videoTitle?: string;
  videoSubtitle?: string;
  bannerBgImageUrl?: string;
  bellAudioUrl?: string;
}

