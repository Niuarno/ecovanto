import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw the loader this session
    const hasLoaded = sessionStorage.getItem('ecovanto_loaded_session');
    if (hasLoaded) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem('ecovanto_loaded_session', 'true');
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        // Realistic dynamic counter step
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-[#060606] flex flex-col justify-between p-6 md:p-12 text-[#F4F4F0] select-none"
        >
          {/* Top metadata */}
          <div className="flex justify-between items-center text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#8A8A8A]">
            <span>ECOVANTO / ATELIER</span>
            <span>BERLIN — S/S 2026</span>
          </div>

          {/* Center Brand Wordmark & Percentage */}
          <div className="flex flex-col items-center justify-center my-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-5xl font-light tracking-[0.35em] uppercase font-display"
            >
              ECOVANTO
            </motion.div>
            <div className="w-16 h-[1px] bg-white/20" />
            <div className="font-mono text-3xl md:text-5xl font-light tabular-nums tracking-widest text-[#F4F4F0]">
              {String(percent).padStart(2, '0')}%
            </div>
          </div>

          {/* Bottom Progress Line */}
          <div className="space-y-3">
            <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-[#F4F4F0]"
                style={{ width: `${percent}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] md:text-[11px] font-mono tracking-widest text-[#666]">
              <span>INITIALIZING SOUND & RUNWAY</span>
              <span>[ 00 / 100 ]</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
