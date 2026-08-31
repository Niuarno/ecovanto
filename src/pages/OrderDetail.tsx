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
      <div className="min-h-screen bg-[#080808] pt-36 pb-24 text-center px-4 text-[#F4F4F0] select-none">
        <div className="max-w-md mx-auto space-y-6">
          <span className="text-2xl font-mono text-[#555]">[ ? ]</span>
          <h2 className="text-2xl font-light font-display uppercase tracking-widest text-white">
            ORDER NOT LOCATED
          </h2>
          <p className="text-xs font-mono text-[#8A8A8A]">
            Please verify the order reference code or browse your archive.
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 border border-white/20 hover:border-white text-white text-xs font-mono tracking-widest uppercase transition-colors"
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
    <div className="min-h-screen bg-[#080808] pt-24 md:pt-32 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Navigation bar */}
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-white/10 text-xs font-mono text-[#8A8A8A]">
          <Link
            to="/orders"
            className="hover:text-white transition-colors flex items-center space-x-1.5 uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ORDER DIRECTORY</span>
          </Link>

          <button
            onClick={handlePrint}
            className="hover:text-white transition-colors flex items-center space-x-1.5 uppercase print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT / SLIP</span>
          </button>
        </div>

        {/* Top Celebration Banner */}
        <div className="p-8 md:p-12 bg-[#0E0E0E] border border-white/15 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              <CheckCircle className="w-4 h-4" />
              <span>TRANSMISSION CONFIRMED & REGISTERED</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light font-display tracking-widest uppercase text-white">
              ORDER #{order.orderNumber}
            </h1>
            <p className="text-xs font-mono text-[#8A8A8A]">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Client: {order.customer.email}
            </p>
          </div>

          {/* Tracking Card */}
          <div className="p-4 bg-black border border-white/10 space-y-2 self-start md:self-auto">
            <span className="text-[9px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
              COURIER TRACKING CODE
            </span>
            <div className="flex items-center space-x-3 text-xs font-mono text-white">
              <span className="font-semibold">{order.trackingNumber}</span>
              <button
                onClick={handleCopyTracking}
                className="p-1 hover:bg-white/10 text-[#8A8A8A] hover:text-white transition-colors"
                title="Copy tracking number"
              >
                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] font-mono text-[#666] block">
              CARRIER: {order.shippingMethod.carrier.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Milestone Fulfillment Stepper */}
        <div className="p-8 bg-[#0E0E0E] border border-white/10 mb-12">
          <span className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block mb-8">
            DISPATCH & FULFILLMENT TIMELINE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 1 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-white/20 text-[#666]'
                  }`}
                >
                  01
                </div>
                <div className="h-[1px] flex-1 bg-white/10 hidden sm:block" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-white font-medium block">
                  ORDER REGISTERED
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">
                  Payment authorized & inventory reserved.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 2 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-white/20 text-[#666]'
                  }`}
                >
                  02
                </div>
                <div className="h-[1px] flex-1 bg-white/10 hidden sm:block" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-white font-medium block">
                  ATELIER PREPARATION
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">
                  Quality inspection & bespoke black packaging.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 3 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-white/20 text-[#666]'
                  }`}
                >
                  03
                </div>
                <div className="h-[1px] flex-1 bg-white/10 hidden sm:block" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-white font-medium block">
                  COURIER DISPATCH
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">
                  En route with DHL / UPS Express.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono ${
                    stepIndex >= 4 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-white/20 text-[#666]'
                  }`}
                >
                  04
                </div>
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-white font-medium block">
                  DELIVERED
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">
                  Safely received at client coordinates.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Items (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0E0E0E] border border-white/10 p-6 md:p-8 space-y-6">
            <h2 className="text-sm font-mono tracking-widest uppercase text-white pb-3 border-b border-white/10">
              GARMENTS ACQUIRED [{order.items.length}]
            </h2>

            <div className="divide-y divide-white/5 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex space-x-4 pt-4 first:pt-0">
                  <div className="w-20 h-28 bg-black overflow-hidden flex-shrink-0 border border-white/5">
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
                        className="text-xs font-mono uppercase text-white hover:underline block truncate"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-[11px] font-mono text-[#8A8A8A] mt-1 space-y-0.5">
                        <div>SIZE: {item.size}</div>
                        <div>COLOR: {item.color.name}</div>
                        <div>QTY: {item.quantity}</div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-white pt-2 border-t border-white/5">
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
            <div className="bg-[#0E0E0E] border border-white/10 p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-mono tracking-widest uppercase text-white pb-2 border-b border-white/10">
                DELIVERY COORDINATES
              </h3>
              <div className="text-xs font-mono text-[#A0A09C] space-y-1">
                <div className="text-white font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <div>{order.customer.address} {order.customer.apartment && `(${order.customer.apartment})`}</div>
                <div>{order.customer.postalCode} {order.customer.city}</div>
                <div>{order.customer.country}</div>
                <div className="pt-2 text-[#8A8A8A]">PHONE: {order.customer.phone}</div>
              </div>
            </div>

            {/* Total Financial Summary */}
            <div className="bg-[#0E0E0E] border border-white/10 p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-mono tracking-widest uppercase text-white pb-2 border-b border-white/10">
                FINANCIAL STATEMENT
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#8A8A8A]">
                  <span>SUBTOTAL:</span>
                  <span className="text-white">€{order.subtotal.toFixed(2)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>DISCOUNT:</span>
                    <span>-€{order.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#8A8A8A]">
                  <span>SHIPPING ({order.shippingMethod.carrier}):</span>
                  <span className="text-white">
                    {order.shippingCost === 0 ? 'FREE' : `€${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#8A8A8A]">
                  <span>VAT (19% INCLUDED):</span>
                  <span className="text-white">€{((order.total * 0.19) / 1.19).toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm">
                  <span className="text-white uppercase font-medium">TOTAL PAID:</span>
                  <span className="text-base text-white font-semibold">
                    €{order.total.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 text-[10px] font-mono text-[#8A8A8A]">
                  PAYMENT METHOD: {order.paymentMethod.toUpperCase()} (••• {order.paymentDetails.last4})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <Link
            to="/shop"
            className="px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            RETURN TO ARCHIVE
          </Link>

          <Link
            to="/contact"
            className="text-xs font-mono tracking-widest text-[#8A8A8A] hover:text-white uppercase"
          >
            NEED HELP WITH THIS ORDER? CONTACT CONCIERGE ↗
          </Link>
        </div>
      </div>
    </div>
  );
};
