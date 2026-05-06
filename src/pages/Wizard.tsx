import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileText, Smartphone, ClipboardList, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { runWizard } from '../lib/api';
import toast from 'react-hot-toast';

const goalOptions = [
  { id: 'email', icon: Mail, title: 'Email', desc: 'Professional or personal emails' },
  { id: 'document', icon: FileText, title: 'Document', desc: 'Reports, memos, and docs' },
  { id: 'social post', icon: Smartphone, title: 'Social Post', desc: 'Engaging social content' },
  { id: 'summary', icon: ClipboardList, title: 'Summary', desc: 'Condense any content' },
  { id: 'other', icon: Sparkles, title: 'Other', desc: 'Custom AI generation' },
];

const purposeOptions: Record<string, { id: string; label: string }[]> = {
  email: [
    { id: 'job-application', label: 'Job Application' },
    { id: 'client-outreach', label: 'Client Outreach' },
    { id: 'thank-you', label: 'Thank You Note' },
    { id: 'follow-up', label: 'Follow Up' },
    { id: 'custom', label: 'Custom' },
  ],
  document: [
    { id: 'report', label: 'Business Report' },
    { id: 'proposal', label: 'Client Proposal' },
    { id: 'plan', label: 'Project Plan' },
    { id: 'brief', label: 'Creative Brief' },
    { id: 'custom', label: 'Custom' },
  ],
  'social post': [
    { id: 'launch', label: 'Product Launch' },
    { id: 'engagement', label: 'Engagement Post' },
    { id: 'educational', label: 'Educational' },
    { id: 'announcement', label: 'Announcement' },
    { id: 'custom', label: 'Custom' },
  ],
  summary: [
    { id: 'document', label: 'Document Summary' },
    { id: 'meeting', label: 'Meeting Notes' },
    { id: 'research', label: 'Research Summary' },
    { id: 'article', label: 'Article Digest' },
    { id: 'custom', label: 'Custom' },
  ],
  other: [
    { id: 'brainstorm', label: 'Brainstorming' },
    { id: 'outline', label: 'Outline / Structure' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'custom', label: 'Custom' },
  ],
};

