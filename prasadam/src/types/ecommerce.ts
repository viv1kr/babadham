export type ProductCategory = 
  | 'prasad' 
  | 'peda' 
  | 'rudraksh' 
  | 'kada' 
  | 'gangajal' 
  | 'combos' 
  | 'kits'
  | (string & {});

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
  origin: string;
  vendor?: string;
  vendorId?: string;
  sacredIngredients?: string[];
  usageGuidelines?: string;
  status?: 'Active' | 'Draft' | 'Archived';
}

export interface Vendor {
  id: string;
  name: string;
  shopName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  shopLocation?: string;
  address?: string;
  category?: string;
  famousFor?: string;
  photos?: string[];
  status: 'Active' | 'Inactive';
  createdAt?: string;
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
  status?: 'Active' | 'Draft' | 'Archived';
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
}

export interface TimelineEvent {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  type: 'system' | 'comment';
  attachments?: string[];
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
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: 'ORDER_PLACED' | 'TEMPLE_BLESSING' | 'PACKED' | 'IN_TRANSIT' | 'DELIVERED';
  trackingSteps: TrackingStep[];
  notes?: string;
  billingAddress?: OrderAddress;
  timelineEvents?: TimelineEvent[];
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

export interface PaymentGatewayConfig {
  globalPaymentMode: 'TEST' | 'LIVE';
  
  isRazorpayActive: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  
  isPayUMoneyActive: boolean;
  payUMerchantKey: string;
  payUSalt: string;
  payUWebhookSecret: string;
  
  isCodActive: boolean;
}

export interface StateShippingTax {
  stateName: string;
  taxPercent: number;
  shippingCost: number;
}

export interface EmailWhatsappConfig {
  emailProvider: 'smtp' | 'sendgrid' | 'aws-ses';
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
  
  whatsappProvider: 'meta' | 'interakt' | 'wati' | 'twilio';
  whatsappApiKey: string;
  whatsappPhoneNumberId?: string;
  whatsappBusinessAccountId?: string;
  whatsappOtpTemplateId?: string;
  whatsappOrderConfirmationTemplateId?: string;
  whatsappShippingUpdateTemplateId?: string;
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
  manufacturingDetailsPolicy?: string;
  shippingPolicy?: string;
  paymentGateways?: PaymentGatewayConfig;
  stateShippingRates?: StateShippingTax[];
  emailWhatsappConfig?: EmailWhatsappConfig;
}

export interface AdminUserProfile {
  name: string;
  designation: string;
  photoUrl: string;
  adminId: string;
  passwordHash: string;
}

export interface LoginLog {
  id: string;
  timestamp: string;
  adminId: string;
  ipAddress: string;
  device: string;
  location: string;
  status: 'SUCCESS' | 'FAILED';
}
