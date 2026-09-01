import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { MarqueeSection } from '../components/home/MarqueeSection';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { CampaignSection } from '../components/home/CampaignSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { EditorialSection } from '../components/home/EditorialSection';
import { BrandPhilosophySection } from '../components/home/BrandPhilosophySection';
import { VideoSection } from '../components/home/VideoSection';
import { Newsletter } from '../components/layout/Newsletter';
import { useStore } from '../context/StoreContext';

export const Home: React.FC = () => {
  const { products } = useStore();
  const newArrivals = products.filter((p) => p.isNewArrival || p.isFeatured);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* 01. FULLSCREEN HERO */}
      <HeroSection />

      {/* MARQUEE EDITORIAL RIBBON */}
      <MarqueeSection />

      {/* 02. NEW ARRIVALS HORIZONTAL CAROUSEL */}
      <ProductCarousel
        products={newArrivals.length > 0 ? newArrivals : products}
        title="NEW ARRIVALS"
        subtitle="AUTUMN / WINTER 2026 ARCHIVE"
        sectionNumber="01"
      />

      {/* 03. CAMPAIGN SECTION */}
      <CampaignSection />

      {/* 04. CATEGORIES SECTION */}
      <CategoriesSection />

      {/* 05. EDITORIAL / COLLECTION STUDY */}
      <EditorialSection />

      {/* 06. BRAND PHILOSOPHY MANIFESTO */}
      <BrandPhilosophySection />

      {/* 07. CINEMATIC VIDEO REEL */}
      <VideoSection />

      {/* 08. NEWSLETTER */}
      <Newsletter />
    </div>
  );
};
