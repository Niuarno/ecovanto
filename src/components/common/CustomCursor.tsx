import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<
    'default' | 'link' | 'view' | 'drag' | 'drag-active' | 'add' | 'close' | 'text'
  >('default');
  const [cursorText, setCursorText] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsDesktop(mediaQuery.matches);

    if (!mediaQuery.matches) return;

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect hovered element and its data-cursor attribute or tag
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      const linkTarget = target.closest('a, button, [role="button"]') as HTMLElement | null;
      const inputTarget = target.closest('input, textarea, select') as HTMLElement | null;

      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor');
        const customLabel = cursorTarget.getAttribute('data-cursor-text') || '';

        if (customType === 'drag') {
          setCursorType(isMouseDown ? 'drag-active' : 'drag');
          setCursorText(isMouseDown ? 'HOLD' : 'DRAG');
        } else if (customType === 'view') {
          setCursorType('view');
          setCursorText(customLabel || 'VIEW');
        } else if (customType === 'add') {
          setCursorType('add');
          setCursorText(customLabel || '+ BAG');
        } else if (customType === 'close') {
          setCursorType('close');
          setCursorText(customLabel || 'CLOSE');
        } else {
          setCursorType('link');
          setCursorText(customLabel);
        }
      } else if (inputTarget) {
        setCursorType('text');
        setCursorText('');
      } else if (linkTarget) {
        setCursorType('link');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      setCursorType((prev) => (prev === 'drag' ? 'drag-active' : prev));
      if (cursorType === 'drag') setCursorText('HOLD');
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      setCursorType((prev) => (prev === 'drag-active' ? 'drag' : prev));
      if (cursorType === 'drag-active') setCursorText('DRAG');
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, isMouseDown, cursorType]);

  if (!isDesktop || !isVisible) return null;

  // Determine size, styling, and text based on active state
  let ringSize = 28;
  let ringBg = 'transparent';
  let ringBorder = theme === 'dark' ? 'rgba(244, 244, 240, 0.45)' : 'rgba(10, 10, 10, 0.45)';
  let dotScale = 1;

  if (cursorType === 'link') {
    ringSize = 48;
    ringBorder = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    ringBg = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    dotScale = 0;
  } else if (cursorType === 'view') {
    ringSize = 68;
    ringBg = theme === 'dark' ? 'rgba(244, 244, 240, 0.95)' : 'rgba(10, 10, 10, 0.95)';
    ringBorder = 'transparent';
    dotScale = 0;
  } else if (cursorType === 'drag' || cursorType === 'drag-active') {
    ringSize = cursorType === 'drag-active' ? 62 : 72;
    ringBg = theme === 'dark' ? 'rgba(244, 244, 240, 0.95)' : 'rgba(10, 10, 10, 0.95)';
    ringBorder = 'transparent';
    dotScale = 0;
  } else if (cursorType === 'add') {
    ringSize = 64;
    ringBg = theme === 'dark' ? 'rgba(244, 244, 240, 0.95)' : 'rgba(10, 10, 10, 0.95)';
    ringBorder = 'transparent';
    dotScale = 0;
  } else if (cursorType === 'close') {
    ringSize = 58;
    ringBg = theme === 'dark' ? 'rgba(255, 75, 75, 0.95)' : 'rgba(220, 38, 38, 0.95)';
    ringBorder = 'transparent';
    dotScale = 0;
  } else if (cursorType === 'text') {
    ringSize = 4;
    dotScale = 0;
  }

  const textColor = theme === 'dark' ? '#080808' : '#F6F6F2';

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] select-none overflow-hidden">
      {/* Single Shared Coordinate Motion Container (Guarantees dot is 100% physically locked in center of ring) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        className="fixed top-0 left-0 pointer-events-none"
      >
        {/* Outer Ring Centered at (0,0) */}
        <div
          style={{
            width: ringSize,
            height: ringSize,
            transform: 'translate(-50%, -50%)',
            backgroundColor: ringBg,
            borderColor: ringBorder,
          }}
          className="absolute top-0 left-0 rounded-full border flex items-center justify-center backdrop-blur-[2px] transition-all duration-200"
        >
          {cursorText && (
            <span
              className="text-[9px] font-mono tracking-widest uppercase font-bold select-none text-center"
              style={{ color: textColor }}
            >
              {cursorText}
            </span>
          )}
        </div>

        {/* Center Dot Locked to Exact Center (0,0) */}
        <div
          style={{
            transform: `translate(-50%, -50%) scale(${dotScale})`,
            backgroundColor: theme === 'dark' ? '#FFFFFF' : '#000000',
          }}
          className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full transition-transform duration-100"
        />
      </motion.div>
    </div>
  );
};
