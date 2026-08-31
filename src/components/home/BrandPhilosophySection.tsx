import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const BrandPhilosophySection: React.FC = () => {
  return (
    <section className="py-24 md:py-36 border-b border-border bg-background select-none transition-colors">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-16">
          <span>[ 05 ]</span>
          <span>ATELIER PHILOSOPHY & MANIFESTO</span>
        </div>

        {/* Large Typography Statement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Manifesto Headline (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-light font-display tracking-tight uppercase leading-[0.95] text-foreground">
              SPACE. <br />
              <span className="font-serif italic font-normal text-stroke-strong">FREEDOM.</span> <br />
              FRICTION.
            </h2>

            <div className="w-24 h-[1px] bg-border-strong" />

            <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed max-w-xl">
              We reject the commercial cycle of decorative fast fashion. Every garment created at ATELIER ECOVANTO is treated as an architectural sculpture built for the human body in movement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border text-xs font-mono">
              <div>
                <span className="text-muted block mb-1">01 / MATERIAL INTEGRITY</span>
                <p className="text-foreground-secondary font-light leading-relaxed">
                  Austrian virgin wools, Italian deadstock cupro, high-twist rib knits and vegetable-tanned full-grain leathers.
                </p>
              </div>
              <div>
                <span className="text-muted block mb-1">02 / INTERNAL STRUCTURE</span>
                <p className="text-foreground-secondary font-light leading-relaxed">
                  Medical-grade spring steel spiral boning and engineered bias cuts providing posture without physical restriction.
                </p>
              </div>
            </div>

            <Link
              to="/about"
              data-cursor="link"
              className="inline-flex items-center space-x-3 px-8 py-4 border border-border hover:border-foreground text-foreground font-mono text-xs uppercase tracking-widest transition-colors group mt-4"
            >
              <span>READ THE COMPLETE MANIFESTO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetric Imagery (5 Cols) */}
          <div
            data-cursor="view"
            data-cursor-text="MANIFESTO"
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[3/4] bg-surface border border-border overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85"
                alt="Atelier Sculpture Manifesto"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-[10px] font-mono text-muted flex justify-between">
                <span>SCULPTURAL ANATOMY</span>
                <span>BERLIN STUDIO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
