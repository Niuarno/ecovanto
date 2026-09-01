import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileMenu } from './components/layout/MobileMenu';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { CartDrawer } from './components/layout/CartDrawer';
import { FavoritesDrawer } from './components/layout/FavoritesDrawer';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { ImageLightboxModal } from './components/common/ImageLightboxModal';
import { ToastContainer } from './components/common/Toast';
import { LoadingScreen } from './components/common/LoadingScreen';
import { SmoothScroll } from './components/common/SmoothScroll';
import { CustomCursor } from './components/common/CustomCursor';
import { StoreOfferPopup } from './components/common/StoreOfferPopup';
import { OrioChatbox } from './components/common/OrioChatbox';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CategoryDetail } from './pages/CategoryDetail';
import { CategoriesList } from './pages/CategoriesList';
import { CollectionsList } from './pages/CollectionsList';
import { CollectionDetail } from './pages/CollectionDetail';
import { ProductDetail } from './pages/ProductDetail';
import { Campaign } from './pages/Campaign';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Shipping } from './pages/Shipping';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Checkout } from './pages/Checkout';
import { OrderDetail } from './pages/OrderDetail';
import { OrdersLookup } from './pages/OrdersLookup';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background transition-colors duration-300">
        {/* Short Luxury Percentage Loading Experience */}
        <LoadingScreen />

        {/* Reactive Desktop Custom Cursor */}
        <CustomCursor />

        {/* Global Scroll Restoration */}
        <ScrollToTop />

        {/* Persistent Minimal Header */}
        <Header />

        {/* Global Drawers, Modals & Notifications */}
        <MobileMenu />
        <SearchOverlay />
        <CartDrawer />
        <FavoritesDrawer />
        <SizeGuideModal />
        <ImageLightboxModal />
        <ToastContainer />

        {/* Store Offer Privilege Popup */}
        <StoreOfferPopup />

        {/* Orio AI Luxury Concierge */}
        <OrioChatbox />

        {/* Main Routed Page Surface */}
        <main className="relative z-10 min-h-[80vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/collections" element={<CollectionsList />} />
            <Route path="/collections/:slug" element={<CollectionDetail />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Customer Account & Authentication */}
            <Route path="/account" element={<Account />} />

            {/* Customer Checkout & Order Tracking */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrdersLookup />} />
            <Route path="/orders/:id" element={<OrderDetail />} />

            {/* Private Host Atelier Management Route */}
            <Route path="/host" element={<Admin />} />
            <Route path="/admin" element={<Navigate to="/host" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Minimal Editorial Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default App;
