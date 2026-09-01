import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export const trackFBPixelEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, params);
    } catch (e) {
      console.warn('Facebook Pixel tracking error:', e);
    }
  }
};

export const FacebookPixel: React.FC = () => {
  const { settings } = useStore();
  const location = useLocation();

  const pixelId =
    settings.facebookPixelId?.trim() ||
    ((import.meta as any).env?.VITE_FACEBOOK_PIXEL_ID?.trim()) ||
    '';

  // Initialize Facebook Pixel SDK script
  useEffect(() => {
    if (!pixelId) return;

    if (!window.fbq) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
      /* eslint-enable */
    }

    try {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    } catch (err) {
      console.warn('FB Pixel initialization error:', err);
    }
  }, [pixelId]);

  // Track PageView on route change
  useEffect(() => {
    if (pixelId && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search, pixelId]);

  return null;
};
