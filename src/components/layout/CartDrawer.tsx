import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isCartOpen, setIsCartOpen } = useUI();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();
  const { settings } = useStore();

  const freeShippingThreshold = settings.freeShippingThreshold || 500;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-surface border-l border-border h-full flex flex-col justify-between z-10 text-foreground p-6 md:p-8 transition-colors"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                SHOPPING BAG
              </span>
              <h3 className="text-sm font-mono tracking-widest uppercase text-foreground mt-0.5 font-medium">
                YOUR BAG [{totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}]
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-muted hover:text-foreground transition-colors p-1"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          {cart.length > 0 && (
            <div className="py-3 border-b border-border text-xs font-mono">
              <div className="flex justify-between items-center text-[10px] text-muted uppercase mb-1.5">
                <span>
                  {remainingForFreeShipping === 0
                    ? 'COMPLIMENTARY EU EXPRESS SHIPPING UNLOCKED'
                    : `ADD €${remainingForFreeShipping.toFixed(0)} FOR FREE EXPRESS SHIPPING`}
                </span>
                <span>{progressToFreeShipping.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1 bg-border rounded-none overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Body content */}
          <div className="flex-1 overflow-y-auto my-4 py-2 space-y-4 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="text-2xl font-mono text-muted tracking-widest">
                  [ 00 ]
                </div>
                <p className="text-sm font-mono tracking-widest uppercase text-muted">
                  YOUR BAG IS CURRENTLY EMPTY
                </p>
                <p className="text-xs font-light text-muted max-w-xs">
                  Garments added to your bag will be reserved here during your session.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-3 border border-border hover:border-foreground text-xs font-mono tracking-widest uppercase text-foreground transition-colors"
                >
                  EXPLORE NEW ARRIVALS
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                  className="flex space-x-4 p-3 bg-surface-subtle border border-border relative group"
                >
                  {/* Product Thumbnail */}
                  <div className="w-20 h-28 bg-background overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info & Adjusters */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-mono tracking-wider uppercase text-foreground hover:underline truncate block max-w-[180px]"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name
                            )
                          }
                          className="text-muted hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] font-mono text-muted mt-1">
                        <span>SIZE: {item.selectedSize}</span>
                        <span>•</span>
                        <span>{item.selectedColor.name}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name,
                              -1
                            )
                          }
                          className="p-1 hover:bg-foreground/10 text-muted hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name,
                              1
                            )
                          }
                          className="p-1 hover:bg-foreground/10 text-muted hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <span className="text-xs font-mono text-foreground font-medium">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex justify-between items-baseline text-xs font-mono">
                <span className="text-muted uppercase tracking-widest">SUBTOTAL</span>
                <span className="text-base text-foreground font-semibold tracking-wider">
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-[10px] font-light text-muted leading-relaxed">
                Taxes, customs and express courier handling calculated at checkout.
              </p>

              <button
                onClick={handleGoToCheckout}
                data-cursor="link"
                className="w-full py-4 bg-foreground hover:opacity-90 text-background font-mono text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-opacity group"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-[10px] font-mono tracking-widest uppercase text-muted hover:text-foreground transition-colors py-1"
              >
                [ CONTINUE BROWSING ]
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
