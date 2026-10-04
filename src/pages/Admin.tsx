import React, { useState, useEffect } from 'react';
import { useStore, Order, PaymentGatewaysConfig, HeroSettings, DEFAULT_HERO } from '../context/StoreContext';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Product, Size, Category } from '../types';
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
  Lock,
  Upload,
  ArrowUpRight,
  LogOut,
  Users,
  Layout,
  Layers,
  Sparkles,
  Share2,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  Bell,
  Settings as SettingsIcon,
  DollarSign,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  MoreVertical,
  SlidersHorizontal,
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

  // Active Main Navigation Tab (Pill Bar)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'hero' | 'orders' | 'customers' | 'gateways' | 'settings'
  >('orders');

  // Selected Order for Inspector Card
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Selected Product for Inspector
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Active Status Sub-filter in Bottom Deck
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispatched' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

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

  // Form State for Categories
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    count: 10,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    description: '',
    editorialQuote: '',
  });

  // Form State for Hero
  const [heroForm, setHeroForm] = useState<HeroSettings>(hero || DEFAULT_HERO);
  useEffect(() => {
    if (hero) setHeroForm(hero);
  }, [hero]);

  // Form State for Gateways & Settings
  const [gatewaysForm, setGatewaysForm] = useState<PaymentGatewaysConfig>(settings.gateways);
  const [settingsForm, setSettingsForm] = useState({
    announcementText: settings.announcementText,
    freeShippingThreshold: settings.freeShippingThreshold,
    storeName: settings.storeName || 'ATELIER ECOVANTO',
    discountCode: settings.discountCode,
    discountPercentage: settings.discountPercentage,
    googleClientId: settings.googleClientId || '',
    facebookPixelId: settings.facebookPixelId || '',
  });

  const [tempImageUrl, setTempImageUrl] = useState('');

  // Selected payment pill in analytics card
  const [selectedVaultPill, setSelectedVaultPill] = useState<'stripe' | 'visa' | 'paypal'>('stripe');

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category' | 'hero') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'product') {
          setProductForm((prev) => ({ ...prev, images: [...prev.images, result] }));
        } else if (target === 'category') {
          setCategoryForm((prev) => ({ ...prev, image: result }));
        } else if (target === 'hero') {
          setHeroForm((prev) => ({ ...prev, imageUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
    showToast({ type: 'success', title: 'FILE UPLOADED', message: 'Image encoded and attached.' });
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

  const openAddProductModal = () => {
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

  const openEditProductModal = (p: Product) => {
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
      showToast({ type: 'success', title: 'GARMENT UPDATED', message: `Piece "${productForm.name}" updated.` });
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
      showToast({ type: 'success', title: 'GARMENT ARCHIVED', message: `New piece "${productForm.name}" added to catalog.` });
    }
    setIsProductModalOpen(false);
  };

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

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    showToast({ type: 'success', title: 'HERO PUBLISHED', message: 'Home billboard updated.' });
  };

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updateGateways(gatewaysForm);
    showToast({ type: 'success', title: 'GATEWAYS SAVED', message: 'Payment gateway credentials updated.' });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast({ type: 'success', title: 'PARAMETERS SAVED', message: 'Store settings & Pixel updated.' });
  };

  // Filtered orders for bottom master list
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && (o.status === 'pending' || o.status === 'processing' || o.status === 'preparing')) ||
      (statusFilter === 'dispatched' && o.status === 'dispatched') ||
      (statusFilter === 'delivered' && o.status === 'delivered');

    const matchesSearch =
      searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // PASSCODE LOCK SCREEN
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0F12] pt-36 pb-24 flex items-center justify-center px-4 text-[#F4F4F0] select-none font-sans">
        <div className="w-full max-w-md bg-[#16181D] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-indigo-400 uppercase font-semibold">
              ATELIER SECURITY OS
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Host Management Portal
            </h1>
            <p className="text-xs text-gray-400">
              Enter host master passcode to access Finnova / Ecovanto dashboard.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block font-semibold">
                SECURITY PASSCODE
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="ATELIER2026"
                className={`w-full bg-[#0E0F12] border ${
                  passcodeError ? 'border-red-500' : 'border-white/10'
                } rounded-xl p-3.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
            </div>

            <button
              type="submit"
              data-cursor="link"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30"
            >
              UNLOCK SUITE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F8] text-[#191B23] pt-24 pb-20 px-3 sm:px-6 md:px-10 lg:px-14 font-sans select-none antialiased">
      <div className="max-w-[1700px] mx-auto space-y-6">

        {/* 1. TOP HEADER & PILL NAVIGATION BAR (Matching Finnova Reference) */}
        <header className="bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-gray-100/80 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left Brand Identity */}
          <div className="flex items-center space-x-3 self-start lg:self-auto pl-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
              ⟁
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-gray-900">
                  ECOVANTO
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                  80
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                Atelier OS, Fashion Business
              </p>
            </div>
          </div>

          {/* Center Dark Pill Tabs Navigation */}
          <div className="bg-[#12141B] rounded-full p-1.5 flex items-center space-x-1 overflow-x-auto max-w-full shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              + Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              + Invoices
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab('gateways')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'gateways'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'hero'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hero
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Checkouts
            </button>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center space-x-2.5 pr-2">
            <Link
              to="/shop"
              className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              title="Open Storefront"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setActiveTab('gateways')}
              className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              title="Payments Vault"
            >
              <DollarSign className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              title="Hero Layout"
            >
              <Layout className="w-4 h-4" />
            </button>
            <div className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              title="Store Settings & Pixel"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* User Avatar Dropdown */}
            <div className="flex items-center pl-2 border-l border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Host Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <button
                onClick={adminLogout}
                className="ml-2 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Lock Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 2. SECTION TITLE & PRIMARY CALL-TO-ACTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors text-gray-700"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                {activeTab === 'orders' && 'Invoices & Dispatches'}
                {activeTab === 'products' && 'Garments Archive'}
                {activeTab === 'categories' && 'Taxonomy & Categories'}
                {activeTab === 'customers' && 'Registered Clients CRM'}
                {activeTab === 'gateways' && 'Payment Gateways & APIs'}
                {activeTab === 'hero' && 'Hero Section Billboard'}
                {activeTab === 'settings' && 'Storefront Parameters & Pixel'}
                {activeTab === 'overview' && 'Atelier Business Overview'}
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                {activeTab === 'orders' && 'Manage, track and dispatch all client orders in one place.'}
                {activeTab === 'products' && 'Curate archival inventory, prices, images, and sizes.'}
                {activeTab === 'categories' && 'Manage product collections and taxonomy groupings.'}
                {activeTab === 'customers' && 'Inspect customer profiles, address books, and order history.'}
                {activeTab === 'gateways' && 'Configure live Stripe, PayPal, Apple Pay and SEPA credentials.'}
                {activeTab === 'hero' && 'Live edit the homepage headline, subtext, and background imagery.'}
                {activeTab === 'settings' && 'Configure discount codes, shipping thresholds, and Meta Pixel.'}
                {activeTab === 'overview' && 'Real-time financial performance and fulfillment analytics.'}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2.5 rounded-2xl bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-600 shadow-sm"
              title="Tune Configuration"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {activeTab === 'products' ? (
              <button
                onClick={openAddProductModal}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold tracking-wide flex items-center space-x-2 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create a piece</span>
              </button>
            ) : activeTab === 'categories' ? (
              <button
                onClick={() => {
                  setEditingCategoryId(null);
                  setCategoryForm({
                    name: '',
                    slug: '',
                    count: 6,
                    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                    description: 'New curated category section.',
                    editorialQuote: 'Form follows friction.',
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold tracking-wide flex items-center space-x-2 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create a category</span>
              </button>
            ) : (
              <button
                onClick={openAddProductModal}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold tracking-wide flex items-center space-x-2 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create an invoice / piece</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. FOUR METRICS & VISUAL ANALYTICS CARDS (Exact Finnova 4-Card Architecture) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* CARD 1: OVERDUE / PHOTO PREVIEW */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Overdue / Active</span>
              <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold">
                !
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                € {totalRevenue > 0 ? (totalRevenue * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '24,850.00'}
              </div>
              <div className="text-[11px] font-semibold text-red-500 flex items-center space-x-1 mt-1">
                <span>↑ 12.5% from last month</span>
              </div>
            </div>

            {/* Atelier / Product Photo Preview */}
            <div className="h-28 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
              <img
                src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80'}
                alt="Workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] text-white font-mono uppercase font-bold">
                  {products[0]?.name || 'Berlin Atelier Studio'}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: REVENUE DUE WITH INTEGRATED BAR CHART */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Due within next month</span>
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                € {totalRevenue > 0 ? (totalRevenue * 1.05).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '142,560.00'}
              </div>
              <div className="text-[11px] font-semibold text-indigo-600 flex items-center space-x-1 mt-1">
                <span>↑ 8.2% from last month</span>
              </div>
            </div>

            {/* Rounded Vertical Bar Chart */}
            <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1">
              {[
                { label: 'Jul', height: '35%', active: false },
                { label: 'Aug', height: '50%', active: false },
                { label: 'Sep', height: '70%', active: false },
                { label: 'Oct', height: '60%', active: false },
                { label: 'Nov', height: '90%', active: false },
                { label: 'Dec', height: '100%', active: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: bar.height }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      bar.active
                        ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/30'
                        : 'bg-indigo-100 hover:bg-indigo-200'
                    }`}
                  />
                  <span className="text-[9px] text-gray-400 font-semibold">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: AVERAGE TIME TO GET PAID / SPARKLINE CURVE */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Average time to dispatch</span>
              <span className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                1.8 <span className="text-base font-semibold text-gray-500">days</span>
              </div>
              <div className="text-[11px] font-semibold text-teal-600 flex items-center space-x-1 mt-1">
                <span>↓ 2 days faster than avg</span>
              </div>
            </div>

            {/* Glowing SVG Sparkline Curve */}
            <div className="h-28 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 5 65 Q 40 70, 70 50 T 130 35 T 195 15"
                  fill="none"
                  stroke="url(#curveGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Node Points */}
                <circle cx="5" cy="65" r="3.5" fill="#6366F1" />
                <circle cx="70" cy="50" r="3.5" fill="#6366F1" />
                <circle cx="100" cy="42" r="3.5" fill="#6366F1" />
                <circle cx="130" cy="35" r="3.5" fill="#6366F1" />
                <circle cx="160" cy="25" r="3.5" fill="#6366F1" />
                <circle cx="195" cy="15" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* CARD 4: AVAILABLE FOR INSTANT PAYOUT / VAULT CARDS */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Available for Instant Payout</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span className="w-7 h-7 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center text-xs font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                € {totalRevenue > 0 ? (totalRevenue * 0.94).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '186,540.00'}
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">
                Verified Vault Balance
              </div>
            </div>

            {/* Micro Card Selector Pills & Payout Trigger */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <button
                onClick={() => setSelectedVaultPill('visa')}
                className={`flex-1 py-2 px-1 rounded-2xl text-[10px] font-mono flex flex-col items-center justify-center transition-all ${
                  selectedVaultPill === 'visa'
                    ? 'bg-gradient-to-b from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>•••• 4242</span>
                <span className="text-[8px] opacity-80 uppercase font-sans">Visa</span>
              </button>

              <button
                onClick={() => setSelectedVaultPill('stripe')}
                className={`flex-1 py-2 px-1 rounded-2xl text-[10px] font-mono flex flex-col items-center justify-center transition-all ${
                  selectedVaultPill === 'stripe'
                    ? 'bg-gradient-to-b from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>•••• 6789</span>
                <span className="text-[8px] opacity-80 uppercase font-sans">Stripe</span>
              </button>

              <button
                onClick={() => setSelectedVaultPill('paypal')}
                className={`flex-1 py-2 px-1 rounded-2xl text-[10px] font-mono flex flex-col items-center justify-center transition-all ${
                  selectedVaultPill === 'paypal'
                    ? 'bg-gradient-to-b from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>•••• 1234</span>
                <span className="text-[8px] opacity-80 uppercase font-sans">PayPal</span>
              </button>

              <button
                onClick={() => {
                  showToast({
                    type: 'success',
                    title: 'PAYOUT INITIATED',
                    message: 'Wire dispatch queued to your verified bank account.',
                  });
                }}
                className="py-2.5 px-3 rounded-2xl bg-[#12141B] hover:bg-black text-white text-[10px] font-semibold whitespace-nowrap transition-colors"
              >
                Payout now
              </button>
            </div>
          </div>
        </div>

        {/* 4. ACTIVE FILTERS & SEARCH ROW */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1.5 px-3 py-2 bg-white rounded-2xl border border-gray-200/80 text-gray-700 font-semibold shadow-sm">
              <span>Active filters</span>
              <span className="w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">
                {statusFilter === 'all' ? '1' : '2'}
              </span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2 bg-white rounded-2xl border border-gray-200/80 text-gray-700 font-medium shadow-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending / Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
            </select>

            <div className="hidden sm:flex items-center space-x-2">
              <div className="px-3.5 py-2 bg-white rounded-2xl border border-gray-200/80 text-gray-600 font-medium text-xs flex items-center space-x-2 shadow-sm">
                <span>Autumn 2026</span>
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="px-3.5 py-2 bg-white rounded-2xl border border-gray-200/80 text-gray-600 font-medium text-xs flex items-center space-x-2 shadow-sm">
                <span>Winter 2026</span>
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter order or client #..."
              className="w-full bg-white border border-gray-200/80 rounded-2xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 5. BOTTOM COMMAND DECK (Exact Finnova Dark Midnight + Deep Purple Dual Panel) */}
        <div className="bg-[#12141B] rounded-3xl p-4 sm:p-6 shadow-2xl text-white border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT MASTER LIST (5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-gray-200 tracking-wide">
                  {activeTab === 'orders' && 'Unpaid / Active Orders'}
                  {activeTab === 'products' && 'Archival Catalog Pieces'}
                  {activeTab === 'categories' && 'Store Categories'}
                  {activeTab === 'customers' && 'Registered Clients'}
                  {activeTab === 'gateways' && 'Active Gateways'}
                  {activeTab === 'hero' && 'Hero Elements'}
                  {activeTab === 'settings' && 'Store Parameters'}
                  {activeTab === 'overview' && 'Recent Invoices'}
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  {filteredOrders.length} items
                </span>
              </div>

              {/* Scrollable Master List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {activeTab === 'products' ? (
                  products.map((p) => {
                    const isSelected = selectedProductId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate text-white">{p.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono truncate">{p.category}</div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 pl-2">
                          <div className="text-xs font-bold text-white">€{(p?.price ?? 0).toFixed(2)}</div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300 uppercase">
                            {p.stock} in stock
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : activeTab === 'categories' ? (
                  categories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
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
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img src={c.image} alt={c.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{c.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">/{c.slug}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-400">{c.count} pieces</span>
                    </div>
                  ))
                ) : activeTab === 'customers' ? (
                  customers.map((cust) => (
                    <div
                      key={cust.id}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs">
                          {cust.firstName?.charAt(0) || 'C'}{cust.lastName?.charAt(0) || 'L'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{cust.firstName} {cust.lastName}</div>
                          <div className="text-[10px] text-gray-400 truncate">{cust.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${cust.email}?`)) deleteCustomer(cust.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrder?.id === ord.id;
                    return (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                            alt="Avatar"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              #{ord.orderNumber}
                            </div>
                            <div className="text-[10px] text-gray-400 truncate">
                              {ord.customer?.firstName} {ord.customer?.lastName}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${
                              ord.status === 'dispatched'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : ord.status === 'delivered'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <div className="text-xs font-bold text-white">
                            €{(ord?.total ?? 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT DETAILED INSPECTOR CARD (7 Columns - Exact Finnova Deep Purple Sub-Card) */}
            <div className="lg:col-span-7 bg-gradient-to-b from-[#32364E] via-[#2A2E44] to-[#202334] rounded-3xl p-5 sm:p-7 border border-white/10 shadow-xl space-y-6">
              
              {/* Top Sub-Filter Tabs inside Inspector */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2 bg-black/30 p-1 rounded-full text-[11px]">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      statusFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All Invoices
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      statusFilter === 'pending' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Pending <span className="ml-1 text-[9px] px-1.5 py-0.2 bg-white/20 rounded-full">{orders.filter(o => o.status === 'pending').length}</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('dispatched')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      statusFilter === 'dispatched' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Dispatched
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-gray-400">
                  <button className="p-1.5 hover:text-white"><Share2 className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Inspector Main Header Data */}
              {selectedOrder ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block">
                      INVOICE DETAILS
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <h2 className="text-xl font-extrabold text-white tracking-tight">
                        #{selectedOrder.orderNumber}
                      </h2>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase font-bold">
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block">
                      COURIER & CARRIER
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="font-extrabold text-white text-base">
                        {selectedOrder.shippingMethod?.carrier || 'DHL Express'}
                      </span>
                      <span className="text-xs text-emerald-400">● Live</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block">
                      CUSTOMER
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80"
                        alt="Customer"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {selectedOrder.customer?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Sub-cards Row (Breakdown Line Items) */}
              {selectedOrder ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold text-base">
                      <span>€{(selectedOrder?.subtotal ?? 0).toFixed(2)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-300 font-mono uppercase">
                      Subtotal ({selectedOrder.items?.length || 0} garments)
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold text-base">
                      <span>€{(selectedOrder?.shippingCost ?? 0).toFixed(2)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-300 font-mono uppercase">
                      Express Carbon Delivery
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold text-base">
                      <span>€{(selectedOrder?.total ?? 0).toFixed(2)}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-gray-300 font-mono uppercase">
                      Grand Total Charged
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Line Items List with Garment Images */}
              {selectedOrder ? (
                <div className="space-y-2 bg-black/20 p-3 rounded-2xl border border-white/5 max-h-40 overflow-y-auto">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-1">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img src={item.image || item.product?.images?.[0]} alt={item.productName || item.product?.name} className="w-7 h-9 rounded-lg object-cover" />
                        <span className="font-medium text-gray-200 truncate">{item.productName || item.product?.name} (Size {item.size})</span>
                      </div>
                      <span className="font-bold text-white pl-2">€{((item?.price ?? item?.unitPrice ?? item?.product?.price ?? 0)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Bottom Summary Bar & Payout Actions */}
              {selectedOrder ? (
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-6 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">SUB TOTAL</span>
                      <span className="font-bold text-white">€{(selectedOrder?.subtotal ?? 0).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">TOTAL</span>
                      <span className="font-bold text-white">€{(selectedOrder?.total ?? 0).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-300 uppercase font-mono block">BALANCE DUE</span>
                      <span className="font-bold text-indigo-300">€ 0.00</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/orders/${selectedOrder.id}`}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Direct Invoice Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => {
                        const nextStatus =
                          selectedOrder.status === 'pending'
                            ? 'dispatched'
                            : selectedOrder.status === 'dispatched'
                            ? 'delivered'
                            : 'dispatched';
                        updateOrderStatus(selectedOrder.id, nextStatus as any);
                        showToast({
                          type: 'success',
                          title: 'STATUS ADVANCED',
                          message: `Order #${selectedOrder.orderNumber} updated to ${nextStatus}.`,
                        });
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-white text-gray-900 hover:bg-gray-100 text-xs font-bold tracking-wide shadow-md transition-all"
                    >
                      Mark as {selectedOrder.status === 'pending' ? 'Dispatched' : 'Delivered'}
                    </button>
                  </div>
                </div>
              ) : null}

            </div>

          </div>
        </div>

        {/* 6. MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 text-xs text-gray-800 shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-base">
                  {editingProductId ? 'Edit Archival Piece' : 'Add New Garment to Catalog'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Garment Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                      placeholder="ASYMMETRIC SILK VISCOSE GOWN"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Price (€) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Badge</label>
                    <select
                      value={productForm.badge || ''}
                      onChange={(e) =>
                        setProductForm((p) => ({ ...p, badge: e.target.value ? (e.target.value as any) : undefined }))
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
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

                {/* Image Management */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block">Product Images</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      placeholder="Paste Image URL (https://...)"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempImageUrl.trim()) {
                          setProductForm((p) => ({ ...p, images: [...p.images, tempImageUrl.trim()] }));
                          setTempImageUrl('');
                        }
                      }}
                      className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold uppercase text-[11px]"
                    >
                      Add URL
                    </button>
                    <label className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center space-x-1 cursor-pointer transition-colors font-semibold text-[11px]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
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
                      <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))
                          }
                          className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl tracking-wide uppercase shadow-lg shadow-indigo-600/30"
                >
                  Save Piece
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 7. MODAL: ADD / EDIT CATEGORY */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 space-y-6 text-xs text-gray-800 shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-base">
                  {editingCategoryId ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="CORSETS & BODICES"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Slug (URL Path)</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="corsets"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block">Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm((p) => ({ ...p, image: e.target.value }))}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                    />
                    <label className="px-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center space-x-1 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
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
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl tracking-wide uppercase shadow-lg shadow-indigo-600/30"
                >
                  Save Category
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
