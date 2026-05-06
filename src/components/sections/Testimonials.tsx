import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  { quote: "I've never been able to use AI tools before — they always expected me to know what to type. Intuita just... works. I clicked a few options and got a perfect cover letter.", name: 'Sarah M.', role: 'Marketing Manager' },
  { quote: "As a small business owner, I don't have time to learn prompt engineering. Intuita gave me a professional client proposal in literally 10 seconds.", name: 'James L.', role: 'Startup Founder' },
  { quote: "The wizard flow is genius. It felt like the AI was reading my mind. I've replaced three different writing tools with just Intuita.", name: 'Priya K.', role: 'Content Creator' },
];

const stats = [
  { value: 12, suffix: 'K+', label: 'Happy Users' },
  { value: 4.9, suffix: '', label: '★ Rating' },
  { value: 3, suffix: 's', label: 'Avg Result Time' },
  { value: 0, suffix: '', label: 'Prompts Needed', displayValue: '0' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.from(cardsRef.current.querySelectorAll('.testimonial-card'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
      }
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll('.stat-value');
        counters.forEach((counter, i) => {
          const stat = stats[i];
          if (stat.value === 0) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: stat.value, duration: 2, ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
            onUpdate: () => { counter.textContent = (stat.value % 1 !== 0 ? obj.val.toFixed(1) : Math.round(obj.val).toString()) + stat.suffix; },
          });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="eyebrow mb-6 inline-flex">◆ Testimonials</span>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'var(--text-display)', fontWeight: 700, lineHeight: 1.1 }}>
            Loved by{' '}<span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--text-2)' }}>thousands.</span>
          </h2>
        </div>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card card p-8">
              <div style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '1rem' }}>★★★★★</div>
              <p style={{ fontFamily: "'Clash Display', sans-serif", fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text)', marginBottom: '1.5rem' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `var(--bg-3)`, border: '1px solid var(--border-2)' }} />
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', display: 'block' }}>{t.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="stat-value stat-number block mb-2">{stat.displayValue || '0'}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
