import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, Order } from '../context/StoreContext';
import {
  CheckCircle,
  Truck,
  Package,
  Clock,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, getOrderByNumber, orders } = useStore();
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Match either by internal ID or by public order number
  const order = getOrderById(id || '') || getOrderByNumber(id || '') || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-background pt-36 pb-24 text-center px-4 text-foreground select-none">
        <div className="max-w-md mx-auto space-y-6">
          <span className="text-2xl font-mono text-muted">[ ? ]</span>
          <h2 className="text-2xl font-light font-display uppercase tracking-widest text-foreground">
            ORDER NOT LOCATED
          </h2>
          <p className="text-xs font-mono text-muted">
            Please verify the order reference code or browse your archive.
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 border border-border hover:border-foreground text-foreground text-xs font-mono tracking-widest uppercase transition-colors"
          >
            LOOKUP ANOTHER ORDER
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'preparing':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const stepIndex = getStatusStepIndex(order.status);

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Navigation bar */}
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-border text-xs font-mono text-muted">
          <Link
            to="/orders"
            className="hover:text-foreground transition-colors flex items-center space-x-1.5 uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ORDER DIRECTORY</span>
          </Link>

          <button
            onClick={handlePrint}
            className="hover:text-foreground transition-colors flex items-center space-x-1.5 uppercase print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT / SLIP</span>
          </button>
        </div>

        {/* Top Celebration Banner */}
        <div className="p-8 md:p-12 bg-surface border border-border mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              <CheckCircle className="w-4 h-4" />
              <span>TRANSMISSION CONFIRMED & REGISTERED</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light font-display tracking-widest uppercase text-foreground">
              ORDER #{order.orderNumber}
            </h1>
            <p className="text-xs font-mono text-muted">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Client: {order.customer.email}
            </p>
          </div>

          {/* Tracking Card */}
          <div className="p-4 bg-background border border-border space-y-2 self-start md:self-auto">
            <span className="text-[9px] font-mono tracking-widest text-muted uppercase block">
              COURIER TRACKING CODE
            </span>
            <div className="flex items-center space-x-3 text-xs font-mono text-foreground">
              <span className="font-semibold">{order.trackingNumber}</span>
              <button
                onClick={handleCopyTracking}
                className="p-1 hover:bg-foreground/10 text-muted hover:text-foreground transition-colors"
                title="Copy tracking number"
              >
                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] font-mono text-muted block">
              CARRIER: {order.shippingMethod.carrier.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Milestone Fulfillment Stepper */}
        <div className="p-8 bg-surface border border-border mb-12">
          <span className="text-[10px] font-mono tracking-widest text-muted uppercase block mb-8">
            DISPATCH & FULFILLMENT TIMELINE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 1 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-border text-muted'
                  }`}
                >
                  01
                </div>
                <div className="h-[1px] flex-1 bg-border hidden sm:block" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-foreground font-medium block">
                  ORDER REGISTERED
                </span>
                <span className="text-[11px] font-mono text-muted">
                  Payment authorized & inventory reserved.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 2 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-border text-muted'
                  }`}
                >
                  02
                </div>
                <div className="h-[1px] flex-1 bg-border hidden sm:block" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-foreground font-medium block">
                  ATELIER PREPARATION
                </span>
                <span className="text-[11px] font-mono text-muted">
                  Quality inspection & bespoke black packaging.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 3 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-border text-muted'
                  }`}
                >
                  03
                </div>
                <div className="h-[1px] flex-1 bg-border hidden sm:block" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-foreground font-medium block">
                  COURIER DISPATCH
                </span>
                <span className="text-[11px] font-mono text-muted">
                  En route with DHL / UPS Express.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 4 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-border text-muted'
                  }`}
                >
                  04
                </div>
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-foreground font-medium block">
                  DELIVERED
                </span>
                <span className="text-[11px] font-mono text-muted">
                  Safely received at client coordinates.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Items (7 Cols) */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 md:p-8 space-y-6">
            <h2 className="text-sm font-mono tracking-widest uppercase text-foreground pb-3 border-b border-border">
              GARMENTS ACQUIRED [{order.items.length}]
            </h2>

            <div className="divide-y divide-border/50 space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex space-x-4 pt-4 first:pt-0">
                  <div className="w-20 h-28 bg-background overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link
                        to={`/product/${item.productSlug}`}
                        className="text-xs font-mono uppercase text-foreground hover:underline block truncate font-medium"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-[11px] font-mono text-muted mt-1 space-y-0.5">
                        <div>SIZE: {item.size}</div>
                        <div>COLOR: {item.color.name}</div>
                        <div>QTY: {item.quantity}</div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-foreground font-semibold pt-2 border-t border-border">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Coordinates & Financial Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Delivery Info */}
            <div className="bg-surface border border-border p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-mono tracking-widest uppercase text-foreground pb-2 border-b border-border">
                DELIVERY COORDINATES
              </h3>
              <div className="text-xs font-mono text-foreground-secondary space-y-1">
                <div className="text-foreground font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <div>{order.customer.address} {order.customer.apartment && `(${order.customer.apartment})`}</div>
                <div>{order.customer.postalCode} {order.customer.city}</div>
                <div>{order.customer.country}</div>
                <div className="pt-2 text-muted">PHONE: {order.customer.phone}</div>
              </div>
            </div>

            {/* Total Financial Summary */}
            <div className="bg-surface border border-border p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-mono tracking-widest uppercase text-foreground pb-2 border-b border-border">
                FINANCIAL STATEMENT
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-muted">
                  <span>SUBTOTAL:</span>
                  <span className="text-foreground font-medium">€{order.subtotal.toFixed(2)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>DISCOUNT:</span>
                    <span>-€{order.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted">
                  <span>SHIPPING ({order.shippingMethod.carrier}):</span>
                  <span className="text-foreground font-medium">
                    {order.shippingCost === 0 ? 'FREE' : `€${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>VAT (19% INCLUDED):</span>
                  <span className="text-foreground font-medium">€{((order.total * 0.19) / 1.19).toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline text-sm">
                  <span className="text-foreground uppercase font-medium">TOTAL PAID:</span>
                  <span className="text-base text-foreground font-semibold">
                    €{order.total.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 text-[10px] font-mono text-muted">
                  PAYMENT METHOD: {order.paymentMethod.toUpperCase()} {order.paymentDetails?.last4 ? `(••• ${order.paymentDetails.last4})` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <Link
            to="/shop"
            className="px-8 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
          >
            RETURN TO ARCHIVE
          </Link>

          <Link
            to="/contact"
            className="text-xs font-mono tracking-widest text-muted hover:text-foreground uppercase"
          >
            NEED HELP WITH THIS ORDER? CONTACT CONCIERGE ↗
          </Link>
        </div>
      </div>
    </div>
  );
};
