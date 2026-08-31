import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        <div className="pb-8 border-b border-white/10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase block mb-2">
            DATA INTEGRITY & GDPR
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-white">
            PRIVACY POLICY
          </h1>
        </div>

        <div className="space-y-6 text-xs font-mono text-[#A0A09C] leading-relaxed">
          <p>
            ECOVANTO is committed to absolute data minimization under the General Data Protection Regulation (GDPR / DSGVO). We do not monetize, sell, or profile your personal data with third-party tracking conglomerates.
          </p>

          <h3 className="text-sm font-semibold uppercase text-white pt-4">
            1. DATA COLLECTION PURPOSE
          </h3>
          <p>
            Information collected during order checkout (name, delivery coordinates, payment tokenization via secure European processors) is utilized solely for courier dispatch, invoice taxation, and order delivery status notifications.
          </p>

          <h3 className="text-sm font-semibold uppercase text-white pt-4">
            2. COOKIES & LOCAL STORAGE
          </h3>
          <p>
            We use minimal client-side local storage exclusively to retain your shopping bag and wishlist items between visits. No persistent surveillance advertising trackers are deployed.
          </p>

          <h3 className="text-sm font-semibold uppercase text-white pt-4">
            3. YOUR RIGHTS
          </h3>
          <p>
            You retain the right to request immediate inspection, rectification, or complete erasure of any stored records by communicating with privacy@ecovanto.com.
          </p>
        </div>
      </div>
    </div>
  );
};
