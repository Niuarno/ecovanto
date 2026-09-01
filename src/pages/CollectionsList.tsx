import React from 'react';
import { Link } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections';
import { ArrowUpRight } from 'lucide-react';

export const CollectionsList: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="pb-10 mb-12 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-2">
              SEASONAL EDITIONS & CAPSULES
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display tracking-[0.15em] uppercase text-foreground">
              COLLECTIONS
            </h1>
          </div>
          <p className="text-xs md:text-sm font-light text-muted max-w-md">
            Thematic archives conceptualized in Berlin and executed across European artisanal workshops.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-12">
          {COLLECTIONS.map((col, index) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group block bg-surface border border-border hover:border-border-strong transition-all duration-500 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                {/* Image (7 cols) */}
                <div className="lg:col-span-7 aspect-[16/10] md:aspect-[16/9] bg-background overflow-hidden relative">
                  <img
                    src={col.heroImage}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest px-2.5 py-1 bg-background/85 text-foreground border border-border">
                    EDITION 0{index + 1}
                  </div>
                </div>

                {/* Info (5 cols) */}
                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-mono tracking-[0.2em] text-muted uppercase">
                      {col.season} // {col.year}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-light font-display tracking-widest uppercase text-foreground group-hover:translate-x-1 transition-transform duration-300">
                      {col.name}
                    </h2>
                    <p className="text-xs md:text-sm font-light text-muted leading-relaxed pt-2">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-mono text-muted">
                      [{col.productCount} ARCHIVED GARMENTS]
                    </span>
                    <span className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-foreground group-hover:underline">
                      <span>EXPLORE CAPSULE</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
