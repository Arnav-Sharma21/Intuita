import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface HeroProps {
  loaded: boolean;
}

export default function Hero({ loaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll('.hero-word');
      if (words) {
        gsap.fromTo(words, { y: 60, opacity: 0, rotateX: -20 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.06, duration: 0.9, ease: 'power4.out', delay: 0.2 });
      }
      gsap.fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 });
      gsap.fromTo(ctaRef.current?.children || [], { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.9 });
      gsap.fromTo(proofRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 1.1 });
    }, sectionRef);
    return () => ctx.revert();
  }, [loaded]);

  useEffect(() => {
    const handleScroll = () => setShowScrollIndicator(window.scrollY < 200);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headlineWords1 = ['Think', 'it.'];
  const headlineWords2 = ['Intuita', 'builds', 'it.'];

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center overflow-hidden" id="hero" style={{ background: 'var(--bg)' }}>
      {/* Dot grid background */}
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />
      {/* Top vignette glow — white/grey only */}
      <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '600px', background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-24 lg:pt-0">
          <div className="text-center lg:text-left">
            {/* Eyebrow badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="mb-8">
              <span className="eyebrow">◆ Zero Prompts Required</span>
            </motion.div>
            {/* Main headline */}
            <h1 ref={headlineRef} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'var(--text-hero)', fontWeight: 700, lineHeight: 1.05, perspective: '1000px', marginBottom: '1.5rem' }}>
              <span className="block">
                {headlineWords1.map((word, i) => (
                  <span key={i} className="hero-word inline-block mr-[0.25em]" style={{ opacity: 0 }}>{word}</span>
                ))}
              </span>
              <span className="block">
                {headlineWords2.map((word, i) => (
                  <span key={i} className="hero-word inline-block mr-[0.25em]" style={{ opacity: 0, ...(word === 'Intuita' ? { fontStyle: 'italic', fontWeight: 400, color: 'var(--text-2)' } : {}) }}>{word}</span>
                ))}
              </span>
            </h1>
            {/* Subheadline */}
            <p ref={subRef} className="t-body" style={{ maxWidth: '520px', margin: '0 auto 2.5rem', fontSize: '1.15rem', lineHeight: 1.6, opacity: 0 }}>
              No prompts. No templates to fill in.<br />Just pick what you need — our AI handles the rest.
            </p>
            {/* CTA row */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <Link to="/wizard" className="btn btn-primary btn-magnetic" data-cursor="cta">
                Try It Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/wizard" className="btn btn-ghost group" data-cursor="hover">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-500 group-hover:rotate-[360deg]"><polygon points="5,3 19,12 5,21" /></svg>
                Watch 60s Demo
              </Link>
            </div>
            {/* Social proof */}
            <div ref={proofRef} className="flex items-center gap-3 justify-center lg:justify-start" style={{ opacity: 0 }}>
              <div className="flex -space-x-2">
                {['#333','#555','#777','#999','#BBB'].map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2" style={{ background: bg, borderColor: 'var(--bg)', zIndex: 5 - i }} />
                ))}
              </div>
              <div className="text-sm">
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>12,000+</span>
                <span style={{ color: 'var(--text-2)' }}> users</span>
                <span className="ml-2" style={{ color: 'var(--text-2)' }}>★★★★★</span>
              </div>
            </div>
          </div>

          {/* Right: Creative Out-Of-The-Box Animation */}
          <div className="flex justify-center lg:justify-end relative w-full h-[500px] items-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/40 via-transparent to-transparent blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative w-full max-w-[480px] h-[320px]">
              {/* Complex Prompt Box */}
              <motion.div 
                animate={{ opacity: [1, 1, 0, 0, 1], scale: [1, 1, 0.9, 0.9, 1], filter: ['blur(0px)', 'blur(0px)', 'blur(10px)', 'blur(10px)', 'blur(0px)'] }} 
                transition={{ duration: 8, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
                className="absolute inset-0 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl flex flex-col justify-start overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="text-xs font-mono text-[var(--text-3)] ml-2 uppercase tracking-widest">The Old Way</span>
                </div>
                <div className="font-mono text-sm text-[var(--text-2)] leading-relaxed">
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    Act as an expert copywriter. Write a 500-word email to my client. The tone must be 70% professional and 30% friendly. Include bullet points. Do not use the words "synergy" or "leverage". Format it in markdown. Ensure the CTA is exactly at the end...
                  </motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-2 h-4 bg-[var(--text)] ml-1 align-middle"></motion.span>
                </div>
              </motion.div>

              {/* The Zero Prompt Core (Replaces the prompt) */}
              <motion.div 
                animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1, 1, 0.8] }} 
                transition={{ duration: 8, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  {/* Glowing Orbit Rings */}
                  <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute w-[300px] h-[300px] border border-[rgba(255,255,255,0.05)] rounded-full"></motion.div>
                  <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute w-[200px] h-[200px] border border-[rgba(255,255,255,0.1)] border-dashed rounded-full"></motion.div>
                  
                  {/* Core Button */}
                  <Link to="/wizard" className="relative z-20 w-32 h-32 bg-[var(--text)] rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] group cursor-pointer overflow-hidden">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 bg-white blur-xl group-hover:bg-indigo-400 transition-colors"></motion.div>
                    <span className="relative z-10 text-[var(--bg)] font-bold tracking-tight">Generate</span>
                    <span className="relative z-10 text-[var(--bg)] text-xs opacity-70">0 Prompts</span>
                  </Link>
                  
                  {/* Connecting Nodes */}
                  <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-10 left-10 px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-full text-xs text-[var(--text-2)] shadow-xl">Tone Selected</motion.div>
                  <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-10 right-10 px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-full text-xs text-[var(--text-2)] shadow-xl">Goal Defined</motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100' : 'opacity-0'}`}>
        <span className="t-label" style={{ letterSpacing: '0.3em' }}>Scroll</span>
        <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <polyline points="6,9 12,15 18,9" />
        </motion.svg>
      </div>
    </section>
  );
}
