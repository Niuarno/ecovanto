import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, Size } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  aspect?: '3/4' | '4/5';
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspect = '3/4',
  priority = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { showToast, setIsCartOpen } = useUI();

  const favorited = isFavorite(product.id);
  const hasMultipleImages = product.images.length > 1;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    showToast({
      type: 'info',
      title: favorited ? 'REMOVED FROM SAVED' : 'SAVED TO ARCHIVE',
      message: product.name,
      productImage: product.images[0],
    });
  };

  const handleQuickAdd = (e: React.MouseEvent, size: Size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors[0], 1);
    showToast({
      type: 'success',
      title: 'ITEM ADDED',
      message: `${product.name} (SIZE ${size}) added to your bag.`,
      productImage: product.images[0],
    });
    setIsCartOpen(true);
  };

  return (
    <div
      className="group relative flex flex-col bg-surface border border-border overflow-hidden select-none transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link
        to={`/product/${product.slug}`}
        data-cursor="view"
        data-cursor-text="VIEW"
        className={`relative overflow-hidden bg-background ${
          aspect === '4/5' ? 'aspect-[4/5]' : 'aspect-[3/4]'
        }`}
      >
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered && hasMultipleImages ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Secondary Hover Image */}
        {hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} Alternate`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
          {product.badge ? (
            <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 bg-background/90 text-foreground border border-border uppercase backdrop-blur-sm">
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            data-cursor="link"
            className="pointer-events-auto p-2 bg-background/70 hover:bg-background text-foreground backdrop-blur-sm transition-colors border border-border"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                favorited ? 'fill-foreground text-foreground scale-110' : 'stroke-[1.5]'
              }`}
            />
          </button>
        </div>

        {/* Desktop Quick Size Hover Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-2 bg-background/90 backdrop-blur-md border-t border-border hidden md:flex items-center justify-between transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[9px] font-mono tracking-widest text-muted uppercase">
            QUICK ADD:
          </span>
          <div className="flex items-center space-x-1">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleQuickAdd(e, sz)}
                data-cursor="add"
                data-cursor-text={`+ ${sz}`}
                className="px-2 py-1 text-[10px] font-mono tracking-wider text-foreground hover:text-background hover:bg-foreground border border-border transition-colors"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Meta info beneath image */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-surface border-t border-border">
        <div className="flex justify-between items-baseline gap-2">
          <Link
            to={`/product/${product.slug}`}
            data-cursor="link"
            className="text-xs md:text-sm font-light tracking-wider uppercase text-foreground hover:underline truncate"
          >
            {product.name}
          </Link>
          <span className="text-xs md:text-sm font-mono text-foreground flex-shrink-0">
            €{product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-1.5 text-[10px] font-mono text-muted tracking-wider uppercase">
          <span>{product.category}</span>
          <div className="flex items-center space-x-1">
            {product.sizes.map((sz) => (
              <span key={sz} className="opacity-75">
                ({sz})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
