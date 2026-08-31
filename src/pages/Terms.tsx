import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        <div className="pb-8 border-b border-white/10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase block mb-2">
            LEGAL PROTOCOL
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-white">
            TERMS OF SERVICE
          </h1>
        </div>

        <div className="space-y-6 text-xs font-mono text-[#A0A09C] leading-relaxed">
          <p>
            Welcome to ATELIER ECOVANTO (ecovanto.com). By navigating this website or acquiring garments through our digital storefront or Berlin showroom, you agree to the following conditions governed under the laws of the Federal Republic of Germany.
          </p>

          <h3 className="text-sm font-semibold uppercase text-white pt-4">
            1. INTELLECTUAL PROPERTY & DESIGN RIGHTS
          </h3>
          <p>
            All silhouettes, patterns, tailoring constructions, visual imagery, typography layouts, and written copy remain the exclusive intellectual property of ECOVANTO Studio GmbH. Unauthorized reproduction or commercial derivation is strictly prohibited.
          </p>

          <h3 className="text-sm font-semibold uppercase text-white pt-4">
            2. ORDER ACCEPTANCE & CONTRACT FORMATION
          </h3>
          <p>
            Placement of an order constitutes an offer to acquire. Contractual binding occurs only once a formal dispatch confirmation and courier tracking serial number are issued by our atelier.
          </p>

          <h3 className="text-sm font-semibold uppercase text-white pt-4">
            3. BESPOKE COMMISSIONS
          </h3>
          <p>
            Made-to-order, runway archive, and customized tailoring pieces are final sale once fabric drafting commences.
          </p>
        </div>
      </div>
    </div>
  );
};
