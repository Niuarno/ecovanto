import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';
import { X, ZoomIn } from 'lucide-react';

export const ImageLightboxModal: React.FC = () => {
  const { lightboxImage, setLightboxImage } = useUI();

  if (!lightboxImage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-lg cursor-zoom-out"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl max-h-[92vh] z-10 select-none flex flex-col items-center"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute -top-12 right-0 md:-right-12 text-[#8A8A8A] hover:text-white transition-colors p-2"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={lightboxImage}
            alt="Editorial Fullscreen Gallery"
            className="w-auto h-auto max-h-[85vh] object-contain border border-white/10 shadow-2xl"
          />

          <div className="mt-4 text-center">
            <span className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase">
              ECOVANTO ATELIER — HIGH-RESOLUTION ARCHIVE VIEW
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
