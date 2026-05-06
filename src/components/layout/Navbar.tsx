import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Examples', href: '/#examples' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Animate mobile menu
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    const links = mobileMenuRef.current.querySelectorAll('.mobile-nav-link');

    if (mobileOpen) {
      gsap.fromTo(links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(20px, 5vw, 80px)',
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
          background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] mx-auto w-full h-full flex items-center justify-between">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-2 group" data-cursor="hover">
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: 'var(--text-2)',
                letterSpacing: '0.05em',
              }}
            >
              ●
            </span>
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: '1.05rem',
                letterSpacing: '-0.04em',
                color: 'var(--text)',
              }}
            >
              intuita
            </span>
          </Link>

          {/* Center links - desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link"
                onClick={(e) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                    const targetId = link.href.substring(2);
                    const el = document.getElementById(targetId);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="#"
              className="nav-link"
            >
              Sign In
            </Link>
            <Link
              to="/wizard"
              className="btn btn-primary btn-magnetic"
              data-cursor="cta"
              style={{ padding: '9px 20px' }}
            >
              Start Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                'w-5 h-[1.5px] bg-[var(--text)] transition-all duration-300',
                mobileOpen && 'rotate-45 translate-y-[6.5px]'
              )}
            />
            <span
              className={cn(
                'w-5 h-[1.5px] bg-[var(--text)] transition-all duration-300',
                mobileOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'w-5 h-[1.5px] bg-[var(--text)] transition-all duration-300',
                mobileOpen && '-rotate-45 -translate-y-[6.5px]'
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8"
          style={{ paddingTop: '64px', background: 'var(--bg)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-nav-link text-3xl font-semibold hover:text-[var(--text-2)] transition-colors"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                opacity: 0,
                color: 'var(--text)',
              }}
              onClick={(e) => {
                setMobileOpen(false);
                if (link.href.startsWith('/#')) {
                  e.preventDefault();
                  const targetId = link.href.substring(2);
                  setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 300); // Wait for menu close animation
                }
              }}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/wizard"
            className="mobile-nav-link btn btn-primary mt-4"
            style={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            Start Free →
          </Link>
        </div>
      )}
    </>
  );
}
