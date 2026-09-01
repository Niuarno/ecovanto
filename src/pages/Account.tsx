import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { PhoneInput } from '../components/common/PhoneInput';
import { CountrySelect } from '../components/common/CountrySelect';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Check,
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
  const { user, isAuthenticated, login, register, logout, updateProfile, loginWithGoogleData } = useAuth();
  const { orders, settings } = useStore();
  const { favorites } = useFavorites();
  const { showToast } = useUI();
  const { theme } = useTheme();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // Active Google Client ID (from protected store settings or Vercel environment variable)
  const activeClientId =
    settings.googleClientId?.trim() ||
    ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID?.trim()) ||
    '';

  // Handle Real Google JWT Credential Response from Google Identity Services
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
        defaultAddress: {
          address: 'Auguststraße 14',
          city: 'Berlin',
          postalCode: '10117',
          country: 'Germany',
        },
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

  // Render the Official Google Button using Google's official SDK styled to theme
  useEffect(() => {
    if (!activeClientId) return;

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

  // Address edit in profile
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: user?.defaultAddress?.address || 'Auguststraße 14',
    apartment: user?.defaultAddress?.apartment || '',
    city: user?.defaultAddress?.city || 'Berlin',
    postalCode: user?.defaultAddress?.postalCode || '10117',
    country: user?.defaultAddress?.country || 'Germany',
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ defaultAddress: addressForm });
    setIsEditingAddress(false);
    showToast({
      type: 'success',
      title: 'COORDINATES SAVED',
      message: 'Default delivery coordinates updated.',
    });
  };

  const customerOrders = orders.filter(
    (o) => !user || o.customer.email.toLowerCase() === user.email.toLowerCase() || o.customer.lastName.toLowerCase() === user.lastName.toLowerCase()
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
          /* Authenticated Profile Dashboard */
          <div className="space-y-12">
            {/* Header */}
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
                    {user.firstName?.charAt(0) || 'E'}{user.lastName?.charAt(0) || 'V'}
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

            {/* 3 Metric Cards */}
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

            {/* 2 Columns: Orders and Delivery Address */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Order History */}
              <div className="lg:col-span-8 bg-surface border border-border p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                    ACQUISITION & DISPATCH HISTORY [{customerOrders.length}]
                  </h2>
                  <Link to="/shop" className="text-xs font-mono text-muted hover:text-foreground underline">
                    EXPLORE SHOP
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
                            <span className="text-[9px] px-1.5 py-0.5 bg-surface-subtle text-foreground uppercase border border-border">
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

              {/* Right Column: Address Book */}
              <div className="lg:col-span-4 bg-surface border border-border p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <h3 className="text-sm font-mono tracking-widest uppercase text-foreground">
                    DELIVERY COORDINATES
                  </h3>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs font-mono text-muted hover:text-foreground underline"
                  >
                    {isEditingAddress ? 'CANCEL' : 'EDIT'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-3 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-[9px] text-muted uppercase">STREET ADDRESS</label>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={(e) => setAddressForm((p) => ({ ...p, address: e.target.value }))}
                        className="w-full bg-background border border-border p-2.5 text-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] text-muted uppercase">CITY</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-muted uppercase">POSTAL CODE</label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))}
                          className="w-full bg-background border border-border p-2.5 text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <CountrySelect
                        value={addressForm.country}
                        onChange={(c) => setAddressForm((p) => ({ ...p, country: c }))}
                        label="COUNTRY"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-foreground text-background uppercase tracking-wider font-semibold hover:opacity-90"
                    >
                      SAVE COORDINATES
                    </button>
                  </form>
                ) : (
                  <div className="space-y-2 text-xs font-mono text-foreground-secondary">
                    <div className="text-foreground font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div>{user.defaultAddress?.address || 'Auguststraße 14'}</div>
                    <div>{user.defaultAddress?.postalCode || '10117'} {user.defaultAddress?.city || 'Berlin'}</div>
                    <div>{user.defaultAddress?.country || 'Germany'}</div>
                    <div className="pt-2 text-muted">PHONE: {user.phone || '+49 171 000000'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
