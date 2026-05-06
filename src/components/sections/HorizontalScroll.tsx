import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, FileText, Smartphone, Briefcase, BarChart3, Calendar, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  { icon: Mail, category: 'Email', title: 'Write a job application cover letter', oldWay: 'Write a detailed prompt explaining the job, your experience, the tone...', newWay: 'Choose → Done', goalType: 'email', purpose: 'Job Application' },
  { icon: FileText, category: 'Summary', title: 'Summarize this 40-page PDF report', oldWay: 'Upload to ChatGPT, copy-paste sections, ask follow-ups...', newWay: 'Upload → Done', goalType: 'summary', purpose: 'Document Summary' },
  { icon: Smartphone, category: 'Social', title: 'Create a 7-day social media plan', oldWay: 'Describe your brand, audience, goals, platform preferences...', newWay: 'Pick → Done', goalType: 'social post', purpose: 'Engagement Post' },
  { icon: Briefcase, category: 'Business', title: 'Draft a client proposal in my tone', oldWay: 'Write a prompt with all project details, scope, pricing...', newWay: 'Select → Done', goalType: 'document', purpose: 'Client Proposal' },
  { icon: BarChart3, category: 'Analysis', title: 'Analyze this CSV spreadsheet', oldWay: 'Figure out what to ask the AI about your data...', newWay: 'Upload → Done', goalType: 'other', purpose: 'Analysis' },
  { icon: Calendar, category: 'Planning', title: 'Build a business plan outline', oldWay: 'Research prompt templates, iterate 10 times...', newWay: 'Choose → Done', goalType: 'other', purpose: 'Outline / Structure' },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!trackRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const totalWidth = trackRef.current!.scrollWidth - window.innerWidth;
      gsap.to(trackRef.current, {
        x: () => -totalWidth + 'px', ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top top',
          end: () => '+=' + trackRef.current!.scrollWidth,
          scrub: 1, pin: true,
          onUpdate: (self) => setScrollProgress(self.progress),
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="examples" className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Progress bar */}
      <div className="fixed top-[60px] left-0 right-0 z-50 h-[2px]" style={{ background: 'var(--bg-2)', opacity: scrollProgress > 0 && scrollProgress < 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="h-full transition-none" style={{ background: 'var(--text)', width: `${scrollProgress * 100}%` }} />
      </div>
      {/* Section header */}
      <div className="absolute top-12 left-6 z-20">
        <span className="eyebrow mb-4 inline-flex">◆ Use Cases</span>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700 }}>What you can create</h2>
      </div>
      {/* Horizontal track */}
      <div ref={trackRef} className="flex items-center gap-6 h-screen pl-6 pr-6" style={{ paddingTop: 'clamp(80px, 12vw, 160px)', width: 'fit-content' }}>
        <div style={{ minWidth: '280px' }} />
        {useCases.map((useCase, i) => (
          <div key={i} className="card p-8 flex flex-col justify-between group" style={{ minWidth: '380px', maxWidth: '380px', height: '420px', borderRadius: '20px' }}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <useCase.icon size={24} className="text-[var(--text)] group-hover:animate-pulse" />
                <span className="t-label" style={{ color: 'var(--text-2)' }}>{useCase.category}</span>
              </div>
              <h3 className="t-title" style={{ marginBottom: '1.5rem', lineHeight: 1.3 }}>{useCase.title}</h3>
              <div className="space-y-3">
                <div style={{ padding: '1rem', borderRadius: 'var(--r-md)', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <span className="t-label" style={{ display: 'block', marginBottom: '4px' }}>Old way</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5, filter: 'blur(0.5px)' }}>{useCase.oldWay}</p>
                </div>
                <div style={{ padding: '1rem', borderRadius: 'var(--r-md)', background: 'var(--bg-2)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span className="t-label" style={{ display: 'block', marginBottom: '4px', color: 'var(--text-2)' }}>Intuita</span>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{useCase.newWay}</p>
                </div>
              </div>
            </div>
            <Link to={`/tool/${useCase.category.toLowerCase()}`} style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-2)', transition: 'color 0.2s', display: 'inline-block' }} className="hover:text-[var(--text)]">Try this →</Link>
          </div>
        ))}
        {/* High-End CTA Card */}
        <div className="flex flex-col items-center justify-center text-center rounded-[24px] p-12 relative overflow-hidden group/cta" style={{ minWidth: '400px', maxWidth: '400px', height: '420px', background: 'var(--bg-1)', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-cyan-500/10 to-transparent blur-3xl animate-[spin_15s_linear_infinite_reverse]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-[var(--text)] w-full h-full">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-2)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 group-hover/cta:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover/cta:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <Sparkles className="text-[var(--text)] w-8 h-8" />
            </div>
            
            <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '2.25rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Ready to build?</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', marginBottom: '2.5rem', fontWeight: 400 }}>Stop prompting. Start producing.</p>
            
            <Link to="/wizard" className="relative overflow-hidden rounded-full p-[2px] group/btn">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[gradientMove_3s_linear_infinite]" style={{ backgroundSize: '200% 200%' }}></span>
              <span className="relative flex items-center justify-center gap-2 bg-[var(--bg)] px-8 py-4 rounded-full font-semibold text-[var(--text)] transition-colors duration-300 group-hover/btn:bg-transparent group-hover/btn:text-white">
                Start Free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/btn:translate-x-1"><polyline points="9 18 15 12 9 6" /></svg>
              </span>
            </Link>
          </div>
          <style>{`
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
