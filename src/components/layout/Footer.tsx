import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border text-foreground pt-16 md:pt-24 pb-12 px-4 md:px-8 lg:px-12 select-none transition-colors">
      <div className="max-w-[1800px] mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <span className="text-xl md:text-2xl font-light font-display tracking-[0.3em] uppercase block">
              ECOVANTO
            </span>
            <p className="text-xs text-muted font-light max-w-sm leading-relaxed">
              Avant-garde womenswear, experimental silhouettes, Berlin club aesthetics and sculptural garments engineered with European precision.
            </p>
            <div className="pt-2 text-[10px] font-mono tracking-widest text-muted">
              ATELIER: KREUZBERG / BERLIN / GERMANY
            </div>

            {/* Theme Swatch Selector in Footer */}
            <div className="pt-2">
              <span className="text-[9px] font-mono text-muted uppercase block mb-1.5">
                VISUAL SPECTRUM
              </span>
              <ThemeToggle variant="compact" />
            </div>
          </div>

          {/* Navigation Col 1 */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase block">
              ARCHIVE
            </span>
            <ul className="space-y-2 text-xs font-mono tracking-wider uppercase text-foreground-secondary">
              <li>
                <Link to="/shop" data-cursor="link" className="hover:text-foreground transition-colors">
                  SHOP ALL
                </Link>
              </li>
              <li>
                <Link to="/categories" data-cursor="link" className="hover:text-foreground transition-colors">
                  CATEGORIES
                </Link>
              </li>
              <li>
                <Link to="/collections" data-cursor="link" className="hover:text-foreground transition-colors">
                  COLLECTIONS
                </Link>
              </li>
              <li>
                <Link to="/campaign" data-cursor="link" className="hover:text-foreground transition-colors">
                  CAMPAIGN 2026
                </Link>
              </li>
              <li>
                <Link to="/shop?badge=NEW+DROP" data-cursor="link" className="hover:text-foreground transition-colors">
                  NEW ARRIVALS
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col 2 */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase block">
              CLIENT CARE
            </span>
            <ul className="space-y-2 text-xs font-mono tracking-wider uppercase text-foreground-secondary">
              <li>
                <Link to="/account" data-cursor="link" className="hover:text-foreground transition-colors text-foreground font-medium">
                  CLIENT ACCOUNT & SIGN IN
                </Link>
              </li>
              <li>
                <Link to="/orders" data-cursor="link" className="hover:text-foreground transition-colors">
                  TRACK DISPATCH
                </Link>
              </li>
              <li>
                <Link to="/checkout" data-cursor="link" className="hover:text-foreground transition-colors">
                  CHECKOUT & BAG
                </Link>
              </li>
              <li>
                <Link to="/shipping" data-cursor="link" className="hover:text-foreground transition-colors">
                  SHIPPING & TRANSIT
                </Link>
              </li>
              <li>
                <Link to="/faq" data-cursor="link" className="hover:text-foreground transition-colors">
                  FAQ & SIZING
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier House */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase block">
              HOUSE OF ECOVANTO
            </span>
            <ul className="space-y-2 text-xs font-mono tracking-wider uppercase text-foreground-secondary">
              <li>
                <Link to="/about" data-cursor="link" className="hover:text-foreground transition-colors">
                  ATELIER MANIFESTO
                </Link>
              </li>
              <li>
                <Link to="/contact" data-cursor="link" className="hover:text-foreground transition-colors">
                  BERLIN SHOWROOM
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="hover:text-foreground transition-colors"
                >
                  INSTAGRAM ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-mono tracking-widest text-muted uppercase">
          <div>
            © 2026 ECOVANTO ATELIER. ALL RIGHTS RESERVED.
          </div>

          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" data-cursor="link" className="hover:text-foreground transition-colors">
              PRIVACY POLICY
            </Link>
            <Link to="/terms" data-cursor="link" className="hover:text-foreground transition-colors">
              TERMS OF SERVICE
            </Link>
            <Link to="/shipping" data-cursor="link" className="hover:text-foreground transition-colors">
              RETURNS & DISPATCH
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
