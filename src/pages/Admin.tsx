import React, { useState } from 'react';
import { useStore, Order, PaymentGatewaysConfig } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Product, Size } from '../types';
import { CATEGORIES } from '../data/categories';
import { COLLECTIONS } from '../data/collections';
import {
  Package,
  ShoppingBag,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  RefreshCcw,
  Check,
  X,
  TrendingUp,
  CreditCard,
  Eye,
  AlertTriangle,
  Lock,
  Upload,
  Image as ImageIcon,
  Key,
  Shield,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const {
    products,
    orders,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    updateOrderStatus,
    updateSettings,
    updateGateways,
  } = useStore();
  const { isAdminAuthenticated, adminLogin, adminLogout } = useAuth();
  const { showToast } = useUI();

  // Passcode gate state
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'gateways' | 'settings'>('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State for Add/Edit Product
  const [productForm, setProductForm] = useState<{
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    currency: string;
    images: string[];
    category: string;
    categorySlug: string;
    collection: string;
    collectionSlug: string;
    sizes: Size[];
    colors: { name: string; hex: string }[];
    badge?: 'BEST SELLER' | 'NEW DROP' | 'ARCHIVE' | 'SPECIAL EDITION' | 'RUNWAY';
    tagline?: string;
    description: string;
    details: string;
    care: string;
    stock: number;
  }>({
    name: '',
    slug: '',
    price: 340,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'],
    category: 'Dresses',
    categorySlug: 'dresses',
    collection: 'Life Force',
    collectionSlug: 'life-force',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Pitch Noir', hex: '#0B0B0B' }],
    badge: 'NEW DROP',
    tagline: 'Architectural silhouette engineered in Berlin',
    description: 'Sculptural European luxury garment constructed from high-twist organic deadstock textiles.',
    details: '100% Virgin Wool\nInternal boning\nMade in Berlin',
    care: 'Dry clean only\nStore on wide padded hanger',
    stock: 8,
  });

  // Manual URL input helper for product form
  const [singleImageUrlInput, setSingleImageUrlInput] = useState('');

  // Gateways form state
  const [gatewaysForm, setGatewaysForm] = useState<PaymentGatewaysConfig>(settings.gateways);

  // General settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Financial Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 4);

  // Security Gate Authentication
  if (!isAdminAuthenticated) {
    const handlePasscodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = adminLogin(passcode);
      if (success) {
        setPasscodeError(false);
        showToast({
          type: 'success',
          title: 'ACCESS GRANTED',
          message: 'Atelier Management Suite unlocked.',
        });
      } else {
        setPasscodeError(true);
      }
    };

    return (
      <div className="min-h-screen bg-background pt-36 pb-24 flex items-center justify-center px-4 text-foreground select-none transition-colors duration-300">
        <div className="w-full max-w-md p-8 md:p-10 bg-surface border border-border space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mx-auto text-foreground">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block">
              RESTRICTED ATELIER PORTAL
            </span>
            <h1 className="text-2xl font-light font-display tracking-widest uppercase text-foreground">
              SECURITY ACCESS
            </h1>
            <p className="text-xs font-mono text-muted">
              Enter the master atelier security passcode to manage inventory, customer dispatches, and payment credentials.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                MASTER PASSCODE
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="ENTER PASSCODE (E.G. ATELIER2026)"
                className="w-full bg-background border border-border p-3.5 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
              />
            </div>

            {passcodeError && (
              <p className="text-xs font-mono text-red-500">
                ACCESS DENIED. DEFAULT PASSCODE: 'ATELIER2026'
              </p>
            )}

            <button
              type="submit"
              data-cursor="link"
              className="w-full py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
            >
              UNLOCK ATELIER SUITE
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs font-mono text-muted hover:text-foreground underline uppercase">
              RETURN TO PUBLIC STOREFRONT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // File Upload Handler (Converts uploaded image to high-res Base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
          showToast({
            type: 'info',
            title: 'IMAGE UPLOADED',
            message: `${file.name} attached to gallery.`,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!singleImageUrlInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, singleImageUrlInput.trim()],
    }));
    setSingleImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      slug: '',
      price: 380,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'],
      category: 'Dresses',
      categorySlug: 'dresses',
      collection: 'Life Force',
      collectionSlug: 'life-force',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Pitch Noir', hex: '#0B0B0B' }],
      badge: 'NEW DROP',
      tagline: 'Sculptural drapery with asymmetrical silhouette',
      description: 'Handcrafted in Berlin Atelier with Italian deadstock fabrics.',
      details: 'Built-in structural stays\nRaw hem finish\nItalian viscose crepe',
      care: 'Specialist dry clean only\nDo not tumble dry',
      stock: 6,
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      currency: p.currency,
      images: p.images,
      category: p.category,
      categorySlug: p.categorySlug,
      collection: p.collection,
      collectionSlug: p.collectionSlug,
      sizes: p.sizes,
      colors: p.colors,
      badge: p.badge,
      tagline: p.tagline || '',
      description: p.description,
      details: p.details.join('\n'),
      care: p.care.join('\n'),
      stock: p.stock,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.images.length === 0) {
      showToast({ type: 'error', title: 'NO IMAGES', message: 'Attach at least one product photo.' });
      return;
    }

    const detailsArray = productForm.details.split('\n').map((s) => s.trim()).filter(Boolean);
    const careArray = productForm.care.split('\n').map((s) => s.trim()).filter(Boolean);
    const generatedSlug = productForm.slug.trim() || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        slug: generatedSlug,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
        images: productForm.images,
        category: productForm.category,
        categorySlug: productForm.categorySlug,
        collection: productForm.collection,
        collectionSlug: productForm.collectionSlug,
        sizes: productForm.sizes,
        colors: productForm.colors,
        badge: productForm.badge,
        tagline: productForm.tagline,
        description: productForm.description,
        details: detailsArray,
        care: careArray,
        stock: Number(productForm.stock),
      });
      showToast({
        type: 'success',
        title: 'GARMENT COMMITTED',
        message: `${productForm.name} updated across storefront.`,
      });
    } else {
      addProduct({
        name: productForm.name,
        slug: generatedSlug,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
        currency: 'EUR',
        images: productForm.images,
        category: productForm.category,
        categorySlug: productForm.categorySlug,
        collection: productForm.collection,
        collectionSlug: productForm.collectionSlug,
        sizes: productForm.sizes,
        colors: productForm.colors,
        badge: productForm.badge,
        tagline: productForm.tagline,
        description: productForm.description,
        details: detailsArray,
        care: careArray,
        stock: Number(productForm.stock),
        isFeatured: true,
        isNewArrival: true,
      });
      showToast({
        type: 'success',
        title: 'NEW GARMENT PUBLISHED',
        message: `${productForm.name} is now live across the storefront.`,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove "${name}" permanently from the archive?`)) {
      deleteProduct(id);
      showToast({
        type: 'info',
        title: 'GARMENT REMOVED',
        message: `${name} has been erased from catalog.`,
      });
    }
  };

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updateGateways(gatewaysForm);
    showToast({
      type: 'success',
      title: 'PAYMENT GATEWAYS SAVED',
      message: 'Active checkout credentials updated. Empty gateways will be hidden.',
    });
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast({
      type: 'success',
      title: 'PARAMETERS SAVED',
      message: 'Storefront parameters committed.',
    });
  };

  const allSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'ONE SIZE'];

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Top Portal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-border gap-4">
          <div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-1.5">
              <span>ADMINISTRATIVE PORTAL</span>
              <span>•</span>
              <span className="text-emerald-400">AUTHORIZED SESSION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
              ATELIER MANAGEMENT SUITE
            </h1>
          </div>

          {/* Top Actions & Logout */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openAddModal}
              data-cursor="link"
              className="px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center space-x-2 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW GARMENT</span>
            </button>

            <Link
              to="/shop"
              data-cursor="link"
              className="px-5 py-2.5 border border-border hover:border-foreground text-foreground font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>STOREFRONT</span>
            </Link>

            <button
              onClick={adminLogout}
              data-cursor="link"
              className="p-2.5 border border-border hover:border-red-400 text-muted hover:text-red-400 transition-colors"
              title="Lock Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>OVERVIEW</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>GARMENTS ARCHIVE [{products.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 ${
              activeTab === 'orders'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>CUSTOMER ORDERS [{orders.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 ${
              activeTab === 'gateways'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>PAYMENT GATEWAYS & APIS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 ${
              activeTab === 'settings'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>STOREFRONT PARAMETERS</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  TOTAL REVENUE PROCESSED
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-foreground font-light">
                  €{totalRevenue.toFixed(2)}
                </div>
                <span className="text-[10px] text-emerald-400">
                  {orders.length} TOTAL CUSTOMER ORDERS
                </span>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  GARMENTS IN REPERTORY
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-foreground font-light">
                  {products.length}
                </div>
                <span className="text-[10px] text-muted">
                  ACROSS {CATEGORIES.length} CATEGORIES
                </span>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  AVERAGE ORDER VALUE
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-foreground font-light">
                  €{averageOrderValue.toFixed(2)}
                </div>
                <span className="text-[10px] text-muted">
                  {totalUnitsSold} UNITS DISPATCHED
                </span>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  LOW STOCK ALERTS (&le; 4)
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-amber-500 font-light">
                  {lowStockProducts.length} PIECES
                </div>
                <span className="text-[10px] text-amber-500/80">
                  REQUIRES ATELIER RUNWAY PRODUCTION
                </span>
              </div>
            </div>

            {/* Low Stock Watchlist */}
            {lowStockProducts.length > 0 && (
              <div className="p-6 bg-surface border border-amber-500/30 space-y-4">
                <div className="flex items-center space-x-2 text-amber-500 text-xs font-mono uppercase tracking-widest font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>URGENT INVENTORY REORDER WATCHLIST</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-background border border-border flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-foreground block truncate font-medium">{p.name}</span>
                        <span className="text-[10px] text-muted">{p.category}</span>
                      </div>
                      <span className="px-2 py-1 bg-amber-950 text-amber-300 font-semibold flex-shrink-0 text-[11px]">
                        {p.stock} LEFT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Factory Reset Tool */}
            <div className="p-6 bg-surface border border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-foreground font-medium uppercase block">CATALOG RESTORATION</span>
                <span className="text-muted">Revert all live products back to default factory atelier catalog.</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Reset catalog to original atelier garments? Custom additions will be cleared.')) {
                    resetProductsToDefault();
                    showToast({ type: 'info', title: 'CATALOG RESET', message: 'Restored default archive.' });
                  }
                }}
                data-cursor="link"
                className="px-4 py-2 border border-border hover:border-red-400 text-muted hover:text-red-400 uppercase tracking-widest transition-colors flex items-center space-x-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>RESTORE FACTORY ARCHIVE</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-mono text-muted uppercase tracking-widest">
                DISPLAYING {products.length} PRODUCTS IN ACTIVE REPERTORY
              </span>

              <button
                onClick={openAddModal}
                data-cursor="link"
                className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center space-x-1.5 font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>ADD GARMENT</span>
              </button>
            </div>

            <div className="border border-border overflow-x-auto bg-surface">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle text-muted">
                    <th className="p-3.5">IMAGE</th>
                    <th className="p-3.5">GARMENT NAME</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">COLLECTION</th>
                    <th className="p-3.5">PRICE</th>
                    <th className="p-3.5">STOCK</th>
                    <th className="p-3.5">BADGE</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground-secondary">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="p-3.5">
                        <div className="w-12 h-16 bg-background overflow-hidden border border-border">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        <Link to={`/product/${prod.slug}`} className="hover:underline">
                          {prod.name}
                        </Link>
                        <span className="text-[10px] text-muted block font-light">
                          {prod.sizes.join(', ')}
                        </span>
                      </td>
                      <td className="p-3.5 uppercase">{prod.category}</td>
                      <td className="p-3.5 uppercase">{prod.collection}</td>
                      <td className="p-3.5 text-foreground font-semibold">€{prod.price.toFixed(2)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] ${
                          prod.stock <= 4 ? 'bg-red-950 text-red-300' : 'bg-surface-elevated text-foreground'
                        }`}>
                          {prod.stock} UNITS
                        </span>
                      </td>
                      <td className="p-3.5">
                        {prod.badge ? (
                          <span className="text-[9px] px-1.5 py-0.5 border border-border bg-background text-foreground uppercase">
                            {prod.badge}
                          </span>
                        ) : (
                          <span className="text-muted">──</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            data-cursor="link"
                            className="p-1.5 border border-border hover:border-foreground text-muted hover:text-foreground transition-colors"
                            title="Edit Garment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            data-cursor="link"
                            className="p-1.5 border border-border hover:border-red-400 text-muted hover:text-red-400 transition-colors"
                            title="Delete Garment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <span className="text-xs font-mono text-muted uppercase tracking-widest block">
              TOTAL ORDERS RECEIVED: {orders.length}
            </span>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-6 bg-surface border border-border space-y-4 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-3">
                    <div>
                      <span className="text-sm font-semibold uppercase text-foreground">
                        ORDER #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-muted ml-3">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-muted">STATUS:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                        className="bg-background border border-border px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-foreground uppercase"
                      >
                        <option value="pending">PENDING</option>
                        <option value="preparing">ATELIER PREPARING</option>
                        <option value="dispatched">DISPATCHED (EN ROUTE)</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>

                      <Link
                        to={`/orders/${ord.id}`}
                        data-cursor="link"
                        className="px-3 py-1.5 bg-foreground text-background font-semibold hover:opacity-90 uppercase"
                      >
                        VIEW SLIP
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1 text-foreground-secondary">
                      <span className="text-foreground font-semibold uppercase block">CLIENT & DESTINATION</span>
                      <div>{ord.customer.firstName} {ord.customer.lastName}</div>
                      <div>{ord.customer.address} {ord.customer.apartment && `(${ord.customer.apartment})`}</div>
                      <div>{ord.customer.postalCode} {ord.customer.city}, {ord.customer.country}</div>
                      <div>EMAIL: {ord.customer.email} • PHONE: {ord.customer.phone}</div>
                      <div className="pt-1 text-[11px] text-foreground font-semibold">
                        TRACKING: {ord.trackingNumber} ({ord.shippingMethod.carrier})
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-foreground font-semibold uppercase block">ORDERED ITEMS & TOTAL</span>
                      <div className="space-y-1 text-foreground-secondary">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{it.quantity}x {it.productName} ({it.size})</span>
                            <span className="text-foreground font-medium">€{(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between font-semibold text-foreground">
                        <span>TOTAL ACQUIRED:</span>
                        <span>€{ord.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT GATEWAYS CONFIGURATION */}
        {activeTab === 'gateways' && (
          <form onSubmit={handleSaveGateways} className="space-y-8 max-w-4xl bg-surface border border-border p-6 md:p-10 text-xs font-mono">
            <div className="pb-4 border-b border-border">
              <span className="text-[10px] font-mono tracking-widest text-muted uppercase block mb-1">
                API CREDENTIALS & VISIBILITY
              </span>
              <h2 className="text-lg font-light font-display uppercase tracking-widest text-foreground">
                PAYMENT GATEWAYS CONFIGURATION
              </h2>
              <p className="text-xs text-muted font-normal mt-1 leading-relaxed">
                Configure your payment gateway merchant API keys below. <strong className="text-foreground">Rule:</strong> If any gateway is left empty or unchecked, it will automatically be hidden from the customer checkout front-end.
              </p>
            </div>

            {/* 1. STRIPE */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold uppercase text-foreground">01 / STRIPE</span>
                  <span className="text-[10px] text-muted">(Credit/Debit Cards, Apple Pay, Google Pay)</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.stripe.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, stripe: { ...p.stripe, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.stripe.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">PUBLISHABLE KEY (PK_LIVE_...)</label>
                  <input
                    type="text"
                    value={gatewaysForm.stripe.publishableKey}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, stripe: { ...p.stripe, publishableKey: e.target.value } }))}
                    placeholder="pk_live_..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">SECRET KEY (SK_LIVE_...)</label>
                  <input
                    type="password"
                    value={gatewaysForm.stripe.secretKey}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, stripe: { ...p.stripe, secretKey: e.target.value } }))}
                    placeholder="sk_live_..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 2. PAYPAL */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-semibold uppercase text-foreground">02 / PAYPAL EXPRESS</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.paypal.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, paypal: { ...p.paypal, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.paypal.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">PAYPAL CLIENT ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.paypal.clientId}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, paypal: { ...p.paypal, clientId: e.target.value } }))}
                    placeholder="CLIENT_ID"
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">PAYPAL CLIENT SECRET</label>
                  <input
                    type="password"
                    value={gatewaysForm.paypal.clientSecret}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, paypal: { ...p.paypal, clientSecret: e.target.value } }))}
                    placeholder="SECRET"
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 3. DIRECT CREDIT / DEBIT CARDS */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-semibold uppercase text-foreground">03 / DIRECT MERCHANT CARDS</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.directCards.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, directCards: { ...p.directCards, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.directCards.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">MERCHANT ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.directCards.merchantId}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, directCards: { ...p.directCards, merchantId: e.target.value } }))}
                    placeholder="MCH-..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">GATEWAY KEY</label>
                  <input
                    type="password"
                    value={gatewaysForm.directCards.gatewayKey}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, directCards: { ...p.directCards, gatewayKey: e.target.value } }))}
                    placeholder="GW-KEY-..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 4. APPLE PAY */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-semibold uppercase text-foreground">04 / APPLE PAY</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.applePay.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, applePay: { ...p.applePay, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.applePay.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted uppercase">APPLE MERCHANT IDENTIFIER</label>
                <input
                  type="text"
                  value={gatewaysForm.applePay.merchantIdentifier}
                  onChange={(e) => setGatewaysForm((p) => ({ ...p, applePay: { ...p.applePay, merchantIdentifier: e.target.value } }))}
                  placeholder="merchant.com.yourdomain"
                  className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            {/* 5. GOOGLE PAY */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-semibold uppercase text-foreground">05 / GOOGLE PAY</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.googlePay.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, googlePay: { ...p.googlePay, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.googlePay.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">GOOGLE MERCHANT ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.googlePay.merchantId}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, googlePay: { ...p.googlePay, merchantId: e.target.value } }))}
                    placeholder="GPAY-MERCHANT-..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">GATEWAY ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.googlePay.gatewayId}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, googlePay: { ...p.googlePay, gatewayId: e.target.value } }))}
                    placeholder="gateway-id"
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 6. AMAZON PAY */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-semibold uppercase text-foreground">06 / AMAZON PAY</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.amazonPay.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, amazonPay: { ...p.amazonPay, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.amazonPay.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">AMAZON MERCHANT ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.amazonPay.merchantId}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, amazonPay: { ...p.amazonPay, merchantId: e.target.value } }))}
                    placeholder="AMZN-MERCHANT-..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">PUBLIC KEY ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.amazonPay.publicKeyId}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, amazonPay: { ...p.amazonPay, publicKeyId: e.target.value } }))}
                    placeholder="SANDBOX-OR-LIVE-KEY-ID"
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 7. BANK WIRE / SEPA */}
            <div className="p-6 bg-background border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-semibold uppercase text-foreground">07 / SEPA BANK WIRE</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gatewaysForm.bankWire.enabled}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, bankWire: { ...p.bankWire, enabled: e.target.checked } }))}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-xs uppercase">{gatewaysForm.bankWire.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">IBAN</label>
                  <input
                    type="text"
                    value={gatewaysForm.bankWire.iban}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, bankWire: { ...p.bankWire, iban: e.target.value } }))}
                    placeholder="DE89 ..."
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">BIC / SWIFT</label>
                  <input
                    type="text"
                    value={gatewaysForm.bankWire.bic}
                    onChange={(e) => setGatewaysForm((p) => ({ ...p, bankWire: { ...p.bankWire, bic: e.target.value } }))}
                    placeholder="DBEUTDDBXXX"
                    className="w-full bg-surface border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              data-cursor="link"
              className="px-8 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
            >
              SAVE PAYMENT GATEWAYS CONFIGURATION
            </button>
          </form>
        )}

        {/* TAB 5: STOREFRONT PARAMETERS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveGeneralSettings} className="max-w-3xl space-y-6 bg-surface border border-border p-8 text-xs font-mono">
            <h2 className="text-sm tracking-widest uppercase text-foreground pb-3 border-b border-border">
              STOREFRONT CONFIGURATION
            </h2>

            <div className="space-y-1.5">
              <label className="text-[10px] text-muted uppercase block">
                TOP ANNOUNCEMENT MARQUEE / TICKER TEXT
              </label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm((p) => ({ ...p, announcementText: e.target.value }))}
                className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted uppercase block">
                  FREE SHIPPING THRESHOLD (€)
                </label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, freeShippingThreshold: Number(e.target.value) }))}
                  className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-muted uppercase block">
                  DISCOUNT VOUCHER CODE
                </label>
                <input
                  type="text"
                  value={settingsForm.discountCode}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, discountCode: e.target.value.toUpperCase() }))}
                  className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-muted uppercase block">
                DISCOUNT PERCENTAGE (%)
              </label>
              <input
                type="number"
                value={settingsForm.discountPercentage}
                onChange={(e) => setSettingsForm((p) => ({ ...p, discountPercentage: Number(e.target.value) }))}
                className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <button
              type="submit"
              data-cursor="link"
              className="px-8 py-3.5 bg-foreground text-background uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
            >
              SAVE STORE PARAMETERS
            </button>
          </form>
        )}

        {/* MODAL: ADD / EDIT GARMENT WITH DIRECT IMAGE UPLOAD */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8">
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsProductModalOpen(false)}
            />

            <div className="relative w-full max-w-3xl bg-surface border border-border p-6 md:p-10 z-10 text-foreground max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-border">
                <h2 className="text-lg font-mono uppercase tracking-widest text-foreground font-semibold">
                  {editingProductId ? 'EDIT GARMENT ATTRIBUTES' : 'REGISTER NEW ATELIER PIECE'}
                </h2>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-muted hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">GARMENT NAME *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="E.G. DECONSTRUCTED CORSET TOP"
                      className="w-full bg-background border border-border p-3 text-foreground uppercase focus:outline-none focus:border-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">PRICE (€) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">CATEGORY</label>
                    <select
                      value={productForm.categorySlug}
                      onChange={(e) => {
                        const matchedCat = CATEGORIES.find((c) => c.slug === e.target.value);
                        setProductForm((p) => ({
                          ...p,
                          categorySlug: e.target.value,
                          category: matchedCat ? matchedCat.name : e.target.value,
                        }));
                      }}
                      className="w-full bg-background border border-border p-3 text-foreground uppercase focus:outline-none focus:border-foreground"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">COLLECTION</label>
                    <select
                      value={productForm.collectionSlug}
                      onChange={(e) => {
                        const matchedCol = COLLECTIONS.find((c) => c.slug === e.target.value);
                        setProductForm((p) => ({
                          ...p,
                          collectionSlug: e.target.value,
                          collection: matchedCol ? matchedCol.name : e.target.value,
                        }));
                      }}
                      className="w-full bg-background border border-border p-3 text-foreground uppercase focus:outline-none focus:border-foreground"
                    >
                      {COLLECTIONS.map((col) => (
                        <option key={col.slug} value={col.slug}>{col.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">STOCK IN ATELIER</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                      className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>

                {/* Direct File Image Upload & Gallery */}
                <div className="space-y-3 p-4 bg-background border border-border">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-foreground font-semibold uppercase block">
                      GARMENT PHOTOGRAPHY & GALLERY [{productForm.images.length} IMAGES]
                    </label>
                  </div>

                  {/* Drag and drop upload zone */}
                  <label className="border border-dashed border-border hover:border-foreground p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-surface-subtle">
                    <Upload className="w-5 h-5 text-muted mb-1" />
                    <span className="text-xs text-foreground font-medium uppercase">
                      UPLOAD IMAGE FILES FROM DEVICE
                    </span>
                    <span className="text-[10px] text-muted mt-0.5">
                      Accepts PNG, JPG, WEBP. Drag & Drop or Click.
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Manual URL entry */}
                  <div className="flex space-x-2 pt-2">
                    <input
                      type="url"
                      value={singleImageUrlInput}
                      onChange={(e) => setSingleImageUrlInput(e.target.value)}
                      placeholder="OR PASTE DIRECT IMAGE URL..."
                      className="flex-1 bg-surface border border-border px-3 py-2 text-[11px] text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-surface-elevated hover:bg-foreground hover:text-background border border-border text-xs uppercase"
                    >
                      ATTACH
                    </button>
                  </div>

                  {/* Image Previews List */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {productForm.images.map((img, i) => (
                      <div key={i} className="relative aspect-[3/4] bg-surface border border-border group overflow-hidden">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 p-1 bg-black/80 text-white hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges & Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">EDITORIAL BADGE</label>
                    <select
                      value={productForm.badge || ''}
                      onChange={(e) => setProductForm((p) => ({ ...p, badge: (e.target.value as any) || undefined }))}
                      className="w-full bg-background border border-border p-3 text-foreground uppercase focus:outline-none focus:border-foreground"
                    >
                      <option value="">NONE</option>
                      <option value="BEST SELLER">BEST SELLER</option>
                      <option value="NEW DROP">NEW DROP</option>
                      <option value="RUNWAY">RUNWAY</option>
                      <option value="SPECIAL EDITION">SPECIAL EDITION</option>
                      <option value="ARCHIVE">ARCHIVE</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase block">SIZES OFFERED</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {allSizes.map((sz) => {
                        const isIncluded = productForm.sizes.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              setProductForm((p) => ({
                                ...p,
                                sizes: isIncluded ? p.sizes.filter((s) => s !== sz) : [...p.sizes, sz],
                              }));
                            }}
                            className={`px-2.5 py-1 text-[11px] border ${
                              isIncluded ? 'bg-foreground text-background font-bold border-foreground' : 'border-border text-muted hover:border-foreground'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Description & Details */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase block">EDITORIAL DESCRIPTION *</label>
                  <textarea
                    rows={2}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-6 py-3 border border-border hover:border-foreground text-foreground uppercase tracking-widest"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    data-cursor="link"
                    className="px-6 py-3 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90"
                  >
                    COMMIT TO REPERTORY
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
