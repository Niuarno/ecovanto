import React, { useState, useEffect, useRef } from 'react';
import { useAuth, UserAddress, SavedPaymentCard } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { PhoneInput } from '../components/common/PhoneInput';
import { CountrySelect } from '../components/common/CountrySelect';
import { jwtDecode } from 'jwt-decode';
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  User as UserIcon,
} from 'lucide-react';

interface GoogleTokenPayload {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const Account: React.FC = () => {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogleData,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    addSavedCard,
    deleteSavedCard,
    setDefaultSavedCard,
  } = useAuth();

  const { orders, settings } = useStore();
  const { favorites } = useFavorites();
  const { showToast } = useUI();
  const { theme } = useTheme();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'payments' | 'settings'>('orders');

  // Form State for Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Address Modal / State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    title: 'Primary Residence',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    isDefault: true,
  });

  // New Card Modal / State
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardForm, setNewCardForm] = useState({
    cardholderName: '',
    number: '',
    expiryMonth: '12',
    expiryYear: '2028',
    brand: 'visa' as const,
    isDefault: true,
  });

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // Active Google Client ID
  const activeClientId =
    settings.googleClientId?.trim() ||
    ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID?.trim()) ||
    '';

  // Handle Real Google JWT Credential Response
  const handleGoogleCredentialResponse = (response: any) => {
    try {
      if (!response.credential) return;
      const decoded = jwtDecode<GoogleTokenPayload>(response.credential);

      const realGoogleUser = {
        id: `usr-google-${decoded.sub || Date.now()}`,
        email: decoded.email,
        firstName: decoded.given_name || decoded.name.split(' ')[0] || 'Client',
        lastName: decoded.family_name || decoded.name.split(' ').slice(1).join(' ') || 'Atelier',
        avatarUrl: decoded.picture,
        isGmailAuth: true,
        createdAt: new Date().toISOString(),
        addresses: [],
        savedCards: [],
      };

      loginWithGoogleData(realGoogleUser);
      showToast({
        type: 'success',
        title: 'GOOGLE AUTHENTICATED',
        message: `Welcome, ${realGoogleUser.firstName} ${realGoogleUser.lastName} (${realGoogleUser.email}).`,
      });
    } catch (err) {
      console.error('Failed to parse Google OAuth credential:', err);
      showToast({
        type: 'error',
        title: 'GOOGLE SIGN-IN FAILED',
        message: 'Could not decode Google token. Please try again.',
      });
    }
  };

  // Render Official Google Button
  useEffect(() => {
    if (!activeClientId || isAuthenticated) return;

    const renderOfficialGoogleButton = () => {
      if (window.google?.accounts?.id && googleButtonContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: activeClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          googleButtonContainerRef.current.innerHTML = '';

          window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
            type: 'standard',
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: googleButtonContainerRef.current.offsetWidth || 380,
          });
        } catch (err) {
          console.error('Google button rendering error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      renderOfficialGoogleButton();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          renderOfficialGoogleButton();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [activeClientId, theme, authMode, isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
    showToast({
      type: 'success',
      title: 'WELCOME BACK',
      message: `Signed in as ${email}.`,
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName) return;
    setIsSubmitting(true);
    await register({ email, firstName, lastName, phone });
    setIsSubmitting(false);
    showToast({
      type: 'success',
      title: 'MEMBERSHIP REGISTERED',
      message: `Welcome to ATELIER ECOVANTO, ${firstName}.`,
    });
  };

  // Address creation handler
  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.address || !newAddressForm.city) return;
    addAddress(newAddressForm);
    setIsAddingAddress(false);
    setNewAddressForm({
      title: 'Secondary Residence',
      address: '',
      apartment: '',
      city: '',
      postalCode: '',
      country: 'Germany',
      isDefault: false,
    });
    showToast({
      type: 'success',
      title: 'ADDRESS SAVED',
      message: 'New delivery coordinates added to address book.',
    });
  };

  // Saved card creation handler
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardForm.number || !newCardForm.cardholderName) return;
    const cleanNum = newCardForm.number.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '8841';

    let brand: 'visa' | 'mastercard' | 'amex' | 'card' = 'visa';
    if (cleanNum.startsWith('5')) brand = 'mastercard';
    if (cleanNum.startsWith('3')) brand = 'amex';

    addSavedCard({
      cardholderName: newCardForm.cardholderName.toUpperCase(),
      last4,
      brand,
      expiryMonth: newCardForm.expiryMonth,
      expiryYear: newCardForm.expiryYear,
      isDefault: newCardForm.isDefault,
    });

    setIsAddingCard(false);
    setNewCardForm({
      cardholderName: '',
      number: '',
      expiryMonth: '12',
      expiryYear: '2028',
      brand: 'visa',
      isDefault: false,
    });

    showToast({
      type: 'success',
      title: 'PAYMENT METHOD SECURED',
      message: `Card ending in •••• ${last4} added to your vault.`,
    });
  };

  const customerOrders = orders.filter(
    (o) =>
      !user ||
      o.customer.email.toLowerCase() === user.email.toLowerCase() ||
      o.customer.lastName.toLowerCase() === user.lastName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {!isAuthenticated || !user ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
                CLIENT MEMBERSHIP
              </span>
              <h1 className="text-3xl md:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
                {authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </h1>
              <p className="text-xs font-light text-muted">
                Access your archived acquisitions, parcel dispatches, and private showroom bookings.
              </p>
            </div>

            {/* Auth Tab Switcher */}
            <div className="flex border border-border p-1 bg-surface text-xs font-mono">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                data-cursor="link"
                className={`flex-1 py-2.5 uppercase tracking-widest transition-colors ${
                  authMode === 'login'
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                data-cursor="link"
                className={`flex-1 py-2.5 uppercase tracking-widest transition-colors ${
                  authMode === 'register'
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                REGISTER
              </button>
            </div>

            {/* Official Google Sign-In Button Directly from Google SDK */}
            {activeClientId ? (
              <div className="w-full flex justify-center">
                <div
                  ref={googleButtonContainerRef}
                  className="w-full flex justify-center min-h-[44px] overflow-hidden"
                />
              </div>
            ) : null}

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-background px-3 text-[10px] font-mono text-muted uppercase absolute">
                {activeClientId ? 'OR WITH EMAIL' : 'EMAIL AUTHENTICATION'}
              </span>
            </div>

            {/* Email Forms */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 bg-surface p-6 md:p-8 border border-border">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="CLIENT@DOMAIN.COM"
                    className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                    PASSWORD *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor="link"
                  className="w-full py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
                >
                  {isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN TO ATELIER'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-surface p-6 md:p-8 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="ELENA"
                      className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="VOSS"
                      className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="CLIENT@DOMAIN.COM"
                    className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    label="TELEPHONE (FOR PARCEL NOTIFICATIONS)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                    PASSWORD *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="CREATE SECURE PASSWORD"
                    className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor="link"
                  className="w-full py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
                >
                  {isSubmitting ? 'CREATING PROFILE...' : 'REGISTER MEMBERSHIP'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Authenticated Customer Dashboard */
          <div className="space-y-10">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-border gap-4">
              <div className="flex items-center space-x-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="w-14 h-14 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 bg-foreground text-background flex items-center justify-center font-mono text-xl font-bold uppercase">
                    {user.firstName?.charAt(0) || 'E'}
                    {user.lastName?.charAt(0) || 'V'}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                      CLIENT PROFILE
                    </span>
                    {user.isGmailAuth && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                        GOOGLE VERIFIED
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-light font-display tracking-widest uppercase text-foreground">
                    {user.firstName} {user.lastName}
                  </h1>
                  <span className="text-xs font-mono text-muted">{user.email}</span>
                </div>
              </div>

              <button
                onClick={logout}
                data-cursor="link"
                className="px-6 py-2.5 border border-border hover:border-red-400 text-muted hover:text-red-400 font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-2 self-start md:self-auto font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            </div>

            {/* Metric Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>TOTAL ACQUISITIONS</span>
                </span>
                <div className="text-2xl font-mono text-foreground font-light">
                  {customerOrders.length} ORDERS
                </div>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>SAVED IN WISHLIST</span>
                </span>
                <div className="text-2xl font-mono text-foreground font-light">
                  {favorites.length} PIECES
                </div>
              </div>

              <div className="p-6 bg-surface border border-border space-y-2">
                <span className="text-muted uppercase tracking-widest flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MEMBERSHIP PRIVILEGE</span>
                </span>
                <div className="text-sm font-mono text-foreground font-medium pt-1">
                  10% ATELIER ACCESS ACTIVE
                </div>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex border-b border-border text-xs font-mono overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('orders')}
                data-cursor="link"
                className={`px-6 py-3 uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-foreground text-foreground bg-surface-subtle'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                ACQUISITIONS [{customerOrders.length}]
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                data-cursor="link"
                className={`px-6 py-3 uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'addresses'
                    ? 'border-foreground text-foreground bg-surface-subtle'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                ADDRESS BOOK [{(user.addresses || []).length}]
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                data-cursor="link"
                className={`px-6 py-3 uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'border-foreground text-foreground bg-surface-subtle'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                PAYMENT METHODS [{(user.savedCards || []).length}]
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                data-cursor="link"
                className={`px-6 py-3 uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-foreground text-foreground bg-surface-subtle'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                PROFILE SETTINGS
              </button>
            </div>

            {/* TAB 1: ACQUISITION & DISPATCH HISTORY */}
            {activeTab === 'orders' && (
              <div className="bg-surface border border-border p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                    ACQUISITIONS & DISPATCH LOG
                  </h2>
                  <Link to="/shop" className="text-xs font-mono text-muted hover:text-foreground underline">
                    EXPLORE SHOP ↗
                  </Link>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <p className="text-xs font-mono text-muted uppercase">
                      NO DISPATCHES REGISTERED TO THIS ACCOUNT
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-semibold"
                    >
                      ACQUIRE FIRST GARMENT
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-background border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">#{ord.orderNumber}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-surface text-foreground uppercase border border-border">
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-muted text-[11px]">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items • €{ord.total.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-muted">
                            TRACKING: {ord.trackingNumber}
                          </div>
                        </div>

                        <Link
                          to={`/orders/${ord.id}`}
                          data-cursor="link"
                          className="px-4 py-2 bg-surface hover:bg-foreground hover:text-background border border-border text-foreground transition-colors uppercase font-medium flex items-center space-x-1.5"
                        >
                          <span>TRACK DISPATCH</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADDRESS BOOK */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                    DELIVERY COORDINATES & ADDRESS BOOK
                  </h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    data-cursor="link"
                    className="px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-widest flex items-center space-x-1.5 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingAddress ? 'CANCEL' : 'ADD NEW ADDRESS'}</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <form
                    onSubmit={handleCreateAddress}
                    className="p-6 bg-surface border border-border space-y-4 text-xs font-mono"
                  >
                    <h3 className="font-semibold text-foreground uppercase tracking-widest text-xs">
                      NEW DELIVERY LOCATION
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">ADDRESS LABEL</label>
                        <input
                          type="text"
                          required
                          value={newAddressForm.title}
                          onChange={(e) => setNewAddressForm((p) => ({ ...p, title: e.target.value }))}
                          placeholder="E.G. PRIMARY RESIDENCE / STUDIO"
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">STREET ADDRESS *</label>
                        <input
                          type="text"
                          required
                          value={newAddressForm.address}
                          onChange={(e) => setNewAddressForm((p) => ({ ...p, address: e.target.value }))}
                          placeholder="TORSTRASSE 84"
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">APARTMENT / SUITE</label>
                        <input
                          type="text"
                          value={newAddressForm.apartment}
                          onChange={(e) => setNewAddressForm((p) => ({ ...p, apartment: e.target.value }))}
                          placeholder="APT 4B"
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">CITY *</label>
                        <input
                          type="text"
                          required
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm((p) => ({ ...p, city: e.target.value }))}
                          placeholder="BERLIN"
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">POSTAL CODE *</label>
                        <input
                          type="text"
                          required
                          value={newAddressForm.postalCode}
                          onChange={(e) => setNewAddressForm((p) => ({ ...p, postalCode: e.target.value }))}
                          placeholder="10119"
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <CountrySelect
                        value={newAddressForm.country}
                        onChange={(c) => setNewAddressForm((p) => ({ ...p, country: c }))}
                        label="COUNTRY / TERRITORY"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefaultAddr"
                        checked={newAddressForm.isDefault}
                        onChange={(e) => setNewAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                        className="rounded border-border text-foreground"
                      />
                      <label htmlFor="isDefaultAddr" className="text-xs text-muted uppercase">
                        SET AS DEFAULT DELIVERY COORDINATES
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90"
                    >
                      SAVE TO ADDRESS BOOK
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(user.addresses || []).length === 0 ? (
                    <div className="p-8 bg-surface border border-border text-center col-span-2 space-y-2">
                      <MapPin className="w-6 h-6 text-muted mx-auto" />
                      <p className="text-xs font-mono text-muted uppercase">
                        NO SAVED ADDRESSES YET. CLICK "ADD NEW ADDRESS" TO SAVE RECIPIENT COORDINATES.
                      </p>
                    </div>
                  ) : (
                    (user.addresses || []).map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 bg-surface border ${
                          addr.isDefault ? 'border-foreground' : 'border-border'
                        } flex flex-col justify-between space-y-4 text-xs font-mono`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground uppercase">{addr.title}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] px-2 py-0.5 bg-foreground text-background uppercase font-bold">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="text-foreground">{addr.address}</div>
                          {addr.apartment && <div className="text-muted">{addr.apartment}</div>}
                          <div className="text-muted">
                            {addr.postalCode} {addr.city}, {addr.country}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 pt-3 border-t border-border">
                          {!addr.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-xs text-muted hover:text-foreground underline"
                            >
                              SET AS DEFAULT
                            </button>
                          )}
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: SAVED PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                    SAVED CARDS & VAULT PAYMENT METHODS
                  </h2>
                  <button
                    onClick={() => setIsAddingCard(!isAddingCard)}
                    data-cursor="link"
                    className="px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-widest flex items-center space-x-1.5 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingCard ? 'CANCEL' : 'ADD NEW CARD'}</span>
                  </button>
                </div>

                {isAddingCard && (
                  <form
                    onSubmit={handleCreateCard}
                    className="p-6 bg-surface border border-border space-y-4 text-xs font-mono max-w-lg"
                  >
                    <h3 className="font-semibold text-foreground uppercase tracking-widest text-xs">
                      SAVE CARD TO ENCRYPTED VAULT
                    </h3>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase">NAME ON CARD *</label>
                      <input
                        type="text"
                        required
                        value={newCardForm.cardholderName}
                        onChange={(e) => setNewCardForm((p) => ({ ...p, cardholderName: e.target.value }))}
                        placeholder="ELENA VOSS"
                        className="w-full bg-background border border-border p-2.5 text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase">CARD NUMBER *</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={newCardForm.number}
                        onChange={(e) => setNewCardForm((p) => ({ ...p, number: e.target.value }))}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-background border border-border p-2.5 text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">EXPIRY MONTH</label>
                        <select
                          value={newCardForm.expiryMonth}
                          onChange={(e) => setNewCardForm((p) => ({ ...p, expiryMonth: e.target.value }))}
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        >
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase">EXPIRY YEAR</label>
                        <select
                          value={newCardForm.expiryYear}
                          onChange={(e) => setNewCardForm((p) => ({ ...p, expiryYear: e.target.value }))}
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        >
                          {['2026', '2027', '2028', '2029', '2030', '2031'].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefaultCard"
                        checked={newCardForm.isDefault}
                        onChange={(e) => setNewCardForm((p) => ({ ...p, isDefault: e.target.checked }))}
                        className="rounded border-border text-foreground"
                      />
                      <label htmlFor="isDefaultCard" className="text-xs text-muted uppercase">
                        SET AS DEFAULT PAYMENT METHOD
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90"
                    >
                      ENCRYPT & SAVE CARD
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(user.savedCards || []).length === 0 ? (
                    <div className="p-8 bg-surface border border-border text-center col-span-2 space-y-2">
                      <CreditCard className="w-6 h-6 text-muted mx-auto" />
                      <p className="text-xs font-mono text-muted uppercase">
                        NO SAVED PAYMENT CARDS. ADD A CARD FOR 1-CLICK ATELIER CHECKOUT.
                      </p>
                    </div>
                  ) : (
                    (user.savedCards || []).map((card) => (
                      <div
                        key={card.id}
                        className={`p-5 bg-surface border ${
                          card.isDefault ? 'border-foreground' : 'border-border'
                        } flex flex-col justify-between space-y-4 text-xs font-mono`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground uppercase tracking-widest flex items-center space-x-2">
                              <CreditCard className="w-4 h-4" />
                              <span>{card.brand.toUpperCase()} •••• {card.last4}</span>
                            </span>
                            {card.isDefault && (
                              <span className="text-[9px] px-2 py-0.5 bg-foreground text-background uppercase font-bold">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="text-muted">HOLDER: {card.cardholderName}</div>
                          <div className="text-muted">EXPIRES: {card.expiryMonth}/{card.expiryYear}</div>
                        </div>

                        <div className="flex items-center space-x-4 pt-3 border-t border-border">
                          {!card.isDefault && (
                            <button
                              onClick={() => setDefaultSavedCard(card.id)}
                              className="text-xs text-muted hover:text-foreground underline"
                            >
                              SET AS DEFAULT
                            </button>
                          )}
                          <button
                            onClick={() => deleteSavedCard(card.id)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: PROFILE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-surface border border-border p-6 md:p-8 space-y-6 max-w-xl text-xs font-mono">
                <h2 className="text-sm font-mono tracking-widest uppercase text-foreground pb-3 border-b border-border">
                  CLIENT CREDENTIALS
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast({
                      type: 'success',
                      title: 'PROFILE UPDATED',
                      message: 'Client credentials saved successfully.',
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase">FIRST NAME</label>
                      <input
                        type="text"
                        value={user.firstName}
                        onChange={(e) => updateProfile({ firstName: e.target.value })}
                        className="w-full bg-background border border-border p-2.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase">LAST NAME</label>
                      <input
                        type="text"
                        value={user.lastName}
                        onChange={(e) => updateProfile({ lastName: e.target.value })}
                        className="w-full bg-background border border-border p-2.5 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-background/50 border border-border p-2.5 text-muted cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <PhoneInput
                      value={user.phone || ''}
                      onChange={(p) => updateProfile({ phone: p })}
                      label="PHONE NUMBER"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-foreground text-background uppercase tracking-widest font-semibold hover:opacity-90"
                  >
                    SAVE PROFILE SETTINGS
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
