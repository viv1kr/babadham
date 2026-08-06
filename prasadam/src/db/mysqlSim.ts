import type { Product, CategoryInfo, Collection, Order, Coupon, UpsellCondition, DevoteeReview, DBTableInfo, AdminUserProfile, LoginLog, Vendor } from '../types/ecommerce';
import { PRODUCTS_DATA, CATEGORIES_DATA, COUPONS_DATA, DEVOTEE_REVIEWS, VENDORS_DATA } from './seedData';

const STORAGE_KEY = 'babadham_mysql_db_v1';

interface DBStore {
  products: Product[];
  categories: CategoryInfo[];
  collections?: Collection[];
  orders: Order[];
  coupons: Coupon[];
  upsellConditions?: UpsellCondition[];
  vendors?: Vendor[];
  reviews: DevoteeReview[];
  brandSettings: any;
  adminProfile?: AdminUserProfile;
  loginLogs?: LoginLog[];
}

export const DEFAULT_COLLECTIONS_DATA: Collection[] = [
  { id: '1', title: 'Home page', description: 'Featured collections for main home page storefront', image: null, productsCount: 0, conditions: 'Manual', salesChannels: 2, themeTemplate: 'Default collection', productIds: [], slug: 'home-page' },
  { id: '2', title: 'Baba Baidyanath Prasad', description: 'Direct sanctum offered Bhog Prasad items', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80', productsCount: 12, conditions: 'Automated (Category = Prasad)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['1', '2'], slug: 'baba-baidyanath-prasad' },
  { id: '3', title: 'Sultanganj Gangajal', description: 'Sacred Uttarwahini Ganga Jal kalash', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', productsCount: 5, conditions: 'Automated (Category = Gangajal)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['3'], slug: 'sultanganj-gangajal' },
  { id: '4', title: 'Deoghar Kesar Peda', description: 'Pure Cow Milk Peda Prasad from Deoghar', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80', productsCount: 8, conditions: 'Manual', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['1'], slug: 'deoghar-kesar-peda' },
  { id: '5', title: 'Rudraksha Essentials', description: 'Authentic Nepal & Haridwar Rudraksha Mala & Kada', image: null, productsCount: 15, conditions: 'Automated (Tag = Sacred)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['4'], slug: 'rudraksha-essentials' }
];

class MySQLSim {
  private store: DBStore;

  constructor() {
    this.store = this.loadFromStorage();
    this.syncWithServer();
  }

  private async syncWithServer() {
    try {
      let res = await fetch('/api/db');
      if (!res.ok) {
        res = await fetch('/babadham/api/index.php');
      }
      if (res.ok) {
        const data = await res.json();
        if (data && !data.empty && data.products) {
          this.store = data;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          if (data.brandSettings) {
            localStorage.setItem('babadham_brand_settings', JSON.stringify(data.brandSettings));
          }
          window.dispatchEvent(new Event('bbp_db_updated'));
        }
      }
    } catch (e) {}
  }

  private loadFromStorage(): DBStore {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let userCols: Collection[] | undefined = undefined;
      try {
        const cStr = localStorage.getItem('babadham_user_collections');
        if (cStr) userCols = JSON.parse(cStr);
      } catch {}

      if (saved) {
        const store: DBStore = JSON.parse(saved);
        if (userCols && Array.isArray(userCols)) {
          store.collections = userCols;
        } else if (!store.collections || !Array.isArray(store.collections)) {
          store.collections = [...DEFAULT_COLLECTIONS_DATA];
        }
        return store;
      }
    } catch (e) {
      console.warn('Failed to load DB state, resetting to seed', e);
    }
    return {
      products: [...PRODUCTS_DATA],
      categories: [...CATEGORIES_DATA],
      collections: [...DEFAULT_COLLECTIONS_DATA],
      orders: [
        {
          id: 'BBP-ORD-882194',
          createdAt: new Date().toISOString(),
          address: {
            fullName: 'Rajesh Sharma',
            phone: '+91 98765 12345',
            email: 'rajesh.sharma@example.com',
            addressLine: 'Flat 402, Shivam Apartments, Sector 12',
            landmark: 'Near Mahadev Temple',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110075'
          },
          items: [
            {
              product: PRODUCTS_DATA[0],
              quantity: 2
            },
            {
              product: PRODUCTS_DATA[1],
              quantity: 1
            }
          ],
          subtotal: 1601,
          discount: 100,
          shipping: 0,
          totalAmount: 1501,
          paymentMethod: 'UPI',
          paymentStatus: 'PAID',
          orderStatus: 'TEMPLE_BLESSING',
          trackingSteps: [
            {
              title: 'Order Received at Deoghar Dham',
              location: 'Deoghar Command Center',
              timestamp: '10:00 AM',
              completed: true,
              active: false,
              iconName: 'CheckCircle2'
            },
            {
              title: 'Bhog & Touch Blessing at Garbhagriha',
              location: 'Baba Baidyanath Temple Shinghasan',
              timestamp: '11:30 AM',
              completed: true,
              active: true,
              iconName: 'Sparkles'
            }
          ]
        }
      ],
      coupons: [...COUPONS_DATA],
      upsellConditions: [
        {
          id: 'UP-1',
          type: 'CART_TOTAL',
          targetValue: 1000,
          discountType: 'PERCENTAGE',
          discountValue: 10,
          description: 'Get 10% off when you spend more than ₹1000',
          isActive: true
        }
      ],
      vendors: [...VENDORS_DATA],
      reviews: [...DEVOTEE_REVIEWS],
      brandSettings: {
        brandName: 'BABA BAIDYANATH PRASADAM',
        tagline: 'aastha | seva | samarpan',
        topBarSacredText: 'ॐ हर हर महादेव ॐ',
        helplineNumber: '+91 98765 43210',
        whatsappNumber: '+91 98765 43211',
        supportEmail: 'support@babadham.org',
        address: 'Baidyanath Temple Complex, Main Gate Road, Deoghar, Jharkhand - 814112',
        cataloguePdfUrl: 'https://babadham.org/catalogue.pdf',
        fssaiLicenseNumber: '11124999000123',
        needHelpText: 'Need Help?',
        logoIcon: 'ॐ',
        logoImageUrl: '/assets/logo.svg',
        faviconUrl: '',
        feature1: '100% Authentic',
        feature2: 'Temple Blessed',
        feature3: 'Secure Packaging',
        feature4: 'Pan India Delivery',
        customDetails: [
          { id: '1', label: 'GSTIN Registration', value: '20AAAAA0000A1Z5' },
          { id: '2', label: 'Temple Board Reg No', value: 'DEO-TEMPLE-2024-88' }
        ]
      }
    };
  }

  private saveToStorage() {
    try {
      const dataStr = JSON.stringify(this.store);
      
      try {
        localStorage.setItem(STORAGE_KEY, dataStr);
      } catch (storageErr) {
        console.warn('localStorage quota limit reached. Data persisted in-memory & server DB.', storageErr);
      }

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bbp_db_updated'));
      try {
        const channel = new BroadcastChannel('bbp_db_sync');
        channel.postMessage({ type: 'DB_UPDATED' });
        channel.close();
      } catch (err) {}

      // Asynchronously post to central server DB file with CSRF & security headers
      fetch('/api/db', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'babadham_sec_token_882910',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: dataStr
      }).catch(() => {
        fetch('/babadham/api/index.php', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'babadham_sec_token_882910',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: dataStr
        }).catch(() => {});
      });

    } catch (e) {
      console.warn('Failed to persist DB state', e);
    }
  }

  public clearAllProducts(): boolean {
    this.store.products = [];
    this.saveToStorage();
    return true;
  }

  public getProducts(): Product[] {
    this.store = this.loadFromStorage();
    return this.store.products;
  }

  public getProductById(id: string): Product | undefined {
    this.store = this.loadFromStorage();
    return this.store.products.find(p => p.id === id);
  }

  public getCategories(): CategoryInfo[] {
    this.store = this.loadFromStorage();
    return this.store.categories || [];
  }

  public addCategory(catData: Partial<CategoryInfo> & { name: string }): CategoryInfo[] {
    const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: CategoryInfo = {
      id: slug as any,
      name: catData.name,
      hindiName: catData.hindiName || catData.name,
      slug: slug,
      iconName: catData.iconName || 'Package',
      itemCount: 0,
      image: catData.image || '',
      tagline: catData.tagline || `${catData.name} from Baidyanath Temple`
    };

    if (!this.store.categories) this.store.categories = [];
    const idx = this.store.categories.findIndex(c => c.id === newCat.id || c.slug === slug);
    if (idx >= 0) {
      this.store.categories[idx] = { ...this.store.categories[idx], ...newCat };
    } else {
      this.store.categories.push(newCat);
    }
    this.saveToStorage();
    return this.store.categories;
  }

  public deleteCategory(id: string): CategoryInfo[] {
    if (!this.store.categories) return [];
    this.store.categories = this.store.categories.filter(c => c.id !== id && c.slug !== id);
    this.saveToStorage();
    return this.store.categories;
  }

  public getVendors(): Vendor[] {
    this.store = this.loadFromStorage();
    if (!this.store.vendors || this.store.vendors.length === 0) {
      this.store.vendors = [...VENDORS_DATA];
      this.saveToStorage();
    }
    return this.store.vendors;
  }

  public addVendor(vendorData: Omit<Vendor, 'id'> & { id?: string }): Vendor[] {
    const newVendor: Vendor = {
      id: vendorData.id || `vnd-${Date.now()}`,
      name: vendorData.name,
      shopName: vendorData.shopName || '',
      contactPerson: vendorData.contactPerson || '',
      phone: vendorData.phone || '',
      email: vendorData.email || '',
      shopLocation: vendorData.shopLocation || '',
      address: vendorData.address || '',
      category: vendorData.category || 'General Supplier',
      famousFor: vendorData.famousFor || '',
      photos: vendorData.photos || [],
      status: vendorData.status || 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!this.store.vendors) this.store.vendors = [...VENDORS_DATA];
    this.store.vendors.unshift(newVendor);
    this.saveToStorage();
    return this.store.vendors;
  }

  public updateVendor(id: string, updates: Partial<Vendor>): Vendor[] {
    if (!this.store.vendors) return [];
    const idx = this.store.vendors.findIndex(v => v.id === id);
    if (idx >= 0) {
      this.store.vendors[idx] = { ...this.store.vendors[idx], ...updates };
      this.saveToStorage();
    }
    return this.store.vendors;
  }

  public deleteVendor(id: string): Vendor[] {
    if (!this.store.vendors) return [];
    this.store.vendors = this.store.vendors.filter(v => v.id !== id);
    this.saveToStorage();
    return this.store.vendors;
  }

  public getCoupons(): Coupon[] {
    this.store = this.loadFromStorage();
    return this.store.coupons;
  }

  public addCoupon(coupon: Coupon): Coupon[] {
    if (!this.store.coupons) this.store.coupons = [];
    this.store.coupons.push(coupon);
    this.saveToStorage();
    return this.store.coupons;
  }

  public updateCoupon(code: string, updates: Partial<Coupon>): Coupon[] {
    if (!this.store.coupons) return [];
    const idx = this.store.coupons.findIndex(c => c.code === code);
    if (idx >= 0) {
      this.store.coupons[idx] = { ...this.store.coupons[idx], ...updates };
      this.saveToStorage();
    }
    return this.store.coupons;
  }

  public deleteCoupon(code: string): Coupon[] {
    if (!this.store.coupons) return [];
    this.store.coupons = this.store.coupons.filter(c => c.code !== code);
    this.saveToStorage();
    return this.store.coupons;
  }

  public getUpsells(): UpsellCondition[] {
    this.store = this.loadFromStorage();
    return this.store.upsellConditions || [];
  }

  public addUpsell(upsell: Omit<UpsellCondition, 'id'>): UpsellCondition[] {
    const newUpsell = {
      ...upsell,
      id: `UP-${Math.floor(Math.random() * 10000)}`
    };
    if (!this.store.upsellConditions) this.store.upsellConditions = [];
    this.store.upsellConditions.unshift(newUpsell);
    this.saveToStorage();
    return this.store.upsellConditions;
  }

  public updateUpsell(id: string, updates: Partial<UpsellCondition>): UpsellCondition[] {
    if (!this.store.upsellConditions) return [];
    const idx = this.store.upsellConditions.findIndex(u => u.id === id);
    if (idx >= 0) {
      this.store.upsellConditions[idx] = { ...this.store.upsellConditions[idx], ...updates };
      this.saveToStorage();
    }
    return this.store.upsellConditions;
  }

  public deleteUpsell(id: string): UpsellCondition[] {
    if (!this.store.upsellConditions) return [];
    this.store.upsellConditions = this.store.upsellConditions.filter(u => u.id !== id);
    this.saveToStorage();
    return this.store.upsellConditions;
  }

  public getReviews(): DevoteeReview[] {
    this.store = this.loadFromStorage();
    return this.store.reviews;
  }

  public getBrandSettings(): any {
    this.store = this.loadFromStorage();
    const settings = this.store.brandSettings || {};
    
    let savedBrand = {};
    let savedLogo = '';
    let savedFavicon = '';
    try {
      const bStr = localStorage.getItem('babadham_brand_settings');
      if (bStr) savedBrand = JSON.parse(bStr);
      savedLogo = localStorage.getItem('babadham_logo_image') || '';
      savedFavicon = localStorage.getItem('babadham_favicon_image') || '';
    } catch {}

    const defaultStates = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
      'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 
      'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];

    const defaultShippingRates = defaultStates.map(state => ({
      stateName: state,
      taxPercent: 0,
      shippingCost: 49
    }));

    const logo = savedLogo || settings.logoImageUrl || (savedBrand as any).logoImageUrl || '/assets/logo.png';
    const favicon = savedFavicon || settings.faviconUrl || (savedBrand as any).faviconUrl || '/assets/favicon.png';

    const defaultSettings = {
      brandName: 'BABA BAIDYANATH PRASADAM',
      tagline: 'aastha | seva | samarpan',
      topBarSacredText: 'ॐ हर हर महादेव ॐ',
      helplineNumber: '+91 98765 43210',
      whatsappNumber: '+91 98765 43211',
      supportEmail: 'support@babadham.org',
      address: 'Baidyanath Temple Complex, Main Gate Road, Deoghar, Jharkhand - 814112',
      cataloguePdfUrl: 'https://babadham.org/catalogue.pdf',
      fssaiLicenseNumber: '11124999000123',
      needHelpText: 'Need Help?',
      logoIcon: 'ॐ',
      logoImageUrl: logo,
      faviconUrl: favicon,
      paymentGateways: {
        globalPaymentMode: 'TEST',
        isRazorpayActive: false,
        razorpayKeyId: '',
        razorpayKeySecret: '',
        razorpayWebhookSecret: '',
        isPayUMoneyActive: false,
        payUMerchantKey: '',
        payUSalt: '',
        payUWebhookSecret: '',
        isCodActive: true
      },
      emailWhatsappConfig: {
        emailProvider: 'smtp' as const,
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUser: 'support@babadham.org',
        smtpPass: '',
        fromEmail: 'support@babadham.org',
        fromName: 'Babadham Prasad',
        whatsappProvider: 'meta' as const,
        whatsappApiKey: '',
        whatsappPhoneNumberId: '',
        whatsappBusinessAccountId: '',
        whatsappOtpTemplateId: 'user_registration_otp',
        whatsappOrderConfirmationTemplateId: 'order_confirmation',
        whatsappShippingUpdateTemplateId: 'order_shipping_update'
      },
      stateShippingRates: defaultShippingRates
    };

    const merged = {
      ...defaultSettings,
      ...settings,
      ...savedBrand,
      logoImageUrl: logo,
      faviconUrl: favicon,
      stateShippingRates: (settings.stateShippingRates && settings.stateShippingRates.length > 0)
        ? settings.stateShippingRates
        : defaultShippingRates
    };

    if (settings && Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0) {
      merged.heroSlides = settings.heroSlides;
    } else if (savedBrand && Array.isArray(savedBrand.heroSlides) && savedBrand.heroSlides.length > 0) {
      merged.heroSlides = savedBrand.heroSlides;
    }

    if (settings && Array.isArray(settings.orderRequestHeroSlides) && settings.orderRequestHeroSlides.length > 0) {
      merged.orderRequestHeroSlides = settings.orderRequestHeroSlides;
    } else if (savedBrand && Array.isArray(savedBrand.orderRequestHeroSlides) && savedBrand.orderRequestHeroSlides.length > 0) {
      merged.orderRequestHeroSlides = savedBrand.orderRequestHeroSlides;
    }

    return merged;
  }

  public updateBrandSettings(newSettings: any) {
    this.store = this.loadFromStorage();
    const current = this.getBrandSettings();
    const updated = { ...current, ...newSettings };
    this.store.brandSettings = updated;
    
    try {
      localStorage.setItem('babadham_brand_settings', JSON.stringify(updated));
      if (updated.logoImageUrl) {
        localStorage.setItem('babadham_logo_image', updated.logoImageUrl);
      }
      if (updated.faviconUrl) {
        localStorage.setItem('babadham_favicon_image', updated.faviconUrl);
      }
    } catch (e) {
      console.warn('Failed to save dedicated branding keys', e);
    }

    this.saveToStorage();
    return updated;
  }

  public saveBrandSettings(newSettings: any) {
    return this.updateBrandSettings(newSettings);
  }

  public getOrders(): Order[] {
    this.store = this.loadFromStorage();
    return this.store.orders;
  }

  public addOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    if (!this.store.orders) this.store.orders = [];
    this.store.orders.unshift(newOrder);
    this.saveToStorage();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      this.saveToStorage();
    }
    return order;
  }

  public updateOrderPaymentStatus(orderId: string, status: Order['paymentStatus']): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      order.paymentStatus = status;
      this.saveToStorage();
    }
    return order;
  }

  public updateOrderNotes(orderId: string, notes: string): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      order.notes = notes;
      this.saveToStorage();
    }
    return order;
  }

  public updateOrderAddress(orderId: string, addressType: 'shipping' | 'billing', address: Partial<OrderAddress>): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      if (addressType === 'shipping') {
        order.address = { ...order.address, ...address };
      } else {
        order.billingAddress = { ...(order.billingAddress || order.address), ...address };
      }
      this.saveToStorage();
    }
    return order;
  }

  public updateOrderTracking(orderId: string, courierName: string, trackingNumber: string, trackingUrl: string): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      order.courierName = courierName;
      order.trackingNumber = trackingNumber;
      order.trackingUrl = trackingUrl;
      this.saveToStorage();
    }
    return order;
  }

  public addTimelineEvent(orderId: string, event: Omit<TimelineEvent, 'id' | 'createdAt'>): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      if (!order.timelineEvents) order.timelineEvents = [];
      const newEvent: TimelineEvent = {
        ...event,
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date().toISOString()
      };
      order.timelineEvents.unshift(newEvent);
      this.saveToStorage();
    }
    return order;
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: `bbp-${Math.floor(100 + Math.random() * 900)}`
    };
    this.store.products.unshift(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.store.products.findIndex(p => p.id === id);
    if (idx > -1) {
      this.store.products[idx] = { ...this.store.products[idx], ...updates };
      this.saveToStorage();
      return this.store.products[idx];
    }
    return undefined;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.store.products.length;
    this.store.products = this.store.products.filter(p => p.id !== id);
    this.saveToStorage();
    return this.store.products.length < initialLen;
  }

  public executeSQL(query: string): { columns: string[]; rows: any[]; affectedRows?: number; message?: string } {
    const q = query.trim().toUpperCase();

    if (q.startsWith('SELECT') && q.includes('FROM PRODUCTS')) {
      return {
        columns: ['id', 'name', 'category', 'price', 'originalPrice', 'rating', 'inStock'],
        rows: this.store.products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: `₹${p.price}`,
          originalPrice: `₹${p.originalPrice}`,
          rating: p.rating,
          inStock: p.inStock ? 'YES' : 'NO'
        }))
      };
    }

    if (q.startsWith('SELECT') && q.includes('FROM ORDERS')) {
      return {
        columns: ['id', 'createdAt', 'fullName', 'phone', 'totalAmount', 'paymentMethod', 'orderStatus'],
        rows: this.store.orders.map(o => ({
          id: o.id,
          createdAt: new Date(o.createdAt).toLocaleDateString(),
          fullName: o.address.fullName,
          phone: o.address.phone,
          totalAmount: `₹${o.totalAmount}`,
          paymentMethod: o.paymentMethod,
          orderStatus: o.orderStatus
        }))
      };
    }

    return {
      columns: ['status', 'message'],
      rows: [{ status: 'OK', message: `Query executed successfully on MySQL simulation engine.` }],
      affectedRows: 0
    };
  }

  public getTableSchema(): DBTableInfo[] {
    return [
      {
        tableName: 'products',
        rowCount: this.store.products.length,
        columns: ['id', 'name', 'hindiName', 'category', 'price', 'originalPrice', 'rating', 'inStock'],
        sampleData: this.store.products.slice(0, 3)
      },
      {
        tableName: 'orders',
        rowCount: this.store.orders.length,
        columns: ['id', 'createdAt', 'address', 'items', 'totalAmount', 'paymentMethod', 'orderStatus'],
        sampleData: this.store.orders.slice(0, 3)
      }
    ];
  }

  public getAdminProfile(): AdminUserProfile {
    this.store = this.loadFromStorage();
    let savedProfile: Partial<AdminUserProfile> = {};
    try {
      const pStr = localStorage.getItem('babadham_admin_profile');
      if (pStr) savedProfile = JSON.parse(pStr);
    } catch {}

    const defaultProfile: AdminUserProfile = {
      name: 'Admin Sevak',
      designation: 'Super Administrator',
      photoUrl: '',
      adminId: 'admin',
      passwordHash: 'baba@admin2026'
    };

    const profile = {
      ...defaultProfile,
      ...(this.store.adminProfile || {}),
      ...savedProfile
    };

    this.store.adminProfile = profile;
    return profile;
  }

  public saveAdminProfile(profile: Partial<AdminUserProfile>): AdminUserProfile {
    this.store = this.loadFromStorage();
    const current = this.getAdminProfile();
    const updated = { ...current, ...profile };
    this.store.adminProfile = updated;
    
    try {
      localStorage.setItem('babadham_admin_profile', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save dedicated admin profile key', e);
    }

    this.saveToStorage();
    return updated;
  }

  public getLoginLogs(): LoginLog[] {
    return this.store.loginLogs || [
      {
        id: 'LOG-SEED-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        adminId: 'admin',
        ipAddress: '103.24.18.92',
        device: 'Chrome on Windows 11',
        location: 'Deoghar, Jharkhand, IN',
        status: 'SUCCESS'
      }
    ];
  }

  public addLoginLog(log: Omit<LoginLog, 'id'>): LoginLog {
    if (!this.store.loginLogs) {
      this.store.loginLogs = [
        {
          id: 'LOG-SEED-1',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          adminId: 'admin',
          ipAddress: '103.24.18.92',
          device: 'Chrome on Windows 11',
          location: 'Deoghar, Jharkhand, IN',
          status: 'SUCCESS'
        }
      ];
    }
    const newLog: LoginLog = {
      id: `LOG-${Date.now()}`,
      ...log
    };
    this.store.loginLogs.unshift(newLog);
    if (this.store.loginLogs.length > 50) {
      this.store.loginLogs = this.store.loginLogs.slice(0, 50);
    }
    this.saveToStorage();
    return newLog;
  }

  public getCollections(): Collection[] {
    this.store = this.loadFromStorage();
    let userCols: Collection[] | undefined = undefined;
    try {
      const cStr = localStorage.getItem('babadham_user_collections');
      if (cStr) userCols = JSON.parse(cStr);
    } catch {}

    if (userCols && Array.isArray(userCols)) {
      this.store.collections = userCols;
      return userCols;
    }

    if (!this.store.collections || !Array.isArray(this.store.collections)) {
      this.store.collections = [...DEFAULT_COLLECTIONS_DATA];
      this.saveToStorage();
    }
    return this.store.collections;
  }

  public saveCollection(col: Collection): Collection[] {
    const collections = this.getCollections();
    const idx = collections.findIndex(c => c.id === col.id);
    if (idx >= 0) {
      collections[idx] = col;
    } else {
      collections.unshift(col);
    }
    this.store.collections = collections;
    try {
      localStorage.setItem('babadham_user_collections', JSON.stringify(collections));
    } catch (e) {}
    this.saveToStorage();
    return this.store.collections;
  }

  public deleteCollection(id: string): Collection[] {
    const collections = this.getCollections();
    this.store.collections = collections.filter(c => c.id !== id);
    try {
      localStorage.setItem('babadham_user_collections', JSON.stringify(this.store.collections));
    } catch (e) {}
    this.saveToStorage();
    return this.store.collections;
  }

  public clearSampleCollections(): Collection[] {
    const collections = this.getCollections();
    const userCols = collections.filter(c => !['1', '2', '3', '4', '5'].includes(c.id));
    this.store.collections = userCols;
    try {
      localStorage.setItem('babadham_user_collections', JSON.stringify(userCols));
    } catch (e) {}
    this.saveToStorage();
    return this.store.collections;
  }
}

export const db = new MySQLSim();
