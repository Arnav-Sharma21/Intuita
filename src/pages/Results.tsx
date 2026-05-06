import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Target, CheckCircle, RefreshCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tweakContent, runWizard, exportToPDF } from '../lib/api';
import { useTypewriter } from '../hooks/useTypewriter';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const processSteps = [
  { icon: FileText, label: 'Type' },
  { icon: Target, label: 'Tone' },
  { icon: CheckCircle, label: 'CTA' },
  { icon: RefreshCcw, label: 'Context' },
];

export default function Results() {
  const { s, d } = useApp();
  const navigate = useNavigate();
  const { result, wizard, generating, tweaking } = s;

  useEffect(() => {
    if (!result) navigate('/wizard');
  }, [result, navigate]);

  const { displayed, done, skip } = useTypewriter(result?.result || '', 10);

  if (!result) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.result);
    toast.success('Copied to clipboard!');
  };

  const handlePDF = async () => {
    try {
      toast.loading('Creating PDF…', { id: 'pdf' });
      await exportToPDF(result.result, `${result.metadata.goalType} — ${result.metadata.purpose}`, result.metadata);
      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch (err: any) {
      toast.error('PDF export failed', { id: 'pdf' });
    }
  };

  const handleTXT = () => {
    const blob = new Blob([result.result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intuita-${result.metadata.goalType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
  };

  const handleRegenerate = async () => {
    d({ type: 'SET_GENERATING', v: true });
    try {
      const fresh = await runWizard(wizard);
      d({ type: 'SET_RESULT', r: fresh });
      toast.success('Regenerated!');
    } catch (err: any) {
      d({ type: 'SET_GENERATING', v: false });
      toast.error(err.message);
    }
  };

  const handleStartOver = () => {
    d({ type: 'WIZARD_RESET' });
    d({ type: 'CLEAR' });
    navigate('/wizard');
  };

  type TweakType = 'shorter' | 'longer' | 'more_formal' | 'more_casual' | 'add_urgency' | 'simpler';

  const handleTweak = async (tweak: TweakType) => {
    d({ type: 'SET_TWEAKING', v: true });
    try {
      const res = await tweakContent(result.result, tweak);
      d({ type: 'TWEAK_RESULT', text: res.result });
      toast.success(`Applied: ${tweak.replace(/_/g, ' ')}`);
    } catch (err: any) {
      d({ type: 'SET_TWEAKING', v: false });
      toast.error(err.message);
    }
  };

  const toneLabel = result.metadata.toneLabel;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-2)' }}>●</span>
            <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>intuita</span>
          </Link>
          <button onClick={handleStartOver} style={{ fontSize: '0.875rem', color: 'var(--text-2)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}>← New Generation</button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 relative">
        {tweaking && (
          <div style={{
            position:'absolute', inset:0, zIndex:10,
            background:'rgba(10,10,10,0.7)',
            backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center',
            justifyContent:'center', borderRadius:'inherit',
            gap:12,
          }}>
            <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'var(--text)', animation:'spin 0.75s linear infinite' }} />
            <span style={{ fontSize:'0.9rem', color:'var(--text-2)' }}>Revising…</span>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left panel */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-8">
              {!generating && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--text)' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <polyline points="8,12 11,15 16,9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 24, strokeDashoffset: 0, animation: 'draw-check 0.6s ease-out forwards' }} />
                  </svg>
                </motion.div>
              )}
              <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600 }}>
                {generating ? (
                  <span className="flex items-center gap-2">Thinking
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (<span key={i} className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text)', animation: `dot-pulse 1s ease-in-out ${i * 0.3}s infinite` }} />))}
                    </span>
                  </span>
                ) : `Your ${result.metadata.goalType} is ready`}
              </h1>
            </div>

            {/* Result content */}
            <div className="relative group/result" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'clamp(24px, 4vw, 48px)', fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, color: 'var(--text)', marginBottom: '1.5rem', minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
              {generating ? (
                <div className="space-y-4">
                  {[100, 85, 92, 60, 88, 75].map((w, i) => (
                    <div key={i} className="h-3 rounded-full" style={{ background: 'var(--bg)', width: `${w}%`, animation: `skeleton-pulse 1.5s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              ) : (
                <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0">
                  <ReactMarkdown>{done ? result.result : displayed}</ReactMarkdown>
                  {!done && <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>|</span>}
                  
                  {!done && (
                    <button onClick={skip} className="absolute bottom-4 right-4 btn btn-ghost text-xs opacity-0 group-hover/result:opacity-100 transition-opacity">
                      Skip animation →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleCopy} className="btn btn-ghost text-sm" disabled={generating || tweaking}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                Copy Text
              </button>
              <button onClick={handlePDF} className="btn btn-ghost text-sm" disabled={generating || tweaking}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Download PDF
              </button>
              <button onClick={handleTXT} className="btn btn-ghost text-sm" disabled={generating || tweaking}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Download TXT
              </button>
              <button onClick={handleRegenerate} className="btn btn-ghost text-sm" disabled={generating || tweaking}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,4 23,10 17,10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
                Regenerate
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                How Intuita built this
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </h3>
              <div className="space-y-3">
                {[
                  { icon: processSteps[0].icon, text: `${processSteps[0].label}: ${result.metadata.goalType}` },
                  { icon: processSteps[1].icon, text: `${processSteps[1].label}: ${toneLabel} (${result.metadata.tone}/100)` },
                  { icon: processSteps[2].icon, text: `${processSteps[2].label}: ${result.metadata.hasCTA ? 'Included' : 'Not included'}` },
                  { icon: processSteps[3].icon, text: `${processSteps[3].label}: ${result.metadata.wordCount} words` },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--border)' }} className="group/item">
                    <item.icon size={20} className="text-[var(--text)] group-hover/item:animate-spin transition-all" />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10">
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, marginBottom: '1rem' }}>Want to tweak it?</h4>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleTweak('shorter')} disabled={generating || tweaking} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text-2)', transition: 'all 0.3s' }}>Make it shorter</button>
                  <button onClick={() => handleTweak('longer')} disabled={generating || tweaking} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text-2)', transition: 'all 0.3s' }}>Make it longer</button>
                  <button onClick={() => handleTweak('simpler')} disabled={generating || tweaking} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text-2)', transition: 'all 0.3s' }}>Make it simpler</button>
                  <button onClick={() => handleTweak('add_urgency')} disabled={generating || tweaking} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text-2)', transition: 'all 0.3s' }}>Add urgency</button>
                  <button onClick={() => handleTweak('more_formal')} disabled={generating || tweaking} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text-2)', transition: 'all 0.3s' }}>More formal</button>
                  <button onClick={() => handleTweak('more_casual')} disabled={generating || tweaking} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text-2)', transition: 'all 0.3s' }}>More casual</button>
                </div>
              </div>
              <div className="mt-10">
                <button onClick={handleStartOver} className="btn btn-primary btn-magnetic w-full justify-center text-sm" data-cursor="cta">Create Something New →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
