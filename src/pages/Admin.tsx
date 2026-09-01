import React, { useState, useEffect } from 'react';
import { useStore, Order, PaymentGatewaysConfig, HeroSettings, DEFAULT_HERO } from '../context/StoreContext';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Product, Size, Category } from '../types';
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
  ArrowUpRight,
  LogOut,
  Users,
  Layout,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const {
    products,
    orders,
    categories,
    hero,
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
    updateCustomer,
    deleteCustomer,
    updateOrderStatus,
    updateSettings,
    updateGateways,
  } = useStore();
  const { isAdminAuthenticated, adminLogin, adminLogout } = useAuth();
  const { showToast } = useUI();

  // Passcode gate state
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'hero' | 'orders' | 'customers' | 'gateways' | 'settings'
  >('overview');

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
    colors: [{ name: 'Obsidian Noir', hex: '#0A0A0A' }],
    badge: 'NEW DROP',
    tagline: 'Handcrafted architectural evening piece with structural bias cut',
    description: 'Sculptural silhouette engineered in Berlin from heavy Italian deadstock silk viscose.',
    details: 'Raw architectural hem\nConcealed side zipper\nStructured internal bodice',
    care: 'Dry clean only by luxury garment specialist\nStore in breathable garment bag',
    stock: 8,
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    count: 10,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    description: '',
    editorialQuote: '',
  });

  // Hero Form State
  const [heroForm, setHeroForm] = useState<HeroSettings>(hero || DEFAULT_HERO);

  // Sync heroForm whenever hero changes in store
  useEffect(() => {
    if (hero) setHeroForm(hero);
  }, [hero]);

  // Customer search filter
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Gateways form state
  const [gatewaysForm, setGatewaysForm] = useState<PaymentGatewaysConfig>(settings.gateways);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    announcementText: settings.announcementText,
    freeShippingThreshold: settings.freeShippingThreshold,
    storeName: settings.storeName || 'ATELIER ECOVANTO',
    discountCode: settings.discountCode,
    discountPercentage: settings.discountPercentage,
    googleClientId: settings.googleClientId || '',
    facebookPixelId: settings.facebookPixelId || '',
  });

  // Temporary Image URL Input
  const [tempImageUrl, setTempImageUrl] = useState('');

  // File Upload Helper to convert local images to Base64 data URLs
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category' | 'hero') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'product') {
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }));
        } else if (target === 'category') {
          setCategoryForm((prev) => ({
            ...prev,
            image: result,
          }));
        } else if (target === 'hero') {
          setHeroForm((prev) => ({
            ...prev,
            imageUrl: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
    showToast({
      type: 'success',
      title: 'FILE UPLOADED',
      message: 'Image encoded and attached.',
    });
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passcode)) {
      setPasscodeError(false);
      showToast({ type: 'success', title: 'ACCESS GRANTED', message: 'Welcome to Atelier Management Suite.' });
    } else {
      setPasscodeError(true);
      showToast({ type: 'error', title: 'PASSCODE REJECTED', message: 'Try "ATELIER2026".' });
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      slug: '',
      price: 380,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'],
      category: categories[0]?.name || 'Dresses',
      categorySlug: categories[0]?.slug || 'dresses',
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
      showToast({ type: 'success', title: 'PRODUCT UPDATED', message: `Garment "${productForm.name}" updated.` });
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
      });
      showToast({ type: 'success', title: 'PRODUCT ARCHIVED', message: `New piece "${productForm.name}" added to catalog.` });
    }
    setIsProductModalOpen(false);
  };

  // Category Save Handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = categoryForm.slug.trim() || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: categoryForm.name,
        slug,
        count: Number(categoryForm.count),
        image: categoryForm.image,
        description: categoryForm.description,
        editorialQuote: categoryForm.editorialQuote,
      });
      showToast({ type: 'success', title: 'CATEGORY UPDATED', message: `Category "${categoryForm.name}" updated.` });
    } else {
      addCategory({
        name: categoryForm.name,
        slug,
        count: Number(categoryForm.count),
        image: categoryForm.image,
        description: categoryForm.description,
        editorialQuote: categoryForm.editorialQuote,
      });
      showToast({ type: 'success', title: 'CATEGORY CREATED', message: `Category "${categoryForm.name}" added.` });
    }
    setIsCategoryModalOpen(false);
  };

  const openAddCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      name: '',
      slug: '',
      count: 6,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      description: 'New architectural tailoring section.',
      editorialQuote: 'Form follows friction.',
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (c: Category) => {
    setEditingCategoryId(c.id);
    setCategoryForm({
      name: c.name,
      slug: c.slug,
      count: c.count,
      image: c.image,
      description: c.description,
      editorialQuote: c.editorialQuote || '',
    });
    setIsCategoryModalOpen(true);
  };

  // Hero Save Handler
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    showToast({
      type: 'success',
      title: 'HERO SECTION SAVED',
      message: 'Storefront hero headline, image, and links updated.',
    });
  };

  // Gateway Save Handler
  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updateGateways(gatewaysForm);
    showToast({
      type: 'success',
      title: 'GATEWAYS RECONFIGURED',
      message: 'Live checkout payment APIs updated.',
    });
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast({
      type: 'success',
      title: 'PARAMETERS SAVED',
      message: 'Store parameters and tracking IDs saved.',
    });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.firstName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearchQuery))
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // PASSCODE LOCK SCREEN
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background pt-36 pb-24 flex items-center justify-center px-4 text-foreground select-none">
        <div className="w-full max-w-md bg-surface border border-border p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
              CONFIDENTIAL PORTAL
            </span>
            <h1 className="text-2xl font-light font-display tracking-widest uppercase text-foreground">
              ATELIER HOST SUITE
            </h1>
            <p className="text-xs font-mono text-muted">
              Enter host passcode to access products, categories, orders, customers, and payment credentials.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                SECURITY PASSCODE
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="ATELIER2026"
                className={`w-full bg-background border ${
                  passcodeError ? 'border-red-500' : 'border-border'
                } p-3.5 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground`}
              />
            </div>

            <button
              type="submit"
              data-cursor="link"
              className="w-full py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
            >
              UNLOCK ATELIER SUITE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Top Portal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-border gap-4">
          <div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-1.5">
              <span>PRIVATE HOST PORTAL</span>
              <span>•</span>
              <span className="text-emerald-400">AUTHORIZED SESSION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
              ATELIER MANAGEMENT SUITE
            </h1>
          </div>

          {/* Top Actions & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              data-cursor="link"
              className="px-4 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center space-x-2 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>+ GARMENT</span>
            </button>

            <Link
              to="/"
              data-cursor="link"
              className="px-4 py-2.5 border border-border hover:border-foreground text-foreground font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>STOREFRONT</span>
            </Link>

            <button
              onClick={adminLogout}
              data-cursor="link"
              className="p-2.5 border border-border hover:border-red-400 text-muted hover:text-red-400 transition-colors"
              title="Lock Host Portal"
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
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
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
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>GARMENTS [{products.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CATEGORIES [{categories.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'hero'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>HERO SECTION</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ORDERS [{orders.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>CLIENT CRM [{customers.length}]</span>
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'gateways'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>PAYMENT GATEWAYS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            data-cursor="link"
            className={`px-4 py-2 uppercase tracking-widest border transition-colors flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'text-muted border-border hover:border-foreground'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>STORE & PIXEL</span>
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
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  TOTAL DISPATCHES LOGGED
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-foreground font-light">
                  {orders.length} ORDERS
                </div>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  ARCHIVAL GARMENTS IN CATALOG
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-foreground font-light">
                  {products.length} PIECES
                </div>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest block">
                  REGISTERED ATELIER CLIENTS
                </span>
                <div className="text-2xl sm:text-3xl font-mono text-foreground font-light">
                  {customers.length} CLIENTS
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 bg-surface border border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div>
                <h3 className="font-semibold uppercase tracking-widest text-foreground">
                  QUICK ATELIER ACTIONS
                </h3>
                <p className="text-muted text-[11px] mt-1">
                  Manage categories, customize hero banner, view customer orders, and configure Facebook Pixel.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('hero')}
                  className="px-4 py-2 bg-foreground text-background font-semibold uppercase tracking-widest"
                >
                  CUSTOMIZE HERO ↗
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-4 py-2 border border-border text-foreground hover:border-foreground uppercase tracking-widest"
                >
                  MANAGE CATEGORIES ↗
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GARMENTS ARCHIVE (PRODUCTS) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                CATALOG GARMENTS [{products.length}]
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetProductsToDefault}
                  data-cursor="link"
                  className="px-4 py-2 border border-border hover:border-red-400 text-muted hover:text-red-400 font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-2"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>RESET TO FACTORY DROP</span>
                </button>
                <button
                  onClick={openAddModal}
                  data-cursor="link"
                  className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 font-semibold flex items-center space-x-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ NEW PIECE</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-subtle text-muted uppercase tracking-widest border-b border-border">
                  <tr>
                    <th className="p-4">IMAGE</th>
                    <th className="p-4">NAME & SLUG</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">PRICE</th>
                    <th className="p-4">STOCK</th>
                    <th className="p-4">BADGE</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-surface transition-colors">
                      <td className="p-4">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-16 object-cover border border-border bg-background"
                        />
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-muted font-normal">/{p.slug}</div>
                      </td>
                      <td className="p-4 text-muted">{p.category}</td>
                      <td className="p-4 font-semibold text-foreground">€{p.price.toFixed(2)}</td>
                      <td className="p-4">{p.stock} units</td>
                      <td className="p-4">
                        {p.badge ? (
                          <span className="text-[9px] px-2 py-0.5 bg-surface-subtle text-foreground uppercase border border-border">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-muted hover:text-foreground border border-border hover:border-foreground"
                          title="Edit Piece"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                          }}
                          className="p-2 text-muted hover:text-red-400 border border-border hover:border-red-400"
                          title="Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES CUSTOMIZATION */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                  TAXONOMY & CATEGORIES DIRECTORY [{categories.length}]
                </h2>
                <p className="text-xs text-muted mt-1">
                  Add, edit, upload cover images, and configure curated sections shown across the shop.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={resetCategoriesToDefault}
                  className="px-4 py-2 border border-border text-muted hover:text-red-400 hover:border-red-400 text-xs font-mono uppercase tracking-widest"
                >
                  RESET FACTORY CATEGORIES
                </button>
                <button
                  onClick={openAddCategoryModal}
                  className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 font-semibold flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ NEW CATEGORY</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-surface border border-border flex flex-col justify-between overflow-hidden group"
                >
                  <div className="aspect-[16/9] bg-background relative overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/90 text-foreground font-mono text-[9px] uppercase border border-border">
                      [{c.count} ITEMS]
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between text-xs font-mono">
                    <div>
                      <h3 className="font-semibold text-foreground uppercase tracking-wider text-sm">
                        {c.name}
                      </h3>
                      <div className="text-muted text-[11px]">Slug: /{c.slug}</div>
                      <p className="text-foreground-secondary text-[11px] mt-2 line-clamp-2">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Link
                        to={`/categories/${c.slug}`}
                        className="text-xs text-muted hover:text-foreground underline flex items-center space-x-1"
                      >
                        <span>VIEW ON SITE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditCategoryModal(c)}
                          className="p-1.5 border border-border hover:border-foreground text-muted hover:text-foreground"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete category "${c.name}"?`)) deleteCategory(c.id);
                          }}
                          className="p-1.5 border border-border hover:border-red-400 text-muted hover:text-red-400"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HERO SECTION CUSTOMIZER */}
        {activeTab === 'hero' && (
          <div className="space-y-8 max-w-4xl">
            <div className="pb-4 border-b border-border">
              <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                HOME HERO SECTION & BILLBOARD CUSTOMIZER
              </h2>
              <p className="text-xs text-muted mt-1">
                Customize the editorial headline, kicker metadata, description, buttons, and background imagery.
              </p>
            </div>

            <form onSubmit={handleSaveHero} className="p-6 md:p-8 bg-surface border border-border space-y-6 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase tracking-widest">
                    SEASON KICKER METADATA
                  </label>
                  <input
                    type="text"
                    value={heroForm.seasonKicker}
                    onChange={(e) => setHeroForm((p) => ({ ...p, seasonKicker: e.target.value }))}
                    className="w-full bg-background border border-border p-3 text-foreground"
                    placeholder="COLLECTION 2026 // RELEASE 04"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase tracking-widest">
                    LOCATION / COORDINATES
                  </label>
                  <input
                    type="text"
                    value={heroForm.kickerSubtitle}
                    onChange={(e) => setHeroForm((p) => ({ ...p, kickerSubtitle: e.target.value }))}
                    className="w-full bg-background border border-border p-3 text-foreground"
                    placeholder="BERLIN // 52.5200° N, 13.4050° E"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-muted uppercase tracking-widest">
                  EDITORIAL SUBHEADING
                </label>
                <input
                  type="text"
                  value={heroForm.subheading}
                  onChange={(e) => setHeroForm((p) => ({ ...p, subheading: e.target.value }))}
                  className="w-full bg-background border border-border p-3 text-foreground"
                  placeholder="WHERE ARCHITECTURAL RIGOR MEETS RAW SENSUALITY"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase tracking-widest">
                    MAIN HEADLINE (PREFIX)
                  </label>
                  <input
                    type="text"
                    value={heroForm.headingPrefix}
                    onChange={(e) => setHeroForm((p) => ({ ...p, headingPrefix: e.target.value }))}
                    className="w-full bg-background border border-border p-3 text-foreground"
                    placeholder="LIFE"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase tracking-widest">
                    MAIN HEADLINE (ITALIC HIGHLIGHT)
                  </label>
                  <input
                    type="text"
                    value={heroForm.headingHighlight}
                    onChange={(e) => setHeroForm((p) => ({ ...p, headingHighlight: e.target.value }))}
                    className="w-full bg-background border border-border p-3 text-foreground"
                    placeholder="FORCE"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-muted uppercase tracking-widest">
                  EDITORIAL HERO DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-background border border-border p-3 text-foreground"
                />
              </div>

              {/* Image Input & Upload */}
              <div className="space-y-2">
                <label className="text-[10px] text-muted uppercase tracking-widest block">
                  HERO BACKGROUND IMAGE (URL OR DIRECT UPLOAD)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={heroForm.imageUrl}
                    onChange={(e) => setHeroForm((p) => ({ ...p, imageUrl: e.target.value }))}
                    className="flex-1 bg-background border border-border p-3 text-foreground"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <label className="px-4 py-3 bg-surface border border-border hover:border-foreground text-foreground flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>UPLOAD FILE</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'hero')}
                    />
                  </label>
                </div>
                {heroForm.imageUrl && (
                  <div className="aspect-[21/9] max-h-48 border border-border overflow-hidden bg-background mt-2">
                    <img
                      src={heroForm.imageUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase tracking-widest">
                    PRIMARY BUTTON TEXT & LINK
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={heroForm.primaryButtonText}
                      onChange={(e) => setHeroForm((p) => ({ ...p, primaryButtonText: e.target.value }))}
                      className="bg-background border border-border p-3 text-foreground"
                      placeholder="SEE COLLECTION"
                    />
                    <input
                      type="text"
                      value={heroForm.primaryButtonLink}
                      onChange={(e) => setHeroForm((p) => ({ ...p, primaryButtonLink: e.target.value }))}
                      className="bg-background border border-border p-3 text-foreground"
                      placeholder="/shop"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase tracking-widest">
                    SECONDARY BUTTON TEXT & LINK
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={heroForm.secondaryButtonText}
                      onChange={(e) => setHeroForm((p) => ({ ...p, secondaryButtonText: e.target.value }))}
                      className="bg-background border border-border p-3 text-foreground"
                      placeholder="BE YOURSELF"
                    />
                    <input
                      type="text"
                      value={heroForm.secondaryButtonLink}
                      onChange={(e) => setHeroForm((p) => ({ ...p, secondaryButtonLink: e.target.value }))}
                      className="bg-background border border-border p-3 text-foreground"
                      placeholder="/campaign"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90"
              >
                SAVE & PUBLISH HERO
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: ORDERS LOG */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                DISPATCH & ACQUISITION LOG [{orders.length}]
              </h2>
            </div>

            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-subtle text-muted uppercase tracking-widest border-b border-border">
                  <tr>
                    <th className="p-4">ORDER #</th>
                    <th className="p-4">CLIENT</th>
                    <th className="p-4">ITEMS</th>
                    <th className="p-4">TOTAL</th>
                    <th className="p-4">PAYMENT</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-surface transition-colors">
                      <td className="p-4 font-semibold text-foreground">
                        <div>#{o.orderNumber}</div>
                        <div className="text-[10px] text-muted font-normal">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">
                          {o.customer.firstName} {o.customer.lastName}
                        </div>
                        <div className="text-[10px] text-muted">{o.customer.email}</div>
                      </td>
                      <td className="p-4 text-muted">{o.items.length} items</td>
                      <td className="p-4 font-semibold text-foreground">€{o.total.toFixed(2)}</td>
                      <td className="p-4 text-muted">{o.paymentMethod}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="bg-background border border-border p-1.5 text-xs text-foreground uppercase"
                        >
                          <option value="pending">PENDING</option>
                          <option value="processing">PROCESSING</option>
                          <option value="dispatched">DISPATCHED</option>
                          <option value="delivered">DELIVERED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/orders/${o.id}`}
                          className="px-3 py-1.5 border border-border hover:border-foreground text-foreground uppercase inline-block"
                        >
                          INSPECT
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMER CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                  REGISTERED ATELIER CLIENTS & CRM [{customers.length}]
                </h2>
                <p className="text-xs text-muted mt-1">
                  Manage accounts, review delivery coordinates, and examine order history per client.
                </p>
              </div>

              <input
                type="text"
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                placeholder="SEARCH CLIENTS BY NAME, EMAIL, PHONE..."
                className="w-full sm:w-80 bg-surface border border-border p-2.5 text-xs font-mono text-foreground placeholder-muted"
              />
            </div>

            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-subtle text-muted uppercase tracking-widest border-b border-border">
                  <tr>
                    <th className="p-4">CLIENT NAME</th>
                    <th className="p-4">EMAIL</th>
                    <th className="p-4">PHONE</th>
                    <th className="p-4">REGISTRATION DATE</th>
                    <th className="p-4">SAVED ADDRESSES</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted uppercase">
                        NO CLIENT PROFILES MATCHING SEARCH QUERY
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-surface transition-colors">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center space-x-2">
                            <span>{c.firstName} {c.lastName}</span>
                            {c.isGmailAuth && (
                              <span className="text-[8px] px-1 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800">
                                GOOGLE
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-muted">{c.email}</td>
                        <td className="p-4 text-muted">{c.phone || '—'}</td>
                        <td className="p-4 text-muted">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-4 text-muted">
                          {(c.addresses || []).length > 0 ? (
                            <span>{c.addresses![0].address}, {c.addresses![0].city}</span>
                          ) : (
                            <span>No address saved</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete client record for ${c.email}?`)) {
                                deleteCustomer(c.id);
                                showToast({ type: 'success', title: 'CLIENT REMOVED', message: 'Client profile deleted.' });
                              }
                            }}
                            className="p-1.5 border border-border hover:border-red-400 text-muted hover:text-red-400"
                            title="Delete Client Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENT GATEWAYS CONFIG */}
        {activeTab === 'gateways' && (
          <form onSubmit={handleSaveGateways} className="space-y-8 max-w-4xl font-mono text-xs">
            <div className="pb-4 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                  PAYMENT GATEWAYS CREDENTIALS & APIS
                </h2>
                <p className="text-xs text-muted mt-1">
                  Configure live production keys. Leaving a credential blank automatically hides that gateway from the customer checkout.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90"
              >
                SAVE API CREDENTIALS
              </button>
            </div>

            {/* STRIPE */}
            <div className="p-6 bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground uppercase tracking-wider text-sm flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>STRIPE VAULT (CARDS)</span>
                </span>
                <input
                  type="checkbox"
                  checked={gatewaysForm.stripe.enabled}
                  onChange={(e) =>
                    setGatewaysForm((p) => ({ ...p, stripe: { ...p.stripe, enabled: e.target.checked } }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">STRIPE PUBLISHABLE KEY</label>
                  <input
                    type="text"
                    value={gatewaysForm.stripe.publishableKey}
                    onChange={(e) =>
                      setGatewaysForm((p) => ({
                        ...p,
                        stripe: { ...p.stripe, publishableKey: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                    placeholder="pk_live_..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">STRIPE SECRET KEY</label>
                  <input
                    type="password"
                    value={gatewaysForm.stripe.secretKey}
                    onChange={(e) =>
                      setGatewaysForm((p) => ({
                        ...p,
                        stripe: { ...p.stripe, secretKey: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                    placeholder="sk_live_..."
                  />
                </div>
              </div>
            </div>

            {/* PAYPAL */}
            <div className="p-6 bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground uppercase tracking-wider text-sm">
                  PAYPAL COMMERCE
                </span>
                <input
                  type="checkbox"
                  checked={gatewaysForm.paypal.enabled}
                  onChange={(e) =>
                    setGatewaysForm((p) => ({ ...p, paypal: { ...p.paypal, enabled: e.target.checked } }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">PAYPAL CLIENT ID</label>
                  <input
                    type="text"
                    value={gatewaysForm.paypal.clientId}
                    onChange={(e) =>
                      setGatewaysForm((p) => ({
                        ...p,
                        paypal: { ...p.paypal, clientId: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                    placeholder="AYv..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">PAYPAL CLIENT SECRET</label>
                  <input
                    type="password"
                    value={gatewaysForm.paypal.clientSecret}
                    onChange={(e) =>
                      setGatewaysForm((p) => ({
                        ...p,
                        paypal: { ...p.paypal, clientSecret: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                    placeholder="EP..."
                  />
                </div>
              </div>
            </div>

            {/* BANK WIRE */}
            <div className="p-6 bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground uppercase tracking-wider text-sm">
                  DIRECT SEPA / WIRE TRANSFER
                </span>
                <input
                  type="checkbox"
                  checked={gatewaysForm.bankWire.enabled}
                  onChange={(e) =>
                    setGatewaysForm((p) => ({ ...p, bankWire: { ...p.bankWire, enabled: e.target.checked } }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">IBAN</label>
                  <input
                    type="text"
                    value={gatewaysForm.bankWire.iban}
                    onChange={(e) =>
                      setGatewaysForm((p) => ({
                        ...p,
                        bankWire: { ...p.bankWire, iban: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">BIC / SWIFT</label>
                  <input
                    type="text"
                    value={gatewaysForm.bankWire.bic}
                    onChange={(e) =>
                      setGatewaysForm((p) => ({
                        ...p,
                        bankWire: { ...p.bankWire, bic: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 8: STORE PARAMETERS & FACEBOOK PIXEL */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl font-mono text-xs">
            <div className="pb-4 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                  STORE PARAMETERS & TRACKING APIS
                </h2>
                <p className="text-xs text-muted mt-1">
                  Configure top announcement banner, discount vouchers, Facebook Pixel ID, and Google Client ID.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90"
              >
                SAVE PARAMETERS
              </button>
            </div>

            {/* FACEBOOK PIXEL CONFIGURATION */}
            <div className="p-6 bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground uppercase tracking-wider text-sm flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>META / FACEBOOK PIXEL INTEGRATION</span>
                </span>
                {settingsForm.facebookPixelId ? (
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ● ACTIVE PIXEL TRACKER
                  </span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 bg-surface-subtle text-muted border border-border">
                    ○ UNCONNECTED
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-muted uppercase block">
                  FACEBOOK PIXEL ID
                </label>
                <input
                  type="text"
                  value={settingsForm.facebookPixelId}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, facebookPixelId: e.target.value }))}
                  placeholder="E.G. 123456789012345"
                  className="w-full bg-background border border-border p-3 text-foreground"
                />
                <p className="text-[10px] text-muted">
                  Automatically tracks PageView, ViewContent, AddToCart, InitiateCheckout, and Purchase events across every route.
                </p>
              </div>
            </div>

            {/* GOOGLE CLIENT ID */}
            <div className="p-6 bg-surface border border-border space-y-4">
              <span className="font-semibold text-foreground uppercase tracking-wider text-sm block">
                GOOGLE OAUTH CLIENT ID
              </span>
              <input
                type="text"
                value={settingsForm.googleClientId}
                onChange={(e) => setSettingsForm((p) => ({ ...p, googleClientId: e.target.value }))}
                placeholder="1234567890-abcdef.apps.googleusercontent.com"
                className="w-full bg-background border border-border p-3 text-foreground"
              />
            </div>

            {/* STORE CONFIG */}
            <div className="p-6 bg-surface border border-border space-y-4">
              <span className="font-semibold text-foreground uppercase tracking-wider text-sm block">
                GENERAL STOREFRONT CONFIG
              </span>

              <div className="space-y-1.5">
                <label className="text-[10px] text-muted uppercase block">
                  TOP MARQUEE ANNOUNCEMENT
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, announcementText: e.target.value }))}
                  className="w-full bg-background border border-border p-3 text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase block">
                    FREE DISPATCH THRESHOLD (€)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) =>
                      setSettingsForm((p) => ({ ...p, freeShippingThreshold: Number(e.target.value) }))
                    }
                    className="w-full bg-background border border-border p-3 text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted uppercase block">
                    VOUCHER CODE & DISCOUNT %
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={settingsForm.discountCode}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, discountCode: e.target.value }))}
                      className="bg-background border border-border p-3 text-foreground"
                    />
                    <input
                      type="number"
                      value={settingsForm.discountPercentage}
                      onChange={(e) =>
                        setSettingsForm((p) => ({ ...p, discountPercentage: Number(e.target.value) }))
                      }
                      className="bg-background border border-border p-3 text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <div className="relative w-full max-w-2xl bg-surface border border-border p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 text-xs font-mono text-foreground">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="font-semibold text-foreground uppercase tracking-widest text-sm">
                  {editingProductId ? 'EDIT ARCHIVAL PIECE' : 'ADD NEW GARMENT TO CATALOG'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-muted hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">GARMENT NAME *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-background border border-border p-2.5 text-foreground"
                      placeholder="ASYMMETRIC SILK Viscose GOWN"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">PRICE (€) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full bg-background border border-border p-2.5 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">CATEGORY</label>
                    <select
                      value={productForm.categorySlug}
                      onChange={(e) => {
                        const matched = categories.find((c) => c.slug === e.target.value);
                        setProductForm((p) => ({
                          ...p,
                          categorySlug: e.target.value,
                          category: matched?.name || e.target.value,
                        }));
                      }}
                      className="w-full bg-background border border-border p-2.5 text-foreground"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">EDITORIAL BADGE</label>
                    <select
                      value={productForm.badge || ''}
                      onChange={(e) =>
                        setProductForm((p) => ({
                          ...p,
                          badge: e.target.value ? (e.target.value as any) : undefined,
                        }))
                      }
                      className="w-full bg-background border border-border p-2.5 text-foreground"
                    >
                      <option value="">None</option>
                      <option value="NEW DROP">NEW DROP</option>
                      <option value="BEST SELLER">BEST SELLER</option>
                      <option value="RUNWAY">RUNWAY</option>
                      <option value="SPECIAL EDITION">SPECIAL EDITION</option>
                      <option value="ARCHIVE">ARCHIVE</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload & Management */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase block">GARMENT IMAGES</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      placeholder="PASTE IMAGE URL (HTTPS://...)"
                      className="flex-1 bg-background border border-border p-2.5 text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempImageUrl.trim()) {
                          setProductForm((p) => ({ ...p, images: [...p.images, tempImageUrl.trim()] }));
                          setTempImageUrl('');
                        }
                      }}
                      className="px-4 py-2.5 bg-foreground text-background font-semibold uppercase"
                    >
                      ADD URL
                    </button>
                    <label className="px-4 py-2.5 bg-surface border border-border hover:border-foreground text-foreground flex items-center justify-center space-x-1 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>UPLOAD</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'product')}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {productForm.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[3/4] border border-border group">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm((p) => ({
                              ...p,
                              images: p.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">DETAILS (1 PER LINE)</label>
                    <textarea
                      rows={3}
                      value={productForm.details}
                      onChange={(e) => setProductForm((p) => ({ ...p, details: e.target.value }))}
                      className="w-full bg-background border border-border p-2.5 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">CARE (1 PER LINE)</label>
                    <textarea
                      rows={3}
                      value={productForm.care}
                      onChange={(e) => setProductForm((p) => ({ ...p, care: e.target.value }))}
                      className="w-full bg-background border border-border p-2.5 text-foreground"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90 mt-4"
                >
                  SAVE GARMENT
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT CATEGORY */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <div className="relative w-full max-w-lg bg-surface border border-border p-6 md:p-8 space-y-6 text-xs font-mono text-foreground">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="font-semibold text-foreground uppercase tracking-widest text-sm">
                  {editingCategoryId ? 'EDIT CATEGORY' : 'ADD NEW TAXONOMY CATEGORY'}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-muted hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">CATEGORY NAME *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="CORSETS & BODICES"
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">SLUG (URL PATH)</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="corsets"
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase block">COVER IMAGE</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm((p) => ({ ...p, image: e.target.value }))}
                      className="flex-1 bg-background border border-border p-2.5 text-foreground"
                    />
                    <label className="px-3 py-2.5 bg-surface border border-border hover:border-foreground text-foreground flex items-center space-x-1 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>UPLOAD</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'category')}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase">EDITORIAL QUOTE</label>
                  <input
                    type="text"
                    value={categoryForm.editorialQuote}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, editorialQuote: e.target.value }))}
                    className="w-full bg-background border border-border p-2.5 text-foreground"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90 mt-2"
                >
                  SAVE CATEGORY
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
