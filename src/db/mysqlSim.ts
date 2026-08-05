import type { Product, CategoryInfo, Order, Coupon, DevoteeReview, DBTableInfo } from '../types/ecommerce';
import { PRODUCTS_DATA, CATEGORIES_DATA, COUPONS_DATA, DEVOTEE_REVIEWS } from './seedData';

const STORAGE_KEY = 'babadham_mysql_db_v1';

interface DBStore {
  products: Product[];
  categories: CategoryInfo[];
  orders: Order[];
  coupons: Coupon[];
  reviews: DevoteeReview[];
  brandSettings: any;
}

class MySQLSim {
  private store: DBStore;

  constructor() {
    this.store = this.loadFromStorage();
  }

  private loadFromStorage(): DBStore {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load DB state, resetting to seed', e);
    }
    return {
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
        ],
        heroSlides: [
          {
            id: 'slide-1',
            type: 'image',
            mediaUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1600&q=80',
            mobileMediaUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80',
            enableGradient: true,
            heading: 'Authentic Deoghar Baidyanath Temple Prasad',
            description: 'Delivered directly to your doorstep from Baba Baidyanath Dham, Deoghar.',
            buttonText: 'Explore Sacred Offerings',
            buttonLink: '#featured-products'
          },
          {
            id: 'slide-2',
            type: 'image',
            mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
            mobileMediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            enableGradient: true,
            heading: 'Pure Milk Peda Prasad & Sultanganj Gangajal',
            description: 'Prepared with pure cow milk and blessed at the sacred Jyotirlinga.',
            buttonText: 'Order Fresh Peda',
            buttonLink: '#best-sellers'
          },
          {
            id: 'slide-3',
            type: 'video',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candles-burning-in-a-dark-room-41551-large.mp4',
            mobileMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candles-burning-in-a-dark-room-41551-large.mp4',
            enableGradient: true,
            heading: '24/7 Garbhagriha Live Temple Darshan',
            description: 'Receive divine blessings anytime from Baba Baidyanath Dham.',
            buttonText: 'Watch Live Darshan',
            buttonLink: 'live-darshan'
          }
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
      feature1: '100% Authentic',
      feature2: 'Temple Blessed',
      feature3: 'Secure Packaging',
      feature4: 'Pan India Delivery',
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

  public getOrders(): Order[] {
    this.store = this.loadFromStorage();
    return this.store.orders;
  }

  public createOrder(order: Omit<Order, 'id' | 'createdAt' | 'trackingSteps'>): Order {
    const newOrder: Order = {
      ...order,
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
          location: order.address.city,
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
