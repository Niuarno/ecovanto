import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUI } from '../context/UIContext';
import { Link } from 'react-router-dom';
import { PhoneInput } from '../components/common/PhoneInput';
import { CountrySelect } from '../components/common/CountrySelect';
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

export const Account: React.FC = () => {
  const { user, isAuthenticated, login, loginWithGmail, register, logout, updateProfile } = useAuth();
  const { orders } = useStore();
  const { favorites } = useFavorites();
  const { showToast } = useUI();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address edit in profile
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: user?.defaultAddress?.address || 'Auguststraße 14',
    apartment: user?.defaultAddress?.apartment || '',
    city: user?.defaultAddress?.city || 'Berlin',
    postalCode: user?.defaultAddress?.postalCode || '10117',
    country: user?.defaultAddress?.country || 'Germany',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
    showToast({
      type: 'success',
      title: 'WELCOME BACK',
      message: `Signed in to Atelier account as ${email}.`,
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

  const handleGmailClick = async () => {
    setIsSubmitting(true);
    const gmailUser = await loginWithGmail();
    setIsSubmitting(false);
    showToast({
      type: 'success',
      title: 'GOOGLE AUTHENTICATED',
      message: `Signed in as ${gmailUser.firstName} ${gmailUser.lastName} (${gmailUser.email}).`,
    });
  };

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

  // Filter user orders by email if matching or show all recent customer orders
  const customerOrders = orders.filter(
    (o) => !user || o.customer.email.toLowerCase() === user.email.toLowerCase() || o.customer.lastName.toLowerCase() === user.lastName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {!isAuthenticated || !user ? (
          /* Authentication Screen (Login / Register / Gmail) */
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

            {/* Instant Gmail Login Button */}
            <button
              type="button"
              onClick={handleGmailClick}
              disabled={isSubmitting}
              data-cursor="link"
              className="w-full py-3.5 bg-surface border border-border hover:border-foreground text-foreground text-xs font-mono tracking-widest uppercase transition-colors flex items-center justify-center space-x-3 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                />
              </svg>
              <span>CONTINUE WITH GMAIL</span>
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
                        GMAIL VERIFIED
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
                className="px-6 py-2.5 border border-border hover:border-red-400 text-muted hover:text-red-400 font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-2 self-start md:self-auto"
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
                      className="inline-block px-6 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest"
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
                            <span className="text-[9px] px-1.5 py-0.5 bg-surface-elevated text-foreground uppercase border border-border">
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
