import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, File, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Equalizer animation logic
  const eqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Main card stagger reveal
      const cards = gridRef.current!.querySelectorAll('.bento-card');
      gsap.from(cards, { 
        y: 80,
        opacity: 0, 
        stagger: 0.1, 
        duration: 1, 
        ease: 'power3.out', 
        scrollTrigger: { 
          trigger: gridRef.current, 
          start: 'top 85%', 
          toggleActions: 'play none none none' 
        } 
      });

      // Wizard steps stagger reveal
      const steps = gridRef.current!.querySelectorAll('.wizard-step');
      gsap.from(steps, {
        x: -20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 60%',
        }
      });

      // Equalizer custom animation
      if (eqRef.current) {
        const bars = eqRef.current.querySelectorAll('.eq-bar');
        bars.forEach((bar, i) => {
          gsap.to(bar, {
            scaleY: () => 0.2 + Math.random() * 0.8,
            duration: 0.4 + Math.random() * 0.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.1
          });
        });
      }

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="section-padding overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="eyebrow mb-6 inline-flex">◆ Features</span>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'var(--text-display)', fontWeight: 700, lineHeight: 1.1 }}>
            Built for{' '}<span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--text-2)' }}>everyone.</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-5 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1: Upload */}
          <Link to="/wizard" className="bento-card card p-8 md:col-span-3 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-2)] group relative overflow-hidden flex flex-col justify-between block cursor-pointer">
            <div>
              <h3 className="t-title mb-2">Upload Anything</h3>
              <p className="t-body text-sm mb-6 max-w-md">Drop any file — PDF, DOCX, CSV, or image — and let our AI extract, analyze, and act on the content automatically.</p>
            </div>
            <div className="relative rounded-xl border border-dashed border-[var(--border-2)] p-10 flex flex-col items-center justify-center transition-colors group-hover:bg-[rgba(255,255,255,0.02)] group-hover:border-[var(--text-3)]">
              {/* Animated SVG Drop Icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.5" className="mb-4 transition-transform group-hover:-translate-y-2 group-hover:scale-110 duration-500" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              <div className="flex flex-wrap gap-2 justify-center">
                {['PDF', 'DOCX', 'CSV', 'IMG'].map((type) => (
                  <span key={type} className="tag transition-colors group-hover:bg-[var(--text)] group-hover:text-[var(--text-inverse)]">{type}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Card 2: Wizard */}
          <Link to="/wizard" className="bento-card card p-8 md:col-span-2 md:row-span-2 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-2)] flex flex-col block cursor-pointer">
            <h3 className="t-title mb-2">Step-by-Step Wizard</h3>
            <p className="t-body text-sm mb-8">A guided flow that asks the right questions so you never have to figure out what to type.</p>
            
            <div className="space-y-4 mt-auto">
              {[
                { step: 1, label: 'Choose output type', done: true },
                { step: 2, label: 'Set your purpose', done: true },
                { step: 3, label: 'Pick a brand tone', done: false },
                { step: 4, label: 'Generate content', done: false },
              ].map((item, i) => (
                <div key={item.step} className="wizard-step flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300" style={{ background: item.done ? 'var(--bg-2)' : 'var(--bg)', border: `1px solid ${item.done ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`, transform: `translateX(${item.done ? 0 : 10}px)`, opacity: item.done ? 1 : 0.6 }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, background: item.done ? 'var(--text)' : 'var(--bg-2)', color: item.done ? 'var(--text-inverse)' : 'var(--text-3)', flexShrink: 0 }}>
                    {item.done ? '✓' : item.step}
                  </div>
                  <span style={{ color: item.done ? 'var(--text)' : 'var(--text-2)', fontWeight: item.done ? 500 : 400 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </Link>

          {/* Card 3: Instant Export */}
          <div className="bento-card card p-8 md:col-span-2 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-2)] group relative overflow-hidden">
            <img src="/feature_ui.png" alt="Node Network" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-screen transition-opacity group-hover:opacity-30 duration-700" style={{ filter: 'grayscale(100%)' }} />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="t-title mb-2">Instant Export</h3>
                <p className="t-body text-sm">Your content, your format. One-click export to PDF, Notion, or directly to your email.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 relative z-20">
                {[{ label: 'PDF', icon: FileText }, { label: 'Notion', icon: File }, { label: 'Email', icon: Mail }].map((item, idx) => (
                  <Link to="/wizard" key={item.label} className="group/btn flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--text)] transition-all cursor-pointer">
                    <item.icon size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" /><span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Zero Prompts */}
          <Link to="/wizard" className="bento-card card p-8 md:col-span-3 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-2)] flex flex-col justify-between overflow-hidden relative group block cursor-pointer">
            
            {/* Inline React/CSS Equalizer (Replaces GIF) */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#050505] to-transparent z-0 flex items-center justify-end pr-12 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div ref={eqRef} className="flex items-end gap-2 h-32">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="eq-bar w-3 bg-[var(--text)] rounded-full h-full origin-bottom" style={{ boxShadow: '0 0 15px rgba(255,255,255,0.5)' }} />
                ))}
              </div>
            </div>

            <div className="relative z-10 w-2/3">
              <h3 className="t-title mb-6" style={{ fontSize: '2rem' }}>Zero Prompts</h3>
              <p className="t-body" style={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--text)' }}>
                  No more engineering perfect prompts.
                </span>{' '}
                <span style={{ color: 'var(--text-2)' }}>
                  Just point, click, and generate. The intelligence is built directly into the UI.
                </span>
              </p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
