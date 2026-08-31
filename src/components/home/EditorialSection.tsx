import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 border-b border-border bg-background select-none transition-colors">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-12">
          <span>[ 04 ]</span>
          <span>COLLECTION & EDITORIAL STUDY</span>
        </div>

        {/* Asymmetrical Complex Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Visual Feature (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div
              data-cursor="view"
              data-cursor-text="DISCOVER"
              className="relative aspect-[4/5] bg-surface border border-border overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85"
                alt="Berlin Vibes Collection"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                    FEATURED CAPSULE
                  </span>
                  <h3 className="text-2xl md:text-4xl font-light font-display tracking-widest uppercase text-foreground">
                    BERLIN VIBES
                  </h3>
                </div>
                <Link
                  to="/collections/berlin-vibes"
                  data-cursor="link"
                  className="px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  EXPLORE DROP
                </Link>
              </div>
            </div>

            <p className="text-xs md:text-sm font-light text-foreground-secondary max-w-xl leading-relaxed">
              Designed around nocturnal rituals, heavy industrial soundscapes, and European subcultures. Garments that balance sensual geometry with functional utility.
            </p>
          </div>

          {/* Sub Categories & Editorial Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Sub Tile 1: Dresses */}
            <Link
              to="/categories/dresses"
              data-cursor="view"
              data-cursor-text="DRESSES"
              className="group block border border-border bg-surface p-6 hover:border-border-strong transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                    EDITORIAL FOCUS
                  </span>
                  <h4 className="text-xl md:text-2xl font-light tracking-widest uppercase text-foreground mt-1">
                    SCULPTURAL DRESSES
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted group-hover:text-foreground">
                  [24 PIECES]
                </span>
              </div>

              <div className="aspect-[16/9] bg-background overflow-hidden relative mb-4">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                  alt="Sculptural Dresses"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-muted uppercase pt-2 border-t border-border">
                <span>VIEW ARCHIVE</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>

            {/* Sub Tile 2: Corsets */}
            <Link
              to="/categories/corsets"
              data-cursor="view"
              data-cursor-text="CORSETS"
              className="group block border border-border bg-surface p-6 hover:border-border-strong transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                    INTERNAL ENGINEERING
                  </span>
                  <h4 className="text-xl md:text-2xl font-light tracking-widest uppercase text-foreground mt-1">
                    ANATOMICAL CORSETS
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted group-hover:text-foreground">
                  [08 PIECES]
                </span>
              </div>

              <div className="aspect-[16/9] bg-background overflow-hidden relative mb-4">
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"
                  alt="Anatomical Corsets"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-muted uppercase pt-2 border-t border-border">
                <span>VIEW ARCHIVE</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
