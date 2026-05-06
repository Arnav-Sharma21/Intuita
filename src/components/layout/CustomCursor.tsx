import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf: number;
    let isHovering = false;

    const move = (e: MouseEvent) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      if (!hasMoved) setHasMoved(true);
    };

    const tick = () => {
      const { mx, my } = pos.current;

      // Update positions
      dot.style.transform = `translate(${mx - 3.5}px, ${my - 3.5}px)`;
      
      pos.current.rx += (mx - pos.current.rx) * 0.15;
      pos.current.ry += (my - pos.current.ry) * 0.15;

      const size = isHovering ? 64 : 34;
      const offset = size / 2;
      ring.style.transform = `translate(${pos.current.rx - offset}px, ${pos.current.ry - offset}px)`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      
      // Update visibility/opacity
      if (mx !== 0 || my !== 0) {
        ring.style.opacity = isHovering ? '0.4' : '1';
        dot.style.opacity = isHovering ? '0' : '1';
      }

      raf = requestAnimationFrame(tick);
    };

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a,button,[data-hover],[data-cursor]');
      isHovering = !!el;
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf);
    };
  }, [hasMoved]);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#FFFFFF',
          mixBlendMode: 'difference' as const,
          pointerEvents: 'none' as const,
          zIndex: 100000,
          opacity: 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.65)',
          background: 'transparent',
          pointerEvents: 'none' as const,
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.3s, height 0.3s, opacity 0.3s',
        }}
      />
    </>
  );
}
