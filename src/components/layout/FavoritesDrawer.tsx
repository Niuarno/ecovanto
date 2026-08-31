import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export const FavoritesDrawer: React.FC = () => {
  const { isFavoritesOpen, setIsFavoritesOpen, setIsCartOpen, showToast } = useUI();
  const { favorites, removeFavorite, totalFavorites } = useFavorites();
  const { addToCart } = useCart();

  if (!isFavoritesOpen) return null;

  const handleQuickAdd = (product: any) => {
    addToCart(product, product.sizes[0], product.colors[0], 1);
    showToast({
      type: 'success',
      title: 'ITEM ADDED',
      message: `${product.name} (SIZE ${product.sizes[0]}) added to bag.`,
      productImage: product.images[0],
    });
    setIsFavoritesOpen(false);
    setIsCartOpen(true);
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
          onClick={() => setIsFavoritesOpen(false)}
        />

        {/* Panel */}
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
                SAVED ARCHIVE
              </span>
              <h3 className="text-sm font-mono tracking-widest uppercase text-foreground mt-0.5 font-medium">
                FAVORITES [{totalFavorites}]
              </h3>
            </div>
            <button
              onClick={() => setIsFavoritesOpen(false)}
              className="text-muted hover:text-foreground transition-colors p-1"
              aria-label="Close Favorites"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Empty */}
          <div className="flex-1 overflow-y-auto my-4 py-2 space-y-4 pr-1">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="text-2xl font-mono text-muted tracking-widest">
                  ♡
                </div>
                <p className="text-sm font-mono tracking-widest uppercase text-muted">
                  NO SAVED GARMENTS
                </p>
                <p className="text-xs font-light text-muted max-w-xs leading-relaxed">
                  Your most stylish finds will be preserved here. Save items by tapping the heart icon across the catalog.
                </p>
                <button
                  onClick={() => setIsFavoritesOpen(false)}
                  className="mt-4 px-6 py-3 border border-border hover:border-foreground text-xs font-mono tracking-widest uppercase text-foreground transition-colors"
                >
                  DISCOVER THE COLLECTION
                </button>
              </div>
            ) : (
              favorites.map((product) => (
                <div
                  key={product.id}
                  className="flex space-x-4 p-3 bg-surface-subtle border border-border relative group"
                >
                  <div className="w-20 h-28 bg-background overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={() => setIsFavoritesOpen(false)}
                          className="text-xs font-mono tracking-wider uppercase text-foreground hover:underline truncate block max-w-[180px]"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFavorite(product.id)}
                          className="text-muted hover:text-red-500 transition-colors p-1"
                          aria-label="Remove favorite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-mono text-foreground font-medium block mt-1">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted">
                        {product.sizes.join(' · ')}
                      </span>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        data-cursor="link"
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-foreground/10 hover:bg-foreground hover:text-background text-foreground text-[10px] font-mono tracking-wider uppercase transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>ADD TO BAG</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => setIsFavoritesOpen(false)}
                className="w-full py-3.5 border border-border hover:border-foreground text-foreground font-mono text-xs uppercase tracking-widest transition-colors"
              >
                CONTINUE BROWSING
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
