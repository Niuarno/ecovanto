import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore, ShippingMethod } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { CountrySelect } from '../components/common/CountrySelect';
import { PhoneInput } from '../components/common/PhoneInput';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'dhl_express',
    name: 'DHL Express European Priority',
    carrier: 'DHL Express',
    price: 18,
    deliveryTime: '1-2 Business Days (Tracked)',
  },
  {
    id: 'ups_saver',
    name: 'UPS Express Carbon Neutral',
    carrier: 'UPS',
    price: 25,
    deliveryTime: '2-3 Business Days (Signature Required)',
  },
  {
    id: 'atelier_courier',
    name: 'Atelier White Glove Hand Delivery',
    carrier: 'Private Courier',
    price: 45,
    deliveryTime: 'Next Day Scheduled Time Window',
  },
];

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { createOrder, settings, getActiveGatewaysList } = useStore();
  const { user } = useAuth();
  const { showToast } = useUI();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State with user profile auto-fill
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.defaultAddress?.address || '',
    apartment: user?.defaultAddress?.apartment || '',
    city: user?.defaultAddress?.city || '',
    postalCode: user?.defaultAddress?.postalCode || '',
    country: user?.defaultAddress?.country || 'Germany',
  });

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_METHODS[0]);

  // Active payment gateways from admin config
  const activeGateways = getActiveGatewaysList();
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>(
    activeGateways[0]?.id || 'stripe'
  );

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const actualShippingCost = subtotal >= settings.freeShippingThreshold ? 0 : selectedShipping.price;
  const orderTotal = Math.max(subtotal - discountAmount + actualShippingCost, 0);

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-background pt-36 pb-24 text-center px-4 text-foreground select-none transition-colors">
        <div className="max-w-md mx-auto space-y-6">
          <span className="text-2xl font-mono text-muted">[ 00 ]</span>
          <h2 className="text-2xl font-light font-display uppercase tracking-widest text-foreground">
            YOUR BAG IS EMPTY
          </h2>
          <p className="text-xs font-mono text-muted">
            Select garments from the archive before initiating checkout.
          </p>
          <Link
            to="/shop"
            data-cursor="link"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
          >
            <span>EXPLORE ARCHIVE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData((prev) => ({ ...prev, number: formatted.slice(0, 19) }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 2) {
      setCardData((prev) => ({ ...prev, expiry: raw }));
    } else {
      setCardData((prev) => ({ ...prev, expiry: `${raw.slice(0, 2)}/${raw.slice(2, 4)}` }));
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    if (promoInput.trim().toUpperCase() === settings.discountCode.toUpperCase()) {
      const discount = (subtotal * settings.discountPercentage) / 100;
      setDiscountAmount(discount);
      setAppliedPromo(settings.discountCode);
      showToast({
        type: 'success',
        title: 'DISCOUNT APPLIED',
        message: `${settings.discountPercentage}% Atelier discount deducted from total.`,
      });
    } else {
      setPromoError(`INVALID VOUCHER CODE. TRY "${settings.discountCode}"`);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      showToast({
        type: 'error',
        title: 'INCOMPLETE COORDINATES',
        message: 'Please provide complete delivery details.',
      });
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalPlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        image: item.product.images[0],
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
      }));

      const newOrder = createOrder({
        customer: formData,
        shippingMethod: selectedShipping,
        paymentMethod: selectedGatewayId,
        paymentDetails: {
          last4: cardData.number.slice(-4) || '8821',
          brand: selectedGatewayId.toUpperCase(),
          cardHolder: cardData.name || `${formData.firstName} ${formData.lastName}`,
        },
        items: orderItems,
        subtotal,
        shippingCost: actualShippingCost,
        discount: discountAmount,
        total: orderTotal,
      });

      clearCart();
      setIsProcessing(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F4F4F0', '#8A8A8A', '#222222', '#FFFFFF'],
        });
      } catch (err) {
        console.error(err);
      }

      showToast({
        type: 'success',
        title: 'ORDER TRANSMITTED',
        message: `Reference #${newOrder.orderNumber} successfully registered at Atelier dispatch.`,
      });

      navigate(`/orders/${newOrder.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-border gap-4">
          <div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-1.5">
              <span>SECURE ENCRYPTED DISPATCH</span>
              <span>•</span>
              <span>STEP 0{currentStep} / 02</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
              CHECKOUT
            </h1>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest uppercase">
            <button
              onClick={() => setCurrentStep(1)}
              data-cursor="link"
              className={`flex items-center space-x-1.5 ${
                currentStep === 1 ? 'text-foreground font-semibold' : 'text-muted'
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                1
              </span>
              <span>COORDINATES</span>
            </button>
            <span className="text-border">──</span>
            <span
              className={`flex items-center space-x-1.5 ${
                currentStep === 2 ? 'text-foreground font-semibold' : 'text-muted'
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                2
              </span>
              <span>PAYMENT</span>
            </span>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* LEFT: Step Forms (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {currentStep === 1 ? (
              /* STEP 1: Shipping Coordinates Form */
              <form onSubmit={handleProceedToPayment} className="space-y-8">
                {/* Contact Information */}
                <div className="p-6 md:p-8 bg-surface border border-border space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                      01 / CONTACT INFORMATION
                    </h2>
                    <span className="text-[10px] font-mono text-muted flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>256-BIT TLS SECURE</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="CLIENT@DOMAIN.COM"
                        className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) => setFormData((p) => ({ ...p, phone: val }))}
                        label="PHONE (FOR COURIER NOTIFICATIONS) *"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Coordinates */}
                <div className="p-6 md:p-8 bg-surface border border-border space-y-6">
                  <h2 className="text-sm font-mono tracking-widest uppercase text-foreground pb-3 border-b border-border">
                    02 / DELIVERY ADDRESS
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                        FIRST NAME *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
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
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="KAUFMANN"
                        className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                      STREET ADDRESS *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="E.G. TORSTRASSE 84"
                      className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                        APARTMENT / SUITE
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        placeholder="APT 3B"
                        className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                        CITY *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="BERLIN"
                        className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                        POSTAL CODE *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="10119"
                        className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <CountrySelect
                      value={formData.country}
                      onChange={(c) => setFormData((p) => ({ ...p, country: c }))}
                      label="COUNTRY / TERRITORY *"
                    />
                  </div>
                </div>

                {/* Shipping Method Selector */}
                <div className="p-6 md:p-8 bg-surface border border-border space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-sm font-mono tracking-widest uppercase text-foreground">
                      03 / SELECT EXPRESS COURIER
                    </h2>
                    {subtotal >= settings.freeShippingThreshold && (
                      <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800">
                        FREE SHIPPING UNLOCKED
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => {
                      const isFree = subtotal >= settings.freeShippingThreshold;
                      const isSelected = selectedShipping.id === method.id;

                      return (
                        <div
                          key={method.id}
                          onClick={() => setSelectedShipping(method)}
                          data-cursor="link"
                          className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-foreground bg-background shadow-sm'
                              : 'border-border bg-surface-subtle hover:border-foreground/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-foreground bg-foreground' : 'border-muted'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-background" />}
                            </div>
                            <div>
                              <span className="text-xs font-mono tracking-wider uppercase text-foreground font-medium block">
                                {method.name}
                              </span>
                              <span className="text-[11px] font-light text-muted">
                                {method.deliveryTime}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs font-mono text-foreground font-semibold">
                            {isFree ? (
                              <span className="text-emerald-400">FREE (WAIVED)</span>
                            ) : (
                              `€${method.price.toFixed(2)}`
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  data-cursor="link"
                  className="w-full py-4 bg-foreground hover:opacity-90 text-background font-mono text-xs uppercase tracking-widest transition-opacity flex items-center justify-center space-x-2 font-semibold group"
                >
                  <span>CONTINUE TO PAYMENT PROTOCOL</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              /* STEP 2: Payment Protocol with Dynamic Gateways */
              <form onSubmit={handleFinalPlaceOrder} className="space-y-8">
                {/* Summary of Shipping info */}
                <div className="p-6 bg-surface border border-border flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">DELIVERING TO:</span>
                    <span className="text-foreground font-medium">
                      {formData.firstName} {formData.lastName} — {formData.address}, {formData.city} ({formData.country})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-muted hover:text-foreground underline underline-offset-4"
                  >
                    EDIT
                  </button>
                </div>

                {/* Payment Method Selector based on active configured gateways */}
                <div className="p-6 md:p-8 bg-surface border border-border space-y-6">
                  <h2 className="text-sm font-mono tracking-widest uppercase text-foreground pb-3 border-b border-border">
                    ACTIVE PAYMENT GATEWAYS
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {activeGateways.map((gw) => (
                      <button
                        type="button"
                        key={gw.id}
                        onClick={() => setSelectedGatewayId(gw.id)}
                        data-cursor="link"
                        className={`p-3.5 text-xs font-mono tracking-wider border transition-colors flex items-center justify-between text-left ${
                          selectedGatewayId === gw.id
                            ? 'border-foreground bg-background text-foreground font-bold shadow-sm'
                            : 'border-border text-muted hover:border-foreground/50 hover:text-foreground'
                        }`}
                      >
                        <div className="truncate pr-1">
                          <span className="block truncate text-[11px] uppercase">{gw.name}</span>
                        </div>
                        {selectedGatewayId === gw.id && <Check className="w-3.5 h-3.5 text-foreground flex-shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Gateway Form Details */}
                  {(selectedGatewayId === 'stripe' || selectedGatewayId === 'cards') && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                          CARD NUMBER *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            placeholder="4532 •••• •••• 8821"
                            className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                          />
                          <div className="absolute right-3 top-3 text-[10px] font-mono text-muted">
                            VISA / MC / AMEX
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                          CARDHOLDER FULL NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardData.name}
                          onChange={(e) => setCardData((p) => ({ ...p, name: e.target.value }))}
                          placeholder="AS PRINTED ON CARD"
                          className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                            EXPIRATION (MM/YY) *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            placeholder="08/28"
                            className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                            SECURITY CODE (CVV) *
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData((p) => ({ ...p, cvv: e.target.value }))}
                            placeholder="•••"
                            className="w-full bg-background border border-border p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedGatewayId === 'paypal' && (
                    <div className="p-6 bg-background border border-border text-center space-y-2">
                      <span className="font-serif italic font-bold text-xl">PayPal Express</span>
                      <p className="text-xs font-mono text-muted">
                        You will be securely routed to PayPal to finalize transaction tokenization.
                      </p>
                    </div>
                  )}

                  {selectedGatewayId === 'apple_pay' && (
                    <div className="p-6 bg-background border border-border text-center space-y-2">
                      <span className="text-3xl"></span>
                      <p className="text-xs font-mono text-muted">
                        Authenticate instantaneously using Apple Pay FaceID or TouchID on submission.
                      </p>
                    </div>
                  )}

                  {selectedGatewayId === 'google_pay' && (
                    <div className="p-6 bg-background border border-border text-center space-y-2">
                      <span className="font-mono text-lg font-bold">G Pay</span>
                      <p className="text-xs font-mono text-muted">
                        Google Pay tokenization encrypted under Google Merchant ID.
                      </p>
                    </div>
                  )}

                  {selectedGatewayId === 'amazon_pay' && (
                    <div className="p-6 bg-background border border-border text-center space-y-2">
                      <span className="font-mono text-lg font-bold">amazon pay</span>
                      <p className="text-xs font-mono text-muted">
                        Pay securely with addresses and payment credentials stored in your Amazon wallet.
                      </p>
                    </div>
                  )}

                  {selectedGatewayId === 'bank_wire' && (
                    <div className="p-6 bg-background border border-border space-y-2 text-xs font-mono">
                      <span className="text-foreground font-semibold uppercase block">
                        DIRECT SEPA BANK WIRE SPECIFICATIONS
                      </span>
                      <p className="text-muted">
                        IBAN: {settings.gateways.bankWire.iban || 'DE89 3704 0044 0532 0130 00'}
                      </p>
                      <p className="text-muted">
                        BIC/SWIFT: {settings.gateways.bankWire.bic || 'DBEUTDDBXXX'}
                      </p>
                      <p className="text-muted">
                        BANK: {settings.gateways.bankWire.bankName || 'Deutsche Bank Berlin'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    data-cursor="link"
                    className="px-6 py-4 border border-border hover:border-foreground text-foreground font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>BACK</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    data-cursor="link"
                    className="flex-1 py-4 bg-foreground hover:opacity-90 text-background font-mono text-xs uppercase tracking-widest transition-opacity flex items-center justify-center space-x-2 font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>ENCRYPTING & AUTHORIZING...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>AUTHORIZE & PLACE ORDER (€{orderTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: Order Summary Sidebar (5 Cols) */}
          <div className="lg:col-span-5 bg-surface border border-border p-6 md:p-8 space-y-6 lg:sticky lg:top-28">
            <h3 className="text-sm font-mono tracking-widest uppercase text-foreground pb-3 border-b border-border">
              ACQUISITION SUMMARY [{cart.reduce((s, i) => s + i.quantity, 0)} ITEMS]
            </h3>

            {/* Cart Items Preview */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                  className="flex space-x-4 py-2 border-b border-border/50"
                >
                  <div className="w-16 h-20 bg-background overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-foreground truncate font-medium">
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] font-mono text-muted mt-0.5">
                        SIZE: {item.selectedSize} • {item.selectedColor.name} • QTY: {item.quantity}
                      </div>
                    </div>

                    <span className="text-xs font-mono text-foreground font-semibold">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2 border-t border-border">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="VOUCHER (TRY 'ATELIER10')"
                  className="flex-1 bg-background border border-border px-3 py-2 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground uppercase"
                />
                <button
                  type="submit"
                  data-cursor="link"
                  className="px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
                >
                  APPLY
                </button>
              </div>

              {appliedPromo && (
                <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>VOUCHER '{appliedPromo}' APPLIED</span>
                </div>
              )}

              {promoError && (
                <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{promoError}</span>
                </div>
              )}
            </form>

            {/* Total Breakdown */}
            <div className="pt-4 border-t border-border space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-muted">
                <span>SUBTOTAL:</span>
                <span className="text-foreground font-medium">€{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>ATELIER VOUCHER DISCOUNT:</span>
                  <span>-€{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span>EXPRESS COURIER DISPATCH:</span>
                <span className="text-foreground font-medium">
                  {actualShippingCost === 0 ? 'FREE (WAIVED)' : `€${actualShippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-muted">
                <span>STATUTORY GERMAN VAT (19% INCL.):</span>
                <span className="text-foreground font-medium">€{((orderTotal * 0.19) / 1.19).toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline text-sm">
                <span className="text-foreground uppercase font-medium">TOTAL DUE:</span>
                <span className="text-lg text-foreground font-bold">
                  €{orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="p-4 bg-background border border-border space-y-2 text-[10px] font-mono text-muted">
              <div className="flex items-center space-x-2 text-foreground font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ATELIER AUTHENTICITY GUARANTEE</span>
              </div>
              <p>
                Every garment is individually serialized and inspected before departing our Berlin workshop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
