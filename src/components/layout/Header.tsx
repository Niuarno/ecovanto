import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useTheme } from '../../context/ThemeContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { ThemeToggle } from '../common/ThemeToggle';
import { User } from 'lucide-react';

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const {
    setIsCartOpen,
    setIsFavoritesOpen,
    setIsSearchOpen,
    setIsMobileMenuOpen,
  } = useUI();
  const { theme } = useTheme();
  const { isScrolledPastTop } = useScrollDirection();
  const location = useLocation();

  const isDark = theme === 'dark';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 select-none ${
        isScrolledPastTop
          ? 'bg-background/92 backdrop-blur-md border-b border-border py-3.5'
          : isDark
          ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
          : 'bg-gradient-to-b from-white/90 via-white/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
        {/* LEFT: Menu Trigger & Desktop Navigation */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            data-cursor="link"
            className="group flex items-center space-x-2.5 text-xs font-mono tracking-widest text-foreground hover:opacity-80 uppercase transition-colors"
            aria-label="Open Navigation Menu"
          >
            <div className="flex flex-col space-y-1 w-4">
              <span className="w-full h-[1px] bg-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
              <span className="w-3/4 h-[1px] bg-foreground transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <span className="hidden sm:inline">MENU</span>
          </button>

          {/* Desktop Direct Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[11px] font-mono tracking-widest uppercase text-muted">
            <Link
              to="/shop"
              data-cursor="link"
              className={`hover:text-foreground transition-colors relative py-1 ${
                location.pathname === '/shop'
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-foreground'
                  : ''
              }`}
            >
              SHOP ALL
            </Link>
            <Link
              to="/categories"
              data-cursor="link"
              className={`hover:text-foreground transition-colors relative py-1 ${
                location.pathname.startsWith('/categories')
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-foreground'
                  : ''
              }`}
            >
              CATEGORIES
            </Link>
            <Link
              to="/collections"
              data-cursor="link"
              className={`hover:text-foreground transition-colors relative py-1 ${
                location.pathname.startsWith('/collections')
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-foreground'
                  : ''
              }`}
            >
              COLLECTIONS
            </Link>
            <Link
              to="/campaign"
              data-cursor="link"
              className={`hover:text-foreground transition-colors relative py-1 ${
                location.pathname === '/campaign'
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-foreground'
                  : ''
              }`}
            >
              CAMPAIGN
            </Link>
          </nav>
        </div>

        {/* CENTER: Brand Logo Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <Link
            to="/"
            data-cursor="link"
            className="inline-block group focus:outline-none"
            aria-label="ECOVANTO Homepage"
          >
            <span className="font-display font-light text-lg md:text-2xl tracking-[0.35em] uppercase text-foreground transition-opacity group-hover:opacity-80">
              ECOVANTO
            </span>
          </Link>
        </div>

        {/* RIGHT: Actions (Theme Swatch, Account, Search, Favorites, Cart) */}
        <div className="flex items-center space-x-3 md:space-x-5 text-xs font-mono tracking-widest uppercase text-foreground">
          {/* THEME SWATCH TOGGLE */}
          <div className="hidden sm:block">
            <ThemeToggle variant="compact" />
          </div>
          <div className="sm:hidden">
            <ThemeToggle variant="minimal" />
          </div>

          {/* CUSTOMER ACCOUNT */}
          <Link
            to="/account"
            data-cursor="link"
            className="hover:opacity-80 transition-opacity py-1 flex items-center space-x-1"
            aria-label="Client Account"
          >
            {isAuthenticated && user ? (
              <span className="font-semibold text-foreground underline underline-offset-4">
                {user.firstName.toUpperCase()}
              </span>
            ) : (
              <>
                <span className="hidden md:inline">ACCOUNT</span>
                <User className="w-3.5 h-3.5 md:hidden" />
              </>
            )}
          </Link>

          {/* SEARCH */}
          <button
            onClick={() => setIsSearchOpen(true)}
            data-cursor="link"
            className="hover:opacity-80 transition-opacity py-1"
            aria-label="Open Search"
          >
            <span className="hidden md:inline">SEARCH</span>
            <span className="md:hidden text-sm">⌕</span>
          </button>

          {/* FAVORITES */}
          <button
            onClick={() => setIsFavoritesOpen(true)}
            data-cursor="link"
            className="hover:opacity-80 transition-opacity py-1 flex items-center space-x-1"
            aria-label="Open Favorites"
          >
            <span className="hidden md:inline">FAVORITES</span>
            <span className="md:hidden">♡</span>
            {totalFavorites > 0 && (
              <span className="text-[10px] text-muted">[{totalFavorites}]</span>
            )}
          </button>

          {/* BAG */}
          <button
            onClick={() => setIsCartOpen(true)}
            data-cursor="link"
            className="hover:opacity-80 transition-opacity py-1 flex items-center space-x-1 group"
            aria-label="Open Shopping Bag"
          >
            <span>BAG</span>
            <span className="font-medium group-hover:underline">
              .{totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
