import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Category, ShippingMethod } from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { UserProfile } from './AuthContext';

export type { Order, ShippingMethod };

export interface PaymentGatewaysConfig {
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
  };
  directCards: {
    enabled: boolean;
    merchantId: string;
    gatewayKey: string;
  };
  bankWire: {
    enabled: boolean;
    iban: string;
    bic: string;
    bankName: string;
    accountHolder: string;
  };
  applePay: {
    enabled: boolean;
    merchantIdentifier: string;
  };
  amazonPay: {
    enabled: boolean;
    merchantId: string;
    publicKeyId: string;
  };
  googlePay: {
    enabled: boolean;
    merchantId: string;
    gatewayId: string;
  };
}

export interface HeroSettings {
  seasonKicker: string;
  kickerSubtitle: string;
  headingPrefix: string;
  headingHighlight: string;
  subheading: string;
  description: string;
  imageUrl: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface StoreSettings {
  announcementText: string;
  freeShippingThreshold: number;
  storeName?: string;
  discountCode: string;
  discountPercentage: number;
  googleClientId?: string;
  facebookPixelId?: string;
  hero: HeroSettings;
  gateways: PaymentGatewaysConfig;
}

const DEFAULT_GATEWAYS: PaymentGatewaysConfig = {
  stripe: {
    enabled: true,
    publishableKey: 'pk_live_51Mv948AtelierEcovanto928410',
    secretKey: 'sk_live_51Mv948AtelierSecKey99281',
    webhookSecret: 'whsec_98421094821048',
  },
  paypal: {
    enabled: true,
    clientId: 'AYv8489201AtelierPayPalLiveID',
    clientSecret: 'EP948219482SecPayPalKey',
  },
  directCards: {
    enabled: true,
    merchantId: 'MCH-ECOVANTO-BERLIN',
    gatewayKey: 'GW-89201-KEY',
  },
  bankWire: {
    enabled: true,
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'DBEUTDDBXXX',
    bankName: 'Deutsche Bank Berlin',
    accountHolder: 'ECOVANTO ATELIER GMBH',
  },
  applePay: {
    enabled: true,
    merchantIdentifier: 'merchant.com.ecovanto.applepay',
  },
  amazonPay: {
    enabled: false,
    merchantId: '',
    publicKeyId: '',
  },
  googlePay: {
    enabled: true,
    merchantId: 'GPAY-ECOVANTO-9482',
    gatewayId: 'googlepay-berlin-atelier',
  },
};

export const DEFAULT_HERO: HeroSettings = {
  seasonKicker: 'COLLECTION 2026 // RELEASE 04',
  kickerSubtitle: 'BERLIN // 52.5200° N, 13.4050° E',
  headingPrefix: 'LIFE',
  headingHighlight: 'FORCE',
  subheading: 'WHERE ARCHITECTURAL RIGOR MEETS RAW SENSUALITY',
  description: 'Sculptural corsetry, deconstructed virgin wool suiting, and fluid nocturnal eveningwear engineered for unconventional bodies.',
  imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90',
  primaryButtonText: 'SEE COLLECTION',
  primaryButtonLink: '/shop',
  secondaryButtonText: 'BE YOURSELF',
  secondaryButtonLink: '/campaign',
};

const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: 'NEW DROP // LIFE FORCE S/S 2026 // COMPLIMENTARY EXPRESS DISPATCH OVER €500',
  freeShippingThreshold: 500,
  storeName: 'ATELIER ECOVANTO',
  discountCode: 'ATELIER10',
  discountPercentage: 10,
  googleClientId: '',
  facebookPixelId: '',
  hero: DEFAULT_HERO,
  gateways: DEFAULT_GATEWAYS,
};

