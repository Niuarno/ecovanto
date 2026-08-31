import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Size, ProductColor } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

export interface OrderCustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  price: number;
  deliveryTime: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  price: number;
  size: Size;
  color: ProductColor;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  paymentDetails: {
    last4?: string;
    brand?: string;
    cardHolder?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  trackingNumber: string;
}

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

export interface StoreSettings {
  announcementText: string;
  freeShippingThreshold: number;
  storeName: string;
  discountCode: string;
  discountPercentage: number;
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

const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: 'NEW DROP // LIFE FORCE S/S 2026 // COMPLIMENTARY EXPRESS DISPATCH OVER €500',
  freeShippingThreshold: 500,
  storeName: 'ATELIER ECOVANTO',
  discountCode: 'ATELIER10',
  discountPercentage: 10,
  gateways: DEFAULT_GATEWAYS,
};

interface StoreContextType {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  updateGateways: (updates: Partial<PaymentGatewaysConfig>) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getActiveGatewaysList: () => { id: string; name: string; type: string }[];
}

const PRODUCTS_STORAGE_KEY = 'ecovanto_store_products_v3';
const ORDERS_STORAGE_KEY = 'ecovanto_store_orders_v3';
const SETTINGS_STORAGE_KEY = 'ecovanto_store_settings_v3';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ord-demo-01',
          orderNumber: 'ECO-94821',
          createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
          customer: {
            firstName: 'Helena',
            lastName: 'Voss',
            email: 'helena.voss@studio-berlin.de',
            phone: '+49 171 4928103',
            address: 'Auguststraße 14',
            city: 'Berlin',
            postalCode: '10117',
            country: 'Germany',
          },
          shippingMethod: {
            id: 'dhl_express',
            name: 'DHL Express European Priority',
            carrier: 'DHL Express',
            price: 0,
            deliveryTime: '1-2 Business Days',
          },
          paymentMethod: 'stripe',
          paymentDetails: {
            last4: '4242',
            brand: 'Visa Atelier Black',
            cardHolder: 'Helena Voss',
          },
          items: [
            {
              productId: 'prod-01',
              productName: 'ANATOMICAL CORSET DRESS',
              productSlug: 'anatomical-corset-dress',
              image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
              price: 490,
              size: 'S',
              color: { name: 'Pitch Noir', hex: '#0B0B0B' },
              quantity: 1,
            },
          ],
          subtotal: 490,
          shippingCost: 0,
          discount: 49,
          total: 441,
          status: 'dispatched',
          trackingNumber: 'DHL-EX-83920149-DE',
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
          gateways: { ...DEFAULT_GATEWAYS, ...(parsed.gateways || {}) },
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const id = `prod-${Date.now().toString(36)}`;
    const newProduct: Product = { ...newProdData, id };
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
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'status'>
  ): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ECO-${randomSuffix}`;
    const trackingNumber = `DHL-EX-${Math.floor(10000000 + Math.random() * 90000000)}-EU`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingNumber,
      status: 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
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

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) =>
    orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());

  // Check which gateways have active credentials and are enabled
  const getActiveGatewaysList = () => {
    const active: { id: string; name: string; type: string }[] = [];
    const g = settings.gateways;

    if (g.stripe.enabled && g.stripe.publishableKey.trim()) {
      active.push({ id: 'stripe', name: 'STRIPE (CARDS / APPLE / GOOGLE)', type: 'card' });
    }
    if (g.directCards.enabled && g.directCards.merchantId.trim()) {
      active.push({ id: 'cards', name: 'CREDIT / DEBIT CARD', type: 'card' });
    }
    if (g.paypal.enabled && g.paypal.clientId.trim()) {
      active.push({ id: 'paypal', name: 'PAYPAL EXPRESS', type: 'wallet' });
    }
    if (g.applePay.enabled && g.applePay.merchantIdentifier.trim()) {
      active.push({ id: 'apple_pay', name: 'APPLE PAY (1-TAP)', type: 'wallet' });
    }
    if (g.googlePay.enabled && g.googlePay.merchantId.trim()) {
      active.push({ id: 'google_pay', name: 'GOOGLE PAY', type: 'wallet' });
    }
    if (g.amazonPay.enabled && g.amazonPay.merchantId.trim()) {
      active.push({ id: 'amazon_pay', name: 'AMAZON PAY', type: 'wallet' });
    }
    if (g.bankWire.enabled && g.bankWire.iban.trim()) {
      active.push({ id: 'bank_wire', name: 'DIRECT SEPA ATELIER TRANSFER', type: 'bank' });
    }

    // Default fallback if all cleared
    if (active.length === 0) {
      active.push({ id: 'cards', name: 'DIRECT CREDIT CARD', type: 'card' });
    }

    return active;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        createOrder,
        updateOrderStatus,
        updateSettings,
        updateGateways,
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
