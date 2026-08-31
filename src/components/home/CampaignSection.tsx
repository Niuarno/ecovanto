import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CampaignSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 border-b border-border bg-background select-none transition-colors">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Index */}
        <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-8">
          <span>[ 02 ]</span>
          <span>EDITORIAL CAMPAIGN</span>
        </div>

        {/* Asymmetrical 65% / 35% Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Large Campaign Image (65%) */}
          <div
            data-cursor="view"
            data-cursor-text="LOOKBOOK"
            className="lg:col-span-8 relative group overflow-hidden bg-surface border border-border aspect-[16/10] md:aspect-[16/9]"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
              alt="Berlin Nocturne Campaign"
              className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <span className="text-[10px] font-mono tracking-widest text-foreground uppercase bg-background/80 px-3 py-1 border border-border backdrop-blur-sm">
                SCENE 04 / MONOCHROME SILHOUETTES
              </span>
              <span className="text-[10px] font-mono text-muted">
                PHOTOGRAPHED IN KREUZBERG
              </span>
            </div>
          </div>

          {/* Text & Manifesto Column (35%) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono tracking-[0.2em] text-muted uppercase">
                SPRING / SUMMER 2026
              </span>
              <h3 className="text-3xl md:text-5xl font-light font-display tracking-tight uppercase leading-tight text-foreground">
                BERLIN <span className="font-serif italic font-normal">NOCTURNE</span>
              </h3>
              <p className="text-xs md:text-sm font-light text-foreground-secondary leading-relaxed">
                Shot across brutalist concrete corridors and underground club entrances at dawn. The campaign documents raw human forms clad in high-twist rib knits, steel-boned corsets, and voluminous overcoats.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex justify-between text-xs font-mono text-muted">
                <span>ART DIRECTION</span>
                <span className="text-foreground">ATELIER ECOVANTO</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-muted">
                <span>STYLING</span>
                <span className="text-foreground">NOCTURNAL UNIFORM</span>
              </div>

              <Link
                to="/campaign"
                data-cursor="link"
                className="inline-flex items-center space-x-3 px-6 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity w-full justify-center mt-4 group"
              >
                <span>SEE CAMPAIGN & LOOKBOOK</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
