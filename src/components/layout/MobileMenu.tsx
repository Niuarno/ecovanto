import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { COLLECTIONS } from '../../data/collections';
import { ThemeToggle } from '../common/ThemeToggle';

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUI();
  const { user, isAuthenticated } = useAuth();

  if (!isMobileMenuOpen) return null;

  const mainLinks = [
    { label: 'SHOP ALL', path: '/shop', subtitle: 'COMPLETE ARCHIVE' },
    { label: 'CATEGORIES', path: '/categories', subtitle: `${CATEGORIES.length} CURATED SECTIONS` },
    { label: 'COLLECTIONS', path: '/collections', subtitle: `${COLLECTIONS.length} EDITORIAL DROPS` },
    { label: 'CAMPAIGN', path: '/campaign', subtitle: 'AUTUMN / WINTER 2026' },
    { label: 'WHO WE ARE', path: '/about', subtitle: 'ATELIER MANIFESTO' },
    { label: 'CONTACT', path: '/contact', subtitle: 'BERLIN SHOWROOM' },
  ];

  const secondaryLinks = [
    { label: isAuthenticated ? `MY ACCOUNT (${user?.firstName})` : 'ACCOUNT / SIGN IN', path: '/account' },
    { label: 'TRACK ORDER', path: '/orders' },
    { label: 'CHECKOUT', path: '/checkout' },
    { label: 'SHIPPING & PAYMENT', path: '/shipping' },
    { label: 'FAQ', path: '/faq' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.04, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-surface border-r border-border h-full overflow-y-auto p-6 md:p-12 flex flex-col justify-between z-10 text-foreground transition-colors"
        >
          {/* Top Bar with Theme Toggle */}
          <div className="flex justify-between items-center pb-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono tracking-widest text-muted uppercase">
                ECOVANTO
              </span>
              <ThemeToggle variant="compact" />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-muted hover:text-foreground transition-colors flex items-center space-x-2 text-xs font-mono"
              aria-label="Close Menu"
            >
              <span>CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Editorial Links */}
          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="my-8 space-y-3 md:space-y-5"
          >
            {mainLinks.map((item, index) => (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between py-2 border-b border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-baseline space-x-4">
                    <span className="text-[10px] font-mono text-muted group-hover:text-foreground transition-colors">
                      0{index + 1}
                    </span>
                    <span className="text-2xl md:text-4xl font-display font-light tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-muted group-hover:text-foreground hidden sm:inline">
                    {item.subtitle}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Customer Account Bar */}
          <div className="p-4 bg-surface-subtle border border-border mb-6 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono tracking-widest text-muted uppercase block">
                {isAuthenticated ? 'AUTHENTICATED CLIENT' : 'CLIENT MEMBERSHIP'}
              </span>
              <span className="text-xs font-mono text-foreground font-medium uppercase">
                {isAuthenticated ? `${user?.firstName} ${user?.lastName}` : 'SIGN IN / CREATE ACCOUNT'}
              </span>
            </div>
            <Link
              to="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-1.5 bg-foreground text-background text-[10px] font-mono tracking-widest uppercase hover:opacity-90 font-semibold"
            >
              {isAuthenticated ? 'ACCOUNT ↗' : 'SIGN IN ↗'}
            </Link>
          </div>

          {/* Secondary Footer Links */}
          <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono tracking-widest uppercase text-muted">
              {secondaryLinks.map((sec) => (
                <Link
                  key={sec.path}
                  to={sec.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-foreground transition-colors"
                >
                  {sec.label}
                </Link>
              ))}
            </div>

            <div className="text-[9px] font-mono text-muted">
              © 2026 ATELIER ECOVANTO
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
