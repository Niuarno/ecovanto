import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';

export const Campaign: React.FC = () => {
  const runwayProducts = PRODUCTS.filter((p) => p.badge === 'RUNWAY' || p.badge === 'SPECIAL EDITION');

  const editorialShots = [
    {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      title: 'ACT I: COLD CONCRETE',
      location: 'KREUZBERG BARRACKS',
    },
    {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      title: 'ACT II: THE BIAS SLIT',
      location: 'MITTE POWER STATION',
    },
    {
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      title: 'ACT III: STEEL POSTURE',
      location: 'FRIEDRICHSHAIN ARCHIVES',
    },
    {
      url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
      title: 'ACT IV: RAW LEATHER MONOCHROME',
      location: 'STUDIO 09',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Top Header */}
        <div className="pb-12 mb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase mb-2">
              <span>EDITORIAL LOOKBOOK</span>
              <span>•</span>
              <span>AUTUMN / WINTER 2026</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-light font-display tracking-[0.15em] uppercase text-white">
              BERLIN <span className="font-serif italic font-normal text-stroke-strong">NOCTURNE</span>
            </h1>
          </div>

          <div className="max-w-md text-xs font-light text-[#8A8A8A] leading-relaxed">
            A visual documentation of nocturnal architecture, heavy bass resonance, and the tension between physical restraint and total liberation.
          </div>
        </div>

        {/* Hero Campaign Stage */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-black border border-white/10 overflow-hidden mb-16 group">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90"
            alt="Campaign Master View"
            className="w-full h-full object-cover filter brightness-90 contrast-[1.08] transition-transform duration-1000 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase">
                SCENE 01
              </span>
              <h2 className="text-2xl md:text-4xl font-light font-display tracking-widest uppercase text-white">
                THE GEOMETRY OF VELOCITY
              </h2>
            </div>

            <Link
              to="/shop?badge=RUNWAY"
              className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors self-start md:self-auto"
            >
              SHOP RUNWAY PIECES
            </Link>
          </div>
        </div>

        {/* Lookbook Editorial Grid (Asymmetrical) */}
        <div className="space-y-16 mb-24">
          <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase mb-8">
            <span>[ LOOKBOOK PLATES ]</span>
            <span>CHRONOLOGICAL SEQUENCE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {editorialShots.map((shot, idx) => (
              <div
                key={idx}
                className="group flex flex-col bg-[#0F0F0F] border border-white/10 overflow-hidden"
              >
                <div className="aspect-[4/5] bg-black overflow-hidden relative">
                  <img
                    src={shot.url}
                    alt={shot.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                  <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest px-2.5 py-1 bg-black/80 text-[#C2C2BE] border border-white/15">
                    PLATE 0{idx + 1}
                  </span>
                </div>

                <div className="p-6 flex justify-between items-center bg-[#0E0E0E] border-t border-white/10">
                  <div>
                    <h3 className="text-sm font-mono tracking-widest uppercase text-white">
                      {shot.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#8A8A8A] tracking-wider uppercase block mt-0.5">
                      LOCATION: {shot.location}
                    </span>
                  </div>

                  <ArrowDownRight className="w-4 h-4 text-[#8A8A8A] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Runway Pieces */}
        <div className="pt-16 border-t border-white/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase block mb-1">
                FEATURED IN CAMPAIGN
              </span>
              <h2 className="text-2xl md:text-4xl font-light font-display tracking-widest uppercase text-white">
                RUNWAY SELECTION
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-mono tracking-widest uppercase text-[#8A8A8A] hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {runwayProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} aspect="3/4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
