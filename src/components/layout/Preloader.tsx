import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGGeometryElement | null)[]>([]);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgRef.current) return;

    // Calculate total length of all paths to animate stroke
    pathRefs.current.forEach(path => {
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }
    });

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onComplete();
      },
    });

    // Phase 1: Draw the SVG and increment counter
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counter.val).toString().padStart(3, '0') + '%';
        }
      },
    })
    .to(pathRefs.current, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power3.inOut',
      stagger: 0.1,
    }, '<')
    .to(bgImageRef.current, {
      scale: 1.05,
      opacity: 0.15,
      duration: 2.5,
      ease: 'power1.inOut',
    }, '<');

    // Phase 2: Fill shape, flash, and scale to infinity to reveal site
    tl.to(pathRefs.current, {
      fill: 'var(--text)',
      strokeWidth: 0,
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(counterRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, '<')
    .to(svgRef.current, {
      scale: 30, // Massive scale to cover and reveal
      opacity: 0,
      duration: 0.8,
      ease: 'expo.inOut',
    }, '+=0.1')
    .to(container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.4');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: '#0A0A0A', // Pure brutalist black
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        overflow: 'hidden',
      }}
    >
      {/* Background Texture for premium feel */}
      <img 
        ref={bgImageRef}
        src="/abstract_texture.png" 
        alt="" 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Isometric Cube Logo SVG */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <svg 
          ref={svgRef}
          width="120" 
          height="120" 
          viewBox="0 0 100 100" 
          fill="transparent" 
          stroke="#F5F4F0" 
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transformOrigin: 'center' }}
        >
          {/* Hexagon Outline */}
          <polygon 
            ref={el => pathRefs.current[0] = el}
            points="50,10 90,30 90,70 50,90 10,70 10,30" 
          />
          {/* Inner Lines to create 3D Cube */}
          <line ref={el => pathRefs.current[1] = el} x1="10" y1="30" x2="50" y2="50" />
          <line ref={el => pathRefs.current[2] = el} x1="90" y1="30" x2="50" y2="50" />
          <line ref={el => pathRefs.current[3] = el} x1="50" y1="90" x2="50" y2="50" />
        </svg>

        {/* Counter */}
        <span 
          ref={counterRef}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1rem',
            color: '#F5F4F0',
            letterSpacing: '0.2em',
            marginTop: '2rem',
            position: 'absolute',
            bottom: '-60px'
          }}
        >
          000%
        </span>
      </div>
    </div>
  );
}
