import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft } from 'lucide-react';

export const CollectionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();
  const collection = COLLECTIONS.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase()
  );

  const collectionProducts = products.filter(
    (p) => p.collectionSlug.toLowerCase() === slug?.toLowerCase()
  );

  if (!collection) {
    return (
      <div className="min-h-screen bg-background pt-36 pb-24 text-center px-4 text-foreground select-none">
        <h2 className="text-2xl font-light font-display uppercase tracking-widest mb-4">
          COLLECTION ARCHIVE NOT FOUND
        </h2>
        <Link
          to="/collections"
          className="text-xs font-mono tracking-widest text-muted hover:text-foreground uppercase underline"
        >
          RETURN TO ALL COLLECTIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Back link */}
        <Link
          to="/collections"
          className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-muted hover:text-foreground uppercase mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ALL COLLECTIONS</span>
        </Link>

        {/* Hero Banner for Collection */}
        <div className="relative aspect-[16/8] md:aspect-[21/8] bg-surface border border-border overflow-hidden mb-16">
          <img
            src={collection.heroImage}
            alt={collection.name}
            className="w-full h-full object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/60" />

          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
                {collection.season} // {collection.year}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-light font-display tracking-widest uppercase text-foreground">
                {collection.name}
              </h1>
            </div>

            <span className="text-xs font-mono tracking-widest text-muted uppercase">
              [{collectionProducts.length} PIECES INDEXED]
            </span>
          </div>
        </div>

        {/* Manifesto Block */}
        <div className="max-w-3xl mb-16 pb-12 border-b border-border space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-muted uppercase block">
            COLLECTION MANIFESTO
          </span>
          <p className="text-base md:text-xl font-light text-foreground-secondary leading-relaxed">
            {collection.manifesto}
          </p>
        </div>

        {/* Collection Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {collectionProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              aspect="3/4"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
