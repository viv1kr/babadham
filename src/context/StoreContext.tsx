import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, ProductCategory, Order, Coupon } from '../types/ecommerce';
import { db } from '../db/mysqlSim';
import { useAudio } from './AudioContext';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  products: Product[];
  categories: ReturnType<typeof db.getCategories>;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, option?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  freeShippingThreshold: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  detailProduct: Product | null;
  setDetailProduct: (product: Product | null) => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isDatabaseExplorerOpen: boolean;
  setIsDatabaseExplorerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  activePage: 'home' | 'categories' | 'order-request';
  setActivePage: (page: 'home' | 'categories' | 'order-request') => void;

  isPreBookingOpen: boolean;
  setIsPreBookingOpen: (open: boolean) => void;
  preBookingProduct: Product | null;
  setPreBookingProduct: (product: Product | null) => void;
  openPreBooking: (product?: Product | null) => void;

  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (addressData: any, paymentMethod: 'UPI' | 'CARD' | 'COD') => Order;


  adminAddProduct: (product: Omit<Product, 'id'>) => void;
  adminDeleteProduct: (id: string) => void;
  adminAddCoupon: (coupon: Coupon) => void;
  
  adminAddCategory: (category: any) => void;
  adminUpdateCategory: (id: string, updates: any) => void;
  adminDeleteCategory: (id: string) => void;

  brandSettings: any;
  updateBrandSettings: (newSettings: any) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playTempleBell } = useAudio();
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [categories, setCategories] = useState(() => db.getCategories());
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bbp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bbp_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isDatabaseExplorerOpen, setIsDatabaseExplorerOpen] = useState<boolean>(false);
  const [activePage, setActivePageState] = useState<'home' | 'categories' | 'order-request'>(() => {
    try {
      if (typeof window !== 'undefined') {
        if (window.location.pathname.endsWith('/order-request')) return 'order-request';
        if (window.location.pathname.endsWith('/categories')) return 'categories';
        const saved = localStorage.getItem('bbp_store_active_page');
        if (saved && ['home', 'categories', 'order-request'].includes(saved)) {
          return saved as any;
        }
      }
    } catch (e) {}
    return 'home';
  });

  const setActivePage = (page: 'home' | 'categories' | 'order-request') => {
    setActivePageState(page);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bbp_store_active_page', page);
        if (page === 'order-request') {
          if (!window.location.pathname.endsWith('/order-request')) {
            window.history.pushState({}, '', '/order-request');
          }
        } else if (page === 'categories') {
          if (!window.location.pathname.endsWith('/categories')) {
            window.history.pushState({}, '', '/categories');
          }
        } else {
          if (window.location.pathname.endsWith('/order-request') || window.location.pathname.endsWith('/categories')) {
            window.history.pushState({}, '', '/');
          }
        }
      }
    } catch (e) {}
  };

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [isPreBookingOpen, setIsPreBookingOpen] = useState<boolean>(false);
  const [preBookingProduct, setPreBookingProduct] = useState<Product | null>(null);

  const openPreBooking = (product?: Product | null) => {
    if (product) {
      setPreBookingProduct(product);
    }
    setIsPreBookingOpen(true);
    playTempleBell();
  };

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const checkPathAndHash = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      if (
        pathname.endsWith('/order-request') ||
        pathname.endsWith('/order-request/') ||
        pathname.endsWith('/request') ||
        hash === '#order-request' ||
        hash === '#orderrequest' ||
        hash === '#request' ||
        hash === '#order-funnel' ||
        search.includes('page=order-request') ||
        search.includes('funnel=order-request') ||
        search.includes('request=true')
      ) {
        setActivePage('order-request');
      } else if (
        hash === '#prebook' || 
        hash === '#pre-booking' || 
        hash === '#prasad-booking' || 
        hash === '#prasadbooking' || 
        search.includes('prebook=true') ||
        search.includes('prebooking=true') ||
        search.includes('page=prasadbooking') ||
        search.includes('page=prebook')
      ) {
        setIsPreBookingOpen(true);
      }
    };
    checkPathAndHash();
    window.addEventListener('hashchange', checkPathAndHash);
    window.addEventListener('popstate', checkPathAndHash);
    return () => {
      window.removeEventListener('hashchange', checkPathAndHash);
      window.removeEventListener('popstate', checkPathAndHash);
    };
  }, []);

  // Real-time Database Synchronization Effect
  useEffect(() => {
    const syncDb = () => {
      setProducts([...db.getProducts()]);
      setCategories([...db.getCategories()]);
      setBrandSettings(db.getBrandSettings());
    };

    window.addEventListener('storage', syncDb);
    window.addEventListener('bbp_db_updated', syncDb);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('bbp_db_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'DB_UPDATED' || event.data?.type === 'BRAND_SETTINGS_UPDATED') {
          syncDb();
        }
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', syncDb);
      window.removeEventListener('bbp_db_updated', syncDb);
      if (channel) channel.close();
    };
  }, []);



  const adminAddProduct = (product: Omit<Product, 'id'>) => {
    db.addProduct(product);
    showToast(`New sacred item "${product.name}" added to catalog!`);
  };

  const adminDeleteProduct = (id: string) => {
    db.deleteProduct(id);
    showToast(`Item removed from catalog`, 'info');
  };

  const adminAddCoupon = (coupon: Coupon) => {
    db.addCoupon(coupon);
    showToast(`Coupon ${coupon.code} created successfully!`);
  };

  const adminAddCategory = (category: any) => {
    db.addCategory(category);
    setCategories([...db.getCategories()]);
    showToast('Category created successfully', 'success');
  };

  const adminUpdateCategory = (id: string, updates: any) => {
    db.updateCategory(id, updates);
    setCategories([...db.getCategories()]);
    showToast('Category updated successfully', 'success');
  };

  const adminDeleteCategory = (id: string) => {
    db.deleteCategory(id);
    setCategories([...db.getCategories()]);
    showToast('Category deleted successfully', 'success');
  };

  // Brand Settings State
  const [brandSettings, setBrandSettings] = useState<any>(() => db.getBrandSettings());

  // Dynamic Favicon & Title Effect (Flushes & replaces link element for instant browser tab update)
  useEffect(() => {
    const favUrl = brandSettings?.faviconUrl || brandSettings?.logoImageUrl || (typeof window !== 'undefined' ? (localStorage.getItem('babadham_favicon_image') || localStorage.getItem('babadham_logo_image')) : '');

    // Remove all existing icon link tags from document head
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.parentNode?.removeChild(link));

    // Create fresh link tag
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.id = 'app-favicon';

    if (favUrl && favUrl.trim().length > 0) {
      if (favUrl.startsWith('data:image/png')) {
        newLink.type = 'image/png';
      } else if (favUrl.startsWith('data:image/jpeg') || favUrl.startsWith('data:image/jpg')) {
        newLink.type = 'image/jpeg';
      } else if (favUrl.startsWith('data:image/svg')) {
        newLink.type = 'image/svg+xml';
      } else if (favUrl.endsWith('.ico')) {
        newLink.type = 'image/x-icon';
      } else if (favUrl.endsWith('.png')) {
        newLink.type = 'image/png';
      }
      newLink.href = favUrl;
    } else {
      const icon = brandSettings?.logoIcon || 'ॐ';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`;
      newLink.type = 'image/svg+xml';
      newLink.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    document.head.appendChild(newLink);

    if (brandSettings?.brandName) {
      document.title = `${brandSettings.brandName} | Official Portal`;
    }
  }, [brandSettings]);

  // Real-time Database Synchronization Listener (Syncs logo, favicon, brandSettings across tabs, windows & ports)
  useEffect(() => {
    const syncDatabaseState = () => {
      setBrandSettings(db.getBrandSettings());
      setProducts([...db.getProducts()]);
    };

    window.addEventListener('storage', syncDatabaseState);
    window.addEventListener('bbp_db_updated', syncDatabaseState);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('bbp_brand_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'BRAND_SETTINGS_UPDATED') {
          const newSettings = event.data.settings;
          db.updateBrandSettings(newSettings);
          setBrandSettings(db.getBrandSettings());
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel sync error', err);
    }

    // CROSS-ORIGIN SYNC LISTENER (For Prasadam on port 5174 syncing to Babadham on port 5173)
    const handleMessageSync = (event: MessageEvent) => {
      // Allow from typical Vite local ports
      if (!['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'].includes(event.origin) && !event.origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'SYNC_BRANDING_CROSS_ORIGIN') {
        const { logo, favicon, settings } = event.data;
        if (logo) localStorage.setItem('babadham_logo_image', logo);
        if (favicon) localStorage.setItem('babadham_favicon_image', favicon);
        if (settings) localStorage.setItem('babadham_brand_settings', settings);
        
        // Force refresh state from updated localStorage
        setBrandSettings(db.getBrandSettings());
      }
    };
    window.addEventListener('message', handleMessageSync);

    return () => {
      window.removeEventListener('storage', syncDatabaseState);
      window.removeEventListener('bbp_db_updated', syncDatabaseState);
      window.removeEventListener('message', handleMessageSync);
      if (channel) channel.close();
    };
  }, []);

  const updateBrandSettings = (newSettings: any) => {
    const updated = db.updateBrandSettings(newSettings);
    setBrandSettings(updated);
    showToast('Branding & Header Settings Saved Successfully!');
  };

  const freeShippingThreshold = 999;

  useEffect(() => {
    localStorage.setItem('bbp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bbp_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1, option?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedOption: option }];
    });
    playTempleBell();
    showToast(`Added ${product.name} to Sacred Prasad Cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const discountAmount = appliedCoupon 
    ? Math.min(Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100), appliedCoupon.maxDiscount)
    : 0;

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = db.getCoupons().find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid Coupon Code. Try BAIDA10 or MAHADEV20' };
    }
    if (cartSubtotal < found.minSpend) {
      return { success: false, message: `Minimum spend of ₹${found.minSpend} required for code ${found.code}` };
    }
    setAppliedCoupon(found);
    playTempleBell();
    showToast(`Coupon ${found.code} Applied! Saved ₹${Math.min(Math.round((cartSubtotal * found.discountPercent) / 100), found.maxDiscount)}`);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        playTempleBell();
        showToast('Added to Sacred Wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  const placeOrder = (addressData: any, paymentMethod: 'UPI' | 'CARD' | 'COD'): Order => {
    const shipping = cartSubtotal >= freeShippingThreshold ? 0 : 70;
    const totalAmount = cartSubtotal - discountAmount + shipping;

    const orderData = db.createOrder({
      address: addressData,
      items: cart,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'ORDER_PLACED'
    });

    setActiveOrder(orderData);
    clearCart();
    playTempleBell();
    showToast('Jai Bhole! Order placed with divine blessings!', 'success');
    return orderData;
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartCount,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount,
      freeShippingThreshold,
      wishlist,
      toggleWishlist,
      isWishlisted,
      recentlyViewed,
      addRecentlyViewed,
      quickViewProduct,
      setQuickViewProduct,
      detailProduct,
      setDetailProduct,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isDatabaseExplorerOpen,
      setIsDatabaseExplorerOpen,
      isSearchModalOpen,
      setIsSearchModalOpen,
      activePage,
      setActivePage,
      isPreBookingOpen,
      setIsPreBookingOpen,
      preBookingProduct,
      setPreBookingProduct,
      openPreBooking,
      activeOrder,
      setActiveOrder,
      placeOrder,

      adminAddProduct,
      adminDeleteProduct,
      adminAddCoupon,
      adminAddCategory,
      adminUpdateCategory,
      adminDeleteCategory,
      brandSettings,
      updateBrandSettings,
      toasts,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
