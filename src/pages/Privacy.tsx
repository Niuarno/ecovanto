import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">
        <div className="pb-8 border-b border-border">
          <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-2">
            DATA INTEGRITY & PRIVACY
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
            PRIVACY POLICY (DSGVO / GDPR)
          </h1>
        </div>

        <div className="space-y-6 text-xs font-mono text-foreground-secondary leading-relaxed">
          <p>
            ATELIER ECOVANTO respects the sanctity of client privacy. We process personal coordinates strictly in full compliance with the European General Data Protection Regulation (DSGVO / GDPR).
          </p>

          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase">01 / CONTROLLER ENTITY</h2>
            <p>
              The data controller responsible for the processing of personal information on this domain is ECOVANTO ATELIER GMBH, Köpenicker Str. 124, 10997 Berlin, Germany. Email: privacy@ecovanto.com.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase">02 / DATA COLLECTED FOR DISPATCH</h2>
            <p>
              When an acquisition is completed or client profile registered, we collect your name, email, telephone number, and physical shipping address solely for express carrier dispatch, tracking notification transmission, and statutory tax accounting.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase">03 / NO THIRD-PARTY DATA BROKERAGE</h2>
            <p>
              We under no circumstances sell, rent, or trade client telemetry or personal dossiers to third-party data brokers or advertising networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
