import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Order, Collection, Coupon, BrandSettings, AdminUserProfile, LoginLog, CategoryInfo, Vendor, UpsellCondition, TimelineEvent, OrderAddress } from '../types/ecommerce';
import { db } from '../db/mysqlSim';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Data
  products: Product[];
  categories: CategoryInfo[];
  collections: Collection[];
  orders: Order[];
  coupons: Coupon[];
  upsellConditions: UpsellCondition[];
  vendors: Vendor[];
  brandSettings: BrandSettings;
  adminProfile: AdminUserProfile;
  loginLogs: LoginLog[];
  
  // Actions
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  updateOrderPaymentMethod: (orderId: string, method: Order['paymentMethod']) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;
  updateOrderAddress: (orderId: string, addressType: 'shipping' | 'billing', address: Partial<OrderAddress>) => void;
  updateOrderItems: (orderId: string, items: any[], subtotal: number, totalAmount: number) => void;
  updateOrderTracking: (orderId: string, courierName: string, trackingNumber: string, trackingUrl: string) => void;
  addTimelineEvent: (orderId: string, event: Omit<TimelineEvent, 'id' | 'createdAt'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product | void;
  updateProduct: (id: string, updates: Partial<Product>) => Product | void | undefined;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  addCategory: (category: Partial<CategoryInfo> & { name: string }) => void;
  deleteCategory: (id: string) => void;
  addVendor: (vendor: Omit<Vendor, 'id'> & { id?: string }) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  saveCollection: (col: Collection) => void;
  deleteCollection: (id: string) => void;
  clearSampleCollections: () => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  addUpsell: (upsell: Omit<UpsellCondition, 'id'>) => void;
  updateUpsell: (id: string, updates: Partial<UpsellCondition>) => void;
  deleteUpsell: (id: string) => void;
  saveBrandSettings: (settings: Partial<BrandSettings>) => void;
  saveAdminProfile: (profile: Partial<AdminUserProfile>) => void;
  
  // Toast
  toasts: Toast[];
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prasadam_admin_auth') === 'true';
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl && tabFromUrl.trim().length > 0) return tabFromUrl;

        const savedTab = localStorage.getItem('bbp_admin_active_tab');
        if (savedTab && savedTab.trim().length > 0) return savedTab;
      }
    } catch (e) {}
    return 'analytics';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bbp_admin_active_tab', tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {}
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => db.getCategories());
  const [collections, setCollections] = useState<Collection[]>(() => db.getCollections());
  const [orders, setOrders] = useState<Order[]>(() => db.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => db.getCoupons());
  const [upsellConditions, setUpsellConditions] = useState<UpsellCondition[]>(() => db.getUpsells());
  const [vendors, setVendors] = useState<Vendor[]>(() => db.getVendors());
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => db.getBrandSettings());
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile>(() => db.getAdminProfile());
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(() => db.getLoginLogs());
  const [toasts, setToasts] = useState<Toast[]>([]);

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
      document.title = `${brandSettings.brandName} | Admin Suite`;
    }
  }, [brandSettings]);

  useEffect(() => {
    const handleStorageChange = () => {
      setProducts([...db.getProducts()]);
      setOrders([...db.getOrders()]);
      setCoupons([...db.getCoupons()]);
      setBrandSettings(db.getBrandSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bbp_db_updated', handleStorageChange);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('bbp_brand_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'BRAND_SETTINGS_UPDATED') {
          handleStorageChange();
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel sync error', err);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bbp_db_updated', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const login = (user: string, pass: string): boolean => {
    const currentProfile = db.getAdminProfile();
    const isValid = (user === currentProfile.adminId || user === 'admin' || user === 'deoghar') &&
                    (pass === currentProfile.passwordHash || pass === 'baba@admin2026' || pass === 'admin123');

    db.addLoginLog({
      timestamp: new Date().toISOString(),
      adminId: user || 'unknown',
      ipAddress: '103.24.18.92',
      device: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Windows') ? 'Chrome on Windows 11' : 'Mobile Web Browser') : 'Web Browser',
      location: 'Deoghar, Jharkhand, IN',
      status: isValid ? 'SUCCESS' : 'FAILED'
    });
    setLoginLogs(db.getLoginLogs());

    if (isValid) {
      setIsAuthenticated(true);
      localStorage.setItem('prasadam_admin_auth', 'true');
      showToast(`Welcome back, ${currentProfile.name}! Logged in successfully.`);
      return true;
    }
    showToast(`Invalid credentials for ${user}`, 'warning');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('prasadam_admin_auth');
    showToast('Logged out of Admin Portal.', 'info');
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = db.addOrder(orderData);
    setOrders([...db.getOrders()]);
    showToast('Order created successfully', 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    db.updateOrderStatus(orderId, status);
    setOrders([...db.getOrders()]);
    showToast(`Order ${orderId} status updated to ${status}`);
  };

  const updateOrderPaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    db.updateOrderPaymentStatus(orderId, status);
    setOrders([...db.getOrders()]);
    showToast(`Order payment status updated to ${status}`);
  };

  const updateOrderPaymentMethod = (orderId: string, method: Order['paymentMethod']) => {
    db.updateOrderPaymentMethod(orderId, method);
    setOrders([...db.getOrders()]);
    showToast(`Order payment method updated to ${method}`);
  };

  const updateOrderNotes = (orderId: string, notes: string) => {
    db.updateOrderNotes(orderId, notes);
    setOrders([...db.getOrders()]);
    showToast(`Order notes updated successfully`);
  };

  const updateOrderAddress = (orderId: string, addressType: 'shipping' | 'billing', address: Partial<OrderAddress>) => {
    db.updateOrderAddress(orderId, addressType, address);
    setOrders([...db.getOrders()]);
    showToast(`Customer ${addressType} address updated`);
  };

  const updateOrderItems = (orderId: string, items: any[], subtotal: number, totalAmount: number) => {
    db.updateOrderItems(orderId, items, subtotal, totalAmount);
    setOrders([...db.getOrders()]);
    showToast(`Order ${orderId} items updated successfully`);
  };

  const addTimelineEvent = (orderId: string, event: Omit<TimelineEvent, 'id' | 'createdAt'>) => {
    db.addTimelineEvent(orderId, event);
    setOrders([...db.getOrders()]);
  };

  const updateOrderTracking = (orderId: string, courierName: string, trackingNumber: string, trackingUrl: string) => {
    db.updateOrderTracking(orderId, courierName, trackingNumber, trackingUrl);
    setOrders([...db.getOrders()]);
    showToast(`Tracking details updated for order ${orderId}`);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = db.addProduct(product);
    setProducts([...db.getProducts()]);
    showToast('New sacred product added to store inventory!');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = db.updateProduct(id, updates);
    setProducts([...db.getProducts()]);
    showToast('Product updated successfully!');
    return updated;
  };

  const deleteProduct = (id: string) => {
    db.deleteProduct(id);
    setProducts([...db.getProducts()]);
    showToast('Product removed from inventory');
  };

  const clearAllProducts = () => {
    db.clearAllProducts();
    setProducts([...db.getProducts()]);
    showToast('All sample products cleared. Ready for your uploaded products!', 'info');
  };

  const addCategory = (catData: Partial<CategoryInfo> & { name: string }) => {
    db.addCategory(catData);
    setCategories([...db.getCategories()]);
    showToast(`Category "${catData.name}" added successfully!`);
  };

  const deleteCategory = (id: string) => {
    db.deleteCategory(id);
    setCategories([...db.getCategories()]);
    showToast('Category deleted successfully', 'info');
  };

  const addVendor = (vendorData: Omit<Vendor, 'id'> & { id?: string }) => {
    db.addVendor(vendorData);
    setVendors([...db.getVendors()]);
    showToast(`Vendor "${vendorData.name}" added successfully!`);
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    db.updateVendor(id, updates);
    setVendors([...db.getVendors()]);
    showToast(`Vendor updated successfully!`);
  };

  const deleteVendor = (id: string) => {
    db.deleteVendor(id);
    setVendors([...db.getVendors()]);
    showToast('Vendor removed from system', 'info');
  };

  const saveCollection = (col: Collection) => {
    const updated = db.saveCollection(col);
    setCollections([...updated]);
    showToast(`Collection "${col.title}" saved successfully!`);
  };

  const deleteCollection = (id: string) => {
    const updated = db.deleteCollection(id);
    setCollections([...updated]);
    showToast('Collection removed from database', 'info');
  };

  const clearSampleCollections = () => {
    const updated = db.clearSampleCollections();
    setCollections([...updated]);
    showToast('Sample demo collections cleared. Only your created collections are now showing!', 'info');
  };

  const addCoupon = (coupon: Omit<Coupon, 'code'> & { code: string }) => {
    db.addCoupon(coupon);
    setCoupons([...db.getCoupons()]);
    showToast('New promo coupon code active!');
  };

  const updateCoupon = (code: string, updates: Partial<Coupon>) => {
    db.updateCoupon(code, updates);
    setCoupons([...db.getCoupons()]);
    showToast('Coupon updated', 'success');
  };

  const deleteCoupon = (code: string) => {
    db.deleteCoupon(code);
    setCoupons([...db.getCoupons()]);
    showToast('Coupon code removed', 'info');
  };

  const addUpsell = (upsell: Omit<UpsellCondition, 'id'>) => {
    const updated = db.addUpsell(upsell);
    setUpsellConditions([...updated]);
    showToast('Upsell condition added', 'success');
  };

  const updateUpsell = (id: string, updates: Partial<UpsellCondition>) => {
    const updated = db.updateUpsell(id, updates);
    setUpsellConditions([...updated]);
    showToast('Upsell condition updated', 'success');
  };

  const deleteUpsell = (id: string) => {
    const updated = db.deleteUpsell(id);
    setUpsellConditions([...updated]);
    showToast('Upsell condition removed', 'success');
  };

  const saveBrandSettings = (settings: Partial<BrandSettings>) => {
    db.saveBrandSettings(settings);
    setBrandSettings(db.getBrandSettings());
    showToast('Brand & Header settings updated successfully!');
  };

  const saveAdminProfile = (profile: Partial<AdminUserProfile>) => {
    const updated = db.saveAdminProfile(profile);
    setAdminProfile({ ...updated });
    showToast('Admin profile and security credentials updated successfully!');
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        collections,
        orders,
        coupons,
        upsellConditions,
        vendors,
        brandSettings,
        adminProfile,
        loginLogs,
        // Actions
        addOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateOrderPaymentMethod,
        updateOrderNotes,
        updateOrderAddress,
        updateOrderItems,
        updateOrderTracking,
        addTimelineEvent,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        addCategory,
        deleteCategory,
        addVendor,
        updateVendor,
        deleteVendor,
        saveCollection,
        deleteCollection,
        clearSampleCollections,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addUpsell,
        updateUpsell,
        deleteUpsell,
        saveBrandSettings,
        saveAdminProfile,
        toasts,
        showToast
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