interface StoreContextType {
  products: Product[];
  orders: Order[];
  categories: Category[];
  hero: HeroSettings;
  customers: UserProfile[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetCategoriesToDefault: () => void;
  updateHero: (updates: Partial<HeroSettings>) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  updateGateways: (updates: Partial<PaymentGatewaysConfig>) => void;
  updateCustomer: (idOrEmail: string, updates: Partial<UserProfile>) => void;
  deleteCustomer: (idOrEmail: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getActiveGatewaysList: () => { id: string; name: string; type: string }[];
}

const PRODUCTS_STORAGE_KEY = 'ecovanto_store_products_v4';
const ORDERS_STORAGE_KEY = 'ecovanto_store_orders_v4';
const SETTINGS_STORAGE_KEY = 'ecovanto_store_settings_v4';
const CATEGORIES_STORAGE_KEY = 'ecovanto_store_categories_v4';
const CUSTOMERS_STORAGE_KEY = 'ecovanto_registered_customers_v3';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ord-170829101',
          orderNumber: 'ECO-2026-8941',
          customer: {
            firstName: 'Elena',
            lastName: 'Voss',
            email: 'elena.voss@berlin-art.de',
            phone: '+49 172 8920192',
            address: 'Auguststraße 14',
            city: 'Berlin',
            postalCode: '10117',
            country: 'Germany',
          },
          items: [
            {
              product: PRODUCTS[0],
              quantity: 1,
              size: 'M',
              color: 'Obsidian Noir',
              unitPrice: PRODUCTS[0].price,
              totalPrice: PRODUCTS[0].price,
            },
          ],
          shippingMethod: {
            id: 'dhl_express',
            name: 'DHL Express European Carbon Neutral',
            carrier: 'DHL Express',
            price: 18,
            deliveryTime: '1-2 Business Days',
          },
          subtotal: PRODUCTS[0].price,
          shippingCost: 18,
          discountAmount: 0,
          total: PRODUCTS[0].price + 18,
          paymentMethod: 'Stripe Direct (Encrypted Card)',
          status: 'dispatched',
          trackingNumber: 'DE-DHL-99201847120',
          createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  const [customers, setCustomers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'usr-elena-voss',
          email: 'elena.voss@berlin-art.de',
          firstName: 'Elena',
          lastName: 'Voss',
          phone: '+49 172 8920192',
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          addresses: [
            {
              id: 'addr-elena-1',
              title: 'Berlin Studio',
              address: 'Auguststraße 14',
              city: 'Berlin',
              postalCode: '10117',
              country: 'Germany',
              isDefault: true,
            },
          ],
        },
      ];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          hero: { ...DEFAULT_HERO, ...(parsed.hero || {}) },
          gateways: { ...DEFAULT_GATEWAYS, ...(parsed.gateways || {}) },
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  // Category Actions
  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const resetCategoriesToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
  };

  // Hero Actions
  const updateHero = (updates: Partial<HeroSettings>) => {
    setSettings((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updates },
    }));
  };

  // Customer Actions
  const updateCustomer = (idOrEmail: string, updates: Partial<UserProfile>) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === idOrEmail || c.email.toLowerCase() === idOrEmail.toLowerCase()
          ? { ...c, ...updates }
          : c
      )
    );
  };

  const deleteCustomer = (idOrEmail: string) => {
    setCustomers((prev) =>
      prev.filter(
        (c) =>
          c.id !== idOrEmail &&
          c.email.toLowerCase() !== idOrEmail.toLowerCase()
      )
    );
  };

  // Order Actions
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'status'>
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().getFullYear();
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ECO-${dateStr}-${randomSuffix}`,
      status: 'pending',
      trackingNumber: `DE-ECO-${Math.floor(100000000 + Math.random() * 900000000)}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer in CRM list
    const customerRecord: UserProfile = {
      id: `usr-${Date.now()}`,
      email: orderData.customer.email,
      firstName: orderData.customer.firstName,
      lastName: orderData.customer.lastName,
      phone: orderData.customer.phone,
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: `addr-${Date.now()}`,
          title: 'Shipping Coordinates',
          address: orderData.customer.address,
          apartment: orderData.customer.apartment,
          city: orderData.customer.city,
          postalCode: orderData.customer.postalCode,
          country: orderData.customer.country,
          isDefault: true,
        },
      ],
    };
    updateCustomer(customerRecord.email, customerRecord);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateGateways = (updates: Partial<PaymentGatewaysConfig>) => {
    setSettings((prev) => ({
      ...prev,
      gateways: { ...prev.gateways, ...updates },
    }));
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const getOrderByNumber = (orderNumber: string) => {
    const cleanNum = orderNumber.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanNum ||
        o.orderNumber.replace(/[^A-Z0-9]/g, '') === cleanNum.replace(/[^A-Z0-9]/g, '')
    );
  };

  const getActiveGatewaysList = () => {
    const list: { id: string; name: string; type: string }[] = [];
    const g = settings.gateways;

    if (g.stripe.enabled && g.stripe.publishableKey.trim() !== '') {
      list.push({ id: 'stripe', name: 'Credit / Debit Card (Stripe Vault)', type: 'card' });
    }
    if (g.paypal.enabled && g.paypal.clientId.trim() !== '') {
      list.push({ id: 'paypal', name: 'PayPal Express / Pay Later', type: 'paypal' });
    }
    if (g.directCards.enabled && g.directCards.merchantId.trim() !== '') {
      list.push({ id: 'directCards', name: 'Atelier Vault Secure Cards', type: 'direct' });
    }
    if (g.applePay.enabled && g.applePay.merchantIdentifier.trim() !== '') {
      list.push({ id: 'applePay', name: 'Apple Pay (Biometric Authorization)', type: 'wallet' });
    }
    if (g.googlePay.enabled && g.googlePay.merchantId.trim() !== '') {
      list.push({ id: 'googlePay', name: 'Google Pay', type: 'wallet' });
    }
    if (g.amazonPay.enabled && g.amazonPay.merchantId.trim() !== '') {
      list.push({ id: 'amazonPay', name: 'Amazon Pay', type: 'wallet' });
    }
    if (g.bankWire.enabled && g.bankWire.iban.trim() !== '') {
      list.push({ id: 'bankWire', name: 'Direct SEPA / Wire Transfer', type: 'bank' });
    }

    if (list.length === 0) {
      list.push({ id: 'stripe', name: 'Credit / Debit Card (Secure Vault)', type: 'card' });
    }

    return list;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        categories,
        hero: settings.hero,
        customers,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        updateHero,
        createOrder,
        updateOrderStatus,
        updateSettings,
        updateGateways,
        updateCustomer,
        deleteCustomer,
        getOrderById,
        getOrderByNumber,
        getActiveGatewaysList,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
