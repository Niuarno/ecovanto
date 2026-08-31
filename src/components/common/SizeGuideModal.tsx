import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';
import { X } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useUI();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isSizeGuideOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSizeGuideOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-surface border border-border p-6 md:p-10 z-10 text-foreground max-h-[90vh] overflow-y-auto shadow-2xl transition-colors"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-4 border-b border-border">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                ATELIER SPECIFICATIONS
              </span>
              <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase mt-1">
                SIZE & MEASUREMENT GUIDE
              </h2>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="text-muted hover:text-foreground transition-colors p-2"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex justify-end items-center space-x-3 mb-6">
            <span className="text-xs font-mono text-muted">UNIT:</span>
            <div className="inline-flex border border-border p-0.5">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-mono tracking-wider transition-colors ${
                  unit === 'cm' ? 'bg-foreground text-background font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-mono tracking-wider transition-colors ${
                  unit === 'in' ? 'bg-foreground text-background font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-8 border border-border">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-muted">
                  <th className="py-3 px-4 font-normal">SIZE</th>
                  <th className="py-3 px-4 font-normal">EU</th>
                  <th className="py-3 px-4 font-normal">US</th>
                  <th className="py-3 px-4 font-normal">UK</th>
                  <th className="py-3 px-4 font-normal">BUST ({unit.toUpperCase()})</th>
                  <th className="py-3 px-4 font-normal">WAIST ({unit.toUpperCase()})</th>
                  <th className="py-3 px-4 font-normal">HIP ({unit.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground-secondary">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">XS</td>
                  <td className="py-3.5 px-4">34</td>
                  <td className="py-3.5 px-4">2</td>
                  <td className="py-3.5 px-4">6</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '80 - 84' : '31.5 - 33'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '60 - 64' : '23.5 - 25'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '86 - 90' : '33.8 - 35.4'}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">S</td>
                  <td className="py-3.5 px-4">36</td>
                  <td className="py-3.5 px-4">4</td>
                  <td className="py-3.5 px-4">8</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '84 - 88' : '33 - 34.6'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '64 - 68' : '25 - 26.8'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '90 - 94' : '35.4 - 37'}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">M</td>
                  <td className="py-3.5 px-4">38</td>
                  <td className="py-3.5 px-4">6</td>
                  <td className="py-3.5 px-4">10</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '88 - 92' : '34.6 - 36.2'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '68 - 72' : '26.8 - 28.3'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '94 - 98' : '37 - 38.6'}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">L</td>
                  <td className="py-3.5 px-4">40</td>
                  <td className="py-3.5 px-4">8</td>
                  <td className="py-3.5 px-4">12</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '92 - 96' : '36.2 - 37.8'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '72 - 76' : '28.3 - 30'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '98 - 102' : '38.6 - 40.2'}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-foreground">XL</td>
                  <td className="py-3.5 px-4">42</td>
                  <td className="py-3.5 px-4">10</td>
                  <td className="py-3.5 px-4">14</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '96 - 102' : '37.8 - 40.2'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '76 - 82' : '30 - 32.3'}</td>
                  <td className="py-3.5 px-4">{unit === 'cm' ? '102 - 108' : '40.2 - 42.5'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measuring Advice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light text-muted pt-4 border-t border-border">
            <div>
              <h4 className="font-mono text-foreground tracking-wider uppercase mb-1 font-medium">01 / BUST</h4>
              <p>Measure across the fullest part of your chest with a relaxed posture and straight tape.</p>
            </div>
            <div>
              <h4 className="font-mono text-foreground tracking-wider uppercase mb-1 font-medium">02 / WAIST</h4>
              <p>Measure around the narrowest contour of your natural waistline, above the navel.</p>
            </div>
            <div>
              <h4 className="font-mono text-foreground tracking-wider uppercase mb-1 font-medium">03 / HIPS</h4>
              <p>Measure around the fullest part of your hips, keeping feet together.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
