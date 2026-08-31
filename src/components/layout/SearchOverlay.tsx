import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useSearch } from '../../hooks/useSearch';
import { X, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useUI();
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    totalResults,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setSelectedCategory('ALL');
    }
  }, [isSearchOpen, setQuery, setSelectedCategory]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col justify-start select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-xl"
          onClick={() => setIsSearchOpen(false)}
        />

        {/* Search Header and Input */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-8 text-foreground flex flex-col max-h-screen overflow-y-auto"
        >
          {/* Top Control Bar */}
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
              INSTANT ARCHIVE SEARCH
            </span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-muted hover:text-foreground transition-colors flex items-center space-x-2 text-xs font-mono tracking-widest"
              aria-label="Close Search"
            >
              <span>ESC / CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="mt-8 mb-6">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="TYPE TO SEARCH (E.G. CORSET, WOOL, DRESS)..."
              className="w-full bg-transparent border-b-2 border-border focus:border-foreground text-2xl md:text-5xl font-light font-display py-4 text-foreground placeholder-muted focus:outline-none tracking-wide transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 uppercase tracking-widest border transition-colors whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background border-foreground font-semibold'
                  : 'text-muted border-border hover:border-foreground'
              }`}
            >
              ALL ITEMS
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 uppercase tracking-widest border transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-foreground text-background border-foreground font-semibold'
                    : 'text-muted border-border hover:border-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-muted uppercase mb-6">
              <span>{query ? `RESULTS FOR "${query}"` : 'CURATED SELECTIONS'}</span>
              <span>[{totalResults} ITEMS FOUND]</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-border p-8">
                <p className="text-xl md:text-2xl font-light tracking-widest uppercase text-foreground mb-2">
                  NOTHING MATCHES YOUR SEARCH
                </p>
                <p className="text-xs font-mono text-muted tracking-wider">
                  Try searching for 'Corset', 'Dress', 'Coat', 'Trousers', or reset filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    data-cursor="view"
                    className="group flex flex-col bg-surface border border-border overflow-hidden hover:border-border-strong transition-all duration-300"
                  >
                    <div className="aspect-[3/4] bg-background overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 text-[9px] font-mono tracking-widest px-2 py-0.5 bg-background/90 text-foreground border border-border">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-mono text-muted tracking-widest uppercase">
                          {product.category}
                        </span>
                        <h4 className="text-xs font-medium text-foreground tracking-wider uppercase mt-0.5 group-hover:underline line-clamp-1">
                          {product.name}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                        <span className="text-foreground">€{product.price.toFixed(2)}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
