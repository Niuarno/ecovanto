import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Size, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUI } from '../context/UIContext';
import { ProductCarousel } from '../components/product/ProductCarousel';
import {
  Heart,
  ZoomIn,
  ChevronDown,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedSize, setSelectedSize] = useState<Size>(product?.sizes[0] || 'S');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Pitch Noir', hex: '#0B0B0B' }
  );
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [quantity] = useState(1);

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    setIsCartOpen,
    setIsSizeGuideOpen,
    setLightboxImage,
    showToast,
  } = useUI();

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-36 pb-24 text-center px-4 text-foreground select-none">
        <h2 className="text-2xl font-light font-display uppercase tracking-widest mb-4">
          GARMENT NOT LOCATED
        </h2>
        <Link to="/shop" className="text-xs font-mono tracking-widest text-muted hover:text-foreground uppercase underline">
          RETURN TO ARCHIVE
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    showToast({
      type: 'success',
      title: 'ITEM ADDED TO BAG',
      message: `${product.name} — SIZE: ${selectedSize} • COLOR: ${selectedColor.name}`,
      productImage: product.images[0],
    });
    setIsCartOpen(true);
  };

  const handleFavoriteClick = () => {
    toggleFavorite(product);
    showToast({
      type: 'info',
      title: favorited ? 'REMOVED FROM SAVED' : 'SAVED TO ARCHIVE',
      message: product.name,
      productImage: product.images[0],
    });
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion((prev) => (prev === name ? null : name));
  };

  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.collectionSlug === product.collectionSlug)
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Breadcrumb Bar */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted uppercase mb-8">
          <Link to="/shop" data-cursor="link" className="hover:text-foreground transition-colors flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ARCHIVE</span>
          </Link>
          <span>/</span>
          <Link
            to={`/categories/${product.categorySlug}`}
            data-cursor="link"
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] font-medium">{product.name}</span>
        </div>

        {/* Asymmetrical 60% / 40% Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* LEFT: Multi-Image Editorial Gallery Stack (7 Cols = ~60%) */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            {product.images.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(imgUrl)}
                data-cursor="view"
                data-cursor-text="EXPAND"
                className="group relative aspect-[3/4] bg-surface border border-border overflow-hidden cursor-zoom-in transition-colors"
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} View 0${idx + 1}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                />

                {/* View Overlay Tag */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 bg-background/85 text-foreground border border-border backdrop-blur-sm">
                    PERSPECTIVE 0{idx + 1} / 0{product.images.length}
                  </span>
                </div>

                {/* Zoom Hint */}
                <div className="absolute bottom-4 right-4 p-2 bg-background/80 text-muted group-hover:text-foreground border border-border backdrop-blur-sm transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Fixed/Sticky Product Info Panel (5 Cols = ~40%) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 bg-surface p-6 md:p-8 border border-border transition-colors">
            {/* Header / Title */}
            <div className="space-y-3 pb-6 border-b border-border">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
                  {product.collection} // {product.category}
                </span>

                {product.badge && (
                  <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 bg-foreground text-background font-semibold uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-light font-display tracking-widest uppercase text-foreground">
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-3 text-lg md:text-xl font-mono pt-1">
                <span className="text-foreground font-semibold">€{product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm line-through text-muted">
                    €{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[10px] font-mono text-muted uppercase">
                  (VAT INCL.)
                </span>
              </div>

              {product.tagline && (
                <p className="text-xs font-serif italic text-foreground-secondary pt-1">
                  "{product.tagline}"
                </p>
              )}
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono tracking-wider text-muted uppercase">
                <span>COLOR: <span className="text-foreground font-semibold">{selectedColor.name}</span></span>
              </div>

              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    data-cursor="link"
                    className={`flex items-center space-x-2 px-3 py-2 border transition-all text-xs font-mono ${
                      selectedColor.name === color.name
                        ? 'border-foreground bg-background text-foreground font-semibold shadow-sm'
                        : 'border-border text-muted hover:border-foreground/50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 border border-border inline-block"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="uppercase text-[11px]">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono tracking-wider uppercase">
                <span className="text-muted">
                  SELECT SIZE: <span className="text-foreground font-semibold">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  data-cursor="link"
                  className="text-foreground hover:underline text-[11px] tracking-widest underline decoration-foreground/40 underline-offset-4"
                >
                  SIZE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    data-cursor="link"
                    className={`py-3 text-xs font-mono tracking-wider transition-all border ${
                      selectedSize === sz
                        ? 'bg-foreground text-background border-foreground font-bold'
                        : 'bg-background text-muted border-border hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability Notice */}
            <div className="flex items-center space-x-2 text-[11px] font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {product.stock <= 4
                  ? `URGENT: ONLY ${product.stock} PIECES REMAINING IN ATELIER`
                  : `LIMITED RUN: ${product.stock} PIECES IN BERLIN ATELIER`}
              </span>
            </div>

            {/* Add to Bag & Wishlist Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                data-cursor="link"
                className="w-full py-4 bg-foreground text-background font-mono text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 font-semibold"
              >
                <span>ADD TO BAG</span>
                <span>—</span>
                <span>€{product.price.toFixed(2)}</span>
              </button>

              <button
                onClick={handleFavoriteClick}
                data-cursor="link"
                className={`w-full py-3.5 border text-xs font-mono tracking-widest uppercase transition-colors flex items-center justify-center space-x-2 ${
                  favorited
                    ? 'border-foreground bg-background text-foreground'
                    : 'border-border hover:border-foreground text-muted hover:text-foreground'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorited ? 'fill-foreground text-foreground' : ''
                  }`}
                />
                <span>{favorited ? 'SAVED IN FAVORITES' : 'SAVE TO WISHLIST'}</span>
              </button>
            </div>

            {/* Minimal Accordion Information */}
            <div className="pt-4 border-t border-border divide-y divide-border text-xs font-mono">
              <div>
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-4 flex justify-between items-center text-left text-foreground uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  <span>GARMENT DETAILS & COMPOSITION</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'details' && (
                  <div className="pb-4 space-y-3 text-foreground-secondary font-light leading-relaxed">
                    <p>{product.description}</p>
                    <ul className="space-y-1.5 list-disc list-inside pt-2 text-foreground font-normal">
                      {product.details.map((dt, idx) => (
                        <li key={idx}>{dt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-4 flex justify-between items-center text-left text-foreground uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  <span>CARE & PRESERVATION</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'care' && (
                  <div className="pb-4 space-y-2 text-foreground-secondary font-light leading-relaxed">
                    <ul className="space-y-1.5 list-disc list-inside text-foreground font-normal">
                      {product.care.map((cr, idx) => (
                        <li key={idx}>{cr}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-4 flex justify-between items-center text-left text-foreground uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  <span>SHIPPING & ATELIER RETURNS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="pb-4 space-y-3 text-foreground-secondary font-light leading-relaxed">
                    <p>{product.shippingInfo || 'Complimentary DHL Express across the EU on orders over €500. Worldwide express delivery within 3-5 business days.'}</p>
                    <p>14-day return window upon delivery. Garments must remain unworn with all studio security seals intact.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-[10px] font-mono text-muted text-center">
              <div className="space-y-1">
                <Truck className="w-4 h-4 mx-auto text-foreground" />
                <span>EXPRESS COURIER</span>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-foreground" />
                <span>AUTHENTIC RUNWAY</span>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-4 h-4 mx-auto text-foreground" />
                <span>14-DAY RETURNS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
            <ProductCarousel
              products={relatedProducts}
              title="YOU MAY ALSO DISCOVER"
              subtitle="CURATED COMPANION PIECES"
              sectionNumber="07"
            />
          </div>
        )}
      </div>
    </div>
  );
};
