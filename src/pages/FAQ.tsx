import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'HOW DO I SELECT THE CORRECT SIZE FOR CORSETS AND STRUCTURED SUITING?',
      a: 'Our corsets incorporate spring-steel spiral boning engineered to cinch between 4cm to 7cm at the natural waist while preserving spinal comfort. We recommend selecting your true natural waist measurement according to our SIZE GUIDE. If between sizes, we recommend sizing down for structured corsetry and sizing up for tailored coats.'
    },
    {
      q: 'WHAT COURIER SERVICES DO YOU USE AND HOW FAST IS EXPRESS DELIVERY?',
      a: 'All orders depart directly from our Berlin studio via DHL Express Carbon Neutral or UPS Express Saver. Orders within Germany arrive in 1-2 business days. Western & Northern Europe arrive in 2-3 business days. North America and Asia Pacific arrive within 3-5 business days.'
    },
    {
      q: 'WHAT IS YOUR RETURN AND ARCHIVE EXCHANGE POLICY?',
      a: 'We accept returns and size exchanges within 14 calendar days of confirmed delivery. All garments must be unworn, unwashed, with all studio tags and security ribbons intact.'
    },
    {
      q: 'HOW ARE ECOVANTO PIECES MANUFACTURED?',
      a: 'All garments are designed and pattern-drafted in our Berlin Kreuzberg atelier. Small batch production is executed between our in-house studio team and family-owned artisan workshops in Northern Italy, Austria, and Portugal using strictly certified deadstock and European mill fabrics.'
    },
    {
      q: 'DO YOU OFFER BESPOKE AND RUNWAY COMMISSIONS?',
      a: 'Yes. For private bridal, red carpet, or bespoke tailoring commissions, please contact atelier@ecovanto.com to arrange an initial fitting consultation at our Berlin showroom.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="pb-8 mb-12 border-b border-border">
          <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-2">
            CLIENT ASSISTANCE
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>

        <div className="divide-y divide-border text-xs font-mono">
          {faqs.map((item, idx) => (
            <div key={idx} className="py-6">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-start text-left text-sm font-medium uppercase text-foreground hover:opacity-80 transition-opacity gap-4"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <p className="mt-4 text-xs font-light text-foreground-secondary leading-relaxed pr-6">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-surface border border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-foreground block font-medium">REQUIRE FURTHER ASSISTANCE?</span>
            <span className="text-muted">Our concierge responds within 24 hours.</span>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-foreground text-background uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
          >
            CONTACT CONCIERGE
          </Link>
        </div>
      </div>
    </div>
  );
};
