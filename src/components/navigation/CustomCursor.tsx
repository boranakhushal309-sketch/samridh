"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    // Easing interpolation loop for outer ring
    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      requestAnimationFrame(renderRing);
    };

    const handleHoverStart = () => setHovered(true);
    const handleHoverEnd = () => setHovered(false);

    const registerInteractions = () => {
      const clickables = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .clickable, .interactive-card'
      );
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animationId = requestAnimationFrame(renderRing);

    // Watch for dynamic DOM changes to apply hover listeners
    const observer = new MutationObserver(registerInteractions);
    observer.observe(document.body, { childList: true, subtree: true });

    registerInteractions();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor transition-transform duration-200 ${
          hovered ? 'scale-150 bg-luxury-gold' : 'scale-100 bg-luxury-white'
        }`}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring transition-all duration-200 ${
          hovered
            ? 'w-16 h-16 border-2 border-luxury-gold'
            : 'w-8 h-8 border border-luxury-gold/30'
        }`}
      />
    </>
  );
}
