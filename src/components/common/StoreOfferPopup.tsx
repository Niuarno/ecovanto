import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

export const StoreOfferPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { showToast } = useUI();

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('ecovanto_offer_seen_v1');
    if (hasSeen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
    sessionStorage.setItem('ecovanto_offer_seen_v1', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ATELIER10');
    showToast({
      type: 'success',
      title: 'VOUCHER COPIED',
      message: 'Code ATELIER10 copied to clipboard. Apply at checkout.',
    });
    handleClose();
  };

  return (
    <>
      {/* Minimized floating trigger badge if closed */}
      {isMinimized && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          data-cursor="link"
          className="fixed bottom-6 left-6 z-40 px-3.5 py-2 bg-surface border border-border hover:border-foreground shadow-2xl text-xs font-mono text-foreground flex items-center space-x-2 backdrop-blur-md transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="tracking-widest uppercase">10% PRIVILEGE CODE</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-surface border border-border p-8 md:p-10 z-10 text-foreground shadow-2xl overflow-hidden transition-colors"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors p-1"
                aria-label="Close offer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 text-center">
                <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-muted uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>ATELIER PRIVATE ACCESS</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-light font-display tracking-tight uppercase text-foreground">
                  INAUGURAL <br />
                  <span className="font-serif italic font-normal text-stroke-strong">10% DISCOUNT</span>
                </h2>

                <p className="text-xs font-light text-foreground-secondary leading-relaxed max-w-sm mx-auto">
                  Acquire pieces from the Autumn/Winter 2026 Archive with 10% private privilege deduction and complimentary European express courier dispatch over €500.
                </p>

                {/* Voucher Code Box */}
                <div className="p-4 bg-background border border-border flex items-center justify-between font-mono text-xs">
                  <div className="text-left">
                    <span className="text-[9px] text-muted uppercase block">VOUCHER CODE</span>
                    <span className="text-sm font-semibold tracking-widest text-foreground">ATELIER10</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    data-cursor="link"
                    className="px-4 py-2 bg-foreground text-background text-[11px] uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                  >
                    COPY CODE
                  </button>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/shop"
                    onClick={handleClose}
                    data-cursor="link"
                    className="flex-1 py-3.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                  >
                    <span>EXPLORE ARCHIVE</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleClose}
                    className="px-4 py-3.5 border border-border hover:border-foreground text-muted hover:text-foreground font-mono text-xs uppercase tracking-widest transition-colors"
                  >
                    MAYBE LATER
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
