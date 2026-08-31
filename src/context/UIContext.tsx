import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastMessage } from '../types';

interface UIContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  lightboxImage: string | null;
  setLightboxImage: (url: string | null) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Prevent background body scroll when any modal or drawer is open
  useEffect(() => {
    const hasOpenOverlay =
      isCartOpen ||
      isFavoritesOpen ||
      isSearchOpen ||
      isMobileMenuOpen ||
      isSizeGuideOpen ||
      !!lightboxImage;

    if (hasOpenOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    isCartOpen,
    isFavoritesOpen,
    isSearchOpen,
    isMobileMenuOpen,
    isSizeGuideOpen,
    lightboxImage,
  ]);

  // Global ESC key listener to close active drawers/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllDrawers();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsFavoritesOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsSizeGuideOpen(false);
    setLightboxImage(null);
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        isFavoritesOpen,
        setIsFavoritesOpen,
        isSearchOpen,
        setIsSearchOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        lightboxImage,
        setLightboxImage,
        toasts,
        showToast,
        removeToast,
        closeAllDrawers,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
