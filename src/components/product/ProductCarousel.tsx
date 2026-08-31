import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  sectionNumber?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title = 'NEW ARRIVALS',
  subtitle = 'AUTUMN / WINTER 2026 ARCHIVE',
  sectionNumber = '01',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScrollState = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = Math.max(scrollWidth - clientWidth, 1);
    const progress = Math.min(Math.max((scrollLeft / maxScroll) * 100, 0), 100);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [products, checkScrollState]);

  // Pointer Drag Handling with Momentum & Threshold
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.clientX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 5) {
      setDragMoved(true);
    }
    containerRef.current.scrollLeft = scrollLeft - delta * 1.4;
    checkScrollState();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setTimeout(() => setDragMoved(false), 50);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragMoved(false);
  };

  const scrollByAmount = (offset: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScrollState, 350);
  };

  return (
    <section className="py-20 md:py-28 border-b border-border select-none overflow-hidden bg-background transition-colors">
      {/* Section Header */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-1.5">
            <span>[ {sectionNumber} ]</span>
            <span>{subtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
            {title}
          </h2>
        </div>

        {/* Drag Hint & Minimal Arrow Controls */}
        <div className="flex items-center space-x-6 text-xs font-mono tracking-widest text-muted">
          <span className="hidden md:inline-block text-[10px] tracking-widest">
            [ DRAG / HORIZONTAL CANVAS ]
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollByAmount(-440)}
              disabled={!canScrollLeft}
              data-cursor="link"
              className="p-2.5 border border-border hover:border-foreground disabled:opacity-20 disabled:hover:border-border text-foreground transition-all duration-300"
              aria-label="Scroll gallery left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount(440)}
              disabled={!canScrollRight}
              data-cursor="link"
              className="p-2.5 border border-border hover:border-foreground disabled:opacity-20 disabled:hover:border-border text-foreground transition-all duration-300"
              aria-label="Scroll gallery right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Draggable Container */}
      <div
        ref={containerRef}
        data-cursor="drag"
        data-cursor-text="DRAG"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onScroll={checkScrollState}
        className={`flex space-x-6 md:space-x-8 px-4 md:px-8 lg:px-12 overflow-x-auto no-scrollbar touch-pan-x ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: Math.min(idx * 0.06, 0.3) }}
            className={`w-[280px] sm:w-[320px] md:w-[360px] lg:w-[390px] flex-shrink-0 ${
              dragMoved ? 'pointer-events-none' : ''
            }`}
          >
            <ProductCard product={product} aspect="3/4" priority={idx < 4} />
          </motion.div>
        ))}
      </div>

      {/* Scrub Progress Track */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 mt-8 flex items-center justify-between">
        <div className="w-48 sm:w-64 h-[1px] bg-border relative overflow-hidden">
          <div
            className="absolute top-0 bottom-0 bg-foreground transition-all duration-150"
            style={{ width: '25%', left: `${scrollProgress * 0.75}%` }}
          />
        </div>
        <span className="text-[9px] font-mono tracking-widest text-muted uppercase">
          {products.length} ARCHIVAL PIECES
        </span>
      </div>
    </section>
  );
};
