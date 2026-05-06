import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Pick Your Goal',
    body: 'Select from a vast library of AI-powered tasks. Need an email? A summary? A business plan? Just click. No guesswork required.',
    color: '#333333'
  },
  {
    number: '02',
    title: 'Customize with Clicks',
    body: 'Use our intuitive sliders and toggles to fine-tune the output. Adjust the tone, length, and style instantly—without ever typing a complex prompt.',
    color: '#555555'
  },
  {
    number: '03',
    title: 'Get Instant Results',
    body: 'Our advanced AI models infer your exact intent. Within seconds, receive professional, perfectly formatted output ready to be exported.',
    color: '#888888'
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%', // 3 heights of scrolling
          pin: true,
          scrub: 1, // Smooth scrub
        }
      });

      // Animate cards stacking
      if (cardsRef.current.length > 0) {
        // Card 1 to Card 2
        tl.to(cardsRef.current[0], { scale: 0.9, opacity: 0.5, duration: 1 })
          .fromTo(cardsRef.current[1], { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 }, '<');
          
        // Card 2 to Card 3
        tl.to(cardsRef.current[1], { scale: 0.9, opacity: 0.5, duration: 1 })
          .fromTo(cardsRef.current[2], { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 }, '<');
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="how-it-works" 
      className="relative bg-[var(--bg)] text-[var(--text)] flex items-center overflow-hidden" 
      style={{ height: '100vh' }}
    >
      {/* Animated SVG Background Lines (Duplicated from Pricing) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <svg className="absolute w-full h-[150%] top-[-25%] left-0" viewBox="0 0 1440 1000" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100,100 C300,50 500,200 1500,150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,200 C300,100 500,400 1500,300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,350 C400,200 700,500 1500,400" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,500 C400,600 600,200 1500,500" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,650 C500,400 800,800 1500,600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,800 C200,900 800,400 1500,800" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,950 C300,850 600,1000 1500,900" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          <path d="M-100,100 C300,50 500,200 1500,150" stroke="url(#how_gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '0s', animationDuration: '12s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,200 C300,100 500,400 1500,300" stroke="url(#how_gradient1)" strokeWidth="2" className="line-flow-reverse" style={{ animationDelay: '-4s', animationDuration: '18s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,350 C400,200 700,500 1500,400" stroke="url(#how_gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '-8s', animationDuration: '15s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,500 C400,600 600,200 1500,500" stroke="url(#how_gradient1)" strokeWidth="3" className="line-flow-reverse" style={{ animationDelay: '-2s', animationDuration: '22s', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))' }} />
          <path d="M-100,650 C500,400 800,800 1500,600" stroke="url(#how_gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '-11s', animationDuration: '14s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,800 C200,900 800,400 1500,800" stroke="url(#how_gradient1)" strokeWidth="2" className="line-flow-reverse" style={{ animationDelay: '-6s', animationDuration: '19s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,950 C300,850 600,1000 1500,900" stroke="url(#how_gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '-14s', animationDuration: '16s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          
          <defs>
            <linearGradient id="how_gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 flex flex-col md:flex-row h-full">
        
        {/* Left Side (Static within the pinned section) */}
        <div className="w-full md:w-5/12 flex flex-col justify-center h-full pb-10 md:pb-0 z-10">
          <span className="eyebrow mb-6 inline-flex" style={{ color: 'var(--text-2)', border: '1px solid var(--border-2)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            ◆ Workflow
          </span>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Zero Prompts. <br />
            <span style={{ color: 'var(--text-2)', fontStyle: 'italic', fontWeight: 400 }}>Infinite Power.</span>
          </h2>
          <p className="mt-8 text-lg" style={{ color: 'var(--text-2)', maxWidth: '400px', lineHeight: 1.6 }}>
            We've replaced the blinking cursor with an intuitive visual interface. Creating AI content is now as simple as filling out a modern form. Scroll to see how.
          </p>
        </div>

        {/* Right Side (Card Stack) */}
        <div className="w-full md:w-7/12 relative h-[50vh] md:h-full flex items-center justify-center perspective-1000">
          <div className="relative w-full max-w-[500px] aspect-[4/3] md:aspect-[3/4]">
            {steps.map((step, index) => (
              <Link
                to="/wizard"
                key={index} 
                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                className="absolute inset-0 p-10 rounded-3xl flex flex-col justify-between overflow-hidden block cursor-pointer" 
                style={{ 
                  background: 'var(--bg-1)', 
                  border: '1px solid var(--border)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  transformOrigin: 'top center',
                  zIndex: index + 1
                }}
              >
                {/* Background Texture */}
                <img src="/abstract_texture.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen pointer-events-none" />
                
                <div className="relative z-10">
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '4rem', fontWeight: 700, color: step.color, lineHeight: 1 }}>
                    {step.number}
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                    {step.body}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
