import React from 'react';
import { useStore } from '../../context/StoreContext';

export const MarqueeSection: React.FC = () => {
  const { settings } = useStore();

  const customText = settings.announcementText || 'NEW DROP // LIFE FORCE 2026 // COMPLIMENTARY EXPRESS DISPATCH OVER €500';

  const items = [
    customText,
    'QUARPA CAPSULE',
    'BERLIN VIBES',
    'BEAUTY WILL SAVE THE WORLD',
    'ARCHITECTURAL CORSETRY',
    'SCULPTURAL TAILORING',
    'ATELIER ECOVANTO',
  ];

  return (
    <div className="border-y border-white/15 bg-[#060606] py-3.5 overflow-hidden select-none">
      <div className="animate-marquee-infinite flex items-center space-x-10 text-xs md:text-sm font-mono tracking-[0.25em] text-[#F4F4F0] uppercase">
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-10 flex-shrink-0">
            <span className="hover:text-white transition-colors cursor-default">
              {text}
            </span>
            <span className="text-[#555] text-xs font-serif">✧</span>
          </div>
        ))}
      </div>
    </div>
  );
};
