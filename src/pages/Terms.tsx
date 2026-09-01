import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">
        <div className="pb-8 border-b border-border">
          <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-2">
            LEGAL JURISDICTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
            TERMS OF SERVICE
          </h1>
        </div>

        <div className="space-y-6 text-xs font-mono text-foreground-secondary leading-relaxed">
          <p>
            Welcome to ATELIER ECOVANTO (ecovanto.com). By navigating, creating an account, or acquiring garments through our storefront, you enter into a legally binding agreement governed under the jurisdiction of the Federal Republic of Germany (Amtsgericht Berlin-Charlottenburg).
          </p>

          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase">01 / ARTISANAL SPECIFICATIONS & ORDERS</h2>
            <p>
              Due to the limited small-batch nature of our European deadstock fabrics and hand-finished pattern construction, subtle natural variations in texture, grain, and weave constitute proof of genuine artisanal craftsmanship rather than defects.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase">02 / PRICING & STATUTORY VAT</h2>
            <p>
              All prices displayed on ecovanto.com are denominated in Euros (€ EUR) and include German statutory value-added tax (19% MwSt.) where applicable.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase">03 / COPYRIGHT & INTELLECTUAL PROPERTY</h2>
            <p>
              All garment silhouettes, patterns, photography, typography, video footage, and editorial manifesto texts are the exclusive intellectual property of ECOVANTO GMBH. Unauthorized commercial reproduction is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
