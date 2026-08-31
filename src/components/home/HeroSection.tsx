import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const scale = useTransform(scrollY, [0, 800], [1.02, 1.08]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.4]);

  const isDark = theme === 'dark';

  return (
    <section className="relative h-screen min-h-[750px] w-full overflow-hidden bg-background select-none transition-colors">
      {/* Background Image with Cinematic Parallax Scale */}
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90"
          alt="ECOVANTO Editorial Hero"
          className={`w-full h-full object-cover object-center ${
            isDark ? 'brightness-[0.75] contrast-[1.12]' : 'brightness-[0.95] contrast-[1.05]'
          }`}
        />
        {/* Subtle Theme-Responsive Vignette & Gradient Overlays */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-t from-background via-black/30 to-black/60'
              : 'bg-gradient-to-t from-background via-white/20 to-white/40'
          }`}
        />
      </motion.div>

      {/* Editorial Content Layer */}
      <div className="relative z-10 h-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col justify-between pt-28 pb-12 text-foreground">
        {/* Top Editorial Metadata */}
        <div className="flex justify-between items-start text-[10px] md:text-xs font-mono tracking-[0.25em] text-muted uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-foreground inline-block animate-pulse" />
            <span>COLLECTION 2026 // RELEASE 04</span>
          </div>
          <div className="text-right hidden sm:block">
            <span>BERLIN // 52.5200° N, 13.4050° E</span>
          </div>
        </div>

        {/* Asymmetrical Center / Bottom Title Composition */}
        <div className="max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-muted block mb-2">
              WHERE ARCHITECTURAL RIGOR MEETS RAW SENSUALITY
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light font-display tracking-tight uppercase leading-[0.9] text-foreground">
              LIFE <span className="italic font-serif font-normal text-stroke-strong">FORCE</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs md:text-sm font-light text-foreground-secondary max-w-lg leading-relaxed"
          >
            Sculptural corsetry, deconstructed virgin wool suiting, and fluid nocturnal eveningwear engineered for unconventional bodies.
          </motion.p>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-4">
            <Link
              to="/shop"
              data-cursor="link"
              className="px-8 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center space-x-3 group"
            >
              <span>SEE COLLECTION</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </Link>

            <Link
              to="/campaign"
              data-cursor="link"
              className="px-8 py-4 border border-border hover:border-foreground text-foreground font-mono text-xs uppercase tracking-[0.2em] transition-colors"
            >
              BE YOURSELF
            </Link>
          </div>

          <div className="flex items-center space-x-6 text-[10px] font-mono tracking-widest text-muted uppercase">
            <span>[ 001 ] ARCHIVE EDITION</span>
            <span className="hidden md:inline">WORLDWIDE DISPATCH</span>
          </div>
        </div>
      </div>
    </section>
  );
};
