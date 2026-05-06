import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  product: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Examples', href: '/#examples' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const socialIcons = [
  { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { label: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
  { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgTextRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(bgTextRef.current, { scale: 0.8, opacity: 0 }, {
        scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="section-padding relative overflow-hidden" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)' }}>
      <div 
        ref={bgTextRef} 
        style={{ 
          position: 'absolute', 
          bottom: '-2rem', 
          left: '0', 
          width: '100%',
          textAlign: 'center',
          fontFamily: "'Clash Display', sans-serif", 
          fontWeight: 700, 
          fontSize: 'clamp(80px, 18vw, 220px)', 
          letterSpacing: '-0.05em', 
          color: 'transparent', 
          WebkitTextStroke: '1px rgba(255,255,255,0.1)', 
          whiteSpace: 'nowrap', 
          pointerEvents: 'none', 
          userSelect: 'none', 
          zIndex: 0 
        }}
      >
        INTUITA
      </div>
      <div className="max-w-[1400px] mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-2)' }}>●</span>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: '1.05rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>intuita</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: '280px' }}>AI that works without prompts. Just pick what you need — we handle the rest.</p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="t-label" style={{ marginBottom: '1rem' }}>{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="link-hover" style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>© {new Date().getFullYear()} Intuita. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialIcons.map((icon) => (
              <a key={icon.label} href="#" style={{ color: 'var(--text-3)', transition: 'color 0.3s' }} aria-label={icon.label}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon.path} /></svg>
              </a>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Built with zero prompts ◆</p>
        </div>
      </div>
    </footer>
  );
}
