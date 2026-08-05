import type { Product, CategoryInfo, Collection, Order, Coupon, DevoteeReview, DBTableInfo, AdminUserProfile, LoginLog, Vendor } from '../types/ecommerce';
import { PRODUCTS_DATA, CATEGORIES_DATA, COUPONS_DATA, DEVOTEE_REVIEWS, VENDORS_DATA } from './seedData';

const STORAGE_KEY = 'babadham_mysql_db_v1';

interface DBStore {
  products: Product[];
  categories: CategoryInfo[];
  collections?: Collection[];
  orders: Order[];
  coupons: Coupon[];
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
  }

  private loadFromStorage(): DBStore {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const store: DBStore = JSON.parse(saved);
        if (!store.collections || !Array.isArray(store.collections)) {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bbp_db_updated'));
    } catch (e) {
      console.warn('Failed to persist DB state', e);
    }
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

    return {
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
      logoImageUrl: savedLogo || '/assets/logo.svg',
      faviconUrl: savedFavicon || '/assets/favicon.svg',
      ...settings,
      ...savedBrand,
      ...(savedLogo ? { logoImageUrl: savedLogo } : {}),
      ...(savedFavicon ? { faviconUrl: savedFavicon } : {})
    };
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

  public updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const order = this.store.orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
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
    if (!this.store.adminProfile) {
      this.store.adminProfile = {
        name: 'Admin Sevak',
        designation: 'Super Administrator',
        photoUrl: '',
        adminId: 'admin',
        passwordHash: 'baba@admin2026'
      };
      this.saveToStorage();
    }
    return this.store.adminProfile;
  }

  public saveAdminProfile(profile: Partial<AdminUserProfile>): AdminUserProfile {
    this.store.adminProfile = {
      ...this.getAdminProfile(),
      ...profile
    };
    this.saveToStorage();
    return this.store.adminProfile;
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
    this.saveToStorage();
    return this.store.collections;
  }

  public deleteCollection(id: string): Collection[] {
    const collections = this.getCollections();
    this.store.collections = collections.filter(c => c.id !== id);
    this.saveToStorage();
    return this.store.collections;
  }
}

export const db = new MySQLSim();
