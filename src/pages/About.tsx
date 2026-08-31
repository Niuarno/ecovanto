import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Top Header */}
        <div className="pb-12 mb-16 border-b border-white/10">
          <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase mb-4">
            <span>ATELIER MANIFESTO</span>
            <span>•</span>
            <span>FOUNDED IN BERLIN</span>
          </div>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-light font-display tracking-[0.1em] uppercase text-white leading-none">
            WHO WE ARE
          </h1>
        </div>

        {/* Section 1: Philosophy Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl md:text-4xl font-light font-display uppercase tracking-widest text-white leading-snug">
              AN EXPERIMENTAL ATELIER AT THE INTERSECTION OF ARCHITECTURAL FORM AND NOCTURNAL SUBVERTED LUXURY.
            </h2>
            <div className="w-16 h-[1px] bg-white/20" />
            <p className="text-sm font-light text-[#A0A09C] leading-relaxed">
              ECOVANTO was conceived in Kreuzberg, Berlin as a rebellion against seasonal trend cycles. We do not manufacture disposable trends. We architect permanent wearable sculptures designed to give the human frame presence, protection, and uncompromising posture.
            </p>
            <p className="text-sm font-light text-[#A0A09C] leading-relaxed">
              Each piece begins with internal engineering — whether that means internal medical spiral boning in our corsetry or floating horsehair canvas inside our tailored virgin wool blazers.
            </p>
          </div>

          <div className="lg:col-span-6 aspect-[4/5] bg-black border border-white/10 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
              alt="Atelier Sculpture"
              className="w-full h-full object-cover filter grayscale contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-[10px] font-mono tracking-widest text-[#8A8A8A]">
              KREUZBERG ATELIER // ARCHITECTURAL FITTING
            </div>
          </div>
        </div>

        {/* Section 2: Core Pillars */}
        <div className="py-16 border-t border-b border-white/10 mb-24">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase block mb-12">
            THREE PRINCIPLES OF CONSTRUCTION
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono">
            <div className="p-6 bg-[#0E0E0E] border border-white/10 space-y-4">
              <span className="text-sm text-[#555] block">01 / ARCHITECTURE</span>
              <h3 className="text-base text-white uppercase tracking-widest font-semibold">
                ANATOMICAL POSTURE
              </h3>
              <p className="text-[#8A8A8A] font-light leading-relaxed">
                Garments engineered with ergonomic spiral seams, internal boning, and bias draping that contours to the wearer's anatomy while allowing fluid, unencumbered movement.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E0E] border border-white/10 space-y-4">
              <span className="text-sm text-[#555] block">02 / MATERIALITY</span>
              <h3 className="text-base text-white uppercase tracking-widest font-semibold">
                DEADSTOCK PURITY
              </h3>
              <p className="text-[#8A8A8A] font-light leading-relaxed">
                We source exclusively from historic Italian and Austrian luxury mills, salvaging deadstock virgin wools, cupro linings, and heavyweight vegetable-tanned bridal leathers.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E0E] border border-white/10 space-y-4">
              <span className="text-sm text-[#555] block">03 / MONOCHROME</span>
              <h3 className="text-base text-white uppercase tracking-widest font-semibold">
                DARK SPECTRUM
              </h3>
              <p className="text-[#8A8A8A] font-light leading-relaxed">
                Focusing purely on shades of obsidian, charcoal, graphite, chalk bone and pitch noir. Textures and surface lustres speak louder than arbitrary color palettes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-[#111] border border-white/10 gap-6">
          <div>
            <h3 className="text-xl font-light font-display uppercase tracking-widest text-white">
              VISIT THE BERLIN SHOWROOM
            </h3>
            <p className="text-xs font-mono text-[#8A8A8A] mt-1">
              Private appointments available Tuesday through Saturday.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center space-x-2 flex-shrink-0"
          >
            <span>BOOK PRIVATE APPOINTMENT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
