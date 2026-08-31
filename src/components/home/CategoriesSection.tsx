import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { ArrowUpRight } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-32 border-b border-border bg-background select-none transition-colors">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-1">
              <span>[ 03 ]</span>
              <span>INDEXED TAXONOMY</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
              CATEGORIES
            </h2>
          </div>

          <Link
            to="/categories"
            data-cursor="link"
            className="text-xs font-mono tracking-widest uppercase text-muted hover:text-foreground transition-colors flex items-center space-x-2"
          >
            <span>VIEW ALL CATEGORIES</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid / Interactive Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.slice(0, 8).map((category, index) => {
            const isCurrentHovered = hoveredCategory === category.id;
            const isAnyHovered = hoveredCategory !== null;

            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                data-cursor="view"
                data-cursor-text={category.name}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`group relative flex flex-col bg-surface border border-border overflow-hidden transition-all duration-500 ${
                  isAnyHovered && !isCurrentHovered ? 'opacity-40 filter grayscale' : 'opacity-100'
                }`}
              >
                {/* Category Image */}
                <div className="aspect-[4/5] bg-background overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />

                  {/* Count Tag */}
                  <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest px-2 py-0.5 bg-background/85 text-muted border border-border">
                    [{category.count} ITEMS]
                  </span>
                </div>

                {/* Category Label */}
                <div className="p-4 flex items-center justify-between border-t border-border bg-surface-subtle group-hover:bg-surface-elevated transition-colors">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-[10px] font-mono text-muted">0{index + 1}</span>
                    <h3 className="text-xs md:text-sm font-mono tracking-widest uppercase text-foreground font-medium">
                      {category.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
