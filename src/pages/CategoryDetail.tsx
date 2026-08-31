import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft } from 'lucide-react';

export const CategoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase()
  );

  const categoryProducts = PRODUCTS.filter(
    (p) => p.categorySlug.toLowerCase() === slug?.toLowerCase()
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-[#080808] pt-36 pb-24 text-center px-4 text-[#F4F4F0]">
        <h2 className="text-2xl font-light font-display uppercase tracking-widest mb-4">
          CATEGORY NOT LOCATED
        </h2>
        <Link
          to="/categories"
          className="text-xs font-mono tracking-widest text-[#8A8A8A] hover:text-white uppercase underline"
        >
          RETURN TO ALL CATEGORIES
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Back Link */}
        <Link
          to="/categories"
          className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#8A8A8A] hover:text-white uppercase mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ALL CATEGORIES</span>
        </Link>

        {/* Category Header with Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 mb-12 border-b border-white/10 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase">
              <span>INDEXED ARCHIVE</span>
              <span>•</span>
              <span>[{categoryProducts.length} GARMENTS]</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display tracking-[0.15em] uppercase text-white">
              {category.name}
            </h1>
            <p className="text-sm md:text-base font-light text-[#A0A09C] max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#111] p-6 border border-white/10">
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block mb-1">
              EDITORIAL NOTE
            </span>
            <p className="text-xs font-serif italic text-[#D8D8D4] leading-relaxed">
              "{category.editorialQuote || 'Sculptural anatomy engineered with European deadstock fabrics and hand-finished seams.'}"
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {categoryProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 p-8">
            <p className="text-lg font-light tracking-widest uppercase text-white mb-2">
              NEW RELEASES IMMINENT
            </p>
            <p className="text-xs font-mono text-[#8A8A8A]">
              Garments for this specific category are currently being finished at the Berlin atelier.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {categoryProducts.map((product) => (
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
