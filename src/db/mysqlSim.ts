import type { Product, CategoryInfo, Collection, Order, Coupon, DevoteeReview, DBTableInfo, HeroBannerItem } from '../types/ecommerce';
import { PRODUCTS_DATA, CATEGORIES_DATA, COUPONS_DATA, DEVOTEE_REVIEWS } from './seedData';

const STORAGE_KEY = 'babadham_mysql_db_v1';

export const DEFAULT_COLLECTIONS_DATA: Collection[] = [
  { id: '1', title: 'Baba Baidyanath Prasad', description: 'Direct sanctum offered Bhog Prasad items from Baba Dham Garbhagriha', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80', productsCount: 12, conditions: 'Automated (Category = Prasad)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['1', '2'], slug: 'baba-baidyanath-prasad' },
  { id: '2', title: 'Deoghar Kesar Peda', description: 'Pure Cow Milk Peda Prasad prepared in holy ghee & kesar', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80', productsCount: 8, conditions: 'Manual', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['1'], slug: 'deoghar-kesar-peda' },
  { id: '3', title: 'Sultanganj Gangajal', description: 'Sacred Uttarwahini Ganga Jal directly from holy Sultanganj Ghat', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', productsCount: 5, conditions: 'Automated (Category = Gangajal)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['3'], slug: 'sultanganj-gangajal' },
  { id: '4', title: 'Rudraksha Essentials', description: 'Authentic lab-certified Nepal 5-Mukhi & Sidh Rudraksha Malas', image: 'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?auto=format&fit=crop&w=800&q=80', productsCount: 15, conditions: 'Automated (Tag = Sacred)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['4'], slug: 'rudraksha-essentials' },
  { id: '5', title: 'Panchdhatu Shiv Kada', description: 'Sacred Kada embossed with Trishul & Mahamrityunjaya Mantra', image: 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=800&q=80', productsCount: 6, conditions: 'Manual', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['5'], slug: 'panchdhatu-shiv-kada' },
  { id: '6', title: 'Mahadev Combo Kits', description: 'Grand devotional luxury boxes for family & festival offerings', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', productsCount: 4, conditions: 'Automated (Category = Combos)', salesChannels: 2, themeTemplate: 'Default collection', productIds: ['6'], slug: 'mahadev-combo-kits' }
];

interface DBStore {
  products: Product[];
  categories: CategoryInfo[];
  collections?: Collection[];
  orders: Order[];
  coupons: Coupon[];
  reviews: DevoteeReview[];
  heroBanners?: HeroBannerItem[];
  brandSettings: any;
}

class MySQLSim {
  private store: DBStore;

  constructor() {
    this.store = this.loadFromStorage();
    this.syncWithServer();
    // Periodically poll server DB every 2 seconds for real-time instant cross-tab / cross-port updates
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.syncWithServer();
      }, 2000);
    }
  }

  private async syncWithServer() {
    try {
      let res = await fetch('/api/db');
      if (!res.ok) {
        res = await fetch('/babadham/api/index.php');
      }
      if (res.ok) {
        const data = await res.json();
        if (data && !data.empty) {
          this.store = { ...this.store, ...data };
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store)); } catch(e) {}
          if (data.brandSettings) {
            try { localStorage.setItem('babadham_brand_settings', JSON.stringify(data.brandSettings)); } catch(e) {}
            // Persist logo/favicon to dedicated keys so they're found by getBrandSettings()
            if (data.brandSettings.logoImageUrl) {
              try { localStorage.setItem('babadham_logo_image', data.brandSettings.logoImageUrl); } catch(e) {}
            }
            if (data.brandSettings.faviconUrl) {
              try { localStorage.setItem('babadham_favicon_image', data.brandSettings.faviconUrl); } catch(e) {}
            }
            if (data.brandSettings.bookingSlotsConfig) {
              try { localStorage.setItem('babadham_booking_slots_config', JSON.stringify(data.brandSettings.bookingSlotsConfig)); } catch(e) {}
            }

            if (Array.isArray(data.heroBanners)) {
              this.store.heroBanners = data.heroBanners;
              try { localStorage.setItem('babadham_hero_banners', JSON.stringify(data.heroBanners)); } catch(e) {}
            } else if (data.brandSettings && Array.isArray(data.brandSettings.heroBanners)) {
              this.store.heroBanners = data.brandSettings.heroBanners;
              try { localStorage.setItem('babadham_hero_banners', JSON.stringify(data.brandSettings.heroBanners)); } catch(e) {}
            }

            // Sync prebooking hero banners from server
            if (Array.isArray((data as any).prebookingHeroBanners)) {
              (this.store as any).prebookingHeroBanners = (data as any).prebookingHeroBanners;
              try { localStorage.setItem('babadham_prebooking_hero_banners', JSON.stringify((data as any).prebookingHeroBanners)); } catch(e) {}
            } else if (data.brandSettings && Array.isArray(data.brandSettings.prebookingHeroBanners)) {
              (this.store as any).prebookingHeroBanners = data.brandSettings.prebookingHeroBanners;
              try { localStorage.setItem('babadham_prebooking_hero_banners', JSON.stringify(data.brandSettings.prebookingHeroBanners)); } catch(e) {}
            }
          }
          // Also save logo/favicon from top-level data if present
          if (data.logoImageUrl) {
            try { localStorage.setItem('babadham_logo_image', data.logoImageUrl); } catch(e) {}
          }
          window.dispatchEvent(new Event('bbp_db_updated'));
        }
      }
    } catch (e) {}
  }

  private async persistSlidesToIDB(key: string, slides: any[]) {
    try {
      const { setPersistentMedia } = await import('../utils/mediaDB');
      await setPersistentMedia(key, slides);
    } catch (e) {}
  }

  private loadFromStorage(): DBStore {
    const defaultState = {
      products: [...PRODUCTS_DATA],
      categories: [...CATEGORIES_DATA],
      orders: [],
      coupons: [...COUPONS_DATA],
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
        logoIcon: '🔱',
        logoImageUrl: '',
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

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let userCols: Collection[] | undefined = undefined;
      try {
        const cStr = localStorage.getItem('babadham_user_collections');
        if (cStr) userCols = JSON.parse(cStr);
      } catch {}

      if (saved) {
        const parsed = JSON.parse(saved);
        const store: DBStore = {
          products: parsed.products || defaultState.products,
          categories: parsed.categories || defaultState.categories,
          collections: parsed.collections || defaultState.collections || [...DEFAULT_COLLECTIONS_DATA],
          orders: parsed.orders || defaultState.orders,
          coupons: parsed.coupons || defaultState.coupons,
          reviews: parsed.reviews || defaultState.reviews,
          brandSettings: parsed.brandSettings || defaultState.brandSettings,
          heroBanners: parsed.heroBanners
        };
        if (userCols && Array.isArray(userCols)) {
          store.collections = userCols;
        }
        // Always load heroBanners from its dedicated key to survive quota truncation
        try {
          const hStr = localStorage.getItem('babadham_hero_banners');
          if (hStr) {
            const hParsed = JSON.parse(hStr);
            if (Array.isArray(hParsed)) store.heroBanners = hParsed;
          }
        } catch {}
        return store;
      }
    } catch (e) {
      console.warn('Failed to load DB state, resetting to seed', e);
    }
    return {
      ...defaultState,
      collections: [...DEFAULT_COLLECTIONS_DATA]
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
    return this.store.categories;
  }

  public addCategory(category: CategoryInfo): void {
    this.store = this.loadFromStorage();
    this.store.categories.push(category);
    this.saveToStorage();
  }

  public updateCategory(id: string, updates: Partial<CategoryInfo>): void {
    this.store = this.loadFromStorage();
    const idx = this.store.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.store.categories[idx] = { ...this.store.categories[idx], ...updates };
      this.saveToStorage();
    }
  }

  public deleteCategory(id: string): void {
    this.store = this.loadFromStorage();
    this.store.categories = this.store.categories.filter(c => c.id !== id);
    this.saveToStorage();
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
    const userCols = collections.filter(c => !['1', '2', '3', '4', '5', '6'].includes(c.id));
    this.store.collections = userCols;
    try {
      localStorage.setItem('babadham_user_collections', JSON.stringify(userCols));
    } catch (e) {}
    this.saveToStorage();
    return this.store.collections;
  }

  public getCoupons(): Coupon[] {
    this.store = this.loadFromStorage();
    return this.store.coupons;
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

    const logo = savedLogo || settings.logoImageUrl || (savedBrand as any).logoImageUrl || '/assets/logo.png';
    const favicon = savedFavicon || settings.faviconUrl || (savedBrand as any).faviconUrl || '/assets/favicon.png';

    const merged = {
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
      feature1: '100% Authentic',
      feature2: 'Temple Blessed',
      feature3: 'Secure Packaging',
      feature4: 'Pan India Delivery',
      ...settings,
      ...savedBrand,
      logoImageUrl: logo,
      faviconUrl: favicon
    };

    return merged;
  }

  public getHeroBanners(): HeroBannerItem[] {
    this.store = this.loadFromStorage();
    if (this.store.heroBanners && Array.isArray(this.store.heroBanners)) {
      return this.store.heroBanners;
    }
    if (this.store.brandSettings?.heroBanners && Array.isArray(this.store.brandSettings.heroBanners)) {
      return this.store.brandSettings.heroBanners;
    }
    try {
      const saved = localStorage.getItem('babadham_hero_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  public saveHeroBanners(banners: HeroBannerItem[]): HeroBannerItem[] {
    this.store = this.loadFromStorage();
    this.store.heroBanners = banners;
    if (this.store.brandSettings) {
      this.store.brandSettings.heroBanners = banners;
    }
    try {
      localStorage.setItem('babadham_hero_banners', JSON.stringify(banners));
    } catch (e) {}
    try {
      const channel = new BroadcastChannel('bbp_brand_sync');
      channel.postMessage({ type: 'HERO_BANNERS_UPDATED', banners });
      channel.close();
    } catch (err) {}
    window.dispatchEvent(new Event('bbp_db_updated'));
    this.saveToStorage();
    return banners;
  }

  public getPrebookingHeroBanners(): HeroBannerItem[] {
    this.store = this.loadFromStorage();
    // Check dedicated store key first
    if ((this.store as any).prebookingHeroBanners && Array.isArray((this.store as any).prebookingHeroBanners)) {
      return (this.store as any).prebookingHeroBanners;
    }
    // Fall back to dedicated localStorage key
    try {
      const saved = localStorage.getItem('babadham_prebooking_hero_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  public savePrebookingHeroBanners(banners: HeroBannerItem[]): HeroBannerItem[] {
    this.store = this.loadFromStorage();
    (this.store as any).prebookingHeroBanners = banners;
    if (this.store.brandSettings) {
      this.store.brandSettings.prebookingHeroBanners = banners;
    }
    try {
      localStorage.setItem('babadham_prebooking_hero_banners', JSON.stringify(banners));
    } catch (e) {}
    try {
      const channel = new BroadcastChannel('bbp_brand_sync');
      channel.postMessage({ type: 'PREBOOKING_HERO_BANNERS_UPDATED', banners });
      channel.close();
    } catch (err) {}
    window.dispatchEvent(new Event('bbp_db_updated'));
    this.saveToStorage();
    return banners;
  }

  public updateBrandSettings(newSettings: any) {
    this.store = this.loadFromStorage();
    const current = this.getBrandSettings();
    const updated = { ...current, ...newSettings };
    if (newSettings.heroBanners !== undefined) {
      updated.heroBanners = newSettings.heroBanners;
      this.store.heroBanners = newSettings.heroBanners;
    }
    this.store.brandSettings = updated;
    
    try {
      if (updated.heroBanners !== undefined && Array.isArray(updated.heroBanners)) {
        localStorage.setItem('babadham_hero_banners', JSON.stringify(updated.heroBanners));
      }
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

  public getOrders(): Order[] {
    this.store = this.loadFromStorage();
    return this.store.orders;
  }

  public createOrder(order: any): Order {
    const safeAddress: OrderAddress = (typeof order.address === 'object' && order.address !== null)
      ? order.address
      : {
          fullName: order.customerName || order.devoteeName || 'Devotee',
          phone: order.phone || '',
          email: order.email || 'devotee@babadham.org',
          addressLine: typeof order.address === 'string' ? order.address : '',
          landmark: '',
          city: order.city || 'Deoghar',
          state: order.state || order.stateName || 'Jharkhand',
          pincode: order.pincode || '814112'
        };

    const newOrder: Order = {
      ...order,
      address: safeAddress,
      id: `BBP-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      trackingSteps: [
        {
          title: 'Order Received at Deoghar Dham',
          location: 'Deoghar Command Center',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          active: false,
          iconName: 'CheckCircle2'
        },
        {
          title: 'Bhog & Touch Blessing at Garbhagriha',
          location: 'Baba Baidyanath Temple Shinghasan',
          timestamp: 'Scheduled Today Sandhya Aarti',
          completed: true,
          active: true,
          iconName: 'Sparkles'
        },
        {
          title: 'Sealed in Air-Tight Sacred Box',
          location: 'Sanctum Packaging Vault',
          timestamp: 'Pending',
          completed: false,
          active: false,
          iconName: 'Package'
        },
        {
          title: 'Handed to Express Air Courier',
          location: 'Patna Airport / Ranchi Air Cargo',
          timestamp: 'Pending',
          completed: false,
          active: false,
          iconName: 'Truck'
        },
        {
          title: 'Delivered at Your Doorstep',
          location: safeAddress.city || 'Your Address',
          timestamp: 'Est. 24-48 Hours',
          completed: false,
          active: false,
          iconName: 'Home'
        }
      ]
    };

    this.store.orders.unshift(newOrder);
    this.saveToStorage();
    return newOrder;
  }

  public updateOrder(orderId: string, updates: Partial<Order>): Order | undefined {
    const orderIndex = this.store.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      this.store.orders[orderIndex] = { ...this.store.orders[orderIndex], ...updates };
      this.saveToStorage();
      return this.store.orders[orderIndex];
    }
    return undefined;
  }

  public addReview(review: Omit<DevoteeReview, 'id' | 'date'>): DevoteeReview {
    const newReview: DevoteeReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    this.store.reviews.unshift(newReview);
    this.saveToStorage();
    return newReview;
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      // update tracking steps status
      order.trackingSteps = order.trackingSteps.map((step, idx) => {
        if (status === 'ORDER_PLACED' && idx === 0) return { ...step, completed: true, active: true };
        if (status === 'TEMPLE_BLESSING' && idx <= 1) return { ...step, completed: true, active: idx === 1 };
        if (status === 'PACKED' && idx <= 2) return { ...step, completed: true, active: idx === 2 };
        if (status === 'IN_TRANSIT' && idx <= 3) return { ...step, completed: true, active: idx === 3 };
        if (status === 'DELIVERED') return { ...step, completed: true, active: false };
        return step;
      });
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

  public addCoupon(coupon: Coupon): Coupon {
    this.store.coupons.unshift(coupon);
    this.saveToStorage();
    return coupon;
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

    if (q.startsWith('SELECT') && q.includes('FROM CATEGORIES')) {
      return {
        columns: ['id', 'name', 'hindiName', 'itemCount'],
        rows: this.store.categories.map(c => ({
          id: c.id,
          name: c.name,
          hindiName: c.hindiName,
          itemCount: c.itemCount
        }))
      };
    }

    if (q.startsWith('SELECT') && q.includes('FROM COUPONS')) {
      return {
        columns: ['code', 'discountPercent', 'description', 'minSpend'],
        rows: this.store.coupons
      };
    }

    if (q.startsWith('SELECT') && q.includes('FROM DEVOTEE_REVIEWS')) {
      return {
        columns: ['id', 'devoteeName', 'location', 'rating', 'title'],
        rows: this.store.reviews
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
        columns: ['id', 'name', 'hindiName', 'category', 'price', 'originalPrice', 'rating', 'inStock', 'origin'],
        sampleData: this.store.products.slice(0, 3)
      },
      {
        tableName: 'orders',
        rowCount: this.store.orders.length,
        columns: ['id', 'createdAt', 'address', 'items', 'subtotal', 'discount', 'totalAmount', 'paymentMethod', 'orderStatus'],
        sampleData: this.store.orders.slice(0, 3)
      },
      {
        tableName: 'categories',
        rowCount: this.store.categories.length,
        columns: ['id', 'name', 'hindiName', 'slug', 'itemCount'],
        sampleData: this.store.categories
      },
      {
        tableName: 'coupons',
        rowCount: this.store.coupons.length,
        columns: ['code', 'discountPercent', 'description', 'minSpend', 'maxDiscount'],
        sampleData: this.store.coupons
      },
      {
        tableName: 'devotee_reviews',
        rowCount: this.store.reviews.length,
        columns: ['id', 'devoteeName', 'location', 'rating', 'comment', 'verifiedPurchase'],
        sampleData: this.store.reviews.slice(0, 3)
      }
    ];
  }

  public generateSQLDump(): string {
    let sql = `-- ========================================================\n`;
    sql += `-- BABA BAIDYANATH PRASADAM - MySQL Database Dump\n`;
    sql += `-- Generated At: ${new Date().toISOString()}\n`;
    sql += `-- ========================================================\n\n`;

    sql += `CREATE DATABASE IF NOT EXISTS \`babadham_db\`;\nUSE \`babadham_db\`;\n\n`;

    // Products table
    sql += `DROP TABLE IF EXISTS \`products\`;\n`;
    sql += `CREATE TABLE \`products\` (\n`;
    sql += `  \`id\` VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`hindi_name\` VARCHAR(255),\n`;
    sql += `  \`category\` VARCHAR(64) NOT NULL,\n`;
    sql += `  \`price\` DECIMAL(10,2) NOT NULL,\n`;
    sql += `  \`original_price\` DECIMAL(10,2),\n`;
    sql += `  \`rating\` DECIMAL(3,2),\n`;
    sql += `  \`in_stock\` TINYINT(1) DEFAULT 1\n`;
    sql += `);\n\n`;

    this.store.products.forEach(p => {
      sql += `INSERT INTO \`products\` VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.hindiName.replace(/'/g, "''")}', '${p.category}', ${p.price}, ${p.originalPrice}, ${p.rating}, 1);\n`;
    });

    return sql;
  }
}

export const db = new MySQLSim();