const toneLabels = ['Formal', 'Professional', 'Balanced', 'Friendly', 'Casual'];

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function Wizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state as any | null;

  const { s, d } = useApp();
  const { wizard, step: currentStep, generating } = s;

  useEffect(() => {
    if (initialState?.goalType && !wizard.goalType) {
      d({ type: 'WIZARD_FIELD', k: 'goalType', v: initialState.goalType });
      if (initialState?.purpose) {
        d({ type: 'WIZARD_FIELD', k: 'purpose', v: initialState.purpose });
        d({ type: 'WIZARD_STEP', n: 2 });
      } else {
        d({ type: 'WIZARD_STEP', n: 1 });
      }
    }
  }, [initialState, wizard.goalType, d]);

  const [shakeDisabled, setShakeDisabled] = useState(false);

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const setField = (k: keyof typeof wizard, v: any) => d({ type: 'WIZARD_FIELD', k, v });

  const canContinue = useCallback(() => {
    switch (currentStep) {
      case 0: return wizard.goalType !== '';
      case 1: return wizard.purpose !== '';
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  }, [currentStep, wizard]);

  const handleContinue = async () => {
    if (!canContinue()) {
      setShakeDisabled(true);
      setTimeout(() => setShakeDisabled(false), 500);
      return;
    }
    if (currentStep < totalSteps - 1) {
      d({ type: 'WIZARD_NEXT' });
    } else {
      // Final step — generate
      d({ type: 'SET_GENERATING', v: true });
      d({ type: 'SET_ERROR', msg: null });
      try {
        const result = await runWizard(wizard);
        d({ type: 'SET_RESULT', r: result });
        toast.success('Content ready!');
        navigate('/results');
      } catch (err: any) {
        d({ type: 'SET_GENERATING', v: false });
        d({ type: 'SET_ERROR', msg: err.message });
        toast.error(err.message);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) d({ type: 'WIZARD_PREV' });
  };

  const aiHints: Record<number, string> = {
    0: 'Our AI will tailor the output format and structure for your selected type.',
    1: 'We\'ll optimize language and phrasing based on your specific use case.',
    2: 'The AI will adjust formality, word choice, and sentence structure accordingly.',
    3: 'Any extra context helps the AI personalize the result to your exact needs.',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {generating && (
        <div style={{
          position:'fixed', inset:0, zIndex:9999,
          background:'rgba(10,10,10,0.94)',
          backdropFilter:'blur(16px)',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:24,
        }}>
          <div style={{
            width:44, height:44, borderRadius:'50%',
            border:'2px solid rgba(255,255,255,0.15)',
            borderTopColor:'var(--text)',
            animation:'spin 0.75s linear infinite',
          }} />
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:'1.1rem', fontWeight:600, marginBottom:8 }}>
              Building your content
            </p>
            <p style={{ color:'var(--text-2)', fontSize:'0.875rem' }}>
              AI is thinking — takes about 5–10 seconds
            </p>
          </div>
        </div>
      )}

      {/* Progress header */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[680px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-cursor="hover">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-2)' }}>●</span>
            <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>intuita</span>
          </Link>
          <Link to="/" style={{ color: 'var(--text-3)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
            Exit
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </Link>
        </div>
        {/* Progress bar */}
        <div style={{ height: '2px', background: 'var(--bg-2)' }}>
          <motion.div style={{ height: '100%', background: 'var(--text)' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[680px]">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}>
              <span className="eyebrow mb-6 inline-flex text-xs">Step {currentStep + 1} of {totalSteps}</span>

              {/* Step 0: Goal Type */}
              {currentStep === 0 && (
                <div>
                  <h2 className="t-display" style={{ marginBottom: '0.75rem' }}>What do you want to create?</h2>
                  <p className="t-body" style={{ marginBottom: '2rem' }}>Choose the type of content. We'll handle the rest.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {goalOptions.map((opt) => (
                      <motion.button key={opt.id} onClick={() => setField('goalType', opt.id)} whileTap={{ scale: 0.97 }}
                        style={{ position: 'relative', textAlign: 'left', padding: '20px', borderRadius: 'var(--r-md)', border: `1px solid ${wizard.goalType === opt.id ? 'rgba(255,255,255,0.35)' : 'var(--border)'}`, background: wizard.goalType === opt.id ? 'var(--bg-2)' : 'var(--bg-1)', transition: 'all 0.2s', boxShadow: wizard.goalType === opt.id ? '0 0 0 1px rgba(255,255,255,0.2)' : 'none' }}>
                        <div className="flex items-start gap-3 group/icon">
                          <opt.icon size={28} className="text-[var(--text)] group-hover/icon:animate-pulse transition-all" />
                          <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{opt.title}</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginTop: '2px' }}>{opt.desc}</span>
                          </div>
                        </div>
                        {wizard.goalType === opt.id && (
                          <motion.div style={{ position: 'absolute', top: '12px', right: '12px' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Purpose */}
              {currentStep === 1 && (
                <div>
                  <h2 className="t-display" style={{ marginBottom: '0.75rem' }}>What's the purpose?</h2>
                  <p className="t-body" style={{ marginBottom: '2rem' }}>This helps our AI understand the intent behind your {wizard.goalType}.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(purposeOptions[wizard.goalType] || purposeOptions.other).map((opt) => (
                      <motion.button key={opt.id} onClick={() => setField('purpose', opt.label)} whileTap={{ scale: 0.97 }}
                        style={{ position: 'relative', textAlign: 'left', padding: '16px 20px', borderRadius: 'var(--r-md)', border: `1px solid ${wizard.purpose === opt.label ? 'rgba(255,255,255,0.35)' : 'var(--border)'}`, background: wizard.purpose === opt.label ? 'var(--bg-2)' : 'var(--bg-1)', transition: 'all 0.2s', boxShadow: wizard.purpose === opt.label ? '0 0 0 1px rgba(255,255,255,0.2)' : 'none' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{opt.label}</span>
                        {wizard.purpose === opt.label && (
                          <motion.div style={{ position: 'absolute', top: '12px', right: '12px' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Tone */}
              {currentStep === 2 && (
                <div>
                  <h2 className="t-display" style={{ marginBottom: '0.75rem' }}>Choose your tone</h2>
                  <p className="t-body" style={{ marginBottom: '2.5rem' }}>Slide to set how formal or casual the output should feel.</p>
                  <div className="mb-8">
                    <div className="relative">
                      <input type="range" min="0" max="100" value={wizard.tone} onChange={(e) => setField('tone', Number(e.target.value))} className="w-full h-2 rounded-full appearance-none"
                        style={{ background: `linear-gradient(to right, var(--text) 0%, var(--text) ${wizard.tone}%, var(--bg-2) ${wizard.tone}%, var(--bg-2) 100%)`, outline: 'none', border: 'none', padding: 0 }} />
                      <div style={{ position: 'absolute', top: '-40px', left: `${wizard.tone}%`, transform: 'translateX(-50%)', padding: '4px 12px', borderRadius: 'var(--r-md)', background: 'var(--text)', color: 'var(--text-inverse)', fontSize: '0.75rem', fontWeight: 600, pointerEvents: 'none' }}>
                        {wizard.tone}
                        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid var(--text)' }} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-3">
                      {toneLabels.map((label) => (<span key={label} className="t-label">{label}</span>))}
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
                    <span className="t-label" style={{ display: 'block', marginBottom: '8px' }}>Preview tone</span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                      {wizard.tone < 20 ? '"We would like to formally request your attention to the following matter..."' : wizard.tone < 40 ? '"I\'d like to bring to your attention an important update regarding..."' : wizard.tone < 60 ? '"Here\'s an update on where things stand with our project..."' : wizard.tone < 80 ? '"Hey! Quick update on what we\'ve been working on..."' : '"Yo! Check this out — we\'ve got some exciting news to share!"'}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Additional context */}
              {currentStep === 3 && (
                <div>
                  <h2 className="t-display" style={{ marginBottom: '0.75rem' }}>Any specific details?</h2>
                  <p className="t-body" style={{ marginBottom: '2rem' }}>Optional — add names, dates, or context to personalize the output.</p>
                  <textarea value={wizard.additionalContext} onChange={(e) => setField('additionalContext', e.target.value)} placeholder="Optional: add any specific names, dates, or context…"
                    style={{ width: '100%', height: '128px', padding: '20px', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.875rem', resize: 'none', fontFamily: "'JetBrains Mono', monospace", transition: 'border-color 0.2s' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', padding: '20px', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>Include a call to action?</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-2)', marginTop: '2px' }}>Add a CTA at the end of the generated content</span>
                    </div>
                    <button onClick={() => setField('includeCTA', !wizard.includeCTA)} style={{ position: 'relative', width: '48px', height: '26px', borderRadius: 'var(--r-full)', transition: 'background 0.3s', background: wizard.includeCTA ? 'var(--text)' : 'var(--bg-3)', border: '1px solid var(--border)' }}>
                      <motion.div style={{ position: 'absolute', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: wizard.includeCTA ? 'var(--bg)' : 'var(--text-2)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} animate={{ left: wizard.includeCTA ? '26px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* AI hint */}
          <div style={{ marginTop: '2rem', padding: '16px', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01" /></svg>
              {aiHints[currentStep]}
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10">
            <button onClick={handleBack} className={`btn btn-ghost text-sm ${currentStep === 0 ? 'invisible' : ''}`}>← Back</button>
            <motion.button onClick={handleContinue} className={`btn text-sm group ${canContinue() ? 'btn-primary btn-magnetic' : ''}`}
              style={!canContinue() ? { background: 'var(--bg-3)', color: 'var(--text-3)', opacity: 0.5, padding: '12px 26px', borderRadius: 'var(--r-full)' } : undefined}
              data-cursor="cta" animate={shakeDisabled ? { rotateZ: [0, 2, -2, 2, 0] } : {}} transition={{ duration: 0.4 }}>
              {currentStep === totalSteps - 1 ? (generating ? 'Generating…' : 'Generate →') : 'Continue →'}
              {currentStep !== totalSteps - 1 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
