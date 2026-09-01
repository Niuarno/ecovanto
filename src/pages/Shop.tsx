import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';
import { Product, Size, SortOption } from '../types';

export const Shop: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialBadge = searchParams.get('badge') || 'ALL';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<Size | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const sizes: (Size | 'ALL')[] = ['ALL', 'XS', 'S', 'M', 'L', 'XL'];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'ALL') {
      list = list.filter(
        (p) => p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (initialBadge !== 'ALL') {
      list = list.filter((p) => p.badge === initialBadge);
    }

    if (selectedSize !== 'ALL') {
      list = list.filter((p) => p.sizes.includes(selectedSize as Size));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, selectedSize, sortBy, initialBadge]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-border gap-6">
          <div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-2">
              <span>ECOVANTO ARCHIVE</span>
              <span>•</span>
              <span>AUTUMN / WINTER 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light font-display tracking-[0.15em] uppercase text-foreground">
              SHOP ALL
            </h1>
          </div>

          <div className="text-xs font-mono text-muted tracking-widest uppercase">
            SHOWING [{filteredProducts.length} OF {products.length} GARMENTS]
          </div>
        </div>

        {/* Filter & Sorting Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/50">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
            <button
              onClick={() => handleCategoryChange('ALL')}
              className={`px-3 py-1.5 uppercase tracking-widest border transition-colors whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background border-foreground font-bold'
                  : 'text-muted border-border hover:border-foreground/50'
              }`}
            >
              ALL [ {products.length} ]
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-3 py-1.5 uppercase tracking-widest border transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-foreground text-background border-foreground font-bold'
                    : 'text-muted border-border hover:border-foreground/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Size & Sorting Dropdown */}
          <div className="flex items-center space-x-4 text-xs font-mono">
            {/* Size Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-muted uppercase">SIZE:</span>
              <div className="flex border border-border">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-[11px] transition-colors ${
                      selectedSize === sz
                        ? 'bg-foreground text-background font-semibold'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Select */}
            <div className="flex items-center space-x-2 ml-auto sm:ml-0">
              <span className="text-muted uppercase">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-surface border border-border px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-foreground uppercase"
              >
                <option value="featured">CURATED</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="newest">NEW ARRIVALS FIRST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border p-8">
            <h3 className="text-xl font-light tracking-widest uppercase text-foreground mb-2">
              NO PIECES MATCH YOUR CURRENT FILTER
            </h3>
            <p className="text-xs font-mono text-muted mb-6">
              Adjust size selection or browse all categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSize('ALL');
              }}
              className="px-6 py-3 border border-border hover:border-foreground text-xs font-mono tracking-widest uppercase text-foreground transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                aspect="3/4"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
