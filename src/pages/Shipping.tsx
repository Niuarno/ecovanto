import React from 'react';
import { Link } from 'react-router-dom';

export const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        <div className="pb-8 border-b border-border">
          <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-2">
            LOGISTICS & POLICIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
            SHIPPING & RETURNS
          </h1>
        </div>

        {/* Section 1: Rates */}
        <div className="space-y-4">
          <h2 className="text-lg font-mono tracking-widest uppercase text-foreground">
            01 / COURIER RATES & TRANSIT TIMELINES
          </h2>
          <div className="border border-border overflow-x-auto bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-surface-subtle border-b border-border text-muted">
                  <th className="p-3.5">TERRITORY</th>
                  <th className="p-3.5">CARRIER</th>
                  <th className="p-3.5">ESTIMATED TRANSIT</th>
                  <th className="p-3.5">STANDARD RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground-secondary">
                <tr>
                  <td className="p-3.5 font-medium text-foreground">GERMANY</td>
                  <td className="p-3.5">DHL Express</td>
                  <td className="p-3.5">1-2 Business Days</td>
                  <td className="p-3.5 font-semibold text-foreground">FREE OVER €500 / €10</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-foreground">EUROPEAN UNION</td>
                  <td className="p-3.5">DHL Express EU</td>
                  <td className="p-3.5">2-3 Business Days</td>
                  <td className="p-3.5 font-semibold text-foreground">FREE OVER €500 / €18</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-foreground">UK & SWITZERLAND</td>
                  <td className="p-3.5">DHL International</td>
                  <td className="p-3.5">2-4 Business Days</td>
                  <td className="p-3.5">€25 (Duties Included)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-foreground">USA & CANADA</td>
                  <td className="p-3.5">UPS Express Saver</td>
                  <td className="p-3.5">3-5 Business Days</td>
                  <td className="p-3.5">€35</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-foreground">REST OF WORLD</td>
                  <td className="p-3.5">DHL Express Worldwide</td>
                  <td className="p-3.5">4-7 Business Days</td>
                  <td className="p-3.5">€45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Customs */}
        <div className="space-y-4 pt-6 border-t border-border text-xs font-mono text-foreground-secondary leading-relaxed">
          <h2 className="text-lg font-mono tracking-widest uppercase text-foreground">
            02 / CUSTOMS, DUTIES & TAXES
          </h2>
          <p>
            All shipments within the European Union include German statutory VAT (19%). Orders shipped outside the EU are delivered on a DAP (Delivered at Place) basis, where local import duties and clearance fees may be collected by the courier prior to release.
          </p>
        </div>

        {/* Section 3: Returns */}
        <div className="space-y-4 pt-6 border-t border-border text-xs font-mono text-foreground-secondary leading-relaxed">
          <h2 className="text-lg font-mono tracking-widest uppercase text-foreground">
            03 / ATELIER RETURN PROCEDURE
          </h2>
          <p>
            To initiate a return or exchange within 14 days of receipt, email <span className="text-foreground font-semibold">returns@ecovanto.com</span> with your order reference number. Our concierge will supply a prepaid return shipping manifesto and schedule courier collection.
          </p>
        </div>
      </div>
    </div>
  );
};
