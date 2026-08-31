import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';
import { X, Check } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 md:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#141414] border border-white/20 p-4 shadow-2xl flex items-center space-x-3 text-[#F4F4F0] backdrop-blur-md"
          >
            {toast.productImage && (
              <div className="w-12 h-16 flex-shrink-0 bg-black overflow-hidden border border-white/10">
                <img
                  src={toast.productImage}
                  alt={toast.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <h4 className="text-xs font-mono tracking-widest uppercase truncate text-white">
                  {toast.title}
                </h4>
              </div>
              {toast.message && (
                <p className="text-[11px] text-[#8A8A8A] font-light mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#666] hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
