import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    period: 'forever',
    description: 'Perfect for trying Intuita out.',
    features: ['5 AI generations per month', 'Email & document types', 'Standard tone options', 'Copy to clipboard export'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthlyPrice: '$12',
    yearlyPrice: '$9',
    period: '/month',
    description: 'For professionals who create daily.',
    features: ['Unlimited AI generations', 'All content types', 'Advanced tone & style controls', 'PDF, Notion, & email export', 'File upload & analysis', 'Priority AI processing'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    monthlyPrice: '$29',
    yearlyPrice: '$24',
    period: '/month',
    description: 'For teams that need AI at scale.',
    features: ['Everything in Pro', 'Up to 10 team members', 'Shared template library', 'Brand voice settings', 'Admin dashboard', 'Dedicated support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isYearly, setIsYearly] = useState(true);

  useEffect(() => {
    if (!cardsRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.querySelectorAll('.pricing-card');
      gsap.fromTo(cards, 
        { y: 60, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.15, 
          duration: 1, 
          ease: 'power4.out', 
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 75%', 
            toggleActions: 'play none none none' 
          } 
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="section-padding overflow-hidden relative" style={{ minHeight: '100vh' }}>
      
      {/* Animated SVG Background Lines */}
      <style>
        {`
          @keyframes flow {
            from { stroke-dashoffset: 2000; }
            to { stroke-dashoffset: 0; }
          }
          .line-flow {
            stroke-dasharray: 200 1800;
            animation: flow 15s linear infinite;
          }
          .line-flow-reverse {
            stroke-dasharray: 300 1700;
            animation: flow 20s linear infinite reverse;
          }
        `}
      </style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
        <svg className="absolute w-full h-[150%] top-[-25%] left-0" viewBox="0 0 1440 1000" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Base faint lines to show the tracks */}
          <path d="M-100,100 C300,50 500,200 1500,150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,200 C300,100 500,400 1500,300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,350 C400,200 700,500 1500,400" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,500 C400,600 600,200 1500,500" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,650 C500,400 800,800 1500,600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,800 C200,900 800,400 1500,800" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100,950 C300,850 600,1000 1500,900" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Animated Glowing Pulses */}
          <path d="M-100,100 C300,50 500,200 1500,150" stroke="url(#gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '0s', animationDuration: '12s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,200 C300,100 500,400 1500,300" stroke="url(#gradient1)" strokeWidth="2" className="line-flow-reverse" style={{ animationDelay: '-4s', animationDuration: '18s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,350 C400,200 700,500 1500,400" stroke="url(#gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '-8s', animationDuration: '15s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,500 C400,600 600,200 1500,500" stroke="url(#gradient1)" strokeWidth="3" className="line-flow-reverse" style={{ animationDelay: '-2s', animationDuration: '22s', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))' }} />
          <path d="M-100,650 C500,400 800,800 1500,600" stroke="url(#gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '-11s', animationDuration: '14s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,800 C200,900 800,400 1500,800" stroke="url(#gradient1)" strokeWidth="2" className="line-flow-reverse" style={{ animationDelay: '-6s', animationDuration: '19s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          <path d="M-100,950 C300,850 600,1000 1500,900" stroke="url(#gradient1)" strokeWidth="2" className="line-flow" style={{ animationDelay: '-14s', animationDuration: '16s', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Background glow for pricing */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="eyebrow mb-6 inline-flex">◆ Pricing</span>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'var(--text-display)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Simple,{' '}<span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--text-2)' }}>transparent</span>{' '}pricing.
          </h2>
          <p className="t-body mb-10" style={{ maxWidth: '480px', margin: '0 auto', fontSize: '1.1rem' }}>Start free. Upgrade when you need more. No hidden fees, no surprises.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-[var(--text)]' : 'text-[var(--text-3)]'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-[var(--bg-2)] border border-[var(--border)] transition-colors duration-300 focus:outline-none"
            >
              <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--text)] transition-all duration-300 ${isYearly ? 'left-[30px]' : 'left-[3px]'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? 'text-[var(--text)]' : 'text-[var(--text-3)]'}`}>
              Annually <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-[var(--text)] text-[var(--text-inverse)] uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`pricing-card relative rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-2 ${plan.highlighted ? 'shadow-2xl' : ''}`} 
              style={{ 
                background: plan.highlighted ? 'rgba(255,255,255,0.03)' : 'var(--bg)', 
                border: plan.highlighted ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)',
                backdropFilter: plan.highlighted ? 'blur(20px)' : 'none'
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span style={{ padding: '6px 20px', background: 'var(--text)', color: 'var(--text-inverse)', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace", boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="t-title" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{plan.name}</h3>
              <p className="t-body" style={{ fontSize: '0.9rem', marginBottom: '2rem', minHeight: '44px' }}>{plan.description}</p>
              
              <div className="flex items-end gap-1 mb-8 pb-8 border-b border-[var(--border)]">
                <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '3.5rem', fontWeight: 700, color: 'var(--text)', lineHeight: 0.9 }}>
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '4px' }}>{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ fontSize: '0.95rem', color: 'var(--text-2)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" className="mt-[2px] shrink-0">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/wizard" 
                className={`btn w-full justify-center py-4 text-[0.95rem] ${plan.highlighted ? 'btn-primary btn-magnetic' : 'btn-ghost border border-[var(--border)] hover:border-[var(--border-2)]'}`} 
                data-cursor="cta"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise Bottom Banner */}
        <div className="mt-12 mb-24 p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[var(--border-2)] transition-colors">
          <div>
            <h4 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>Enterprise Custom</h4>
            <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>Need custom integrations, SLA, or on-premise deployment?</p>
          </div>
          <Link to="/contact" className="btn btn-ghost whitespace-nowrap" data-cursor="hover">Contact Sales →</Link>
        </div>

        {/* Detailed Comparison Table */}
        <div className="hidden md:block border-t border-[var(--border)] pt-20">
          <h3 className="text-center mb-12" style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '2rem', fontWeight: 600 }}>Compare Features</h3>
          
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 pb-6 border-b border-[var(--border-2)] mb-6">
              <div className="font-semibold text-[var(--text-2)] uppercase tracking-wider text-xs">Features</div>
              <div className="font-semibold text-center text-[var(--text)]">Free</div>
              <div className="font-semibold text-center text-[var(--text)] flex items-center justify-center gap-2">
                Pro <span className="px-2 py-0.5 rounded-full text-[0.55rem] font-bold bg-[var(--text)] text-[var(--text-inverse)] uppercase tracking-wider">Popular</span>
              </div>
              <div className="font-semibold text-center text-[var(--text)]">Team</div>
            </div>

            {/* Table Rows */}
            {[
              { category: 'AI Capabilities', rows: [
                { name: 'Generations per month', free: '5', pro: 'Unlimited', team: 'Unlimited' },
                { name: 'GPT-4 / Claude 3 Access', free: false, pro: true, team: true },
                { name: 'Priority Processing', free: false, pro: true, team: true },
                { name: 'Custom AI Models', free: false, freeIcon: false, pro: false, team: true },
              ]},
              { category: 'Content & Export', rows: [
                { name: 'Content Types', free: 'Basic', pro: 'All 50+', team: 'All 50+ & Custom' },
                { name: 'Export to PDF/Word', free: false, pro: true, team: true },
                { name: 'Notion Integration', free: false, pro: true, team: true },
                { name: 'API Access', free: false, pro: false, team: true },
              ]},
              { category: 'Collaboration', rows: [
                { name: 'Team Members', free: '1', pro: '1', team: 'Up to 10' },
                { name: 'Shared Templates', free: false, pro: false, team: true },
                { name: 'Brand Voice Memory', free: false, pro: '1 Voice', team: 'Unlimited' },
              ]}
            ].map((section, idx) => (
              <div key={idx} className="mb-8">
                <div className="font-medium text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">{section.category}</div>
                {section.rows.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-4 gap-4 py-3 hover:bg-[rgba(255,255,255,0.02)] rounded-lg px-2 transition-colors">
                    <div className="text-[var(--text-2)] text-sm flex items-center">{row.name}</div>
                    
                    <div className="text-center flex justify-center items-center text-sm">
                      {typeof row.free === 'boolean' 
                        ? (row.free ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg> : <span className="text-[var(--border-2)]">—</span>) 
                        : <span className="text-[var(--text-2)]">{row.free}</span>}
                    </div>
                    
                    <div className="text-center flex justify-center items-center text-sm">
                      {typeof row.pro === 'boolean' 
                        ? (row.pro ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg> : <span className="text-[var(--border-2)]">—</span>) 
                        : <span className="text-[var(--text)] font-medium">{row.pro}</span>}
                    </div>
                    
                    <div className="text-center flex justify-center items-center text-sm">
                      {typeof row.team === 'boolean' 
                        ? (row.team ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg> : <span className="text-[var(--border-2)]">—</span>) 
                        : <span className="text-[var(--text)] font-medium">{row.team}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
