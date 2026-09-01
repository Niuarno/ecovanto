import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUI } from '../context/UIContext';
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
  X,
  Key,
  ExternalLink,
  HelpCircle,
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
  const { user, isAuthenticated, login, loginWithGmail, register, logout, updateProfile } = useAuth();
  const { orders, settings, updateSettings } = useStore();
  const { favorites } = useFavorites();
  const { showToast } = useUI();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google OAuth Setup & Setup Modal State
  const [isGoogleSetupModalOpen, setIsGoogleSetupModalOpen] = useState(false);
  const [customClientIdInput, setCustomClientIdInput] = useState(settings.googleClientId || '');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Active Google Client ID (from settings or environment)
  const activeClientId = settings.googleClientId || ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) || '';

  // Initialize Real Google Identity Services when Client ID is available
  useEffect(() => {
    if (!activeClientId) return;

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: activeClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        } catch (err) {
          console.error('Google Sign-In initialization error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [activeClientId, isAuthenticated]);

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
        defaultAddress: {
          address: 'Auguststraße 14',
          city: 'Berlin',
          postalCode: '10117',
          country: 'Germany',
        },
      };

      updateProfile(realGoogleUser);
      setIsGoogleSetupModalOpen(false);
      showToast({
        type: 'success',
        title: 'AUTHENTICATED VIA GOOGLE',
        message: `Signed in as ${realGoogleUser.firstName} ${realGoogleUser.lastName} (${realGoogleUser.email}).`,
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

  // Trigger Google Login Popup or open setup guide
  const handleGoogleButtonClick = () => {
    if (activeClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsGoogleSetupModalOpen(true);
          }
        });
      } catch {
        setIsGoogleSetupModalOpen(true);
      }
    } else {
      setIsGoogleSetupModalOpen(true);
    }
  };

  const handleSaveGoogleClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientIdInput.trim()) return;

    updateSettings({ googleClientId: customClientIdInput.trim() });
    showToast({
      type: 'success',
      title: 'GOOGLE CLIENT ID SAVED',
      message: 'Official Google OAuth credentials updated.',
    });
  };

  const handleDemoSignIn = async (demoEmail?: string) => {
    setIsSubmitting(true);
    setIsGoogleSetupModalOpen(false);

    if (demoEmail && demoEmail.includes('@')) {
      const namePart = demoEmail.split('@')[0];
      const customUser = {
        id: `usr-gmail-${Date.now()}`,
        email: demoEmail,
        firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        lastName: 'Client',
        isGmailAuth: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        phone: '+49 171 000000',
        createdAt: new Date().toISOString(),
        defaultAddress: {
          address: 'Torstraße 84',
          city: 'Berlin',
          postalCode: '10119',
          country: 'Germany',
        },
      };
      updateProfile(customUser);
      showToast({
        type: 'success',
        title: 'GOOGLE AUTHENTICATED',
        message: `Signed in as ${demoEmail}.`,
      });
    } else {
      const gmailUser = await loginWithGmail();
      showToast({
        type: 'success',
        title: 'GOOGLE AUTHENTICATED',
        message: `Signed in as ${gmailUser.firstName} ${gmailUser.lastName} (${gmailUser.email}).`,
      });
    }

    setIsSubmitting(false);
  };

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

            {/* Single Clean Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleButtonClick}
              disabled={isSubmitting}
              data-cursor="link"
              className="w-full py-3.5 bg-surface border border-border hover:border-foreground text-foreground text-xs font-mono tracking-widest uppercase transition-colors flex items-center justify-center space-x-3 group"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
              <HelpCircle className="w-3.5 h-3.5 text-muted group-hover:text-foreground ml-1" />
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-background px-3 text-[10px] font-mono text-muted uppercase absolute">
                OR WITH EMAIL
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

            {/* Google OAuth Configuration & Live Account Chooser Modal */}
            {isGoogleSetupModalOpen && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <div
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => setIsGoogleSetupModalOpen(false)}
                />
                <div className="relative w-full max-w-lg bg-surface border border-border p-6 md:p-8 space-y-6 shadow-2xl z-10 text-foreground max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"/>
                      </svg>
                      <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                        REAL GOOGLE / GMAIL SIGN-IN
                      </h2>
                    </div>
                    <button onClick={() => setIsGoogleSetupModalOpen(false)} className="text-muted hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Instructions on how to get real Google Client ID */}
                  <div className="p-4 bg-background border border-border space-y-3 text-xs font-mono">
                    <span className="text-foreground font-semibold uppercase flex items-center space-x-1.5">
                      <Key className="w-4 h-4 text-emerald-400" />
                      <span>HOW TO ENABLE REAL GOOGLE AUTH (3 STEPS):</span>
                    </span>
                    <ol className="space-y-2 text-[11px] text-muted list-decimal list-inside leading-relaxed">
                      <li>
                        Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-foreground underline inline-flex items-center">Google Cloud Console <ExternalLink className="w-3 h-3 ml-0.5" /></a> (Free).
                      </li>
                      <li>
                        Create an <strong>OAuth 2.0 Client ID (Web Application)</strong>.
                      </li>
                      <li>
                        Add <code>http://localhost:5173</code> to <strong>Authorized JavaScript origins</strong> and paste your Client ID below:
                      </li>
                    </ol>

                    <form onSubmit={handleSaveGoogleClientId} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={customClientIdInput}
                        onChange={(e) => setCustomClientIdInput(e.target.value)}
                        placeholder="PASTE GOOGLE CLIENT ID (e.g. 123...apps.googleusercontent.com)"
                        className="flex-1 bg-surface border border-border p-2 text-[11px] text-foreground font-mono focus:outline-none focus:border-foreground"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-wider font-semibold"
                      >
                        SAVE
                      </button>
                    </form>
                  </div>

                  {/* Immediate One-Click Test Accounts */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                      OR INSTANT CLIENT SIMULATION
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDemoSignIn()}
                      className="w-full p-3 bg-background border border-border hover:border-foreground text-left flex items-center space-x-3 transition-colors group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="Elena Voss"
                        className="w-9 h-9 rounded-full object-cover border border-border"
                      />
                      <div className="flex-1 truncate">
                        <div className="text-xs font-mono text-foreground font-semibold uppercase">
                          Elena Voss (Verified Google Client)
                        </div>
                        <div className="text-[11px] font-mono text-muted truncate">
                          client.atelier@gmail.com
                        </div>
                      </div>
                    </button>

                    <div className="flex space-x-2 pt-1">
                      <input
                        type="email"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="ENTER YOUR OWN GMAIL (e.g. you@gmail.com)"
                        className="flex-1 bg-background border border-border p-2 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => handleDemoSignIn(customGoogleEmail)}
                        disabled={!customGoogleEmail.includes('@')}
                        className="px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-wider font-semibold disabled:opacity-40"
                      >
                        SIGN IN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
